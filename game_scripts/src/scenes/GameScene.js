/**
 * Main Game Scene
 * Handles the main gameplay scene following SOLID principles
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.assetManager = null;
        this.inputManager = null;
        this.player = null;
        this.background = null;
        this.villainIntro = null;
        this.companionIntro = null;
        this.teleportCave = null;
        this.gameStartTime = null;
    }
    
    /**
     * Preload game assets
     */
    preload() {
        // Initialize asset manager and load assets
        this.assetManager = new AssetManager(this);
        this.assetManager.preloadAssets();
    }
    
    /**
     * Create game objects
     */
    create() {
        // Record game start time
        this.gameStartTime = this.time.now;
        
        // Create background
        this.background = this.assetManager.createBackground();
        
        // Initialize input manager
        this.inputManager = new InputManager(this);
        
        // Create player
        this.player = new Player(
            this, 
            GameConfig.PLAYER.START_X, 
            GameConfig.PLAYER.START_Y
        );
        
        // Initialize villain introduction system
        this.villainIntro = new VillainIntro(this);
        
        // Initialize companion introduction system
        this.companionIntro = new CompanionIntro(this);
        
        // Initialize teleport cave
        this.teleportCave = new TeleportCave(this);
        
        // Setup camera to follow player
        this.setupCamera();
        
        // Add game info
        this.createUI();
        
        // Schedule villain introduction after 3 seconds
        this.time.delayedCall(GameConfig.VILLAIN.INTRO_DELAY, () => {
            this.villainIntro.startIntroSequence();
        });
        
        console.log('🎮 Koremz RPG Game Started!');
        console.log('Use WASD keys to move Dimash around');
        console.log('⏰ Villain introduction will begin in 3 seconds...');
    }
    
    /**
     * Setup camera system
     */
    setupCamera() {
        // Make camera follow the player
        this.cameras.main.startFollow(this.player.getSprite());
        
        // Set camera bounds to the background size
        if (this.background) {
            this.cameras.main.setBounds(
                0, 0, 
                this.background.displayWidth, 
                this.background.displayHeight
            );
        }
        
        // Smooth camera movement
        this.cameras.main.setLerp(0.1, 0.1);
    }
    
    /**
     * Create UI elements
     */
    createUI() {
        // Create a simple UI overlay
        const uiContainer = this.add.container(0, 0);
        uiContainer.setScrollFactor(0); // Keep UI fixed on screen
        
        // Player position indicator (for debugging)
        this.positionText = this.add.text(16, 16, '', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 8, y: 4 }
        }).setScrollFactor(0);
        
        // Game title
        this.add.text(GameConfig.GAME.WIDTH / 2, 30, 'Koremz RPG Adventure', {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0);
    }
    
    /**
     * Update game logic
     */
    update() {
        // Update player (only if not in cutscene)
        if (this.player && this.inputManager && !this.villainIntro.isIntroActive() && !this.companionIntro.isIntroActive()) {
            this.player.update(this.inputManager);
            
            // Check teleport cave collision
            if (this.teleportCave) {
                this.teleportCave.checkPlayerProximity(this.player);
            }
        }
        
        // Update UI
        this.updateUI();
    }
    
    /**
     * Update UI elements
     */
    updateUI() {
        if (this.player && this.positionText) {
            const pos = this.player.getPosition();
            this.positionText.setText(`Position: (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
        }
    }
}