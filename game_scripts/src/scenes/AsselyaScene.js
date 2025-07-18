/**
 * Asselya Social Media Game
 * A game where players catch falling social media icons with a basket while Asselya watches as a background boss
 */
class AsselyaScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AsselyaScene' });
        
        // Game state
        this.gameStarted = false;
        this.gameWon = false;
        this.gameOver = false;
        this.missedCount = 0;
        this.caughtCount = 0;
        this.gameTime = 0;
        this.maxGameTime = 30; // 30 seconds
        this.maxMisses = 5;
        
        // Difficulty settings
        this.currentDifficulty = 1;
        this.dropSpeed = 100;
        this.dropFrequency = 2000; // milliseconds
        
        // Character references
        this.asselya = null;
        this.basket = null;
        
        // Game objects
        this.fallingItems = [];
        this.socialMediaIcons = ['x_icon', 'insta_icon', 'threads_icon', 'tiktok_icon', 'linkedin_icon'];
        
        // Timers
        this.gameTimer = null;
        this.dropTimer = null;
        this.difficultyTimer = null;
        
        // UI elements
        this.instructionText = null;
        this.startButton = null;
        this.timeText = null;
        this.missedText = null;
        this.caughtText = null;
        this.gameOverText = null;
        
        // Input
        this.cursors = null;
        this.wasd = null;
    }

    preload() {
        console.log('🔄 Loading Social Media Game assets...');
        
        // Load background
        this.load.image('background', 'assets/map/map1.png');
        
        // Load Asselya animation frames
        this.load.image('asselya1', 'assets/asselya_assets/asselya1.png');
        this.load.image('asselya2', 'assets/asselya_assets/asselya2.png');
        this.load.image('asselya3', 'assets/asselya_assets/asselya3.png');
        
        // Load basket
        this.load.image('basket', 'assets/gaming_items/basket.png');
        
        // Load social media icons
        this.load.image('x_icon', 'assets/gaming_items/x.png');
        this.load.image('insta_icon', 'assets/gaming_items/insta.png');
        this.load.image('threads_icon', 'assets/gaming_items/threads.png');
        this.load.image('tiktok_icon', 'assets/gaming_items/tiktok.png');
        this.load.image('linkedin_icon', 'assets/gaming_items/linkedin.png');
        
        console.log('✅ Assets loaded successfully');
    }

    create() {
        console.log('🎮 Creating Asselya Social Media Game...');
        
        // Create background
        this.createBackground();
        
        // Create Asselya as background boss
        this.createAsselya();
        
        // Start Asselya animation
        this.startAsselyaAnimation();
        
        // Create basket (player controlled)
        this.createBasket();
        
        // Setup input
        this.setupInput();
        
        // Create UI
        this.createUI();
        
        // Show initial instructions
        this.showInitialInstructions();
        
        console.log('✅ Asselya Social Media Game created successfully');
    }

    createBackground() {
        this.background = this.add.image(0, 0, 'background');
        this.background.setOrigin(0, 0);
        this.background.setDepth(0);
        
        // Scale background to fit screen
        const scaleX = this.cameras.main.width / this.background.width;
        const scaleY = this.cameras.main.height / this.background.height;
        const scale = Math.max(scaleX, scaleY);
        this.background.setScale(scale);
        
        console.log('🖼️ Background created');
    }

    createAsselya() {
        // Create Asselya as a large background boss
        this.asselya = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'asselya1');
        this.asselya.setScale(2.5); // Make her big as a background boss
        this.asselya.setDepth(1);
        this.asselya.setAlpha(0.85); // Higher opacity to make her more visible
        
        console.log('👩‍💼 Asselya boss created');
    }

    startAsselyaAnimation() {
        // Create animation sequence for Asselya
        this.asselyaFrames = ['asselya1', 'asselya2', 'asselya3'];
        this.currentAsselyaFrame = 0;
        
        // Start frame animation
        this.time.addEvent({
            delay: 1000, // Change frame every second
            callback: () => {
                this.currentAsselyaFrame = (this.currentAsselyaFrame + 1) % this.asselyaFrames.length;
                this.asselya.setTexture(this.asselyaFrames[this.currentAsselyaFrame]);
            },
            callbackScope: this,
            loop: true
        });
        
        // Add subtle scale animation
        this.tweens.add({
            targets: this.asselya,
            scaleX: 2.6,
            scaleY: 2.6,
            duration: 3000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        console.log('🎬 Asselya animation started');
    }

    createBasket() {
        // Create basket at the bottom of the screen
        this.basket = this.add.image(this.cameras.main.width / 2, this.cameras.main.height - 80, 'basket');
        this.basket.setScale(1.2);
        this.basket.setDepth(10);
        
        // Enable physics for basket
        this.physics.add.existing(this.basket);
        this.basket.body.setCollideWorldBounds(true);
        this.basket.body.setImmovable(true);
        this.basket.body.setSize(80, 40);
        
        console.log('🧺 Basket created');
    }

    setupInput() {
        // Create cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Create WASD keys
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        console.log('⌨️ Input setup complete');
    }

    createUI() {
        // Create UI elements
        this.timeText = this.add.text(20, 20, 'Time: 30', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.timeText.setDepth(100);
        this.timeText.setScrollFactor(0);
        
        this.missedText = this.add.text(20, 50, 'Missed: 0/5', {
            fontSize: '20px',
            fill: '#ff4444',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.missedText.setDepth(100);
        this.missedText.setScrollFactor(0);
        
        this.caughtText = this.add.text(20, 80, 'Caught: 0', {
            fontSize: '20px',
            fill: '#44ff44',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.caughtText.setDepth(100);
        this.caughtText.setScrollFactor(0);
        
        console.log('🎨 UI created');
    }

    showInitialInstructions() {
        // Create instruction text
        this.instructionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150, 
            'Welcome! You must post 5 posts everywhere and everyday!\nCatch the falling social media icons with your basket!', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3,
            wordWrap: { width: 600 }
        });
        this.instructionText.setOrigin(0.5);
        this.instructionText.setDepth(100);
        
        // Create start button
        this.createStartButton();
        
        console.log('📝 Instructions shown');
    }

    createStartButton() {
        // Create start button background
        const buttonBg = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2 + 250, 200, 60, 0x4CAF50);
        buttonBg.setDepth(99);
        buttonBg.setInteractive();
        
        // Create start button text
        const buttonText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 250, 'START GAME', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        buttonText.setOrigin(0.5);
        buttonText.setDepth(100);
        
        // Store references
        this.startButton = { bg: buttonBg, text: buttonText };
        
        // Add hover effects
        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0x45a049);
            buttonText.setScale(1.1);
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0x4CAF50);
            buttonText.setScale(1.0);
        });
        
        // Add click handler
        buttonBg.on('pointerdown', () => {
            this.startGame();
        });
        
        console.log('🎮 Start button created');
    }
    startGame() {
        console.log('🎮 Starting Social Media Game...');
        
        // Hide instructions and start button
        if (this.instructionText) {
            this.instructionText.destroy();
        }
        if (this.startButton) {
            this.startButton.bg.destroy();
            this.startButton.text.destroy();
        }
        
        // Set game state
        this.gameStarted = true;
        this.gameTime = this.maxGameTime;
        
        // Start game timer
        this.gameTimer = this.time.addEvent({
            delay: 1000, // 1 second
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });
        
        // Start dropping items
        this.startDropping();
        
        // Start difficulty progression
        this.difficultyTimer = this.time.addEvent({
            delay: 5000, // Every 5 seconds
            callback: this.increaseDifficulty,
            callbackScope: this,
            loop: true
        });
        
        console.log('✅ Game started!');
    }

    startDropping() {
        // Start dropping social media icons
        this.dropTimer = this.time.addEvent({
            delay: this.dropFrequency,
            callback: this.dropItem,
            callbackScope: this,
            loop: true
        });
    }

    dropItem() {
        if (!this.gameStarted || this.gameOver) return;
        
        // Choose random social media icon
        const iconType = Phaser.Utils.Array.GetRandom(this.socialMediaIcons);
        
        // Random X position
        const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
        
        // Create falling item
        const item = this.add.image(x, -50, iconType);
        item.setScale(0.4); // Make icons smaller (was 0.8)
        item.setDepth(5);
        
        // Enable physics
        this.physics.add.existing(item);
        item.body.setVelocity(0, this.dropSpeed);
        
        // Add rotation animation
        this.tweens.add({
            targets: item,
            rotation: Math.PI * 2, // Full rotation
            duration: 2000, // 2 seconds for full rotation
            ease: 'Linear',
            repeat: -1 // Infinite rotation
        });
        
        // Add subtle scale pulsing
        this.tweens.add({
            targets: item,
            scaleX: 0.45,
            scaleY: 0.45,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Add to falling items array
        this.fallingItems.push(item);
        
        // Add collision with basket
        this.physics.add.overlap(this.basket, item, (basket, fallingItem) => {
            this.catchItem(fallingItem);
        });
        
        console.log(`📱 Dropped ${iconType} at x: ${x}`);
    }

    catchItem(item) {
        // Remove from falling items
        const index = this.fallingItems.indexOf(item);
        if (index > -1) {
            this.fallingItems.splice(index, 1);
        }
        
        // Destroy item
        item.destroy();
        
        // Increase caught count
        this.caughtCount++;
        this.updateUI();
        
        // Add visual feedback
        this.showCatchEffect();
        
        console.log(`✅ Caught item! Total: ${this.caughtCount}`);
    }

    showCatchEffect() {
        // Create a brief flash effect on the basket
        this.tweens.add({
            targets: this.basket,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });
        
        // Add a green tint briefly
        this.basket.setTint(0x44ff44);
        this.time.delayedCall(200, () => {
            this.basket.clearTint();
        });
    }

    updateGameTime() {
        if (!this.gameStarted || this.gameOver) return;
        
        this.gameTime--;
        this.updateUI();
        
        if (this.gameTime <= 0) {
            this.winGame();
        }
    }

    increaseDifficulty() {
        if (!this.gameStarted || this.gameOver) return;
        
        this.currentDifficulty++;
        
        // Increase drop speed
        this.dropSpeed += 30;
        
        // Decrease drop frequency (make items fall more often)
        this.dropFrequency = Math.max(800, this.dropFrequency - 300);
        
        // Update the drop timer
        if (this.dropTimer) {
            this.dropTimer.destroy();
            this.startDropping();
        }
        
        console.log(`🔥 Difficulty increased! Level: ${this.currentDifficulty}, Speed: ${this.dropSpeed}, Frequency: ${this.dropFrequency}`);
    }

    updateUI() {
        if (this.timeText) {
            this.timeText.setText(`Time: ${this.gameTime}`);
        }
        if (this.missedText) {
            this.missedText.setText(`Missed: ${this.missedCount}/${this.maxMisses}`);
        }
        if (this.caughtText) {
            this.caughtText.setText(`Caught: ${this.caughtCount}`);
        }
    }

    updateBasket() {
        if (!this.gameStarted || this.gameOver) return;
        
        const speed = 300;
        
        // Reset velocity
        this.basket.body.setVelocity(0, 0);
        
        // Handle input
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.basket.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.basket.body.setVelocityX(speed);
        }
    }

    checkFallingItems() {
        // Check if any items have fallen off screen
        for (let i = this.fallingItems.length - 1; i >= 0; i--) {
            const item = this.fallingItems[i];
            
            if (item.y > this.cameras.main.height + 50) {
                // Item missed
                this.missItem(item);
                this.fallingItems.splice(i, 1);
                item.destroy();
            }
        }
    }

    missItem(item) {
        this.missedCount++;
        this.updateUI();
        
        // Add visual feedback for miss
        this.showMissEffect();
        
        console.log(`❌ Missed item! Total misses: ${this.missedCount}`);
        
        // Check if game over
        if (this.missedCount >= this.maxMisses) {
            this.loseGame();
        }
    }

    showMissEffect() {
        // Flash the screen red briefly
        const redOverlay = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0xff0000,
            0.3
        );
        redOverlay.setDepth(50);
        
        this.time.delayedCall(200, () => {
            redOverlay.destroy();
        });
    }

    winGame() {
        console.log('🎉 Player won the game!');
        this.gameWon = true;
        this.gameOver = true;
        this.gameStarted = false;
        
        // Stop all timers
        this.stopAllTimers();
        
        // Show win message from Asselya
        this.showWinMessage();
    }

    loseGame() {
        console.log('💀 Player lost the game!');
        this.gameOver = true;
        this.gameStarted = false;
        
        // Stop all timers
        this.stopAllTimers();
        
        // Show lose message from Asselya
        this.showLoseMessage();
    }

    showWinMessage() {
        // Make Asselya more prominent
        this.asselya.setAlpha(1.0);
        this.asselya.setScale(3.0);
        
        // Create congratulations text
        this.gameOverText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 200,
            'Congratulations! You lasted 30 seconds!\nAsselya is proud of your social media dedication!',
            {
                fontSize: '28px',
                fill: '#44ff44',
                fontFamily: 'Arial',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3,
                wordWrap: { width: 600 }
            }
        );
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setDepth(100);
        
        // Add restart button
        this.createGoToBahreddinsButton();
    }

    showLoseMessage() {
        // Make Asselya more prominent and angry with higher opacity
        this.asselya.setAlpha(1.0);
        this.asselya.setScale(3.5);
        this.asselya.setTint(0xff4444);
        
        // Create game over text
        this.gameOverText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 200,
            'You are KICKED!\nAsselya says: "You missed too many posts!\nTry again and be more dedicated!"',
            {
                fontSize: '28px',
                fill: '#ff4444',
                fontFamily: 'Arial',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 3,
                wordWrap: { width: 600 }
            }
        );
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setDepth(100);
        
        // Add "Go to Bahreddin" button
        this.createGoToBahreddinsButton();
    }

    createGoToBahreddinsButton() {
        // Create "Go to Bahreddin" button background
        const buttonBg = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2 + 300, 250, 60, 0x4CAF50);
        buttonBg.setDepth(99);
        buttonBg.setInteractive();
        
        // Create button text
        const buttonText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 300, 'GO TO BAHREDDIN', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        buttonText.setOrigin(0.5);
        buttonText.setDepth(100);
        
        // Add hover effects
        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0x45a049);
            buttonText.setScale(1.1);
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0x4CAF50);
            buttonText.setScale(1.0);
        });
        
        // Add click handler to go to Bahreddin's scene
        buttonBg.on('pointerdown', () => {
            this.goToBahreddin();
        });
    }

    goToBahreddin() {
        console.log('🏠 Returning to Bahreddin\'s Home...');
        
        // Save game state before transition
        const gameStateManager = new GameStateManager();
        gameStateManager.setCurrentScene('BahreddinsHomeScene');
        
        // Clean up current scene
        this.cleanup();
        
        // Return to Bahreddin's Home scene
        this.scene.start('BahreddinsHomeScene');
    }

    stopAllTimers() {
        if (this.gameTimer) {
            this.gameTimer.destroy();
            this.gameTimer = null;
        }
        if (this.dropTimer) {
            this.dropTimer.destroy();
            this.dropTimer = null;
        }
        if (this.difficultyTimer) {
            this.difficultyTimer.destroy();
            this.difficultyTimer = null;
        }
    }
    update() {
        // Update basket movement
        this.updateBasket();
        
        // Check falling items
        this.checkFallingItems();
    }

    cleanup() {
        console.log('🧹 Cleaning up Social Media Game...');
        
        // Stop all timers
        this.stopAllTimers();
        
        // Clear falling items
        this.fallingItems.forEach(item => {
            if (item && item.destroy) {
                item.destroy();
            }
        });
        this.fallingItems = [];
        
        console.log('✅ Cleanup complete');
    }
}