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
        this.clickableIndicator = null;
        
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
        
        // Load medal images for achievement display
        this.load.image('medal_docker', 'assets/gaming_items/docker.png');
        this.load.image('medal_insta', 'assets/gaming_items/insta.png');
        this.load.image('medal_coin', 'assets/gaming_items/coin.png');
        this.load.image('medal_heart', 'assets/gaming_items/heart.png');
    }
    
    /**
     * Create scene objects
     */
    create() {
        console.log('🏠 Creating Bahreddin\'s Home Scene...');
        
        // Initialize scene state
        this.initializeSceneState();
        
        // Create background
        this.createBackground();
        
        // Initialize input manager
        this.inputManager = new InputManager(this);
        
        // Create Bahreddin in the middle
        this.createBahreddin();
        
        // Create player (Dimash) off-screen to the right
        this.createPlayer();
        
        // Create door (always available)
        this.createDoor();
        
        // Setup camera
        this.setupCamera();
        
        // Create UI
        this.createUI();
        
        // Check if this is a return from another scene
        const gameStateManager = new GameStateManager();
        const currentState = gameStateManager.loadGameState();
        
        // Check if player has completed any scene, skip intro if so
        const hasCompletedAnyScene = gameStateManager.isSceneCompleted('DianaScene') || 
                                   gameStateManager.isSceneCompleted('BernarScene') || 
                                   gameStateManager.isSceneCompleted('AsselyaScene');
        
        if (hasCompletedAnyScene) {
            console.log('🎓 Scene completed - skipping intro');
            this.isIntroActive = false;
            this.hasIntroStarted = true;
            
            // Position player in the scene immediately
            this.player.getSprite().setPosition(
                GameConfig.GAME.WIDTH / 2 + 150,
                GameConfig.GAME.HEIGHT / 2 + 50
            );
            
            this.showClickableIndicator();
        } else {
            // Start the intro sequence after a short delay
            this.time.delayedCall(1000, () => {
                this.startIntroSequence();
            });
        }
        
        // Check for Armansu message after a short delay
        this.time.delayedCall(2000, () => {
            this.checkForArmansusMessage();
        });
        
        console.log('✅ Bahreddin\'s Home Scene created successfully!');
    }
    
    /**
     * Initialize scene state to prevent overlapping issues
     */
    initializeSceneState() {
        // Clear any existing dialogue elements
        this.activeDialogueOverlay = null;
        this.activeDialogueText = null;
        this.activeSkipHint = null;
        this.skipHintTween = null;
        this.dialogueTimer = null;
        this.skipHandler = null;
        this.dialogueSkipped = false;
        
        // Clear choice system elements
        this.choiceContainer = null;
        this.mentorChoiceContainer = null;
        this.choiceButtons = [];
        this.mentorChoiceButtons = [];
        this.choiceOverlay = null;
        this.mentorChoiceOverlay = null;
        this.choiceKeyHandler = null;
        this.mentorChoiceKeyHandler = null;
        
        // Clear tutorial state
        this.currentTutorialIndex = 0;
        
        // Reset direction map state
        this.isDirectionMapActive = false;
        this.directionMapOverlay = null;
        this.directionMapSprite = null;
        this.leaveButton = null;
        this.leaveButtonText = null;
        this.realityButtons = [];
        this.realityDescriptionBox = null;
        
        // Initialize medal display elements
        this.medalDisplayElements = [];
        this.medalTooltip = null;
        
        console.log('🔄 Scene state initialized');
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
        
        // Make Bahreddin interactive
        this.bahreddin.setInteractive({ useHandCursor: true });
        
        // Add click handler to show choice system
        this.bahreddin.on('pointerdown', () => {
            // Only allow interaction if intro is not active and direction map is not active
            if (!this.isIntroActive && !this.isDirectionMapActive) {
                console.log('🎯 Bahreddin clicked! Showing choice system...');
                this.showChoiceSystem();
            } else {
                console.log('⏳ Cannot interact with Bahreddin during intro sequence or when direction map is active');
            }
        });
        
        // Add hover effects
        this.bahreddin.on('pointerover', () => {
            if (!this.isIntroActive && !this.isDirectionMapActive) {
                // Slight glow effect on hover
                this.bahreddin.setTint(0xffff99); // Light yellow tint
                this.tweens.add({
                    targets: this.bahreddin,
                    scaleX: GameConfig.COMPANION.SCALE * 1.05,
                    scaleY: GameConfig.COMPANION.SCALE * 1.05,
                    duration: 150,
                    ease: 'Power2'
                });
            }
        });
        
        this.bahreddin.on('pointerout', () => {
            if (!this.isIntroActive && !this.isDirectionMapActive) {
                // Remove glow effect
                this.bahreddin.clearTint();
                this.tweens.add({
                    targets: this.bahreddin,
                    scaleX: GameConfig.COMPANION.SCALE,
                    scaleY: GameConfig.COMPANION.SCALE,
                    duration: 150,
                    ease: 'Power2'
                });
            }
        });
        
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
     * Create UI elements including medal display
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
        
        // Medal display
        this.createMedalDisplay();
        
        // Store medal display elements for cleanup
        this.medalDisplayElements = [];
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
     * Create medal display showing earned achievements
     */
    createMedalDisplay() {
        // Clean up existing medal display
        this.cleanupMedalDisplay();
        
        const achievementManager = new AchievementManager();
        const earnedMedals = achievementManager.getEarnedMedals();
        
        // Medal display title
        const medalTitle = this.add.text(
            50,
            GameConfig.GAME.HEIGHT - 150,
            'Earned Medals:',
            {
                fontSize: '18px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2,
                fontFamily: 'Arial'
            }
        );
        medalTitle.setScrollFactor(0);
        medalTitle.setDepth(100);
        this.medalDisplayElements.push(medalTitle);
        
        // Create medal display area
        const medalContainer = this.add.container(50, GameConfig.GAME.HEIGHT - 120);
        medalContainer.setScrollFactor(0);
        medalContainer.setDepth(100);
        this.medalDisplayElements.push(medalContainer);
        
        // Map scene keys to medal image keys
        const medalImageMap = {
            'BernarScene': 'medal_docker',
            'AsselyaScene': 'medal_insta',
            'DianaScene': 'medal_coin',
            'AbayScene': 'medal_heart'
        };
        
        // Display earned medals
        earnedMedals.forEach((medal, index) => {
            const medalImageKey = medalImageMap[medal.sceneKey];
            if (medalImageKey) {
                // Create medal image
                const medalImage = this.add.image(index * 60, 0, medalImageKey);
                medalImage.setScale(0.4); // Scale down the medal
                medalImage.setScrollFactor(0);
                medalImage.setDepth(101);
                medalImage.setInteractive();
                
                // Add glow effect for earned medals
                medalImage.setTint(0xffffff);
                
                // Add hover effect to show medal info
                medalImage.on('pointerover', () => {
                    medalImage.setScale(0.5);
                    this.showMedalTooltip(medal, medalImage.x + 50, medalImage.y + GameConfig.GAME.HEIGHT - 120);
                });
                
                medalImage.on('pointerout', () => {
                    medalImage.setScale(0.4);
                    this.hideMedalTooltip();
                });
                
                medalContainer.add(medalImage);
            }
        });
        
        // Show placeholder slots for unearned medals
        const allMentors = ['BernarScene', 'AsselyaScene', 'DianaScene', 'AbayScene'];
        const earnedScenes = earnedMedals.map(medal => medal.sceneKey);
        
        allMentors.forEach((sceneKey, index) => {
            if (!earnedScenes.includes(sceneKey)) {
                const medalImageKey = medalImageMap[sceneKey];
                if (medalImageKey) {
                    // Create grayed out placeholder
                    const placeholderMedal = this.add.image(index * 60, 0, medalImageKey);
                    placeholderMedal.setScale(0.4);
                    placeholderMedal.setScrollFactor(0);
                    placeholderMedal.setDepth(101);
                    placeholderMedal.setTint(0x666666); // Gray tint for unearned
                    placeholderMedal.setAlpha(0.5); // Semi-transparent
                    
                    medalContainer.add(placeholderMedal);
                }
            }
        });
    }
    
    /**
     * Clean up medal display elements
     */
    cleanupMedalDisplay() {
        if (this.medalDisplayElements) {
            this.medalDisplayElements.forEach(element => {
                if (element && element.destroy) {
                    element.destroy();
                }
            });
            this.medalDisplayElements = [];
        }
        this.hideMedalTooltip();
    }
    
    /**
     * Refresh medal display (useful when achievements are updated)
     */
    refreshMedalDisplay() {
        this.createMedalDisplay();
    }
    
    /**
     * Show medal tooltip with information
     */
    showMedalTooltip(medal, x, y) {
        // Remove existing tooltip
        this.hideMedalTooltip();
        
        // Create tooltip background
        this.medalTooltip = this.add.rectangle(x, y - 50, 200, 60, 0x000000, 0.9);
        this.medalTooltip.setScrollFactor(0);
        this.medalTooltip.setDepth(200);
        
        // Create tooltip text
        this.medalTooltipText = this.add.text(x, y - 50, `${medal.name}\n${medal.description}`, {
            fontSize: '12px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 180 }
        });
        this.medalTooltipText.setOrigin(0.5);
        this.medalTooltipText.setScrollFactor(0);
        this.medalTooltipText.setDepth(201);
    }
    
    /**
     * Hide medal tooltip
     */
    hideMedalTooltip() {
        if (this.medalTooltip) {
            this.medalTooltip.destroy();
            this.medalTooltip = null;
        }
        if (this.medalTooltipText) {
            this.medalTooltipText.destroy();
            this.medalTooltipText = null;
        }
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
                        // Complete intro sequence and enable Bahreddin interaction
                        this.isIntroActive = false;
                        console.log('✅ Intro sequence completed - Bahreddin is now clickable');
                        this.showClickableIndicator();
                    });
                });
            }
        });
    }
    
    /**
     * Show clickable indicator above Bahreddin
     */
    showClickableIndicator() {
        // Create a pulsing "Click me!" indicator above Bahreddin
        this.clickableIndicator = this.add.text(
            this.bahreddin.x,
            this.bahreddin.y - 80,
            '💬 Click me!',
            {
                fontSize: '16px',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 2,
                fontFamily: 'Arial'
            }
        );
        this.clickableIndicator.setOrigin(0.5);
        this.clickableIndicator.setDepth(15);
        
        // Add pulsing animation
        this.tweens.add({
            targets: this.clickableIndicator,
            alpha: 0.3,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Auto-hide indicator after 10 seconds
        this.time.delayedCall(10000, () => {
            if (this.clickableIndicator) {
                this.clickableIndicator.destroy();
                this.clickableIndicator = null;
            }
        });
    }
    
    /**
     * Hide clickable indicator when choice system is shown
     */
    hideClickableIndicator() {
        if (this.clickableIndicator) {
            this.clickableIndicator.destroy();
            this.clickableIndicator = null;
        }
    }
    
    /**
     * Show choice system after Bahreddin's quote
     */
    showChoiceSystem() {
        console.log('🎮 Showing original choice system...');
        
        // Hide the clickable indicator
        this.hideClickableIndicator();
        
        // Show original choices first
        this.showOriginalChoiceSystem();
    }
    
    /**
     * Show mentor tutorial sequence
     */
    showMentorTutorial() {
        console.log('📚 Starting mentor tutorial...');
        
        let currentDialogueIndex = 0;
        const tutorialTexts = GameConfig.MENTORS.TUTORIAL_TEXT;
        
        const showNextDialogue = () => {
            if (currentDialogueIndex < tutorialTexts.length) {
                this.showDialogue(tutorialTexts[currentDialogueIndex], () => {
                    currentDialogueIndex++;
                    showNextDialogue();
                });
            } else {
                // Tutorial complete, show mentor choices
                console.log('✅ Mentor tutorial complete, showing mentor choices...');
                this.showMentorChoiceSystem();
            }
        };
        
        showNextDialogue();
    }
    
    /**
     * Show mentor choice system
     */
    showMentorChoiceSystem() {
        console.log('🎮 Showing mentor choice system...');
        
        // Create overlay
        const overlay = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH - 100,
            350, // Increased height to prevent overflow
            0x000000,
            0.9
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(200);
        
        // Create question text
        const questionText = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 - 100,
            'What would you like to know?',
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: GameConfig.GAME.WIDTH - 150 }
            }
        );
        questionText.setOrigin(0.5);
        questionText.setScrollFactor(0);
        questionText.setDepth(201);
        
        // Create choice buttons with better positioning
        const choice1Button = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 - 40,
            GameConfig.CHOICE_SYSTEM.MENTOR_CHOICES.BERNAR_MCDONALDS.TEXT,
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                backgroundColor: '#4ecdc4',
                padding: { x: 15, y: 10 },
                align: 'center',
                wordWrap: { width: GameConfig.GAME.WIDTH - 200 }
            }
        );
        choice1Button.setOrigin(0.5);
        choice1Button.setScrollFactor(0);
        choice1Button.setDepth(201);
        choice1Button.setInteractive({ useHandCursor: true });
        
        const choice2Button = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 + 20,
            GameConfig.CHOICE_SYSTEM.MENTOR_CHOICES.WHAT_TO_DO.TEXT,
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                backgroundColor: '#4ecdc4',
                padding: { x: 15, y: 10 },
                align: 'center',
                wordWrap: { width: GameConfig.GAME.WIDTH - 200 }
            }
        );
        choice2Button.setOrigin(0.5);
        choice2Button.setScrollFactor(0);
        choice2Button.setDepth(201);
        choice2Button.setInteractive({ useHandCursor: true });
        
        // Store references for cleanup
        this.mentorChoiceOverlay = overlay;
        this.mentorChoiceButtons = [choice1Button, choice2Button];
        
        // Add hover effects
        this.addChoiceButtonHoverEffects(choice1Button);
        this.addChoiceButtonHoverEffects(choice2Button);
        
        // Handle choice 1 - Bernar McDonalds
        choice1Button.on('pointerdown', () => {
            console.log('🍟 Player asked about Bernar and McDonalds');
            this.cleanupChoiceSystem(overlay, questionText, choice1Button, choice2Button);
            this.showDialogue(GameConfig.CHOICE_SYSTEM.MENTOR_CHOICES.BERNAR_MCDONALDS.RESPONSE, () => {
                console.log('✅ Bernar choice completed - showing original choices');
                this.showOriginalChoiceSystem();
            });
        });
        
        // Handle choice 2 - What to do
        choice2Button.on('pointerdown', () => {
            console.log('❓ Player asked what to do');
            this.cleanupChoiceSystem(overlay, questionText, choice1Button, choice2Button);
            this.showDialogue(GameConfig.CHOICE_SYSTEM.MENTOR_CHOICES.WHAT_TO_DO.RESPONSE, () => {
                console.log('✅ What to do choice completed - Bahreddin is clickable again');
                this.showClickableIndicator();
            });
        });
        
        // Add keyboard support for mentor choices
        this.addMentorChoiceKeyboardSupport(overlay, questionText, choice1Button, choice2Button);
    }
    
    /**
     * Show original choice system (Ask Bahreddin / Hit Bahreddin)
     */
    showOriginalChoiceSystem() {
        console.log('🎮 Showing original choice system...');
        
        // Create overlay
        const overlay = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH - 100,
            350, // Increased height to prevent overflow
            0x000000,
            0.9
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(200);
        
        // Create question text
        const questionText = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 - 100,
            GameConfig.CHOICE_SYSTEM.QUESTION_TEXT,
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: GameConfig.GAME.WIDTH - 150 }
            }
        );
        questionText.setOrigin(0.5);
        questionText.setScrollFactor(0);
        questionText.setDepth(201);
        
        // Create choice buttons with better positioning
        const choice1Button = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 - 40,
            GameConfig.CHOICE_SYSTEM.CHOICES.ASK_BAHREDDIN.TEXT,
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                backgroundColor: '#4ecdc4',
                padding: { x: 15, y: 10 },
                align: 'center',
                wordWrap: { width: GameConfig.GAME.WIDTH - 200 }
            }
        );
        choice1Button.setOrigin(0.5);
        choice1Button.setScrollFactor(0);
        choice1Button.setDepth(201);
        choice1Button.setInteractive({ useHandCursor: true });
        
        const choice2Button = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 + 20,
            GameConfig.CHOICE_SYSTEM.CHOICES.HIT_BAHREDDIN.TEXT,
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                backgroundColor: '#4ecdc4',
                padding: { x: 15, y: 10 },
                align: 'center',
                wordWrap: { width: GameConfig.GAME.WIDTH - 200 }
            }
        );
        choice2Button.setOrigin(0.5);
        choice2Button.setScrollFactor(0);
        choice2Button.setDepth(201);
        choice2Button.setInteractive({ useHandCursor: true });
        
        // Store references for cleanup
        this.choiceOverlay = overlay;
        this.choiceButtons = [choice1Button, choice2Button];
        
        // Add hover effects
        this.addChoiceButtonHoverEffects(choice1Button);
        this.addChoiceButtonHoverEffects(choice2Button);
        
        // Handle choice 1 - What I need to do now (triggers mentor tutorial)
        choice1Button.on('pointerdown', () => {
            console.log('❓ Player asked what they need to do - starting mentor tutorial');
            this.cleanupChoiceSystem(overlay, questionText, choice1Button, choice2Button);
            this.showMentorTutorial();
        });
        
        // Handle choice 2 - Hit Bahreddin
        choice2Button.on('pointerdown', () => {
            console.log('👊 Player chose to hit Bahreddin');
            this.cleanupChoiceSystem(overlay, questionText, choice1Button, choice2Button);
            this.performHittingAction();
        });
        
        // Add keyboard support
        this.addChoiceKeyboardSupport(overlay, questionText, choice1Button, choice2Button);
    }
    
    /**
     * Add hover effects to choice buttons
     */
    addChoiceButtonHoverEffects(button) {
        button.on('pointerover', () => {
            button.setStyle({ backgroundColor: '#45b7aa' });
            this.tweens.add({
                targets: button,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100,
                ease: 'Power2'
            });
        });
        
        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: '#4ecdc4' });
            this.tweens.add({
                targets: button,
                scaleX: 1.0,
                scaleY: 1.0,
                duration: 100,
                ease: 'Power2'
            });
        });
    }
    
    /**
     * Add keyboard support for choices
     */
    addChoiceKeyboardSupport(overlay, questionText, choice1Button, choice2Button) {
        const keyHandler = (event) => {
            if (event.key === '1') {
                console.log('❓ Player asked what they need to do - starting mentor tutorial (keyboard)');
                this.cleanupChoiceSystem(overlay, questionText, choice1Button, choice2Button);
                this.input.keyboard.off('keydown', keyHandler);
                this.showMentorTutorial();
            } else if (event.key === '2' || event.key === 'Enter') {
                console.log('👊 Player chose to hit Bahreddin (keyboard)');
                this.cleanupChoiceSystem(overlay, questionText, choice1Button, choice2Button);
                this.input.keyboard.off('keydown', keyHandler);
                this.performHittingAction();
            }
        };
        
        this.input.keyboard.on('keydown', keyHandler);
    }
    
    /**
     * Add keyboard support for mentor choices
     */
    addMentorChoiceKeyboardSupport(overlay, questionText, choice1Button, choice2Button) {
        const keyHandler = (event) => {
            if (event.key === '1') {
                console.log('🍟 Player asked about Bernar and McDonalds (keyboard)');
                this.cleanupChoiceSystem(overlay, questionText, choice1Button, choice2Button);
                this.input.keyboard.off('keydown', keyHandler);
                this.showDialogue(GameConfig.CHOICE_SYSTEM.MENTOR_CHOICES.BERNAR_MCDONALDS.RESPONSE, () => {
                    console.log('✅ Bernar choice completed - showing original choices');
                    this.showOriginalChoiceSystem();
                });
            } else if (event.key === '2' || event.key === 'Enter') {
                console.log('❓ Player asked what to do (keyboard)');
                this.cleanupChoiceSystem(overlay, questionText, choice1Button, choice2Button);
                this.input.keyboard.off('keydown', keyHandler);
                this.showDialogue(GameConfig.CHOICE_SYSTEM.MENTOR_CHOICES.WHAT_TO_DO.RESPONSE, () => {
                    console.log('✅ What to do choice completed - Bahreddin is clickable again');
                    this.showClickableIndicator();
                });
            }
        };
        
        this.input.keyboard.on('keydown', keyHandler);
    }
    
    /**
     * Clean up choice system elements
     */
    cleanupChoiceSystem(overlay, questionText, choice1Button, choice2Button) {
        console.log('🧹 Cleaning up choice system...');
        
        try {
            // Clean up any active dialogue first
            this.cleanupActiveDialogue();
            
            // Remove keyboard listeners safely
            if (this.choiceKeyHandler) {
                try {
                    this.input.keyboard.off('keydown', this.choiceKeyHandler);
                } catch (error) {
                    console.warn('⚠️ Error removing choice key handler:', error);
                }
                this.choiceKeyHandler = null;
            }
            
            if (this.mentorChoiceKeyHandler) {
                try {
                    this.input.keyboard.off('keydown', this.mentorChoiceKeyHandler);
                } catch (error) {
                    console.warn('⚠️ Error removing mentor choice key handler:', error);
                }
                this.mentorChoiceKeyHandler = null;
            }
            
            // Disable interactions immediately to prevent double-clicks
            if (choice1Button && choice1Button.removeInteractive) {
                try {
                    choice1Button.removeInteractive();
                } catch (error) {
                    console.warn('⚠️ Error removing choice1Button interaction:', error);
                }
            }
            if (choice2Button && choice2Button.removeInteractive) {
                try {
                    choice2Button.removeInteractive();
                } catch (error) {
                    console.warn('⚠️ Error removing choice2Button interaction:', error);
                }
            }
            
            // Clean up passed elements (for backward compatibility)
            const elementsToDestroy = [overlay, questionText, choice1Button, choice2Button];
            elementsToDestroy.forEach((element, index) => {
                if (element && element.destroy && typeof element.destroy === 'function') {
                    try {
                        element.destroy();
                    } catch (error) {
                        console.warn(`⚠️ Error destroying element ${index}:`, error);
                    }
                }
            });
            
            // Clean up choice containers
            if (this.choiceContainer && this.choiceContainer.destroy) {
                try {
                    this.choiceContainer.destroy();
                } catch (error) {
                    console.warn('⚠️ Error destroying choice container:', error);
                }
                this.choiceContainer = null;
            }
            
            if (this.mentorChoiceContainer && this.mentorChoiceContainer.destroy) {
                try {
                    this.mentorChoiceContainer.destroy();
                } catch (error) {
                    console.warn('⚠️ Error destroying mentor choice container:', error);
                }
                this.mentorChoiceContainer = null;
            }
            
            // Clean up individual choice elements
            if (this.choiceButtons && Array.isArray(this.choiceButtons)) {
                this.choiceButtons.forEach((button, index) => {
                    if (button && button.destroy && typeof button.destroy === 'function') {
                        try {
                            if (button.removeInteractive) {
                                button.removeInteractive();
                            }
                            button.destroy();
                        } catch (error) {
                            console.warn(`⚠️ Error destroying choice button ${index}:`, error);
                        }
                    }
                });
                this.choiceButtons = [];
            }
            
            if (this.mentorChoiceButtons && Array.isArray(this.mentorChoiceButtons)) {
                this.mentorChoiceButtons.forEach((button, index) => {
                    if (button && button.destroy && typeof button.destroy === 'function') {
                        try {
                            if (button.removeInteractive) {
                                button.removeInteractive();
                            }
                            button.destroy();
                        } catch (error) {
                            console.warn(`⚠️ Error destroying mentor choice button ${index}:`, error);
                        }
                    }
                });
                this.mentorChoiceButtons = [];
            }
            
            // Clean up choice overlays
            if (this.choiceOverlay && this.choiceOverlay.destroy) {
                try {
                    this.choiceOverlay.destroy();
                } catch (error) {
                    console.warn('⚠️ Error destroying choice overlay:', error);
                }
                this.choiceOverlay = null;
            }
            
            if (this.mentorChoiceOverlay && this.mentorChoiceOverlay.destroy) {
                try {
                    this.mentorChoiceOverlay.destroy();
                } catch (error) {
                    console.warn('⚠️ Error destroying mentor choice overlay:', error);
                }
                this.mentorChoiceOverlay = null;
            }
            
        } catch (error) {
            console.error('❌ Error during choice system cleanup:', error);
        }
        
        console.log('✅ Choice system cleanup complete');
    }
    
    /**
     * Perform hitting action with animation
     */
    performHittingAction() {
        console.log('💥 Performing hitting action...');
        
        // Determine which hitting sprite to use based on player position relative to Bahreddin
        const playerX = this.player.getSprite().x;
        const bahreddinX = this.bahreddin.x;
        const isPlayerOnRight = playerX > bahreddinX;
        
        // Get the appropriate hitting sprite
        const hittingKey = isPlayerOnRight ? 
            GameConfig.ASSETS.PLAYER.HITTING_FROM_RIGHT.KEY : 
            GameConfig.ASSETS.PLAYER.HITTING_FROM_LEFT.KEY;
        
        // Create hitting sprite
        const hittingSprite = this.add.sprite(
            this.player.getSprite().x,
            this.player.getSprite().y,
            hittingKey
        );
        hittingSprite.setScale(GameConfig.PLAYER.SCALE);
        hittingSprite.setDepth(15);
        
        // Hide original player sprite temporarily
        this.player.getSprite().setVisible(false);
        
        // Animate hitting action
        this.tweens.add({
            targets: hittingSprite,
            x: isPlayerOnRight ? bahreddinX + 30 : bahreddinX - 30,
            duration: GameConfig.CHOICE_SYSTEM.HITTING_ANIMATION.DURATION / 2,
            ease: 'Power2',
            onComplete: () => {
                // Flash effect on Bahreddin
                this.createHitFlashEffect();
                
                // Shake Bahreddin
                this.tweens.add({
                    targets: this.bahreddin,
                    x: bahreddinX + GameConfig.CHOICE_SYSTEM.HITTING_ANIMATION.SHAKE_INTENSITY,
                    duration: 50,
                    ease: 'Power2',
                    yoyo: true,
                    repeat: 3,
                    onComplete: () => {
                        // Return hitting sprite to original position
                        this.tweens.add({
                            targets: hittingSprite,
                            x: this.player.getSprite().x,
                            duration: GameConfig.CHOICE_SYSTEM.HITTING_ANIMATION.DURATION / 2,
                            ease: 'Power2',
                            onComplete: () => {
                                // Clean up hitting sprite and show original player
                                hittingSprite.destroy();
                                this.player.getSprite().setVisible(true);
                                
                                // Show Bahreddin's response
                                this.showDialogue(GameConfig.CHOICE_SYSTEM.CHOICES.HIT_BAHREDDIN.RESPONSE, () => {
                                    console.log('✅ Choice completed - Bahreddin is clickable again');
                                    this.showClickableIndicator();
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    
    /**
     * Create flash effect when hitting
     */
    createHitFlashEffect() {
        const flash = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH,
            GameConfig.GAME.HEIGHT,
            GameConfig.CHOICE_SYSTEM.HITTING_ANIMATION.FLASH_COLOR,
            0.3
        );
        flash.setScrollFactor(0);
        flash.setDepth(100);
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: GameConfig.CHOICE_SYSTEM.HITTING_ANIMATION.FLASH_DURATION,
            ease: 'Power2',
            onComplete: () => {
                flash.destroy();
            }
        });
    }

    /**
     * Show dialogue text with improved management
     */
    showDialogue(text, onComplete) {
        // Clean up any existing dialogue first
        this.cleanupActiveDialogue();
        
        console.log('💬 Showing dialogue:', text.substring(0, 50) + '...');
        
        // Create dialogue overlay
        this.activeDialogueOverlay = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT - 100,
            GameConfig.GAME.WIDTH - 100,
            100, // Increased height for better text display
            0x000000,
            0.9 // Increased opacity for better readability
        );
        this.activeDialogueOverlay.setScrollFactor(0);
        this.activeDialogueOverlay.setDepth(300); // Higher depth to ensure it's on top
        
        // Create dialogue text
        this.activeDialogueText = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT - 100,
            text,
            {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: GameConfig.GAME.WIDTH - 150 },
                lineSpacing: 5
            }
        );
        this.activeDialogueText.setOrigin(0.5);
        this.activeDialogueText.setScrollFactor(0);
        this.activeDialogueText.setDepth(301);
        
        // Add skip hint
        this.activeSkipHint = this.add.text(
            GameConfig.GAME.WIDTH - 20,
            GameConfig.GAME.HEIGHT - 20,
            'Click to continue →',
            {
                fontSize: '14px',
                fill: '#ffff99',
                fontFamily: 'Arial'
            }
        );
        this.activeSkipHint.setOrigin(1, 1);
        this.activeSkipHint.setScrollFactor(0);
        this.activeSkipHint.setDepth(302);
        this.activeSkipHint.setAlpha(0.8);
        
        // Pulse animation for skip hint
        this.skipHintTween = this.tweens.add({
            targets: this.activeSkipHint,
            alpha: 0.4,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Click to skip functionality
        this.dialogueSkipped = false;
        this.skipHandler = () => {
            if (!this.dialogueSkipped) {
                this.dialogueSkipped = true;
                console.log('⏭️ Continuing dialogue...');
                
                this.cleanupActiveDialogue();
                
                if (onComplete) {
                    onComplete();
                }
            }
        };
        
        // Add click listener
        this.input.on('pointerdown', this.skipHandler);
        
        // Auto-remove dialogue after 3 seconds
        this.dialogueTimer = this.time.delayedCall(3000, () => {
            if (!this.dialogueSkipped) {
                this.dialogueSkipped = true;
                this.cleanupActiveDialogue();
                
                if (onComplete) {
                    onComplete();
                }
            }
        });
    }
    
    /**
     * Clean up active dialogue elements
     */
    cleanupActiveDialogue() {
        // Remove click listener
        if (this.skipHandler) {
            this.input.off('pointerdown', this.skipHandler);
            this.skipHandler = null;
        }
        
        // Clear timer
        if (this.dialogueTimer) {
            this.dialogueTimer.destroy();
            this.dialogueTimer = null;
        }
        
        // Stop tween
        if (this.skipHintTween) {
            this.skipHintTween.destroy();
            this.skipHintTween = null;
        }
        
        // Destroy dialogue elements
        if (this.activeDialogueOverlay) {
            this.activeDialogueOverlay.destroy();
            this.activeDialogueOverlay = null;
        }
        
        if (this.activeDialogueText) {
            this.activeDialogueText.destroy();
            this.activeDialogueText = null;
        }
        
        if (this.activeSkipHint) {
            this.activeSkipHint.destroy();
            this.activeSkipHint = null;
        }
        
        this.dialogueSkipped = false;
    }
    
    /**
     * Return to main scene
     */
    returnToMainScene() {
        console.log('🔄 Returning to main scene...');
        
        // Save game state before transition
        const gameStateManager = new GameStateManager();
        gameStateManager.setCurrentScene('GameScene');
        
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
        
        // Check if this is Diana - navigate to Diana scene
        if (reality.NAME === 'Diana') {
            console.log('🎭 Navigating to Diana Scene...');
            
            // Save game state before transition
            const gameStateManager = new GameStateManager();
            gameStateManager.setCurrentScene('DianaScene');
            
            this.scene.start('DianaScene');
            return;
        }
        
        // Check if this is Asselya - navigate to Asselya scene
        if (reality.NAME === 'Asselya') {
            console.log('📱 Navigating to Asselya Scene...');
            
            // Save game state before transition
            const gameStateManager = new GameStateManager();
            gameStateManager.setCurrentScene('AsselyaScene');
            
            this.scene.start('AsselyaScene');
            return;
        }
        
        // Check if this is Bernar - navigate to Bernar scene
        if (reality.NAME === 'Bernar') {
            console.log('🐍 Navigating to Bernar Scene...');
            
            // Save game state before transition
            const gameStateManager = new GameStateManager();
            gameStateManager.setCurrentScene('BernarScene');
            
            this.scene.start('BernarScene');
            return;
        }
        
        // Check if this is Abay - navigate to Abay scene
        if (reality.NAME === 'Abay') {
            console.log('🏁 Navigating to Abay Scene...');
            
            // Save game state before transition
            const gameStateManager = new GameStateManager();
            gameStateManager.setCurrentScene('AbayScene');
            
            this.scene.start('AbayScene');
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
     * Check if all mentor achievements are unlocked and show Armansu message
     */
    checkForArmansusMessage() {
        const achievementManager = new AchievementManager();
        
        // Check if all mentor achievements are unlocked
        if (achievementManager.hasAllMentorAchievements()) {
            console.log('🏆 All mentor achievements unlocked! Showing Armansu message...');
            this.showArmansusMessage();
        }
    }
    
    /**
     * Show Armansu waiting message
     */
    showArmansusMessage() {
        // Create overlay
        const overlay = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH,
            GameConfig.GAME.HEIGHT,
            0x000000,
            0.8
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(300);
        
        // Create message container
        const messageContainer = this.add.container(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2
        );
        messageContainer.setScrollFactor(0);
        messageContainer.setDepth(301);
        
        // Create background for message
        const messageBg = this.add.rectangle(0, 0, 600, 300, 0x2c3e50, 0.95);
        messageBg.setStrokeStyle(4, 0xf39c12);
        
        // Create title
        const title = this.add.text(0, -80, '🌟 CONGRATULATIONS! 🌟', {
            fontSize: '28px',
            fill: '#f39c12',
            fontFamily: 'Arial',
            align: 'center',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        
        // Create main message
        const message = this.add.text(0, -20, 
            'You have collected all mentor medals!\n\n' +
            '🐳 Docker Medal (Bernar\'s Courage)\n' +
            '📷 Instagram Medal (Asselya\'s Grace)\n' +
            '🪙 Coin Medal (Diana\'s Wisdom)\n' +
            '❤️ Heart Medal (Abay\'s Speed)\n\n' +
            '✨ Armansu is now waiting for you! ✨', {
            fontSize: '18px',
            fill: '#ecf0f1',
            fontFamily: 'Arial',
            align: 'center',
            lineSpacing: 8
        });
        message.setOrigin(0.5);
        
        // Create close button
        const closeButton = this.add.rectangle(0, 100, 150, 40, 0x27ae60);
        closeButton.setStrokeStyle(2, 0x2ecc71);
        closeButton.setInteractive({ useHandCursor: true });
        
        const closeButtonText = this.add.text(0, 100, 'Continue', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        closeButtonText.setOrigin(0.5);
        
        // Add elements to container
        messageContainer.add([messageBg, title, message, closeButton, closeButtonText]);
        
        // Add click handler for close button
        closeButton.on('pointerdown', () => {
            // Fade out and destroy
            this.tweens.add({
                targets: [overlay, messageContainer],
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    overlay.destroy();
                    messageContainer.destroy();
                }
            });
        });
        
        // Add hover effects for close button
        closeButton.on('pointerover', () => {
            closeButton.setFillStyle(0x2ecc71);
            closeButtonText.setScale(1.1);
        });
        
        closeButton.on('pointerout', () => {
            closeButton.setFillStyle(0x27ae60);
            closeButtonText.setScale(1.0);
        });
        
        // Animate appearance
        overlay.setAlpha(0);
        messageContainer.setAlpha(0);
        messageContainer.setScale(0.5);
        
        this.tweens.add({
            targets: overlay,
            alpha: 0.8,
            duration: 500,
            ease: 'Power2'
        });
        
        this.tweens.add({
            targets: messageContainer,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
            delay: 200
        });
    }
    
    /**
     * Update loop
     */
    update() {
        // Update player movement only if intro is not active and direction map is not active
        if (this.player && this.inputManager && !this.isIntroActive && !this.isDirectionMapActive) {
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
        
        // Clean up medal display
        this.cleanupMedalDisplay();
        
        // Clean up any remaining tooltips
        this.hideMedalTooltip();
        
        // Reset flags
        this.isIntroActive = false;
        this.hasIntroStarted = false;
        
        console.log('✅ Bahreddin\'s Home Scene cleanup complete');
    }
}