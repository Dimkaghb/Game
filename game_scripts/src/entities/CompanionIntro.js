/**
 * Companion Introduction System
 * Handles Bahreddin's appearance and guidance dialogue
 * Following Single Responsibility and Open/Closed Principles
 */
class CompanionIntro {
    constructor(scene) {
        this.scene = scene;
        this.companionSprite = null;
        this.overlay = null;
        this.dialogueText = null;
        this.currentDialogueIndex = 0;
        this.isActive = false;
        this.dialogueTimer = null;
        this.canSkip = false; // Flag to control when skipping is allowed
        this.skipClickHandler = null; // Store click handler reference
        this.skipHint = null; // Store skip hint reference
    }
    
    /**
     * Start the companion introduction sequence
     */
    startCompanionSequence() {
        if (this.isActive) return;
        
        console.log('🤝 Starting companion introduction sequence...');
        this.isActive = true;
        
        // Create overlay for companion scene
        this.createOverlay();
        
        // Create companion sprite
        this.createCompanionSprite();
        
        // Start entrance animation
        this.playEntranceAnimation();
        
        // Start dialogue sequence after entrance
        this.scene.time.delayedCall(GameConfig.COMPANION.ENTRANCE_DURATION, () => {
            this.startDialogueSequence();
        });
    }
    
    /**
     * Create overlay for companion scene
     */
    createOverlay() {
        this.overlay = this.scene.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH,
            GameConfig.GAME.HEIGHT,
            GameConfig.SCENE.INTRO_OVERLAY_COLOR,
            GameConfig.SCENE.INTRO_OVERLAY_ALPHA * 0.5 // Lighter overlay for companion
        );
        this.overlay.setScrollFactor(0);
        this.overlay.setDepth(100);
        
