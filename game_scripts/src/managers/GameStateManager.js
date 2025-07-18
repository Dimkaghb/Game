/**
 * Game State Manager
 * Handles saving and loading game progress using localStorage
 */
class GameStateManager {
    constructor() {
        this.storageKey = 'koremz_game_state';
        this.defaultState = {
            currentScene: 'GameScene',
            playerProgress: {
                completedScenes: [],
                currentLevel: 1,
                lives: 3,
                coinsCollected: 0,
                totalCoins: 10
            },
            gameSettings: {
                soundEnabled: true,
                musicEnabled: true
            },
            lastSaved: null,
            hasStartedGame: false
        };
    }

    /**
     * Save current game state
     */
    saveGameState(gameState) {
        try {
            const stateToSave = {
                ...gameState,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(stateToSave));
            console.log('💾 Game state saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to save game state:', error);
            return false;
        }
    }

    /**
     * Load saved game state
     */
    loadGameState() {
        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                console.log('📂 Game state loaded successfully');
                return parsedState;
            }
        } catch (error) {
            console.error('❌ Failed to load game state:', error);
        }
        
        console.log('🆕 No saved state found, using default state');
        return this.defaultState;
    }

    /**
     * Check if there's a saved game
     */
    hasSavedGame() {
        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                return parsedState.hasStartedGame === true;
            }
        } catch (error) {
            console.error('❌ Failed to check saved game:', error);
        }
        return false;
    }

    /**
     * Clear saved game state
     */
    clearSavedGame() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('🗑️ Game state cleared successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to clear game state:', error);
            return false;
        }
    }

    /**
     * Update specific part of game state
     */
    updateGameState(updates) {
        const currentState = this.loadGameState();
        const newState = { ...currentState, ...updates };
        return this.saveGameState(newState);
    }

    /**
     * Mark scene as completed
     */
    markSceneCompleted(sceneName) {
        const currentState = this.loadGameState();
        if (!currentState.playerProgress.completedScenes.includes(sceneName)) {
            currentState.playerProgress.completedScenes.push(sceneName);
            this.saveGameState(currentState);
        }
    }

    /**
     * Set current scene
     */
    setCurrentScene(sceneName) {
        this.updateGameState({ 
            currentScene: sceneName,
            hasStartedGame: true
        });
    }

    /**
     * Get current scene
     */
    getCurrentScene() {
        const state = this.loadGameState();
        return state.currentScene;
    }

    /**
     * Check if scene is completed
     */
    isSceneCompleted(sceneName) {
        const state = this.loadGameState();
        return state.playerProgress.completedScenes.includes(sceneName);
    }

    /**
     * Get player progress
     */
    getPlayerProgress() {
        const state = this.loadGameState();
        return state.playerProgress;
    }

    /**
     * Update player progress
     */
    updatePlayerProgress(progress) {
        const currentState = this.loadGameState();
        currentState.playerProgress = { ...currentState.playerProgress, ...progress };
        this.saveGameState(currentState);
    }

    /**
     * Get formatted save time
     */
    getLastSaveTime() {
        const state = this.loadGameState();
        if (state.lastSaved) {
            const saveDate = new Date(state.lastSaved);
            return saveDate.toLocaleString();
        }
        return null;
    }
}