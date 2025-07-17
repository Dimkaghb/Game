/**
 * Villain Introduction System
 * Handles dramatic villain entrance and dialogue sequences
 * Following Single Responsibility and Open/Closed Principles
 */
class VillainIntro {
    constructor(scene) {
        this.scene = scene;
        this.villainSprite = null;
        this.overlay = null;
        this.dialogueText = null;
        this.currentQuoteIndex = 0;
        this.isActive = false;
        this.introTimer = null;
        this.dialogueTimer = null;
        this.canSkip = false; // Flag to control when skipping is allowed
        this.skipClickHandler = null; // Store click handler reference
    }
    
    /**
     * Start the villain introduction sequence
     */
    startIntroSequence() {
        if (this.isActive) return;
        
        console.log('🎭 Starting villain introduction sequence...');
        this.isActive = true;
        
        // Create dramatic overlay
        this.createOverlay();
        
        // Create villain sprite (initially hidden off-screen)
        this.createVillainSprite();
        
        // Start entrance animation
        this.playEntranceAnimation();
        
        // Start dialogue sequence after entrance
        this.scene.time.delayedCall(GameConfig.VILLAIN.ENTRANCE_DURATION, () => {
            this.startDialogueSequence();
        });
    }
    
    /**
     * Create dramatic overlay for cinematic effect
     */
    createOverlay() {
        this.overlay = this.scene.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH,
            GameConfig.GAME.HEIGHT,
            GameConfig.SCENE.INTRO_OVERLAY_COLOR,
            GameConfig.SCENE.INTRO_OVERLAY_ALPHA
        );
        this.overlay.setScrollFactor(0);
        this.overlay.setDepth(100);
        