        // Fade in overlay
        this.overlay.setAlpha(0);
        this.scene.tweens.add({
            targets: this.overlay,
            alpha: GameConfig.SCENE.INTRO_OVERLAY_ALPHA * 0.5,
            duration: 800,
            ease: 'Power2'
        });
    }
    
    /**
     * Create companion sprite
     */
    createCompanionSprite() {
        // Position companion off-screen (left side)
        const startX = -100;
        const startY = GameConfig.GAME.HEIGHT / 2;
        
        this.companionSprite = this.scene.add.sprite(startX, startY, GameConfig.ASSETS.COMPANION.BAHREDDIN.KEY);
        this.companionSprite.setScale(GameConfig.COMPANION.SCALE);
        this.companionSprite.setScrollFactor(0);
        this.companionSprite.setDepth(101);
        
        // Add friendly glow effect
        this.companionSprite.setTint(0x88ff88);
    }
    
    /**
     * Play companion entrance animation
     */
    playEntranceAnimation() {
        // Calculate final position (left side of screen)
        const finalX = 150;
        const finalY = GameConfig.GAME.HEIGHT / 2;
        
        // Friendly entrance from left
        this.scene.tweens.add({
            targets: this.companionSprite,
            x: finalX,
            y: finalY,
            duration: GameConfig.COMPANION.ENTRANCE_DURATION,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                // Add gentle bobbing animation
                this.addBobbingAnimation();
            }
        });
        
        // Scale animation for friendly effect
        this.companionSprite.setScale(0);
        this.scene.tweens.add({
            targets: this.companionSprite,
            scaleX: GameConfig.COMPANION.SCALE,
            scaleY: GameConfig.COMPANION.SCALE,
            duration: GameConfig.COMPANION.ENTRANCE_DURATION,
            ease: 'Bounce.easeOut'
        });
    }
    
    /**
     * Add gentle bobbing animation to companion
     */
    addBobbingAnimation() {
        this.scene.tweens.add({
            targets: this.companionSprite,
            y: this.companionSprite.y - 5,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
    
    /**
     * Start dialogue sequence with companion
     */
    startDialogueSequence() {
        this.showNextDialogue();
    }
    
    /**
     * Show next companion dialogue
     */
    showNextDialogue() {
        if (this.currentDialogueIndex >= GameConfig.COMPANION.DIALOGUE.length) {
            this.startExitSequence();
            return;
        }
        
        const dialogue = GameConfig.COMPANION.DIALOGUE[this.currentDialogueIndex];
        
        // Remove previous dialogue if exists
        if (this.dialogueText) {
            this.dialogueText.destroy();
        }
        
        // Create dialogue text
        this.dialogueText = this.scene.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT - 120,
            dialogue,
            GameConfig.SCENE.COMPANION_TEXT_STYLE
        );
        this.dialogueText.setOrigin(0.5);
        this.dialogueText.setScrollFactor(0);
        this.dialogueText.setDepth(102);
        this.dialogueText.setWordWrapWidth(GameConfig.GAME.WIDTH - 100);
        
        // Faster friendly fade-in effect
        this.dialogueText.setAlpha(0);
        this.scene.tweens.add({
            targets: this.dialogueText,
            alpha: 1,
            duration: 400, // Reduced from 600 to 400ms
            ease: 'Power2',
            onComplete: () => {
                // Enable skipping after text appears
                this.enableSkipping();
            }
        });
        
        // Add gentle pulse effect for friendly feel (faster)
        this.scene.tweens.add({
            targets: this.dialogueText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 600, // Reduced from 800 to 600ms
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: 1
        });
        
        console.log(`🤝 Bahreddin: "${dialogue}" (Click to skip)`);
        
        // Schedule next dialogue
        this.currentDialogueIndex++;
        this.dialogueTimer = this.scene.time.delayedCall(GameConfig.COMPANION.DIALOGUE_DURATION, () => {
            this.disableSkipping();
            this.showNextDialogue();
        });
    }
    
    /**
     * Enable click-to-skip functionality
     */
    enableSkipping() {
        this.canSkip = true;
        
        // Create click handler
        this.skipClickHandler = () => {
            if (this.canSkip) {
                this.skipToNextDialogue();
            }
        };
        
        // Add click listener to the scene
        this.scene.input.on('pointerdown', this.skipClickHandler);
        
        // Add visual indicator
        if (this.dialogueText) {
            this.skipHint = this.scene.add.text(
                GameConfig.GAME.WIDTH - 20,
                GameConfig.GAME.HEIGHT - 20,
                'Click to skip →',
                {
                    fontSize: '14px',
                    fill: '#4ecdc4',
                    fontFamily: 'Arial'
                }
            );
            this.skipHint.setOrigin(1, 1);
            this.skipHint.setScrollFactor(0);
            this.skipHint.setDepth(103);
            this.skipHint.setAlpha(0.7);
            
            // Pulse animation for skip hint
            this.scene.tweens.add({
                targets: this.skipHint,
                alpha: 0.3,
                duration: 800,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    /**
     * Disable click-to-skip functionality
     */
    disableSkipping() {
        this.canSkip = false;
        
        // Remove click listener
        if (this.skipClickHandler) {
            this.scene.input.off('pointerdown', this.skipClickHandler);
            this.skipClickHandler = null;
        }
        
        // Remove skip hint
        if (this.skipHint) {
            this.skipHint.destroy();
            this.skipHint = null;
        }
    }
    
    /**
     * Skip to next dialogue immediately
     */
    skipToNextDialogue() {
        console.log('⏭️ Skipping to next dialogue...');
        
        // Cancel current timer
        if (this.dialogueTimer) {
            this.dialogueTimer.remove();
            this.dialogueTimer = null;
        }
        
        // Disable skipping for this dialogue
        this.disableSkipping();
        
        // Show next dialogue immediately
        this.showNextDialogue();
    }
    
    /**
     * Start companion exit sequence
     */
    startExitSequence() {
        console.log('🤝 Bahreddin is moving to guide Dimash...');
        
        // Show final quote
        if (this.dialogueText) {
            this.dialogueText.destroy();
        }
        
        this.dialogueText = this.scene.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT - 120,
            GameConfig.COMPANION.FINAL_QUOTE,
            GameConfig.SCENE.COMPANION_TEXT_STYLE
        );
        this.dialogueText.setOrigin(0.5);
        this.dialogueText.setScrollFactor(0);
        this.dialogueText.setDepth(102);
        
        // Animate final quote
        this.dialogueText.setAlpha(0);
        this.scene.tweens.add({
            targets: this.dialogueText,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Move companion to the right and disappear
        this.scene.time.delayedCall(2000, () => {
            this.moveCompanionToRight();
        });
    }
    
    /**
     * Move companion to the teleport cave
     */
    moveCompanionToRight() {
        // Change sprite to right-facing
        this.companionSprite.setTexture(GameConfig.ASSETS.COMPANION.BAHREDDIN_RIGHT.KEY);
        
        // Move to the teleport cave position
        const cavePosition = {
            x: GameConfig.TELEPORT.CAVE.POSITION_X,
            y: GameConfig.TELEPORT.CAVE.POSITION_Y
        };
        this.scene.tweens.add({
            targets: this.companionSprite,
            x: cavePosition.x,
            y: cavePosition.y,
            duration: GameConfig.COMPANION.EXIT_DURATION,
            ease: 'Power2.easeInOut',
            onComplete: () => {
                // Wait a moment at the cave, then disappear
                this.scene.time.delayedCall(1000, () => {
                    this.disappearAtCave();
                });
            }
        });
        
        // Fade out dialogue
        this.scene.tweens.add({
            targets: this.dialogueText,
            alpha: 0,
            duration: 1000,
            ease: 'Power2'
        });
        
        console.log('🤝 Bahreddin: "Follow me to the teleport cave!" *moves to the cave*');
    }
    
    /**
     * Make Bahreddin disappear at the cave
     */
    disappearAtCave() {
        // Fade out Bahreddin at the cave
        this.scene.tweens.add({
            targets: this.companionSprite,
            alpha: 0,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 1500,
            ease: 'Power2.easeOut',
            onComplete: () => {
                this.endCompanionSequence();
            }
        });
        
        console.log('🤝 Bahreddin disappears into the cave, waiting for Dimash...');
    }
    
    /**
     * End the companion sequence
     */
    endCompanionSequence() {
        console.log('🤝 Companion sequence complete! Bahreddin is now guiding from the right.');
        
        // Fade out overlay
        this.scene.tweens.add({
            targets: this.overlay,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                if (this.overlay) this.overlay.destroy();
            }
        });
        
        // Clean up
        this.scene.time.delayedCall(1000, () => {
            this.cleanup();
            console.log('🎮 Adventure continues with Bahreddin as your guide!');
        });
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        this.isActive = false;
        this.companionSprite = null;
        this.overlay = null;
        this.dialogueText = null;
        this.currentDialogueIndex = 0;
        
        // Clean up skip functionality
        this.disableSkipping();
        
        if (this.dialogueTimer) {
            this.dialogueTimer.remove();
            this.dialogueTimer = null;
        }
    }
    
    /**
     * Check if companion sequence is currently active
     */
    isCompanionActive() {
        return this.isActive;
    }
    
    /**
     * Check if intro sequence is currently active (alias for consistency)
     */
    isIntroActive() {
        return this.isActive;
    }
}