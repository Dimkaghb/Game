/**
 * Input Manager
 * Handles all input controls and key mappings following Single Responsibility Principle
 */
class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.keys = {};
        this.setupControls();
    }
    
    /**
     * Setup keyboard controls
     */
    setupControls() {
        // Create cursor keys for WASD
        this.keys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // Add visual feedback for key presses
        this.setupKeyFeedback();
    }
    
    /**
     * Setup visual feedback for key presses
     */
    setupKeyFeedback() {
        // Optional: Add visual indicators when keys are pressed
        Object.keys(this.keys).forEach(direction => {
            this.keys[direction].on('down', () => {
                console.log(`${direction.toUpperCase()} key pressed`);
            });
        });
    }
    
    /**
     * Get current movement input
     * @returns {Object} Movement vector {x, y}
     */
    getMovementInput() {
        const movement = { x: 0, y: 0 };
        
        if (this.keys.left.isDown) {
            movement.x = -1;
        } else if (this.keys.right.isDown) {
            movement.x = 1;
        }
        
        if (this.keys.up.isDown) {
            movement.y = -1;
        } else if (this.keys.down.isDown) {
            movement.y = 1;
        }
        
        return movement;
    }
    
    /**
     * Check if any movement key is pressed
     * @returns {boolean}
     */
    isMoving() {
        return this.keys.left.isDown || 
               this.keys.right.isDown || 
               this.keys.up.isDown || 
               this.keys.down.isDown;
    }
    
    /**
     * Get the primary direction being pressed
     * @returns {string|null} Direction name or null
     */
    getPrimaryDirection() {
        if (this.keys.up.isDown) return 'up';
        if (this.keys.down.isDown) return 'down';
        if (this.keys.left.isDown) return 'left';
        if (this.keys.right.isDown) return 'right';
        return null;
    }
}