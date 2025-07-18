/**
 * Abay Racing Scene
 * A clicking race game where Dimash races against Abay
 */
class AbayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AbayScene' });
        
        // Game state
        this.gameWon = false;
        this.gameStarted = false;
        this.raceFinished = false;
        
        // Characters
        this.abay = null;
        this.dimash = null;
        
        // Game mechanics
        this.abaySpeed = 2; // Abay's constant speed
        this.dimashPosition = 0;
        this.abayPosition = 0;
        this.raceDistance = 700; // Total race distance
        
        // UI elements
        this.startButton = null;
        this.instructionText = null;
        this.progressText = null;
        this.winText = null;
        this.goBackButton = null;
        
        // Input
        this.spaceKey = null;
        this.spaceKeyHandler = null; // Store reference to the keyboard event handler
        this.lastSpacePress = 0;
        this.spaceCooldown = 100; // Prevent spam clicking
        
        // Game state manager
        this.gameStateManager = null;
    }
    
    preload() {
        console.log('🏁 Loading Abay Racing Scene assets...');
        
        // Load background
        this.load.image('abay_map', 'assets/map/abay_map.png');
        
        // Load Abay character assets
        this.load.image('abay_stay', 'assets/abay_assets/abay_stay.png');
        this.load.image('abay_running', 'assets/abay_assets/abay_running.png');
        this.load.image('abay_running2', 'assets/abay_assets/abay_running2.png');
        
        // Load Dimash character assets (reuse from existing assets)
        this.load.image('dimash_stay', 'assets/dimash_character_assets/dimash_stay.png');
        this.load.image('dimash_right', 'assets/dimash_character_assets/dimash_right.png');
        
        console.log('✅ Abay Racing Scene assets loaded');
    }
    
    create() {
        console.log('🎮 Creating Abay Racing Scene...');
        
        // Initialize game state manager
        this.gameStateManager = new GameStateManager();
        this.gameStateManager.setCurrentScene('AbayScene');
        
        // Create background
        this.createBackground();
        
        // Create characters
        this.createCharacters();
        
        // Create UI
        this.createUI();
        
        // Setup input
        this.setupInput();
        
        // Show initial dialogue
        this.showInitialDialogue();
        
        console.log('✅ Abay Racing Scene created successfully!');
    }
    
    createBackground() {
        // Add background image
        this.background = this.add.image(0, 0, 'abay_map');
        this.background.setOrigin(0, 0);
        
        // Scale background to fit screen
        const scaleX = this.cameras.main.width / this.background.width;
        const scaleY = this.cameras.main.height / this.background.height;
        const scale = Math.max(scaleX, scaleY);
        this.background.setScale(scale);
        
        // Center background
        this.background.setPosition(
            (this.cameras.main.width - this.background.displayWidth) / 2,
            (this.cameras.main.height - this.background.displayHeight) / 2
        );
    }
    
    createCharacters() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create Abay (upper lane)
        this.abay = this.add.sprite(100, centerY - 80, 'abay_stay');
        this.abay.setScale(0.4); // Make characters small
        this.abay.setDepth(10);
        
        // Create Dimash (lower lane)
        this.dimash = this.add.sprite(100, centerY + 80, 'dimash_stay');
        this.dimash.setScale(0.4); // Make characters small
        this.dimash.setDepth(10);
        
        // Create Abay running animation
        this.anims.create({
            key: 'abay_run',
            frames: [
                { key: 'abay_running' },
                { key: 'abay_running2' }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        // Create Dimash running animation
        this.anims.create({
            key: 'dimash_run',
            frames: [
                { key: 'dimash_right' },
                { key: 'dimash_stay' }
            ],
            frameRate: 6,
            repeat: -1
        });
    }
    
    createUI() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Instruction text (initially hidden)
        this.instructionText = this.add.text(centerX, centerY - 200, 
            'Press SPACE to move Dimash forward!\nFirst to reach the finish line wins!', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.instructionText.setOrigin(0.5);
        this.instructionText.setVisible(false);
        this.instructionText.setDepth(20);
        
        // Progress text
        this.progressText = this.add.text(centerX, 50, '', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.progressText.setOrigin(0.5);
        this.progressText.setDepth(20);
        
        // Start button (initially hidden)
        this.startButton = this.add.text(centerX, centerY + 150, 'START RACE!', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#4ecdc4',
            padding: { x: 20, y: 10 },
            borderRadius: 8
        });
        this.startButton.setOrigin(0.5);
        this.startButton.setInteractive({ useHandCursor: true });
        this.startButton.setVisible(false);
        this.startButton.setDepth(20);
        
        this.startButton.on('pointerdown', () => {
            this.startRace();
        });
        
        this.startButton.on('pointerover', () => {
            this.startButton.setScale(1.1);
        });
        
        this.startButton.on('pointerout', () => {
            this.startButton.setScale(1.0);
        });
    }
    
    setupInput() {
        // Setup space key
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Create a named handler for the spacebar event so we can remove it later
        this.spaceKeyHandler = (event) => {
            event.preventDefault();
        };
        
        // Prevent space from scrolling the page
        this.input.keyboard.on('keydown-SPACE', this.spaceKeyHandler);
    }
    
    showInitialDialogue() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create dialogue background
        const dialogueBox = this.add.rectangle(centerX, centerY, 600, 200, 0x000000, 0.8);
        dialogueBox.setDepth(15);
        
        // Create Abay's dialogue
        const dialogueText = this.add.text(centerX, centerY - 20, 
            'Dimash! I challenge you to a race!\nI am fast like my Golang code.\nDo you accept my challenge?', {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        });
        dialogueText.setOrigin(0.5);
        dialogueText.setDepth(20);
        
        // Create accept button
        const acceptButton = this.add.text(centerX, centerY + 60, 'ACCEPT CHALLENGE!', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#ff6b6b',
            padding: { x: 15, y: 8 },
            borderRadius: 5
        });
        acceptButton.setOrigin(0.5);
        acceptButton.setInteractive({ useHandCursor: true });
        acceptButton.setDepth(20);
        
        acceptButton.on('pointerdown', () => {
            // Remove dialogue elements
            dialogueBox.destroy();
            dialogueText.destroy();
            acceptButton.destroy();
            
            // Show race setup
            this.showRaceSetup();
        });
        
        acceptButton.on('pointerover', () => {
            acceptButton.setScale(1.1);
        });
        
        acceptButton.on('pointerout', () => {
            acceptButton.setScale(1.0);
        });
    }
    
    showRaceSetup() {
        // Show instruction text
        this.instructionText.setVisible(true);
        
        // Show start button
        this.startButton.setVisible(true);
        
        // Animate instruction text
        this.tweens.add({
            targets: this.instructionText,
            alpha: { from: 0, to: 1 },
            y: { from: this.instructionText.y - 20, to: this.instructionText.y },
            duration: 500,
            ease: 'Power2'
        });
        
        // Animate start button
        this.tweens.add({
            targets: this.startButton,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.8, to: 1.0 },
            duration: 500,
            ease: 'Back.easeOut'
        });
    }
    
    startRace() {
        console.log('🏁 Starting race!');
        
        this.gameStarted = true;
        
        // Hide UI elements
        this.instructionText.setVisible(false);
        this.startButton.setVisible(false);
        
        // Start character animations
        this.abay.play('abay_run');
        
        // Reset positions
        this.abayPosition = 0;
        this.dimashPosition = 0;
        
        // Show progress
        this.updateProgress();
        
        // Start Abay's movement
        this.startAbayMovement();
    }
    
    startAbayMovement() {
        // Abay moves automatically with good speed
        this.abayMovementTimer = this.time.addEvent({
            delay: 50, // Update every 50ms for smooth movement
            callback: () => {
                if (!this.raceFinished) {
                    this.abayPosition += this.abaySpeed;
                    this.abay.x = 100 + this.abayPosition;
                    
                    // Check if Abay wins
                    if (this.abayPosition >= this.raceDistance) {
                        this.endRace('abay');
                    }
                    
                    this.updateProgress();
                }
            },
            loop: true
        });
    }
    
    updateProgress() {
        const abayProgress = Math.min(100, (this.abayPosition / this.raceDistance) * 100);
        const dimashProgress = Math.min(100, (this.dimashPosition / this.raceDistance) * 100);
        
        this.progressText.setText(
            `Abay: ${abayProgress.toFixed(0)}% | Dimash: ${dimashProgress.toFixed(0)}%`
        );
    }
    
    update() {
        if (!this.gameStarted || this.raceFinished) return;
        
        // Handle space key press for Dimash movement
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            const currentTime = this.time.now;
            
            // Check cooldown to prevent spam
            if (currentTime - this.lastSpacePress > this.spaceCooldown) {
                this.moveDimash();
                this.lastSpacePress = currentTime;
            }
        }
    }
    
    moveDimash() {
        // Move Dimash forward a little bit
        this.dimashPosition += 15; // Movement per space press
        this.dimash.x = 100 + this.dimashPosition;
        
        // Play running animation briefly
        this.dimash.play('dimash_run');
        this.time.delayedCall(200, () => {
            if (this.dimash) {
                this.dimash.setTexture('dimash_stay');
            }
        });
        
        // Check if Dimash wins
        if (this.dimashPosition >= this.raceDistance) {
            this.endRace('dimash');
        }
        
        this.updateProgress();
    }
    
    endRace(winner) {
        console.log(`🏁 Race ended! Winner: ${winner}`);
        
        this.raceFinished = true;
        
        // Stop Abay's movement
        if (this.abayMovementTimer) {
            this.abayMovementTimer.destroy();
        }
        
        // Stop animations
        this.abay.stop();
        this.dimash.stop();
        
        if (winner === 'dimash') {
            this.winGame();
        } else {
            this.loseGame();
        }
    }
    
    winGame() {
        console.log('🎉 Dimash wins the race!');
        
        this.gameWon = true;
        
        // Mark scene as completed
        this.gameStateManager.markSceneCompleted('AbayScene');
        
        // Check and unlock achievement
        const achievementManager = new AchievementManager();
        const unlockedAchievement = achievementManager.checkSceneCompletion('AbayScene');
        
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create base victory message
        let winMessage = 'Congratulations!\nYou defeated Abay in the race!';
        
        // Add achievement message if unlocked
        if (unlockedAchievement) {
            winMessage += `\n\n🏆 Achievement Unlocked: ${unlockedAchievement.icon} ${unlockedAchievement.name}\n💰 +${unlockedAchievement.coinReward} coins earned!`;
        }
        
        // Create victory message
        this.winText = this.add.text(centerX, centerY - 50, winMessage, {
            fontSize: '24px',
            fill: '#00ff00',
            fontFamily: 'Arial',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3,
            wordWrap: { width: 600 }
        });
        this.winText.setOrigin(0.5);
        this.winText.setDepth(25);
        
        // Create go back button
        this.goBackButton = this.add.text(centerX, centerY + 100, 'GO TO BAHREDDIN', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#4ecdc4',
            padding: { x: 15, y: 10 },
            borderRadius: 5
        });
        this.goBackButton.setOrigin(0.5);
        this.goBackButton.setInteractive({ useHandCursor: true });
        this.goBackButton.setDepth(25);
        
        this.goBackButton.on('pointerdown', () => {
            this.goToBahreddin();
        });
        
        this.goBackButton.on('pointerover', () => {
            this.goBackButton.setScale(1.1);
        });
        
        this.goBackButton.on('pointerout', () => {
            this.goBackButton.setScale(1.0);
        });
        
        // Animate victory elements
        this.tweens.add({
            targets: this.winText,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.5, to: 1.0 },
            duration: 800,
            ease: 'Back.easeOut'
        });
        
        this.tweens.add({
            targets: this.goBackButton,
            alpha: { from: 0, to: 1 },
            y: { from: this.goBackButton.y + 20, to: this.goBackButton.y },
            duration: 600,
            delay: unlockedAchievement ? 1000 : 400,
            ease: 'Power2'
        });
    }
    
    loseGame() {
        console.log('😞 Abay wins the race!');
        
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create defeat message
        const loseText = this.add.text(centerX, centerY - 50, 
            'Abay wins!\nHis Golang speed was too fast!\nTry again?', {
            fontSize: '28px',
            fill: '#ff6b6b',
            fontFamily: 'Arial',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3
        });
        loseText.setOrigin(0.5);
        loseText.setDepth(25);
        
        // Create retry button
        const retryButton = this.add.text(centerX - 80, centerY + 50, 'TRY AGAIN', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#ff6b6b',
            padding: { x: 12, y: 8 },
            borderRadius: 5
        });
        retryButton.setOrigin(0.5);
        retryButton.setInteractive({ useHandCursor: true });
        retryButton.setDepth(25);
        
        // Create go back button
        const backButton = this.add.text(centerX + 80, centerY + 50, 'GO BACK', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            backgroundColor: '#666666',
            padding: { x: 12, y: 8 },
            borderRadius: 5
        });
        backButton.setOrigin(0.5);
        backButton.setInteractive({ useHandCursor: true });
        backButton.setDepth(25);
        
        retryButton.on('pointerdown', () => {
            this.scene.restart();
        });
        
        backButton.on('pointerdown', () => {
            this.goToBahreddin();
        });
        
        // Add hover effects
        [retryButton, backButton].forEach(button => {
            button.on('pointerover', () => button.setScale(1.1));
            button.on('pointerout', () => button.setScale(1.0));
        });
    }
    
    goToBahreddin() {
        console.log('🏠 Returning to Bahreddin\'s Home...');
        
        // Set current scene in game state
        this.gameStateManager.setCurrentScene('BahreddinsHomeScene');
        
        // Transition to Bahreddin's Home scene
        this.scene.start('BahreddinsHomeScene');
    }
    
    shutdown() {
        // Clean up timers
        if (this.abayMovementTimer) {
            this.abayMovementTimer.destroy();
        }
        
        // Clean up input - remove the specific spacebar key
        if (this.spaceKey) {
            this.input.keyboard.removeKey(this.spaceKey);
        }
        
        // Clean up global keyboard event listener
        if (this.spaceKeyHandler) {
            this.input.keyboard.off('keydown-SPACE', this.spaceKeyHandler);
            this.spaceKeyHandler = null;
        }
        
        console.log('🧹 Abay Scene cleanup complete');
    }
}