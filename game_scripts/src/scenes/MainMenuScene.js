/**
 * Main Menu Scene
 * Shows the main menu with continue/new game options
 */
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
        this.gameStateManager = null;
        this.background = null;
        this.titleText = null;
        this.continueButton = null;
        this.newGameButton = null;
        this.lastSaveText = null;
    }

    /**
     * Preload scene assets
     */
    preload() {
        // Load background (reuse game background)
        this.load.image('menu_background', GameConfig.ASSETS.MAP.BACKGROUND.PATH);
        
        // Load button assets if they exist, otherwise we'll create text buttons
        console.log('📂 Loading main menu assets...');
    }

    /**
     * Create scene objects
     */
    create() {
        console.log('🎮 Creating Main Menu Scene...');
        
        // Initialize game state manager
        this.gameStateManager = new GameStateManager();
        
        // Create background
        this.createBackground();
        
        // Create title
        this.createTitle();
        
        // Create menu buttons
        this.createMenuButtons();
        
        // Add keyboard controls
        this.setupKeyboardControls();
        
        console.log('✅ Main Menu Scene created successfully!');
    }

    /**
     * Create background
     */
    createBackground() {
        this.background = this.add.image(0, 0, 'menu_background');
        this.background.setOrigin(0, 0);
        
        // Scale background to fit screen
        const scaleX = GameConfig.GAME.WIDTH / this.background.width;
        const scaleY = GameConfig.GAME.HEIGHT / this.background.height;
        const scale = Math.max(scaleX, scaleY);
        this.background.setScale(scale);
        
        // Add dark overlay for better text readability
        const overlay = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH,
            GameConfig.GAME.HEIGHT,
            0x000000,
            0.5
        );
    }

    /**
     * Create title text
     */
    createTitle() {
        this.titleText = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT * 0.25,
            'KOREMZ GAME',
            {
                fontSize: '48px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center'
            }
        );
        this.titleText.setOrigin(0.5);
        
        // Add pulsing animation to title
        this.tweens.add({
            targets: this.titleText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    /**
     * Create menu buttons
     */
    createMenuButtons() {
        const centerX = GameConfig.GAME.WIDTH / 2;
        const buttonY = GameConfig.GAME.HEIGHT * 0.5;
        const buttonSpacing = 80;
        
        // Check if there's a saved game
        const hasSavedGame = this.gameStateManager.hasSavedGame();
        
        if (hasSavedGame) {
            // Show continue button
            this.continueButton = this.createButton(
                centerX,
                buttonY - buttonSpacing / 2,
                'CONTINUE',
                '#4CAF50',
                () => this.continueGame()
            );
            
            // Show last save time
            const lastSaveTime = this.gameStateManager.getLastSaveTime();
            if (lastSaveTime) {
                this.lastSaveText = this.add.text(
                    centerX,
                    buttonY - buttonSpacing / 2 + 50,
                    `Last saved: ${lastSaveTime}`,
                    {
                        fontSize: '16px',
                        fontFamily: 'Arial, sans-serif',
                        fill: '#cccccc',
                        align: 'center'
                    }
                );
                this.lastSaveText.setOrigin(0.5);
            }
            
            // Show new game button
            this.newGameButton = this.createButton(
                centerX,
                buttonY + buttonSpacing / 2,
                'NEW GAME',
                '#FF9800',
                () => this.startNewGame()
            );
        } else {
            // Only show new game button
            this.newGameButton = this.createButton(
                centerX,
                buttonY,
                'START GAME',
                '#4CAF50',
                () => this.startNewGame()
            );
        }
    }

    /**
     * Create a button with hover effects
     */
    createButton(x, y, text, color, callback) {
        // Create button background
        const buttonBg = this.add.rectangle(x, y, 200, 50, 0x333333);
        buttonBg.setStrokeStyle(2, color);
        
        // Create button text
        const buttonText = this.add.text(x, y, text, {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            fill: color,
            align: 'center'
        });
        buttonText.setOrigin(0.5);
        
        // Create button container
        const button = this.add.container(0, 0, [buttonBg, buttonText]);
        button.setSize(200, 50);
        button.setInteractive({ useHandCursor: true });
        
        // Add hover effects
        button.on('pointerover', () => {
            buttonBg.setFillStyle(Phaser.Display.Color.HexStringToColor(color).color, 0.2);
            this.tweens.add({
                targets: button,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 150,
                ease: 'Power2'
            });
        });
        
        button.on('pointerout', () => {
            buttonBg.setFillStyle(0x333333);
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Power2'
            });
        });
        
        // Add click handler
        button.on('pointerdown', callback);
        
        return button;
    }

    /**
     * Setup keyboard controls
     */
    setupKeyboardControls() {
        // ESC to quit (if needed)
        this.input.keyboard.on('keydown-ESC', () => {
            console.log('ESC pressed in main menu');
        });
        
        // Enter to continue/start
        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.gameStateManager.hasSavedGame()) {
                this.continueGame();
            } else {
                this.startNewGame();
            }
        });
    }

    /**
     * Continue saved game
     */
    continueGame() {
        console.log('🔄 Continuing saved game...');
        
        // Load saved state
        const savedState = this.gameStateManager.loadGameState();
        const currentScene = savedState.currentScene;
        
        // Add transition effect
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Start from saved scene
            this.scene.start(currentScene);
        });
    }

    /**
     * Start new game
     */
    startNewGame() {
        console.log('🆕 Starting new game...');
        
        // Show confirmation if there's a saved game
        if (this.gameStateManager.hasSavedGame()) {
            this.showNewGameConfirmation();
        } else {
            this.proceedWithNewGame();
        }
    }

    /**
     * Show confirmation dialog for new game
     */
    showNewGameConfirmation() {
        // Create overlay
        const overlay = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH,
            GameConfig.GAME.HEIGHT,
            0x000000,
            0.7
        );
        
        // Create confirmation dialog
        const dialogBg = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            400,
            200,
            0x333333
        );
        dialogBg.setStrokeStyle(2, 0xffffff);
        
        const confirmText = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 - 30,
            'Start new game?\nThis will overwrite your saved progress.',
            {
                fontSize: '18px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                align: 'center'
            }
        );
        confirmText.setOrigin(0.5);
        
        // Create Yes/No buttons
        const yesButton = this.createButton(
            GameConfig.GAME.WIDTH / 2 - 60,
            GameConfig.GAME.HEIGHT / 2 + 40,
            'YES',
            '#FF5722',
            () => {
                overlay.destroy();
                dialogBg.destroy();
                confirmText.destroy();
                yesButton.destroy();
                noButton.destroy();
                this.proceedWithNewGame();
            }
        );
        
        const noButton = this.createButton(
            GameConfig.GAME.WIDTH / 2 + 60,
            GameConfig.GAME.HEIGHT / 2 + 40,
            'NO',
            '#4CAF50',
            () => {
                overlay.destroy();
                dialogBg.destroy();
                confirmText.destroy();
                yesButton.destroy();
                noButton.destroy();
            }
        );
    }

    /**
     * Proceed with new game
     */
    proceedWithNewGame() {
        // Clear saved game
        this.gameStateManager.clearSavedGame();
        
        // Initialize new game state
        this.gameStateManager.setCurrentScene('GameScene');
        
        // Add transition effect
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Start from the beginning
            this.scene.start('GameScene');
        });
    }
}