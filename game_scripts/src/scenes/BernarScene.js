/**
 * Bernar Snake Game Scene
 * A snake game where Bernar is the snake head and must eat 15 Docker apples to become human
 */
class BernarScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BernarScene' });
        
        // Game state
        this.gameStarted = false;
        this.gameWon = false;
        this.gameOver = false;
        this.applesEaten = 0;
        this.targetApples = GameConfig.BERNAR_SNAKE_GAME.APPLES_TO_WIN;
        this.bernarCelebrationShown = false;
        
        // Lore introduction state
        this.loreIntroActive = false;
        this.loreCompleted = false;
        this.bahreddinSprite = null;
        
        // Snake properties
        this.snake = [];
        this.direction = { x: 1, y: 0 }; // Start moving right
        this.nextDirection = { x: 1, y: 0 };
        this.gridSize = GameConfig.BERNAR_SNAKE_GAME.GRID_SIZE;
        this.gameSpeed = GameConfig.BERNAR_SNAKE_GAME.INITIAL_SPEED;
        
        // Apple properties
        this.apple = null;
        
        // UI elements
        this.scoreText = null;
        this.instructionText = null;
        this.gameArea = null;
        this.startButton = null;
        
        // Celebration elements
        this.bernarSprites = [];
        this.burgerFountain = [];
        this.celebrationActive = false;
        
        // Timers
        this.moveTimer = null;
        this.celebrationTimer = null;
        
        // Game state manager
        this.gameStateManager = new GameStateManager();
    }
    
    preload() {
        console.log('🐍 Loading Bernar Snake Game assets...');
        
        // Load celebration assets (still needed for win condition)
        this.load.image(
            GameConfig.ASSETS.BERNAR.BERNAR1.KEY,
            GameConfig.ASSETS.BERNAR.BERNAR1.PATH
        );
        this.load.image(
            GameConfig.ASSETS.BERNAR.BERNAR_LAUGH.KEY,
            GameConfig.ASSETS.BERNAR.BERNAR_LAUGH.PATH
        );
        this.load.image(
            GameConfig.ASSETS.BERNAR.BERNAR_LAUGH2.KEY,
            GameConfig.ASSETS.BERNAR.BERNAR_LAUGH2.PATH
        );
        this.load.image(
            GameConfig.ASSETS.BERNAR.BURGER.KEY,
            GameConfig.ASSETS.BERNAR.BURGER.PATH
        );
        
        // Load docker image for apples
        this.load.image(
            GameConfig.ASSETS.BERNAR.DOCKER.KEY,
            GameConfig.ASSETS.BERNAR.DOCKER.PATH
        );
        
        // Load bernar head image for snake head
        this.load.image(
            'bernar_head',
            'assets/bernar_assets/bernar_head.png'
        );
        
        // Load Bahreddin for lore introduction
        this.load.image(
            GameConfig.ASSETS.COMPANION.BAHREDDIN.KEY,
            GameConfig.ASSETS.COMPANION.BAHREDDIN.PATH
        );
        
        console.log('✅ Bernar Snake Game assets loaded!');
    }
    
    create() {
        console.log('🐍 Creating Bernar Snake Game...');
        
        // Create background
        this.createBackground();
        
        // Create game area
        this.createGameArea();
        
        // Initialize snake
        this.initializeSnake();
        
        // Create first apple
        this.createApple();
        
        // Create UI
        this.createUI();
        
        // Setup controls
        this.setupControls();
        
        // Start with lore introduction
        this.startLoreIntroduction();
        
        // Save game state
        this.gameStateManager.setCurrentScene('BernarScene');
        
        console.log('✅ Bernar Snake Game created successfully!');
    }
    
    createBackground() {
        // Create green block background pattern
        const blockSize = this.gridSize;
        const gameArea = GameConfig.BERNAR_SNAKE_GAME.GAME_AREA;
        
        // Fill entire screen with darker green
        const fullBg = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH,
            GameConfig.GAME.HEIGHT,
            0x228B22 // Forest green
        );
        
        // Create green block pattern in game area
        const blocksX = Math.floor(gameArea.WIDTH / blockSize);
        const blocksY = Math.floor(gameArea.HEIGHT / blockSize);
        
        for (let x = 0; x < blocksX; x++) {
            for (let y = 0; y < blocksY; y++) {
                // Alternate between two shades of green for checkerboard pattern
                const isEven = (x + y) % 2 === 0;
                const color = isEven ? 0x32CD32 : 0x228B22; // Lime green and forest green
                
                const block = this.add.rectangle(
                    gameArea.X + x * blockSize + blockSize / 2,
                    gameArea.Y + y * blockSize + blockSize / 2,
                    blockSize - 2, // Small gap between blocks
                    blockSize - 2,
                    color
                );
                block.setStrokeStyle(1, 0x006400); // Dark green border
            }
        }
    }
    
    createGameArea() {
        const config = GameConfig.BERNAR_SNAKE_GAME.GAME_AREA;
        
        // Create game area border
        const border = this.add.rectangle(
            config.X + config.WIDTH / 2,
            config.Y + config.HEIGHT / 2,
            config.WIDTH + 4,
            config.HEIGHT + 4
        );
        border.setStrokeStyle(4, 0x006400); // Dark green border
        border.setFillStyle(0x000000, 0); // Transparent fill
    }
    
    initializeSnake() {
        const config = GameConfig.BERNAR_SNAKE_GAME;
        const startX = Math.floor(config.GAME_AREA.WIDTH / (2 * this.gridSize));
        const startY = Math.floor(config.GAME_AREA.HEIGHT / (2 * this.gridSize));
        
        this.snake = [];
        
        // Create initial snake segments
        for (let i = 0; i < config.SNAKE_INITIAL_LENGTH; i++) {
            const segment = {
                x: startX - i,
                y: startY,
                sprite: null,
                direction: { x: 1, y: 0 } // All segments initially facing right
            };
            
            if (i === 0) {
                // Create head using bernar_head.png image
                segment.sprite = this.add.image(
                    config.GAME_AREA.X + segment.x * this.gridSize + this.gridSize / 2,
                    config.GAME_AREA.Y + segment.y * this.gridSize + this.gridSize / 2,
                    'bernar_head'
                );
                
                // Scale the head image to fit the grid
                const scale = (this.gridSize - 4) / Math.max(segment.sprite.width, segment.sprite.height);
                segment.sprite.setScale(scale);
                
                // Set rotation based on direction
                this.setRotationForDirection(segment.sprite, segment.direction);
                
                // Set head depth
                segment.sprite.setDepth(200);
            } else {
                // Create red block for body segments
                segment.sprite = this.add.rectangle(
                    config.GAME_AREA.X + segment.x * this.gridSize + this.gridSize / 2,
                    config.GAME_AREA.Y + segment.y * this.gridSize + this.gridSize / 2,
                    this.gridSize - 4, // Slightly smaller than grid for visual separation
                    this.gridSize - 4,
                    0xFF0000 // Red color
                );
                
                // Add border to make blocks more defined
                segment.sprite.setStrokeStyle(2, 0x8B0000); // Dark red border
                
                // Add subtle depth effect to make segments look more connected
                segment.sprite.setDepth(100 - i); // Body segments have decreasing depth
            }
            
            this.snake.push(segment);
        }
    }
    
    createApple() {
        const config = GameConfig.BERNAR_SNAKE_GAME.GAME_AREA;
        let appleX, appleY;
        let validPosition = false;
        
        // Find a valid position for the apple (not on snake)
        while (!validPosition) {
            appleX = Math.floor(Math.random() * (config.WIDTH / this.gridSize));
            appleY = Math.floor(Math.random() * (config.HEIGHT / this.gridSize));
            
            validPosition = true;
            for (const segment of this.snake) {
                if (segment.x === appleX && segment.y === appleY) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        // Remove existing apple if any
        if (this.apple && this.apple.sprite) {
            this.apple.sprite.destroy();
        }
        
        // Create new apple using docker.png
        this.apple = {
            x: appleX,
            y: appleY,
            sprite: this.add.image(
                config.X + appleX * this.gridSize + this.gridSize / 2,
                config.Y + appleY * this.gridSize + this.gridSize / 2,
                GameConfig.ASSETS.BERNAR.DOCKER.KEY
            )
        };
        
        // Scale the docker image to fit the grid
        const scale = (this.gridSize - 6) / Math.max(this.apple.sprite.width, this.apple.sprite.height);
        this.apple.sprite.setScale(scale);
        
        // Add pulsing animation to apple
        this.tweens.add({
            targets: this.apple.sprite,
            scaleX: scale * 1.2,
            scaleY: scale * 1.2,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createUI() {
        const config = GameConfig.BERNAR_SNAKE_GAME.UI;
        
        // Score text
        this.scoreText = this.add.text(
            20,
            20,
            `${this.applesEaten}/15 apples`,
            config.SCORE_STYLE
        );
        
        // Instructions
        this.instructionText = this.add.text(
            20,
            60,
            'Use WASD to move Bernar snake and eat Docker apples!',
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 1
            }
        );
        
        // Lore text
        this.add.text(
            20,
            GameConfig.GAME.HEIGHT - 80,
            'Lore: Arman made Bernar into a snake!',
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 1
            }
        );
        
        this.add.text(
            20,
            GameConfig.GAME.HEIGHT - 60,
            'Help him by eating 15 Docker apples to become human again!',
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 1
            }
        );
        
        // Back button
        this.createBackButton();
    }
    
    createBackButton() {
        const backButton = this.add.text(
            GameConfig.GAME.WIDTH - 20,
            20,
            '← Back to Map',
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                backgroundColor: '#ff4444',
                padding: { x: 15, y: 8 }
            }
        );
        
        backButton.setOrigin(1, 0);
        backButton.setInteractive({ useHandCursor: true });
        
        backButton.on('pointerdown', () => {
            this.goBackToMap();
        });
        
        backButton.on('pointerover', () => {
            backButton.setScale(1.1);
        });
        
        backButton.on('pointerout', () => {
            backButton.setScale(1);
        });
    }
    
    setupControls() {
        // Create cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Create WASD keys
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        // Handle input
        this.input.keyboard.on('keydown', (event) => {
            // Don't allow controls during lore introduction
            if (this.loreIntroActive || this.gameOver || this.celebrationActive) return;
            
            switch (event.code) {
                case 'KeyW':
                case 'ArrowUp':
                    if (this.direction.y !== 1) {
                        this.nextDirection = { x: 0, y: -1 };
                    }
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    if (this.direction.y !== -1) {
                        this.nextDirection = { x: 0, y: 1 };
                    }
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    if (this.direction.x !== 1) {
                        this.nextDirection = { x: -1, y: 0 };
                    }
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    if (this.direction.x !== -1) {
                        this.nextDirection = { x: 1, y: 0 };
                    }
                    break;
            }
        });
    }
    
    startGameLoop() {
        this.gameStarted = true;
        this.moveTimer = this.time.addEvent({
            delay: this.gameSpeed,
            callback: this.moveSnake,
            callbackScope: this,
            loop: true
        });
    }
    
    moveSnake() {
        if (this.gameOver || this.celebrationActive) return;
        
        // Update direction
        this.direction = { ...this.nextDirection };
        
        // Calculate new head position
        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y,
            sprite: null,
            direction: { ...this.direction }
        };
        
        // Check wall collision
        const config = GameConfig.BERNAR_SNAKE_GAME.GAME_AREA;
        const maxX = Math.floor(config.WIDTH / this.gridSize);
        const maxY = Math.floor(config.HEIGHT / this.gridSize);
        
        if (newHead.x < 0 || newHead.x >= maxX || newHead.y < 0 || newHead.y >= maxY) {
            this.gameOver = true;
            this.handleGameOver();
            return;
        }
        
        // Check self collision
        for (const segment of this.snake) {
            if (segment.x === newHead.x && segment.y === newHead.y) {
                this.gameOver = true;
                this.handleGameOver();
                return;
            }
        }
        
        // Check apple collision
        let ateApple = false;
        if (this.apple && newHead.x === this.apple.x && newHead.y === this.apple.y) {
            ateApple = true;
            this.eatApple();
        }
        
        // Create new head sprite using bernar_head.png image
        newHead.sprite = this.add.image(
            config.X + newHead.x * this.gridSize + this.gridSize / 2,
            config.Y + newHead.y * this.gridSize + this.gridSize / 2,
            'bernar_head'
        );
        
        // Scale the head image to fit the grid
        const scale = (this.gridSize - 4) / Math.max(newHead.sprite.width, newHead.sprite.height);
        newHead.sprite.setScale(scale);
        
        // Set rotation based on direction
        this.setRotationForDirection(newHead.sprite, newHead.direction);
        
        // Set depth for the new head
        newHead.sprite.setDepth(200);
        
        // Convert old head to body and update its properties
        if (this.snake.length > 0) {
            const oldHead = this.snake[0];
            
            // Destroy the old head image and replace with red block
            if (oldHead.sprite) {
                oldHead.sprite.destroy();
            }
            
            // Create red block for the old head (now body segment)
            oldHead.sprite = this.add.rectangle(
                config.X + oldHead.x * this.gridSize + this.gridSize / 2,
                config.Y + oldHead.y * this.gridSize + this.gridSize / 2,
                this.gridSize - 4,
                this.gridSize - 4,
                0xFF0000 // Red color
            );
            
            // Add border to make blocks more defined
            oldHead.sprite.setStrokeStyle(2, 0x8B0000); // Dark red border
            
            // Set the direction for the old head (now body segment)
            oldHead.direction = { ...this.direction };
            
            // Set depth for body segment
            oldHead.sprite.setDepth(199);
        }
        
        // Add new head to snake
        this.snake.unshift(newHead);
        
        // Update all body segments rotation
        this.updateBodyRotations();
        
        // Remove tail if no apple was eaten
        if (!ateApple) {
            const tail = this.snake.pop();
            if (tail && tail.sprite) {
                tail.sprite.destroy();
            }
        }
    }
    
    setRotationForDirection(sprite, direction) {
        // Set rotation based on direction
        // Right: 0, Down: π/2, Left: π, Up: -π/2
        if (direction.x === 1 && direction.y === 0) {
            sprite.setRotation(0); // Right
        } else if (direction.x === 0 && direction.y === 1) {
            sprite.setRotation(Math.PI / 2); // Down
        } else if (direction.x === -1 && direction.y === 0) {
            sprite.setRotation(Math.PI); // Left
        } else if (direction.x === 0 && direction.y === -1) {
            sprite.setRotation(-Math.PI / 2); // Up
        }
    }
    
    getBodyDirection(currentSegment, nextSegment, prevSegment) {
        // For body segments, determine rotation based on neighboring segments
        if (!prevSegment) {
            return currentSegment.direction || { x: 1, y: 0 };
        }
        
        // Calculate direction from current to previous segment (where we came from)
        const dx = prevSegment.x - currentSegment.x;
        const dy = prevSegment.y - currentSegment.y;
        
        // Return the direction that connects this segment to the previous one
        if (dx !== 0) {
            return { x: dx > 0 ? 1 : -1, y: 0 };
        } else if (dy !== 0) {
            return { x: 0, y: dy > 0 ? 1 : -1 };
        }
        
        // Fallback to current direction
        return currentSegment.direction || { x: 1, y: 0 };
    }
    
    updateBodyRotations() {
        // Update rotation for all body segments (skip head at index 0)
        for (let i = 1; i < this.snake.length; i++) {
            const segment = this.snake[i];
            const prevSegment = i > 0 ? this.snake[i - 1] : null;
            const nextSegment = i < this.snake.length - 1 ? this.snake[i + 1] : null;
            
            if (segment.sprite && prevSegment) {
                // For body segments, align with the direction from current to previous segment
                const bodyDirection = this.getBodyDirection(segment, nextSegment, prevSegment);
                this.setRotationForDirection(segment.sprite, bodyDirection);
                
                // Store the direction for this segment
                segment.direction = bodyDirection;
            }
        }
    }
    
    eatApple() {
        this.applesEaten++;
        this.scoreText.setText(`${this.applesEaten}/15 apples`);
        
        // Destroy apple sprite
        if (this.apple && this.apple.sprite) {
            this.apple.sprite.destroy();
        }
        
        // Increase speed slightly
        this.gameSpeed = Math.max(100, this.gameSpeed - GameConfig.BERNAR_SNAKE_GAME.SPEED_INCREASE);
        if (this.moveTimer) {
            this.moveTimer.delay = this.gameSpeed;
        }
        
        // Check for Bernar celebration at 10 apples
        if (this.applesEaten === GameConfig.BERNAR_SNAKE_GAME.BERNAR_CELEBRATION_AT && !this.bernarCelebrationShown) {
            this.bernarCelebrationShown = true;
            this.showBernarCelebration();
        }
        
        // Check win condition
        if (this.applesEaten >= this.targetApples) {
            this.winGame();
        } else {
            // Create new apple
            this.createApple();
        }
        
        // Play eat sound effect (visual feedback)
        this.cameras.main.flash(100, 0, 255, 0);
    }
    
    startLoreIntroduction() {
        console.log('📖 Starting lore introduction...');
        this.loreIntroActive = true;
        
        // Create overlay
        const overlay = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH,
            GameConfig.GAME.HEIGHT,
            0x000000,
            0.8
        );
        overlay.setDepth(1000);
        
        // Create Bahreddin sprite
        this.bahreddinSprite = this.add.image(
            GameConfig.GAME.WIDTH / 2 - 200,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.ASSETS.COMPANION.BAHREDDIN.KEY
        );
        this.bahreddinSprite.setScale(1.2);
        this.bahreddinSprite.setDepth(1001);
        this.bahreddinSprite.setAlpha(0);
        
        // Animate Bahreddin entrance
        this.tweens.add({
            targets: this.bahreddinSprite,
            alpha: 1,
            x: GameConfig.GAME.WIDTH / 2 - 150,
            duration: 1000,
            ease: 'Power2'
        });
        
        // Show lore text
        this.time.delayedCall(1000, () => {
            this.showLoreText(overlay);
        });
    }
    
    showLoreText(overlay) {
        const loreText = this.add.text(
            GameConfig.GAME.WIDTH / 2 + 50,
            GameConfig.GAME.HEIGHT / 2 - 100,
            'Listen, Dimash...\n\nArman has cursed our brave warrior Bernar,\nturning him into a snake!\n\nYou must help him eat Docker containers\nto break the curse and become human again.\n\nCollect 15 Docker apples to free Bernar\nfrom this terrible fate!',
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2,
                align: 'left',
                lineSpacing: 10
            }
        );
        loreText.setDepth(1002);
        loreText.setAlpha(0);
        
        // Animate text appearance
        this.tweens.add({
            targets: loreText,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });
        
        // Create start button after text appears
        this.time.delayedCall(2000, () => {
            this.createStartButton(overlay, loreText);
        });
    }
    
    createStartButton(overlay, loreText) {
        this.startButton = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 + 150,
            'START GAME',
            {
                fontSize: '28px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                backgroundColor: '#4ecdc4',
                padding: { x: 30, y: 15 },
                borderRadius: 10
            }
        );
        
        this.startButton.setOrigin(0.5);
        this.startButton.setDepth(1003);
        this.startButton.setInteractive({ useHandCursor: true });
        this.startButton.setAlpha(0);
        
        // Animate button appearance
        this.tweens.add({
            targets: this.startButton,
            alpha: 1,
            scale: 1.1,
            duration: 500,
            ease: 'Back.easeOut'
        });
        
        // Add hover effects
        this.startButton.on('pointerover', () => {
            this.startButton.setScale(1.2);
        });
        
        this.startButton.on('pointerout', () => {
            this.startButton.setScale(1.1);
        });
        
        // Add click handler
        this.startButton.on('pointerdown', () => {
            this.startGameFromLore(overlay, loreText);
        });
    }
    
    startGameFromLore(overlay, loreText) {
        console.log('🎮 Starting game from lore...');
        
        // Animate elements out
        this.tweens.add({
            targets: [overlay, this.bahreddinSprite, loreText, this.startButton],
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                // Clean up lore elements
                overlay.destroy();
                this.bahreddinSprite.destroy();
                loreText.destroy();
                this.startButton.destroy();
                
                // Mark lore as completed and start game
                this.loreIntroActive = false;
                this.loreCompleted = true;
                this.startGameLoop();
            }
        });
    }
    
    showBernarCelebration() {
        console.log('🎉 Showing Bernar celebration at 10 apples!');
        
        // Stop the game completely
        this.gameOver = true;
        if (this.moveTimer) {
            this.moveTimer.destroy();
            this.moveTimer = null;
        }
        
        // Create celebration overlay
        const celebrationOverlay = this.add.rectangle(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            GameConfig.GAME.WIDTH,
            GameConfig.GAME.HEIGHT,
            0x000000,
            0.8
        );
        celebrationOverlay.setDepth(500);
        
        // Create single Bernar sprite on the left
        const leftX = 150;
        const centerY = GameConfig.GAME.HEIGHT / 2;
        
        const bernarSprite = this.add.image(leftX, centerY, GameConfig.ASSETS.BERNAR.BERNAR1.KEY);
        bernarSprite.setScale(1.2);
        bernarSprite.setDepth(501);
        bernarSprite.setAlpha(0);
        
        // Animate Bernar appearance
        this.tweens.add({
            targets: bernarSprite,
            alpha: 1,
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Start laugh animation sequence after appearance
        this.time.delayedCall(1000, () => {
            this.startBernarLaughSequence(bernarSprite);
        });
        
        // Create burger fountain
        this.time.delayedCall(2000, () => {
            this.createBurgerFountain(leftX);
        });
        
        // Show celebration message
        const celebrationText = this.add.text(
            GameConfig.GAME.WIDTH / 2 + 100,
            GameConfig.GAME.HEIGHT / 2 - 50,
            'Congratulations!\nBernar has been partially freed!\n\nThe curse is weakening...',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 2,
                align: 'center',
                lineSpacing: 10
            }
        );
        celebrationText.setOrigin(0.5);
        celebrationText.setDepth(502);
        celebrationText.setAlpha(0);
        
        this.tweens.add({
            targets: celebrationText,
            alpha: 1,
            duration: 1000,
            ease: 'Power2'
        });
        
        // Show "Back to Bahreddin" button after animation
        this.time.delayedCall(4000, () => {
            this.createBackToBahreddinButton(celebrationOverlay, bernarSprite, celebrationText);
        });
    }
    
    startBernarLaughSequence(bernarSprite) {
        // Array of Bernar images for the laugh sequence
        const laughImages = [
            GameConfig.ASSETS.BERNAR.BERNAR1.KEY,
            GameConfig.ASSETS.BERNAR.BERNAR_LAUGH.KEY,
            GameConfig.ASSETS.BERNAR.BERNAR_LAUGH2.KEY,
            GameConfig.ASSETS.BERNAR.BERNAR_LAUGH.KEY,
            GameConfig.ASSETS.BERNAR.BERNAR1.KEY,
            GameConfig.ASSETS.BERNAR.BERNAR_LAUGH2.KEY,
            GameConfig.ASSETS.BERNAR.BERNAR_LAUGH.KEY,
            GameConfig.ASSETS.BERNAR.BERNAR1.KEY
        ];
        
        let currentImageIndex = 0;
        
        // Create a timer that cycles through the images
        const laughTimer = this.time.addEvent({
            delay: 300, // Change image every 300ms
            callback: () => {
                bernarSprite.setTexture(laughImages[currentImageIndex]);
                
                // Add a slight bounce effect with each image change
                this.tweens.add({
                    targets: bernarSprite,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    duration: 150,
                    yoyo: true,
                    ease: 'Sine.easeInOut'
                });
                
                currentImageIndex = (currentImageIndex + 1) % laughImages.length;
            },
            callbackScope: this,
            repeat: 7 // Repeat 8 times total (8 image changes)
        });
        
        // Stop the animation after the sequence completes
        this.time.delayedCall(2400, () => {
            if (laughTimer) {
                laughTimer.destroy();
            }
            // Set final image to normal Bernar
            bernarSprite.setTexture(GameConfig.ASSETS.BERNAR.BERNAR1.KEY);
            bernarSprite.setScale(1.2); // Reset scale
        });
    }
    
    createBurgerFountain(startX) {
        // Create burger fountain from Bernar's position
        for (let i = 0; i < 10; i++) {
            this.time.delayedCall(i * 100, () => {
                const burger = this.add.image(
                    startX + (Math.random() - 0.5) * 100,
                    GameConfig.GAME.HEIGHT / 2 + 100,
                    GameConfig.ASSETS.BERNAR.BURGER.KEY
                );
                
                burger.setScale(0.4);
                burger.setDepth(503);
                
                // Animate burger flying
                this.tweens.add({
                    targets: burger,
                    y: GameConfig.GAME.HEIGHT / 2 - 100 - Math.random() * 50,
                    x: burger.x + (Math.random() - 0.5) * 200,
                    rotation: Math.random() * Math.PI * 2,
                    scale: 0.6,
                    duration: 800,
                    ease: 'Quad.easeOut',
                    onComplete: () => {
                        // Make burger fall and disappear
                        this.tweens.add({
                            targets: burger,
                            y: GameConfig.GAME.HEIGHT + 50,
                            alpha: 0,
                            duration: 600,
                            ease: 'Quad.easeIn',
                            onComplete: () => {
                                burger.destroy();
                            }
                        });
                    }
                });
            });
        }
    }
    
    createBackToBahreddinButton(celebrationOverlay, bernarSprite, celebrationText) {
        // Create "Back to Bahreddin" button
        const backToBahreddinButton = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 + 100,
            'BACK TO BAHREDDIN',
            {
                fontSize: '28px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                backgroundColor: '#8B4513',
                padding: { x: 30, y: 15 },
                borderRadius: 10
            }
        );
        
        backToBahreddinButton.setOrigin(0.5);
        backToBahreddinButton.setDepth(503);
        backToBahreddinButton.setInteractive({ useHandCursor: true });
        backToBahreddinButton.setAlpha(0);
        
        // Animate button appearance
        this.tweens.add({
            targets: backToBahreddinButton,
            alpha: 1,
            scale: 1.1,
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Add hover effects
        backToBahreddinButton.on('pointerover', () => {
            backToBahreddinButton.setScale(1.2);
            backToBahreddinButton.setStyle({ backgroundColor: '#A0522D' });
        });
        
        backToBahreddinButton.on('pointerout', () => {
            backToBahreddinButton.setScale(1.1);
            backToBahreddinButton.setStyle({ backgroundColor: '#8B4513' });
        });
        
        // Add click handler to go back to Bahreddin's home
        backToBahreddinButton.on('pointerdown', () => {
            console.log('🏠 Going back to Bahreddin\'s home...');
            
            // Animate everything out
            this.tweens.add({
                targets: [celebrationOverlay, bernarSprite, celebrationText, backToBahreddinButton],
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    // Clean up all elements
                    celebrationOverlay.destroy();
                    bernarSprite.destroy();
                    celebrationText.destroy();
                    backToBahreddinButton.destroy();
                    
                    // Transition to Bahreddin's home
                    this.goToBahreddin();
                }
            });
        });
    }
    
    goToBahreddin() {
        console.log('🏠 Transitioning to Bahreddin\'s home...');
        
        // Clean up the current scene
        this.cleanup();
        
        // Transition to Bahreddin's home scene
        this.scene.start('BahreddinsHomeScene');
    }
    
    winGame() {
        console.log('🎉 Bernar is free!');
        this.gameWon = true;
        this.gameOver = true;
        this.celebrationActive = true;
        
        // Stop game timer
        if (this.moveTimer) {
            this.moveTimer.destroy();
        }
        
        // Hide snake and apple
        this.snake.forEach(segment => {
            if (segment.sprite) {
                segment.sprite.setVisible(false);
            }
        });
        
        if (this.apple && this.apple.sprite) {
            this.apple.sprite.setVisible(false);
        }
        
        // Start celebration sequence
        this.startCelebration();
    }
    
    startCelebration() {
        const config = GameConfig.BERNAR_SNAKE_GAME.CELEBRATION;
        const centerX = GameConfig.GAME.WIDTH / 2;
        const centerY = GameConfig.GAME.HEIGHT / 2;
        
        // Create Bernar celebration sprites
        const bernar1 = this.add.image(centerX - 100, centerY, GameConfig.ASSETS.BERNAR.BERNAR1.KEY);
        const bernarLaugh = this.add.image(centerX, centerY, GameConfig.ASSETS.BERNAR.BERNAR_LAUGH.KEY);
        const bernarLaugh2 = this.add.image(centerX + 100, centerY, GameConfig.ASSETS.BERNAR.BERNAR_LAUGH2.KEY);
        
        // Scale Bernar sprites
        [bernar1, bernarLaugh, bernarLaugh2].forEach(sprite => {
            sprite.setScale(0.8);
            sprite.setAlpha(0);
        });
        
        this.bernarSprites = [bernar1, bernarLaugh, bernarLaugh2];
        
        // Animate Bernar appearance
        this.tweens.add({
            targets: this.bernarSprites,
            alpha: 1,
            scale: 1,
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Animate Bernar laughing
        this.time.delayedCall(1000, () => {
            this.bernarSprites.forEach((sprite, index) => {
                this.tweens.add({
                    targets: sprite,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 300,
                    yoyo: true,
                    repeat: 5,
                    delay: index * 100,
                    ease: 'Sine.easeInOut'
                });
            });
        });
        
        // Start burger fountain after laugh
        this.time.delayedCall(config.LAUGH_DURATION, () => {
            this.startBurgerFountain();
        });
    }
    
    startBurgerFountain() {
        const config = GameConfig.BERNAR_SNAKE_GAME.CELEBRATION;
        const centerX = GameConfig.GAME.WIDTH / 2;
        const centerY = GameConfig.GAME.HEIGHT / 2;
        
        // Hide Bernar sprites
        this.bernarSprites.forEach(sprite => {
            this.tweens.add({
                targets: sprite,
                alpha: 0,
                duration: 500
            });
        });
        
        // Create burger fountain
        for (let i = 0; i < config.BURGER_COUNT; i++) {
            this.time.delayedCall(i * 100, () => {
                const burger = this.add.image(
                    centerX + (Math.random() - 0.5) * 200,
                    centerY + 200,
                    GameConfig.ASSETS.BERNAR.BURGER.KEY
                );
                
                burger.setScale(0.5);
                this.burgerFountain.push(burger);
                
                // Animate burger flying up
                this.tweens.add({
                    targets: burger,
                    y: centerY - 200 - Math.random() * 100,
                    x: burger.x + (Math.random() - 0.5) * 300,
                    rotation: Math.random() * Math.PI * 2,
                    scale: 0.8,
                    duration: config.FOUNTAIN_SPEED + Math.random() * 200,
                    ease: 'Quad.easeOut',
                    onComplete: () => {
                        // Make burger fall
                        this.tweens.add({
                            targets: burger,
                            y: GameConfig.GAME.HEIGHT + 50,
                            duration: 1000,
                            ease: 'Quad.easeIn',
                            onComplete: () => {
                                burger.destroy();
                            }
                        });
                    }
                });
            });
        }
        
        // Show Bernar's message
        this.time.delayedCall(500, () => {
            this.showBernarMessage();
        });
        
        // End celebration
        this.time.delayedCall(config.FOUNTAIN_DURATION + 2000, () => {
            this.endCelebration();
        });
    }
    
    showBernarMessage() {
        const config = GameConfig.BERNAR_SNAKE_GAME;
        
        const messageText = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 + 150,
            config.CELEBRATION.BERNAR_MESSAGE,
            config.UI.BERNAR_MESSAGE_STYLE
        );
        
        messageText.setOrigin(0.5);
        messageText.setAlpha(0);
        
        // Animate message appearance
        this.tweens.add({
            targets: messageText,
            alpha: 1,
            scale: 1.1,
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Pulsing effect
        this.tweens.add({
            targets: messageText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    endCelebration() {
        // Show completion message
        const winText = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2 - 100,
            'Bernar is Human Again!\nMission Complete!',
            GameConfig.BERNAR_SNAKE_GAME.UI.WIN_MESSAGE_STYLE
        );
        
        winText.setOrigin(0.5);
        winText.setAlpha(0);
        
        this.tweens.add({
            targets: winText,
            alpha: 1,
            scale: 1.2,
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Auto return to map after celebration
        this.time.delayedCall(3000, () => {
            this.goBackToMap();
        });
    }
    
    handleGameOver() {
        console.log('💀 Game Over!');
        
        // Stop game timer
        if (this.moveTimer) {
            this.moveTimer.destroy();
        }
        
        // Show game over message
        const gameOverText = this.add.text(
            GameConfig.GAME.WIDTH / 2,
            GameConfig.GAME.HEIGHT / 2,
            'Game Over!\nBernar hit something!\nPress R to restart',
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                fill: '#ff0000',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
            }
        );
        
        gameOverText.setOrigin(0.5);
        
        // Add restart functionality
        this.input.keyboard.once('keydown-R', () => {
            this.restartGame();
        });
    }
    
    restartGame() {
        console.log('🔄 Restarting Bernar Snake Game...');
        
        // Reset game state
        this.gameStarted = false;
        this.gameWon = false;
        this.gameOver = false;
        this.applesEaten = 0;
        this.celebrationActive = false;
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.gameSpeed = GameConfig.BERNAR_SNAKE_GAME.INITIAL_SPEED;
        
        // Clean up existing elements
        this.cleanup();
        
        // Restart scene
        this.scene.restart();
    }
    
    goBackToMap() {
        console.log('🗺️ Returning to Bahreddin\'s Home...');
        
        // Save game state
        this.gameStateManager.setCurrentScene('BahreddinsHomeScene');
        
        // Cleanup and transition
        this.cleanup();
        
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('BahreddinsHomeScene');
        });
    }
    
    cleanup() {
        console.log('🧹 Cleaning up Bernar Snake Game...');
        
        // Stop all timers
        if (this.moveTimer) {
            this.moveTimer.destroy();
            this.moveTimer = null;
        }
        
        if (this.celebrationTimer) {
            this.celebrationTimer.destroy();
            this.celebrationTimer = null;
        }
        
        // Clean up snake sprites
        this.snake.forEach(segment => {
            if (segment && segment.sprite && segment.sprite.destroy) {
                segment.sprite.destroy();
            }
        });
        this.snake = [];
        
        // Clean up apple
        if (this.apple && this.apple.sprite && this.apple.sprite.destroy) {
            this.apple.sprite.destroy();
        }
        this.apple = null;
        
        // Clean up celebration elements
        this.bernarSprites.forEach(sprite => {
            if (sprite && sprite.destroy) {
                sprite.destroy();
            }
        });
        this.bernarSprites = [];
        
        this.burgerFountain.forEach(burger => {
            if (burger && burger.destroy) {
                burger.destroy();
            }
        });
        this.burgerFountain = [];
        
        // Stop all tweens
        this.tweens.killAll();
    }
    
    update() {
        // Game loop is handled by timer, no need for continuous updates
    }
}