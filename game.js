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
        MAX_UNDO_COUNT: 2
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
        this.updateUndoCountDisplay();
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

        level.walls.push(
            { x: 6, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 },
            { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 },
            { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 },
            { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 9 },
            { x: 2, y: 9 }, { x: 3, y: 9 }, { x: 4, y: 9 },
            { x: 3, y: 4 }, { x: 3, y: 5 },
            { x: 11, y: 4 }, { x: 11, y: 5 }
        );

        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 3 });
        level.boxes.push({ x: 2, y: 4 });
        level.boxes.push({ x: 3, y: 2 });
        level.boxes.push({ x: 4, y: 2 });
        level.boxes.push({ x: 5, y: 2 });
        level.goals.push({ x: 8, y: 2 });
        level.goals.push({ x: 8, y: 3 });
        level.goals.push({ x: 8, y: 4 });
        level.goals.push({ x: 10, y: 10 });
        level.goals.push({ x: 11, y: 11 });
        level.goals.push({ x: 12, y: 12 });

        return level;
    }

    createLevel7() {
        const level = this.createBaseLevel(16, 16);
        this.addSurroundingWalls(level);

        level.walls.push(
            { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 },
            { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 },
            { x: 10, y: 2 }, { x: 10, y: 3 }, { x: 10, y: 4 },
            { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 10 },
            { x: 2, y: 10 }, { x: 3, y: 10 }, { x: 4, y: 10 },
            { x: 3, y: 4 }, { x: 3, y: 5 },
            { x: 12, y: 4 }, { x: 12, y: 5 },
            { x: 5, y: 8 }, { x: 5, y: 9 }
        );

        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 3 });
        level.boxes.push({ x: 2, y: 4 });
        level.boxes.push({ x: 3, y: 2 });
        level.boxes.push({ x: 4, y: 2 });
        level.boxes.push({ x: 5, y: 2 });
        level.boxes.push({ x: 6, y: 2 });
        level.goals.push({ x: 9, y: 2 });
        level.goals.push({ x: 9, y: 3 });
        level.goals.push({ x: 9, y: 4 });
        level.goals.push({ x: 11, y: 11 });
        level.goals.push({ x: 12, y: 12 });
        level.goals.push({ x: 13, y: 13 });
        level.goals.push({ x: 14, y: 14 });

        return level;
    }

    createLevel8() {
        const level = this.createBaseLevel(18, 18);
        this.addSurroundingWalls(level);

        level.walls.push(
            { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 },
            { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 },
            { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 },
            { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 }, { x: 11, y: 11 },
            { x: 2, y: 11 }, { x: 3, y: 11 }, { x: 4, y: 11 },
            { x: 3, y: 4 }, { x: 3, y: 5 },
            { x: 13, y: 4 }, { x: 13, y: 5 },
            { x: 5, y: 9 }, { x: 5, y: 10 },
            { x: 14, y: 7 }, { x: 14, y: 8 }
        );

        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 3 });
        level.boxes.push({ x: 2, y: 4 });
        level.boxes.push({ x: 3, y: 2 });
        level.boxes.push({ x: 4, y: 2 });
        level.boxes.push({ x: 5, y: 2 });
        level.boxes.push({ x: 6, y: 2 });
        level.boxes.push({ x: 7, y: 2 });
        level.goals.push({ x: 10, y: 2 });
        level.goals.push({ x: 10, y: 3 });
        level.goals.push({ x: 10, y: 4 });
        level.goals.push({ x: 12, y: 12 });
        level.goals.push({ x: 13, y: 13 });
        level.goals.push({ x: 14, y: 14 });
        level.goals.push({ x: 15, y: 15 });
        level.goals.push({ x: 16, y: 16 });

        return level;
    }

    createLevel9() {
        const level = this.createBaseLevel(20, 20);
        this.addSurroundingWalls(level);

        level.walls.push(
            { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 }, { x: 9, y: 9 },
            { x: 10, y: 2 }, { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 },
            { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 },
            { x: 12, y: 6 }, { x: 12, y: 7 }, { x: 12, y: 8 }, { x: 12, y: 9 }, { x: 12, y: 10 }, { x: 12, y: 11 }, { x: 12, y: 12 },
            { x: 2, y: 12 }, { x: 3, y: 12 }, { x: 4, y: 12 },
            { x: 3, y: 4 }, { x: 3, y: 5 },
            { x: 14, y: 4 }, { x: 14, y: 5 },
            { x: 5, y: 10 }, { x: 5, y: 11 },
            { x: 15, y: 7 }, { x: 15, y: 8 },
            { x: 7, y: 13 }, { x: 7, y: 14 }
        );

        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 3 });
        level.boxes.push({ x: 2, y: 4 });
        level.boxes.push({ x: 3, y: 2 });
        level.boxes.push({ x: 4, y: 2 });
        level.boxes.push({ x: 5, y: 2 });
        level.boxes.push({ x: 6, y: 2 });
        level.boxes.push({ x: 7, y: 2 });
        level.boxes.push({ x: 8, y: 2 });
        level.goals.push({ x: 11, y: 2 });
        level.goals.push({ x: 11, y: 3 });
        level.goals.push({ x: 11, y: 4 });
        level.goals.push({ x: 13, y: 13 });
        level.goals.push({ x: 14, y: 14 });
        level.goals.push({ x: 15, y: 15 });
        level.goals.push({ x: 16, y: 16 });
        level.goals.push({ x: 17, y: 17 });
        level.goals.push({ x: 18, y: 18 });

        return level;
    }

    createLevel10() {
        const level = this.createBaseLevel(22, 22);
        this.addSurroundingWalls(level);

        level.walls.push(
            { x: 10, y: 2 }, { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 10 },
            { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 },
            { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 },
            { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 }, { x: 13, y: 13 },
            { x: 2, y: 13 }, { x: 3, y: 13 }, { x: 4, y: 13 },
            { x: 3, y: 4 }, { x: 3, y: 5 },
            { x: 15, y: 4 }, { x: 15, y: 5 },
            { x: 5, y: 11 }, { x: 5, y: 12 },
            { x: 16, y: 7 }, { x: 16, y: 8 },
            { x: 7, y: 14 }, { x: 7, y: 15 },
            { x: 17, y: 10 }, { x: 17, y: 11 }
        );

        level.boxes.push({ x: 2, y: 2 });
        level.boxes.push({ x: 2, y: 3 });
        level.boxes.push({ x: 2, y: 4 });
        level.boxes.push({ x: 3, y: 2 });
        level.boxes.push({ x: 4, y: 2 });
        level.boxes.push({ x: 5, y: 2 });
        level.boxes.push({ x: 6, y: 2 });
        level.boxes.push({ x: 7, y: 2 });
        level.boxes.push({ x: 8, y: 2 });
        level.boxes.push({ x: 9, y: 2 });
        level.goals.push({ x: 12, y: 2 });
        level.goals.push({ x: 12, y: 3 });
        level.goals.push({ x: 12, y: 4 });
        level.goals.push({ x: 14, y: 14 });
        level.goals.push({ x: 15, y: 15 });
        level.goals.push({ x: 16, y: 16 });
        level.goals.push({ x: 17, y: 17 });
        level.goals.push({ x: 18, y: 18 });
        level.goals.push({ x: 19, y: 19 });
        level.goals.push({ x: 20, y: 20 });

        return level;
    }

    loadLevel(levelIndex) {
        this.currentLevel = levelIndex;
        this.history = [];
        this.undoCount = GAME_CONSTANTS.SETTINGS.MAX_UNDO_COUNT;
        this.updateUndoCountDisplay();
        this.clearMessage();
        this.render();
    }

    resetLevel() {
        this.levels[this.currentLevel] = JSON.parse(JSON.stringify(this.initialLevels[this.currentLevel]));
        this.history = [];
        this.undoCount = GAME_CONSTANTS.SETTINGS.MAX_UNDO_COUNT;
        this.updateUndoCountDisplay();
        this.clearMessage();
        this.render();
    }

    restartGame() {
        // すべてのステージの状態を初期化
        this.levels = JSON.parse(JSON.stringify(this.initialLevels));
        this.currentLevel = 0;
        this.history = [];
        this.undoCount = GAME_CONSTANTS.SETTINGS.MAX_UNDO_COUNT;
        this.updateUndoCountDisplay();
        this.clearMessage();
        this.render();
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
                message = 'ステージ6クリア！\n6つの箱をゴールに運びました。';
                break;
            case 7:
                message = 'ステージ7クリア！\n7つの箱をゴールに運びました。';
                break;
            case 8:
                message = 'ステージ8クリア！\n8つの箱をゴールに運びました。';
                break;
            case 9:
                message = 'ステージ9クリア！\n9つの箱をゴールに運びました。';
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
                this.loadLevel(this.currentLevel + 1);
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
        
        const offsetX = (boardWidth / 2) - (player.x * cellSize);
        const offsetY = (boardHeight / 2) - (player.y * cellSize);
        
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
}

// ゲームの開始
window.onload = () => {
    new SokobanGame();
}; 