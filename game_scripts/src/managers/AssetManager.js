/**
 * Asset Manager
 * Handles loading and management of game assets following Single Responsibility Principle
 */
class AssetManager {
    constructor(scene) {
        this.scene = scene;
    }
    
    /**
     * Preload all game assets
     */
    preloadAssets() {
        // Load map background
        this.scene.load.image(
            GameConfig.ASSETS.MAP.BACKGROUND.KEY, 
            GameConfig.ASSETS.MAP.BACKGROUND.PATH
        );
        
        // Load player sprites
        const playerAssets = GameConfig.ASSETS.PLAYER;
        Object.values(playerAssets).forEach(asset => {
            this.scene.load.image(asset.KEY, asset.PATH);
        });
        
        // Load villain sprites
        const villainAssets = GameConfig.ASSETS.VILLAIN;
        Object.values(villainAssets).forEach(asset => {
            this.scene.load.image(asset.KEY, asset.PATH);
        });
        
        // Load companion sprites
        const companionAssets = GameConfig.ASSETS.COMPANION;
        Object.values(companionAssets).forEach(asset => {
            this.scene.load.image(asset.KEY, asset.PATH);
        });
        
        // Load teleport assets
        const teleportAssets = GameConfig.ASSETS.TELEPORT;
        Object.values(teleportAssets).forEach(asset => {
            this.scene.load.image(asset.KEY, asset.PATH);
        });
        
        // Set loading progress bar
        this.createLoadingBar();
    }
    
    /**
     * Create visual loading progress bar
     */
    createLoadingBar() {
        const width = GameConfig.GAME.WIDTH;
        const height = GameConfig.GAME.HEIGHT;
        
        // Progress bar background
        const progressBg = this.scene.add.graphics();
        progressBg.fillStyle(0x222222);
        progressBg.fillRect(width / 4, height / 2 - 30, width / 2, 60);
        
        // Progress bar fill
        const progressBar = this.scene.add.graphics();
        
        // Loading text
        const loadingText = this.scene.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Update progress
        this.scene.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ff00);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 40);
        });
        
        // Clean up when complete
        this.scene.load.on('complete', () => {
            progressBg.destroy();
            progressBar.destroy();
            loadingText.destroy();
        });
    }
    
    /**
     * Create background map
     */
    createBackground() {
        const map = this.scene.add.image(0, 0, GameConfig.ASSETS.MAP.BACKGROUND.KEY);
        map.setOrigin(0, 0);
        
        // Scale map to fit screen properly without infinite scaling
        const scaleX = GameConfig.GAME.WIDTH / map.width;
        const scaleY = GameConfig.GAME.HEIGHT / map.height;
        
        // Use minimum scale to ensure the entire map fits within the screen
        // and prevent infinite scaling issues
        const scale = Math.min(scaleX, scaleY);
        
        // Ensure scale doesn't go below a reasonable minimum or above maximum
        const finalScale = Math.max(0.5, Math.min(scale, 2.0));
        map.setScale(finalScale);
        
        console.log(`🗺️ Background scaled: ${finalScale} (original: ${map.width}x${map.height}, target: ${GameConfig.GAME.WIDTH}x${GameConfig.GAME.HEIGHT})`);
        
        return map;
    }
}