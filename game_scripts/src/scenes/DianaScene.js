/**
 * Diana Mentor Scene - Attendance Challenge
 * A stealth-based collection game where Dimash must collect coins while avoiding Diana's attendance checks
 */
class DianaScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DianaScene' });
        
        // Game state
        this.gameStarted = false;
        this.gameWon = false;
        this.lives = 3;
        this.coinsCollected = 0;
        this.totalCoins = 10;
        
        // Game objects
        this.player = null;
        this.diana = null;
        this.hearts = [];
        this.coins = [];
        this.bushes = [];
        this.hidePrompts = [];
        
        // Diana attendance system
        this.dianaTimer = null;
        this.dianaActive = false;
        this.hideTimer = null;
        this.canHide = false;
        this.isHiding = false;
        
        // UI elements
        this.startButton = null;
        this.continueButton = null;
        this.dialogueOverlay = null;
        this.dialogueText = null;
        
        // World settings
        this.worldWidth = 2048;
        this.worldHeight = 1536;
        this.playerScale = 0.3;
        this.dianaScale = 0.4;
    }
    
    preload() {
        console.log('🎮 Diana Scene: Loading assets...');
        
        // Load map and character assets
        this.load.image('diana_map', 'assets/map/map1.png');
        this.load.image('diana_forth', 'assets/diana_assets/diana_forth.png');
        this.load.image('heart', 'assets/gaming_items/heart.png');
        this.load.image('coin', 'assets/gaming_items/coin.png');
        this.load.image('bush', 'assets/gaming_items/bush.png');
        this.load.image('hiding_bushes', 'assets/dimash_character_assets/hiding_bushes.png');
        
        // Load Diana animation assets
        this.load.image('diana_scream_1', 'assets/diana_assets/diana_scream_1.png');
        this.load.image('diana_scream_2', 'assets/diana_assets/diana_scream_2.png');
        this.load.image('diana_scream_3', 'assets/diana_assets/diana_scream_3.png');
        
        // Load Dimash assets (use existing single images from GameConfig)
        this.load.image('dimash_stay', 'assets/dimash_character_assets/dimash_stay.png');
        this.load.image('dimash_down', 'assets/dimash_character_assets/dimash_down.png');
        this.load.image('dimash_up', 'assets/dimash_character_assets/dimash_up.png');
        this.load.image('dimash_left', 'assets/dimash_character_assets/dimash_left.png');
        this.load.image('dimash_right', 'assets/dimash_character_assets/dimash_right.png');
        
        console.log('✅ Diana Scene: Assets loaded successfully');
    }
    
    create() {
        console.log('🎮 Diana Scene: Creating scene...');
        
        // Set world bounds for large open world
        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
        
        // Create background
        this.createBackground();
        
        // Create initial Diana introduction
        this.createInitialDiana();
        
        // Setup camera
        this.setupCamera();
        
        // Initialize input
        this.setupInput();
        
        console.log('✅ Diana Scene: Scene created successfully');
    }
    
    createBackground() {
        // Create tiled background for large world
        const background = this.add.image(this.worldWidth / 2, this.worldHeight / 2, 'diana_map');
        background.setDisplaySize(this.worldWidth, this.worldHeight);
        background.setDepth(-1);
        
        console.log('🗺️ Diana Scene: Background created');
    }
    
    createInitialDiana() {
        // Create Diana sprite for introduction
        this.diana = this.add.sprite(this.worldWidth / 2, this.worldHeight / 2 - 100, 'diana_forth');
        this.diana.setScale(this.dianaScale);
        this.diana.setDepth(10);
        
        // Show initial dialogue
        this.showInitialDialogue();
    }
    
    showInitialDialogue() {
        // Create dialogue overlay
        this.dialogueOverlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.height - 100,
            this.cameras.main.width - 100,
            120,
            0x000000,
            0.8
        );
        this.dialogueOverlay.setScrollFactor(0);
        this.dialogueOverlay.setDepth(100);
        
        // Create dialogue text
        this.dialogueText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 100,
            "Diana: You think you can pass through my attendance? Never! Let's see how you handle this challenge...",
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: this.cameras.main.width - 150 }
            }
        );
        this.dialogueText.setOrigin(0.5);
        this.dialogueText.setScrollFactor(0);
        this.dialogueText.setDepth(101);
        
        // Start Diana disappearing animation after 3 seconds
        this.time.delayedCall(3000, () => {
            this.startDianaDisappear();
        });
    }
    
    startDianaDisappear() {
        // Fade out Diana
        this.tweens.add({
            targets: this.diana,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                this.diana.setVisible(false);
                this.showStartButton();
            }
        });
        
        // Update dialogue text
        this.dialogueText.setText("Diana is preparing her attendance challenge...");
    }
    
    showStartButton() {
        // Clear dialogue
        if (this.dialogueOverlay) {
            this.dialogueOverlay.destroy();
            this.dialogueOverlay = null;
        }
        if (this.dialogueText) {
            this.dialogueText.destroy();
            this.dialogueText = null;
        }
        
        // Create start button
        this.startButton = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            200,
            60,
            0x4ecdc4
        );
        this.startButton.setScrollFactor(0);
        this.startButton.setDepth(100);
        this.startButton.setInteractive();
        
        const startButtonText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'START GAME',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        );
        startButtonText.setOrigin(0.5);
        startButtonText.setScrollFactor(0);
        startButtonText.setDepth(101);
        
        // Add button interactions
        this.startButton.on('pointerdown', () => {
            this.startGame();
        });
        
        this.startButton.on('pointerover', () => {
            this.startButton.setFillStyle(0x6ee6de);
            startButtonText.setScale(1.1);
        });
        
        this.startButton.on('pointerout', () => {
            this.startButton.setFillStyle(0x4ecdc4);
            startButtonText.setScale(1.0);
        });
        
        this.startButtonText = startButtonText;
    }
    
    startGame() {
        console.log('🎮 Diana Scene: Starting game...');
        
        // Remove start button
        if (this.startButton) {
            this.startButton.destroy();
            this.startButton = null;
        }
        if (this.startButtonText) {
            this.startButtonText.destroy();
            this.startButtonText = null;
        }
        
        // Set game state
        this.gameStarted = true;
        
        // Create game elements
        this.createPlayer();
        this.createHearts();
        this.createCoins();
        this.createBushes();
        
        // Start Diana attendance system
        this.startDianaAttendanceSystem();
        
        console.log('✅ Diana Scene: Game started successfully');
    }
    
    createPlayer() {
        // Create player at center of world
        this.player = this.physics.add.sprite(this.worldWidth / 2, this.worldHeight / 2, 'dimash_stay');
        this.player.setScale(this.playerScale);
        this.player.setDepth(5);
        this.player.setCollideWorldBounds(true);
        
        // Setup player animations
        this.createPlayerAnimations();
        
        // Make camera follow player
        this.cameras.main.startFollow(this.player);
        
        console.log('👤 Diana Scene: Player created');
    }
    
    createPlayerAnimations() {
        // Create animations for player movement using single frame images
        this.anims.create({
            key: 'dimash_idle',
            frames: [{ key: 'dimash_stay' }],
            frameRate: 1,
            repeat: -1
        });
        
        this.anims.create({
            key: 'dimash_walk_left',
            frames: [{ key: 'dimash_left' }],
            frameRate: 1,
            repeat: -1
        });
        
        this.anims.create({
            key: 'dimash_walk_right',
            frames: [{ key: 'dimash_right' }],
            frameRate: 1,
            repeat: -1
        });
        
        this.anims.create({
            key: 'dimash_walk_up',
            frames: [{ key: 'dimash_up' }],
            frameRate: 1,
            repeat: -1
        });
        
        this.anims.create({
            key: 'dimash_walk_down',
            frames: [{ key: 'dimash_down' }],
            frameRate: 1,
            repeat: -1
        });
        
        // Play idle animation by default
        this.player.play('dimash_idle');
    }
    
    createHearts() {
        // Create 3 hearts in top-left corner
        for (let i = 0; i < 3; i++) {
            const heart = this.add.image(50 + (i * 40), 50, 'heart');
            heart.setScale(0.5);
            heart.setScrollFactor(0);
            heart.setDepth(200);
            this.hearts.push(heart);
        }
        
        console.log('❤️ Diana Scene: Hearts created');
    }
    
    createCoins() {
        // Create 10 coins randomly placed across the map (made smaller)
        for (let i = 0; i < this.totalCoins; i++) {
            const x = Phaser.Math.Between(100, this.worldWidth - 100);
            const y = Phaser.Math.Between(100, this.worldHeight - 100);
            
            const coin = this.physics.add.sprite(x, y, 'coin');
            coin.setScale(0.25); // Made smaller (was 0.4)
            coin.setDepth(3);
            
            // Add coin animation
            this.tweens.add({
                targets: coin,
                scaleX: 0.3, // Adjusted for smaller size
                scaleY: 0.3,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Add coin rotation
            this.tweens.add({
                targets: coin,
                rotation: Math.PI * 2,
                duration: 2000,
                repeat: -1,
                ease: 'Linear'
            });
            
            this.coins.push(coin);
        }
        
        // Setup coin collection
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        
        console.log('🪙 Diana Scene: Coins created');
    }

    createBushes() {
        // Create bushes scattered around the map for hiding
        const bushCount = 15;
        for (let i = 0; i < bushCount; i++) {
            const x = Phaser.Math.Between(150, this.worldWidth - 150);
            const y = Phaser.Math.Between(150, this.worldHeight - 150);
            
            // Ensure bushes don't spawn too close to coins or player start
            const playerDist = Phaser.Math.Distance.Between(x, y, this.worldWidth / 2, this.worldHeight / 2);
            if (playerDist < 200) continue;
            
            // Create bush as an interactive sprite using regular bush image
            const bush = this.add.sprite(x, y, 'bush');
            bush.setScale(0.8); // Appropriate scale for regular bushes
            bush.setDepth(2);
            bush.setInteractive(); // Make it interactive
            
            // Add bush data
            bush.bushData = {
                x: x,
                y: y,
                occupied: false,
                isHiding: false // Track if someone is hiding in this bush
            };
            
            // Add click handler directly to bush
            bush.on('pointerdown', () => {
                this.hideInBush(bush);
            });
            
            // Add hover effects
            bush.on('pointerover', () => {
                if (this.canHide && !this.isHiding && !bush.bushData.occupied) {
                    bush.setTint(0xaaffaa); // Light green tint on hover
                }
            });
            
            bush.on('pointerout', () => {
                if (!bush.bushData.isHiding) {
                    bush.clearTint(); // Remove tint only if not hiding
                }
            });
            
            this.bushes.push(bush);
        }
        
        console.log('🌳 Diana Scene: Interactive bushes created');
    }
    
    showMessage(text, duration = 2000) {
        // Create message text
        const messageText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 200,
            text,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 }
            }
        );
        messageText.setOrigin(0.5);
        messageText.setScrollFactor(0);
        messageText.setDepth(150);
        
        // Fade in
        messageText.setAlpha(0);
        this.tweens.add({
            targets: messageText,
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });
        
        // Auto-remove after duration
        this.time.delayedCall(duration, () => {
            this.tweens.add({
                targets: messageText,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    messageText.destroy();
                }
            });
        });
        
        return messageText;
    }
    
    setupCamera() {
        // Set camera bounds to world size
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.setZoom(1);
    }
    
    setupInput() {
        // Create cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Create WASD keys
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    }
    
    startDianaAttendanceSystem() {
        // Start the random Diana appearance timer
        this.scheduleDianaAppearance();
    }
    
    scheduleDianaAppearance() {
        if (this.gameWon || !this.gameStarted) return;
        
        // Clear any existing timer to prevent multiple timers
        if (this.dianaTimer) {
            this.dianaTimer.destroy();
            this.dianaTimer = null;
        }
        
        // Random delay between 10-15 seconds
        const delay = Phaser.Math.Between(10000, 15000);
        
        this.dianaTimer = this.time.delayedCall(delay, () => {
            this.triggerDianaAttendance();
        });
        
        console.log(`⏰ Diana Scene: Next Diana appearance in ${delay/1000} seconds`);
    }
    
    triggerDianaAttendance() {
        if (this.dianaActive || this.gameWon || !this.gameStarted) return;
        
        console.log('📢 Diana Scene: ATTENDANCE CHECK!');
        this.dianaActive = true;
        this.canHide = true;
        
        // Clear any existing hide timer
        if (this.hideTimer) {
            this.hideTimer.destroy();
            this.hideTimer = null;
        }
        
        // Create Diana from left side (off-screen)
        this.diana = this.add.sprite(-100, this.cameras.main.centerY, 'diana_forth');
        this.diana.setScale(this.dianaScale);
        this.diana.setDepth(200); // Increased depth to ensure she's in front
        this.diana.setScrollFactor(0);
        
        // Animate Diana entering - keep her more to the left (25% from left edge)
        const targetX = this.cameras.main.width * 0.25;
        this.tweens.add({
            targets: this.diana,
            x: targetX,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.dianaScreamAttendance();
            }
        });
        
        // Show hide prompts on bushes
        this.showHidePrompts();
        
        // Start 3-second timer for hiding
        this.hideTimer = this.time.delayedCall(3000, () => {
            this.checkHidingResult();
        });
    }
    
    dianaScreamAttendance() {
        // Create ATTENDANCE text
        const attendanceText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            'ATTENDANCE!',
            {
                fontSize: '48px',
                fontFamily: 'Arial',
                fill: '#ff0000',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        attendanceText.setOrigin(0.5);
        attendanceText.setScrollFactor(0);
        attendanceText.setDepth(150);
        
        // Animate text
        this.tweens.add({
            targets: attendanceText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                attendanceText.destroy();
            }
        });
        
        // Animate Diana screaming
        this.tweens.add({
            targets: this.diana,
            scaleX: this.dianaScale * 1.1,
            scaleY: this.dianaScale * 1.1,
            duration: 200,
            yoyo: true,
            repeat: 3
        });
    }
    
    showHidePrompts() {
        // Add null check to prevent errors
        if (!this.bushes || !Array.isArray(this.bushes)) {
            console.warn('⚠️ Diana Scene: Bushes array is not available for hide prompts');
            return;
        }
        
        // Show "Click to hide" prompts on all bushes
        this.bushes.forEach(bush => {
            if (!bush || bush.scene !== this) {
                return; // Skip destroyed or invalid bushes
            }
            
            const prompt = this.add.text(
                bush.x,
                bush.y - 40,
                'Click to hide',
                {
                    fontSize: '14px',
                    fontFamily: 'Arial',
                    fill: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { x: 5, y: 3 }
                }
            );
            prompt.setOrigin(0.5);
            prompt.setDepth(50);
            prompt.setInteractive();
            
            // Add click handler
            prompt.on('pointerdown', () => {
                this.hideInBush(bush);
            });
            
            this.hidePrompts.push(prompt);
        });
    }
    
    hideInBush(bush) {
        if (!this.canHide || this.isHiding || bush.bushData.occupied) {
            return;
        }
        
        // Check if player is close enough to the bush
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            bush.x, bush.y
        );
        
        if (distance > 80) {
            // Show message that player needs to be closer
            this.showMessage("Get closer to the bush to hide!", 1500);
            return;
        }
        
        console.log('🌳 Diana Scene: Player hiding in bush');
        
        this.isHiding = true;
        this.canHide = false;
        bush.bushData.occupied = true;
        bush.bushData.isHiding = true;
        this.currentBush = bush;
        
        // Hide the player
        this.player.setVisible(false);
        
        // Change ONLY this bush to the hiding texture
        bush.setTexture('hiding_bushes');
        bush.setScale(0.5); // Adjust scale for hiding texture
        bush.setTint(0x88ff88); // Light green tint to show it's active
        
        // Add pulsing effect to show hiding is active
        this.tweens.add({
            targets: bush,
            alpha: 0.7,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Clear any existing hide prompts
        this.clearHidePrompts();
        
        // Show hiding status
        this.showMessage("Hiding... Stay quiet!", 3000);
    }
    
    clearHidePrompts() {
        if (!this.hidePrompts || !Array.isArray(this.hidePrompts)) {
            this.hidePrompts = [];
            return;
        }
        
        this.hidePrompts.forEach(prompt => {
            if (prompt && prompt.destroy) {
                prompt.destroy();
            }
        });
        this.hidePrompts = [];
    }
    
    checkHidingResult() {
        this.canHide = false;
        
        if (this.isHiding) {
            console.log('✅ Diana Scene: Successfully hidden!');
            this.dianaLeaves();
        } else {
            console.log('💔 Diana Scene: Caught by Diana!');
            this.takeDamage();
            this.dianaLeaves();
        }
    }
    
    takeDamage() {
        if (this.lives <= 0) return;
        
        this.lives--;
        
        // Remove a heart
        if (this.hearts[this.lives]) {
            this.hearts[this.lives].setAlpha(0.3);
        }
        
        console.log(`💔 Diana Scene: Lives remaining: ${this.lives}`);
        
        // Check game over
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    dianaLeaves() {
        // Animate Diana leaving
        this.tweens.add({
            targets: this.diana,
            x: -100,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.diana.destroy();
                this.diana = null;
                this.dianaActive = false;
                
                // Clean up hiding state
                if (this.isHiding) {
                    this.isHiding = false;
                    
                    // Show player again
                    this.player.setVisible(true);
                    
                    // Restore the bush to its original state
                    if (this.currentBush) {
                        // Stop any tweens on the bush
                        this.tweens.killTweensOf(this.currentBush);
                        
                        // Restore original bush texture and properties
                        this.currentBush.setTexture('bush');
                        this.currentBush.setScale(0.8);
                        this.currentBush.clearTint();
                        this.currentBush.setAlpha(1);
                        
                        // Reset bush data
                        this.currentBush.bushData.occupied = false;
                        this.currentBush.bushData.isHiding = false;
                        this.currentBush = null;
                    }
                    
                    this.showMessage("Diana left! You're safe for now.", 2000);
                }
                
                // Schedule next appearance
                this.scheduleDianaAppearance();
            }
        });
        
        // Clear any remaining prompts
        this.clearHidePrompts();
    }
    
    collectCoin(player, coin) {
        // Remove coin
        coin.destroy();
        this.coins = this.coins.filter(c => c !== coin);
        this.coinsCollected++;
        
        console.log(`🪙 Diana Scene: Coin collected! ${this.coinsCollected}/${this.totalCoins}`);
        
        // Check win condition
        if (this.coinsCollected >= this.totalCoins) {
            this.winGame();
        }
    }
    
    winGame() {
        console.log('🎉 Diana Scene: All coins collected! You win!');
        this.gameWon = true;
        this.gameStarted = false;
        
        // Stop Diana timer
        if (this.dianaTimer) {
            this.dianaTimer.destroy();
            this.dianaTimer = null;
        }
        
        // Create winning Diana
        this.diana = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'diana_forth');
        this.diana.setScale(this.dianaScale);
        this.diana.setDepth(200); // Increased depth to ensure she's in front
        this.diana.setScrollFactor(0);
        
        // Show victory dialogue
        this.showVictoryDialogue();
    }
    
    showVictoryDialogue() {
        // Create dialogue overlay
        this.dialogueOverlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.height - 100,
            this.cameras.main.width - 100,
            120,
            0x000000,
            0.8
        );
        this.dialogueOverlay.setScrollFactor(0);
        this.dialogueOverlay.setDepth(100);
        
        // Create dialogue text
        this.dialogueText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 100,
            "Diana: Impressive! You've collected all the coins and survived my attendance checks. You may pass!",
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: this.cameras.main.width - 150 }
            }
        );
        this.dialogueText.setOrigin(0.5);
        this.dialogueText.setScrollFactor(0);
        this.dialogueText.setDepth(101);
        
        // Show continue button after 2 seconds
        this.time.delayedCall(2000, () => {
            this.showContinueButton();
        });
    }
    
    showContinueButton() {
        // Create continue button
        this.continueButton = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            200,
            60,
            0x4ecdc4
        );
        this.continueButton.setScrollFactor(0);
        this.continueButton.setDepth(100);
        this.continueButton.setInteractive();
        
        const continueButtonText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'CONTINUE',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        );
        continueButtonText.setOrigin(0.5);
        continueButtonText.setScrollFactor(0);
        continueButtonText.setDepth(101);
        
        // Add button interactions
        this.continueButton.on('pointerdown', () => {
            this.returnToDirectionMap();
        });
        
        this.continueButton.on('pointerover', () => {
            this.continueButton.setFillStyle(0x6ee6de);
            continueButtonText.setScale(1.1);
        });
        
        this.continueButton.on('pointerout', () => {
            this.continueButton.setFillStyle(0x4ecdc4);
            continueButtonText.setScale(1.0);
        });
    }
    
    gameOver() {
        console.log('💀 Diana Scene: Game Over!');
        this.gameStarted = false;
        
        // Show game over screen
        const gameOverText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'GAME OVER\nDiana caught you too many times!',
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                fill: '#ff0000',
                align: 'center',
                fontStyle: 'bold'
            }
        );
        gameOverText.setOrigin(0.5);
        gameOverText.setScrollFactor(0);
        gameOverText.setDepth(200);
        
        // Return to direction map after 3 seconds
        this.time.delayedCall(3000, () => {
            this.returnToDirectionMap();
        });
    }
    
    returnToDirectionMap() {
        console.log('🗺️ Diana Scene: Returning to direction map...');
        
        // Save game state before transition
        const gameStateManager = new GameStateManager();
        gameStateManager.setCurrentScene('BahreddinsHomeScene');
        
        // Return to Bahreddin's Home scene (which has the direction map)
        this.scene.start('BahreddinsHomeScene');
    }
    
    update() {
        if (!this.gameStarted || !this.player) return;
        
        // Handle player movement
        this.handlePlayerMovement();
    }
    
    /**
     * Clean up scene resources
     */
    cleanup() {
        // Clear all timers
        if (this.dianaTimer) {
            this.dianaTimer.destroy();
            this.dianaTimer = null;
        }
        
        if (this.hideTimer) {
            this.hideTimer.destroy();
            this.hideTimer = null;
        }
        
        // Clear hide prompts
        this.clearHidePrompts();
        
        // Reset game state
        this.dianaActive = false;
        this.canHide = false;
        this.isHiding = false;
        this.gameStarted = false;
        
        console.log('🧹 Diana Scene: Cleanup completed');
    }
    
    /**
     * Override scene shutdown to ensure cleanup
     */
    shutdown() {
        this.cleanup();
        super.shutdown();
    }
    
    /**
     * Override scene destroy to ensure cleanup
     */
    destroy() {
        this.cleanup();
        super.destroy();
    }
    
    handlePlayerMovement() {
        const speed = 150;
        let moving = false;
        
        // Reset velocity
        this.player.setVelocity(0);
        
        // Handle movement input
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-speed);
            this.player.play('dimash_walk_left', true);
            moving = true;
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(speed);
            this.player.play('dimash_walk_right', true);
            moving = true;
        }
        
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.setVelocityY(-speed);
            if (!moving) this.player.play('dimash_walk_up', true);
            moving = true;
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.setVelocityY(speed);
            if (!moving) this.player.play('dimash_walk_down', true);
            moving = true;
        }
        
        // Play idle animation if not moving
        if (!moving) {
            this.player.play('dimash_idle', true);
        }
    }
}