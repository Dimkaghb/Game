/**
 * Player Entity
 * Handles player character behavior, movement, and animations
 * Following Single Responsibility and Open/Closed Principles
 */
class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = null;
        this.currentDirection = 'stay';
        this.isMoving = false;
        
        this.create(x, y);
        this.setupAnimations();
    }
    
    /**
     * Create player sprite and physics body
     */
    create(x, y) {
        // Create sprite with default "stay" texture
        this.sprite = this.scene.physics.add.sprite(x, y, GameConfig.ASSETS.PLAYER.STAY.KEY);
        
        // Set sprite properties
        this.sprite.setScale(GameConfig.PLAYER.SCALE);
        this.sprite.setCollideWorldBounds(true);
        
        // Setup physics body
        this.sprite.body.setSize(
            GameConfig.PLAYER.SPRITE_SIZE, 
            GameConfig.PLAYER.SPRITE_SIZE
        );
        
        // Set drag for smooth movement
        this.sprite.body.setDrag(300);
    }
    
    /**
     * Setup character animations
     */
    setupAnimations() {
        const anims = this.scene.anims;
        
        // Create animations for each direction
        const directions = ['stay', 'up', 'down', 'left', 'right'];
        
        directions.forEach(direction => {
            const assetKey = GameConfig.ASSETS.PLAYER[direction.toUpperCase()].KEY;
            
            anims.create({
                key: `dimash_${direction}`,
                frames: [{ key: assetKey }],
                frameRate: GameConfig.ANIMATIONS.FRAME_RATE,
                repeat: direction === 'stay' ? 0 : GameConfig.ANIMATIONS.REPEAT
            });
        });
    }
    
    /**
     * Update player movement and animations
     */
    update(inputManager) {
        const movement = inputManager.getMovementInput();
        const isMoving = inputManager.isMoving();
        const primaryDirection = inputManager.getPrimaryDirection();
        
        // Apply movement
        this.sprite.body.setVelocity(
            movement.x * GameConfig.PLAYER.SPEED,
            movement.y * GameConfig.PLAYER.SPEED
        );
        
        // Update animations based on movement
        this.updateAnimation(isMoving, primaryDirection);
        
        // Update movement state
        this.isMoving = isMoving;
    }
    
    /**
     * Update character animation based on movement
     */
    updateAnimation(isMoving, direction) {
        if (!isMoving) {
            // Play idle animation
            if (this.currentDirection !== 'stay') {
                this.sprite.anims.play('dimash_stay', true);
                this.currentDirection = 'stay';
            }
        } else if (direction && direction !== this.currentDirection) {
            // Play movement animation for the new direction
            this.sprite.anims.play(`dimash_${direction}`, true);
            this.currentDirection = direction;
        }
    }
    
    /**
     * Get player position
     */
    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }
    
    /**
     * Set player position
     */
    setPosition(x, y) {
        this.sprite.setPosition(x, y);
    }
    
    /**
     * Get player sprite for collision detection
     */
    getSprite() {
        return this.sprite;
    }
}