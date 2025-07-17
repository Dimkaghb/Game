/**
 * Bahreddin's Home Scene
 * A peaceful scene where Bahreddin is at home and Dimash appears from the right
 */
class BahreddinsHomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BahreddinsHomeScene' });
        this.assetManager = null;
        this.inputManager = null;
        this.player = null;
        this.bahreddin = null;
        this.background = null;
        this.isIntroActive = false;
        this.hasIntroStarted = false;
        
        // Direction map overlay properties
        this.directionMapOverlay = null;
        this.directionMapSprite = null;
        this.isDirectionMapActive = false;
        this.leaveButton = null;
        this.leaveButtonText = null;
        this.realityButtons = [];
        this.realityDescriptionBox = null;
    }
    
    /**
     * Preload scene assets
     */
    preload() {
        // Initialize asset manager and load assets
        this.assetManager = new AssetManager(this);
        this.assetManager.preloadAssets();
        
        // Load Bahreddin's home background
        this.load.image(
            GameConfig.ASSETS.MAP.BAHREDDINS_HOME.KEY,
            GameConfig.ASSETS.MAP.BAHREDDINS_HOME.PATH
        );
    }
    
    /**
     * Create scene objects
     */
    create() {
        console.log('🏠 Creating Bahreddin\'s Home Scene...');
        
        // Create background
        this.createBackground();
        
        // Initialize input manager
        this.inputManager = new InputManager(this);
        
        // Create Bahreddin in the middle
        this.createBahreddin();
        
        // Create player (Dimash) off-screen to the right
        this.createPlayer();
        
        // Setup camera
        this.setupCamera();
        
        // Create UI
        this.createUI();
        
        // Start the intro sequence after a short delay
        this.time.delayedCall(1000, () => {
            this.startIntroSequence();
        });
        
        console.log('✅ Bahreddin\'s Home Scene created successfully!');
    }
    
    /**
     * Create background
     */
    createBackground() {
        this.background = this.add.image(0, 0, GameConfig.ASSETS.MAP.BAHREDDINS_HOME.KEY);
        this.background.setOrigin(0, 0);
        
        // Scale background to fit screen
        const scaleX = GameConfig.GAME.WIDTH / this.background.width;
        const scaleY = GameConfig.GAME.HEIGHT / this.background.height;
        const scale = Math.max(scaleX, scaleY);
        this.background.setScale(scale);
    }
    
    /**
     * Create Bahreddin in the middle of the scene
     */
    createBahreddin() {
        this.bahreddin = this.add.sprite(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 + 50, // Slightly below center
            GameConfig.ASSETS.COMPANION.BAHREDDIN.KEY
        );
        
        this.bahreddin.setScale(GameConfig.COMPANION.SCALE);
        this.bahreddin.setDepth(10);
        
        // Add subtle idle animation
        this.tweens.add({
            targets: this.bahreddin,
            y: this.bahreddin.y - 5,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
    
    /**
     * Create player (Dimash) off-screen to the right
     */
    createPlayer() {
        this.player = new Player(
            this,
            GameConfig.GAME.WIDTH + 100, // Start off-screen to the right
            GameConfig.GAME.HEIGHT / 2 + 50
        );
        
        // Make player face left initially
        this.player.getSprite().setTexture(GameConfig.ASSETS.PLAYER.LEFT.KEY);
    }
    
    /**
     * Setup camera
     */
    setupCamera() {
        // Set camera bounds to the background size
        if (this.background) {
            this.cameras.main.setBounds(
                0, 0, 
                this.background.displayWidth, 
                this.background.displayHeight
            );
        }
        
        // Center camera on the scene initially
        this.cameras.main.centerOn(GameConfig.GAME.WIDTH / 2, GameConfig.GAME.HEIGHT / 2);
    }
    
    /**
     * Create UI elements
     */
    createUI() {
        // Scene title
        this.add.text(GameConfig.GAME.WIDTH / 2, 30, 'Bahreddin\'s Home', {
            fontSize: '28px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        
        // Back button
        this.createBackButton();
        
        // Door to direction map
        this.createDoor();
    }
    
    /**
     * Create back button to return to main scene
     */
    createBackButton() {
        const backButton = this.add.rectangle(80, 80, 120, 40, 0x4ecdc4);
        backButton.setScrollFactor(0);
        backButton.setDepth(101);
        backButton.setInteractive();
        
        const backButtonText = this.add.text(80, 80, '← Back', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        backButtonText.setOrigin(0.5);
        backButtonText.setScrollFactor(0);
        backButtonText.setDepth(102);
        
        // Add click handler
        backButton.on('pointerdown', () => {
            this.openDirectionMapOverlay();
        });
        
        // Add hover effects
        backButton.on('pointerover', () => {
            backButton.setFillStyle(0x6ee6de);
            backButtonText.setScale(1.1);
        });
        
        backButton.on('pointerout', () => {
            backButton.setFillStyle(0x4ecdc4);
            backButtonText.setScale(1.0);
        });
    }
    
    /**
     * Create door to direction map
     */
    createDoor() {
        // Door frame (brown rectangle)
        const doorFrame = this.add.rectangle(
            GameConfig.GAME.WIDTH - 60, 
            GameConfig.GAME.HEIGHT / 2, 
            80, 
            120, 
            0x8B4513
        );
        doorFrame.setScrollFactor(0);
        doorFrame.setDepth(50);
        
        // Door (darker brown)
        const door = this.add.rectangle(
            GameConfig.GAME.WIDTH - 60, 
            GameConfig.GAME.HEIGHT / 2, 
            70, 
            110, 
            0x654321
        );
        door.setScrollFactor(0);
        door.setDepth(51);
        door.setInteractive();
        
        // Door handle
        const doorHandle = this.add.circle(
            GameConfig.GAME.WIDTH - 80, 
            GameConfig.GAME.HEIGHT / 2, 
            4, 
            0xFFD700
        );
        doorHandle.setScrollFactor(0);
        doorHandle.setDepth(52);
        
        // Door label
        const doorLabel = this.add.text(
            GameConfig.GAME.WIDTH - 60, 
            GameConfig.GAME.HEIGHT / 2 + 80, 
            'Direction Map', 
            {
                fontSize: '14px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                stroke: '#000000',
                strokeThickness: 2
            }
        );
        doorLabel.setOrigin(0.5);
        doorLabel.setScrollFactor(0);
        doorLabel.setDepth(53);
        
        // Add click handler
        door.on('pointerdown', () => {
            this.openDirectionMapOverlay();
        });
        
        // Add hover effects
        door.on('pointerover', () => {
            door.setFillStyle(0x7A5230);
            doorLabel.setScale(1.1);
        });
        
        door.on('pointerout', () => {
            door.setFillStyle(0x654321);
            doorLabel.setScale(1.0);
        });
    }
    
    /**
     * Start the intro sequence
     */
    startIntroSequence() {
        if (this.hasIntroStarted) return;
        
        this.hasIntroStarted = true;
        this.isIntroActive = true;
        
        console.log('🎬 Starting Bahreddin\'s Home intro sequence...');
        
        // Bahreddin greeting
        this.showDialogue('Welcome to my home, Dimash! You\'ve made it safely.', () => {
            // Move Dimash from right to center-right
            this.movePlayerToScene();
        });
    }
    
    /**
     * Move player (Dimash) into the scene from the right
     */
    movePlayerToScene() {
        const targetX = GameConfig.GAME.WIDTH / 2 + 150; // Center-right position
        const targetY = GameConfig.GAME.HEIGHT / 2 + 50;
        
        // Animate player movement
        this.tweens.add({
            targets: this.player.getSprite(),
            x: targetX,
            y: targetY,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                // Player has arrived, show dialogue
                this.showDialogue('Thank you, Bahreddin! It\'s good to be here.', () => {
                    this.showDialogue('Rest here as long as you need. This is a safe place.', () => {
                        this.isIntroActive = false;
                        console.log('✅ Intro sequence completed');
                    });
                });
            }
        });
    }
    
    /**
     * Show dialogue text
     */
    showDialogue(text, onComplete) {
        // Create dialogue overlay
        const overlay = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT - 100,
            GameConfig.GAME.WIDTH - 100,
            80,
            0x000000,
            0.8
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(200);
        
        // Create dialogue text
        const dialogueText = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT - 100,
            text,
            {
                fontSize: '20px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: GameConfig.GAME.WIDTH - 150 }
            }
        );
        dialogueText.setOrigin(0.5);
        dialogueText.setScrollFactor(0);
        dialogueText.setDepth(201);
        
        // Add skip hint
        const skipHint = this.add.text(
            GameConfig.GAME.WIDTH - 20,
            GameConfig.GAME.HEIGHT - 20,
            'Click to skip →',
            {
                fontSize: '14px',
                fill: '#ffff99',
                fontFamily: 'Arial'
            }
        );
        skipHint.setOrigin(1, 1);
        skipHint.setScrollFactor(0);
        skipHint.setDepth(202);
        skipHint.setAlpha(0.7);
        
        // Pulse animation for skip hint
        this.tweens.add({
            targets: skipHint,
            alpha: 0.3,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Click to skip functionality
        let dialogueSkipped = false;
        const skipHandler = () => {
            if (!dialogueSkipped) {
                dialogueSkipped = true;
                console.log('⏭️ Skipping dialogue...');
                
                // Remove click listener
                this.input.off('pointerdown', skipHandler);
                
                // Clean up immediately
                overlay.destroy();
                dialogueText.destroy();
                skipHint.destroy();
                
                if (onComplete) {
                    onComplete();
                }
            }
        };
        
        // Add click listener
        this.input.on('pointerdown', skipHandler);
        
        // Auto-remove dialogue after 2.5 seconds (reduced from 4)
        this.time.delayedCall(2500, () => {
            if (!dialogueSkipped) {
                dialogueSkipped = true;
                
                // Remove click listener
                this.input.off('pointerdown', skipHandler);
                
                overlay.destroy();
                dialogueText.destroy();
                skipHint.destroy();
                
                if (onComplete) {
                    onComplete();
                }
            }
        });
    }
    
    /**
     * Return to main scene
     */
    returnToMainScene() {
        console.log('🔄 Returning to main scene...');
        this.scene.start('GameScene');
    }
    
    /**
     * Open direction map overlay
     */
    openDirectionMapOverlay() {
        if (this.isDirectionMapActive) return;
        
        console.log('🗺️ Opening direction map overlay...');
        this.isDirectionMapActive = true;
        
        // Create overlay background
        this.createDirectionMapOverlay();
        
        // Create direction map sprite
        this.createDirectionMapSprite();
        
        // Create interactive elements
        this.createLeaveButton();
        this.createRealityButtons();
        
        // Animate entrance
        this.animateDirectionMapEntrance();
    }
    
    /**
     * Create direction map overlay background
     */
    createDirectionMapOverlay() {
        this.directionMapOverlay = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH,
            GameConfig.GAME.HEIGHT,
            0x000000,
            0.8
        );
        this.directionMapOverlay.setScrollFactor(0);
        this.directionMapOverlay.setDepth(200);
        this.directionMapOverlay.setAlpha(0);
    }
    
    /**
     * Create direction map sprite
     */
    createDirectionMapSprite() {
        this.directionMapSprite = this.add.sprite(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.ASSETS.TELEPORT.DIRECTION_MAP.KEY
        );
        
        this.directionMapSprite.setScale(GameConfig.TELEPORT.DIRECTION_MAP.SCALE);
        this.directionMapSprite.setScrollFactor(0);
        this.directionMapSprite.setDepth(201);
        this.directionMapSprite.setAlpha(0);
        
        // Scale to fit screen if needed
        const scaleX = GameConfig.GAME.WIDTH / this.directionMapSprite.width;
        const scaleY = GameConfig.GAME.HEIGHT / this.directionMapSprite.height;
        const scale = Math.min(scaleX, scaleY) * 0.9; // 90% of screen size
        this.directionMapSprite.setScale(scale);
    }
    
    /**
     * Create leave button
     */
    createLeaveButton() {
        const buttonConfig = GameConfig.TELEPORT.DIRECTION_MAP.LEAVE_BUTTON;
        
        this.leaveButton = this.add.rectangle(
            buttonConfig.POSITION_X,
            buttonConfig.POSITION_Y,
            120,
            40,
            0xff4444
        );
        this.leaveButton.setScrollFactor(0);
        this.leaveButton.setDepth(202);
        this.leaveButton.setInteractive();
        this.leaveButton.setAlpha(0);
        
        this.leaveButtonText = this.add.text(
            buttonConfig.POSITION_X,
            buttonConfig.POSITION_Y,
            buttonConfig.TEXT,
            buttonConfig.STYLE
        );
        this.leaveButtonText.setOrigin(0.5);
        this.leaveButtonText.setScrollFactor(0);
        this.leaveButtonText.setDepth(203);
        this.leaveButtonText.setAlpha(0);
        
        // Add click handler
        this.leaveButton.on('pointerdown', () => {
            this.closeDirectionMap();
        });
        
        // Add hover effects
        this.leaveButton.on('pointerover', () => {
            this.leaveButton.setFillStyle(0xff6666);
        });
        
        this.leaveButton.on('pointerout', () => {
            this.leaveButton.setFillStyle(0xff4444);
        });
    }
    
    /**
     * Create reality buttons
     */
    createRealityButtons() {
        this.realityButtons = [];
        const realities = GameConfig.TELEPORT.DIRECTION_MAP.REALITIES;
        
        Object.values(realities).forEach(reality => {
            // Create button
            const button = this.add.rectangle(
                reality.POSITION_X,
                reality.POSITION_Y,
                100,
                30,
                0x4ecdc4
            );
            button.setScrollFactor(0);
            button.setDepth(202);
            button.setInteractive();
            button.setAlpha(0);
            
            // Create button text
            const buttonText = this.add.text(
                reality.POSITION_X,
                reality.POSITION_Y,
                reality.NAME,
                GameConfig.TELEPORT.DIRECTION_MAP.REALITY_BUTTON_STYLE
            );
            buttonText.setOrigin(0.5);
            buttonText.setScrollFactor(0);
            buttonText.setDepth(203);
            buttonText.setAlpha(0);
            
            // Add click handler
            button.on('pointerdown', () => {
                console.log(`🖱️ Reality button clicked: ${reality.NAME}`);
                this.showRealityDescription(reality);
            });
            
            // Add hover effects
            button.on('pointerover', () => {
                button.setFillStyle(0x6ee6de);
                buttonText.setScale(1.1);
            });
            
            button.on('pointerout', () => {
                button.setFillStyle(0x4ecdc4);
                buttonText.setScale(1.0);
            });
            
            // Store button data
            this.realityButtons.push({
                button: button,
                text: buttonText,
                reality: reality
            });
        });
    }
    
    /**
     * Animate direction map entrance
     */
    animateDirectionMapEntrance() {
        // Fade in overlay
        this.tweens.add({
            targets: this.directionMapOverlay,
            alpha: 0.8,
            duration: GameConfig.TELEPORT.DIRECTION_MAP.FADE_DURATION,
            ease: 'Power2'
        });
        
        // Fade in and scale direction map
        this.tweens.add({
            targets: this.directionMapSprite,
            alpha: 1,
            scaleX: this.directionMapSprite.scaleX * 1.1,
            scaleY: this.directionMapSprite.scaleY * 1.1,
            duration: GameConfig.TELEPORT.DIRECTION_MAP.FADE_DURATION,
            ease: 'Back.easeOut'
        });
        
        // Animate leave button
        this.tweens.add({
            targets: [this.leaveButton, this.leaveButtonText],
            alpha: 1,
            duration: GameConfig.TELEPORT.DIRECTION_MAP.FADE_DURATION,
            ease: 'Power2',
            delay: 200
        });
        
        // Animate reality buttons
        this.realityButtons.forEach((buttonData, index) => {
            this.tweens.add({
                targets: [buttonData.button, buttonData.text],
                alpha: 1,
                duration: GameConfig.TELEPORT.DIRECTION_MAP.FADE_DURATION,
                ease: 'Power2',
                delay: 300 + (index * 100)
            });
        });
    }
    
    /**
     * Show reality description
     */
    showRealityDescription(reality) {
        console.log(`🎯 showRealityDescription called with: ${reality.NAME}`);
        
        // Check if this is Bahreddin's Home - we're already here, so just close the map
        if (reality.NAME === 'Bahreddin Home') {
            console.log('✅ Already in Bahreddin Home, closing direction map...');
            this.closeDirectionMap();
            return;
        }
        
        // Hide any existing description
        this.hideRealityDescription();
        
        // Create description box
        this.realityDescriptionBox = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT - 100,
            GameConfig.GAME.WIDTH - 100,
            80,
            0x000000,
            0.9
        );
        this.realityDescriptionBox.setScrollFactor(0);
        this.realityDescriptionBox.setDepth(204);
        
        // Create description text
        const descriptionText = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT - 100,
            reality.DESCRIPTION,
            {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: GameConfig.GAME.WIDTH - 150 }
            }
        );
        descriptionText.setOrigin(0.5);
        descriptionText.setScrollFactor(0);
        descriptionText.setDepth(205);
        
        // Store reference for cleanup
        this.realityDescriptionBox.descriptionText = descriptionText;
        
        console.log(`📝 Showing description for: ${reality.NAME}`);
    }
    
    /**
     * Hide reality description
     */
    hideRealityDescription() {
        if (this.realityDescriptionBox) {
            if (this.realityDescriptionBox.descriptionText) {
                this.realityDescriptionBox.descriptionText.destroy();
            }
            this.realityDescriptionBox.destroy();
            this.realityDescriptionBox = null;
        }
    }
    
    /**
     * Close direction map
     */
    closeDirectionMap() {
        if (!this.isDirectionMapActive) return;
        
        console.log('🗺️ Closing direction map...');
        
        // Hide reality description if showing
        this.hideRealityDescription();
        
        // Fade out interactive elements first
        const interactiveElements = [this.leaveButton, this.leaveButtonText];
        this.realityButtons.forEach(buttonData => {
            interactiveElements.push(buttonData.button, buttonData.text);
        });
        
        this.tweens.add({
            targets: interactiveElements,
            alpha: 0,
            duration: 300,
            ease: 'Power2'
        });
        
        // Fade out direction map sprite
        this.tweens.add({
            targets: this.directionMapSprite,
            alpha: 0,
            scaleX: this.directionMapSprite.scaleX * 0.8,
            scaleY: this.directionMapSprite.scaleY * 0.8,
            duration: 500,
            ease: 'Power2',
            delay: 200
        });
        
        // Fade out overlay last
        this.tweens.add({
            targets: this.directionMapOverlay,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            delay: 300,
            onComplete: () => {
                this.cleanupDirectionMap();
            }
        });
    }
    
    /**
     * Clean up direction map elements
     */
    cleanupDirectionMap() {
        // Destroy overlay
        if (this.directionMapOverlay) {
            this.directionMapOverlay.destroy();
            this.directionMapOverlay = null;
        }
        
        // Destroy direction map sprite
        if (this.directionMapSprite) {
            this.directionMapSprite.destroy();
            this.directionMapSprite = null;
        }
        
        // Destroy leave button
        if (this.leaveButton) {
            this.leaveButton.destroy();
            this.leaveButton = null;
        }
        
        if (this.leaveButtonText) {
            this.leaveButtonText.destroy();
            this.leaveButtonText = null;
        }
        
        // Destroy reality buttons
        this.realityButtons.forEach(buttonData => {
            buttonData.button.destroy();
            buttonData.text.destroy();
        });
        this.realityButtons = [];
        
        // Hide any remaining description
        this.hideRealityDescription();
        
        // Reset state
        this.isDirectionMapActive = false;
        
        console.log('🧹 Direction map cleanup complete');
    }
    
    /**
     * Update loop
     */
    update() {
        // Update player movement only if intro is not active
        if (this.player && this.inputManager && !this.isIntroActive) {
            this.player.update(this.inputManager);
        }
    }
    
    /**
     * Clean up scene resources
     */
    shutdown() {
        console.log('🧹 Cleaning up Bahreddin\'s Home Scene...');
        
        // Clean up any remaining tweens
        this.tweens.killAll();
        
        // Clean up direction map if active
        if (this.isDirectionMapActive) {
            this.cleanupDirectionMap();
        }
        
        // Reset flags
        this.isIntroActive = false;
        this.hasIntroStarted = false;
    }
}