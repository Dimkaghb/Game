/**
 * Main Game Entry Point
 * Initializes and starts the Phaser.js game
 */
class Game {
    constructor() {
        this.config = {
            type: Phaser.AUTO,
            width: GameConfig.GAME.WIDTH,
            height: GameConfig.GAME.HEIGHT,
            parent: GameConfig.GAME.PARENT,
            backgroundColor: GameConfig.GAME.BACKGROUND_COLOR,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false // Set to true for physics debugging
                }
            },
            scene: [MainMenuScene, GameScene, BahreddinsHomeScene, DianaScene, AsselyaScene, BernarScene],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        };
        
        this.game = null;
        this.init();
    }
    
    /**
     * Initialize the game
     */
    init() {
        console.log('🚀 Initializing Koremz RPG Game...');
        
        // Create Phaser game instance
        this.game = new Phaser.Game(this.config);
        
        // Add global error handling
        this.setupErrorHandling();
        
        console.log('✅ Game initialized successfully!');
    }
    
    /**
     * Setup error handling for the game
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('🚨 Game Error:', event.error);
        });
        
        // Handle Phaser specific errors
        this.game.events.on('error', (error) => {
            console.error('🚨 Phaser Error:', error);
        });
    }
    
    /**
     * Get game instance
     */
    getGame() {
        return this.game;
    }
    
    /**
     * Destroy the game
     */
    destroy() {
        if (this.game) {
            this.game.destroy(true);
            this.game = null;
            console.log('🛑 Game destroyed');
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    console.log('🎮 Starting Koremz RPG Adventure...');
    window.koremzGame = new Game();
});