        // Fade in overlay
        this.overlay.setAlpha(0);
        this.scene.tweens.add({
            targets: this.overlay,
            alpha: GameConfig.SCENE.INTRO_OVERLAY_ALPHA,
            duration: 1000,
            ease: 'Power2'
        });
    }
    
    /**
     * Create villain sprite
     */
    createVillainSprite() {
        // Position villain off-screen (top-right)
        const startX = GameConfig.GAME.WIDTH + 100;
        const startY = -100;
        
        this.villainSprite = this.scene.add.sprite(startX, startY, GameConfig.ASSETS.VILLAIN.ARMANSU.KEY);
        this.villainSprite.setScale(GameConfig.VILLAIN.SCALE);
        this.villainSprite.setScrollFactor(0);
        this.villainSprite.setDepth(101);
        
        // Add dramatic glow effect
        this.villainSprite.setTint(0xff6666);
    }
    
    /**
     * Play dramatic entrance animation
     */
    playEntranceAnimation() {
        // Calculate final position (top-right area of visible screen)
        const finalX = GameConfig.GAME.WIDTH - 150;
        const finalY = 120;
        
        // Dramatic entrance from top-right
        this.scene.tweens.add({
            targets: this.villainSprite,
            x: finalX,
            y: finalY,
            duration: GameConfig.VILLAIN.ENTRANCE_DURATION,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Add floating animation
                this.addFloatingAnimation();
            }
        });
        
        // Scale animation for dramatic effect
        this.villainSprite.setScale(0);
        this.scene.tweens.add({
            targets: this.villainSprite,
            scaleX: GameConfig.VILLAIN.SCALE,
            scaleY: GameConfig.VILLAIN.SCALE,
            duration: GameConfig.VILLAIN.ENTRANCE_DURATION,
            ease: 'Back.easeOut'
        });
    }
    
    /**
     * Add subtle floating animation to villain
     */
    addFloatingAnimation() {
        this.scene.tweens.add({
            targets: this.villainSprite,
            y: this.villainSprite.y - 10,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
    
    /**
     * Start dialogue sequence with villain quotes
     */
    startDialogueSequence() {
        this.showNextQuote();
    }
    
    /**
     * Show next villain quote
     */
    showNextQuote() {
        if (this.currentQuoteIndex >= GameConfig.VILLAIN.QUOTES.length) {
            this.endIntroSequence();
            return;
        }
        
        const quote = GameConfig.VILLAIN.QUOTES[this.currentQuoteIndex];
        
        // Remove previous dialogue if exists
        if (this.dialogueText) {
            this.dialogueText.destroy();
        }
        
        // Create dialogue text
        this.dialogueText = this.scene.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT - 100,
            quote,
            GameConfig.SCENE.TEXT_STYLE
        );
        this.dialogueText.setOrigin(0.5);
        this.dialogueText.setScrollFactor(0);
        this.dialogueText.setDepth(102);
        this.dialogueText.setWordWrapWidth(GameConfig.GAME.WIDTH - 100);
        
        // Faster typewriter effect
        this.dialogueText.setAlpha(0);
        this.scene.tweens.add({
            targets: this.dialogueText,
            alpha: 1,
            duration: 300, // Reduced from 500 to 300ms
            ease: 'Power2',
            onComplete: () => {
                // Enable skipping after text appears
                this.enableSkipping();
            }
        });
        
        // Add text shake effect for dramatic impact (faster)
        this.scene.tweens.add({
            targets: this.dialogueText,
            x: this.dialogueText.x + 2,
            duration: 80, // Reduced from 100 to 80ms
            ease: 'Power2',
            yoyo: true,
            repeat: 2 // Reduced from 3 to 2 repeats
        });
        
        console.log(`👹 Armansu: "${quote}" (Click to skip)`);
        
        // Schedule next quote
        this.currentQuoteIndex++;
        this.dialogueTimer = this.scene.time.delayedCall(GameConfig.VILLAIN.DIALOGUE_DURATION, () => {
            this.disableSkipping();
            this.showNextQuote();
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
                this.skipToNextQuote();
            }
        };
        
        // Add click listener to the scene
        this.scene.input.on('pointerdown', this.skipClickHandler);
        
        // Add visual indicator
        if (this.dialogueText) {
            const skipHint = this.scene.add.text(
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
            skipHint.setDepth(103);
            skipHint.setAlpha(0.7);
            
            // Store reference to remove later
            this.skipHint = skipHint;
            
            // Pulse animation for skip hint
            this.scene.tweens.add({
                targets: skipHint,
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
     * Skip to next quote immediately
     */
    skipToNextQuote() {
        console.log('⏭️ Skipping to next quote...');
        
        // Cancel current timer
        if (this.dialogueTimer) {
            this.dialogueTimer.remove();
            this.dialogueTimer = null;
        }
        
        // Disable skipping for this quote
        this.disableSkipping();
        
        // Show next quote immediately
        this.showNextQuote();
    }
    
    /**
     * End the introduction sequence
     */
    endIntroSequence() {
        console.log('🎭 Villain introduction sequence complete!');
        
        // Fade out all intro elements
        const elementsToFade = [this.villainSprite, this.overlay, this.dialogueText].filter(el => el);
        
        elementsToFade.forEach(element => {
            this.scene.tweens.add({
                targets: element,
                alpha: 0,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => {
                    if (element) element.destroy();
                }
            });
        });
        
        // Reset state and trigger companion sequence
        this.scene.time.delayedCall(1500, () => {
            this.cleanup();
            console.log('🎮 Villain scene complete, starting companion sequence...');
            
            // Trigger companion introduction
            if (this.scene.companionIntro) {
                this.scene.time.delayedCall(500, () => {
                    this.scene.companionIntro.startCompanionSequence();
                });
            }
        });
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        this.isActive = false;
        this.villainSprite = null;
        this.overlay = null;
        this.dialogueText = null;
        this.currentQuoteIndex = 0;
        
        // Clean up skip functionality
        this.disableSkipping();
        
        if (this.introTimer) {
            this.introTimer.remove();
            this.introTimer = null;
        }
        
        if (this.dialogueTimer) {
            this.dialogueTimer.remove();
            this.dialogueTimer = null;
        }
    }
    
    /**
     * Check if intro sequence is currently active
     */
    isIntroActive() {
        return this.isActive;
    }
}