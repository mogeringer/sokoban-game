// ゲームの定数
const GAME_CONSTANTS = {
    // セル関連
    CELL_SIZE: 40,
    // シンボル
    SYMBOLS: {
        PLAYER: 'P',
        BOX: 'B',
        GOAL: 'G',
        BOX_ON_GOAL: 'GB',
        PLAYER_ON_GOAL: 'PG'
    },
    // メッセージ
    MESSAGES: {
        CLEAR: 'クリア！おめでとうございます！',
        ALL_CLEAR: '全ステージクリア！おめでとうございます！'
    },
    // ゲーム設定
    SETTINGS: {
        NEXT_LEVEL_DELAY: 1000,
        MAX_UNDO_COUNT: 2,
        TIMER_INTERVAL: 1000 // タイマーの更新間隔（ミリ秒）
    }
};

// 方向の定数
const DIRECTIONS = {
    UP: { dx: 0, dy: -1 },
    DOWN: { dx: 0, dy: 1 },
    LEFT: { dx: -1, dy: 0 },
    RIGHT: { dx: 1, dy: 0 }
};

class SokobanGame {
    constructor() {
        this.initializeElements();
        this.initializeGameState();
        this.initializeEventListeners();
    }

    // 初期化関連
    initializeElements() {
        this.board = document.getElementById('game-board');
        this.message = document.getElementById('message');
        this.resetButton = document.getElementById('reset');
        this.undoButton = document.getElementById('undo');
        this.currentStageDisplay = document.getElementById('current-stage');
        this.titleScreen = document.getElementById('title-screen');
        this.startButton = document.getElementById('start-button');
        this.gameContainer = document.querySelector('.game-container');
        this.undoCountDisplay = document.getElementById('undo-count');
        this.restartButton = document.getElementById('restart');
        this.timerDisplay = document.getElementById('timer');
        
        // タッチ操作のための要素
        this.upButton = document.getElementById('up');
        this.downButton = document.getElementById('down');
        this.leftButton = document.getElementById('left');
        this.rightButton = document.getElementById('right');
    }

    initializeGameState() {
        this.levels = this.createLevels();
        this.initialLevels = JSON.parse(JSON.stringify(this.levels));
        this.currentLevel = 0;
        this.history = [];
        this.undoCount = GAME_CONSTANTS.SETTINGS.MAX_UNDO_COUNT;
        this.startTime = null;
        this.timerInterval = null;
        this.elapsedTime = 0;
        this.updateUndoCountDisplay();
        this.initializeLevels();
    }

    initializeEventListeners() {
        this.resetButton.addEventListener('click', () => this.resetLevel());
        this.undoButton.addEventListener('click', () => this.undo());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());

