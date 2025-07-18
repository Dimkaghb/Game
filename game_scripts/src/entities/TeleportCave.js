/**
 * Teleport Cave Entity
 * Handles the teleport cave interaction and direction map display
 * Following Single Responsibility and Open/Closed Principles
 */
class TeleportCave {
    constructor(scene) {
        this.scene = scene;
        this.caveSprite = null;
        this.directionMapOverlay = null;
        this.directionMapSprite = null;
        this.isDirectionMapActive = false;
        this.playerInRange = false;
        this.hasTriggered = false;
        
        // Interactive elements
        this.leaveButton = null;
        this.realityButtons = [];
        this.realityDescriptionBox = null;
        this.currentRealityDisplay = null;
        
        this.create();
        this.setupCollision();
    }
    
    /**
     * Create the teleport cave sprite
     */
    create() {
        // Create cave sprite at the right side of the map
        this.caveSprite = this.scene.add.sprite(
            GameConfig.TELEPORT.CAVE.POSITION_X,
            GameConfig.TELEPORT.CAVE.POSITION_Y,
            GameConfig.ASSETS.TELEPORT.CAVE.KEY
        );
        
        this.caveSprite.setScale(GameConfig.TELEPORT.CAVE.SCALE);
        this.caveSprite.setDepth(1); // Above background, below player
        
        // Add subtle glow effect to indicate it's interactive
        this.caveSprite.setTint(0xaaaaff);
        
        // Add gentle pulsing animation
        this.scene.tweens.add({
            targets: this.caveSprite,
            alpha: 0.8,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        console.log('🕳️ Teleport cave created at position:', GameConfig.TELEPORT.CAVE.POSITION_X, GameConfig.TELEPORT.CAVE.POSITION_Y);
    }
    
    /**
     * Setup collision detection with player
     */
    setupCollision() {
        // Enable physics for the cave sprite
        this.scene.physics.add.existing(this.caveSprite);
        this.caveSprite.body.setImmovable(true);
        
        // Set collision body size
        this.caveSprite.body.setSize(
            GameConfig.TELEPORT.CAVE.COLLISION_RADIUS,
            GameConfig.TELEPORT.CAVE.COLLISION_RADIUS
        );
        
        console.log('🔧 Cave collision setup complete');
    }
    
    /**
     * Check if player is near the cave
     */
    checkPlayerProximity(player) {
        if (!this.caveSprite || !player || !player.getSprite()) return;
        
        const distance = Phaser.Math.Distance.Between(
            player.getSprite().x,
            player.getSprite().y,
            this.caveSprite.x,
            this.caveSprite.y
        );
        
        const wasInRange = this.playerInRange;
        this.playerInRange = distance <= GameConfig.TELEPORT.CAVE.COLLISION_RADIUS;
        
        // Trigger direction map when player enters cave area for the first time
        if (this.playerInRange && !wasInRange && !this.hasTriggered) {
            this.triggerDirectionMap();
        }
    }
    
    /**
     * Trigger the direction map display
     */
    triggerDirectionMap() {
        if (this.isDirectionMapActive || this.hasTriggered) return;
        
        console.log('🗺️ Triggering direction map display...');
        this.hasTriggered = true;
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
        
        // Schedule auto-close
        this.scheduleDirectionMapClose();
    }
    
    /**
     * Create direction map overlay
     */
    createDirectionMapOverlay() {
        this.directionMapOverlay = this.scene.add.rectangle(
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
        this.directionMapSprite = this.scene.add.sprite(
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
        const config = GameConfig.TELEPORT.DIRECTION_MAP.LEAVE_BUTTON;
        
        // Create button background
        this.leaveButton = this.scene.add.rectangle(
            config.POSITION_X,
            config.POSITION_Y,
            120, 40,
            0xff4444
        );
        this.leaveButton.setScrollFactor(0);
        this.leaveButton.setDepth(202);
        this.leaveButton.setAlpha(0);
        this.leaveButton.setInteractive();
        
        // Create button text
        this.leaveButtonText = this.scene.add.text(
            config.POSITION_X,
            config.POSITION_Y,
            config.TEXT,
            config.STYLE
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
        const realities = GameConfig.TELEPORT.DIRECTION_MAP.REALITIES;
        const buttonStyle = GameConfig.TELEPORT.DIRECTION_MAP.REALITY_BUTTON_STYLE;
        
        Object.keys(realities).forEach((realityKey) => {
            const reality = realities[realityKey];
            
            // Create button background
            const button = this.scene.add.rectangle(
                reality.POSITION_X,
                reality.POSITION_Y,
                100, 30,
                0x4ecdc4
            );
            button.setScrollFactor(0);
            button.setDepth(202);
            button.setAlpha(0);
            button.setInteractive();
            
            // Create button text
            const buttonText = this.scene.add.text(
                reality.POSITION_X,
                reality.POSITION_Y,
                reality.NAME,
                buttonStyle
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
            
            // Store references
            this.realityButtons.push({
                button: button,
                text: buttonText,
                reality: reality
            });
        });
    }
    
    /**
     * Show reality description
     */
    showRealityDescription(reality) {
        console.log(`🎯 showRealityDescription called with: ${reality.NAME}`);
        
        // Check if this is Bahreddin's Home - trigger scene transition
        if (reality.NAME === 'Bahreddin Home') {
            console.log('✅ Bahreddin Home detected, triggering transition...');
            this.transitionToBahreddinsHome();
            return;
        }
        
        // Check if this is Diana - navigate to Diana scene
        if (reality.NAME === 'Diana') {
            console.log('🎭 Navigating to Diana Scene...');
            
            // Save game state before transition
            const gameStateManager = new GameStateManager();
            gameStateManager.setCurrentScene('DianaScene');
            
            this.scene.scene.start('DianaScene');
            return;
        }
        
        console.log('📝 Showing description for:', reality.NAME);
        
        // Remove existing description if any
        this.hideRealityDescription();
        
        const descStyle = GameConfig.TELEPORT.DIRECTION_MAP.REALITY_DESCRIPTION_STYLE;
        
        // Create description background
        this.realityDescriptionBox = this.scene.add.rectangle(
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
        this.currentRealityDisplay = this.scene.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT - 100,
            reality.DESCRIPTION,
            descStyle
        );
        this.currentRealityDisplay.setOrigin(0.5);
        this.currentRealityDisplay.setScrollFactor(0);
        this.currentRealityDisplay.setDepth(205);
        
        // Add fade in animation
        this.scene.tweens.add({
            targets: [this.realityDescriptionBox, this.currentRealityDisplay],
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        // Auto-hide after 4 seconds
        this.scene.time.delayedCall(4000, () => {
            this.hideRealityDescription();
        });
    }
    
    /**
     * Transition to Bahreddin's Home scene
     */
    transitionToBahreddinsHome() {
        console.log('🏠 Transitioning to Bahreddin\'s Home...');
        
        try {
            // Show transition message
            const transitionText = this.scene.add.text(
                GameConfig.GAME.WIDTH / 2,
                GameConfig.GAME.HEIGHT / 2,
                'Entering Bahreddin\'s Home...',
                {
                    fontSize: '32px',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 3,
                    fontFamily: 'Arial'
                }
            );
            transitionText.setOrigin(0.5);
            transitionText.setScrollFactor(0);
            transitionText.setDepth(300);
            transitionText.setAlpha(0);
            
            // Fade in transition text
            this.scene.tweens.add({
                targets: transitionText,
                alpha: 1,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    // Wait a moment then transition
                    this.scene.time.delayedCall(1000, () => {
                        try {
                            console.log('🔄 Starting scene transition...');
                            
                            // Check if scene manager exists
                            if (!this.scene.scene) {
                                console.error('❌ Scene manager not found!');
                                return;
                            }
                            
                            // Clean up current scene elements
                            this.cleanup();
                            
                            // Save game state before transition
                            const gameStateManager = new GameStateManager();
                            gameStateManager.setCurrentScene('BahreddinsHomeScene');
                            
                            // Start the new scene
                            console.log('🎬 Starting BahreddinsHomeScene...');
                            this.scene.scene.start('BahreddinsHomeScene');
                            
                        } catch (error) {
                            console.error('❌ Error during scene transition:', error);
                        }
                    });
                }
            });
            
        } catch (error) {
            console.error('❌ Error in transitionToBahreddinsHome:', error);
        }
    }

    /**
     * Hide reality description
     */
    hideRealityDescription() {
        if (this.realityDescriptionBox) {
            this.realityDescriptionBox.destroy();
            this.realityDescriptionBox = null;
        }
        
        if (this.currentRealityDisplay) {
            this.currentRealityDisplay.destroy();
            this.currentRealityDisplay = null;
        }
    }
    
    /**
     * Animate direction map entrance
     */
    animateDirectionMapEntrance() {
        // Fade in overlay
        this.scene.tweens.add({
            targets: this.directionMapOverlay,
            alpha: 0.8,
            duration: GameConfig.TELEPORT.DIRECTION_MAP.FADE_DURATION,
            ease: 'Power2'
        });
        
        // Fade in and scale direction map
        this.scene.tweens.add({
            targets: this.directionMapSprite,
            alpha: 1,
            scaleX: this.directionMapSprite.scaleX * 1.1,
            scaleY: this.directionMapSprite.scaleY * 1.1,
            duration: GameConfig.TELEPORT.DIRECTION_MAP.FADE_DURATION,
            ease: 'Back.easeOut'
        });
        
        // Animate leave button
        this.scene.tweens.add({
            targets: [this.leaveButton, this.leaveButtonText],
            alpha: 1,
            duration: GameConfig.TELEPORT.DIRECTION_MAP.FADE_DURATION,
            ease: 'Power2',
            delay: 300
        });
        
        // Animate reality buttons with staggered delay
        this.realityButtons.forEach((buttonData, index) => {
            this.scene.tweens.add({
                targets: [buttonData.button, buttonData.text],
                alpha: 1,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 500,
                ease: 'Back.easeOut',
                delay: 500 + (index * 100),
                onComplete: () => {
                    // Return to normal scale
                    this.scene.tweens.add({
                        targets: [buttonData.button, buttonData.text],
                        scaleX: 1,
                        scaleY: 1,
                        duration: 200,
                        ease: 'Power2'
                    });
                }
            });
        });
        
        // Add subtle floating animation
        this.scene.tweens.add({
            targets: this.directionMapSprite,
            y: this.directionMapSprite.y - 10,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        console.log('🗺️ Direction map displayed fullscreen with interactive elements');
    }
    
    /**
     * Schedule direction map auto-close
     */
    scheduleDirectionMapClose() {
        this.scene.time.delayedCall(GameConfig.TELEPORT.DIRECTION_MAP.DISPLAY_DURATION, () => {
            this.closeDirectionMap();
        });
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
        
        this.scene.tweens.add({
            targets: interactiveElements,
            alpha: 0,
            duration: 300,
            ease: 'Power2'
        });
        
        // Fade out direction map
        this.scene.tweens.add({
            targets: this.directionMapSprite,
            alpha: 0,
            scaleX: this.directionMapSprite.scaleX * 0.8,
            scaleY: this.directionMapSprite.scaleY * 0.8,
            duration: GameConfig.TELEPORT.DIRECTION_MAP.FADE_DURATION,
            ease: 'Power2',
            delay: 200,
            onComplete: () => {
                if (this.directionMapSprite) {
                    this.directionMapSprite.destroy();
                    this.directionMapSprite = null;
                }
            }
        });
        
        // Fade out overlay
        this.scene.tweens.add({
            targets: this.directionMapOverlay,
            alpha: 0,
            duration: GameConfig.TELEPORT.DIRECTION_MAP.FADE_DURATION,
            ease: 'Power2',
            delay: 200,
            onComplete: () => {
                if (this.directionMapOverlay) {
                    this.directionMapOverlay.destroy();
                    this.directionMapOverlay = null;
                }
                
                // Clean up interactive elements
                this.cleanupInteractiveElements();
                
                this.isDirectionMapActive = false;
                console.log('🎮 Ready for future scene transition...');
            }
        });
    }
    
    /**
     * Clean up interactive elements
     */
    cleanupInteractiveElements() {
        // Clean up leave button
        if (this.leaveButton) {
            this.leaveButton.destroy();
            this.leaveButton = null;
        }
        
        if (this.leaveButtonText) {
            this.leaveButtonText.destroy();
            this.leaveButtonText = null;
        }
        
        // Clean up reality buttons
        this.realityButtons.forEach(buttonData => {
            if (buttonData.button) {
                buttonData.button.destroy();
            }
            if (buttonData.text) {
                buttonData.text.destroy();
            }
        });
        this.realityButtons = [];
        
        // Clean up reality description
        this.hideRealityDescription();
    }
    
    /**
     * Get cave sprite for external reference
     */
    getCaveSprite() {
        return this.caveSprite;
    }
    
    /**
     * Get cave position
     */
    getCavePosition() {
        return {
            x: GameConfig.TELEPORT.CAVE.POSITION_X,
            y: GameConfig.TELEPORT.CAVE.POSITION_Y
        };
    }
    
    /**
     * Check if direction map is currently active
     */
    isDirectionMapDisplayed() {
        return this.isDirectionMapActive;
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        if (this.caveSprite) {
            this.caveSprite.destroy();
            this.caveSprite = null;
        }
        
        if (this.directionMapSprite) {
            this.directionMapSprite.destroy();
            this.directionMapSprite = null;
        }
        
        if (this.directionMapOverlay) {
            this.directionMapOverlay.destroy();
            this.directionMapOverlay = null;
        }
        
        // Clean up interactive elements
        this.cleanupInteractiveElements();
        
        this.isDirectionMapActive = false;
        this.playerInRange = false;
        this.hasTriggered = false;
    }
}