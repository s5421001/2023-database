document.addEventListener("DOMContentLoaded", function () {
    // Open or create the IndexedDB database
    const dbName = 'lolCompatibilityDB';
    const dbVersion = 1;
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Create an object store (table) named 'compatibility'
        const compatibilityStore = db.createObjectStore('compatibility', { keyPath: 'id', autoIncrement: true });
        compatibilityStore.createIndex('yourChampion', 'yourChampion', { unique: false });
        compatibilityStore.createIndex('opponentChampion', 'opponentChampion', { unique: false });
    };

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Champions
        const championDropdown = document.getElementById('championDropdown');
        const opponentDropdown = document.getElementById('opponentDropdown');

        readChampionNames();

        // Compatibility Bar
        const compatibilityBar = document.getElementById('compatibilityBar');
        const indicator = document.getElementById('indicator');
        const ratioDisplay = document.getElementById('compatibilityRatio');

        compatibilityBar.addEventListener('mousedown', startDrag);

        // Save Data Form
        const dataForm = document.getElementById('dataForm');
        dataForm.addEventListener('submit', saveData);

        // Buttons
        const registerCompatibilityBtn = document.getElementById('registerCompatibilityBtn');
        const viewDataBtn = document.getElementById('viewDataBtn');

        registerCompatibilityBtn.addEventListener('click', switchToRegister);
        viewDataBtn.addEventListener('click', switchToData);

        // Data View
        const dataView = document.getElementById('dataView');
        const compatibilityList = document.getElementById('compatibilityList');

        function switchToRegister() {
            dataView.style.display = 'none';
            dataForm.style.display = 'block';
        }

        function switchToData() {
            dataForm.style.display = 'none';
            dataView.style.display = 'block';
            updateCompatibilityTable();
        }

        function updateCompatibilityTable() {
            const transaction = db.transaction(['compatibility'], 'readonly');
            const compatibilityStore = transaction.objectStore('compatibility');
            const request = compatibilityStore.openCursor();

            // Clear existing rows
            compatibilityList.innerHTML = '';

            request.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    const data = cursor.value;

                    const row = compatibilityList.insertRow();
                    row.insertCell(0).textContent = data.yourChampion;
                    row.insertCell(1).textContent = data.opponentChampion;
                    row.insertCell(2).textContent = data.compatibility;
                    row.insertCell(3).textContent = data.push ? '〇' : '×';
                    row.insertCell(4).textContent = data.firstTouch ? '〇' : '×';

                    cursor.continue();
                }
            };
        }

        function startDrag(e) {
            e.preventDefault();
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', endDrag);
        }

        function drag(e) {
            const rect = compatibilityBar.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const percentage = (offsetX / rect.width) * 100;

            updateCompatibilityBar(percentage);
        }

        function endDrag() {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
        }

        function updateCompatibilityBar(percentage) {
            const clampedPercentage = Math.max(0, Math.min(100, percentage));
            const ratio = Math.round(clampedPercentage / 10);

            indicator.style.width = `${clampedPercentage}%`;
            ratioDisplay.textContent = `${ratio}:${10 - ratio}`;
        }

        function saveData(e) {
            e.preventDefault();

            const yourChampion = championDropdown.value;
            const opponentChampion = opponentDropdown.value;
            const compatibilityRatio = ratioDisplay.textContent;
            const push = document.getElementById('pushCheckbox').checked;
            const firstTouch = document.getElementById('firstTouchCheckbox').checked;

            const transaction = db.transaction(['compatibility'], 'readwrite');
            const compatibilityStore = transaction.objectStore('compatibility');

            // Save data to IndexedDB
            const compatibilityData = {
                yourChampion: yourChampion,
                opponentChampion: opponentChampion,
                compatibility: compatibilityRatio,
                push: push,
                firstTouch: firstTouch,
            };

            const addRequest = compatibilityStore.add(compatibilityData);

            addRequest.onsuccess = function () {
                console.log('Data added to IndexedDB');
                updateCompatibilityTable(); // Refresh the table after adding new data
            };

            addRequest.onerror = function (error) {
                console.error('Error adding data to IndexedDB:', error);
            };

            // Clear form fields
            dataForm.reset();
        }

        function getChampionNames() {
            // TODO: Read champion names from champ.txt and populate the dropdown lists
            // For now, using a placeholder array
            return ['ヤスオ',
            'ヨネ',
            'アカリ',
            'サイラス',
            'フェイ',
            'ゼド',
            'フィズ',
            'アーリ',
            'シンドラ',
            'カタリナ',
            'オリアナ',
            'ベイガー',
            'ルブラン',
            'マルザハール',
            'ラックス',
            'ヴェックス',
            'ツイステッド・フェイト',
            'イレリア',
            'タロン',
            'ゼラス',
            'ブラッドミア',
            'ビクター',
            'エコー',
            'リサンドラ',
            'アジール',
            'ニーコ',
            'パンテオン',
            'ジェイス',
            'カサディン',
            'ガリオ',
            'ゾーイ',
            'オレリオン・ソル',
            'ダイアナ',
            'アクシャン',
            'キヤナ',
            'アニビア',
            'ナフィーリ',
            'ライズ',
            'アニー',
            'カシオペア',
            'ブランド',
            'スウェイン',
            'マルファイト',
            'ジグス',
            'トリスターナ',
            'ヴェル＝コズ',
            'コーキ',
            'ハイマーディンガー',
            'タリヤ',
            'エズリアル'
            ];
        }

        function readChampionNames() {
            // TODO: Read champion names from champ.txt and populate the dropdown lists
            // For now, using a placeholder array
            const championNames = ['ヤスオ',
            'ヨネ',
            'アカリ',
            'サイラス',
            'フェイ',
            'ゼド',
            'フィズ',
            'アーリ',
            'シンドラ',
            'カタリナ',
            'オリアナ',
            'ベイガー',
            'ルブラン',
            'マルザハール',
            'ラックス',
            'ヴェックス',
            'ツイステッド・フェイト',
            'イレリア',
            'タロン',
            'ゼラス',
            'ブラッドミア',
            'ビクター',
            'エコー',
            'リサンドラ',
            'アジール',
            'ニーコ',
            'パンテオン',
            'ジェイス',
            'カサディン',
            'ガリオ',
            'ゾーイ',
            'オレリオン・ソル',
            'ダイアナ',
            'アクシャン',
            'キヤナ',
            'アニビア',
            'ナフィーリ',
            'ライズ',
            'アニー',
            'カシオペア',
            'ブランド',
            'スウェイン',
            'マルファイト',
            'ジグス',
            'トリスターナ',
            'ヴェル＝コズ',
            'コーキ',
            'ハイマーディンガー',
            'タリヤ',
            'エズリアル'
            ];
            populateDropdown(championDropdown, championNames);
            populateDropdown(opponentDropdown, championNames);
        }

        function populateDropdown(dropdown, championNames) {
            dropdown.innerHTML = '';

            championNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                dropdown.appendChild(option);
            });
        }

    };

    request.onerror = function (event) {
        console.error('Error opening IndexedDB:', event.target.error);
    };
});