        // タッチ操作のイベントリスナー
        this.upButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleDirection(DIRECTIONS.UP);
        });
        this.downButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleDirection(DIRECTIONS.DOWN);
        });
        this.leftButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleDirection(DIRECTIONS.LEFT);
        });
        this.rightButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleDirection(DIRECTIONS.RIGHT);
        });

        // クリックイベントも残す（デスクトップ用）
        this.upButton.addEventListener('click', () => this.handleDirection(DIRECTIONS.UP));
        this.downButton.addEventListener('click', () => this.handleDirection(DIRECTIONS.DOWN));
        this.leftButton.addEventListener('click', () => this.handleDirection(DIRECTIONS.LEFT));
        this.rightButton.addEventListener('click', () => this.handleDirection(DIRECTIONS.RIGHT));
    }

    // ゲーム制御
    startGame() {
        this.titleScreen.style.display = 'none';
        this.gameContainer.style.display = 'block';
        this.loadLevel(0);
        this.startTimer();
    }

    createLevels() {
        return [
            this.createLevel1(),
            this.createLevel2(),
            this.createLevel3(),
            this.createLevel4(),
            this.createLevel5(),
            this.createLevel6(),
            this.createLevel7(),
            this.createLevel8(),
            this.createLevel9(),
            this.createLevel10()
        ];
    }

    createBaseLevel(width, height) {
        return {
            width,
            height,
            player: { x: 1, y: 1 },
            boxes: [],
            goals: [],
            walls: []
        };
    }

    addSurroundingWalls(level) {
        for (let x = 0; x < level.width; x++) {
            level.walls.push({ x, y: 0 });
            level.walls.push({ x, y: level.height - 1 });
        }
        for (let y = 1; y < level.height - 1; y++) {
            level.walls.push({ x: 0, y });
            level.walls.push({ x: level.width - 1, y });
        }
    }

    createLevel1() {
        const level = this.createBaseLevel(10, 10);
        this.addSurroundingWalls(level);
        
        level.boxes.push({ x: 2, y: 2 });
        level.goals.push({ x: 8, y: 8 });

        return level;
    }

    createLevel2() {
        const level = this.createBaseLevel(10, 10);
        this.addSurroundingWalls(level);

        level.walls.push(
            { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }
        );

        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 3, y: 2 });
        level.goals.push({ x: 7, y: 7 });
        level.goals.push({ x: 8, y: 8 });

        return level;
    }

    createLevel3() {
        const level = this.createBaseLevel(10, 10);
        this.addSurroundingWalls(level);

        level.walls.push(
            { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
            { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }
        );

        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 3 });
        level.boxes.push({ x: 2, y: 4 });
        level.goals.push({ x: 7, y: 6 });
        level.goals.push({ x: 7, y: 7 });
        level.goals.push({ x: 7, y: 8 });

        return level;
    }

    createLevel4() {
        const level = this.createBaseLevel(10, 10);
        this.addSurroundingWalls(level);

        level.walls.push(
            { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 },
            { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
            { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 },
            { x: 7, y: 6 }, { x: 7, y: 7 },
            { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }
        );

        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 3 });
        level.boxes.push({ x: 2, y: 4 });
        level.boxes.push({ x: 3, y: 2 });
        level.goals.push({ x: 6, y: 2 });
        level.goals.push({ x: 6, y: 3 });
        level.goals.push({ x: 6, y: 4 });
        level.goals.push({ x: 8, y: 8 });

        return level;
    }

    createLevel5() {
        const level = this.createBaseLevel(12, 12);
        this.addSurroundingWalls(level);

        level.walls.push(
            { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
            { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 },
            { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 },
            { x: 8, y: 6 }, { x: 8, y: 7 },
            { x: 2, y: 8 }, { x: 3, y: 8 }
        );

        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 3 });
        level.boxes.push({ x: 2, y: 4 });
        level.boxes.push({ x: 3, y: 2 });
        level.goals.push({ x: 7, y: 2 });
        level.goals.push({ x: 7, y: 3 });
        level.goals.push({ x: 7, y: 4 });
        level.goals.push({ x: 9, y: 9 });

        return level;
    }

    createLevel6() {
        const level = this.createBaseLevel(14, 14);
        this.addSurroundingWalls(level);

        // 中央に十字型の壁を配置
        for (let x = 4; x <= 9; x++) {
            level.walls.push({ x, y: 6 });
        }
        for (let y = 4; y <= 9; y++) {
            level.walls.push({ x: 6, y });
        }

        // 箱を配置（3つの箱）
        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 11 });
        level.boxes.push({ x: 11, y: 2 });

        // ゴールを配置（3つのゴール）
        level.goals.push({ x: 11, y: 11 });
        level.goals.push({ x: 2, y: 6 });
        level.goals.push({ x: 11, y: 6 });

        return level;
    }

    createLevel7() {
        const level = this.createBaseLevel(16, 16);
        this.addSurroundingWalls(level);

        // 迷路のような壁の配置
        level.walls.push(
            { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 },
            { x: 4, y: 5 }, { x: 6, y: 5 },
            { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
            { x: 9, y: 4 }, { x: 10, y: 4 }, { x: 11, y: 4 },
            { x: 9, y: 5 }, { x: 11, y: 5 },
            { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 },
            { x: 7, y: 8 }, { x: 8, y: 8 },
            { x: 7, y: 9 }, { x: 8, y: 9 }
        );

        // 箱を配置（4つの箱）
        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 13 });
        level.boxes.push({ x: 13, y: 2 });
        level.boxes.push({ x: 13, y: 13 });

        // ゴールを配置（4つのゴール）
        level.goals.push({ x: 7, y: 7 });
        level.goals.push({ x: 8, y: 7 });
        level.goals.push({ x: 7, y: 10 });
        level.goals.push({ x: 8, y: 10 });

        // プレイヤーの初期位置を設定
        level.player = { x: 3, y: 3 };

        return level;
    }

    createLevel8() {
        const level = this.createBaseLevel(18, 18);
        this.addSurroundingWalls(level);

        // 複雑な壁の配置
        level.walls.push(
            { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 },
            { x: 4, y: 5 }, { x: 6, y: 5 },
            { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
            { x: 11, y: 4 }, { x: 12, y: 4 }, { x: 13, y: 4 },
            { x: 11, y: 5 }, { x: 13, y: 5 },
            { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 },
            { x: 7, y: 8 }, { x: 8, y: 8 }, { x: 9, y: 8 }, { x: 10, y: 8 },
            { x: 7, y: 9 }, { x: 10, y: 9 },
            { x: 7, y: 10 }, { x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 }
        );

        // 箱を配置（5つの箱）
        level.boxes.push({ x: 3, y: 3 });
        level.boxes.push({ x: 3, y: 14 });
        level.boxes.push({ x: 14, y: 3 });
        level.boxes.push({ x: 14, y: 14 });
        level.boxes.push({ x: 8, y: 8 });

        // ゴールを配置（5つのゴール）
        level.goals.push({ x: 7, y: 7 });
        level.goals.push({ x: 10, y: 7 });
        level.goals.push({ x: 7, y: 11 });
        level.goals.push({ x: 10, y: 11 });
        level.goals.push({ x: 8, y: 9 });

        // プレイヤーの初期位置を設定
        level.player = { x: 2, y: 2 };

        return level;
    }

    createLevel9() {
        const level = this.createBaseLevel(20, 20);
        this.addSurroundingWalls(level);

        // より複雑な迷路の配置
        level.walls.push(
            { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
            { x: 4, y: 5 }, { x: 7, y: 5 },
            { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 },
            { x: 12, y: 4 }, { x: 13, y: 4 }, { x: 14, y: 4 }, { x: 15, y: 4 },
            { x: 12, y: 5 }, { x: 15, y: 5 },
            { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 }, { x: 15, y: 6 },
            { x: 8, y: 8 }, { x: 9, y: 8 }, { x: 10, y: 8 }, { x: 11, y: 8 },
            { x: 8, y: 9 }, { x: 11, y: 9 },
            { x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 10 },
            { x: 6, y: 12 }, { x: 7, y: 12 }, { x: 8, y: 12 }, { x: 9, y: 12 },
            { x: 6, y: 13 }, { x: 9, y: 13 },
            { x: 6, y: 14 }, { x: 7, y: 14 }, { x: 8, y: 14 }, { x: 9, y: 14 }
        );

        // 箱を配置（6つの箱）
        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 17 });
        level.boxes.push({ x: 17, y: 2 });
        level.boxes.push({ x: 17, y: 17 });
        level.boxes.push({ x: 9, y: 9 });
        level.boxes.push({ x: 10, y: 9 });

        // ゴールを配置（6つのゴール）
        level.goals.push({ x: 7, y: 7 });
        level.goals.push({ x: 12, y: 7 });
        level.goals.push({ x: 7, y: 12 });
        level.goals.push({ x: 12, y: 12 });
        level.goals.push({ x: 9, y: 11 });
        level.goals.push({ x: 10, y: 11 });

        return level;
    }

    createLevel10() {
        const level = this.createBaseLevel(22, 22);
        this.addSurroundingWalls(level);

        // 最も複雑な迷路の配置
        level.walls.push(
            { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 },
            { x: 4, y: 5 }, { x: 8, y: 5 },
            { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 },
            { x: 13, y: 4 }, { x: 14, y: 4 }, { x: 15, y: 4 }, { x: 16, y: 4 }, { x: 17, y: 4 },
            { x: 13, y: 5 }, { x: 17, y: 5 },
            { x: 13, y: 6 }, { x: 14, y: 6 }, { x: 15, y: 6 }, { x: 16, y: 6 }, { x: 17, y: 6 },
            { x: 9, y: 8 }, { x: 10, y: 8 }, { x: 11, y: 8 }, { x: 12, y: 8 },
            { x: 9, y: 9 }, { x: 12, y: 9 },
            { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 10 }, { x: 12, y: 10 },
            { x: 6, y: 12 }, { x: 7, y: 12 }, { x: 8, y: 12 }, { x: 9, y: 12 },
            { x: 6, y: 13 }, { x: 9, y: 13 },
            { x: 6, y: 14 }, { x: 7, y: 14 }, { x: 8, y: 14 }, { x: 9, y: 14 },
            { x: 12, y: 12 }, { x: 13, y: 12 }, { x: 14, y: 12 }, { x: 15, y: 12 },
            { x: 12, y: 13 }, { x: 15, y: 13 },
            { x: 12, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 14 }, { x: 15, y: 14 }
        );

        // 箱を配置（7つの箱）
        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 19 });
        level.boxes.push({ x: 19, y: 2 });
        level.boxes.push({ x: 19, y: 19 });
        level.boxes.push({ x: 10, y: 10 });
        level.boxes.push({ x: 11, y: 10 });
        level.boxes.push({ x: 10, y: 11 });

        // ゴールを配置（7つのゴール）
        level.goals.push({ x: 7, y: 7 });
        level.goals.push({ x: 14, y: 7 });
        level.goals.push({ x: 7, y: 14 });
        level.goals.push({ x: 14, y: 14 });
        level.goals.push({ x: 10, y: 13 });
        level.goals.push({ x: 11, y: 13 });
        level.goals.push({ x: 10, y: 14 });

        return level;
    }

    loadLevel(levelIndex) {
        this.currentLevel = levelIndex;
        this.history = [];
        this.undoCount = GAME_CONSTANTS.SETTINGS.MAX_UNDO_COUNT;
        this.updateUndoCountDisplay();
        this.updateStageDisplay();
        this.clearMessage();
        this.render();
    }

    resetLevel() {
        this.levels[this.currentLevel] = JSON.parse(JSON.stringify(this.initialLevels[this.currentLevel]));
        this.history = [];
        this.undoCount = GAME_CONSTANTS.SETTINGS.MAX_UNDO_COUNT;
        this.updateUndoCountDisplay();
        this.updateStageDisplay();
        this.clearMessage();
        this.render();
    }

    restartGame() {
        this.levels = JSON.parse(JSON.stringify(this.initialLevels));
        this.currentLevel = 0;
        this.history = [];
        this.undoCount = GAME_CONSTANTS.SETTINGS.MAX_UNDO_COUNT;
        this.updateUndoCountDisplay();
        this.updateStageDisplay();
        this.clearMessage();
        this.stopTimer();
        
        // ゲームコンテナを非表示にし、タイトル画面を表示
        this.gameContainer.style.display = 'none';
        this.titleScreen.style.display = 'flex';
    }

    // プレイヤー操作
    handleKeyPress(e) {
        const direction = this.getDirectionFromKey(e.key);
        if (!direction) return;

        const level = this.levels[this.currentLevel];
        const newX = level.player.x + direction.dx;
        const newY = level.player.y + direction.dy;

        if (this.isValidMove(newX, newY)) {
            this.saveCurrentState();
            this.movePlayer(newX, newY);
            this.render();
            this.checkWin();
        }
    }

    getDirectionFromKey(key) {
        return DIRECTIONS[key.replace('Arrow', '').toUpperCase()] || null;
    }

    movePlayer(newX, newY) {
        const level = this.levels[this.currentLevel];
        const boxIndex = this.findBoxAt(newX, newY);
        
        if (boxIndex !== -1) {
            this.moveBox(boxIndex, newX, newY);
        }
        
        level.player.x = newX;
        level.player.y = newY;
    }

    // 箱の操作
    findBoxAt(x, y) {
        return this.levels[this.currentLevel].boxes.findIndex(box => box.x === x && box.y === y);
    }

    moveBox(boxIndex, playerX, playerY) {
        const level = this.levels[this.currentLevel];
        const box = level.boxes[boxIndex];
        const dx = playerX - level.player.x;
        const dy = playerY - level.player.y;
        
        box.x += dx;
        box.y += dy;
    }

    // 移動の検証
    isValidMove(x, y) {
        const level = this.levels[this.currentLevel];
        
        if (this.isWall(x, y)) return false;
        
        const boxIndex = this.findBoxAt(x, y);
        if (boxIndex !== -1) {
            return this.canMoveBox(boxIndex, x, y);
        }
        
        return true;
    }

    isWall(x, y) {
        return this.levels[this.currentLevel].walls.some(wall => wall.x === x && wall.y === y);
    }

    canMoveBox(boxIndex, playerX, playerY) {
        const level = this.levels[this.currentLevel];
        const box = level.boxes[boxIndex];
        const dx = playerX - level.player.x;
        const dy = playerY - level.player.y;
        const newBoxX = box.x + dx;
        const newBoxY = box.y + dy;
        
        return !this.isWall(newBoxX, newBoxY) && 
               !this.isBoxAt(newBoxX, newBoxY);
    }

    isBoxAt(x, y) {
        return this.levels[this.currentLevel].boxes.some(box => box.x === x && box.y === y);
    }

    // 状態管理
    saveCurrentState() {
        this.history.push(JSON.parse(JSON.stringify(this.levels[this.currentLevel])));
    }

    undo() {
        if (this.history.length > 0 && this.undoCount > 0) {
            const previousState = this.history.pop();
            this.levels[this.currentLevel] = previousState;
            this.undoCount--;
            this.updateUndoCountDisplay();
            this.render();
        }
    }

    // 表示更新
    updateUndoCountDisplay() {
        this.undoCountDisplay.textContent = `残り回数: ${this.undoCount}`;
    }

    updateStageDisplay() {
        this.currentStageDisplay.textContent = `ステージ: ${this.currentLevel + 1}`;
    }

    clearMessage() {
        this.message.textContent = '';
    }

    // クリア判定
    checkWin() {
        const level = this.levels[this.currentLevel];
        const allBoxesOnGoals = level.boxes.every(box => 
            level.goals.some(goal => goal.x === box.x && goal.y === box.y)
        );
        
        if (allBoxesOnGoals) {
            this.showClearMessage();
            this.proceedToNextLevel();
        }
    }

    showClearMessage() {
        const level = this.currentLevel + 1;
        let message = '';
        
        switch(level) {
            case 1:
                message = 'ステージ1クリア！\nすべての箱をゴールに運びました。';
                break;
            case 2:
                message = 'ステージ2クリア！\n2つの箱をゴールに運びました。';
                break;
            case 3:
                message = 'ステージ3クリア！\n3つの箱をゴールに運びました。';
                break;
            case 4:
                message = 'ステージ4クリア！\n4つの箱をゴールに運びました。';
                break;
            case 5:
                message = 'ステージ5クリア！\n5つの箱をゴールに運びました。';
                break;
            case 6:
                message = 'ステージ6クリア！\n3つの箱をゴールに運びました。';
                break;
            case 7:
                message = 'ステージ7クリア！\n4つの箱をゴールに運びました。';
                break;
            case 8:
                message = 'ステージ8クリア！\n5つの箱をゴールに運びました。';
                break;
            case 9:
                message = 'ステージ9クリア！\n6つの箱をゴールに運びました。';
                break;
            case 10:
                message = GAME_CONSTANTS.MESSAGES.ALL_CLEAR;
                break;
        }
        
        this.message.textContent = message;
    }

    proceedToNextLevel() {
        setTimeout(() => {
            if (this.currentLevel < this.levels.length - 1) {
                const nextLevel = this.currentLevel + 1;
                // ステージ5をクリアした時（currentLevelが4の時）にタイマーを停止
                if (this.currentLevel === 4) {
                    this.stopTimer();
                }
                this.loadLevel(nextLevel);
            } else {
                this.message.textContent = GAME_CONSTANTS.MESSAGES.ALL_CLEAR;
            }
        }, GAME_CONSTANTS.SETTINGS.NEXT_LEVEL_DELAY);
    }

    // レンダリング
    render() {
        this.clearBoard();
        this.setupBoardGrid();
        this.renderCells();
        this.centerOnPlayer();
    }

    clearBoard() {
        this.board.innerHTML = '';
    }

    setupBoardGrid() {
        const level = this.levels[this.currentLevel];
        this.board.style.gridTemplateColumns = `repeat(${level.width}, ${GAME_CONSTANTS.CELL_SIZE}px)`;
        this.board.style.gridTemplateRows = `repeat(${level.height}, ${GAME_CONSTANTS.CELL_SIZE}px)`;
    }

    renderCells() {
        const level = this.levels[this.currentLevel];
        
        for (let y = 0; y < level.height; y++) {
            for (let x = 0; x < level.width; x++) {
                const cell = this.createCell(x, y);
                this.board.appendChild(cell);
            }
        }
    }

    createCell(x, y) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        
        const level = this.levels[this.currentLevel];
        const isBox = this.isBox(x, y);
        const isGoal = this.isGoal(x, y);
        const isPlayer = this.isPlayer(x, y);
        
        if (this.isWall(x, y)) {
            cell.classList.add('wall');
        } else if (isBox && isGoal) {
            cell.classList.add('box-on-goal');
            cell.textContent = GAME_CONSTANTS.SYMBOLS.BOX_ON_GOAL;
        } else if (isPlayer && isGoal) {
            cell.classList.add('player-on-goal');
            cell.textContent = GAME_CONSTANTS.SYMBOLS.PLAYER_ON_GOAL;
        } else if (isGoal) {
            cell.classList.add('goal');
            cell.textContent = GAME_CONSTANTS.SYMBOLS.GOAL;
        } else if (isBox) {
            cell.classList.add('box');
            cell.textContent = GAME_CONSTANTS.SYMBOLS.BOX;
        } else if (isPlayer) {
            cell.classList.add('player');
            cell.textContent = GAME_CONSTANTS.SYMBOLS.PLAYER;
        }
        
        return cell;
    }

    centerOnPlayer() {
        const level = this.levels[this.currentLevel];
        const player = level.player;
        const cellSize = GAME_CONSTANTS.CELL_SIZE;
        const boardWidth = level.width * cellSize;
        const boardHeight = level.height * cellSize;
        
        // プレイヤーを画面の上部寄りに配置するために、Y軸のオフセットを調整
        const offsetX = (boardWidth / 2) - (player.x * cellSize);
        const offsetY = (boardHeight / 3) - (player.y * cellSize); // 1/3の位置に調整
        
        this.board.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    }

    // 状態チェック
    isGoal(x, y) {
        return this.levels[this.currentLevel].goals.some(goal => goal.x === x && goal.y === y);
    }

    isBox(x, y) {
        return this.levels[this.currentLevel].boxes.some(box => box.x === x && box.y === y);
    }

    isPlayer(x, y) {
        const level = this.levels[this.currentLevel];
        return level.player.x === x && level.player.y === y;
    }

    handleDirection(direction) {
        const level = this.levels[this.currentLevel];
        const newX = level.player.x + direction.dx;
        const newY = level.player.y + direction.dy;

        if (this.isValidMove(newX, newY)) {
            this.saveCurrentState();
            this.movePlayer(newX, newY);
            this.render();
            this.checkWin();
        }
    }

    // タイマー関連のメソッド
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateTimerDisplay();
        }, GAME_CONSTANTS.SETTINGS.TIMER_INTERVAL);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.elapsedTime / 60);
        const seconds = this.elapsedTime % 60;
        this.timerDisplay.textContent = `時間: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// ゲームの開始
window.onload = () => {
    new SokobanGame();
}; 