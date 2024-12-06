document.addEventListener("DOMContentLoaded", () => {
    const missionList = document.getElementById("mission-list");
    const coinCountDisplay = document.getElementById("coin-count");
    const newMissionTitle = document.getElementById("new-mission-title");
    const addMissionButton = document.getElementById("add-mission-button");

    let gameCoins = parseInt(localStorage.getItem("gameCoins")) || 0;
    let missions = JSON.parse(localStorage.getItem("missions")) || [];

    // 初期コイン表示
    coinCountDisplay.textContent = gameCoins;

    // タスク一覧をレンダリングする関数
    const renderMissions = () => {
        missionList.innerHTML = ""; // 一旦リストをクリア

        missions.forEach((mission) => {
            const listItem = document.createElement("li");
            listItem.classList.add("mission-item");
            listItem.innerHTML = `
                <span>${mission.title}</span>
                <select data-id="${mission.id}" class="difficulty-select">
                    <option value="">set difficulty</option>
                    <option value="Easy" ${
                        mission.difficulty === "Easy" ? "selected" : ""
                    }>Easy (10 Coins)</option>
                    <option value="Normal" ${
                        mission.difficulty === "Normal" ? "selected" : ""
                    }>Normal (30 Coins)</option>
                    <option value="Hard" ${
                        mission.difficulty === "Hard" ? "selected" : ""
                    }>Hard (50 Coins)</option>
                </select>
                <button data-id="${mission.id}" class="complete-button" ${
                mission.difficulty ? "" : "disabled"
            }>Complete</button>
            `;

            missionList.appendChild(listItem);
        });
    };

    // タスク完了処理
    missionList.addEventListener("click", (event) => {
        const missionId = parseInt(event.target.getAttribute("data-id"));
        const missionIndex = missions.findIndex((m) => m.id === missionId);

        if (event.target.classList.contains("complete-button")) {
            const completedMission = missions.splice(missionIndex, 1)[0];
            const reward =
                completedMission.difficulty === "Easy"
                    ? 10
                    : completedMission.difficulty === "Normal"
                    ? 30
                    : 50;

            gameCoins += reward; // 難易度に応じたコインを加算
            alert(`Task "${completedMission.title}" completed! 🎉 You earned ${reward} coins.`);

            // データ保存
            localStorage.setItem("gameCoins", gameCoins);
            localStorage.setItem("missions", JSON.stringify(missions));

            // 更新
            coinCountDisplay.textContent = gameCoins;
            renderMissions();
        }
    });

    // 難易度設定処理
    missionList.addEventListener("change", (event) => {
        if (event.target.classList.contains("difficulty-select")) {
            const missionId = parseInt(event.target.getAttribute("data-id"));
            const missionIndex = missions.findIndex((m) => m.id === missionId);
            const difficulty = event.target.value;

            missions[missionIndex].difficulty = difficulty;

            // データ保存
            localStorage.setItem("missions", JSON.stringify(missions));
            renderMissions();
        }
    });

    // 新しいタスク追加処理
    addMissionButton.addEventListener("click", () => {
        const title = newMissionTitle.value.trim();

        if (title) {
            const newMission = {
                id: Date.now(),
                title: title,
                difficulty: null, // 初期状態では難易度未設定
            };

            missions.push(newMission);

            // データ保存
            localStorage.setItem("missions", JSON.stringify(missions));

            // 更新
            renderMissions();

            // 入力フィールドをクリア
            newMissionTitle.value = "";
        } else {
            alert("Please enter a valid mission title.");
        }
    });

    // 初期表示
    renderMissions();
});
