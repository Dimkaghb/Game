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
            
            // Check if the texture exists before creating animation
            if (!this.scene.textures.exists(assetKey)) {
                console.warn(`⚠️ Texture '${assetKey}' not found, skipping animation creation for direction '${direction}'`);
                return;
            }
            
            // Check if animation already exists to prevent duplicates
            if (anims.exists(`dimash_${direction}`)) {
                console.log(`🎬 Animation 'dimash_${direction}' already exists, skipping creation`);
                return;
            }
            
            anims.create({
                key: `dimash_${direction}`,
                frames: [{ key: assetKey }],
                frameRate: GameConfig.ANIMATIONS.FRAME_RATE,
                repeat: direction === 'stay' ? 0 : GameConfig.ANIMATIONS.REPEAT
            });
            
            console.log(`✅ Created animation: dimash_${direction} with texture: ${assetKey}`);
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
        const anims = this.scene.anims;
        
        if (!isMoving) {
            // Play idle animation
            if (this.currentDirection !== 'stay' && anims.exists('dimash_stay')) {
                this.sprite.anims.play('dimash_stay', true);
                this.currentDirection = 'stay';
            }
        } else if (direction && direction !== this.currentDirection) {
            // Play movement animation for the new direction
            const animKey = `dimash_${direction}`;
            if (anims.exists(animKey)) {
                this.sprite.anims.play(animKey, true);
                this.currentDirection = direction;
            } else {
                console.warn(`⚠️ Animation '${animKey}' not found, keeping current animation`);
            }
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