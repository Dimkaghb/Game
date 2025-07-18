/**
 * Achievement Manager
 * Handles achievement tracking, coin rewards, and unlocking special content
 */
class AchievementManager {
    constructor() {
        this.storageKey = 'koremz_achievements';
        this.gameStateManager = new GameStateManager();
        
        // Define mentor achievements with specific medal images
        this.mentorAchievements = {
            'DianaScene': {
                id: 'diana_master',
                name: 'Diana\'s Wisdom',
                description: 'Completed Diana\'s memory challenge',
                coinReward: 100,
                icon: '🧠',
                medalImage: 'assets/gaming_items/coin.png',
                unlocked: false
            },
            'AsselyaScene': {
                id: 'asselya_master',
                name: 'Asselya\'s Grace',
                description: 'Mastered Asselya\'s catching game',
                coinReward: 100,
                icon: '🎯',
                medalImage: 'assets/gaming_items/insta.png',
                unlocked: false
            },
            'BernarScene': {
                id: 'bernar_master',
                name: 'Bernar\'s Courage',
                description: 'Conquered Bernar\'s snake challenge',
                coinReward: 100,
                icon: '🐍',
                medalImage: 'assets/gaming_items/docker.png',
                unlocked: false
            },
            'AbayScene': {
                id: 'abay_master',
                name: 'Abay\'s Speed',
                description: 'Won the race against Abay',
                coinReward: 100,
                icon: '🏃',
                medalImage: 'assets/gaming_items/heart.png',
                unlocked: false
            }
        };
        
        // Special achievement for completing all mentors
        this.masterAchievement = {
            id: 'all_mentors_master',
            name: 'Master of All Mentors',
            description: 'Completed all mentor challenges',
            coinReward: 500,
            icon: '👑',
            unlocked: false
        };
        
        this.loadAchievements();
    }
    
    /**
     * Load achievements from localStorage
     */
    loadAchievements() {
        try {
            const savedAchievements = localStorage.getItem(this.storageKey);
            if (savedAchievements) {
                const parsed = JSON.parse(savedAchievements);
                
                // Update mentor achievements with saved data
                Object.keys(this.mentorAchievements).forEach(sceneKey => {
                    if (parsed.mentorAchievements && parsed.mentorAchievements[sceneKey]) {
                        this.mentorAchievements[sceneKey].unlocked = parsed.mentorAchievements[sceneKey].unlocked;
                    }
                });
                
                // Update master achievement
                if (parsed.masterAchievement) {
                    this.masterAchievement.unlocked = parsed.masterAchievement.unlocked;
                }
                
                console.log('🏆 Achievements loaded successfully');
            }
        } catch (error) {
            console.error('❌ Failed to load achievements:', error);
        }
    }
    
    /**
     * Save achievements to localStorage
     */
    saveAchievements() {
        try {
            const achievementData = {
                mentorAchievements: {},
                masterAchievement: this.masterAchievement,
                lastUpdated: new Date().toISOString()
            };
            
            // Save mentor achievements
            Object.keys(this.mentorAchievements).forEach(sceneKey => {
                achievementData.mentorAchievements[sceneKey] = {
                    unlocked: this.mentorAchievements[sceneKey].unlocked
                };
            });
            
            localStorage.setItem(this.storageKey, JSON.stringify(achievementData));
            console.log('💾 Achievements saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to save achievements:', error);
            return false;
        }
    }
    
    /**
     * Check and unlock achievement for completed scene
     */
    checkSceneCompletion(sceneName) {
        if (!this.mentorAchievements[sceneName]) {
            console.log(`⚠️ No achievement defined for scene: ${sceneName}`);
            return null;
        }
        
        const achievement = this.mentorAchievements[sceneName];
        
        // If already unlocked, return null
        if (achievement.unlocked) {
            console.log(`🏆 Achievement already unlocked: ${achievement.name}`);
            return null;
        }
        
        // Unlock the achievement
        achievement.unlocked = true;
        
        // Award coins
        this.awardCoins(achievement.coinReward);
        
        // Save achievements
        this.saveAchievements();
        
        console.log(`🎉 Achievement unlocked: ${achievement.name} (+${achievement.coinReward} coins)`);
        
        // Check if all mentors are completed
        this.checkAllMentorsCompleted();
        
        return achievement;
    }
    
    /**
     * Award coins to player
     */
    awardCoins(amount) {
        const currentState = this.gameStateManager.loadGameState();
        const newCoinCount = (currentState.playerProgress.coinsCollected || 0) + amount;
        
        this.gameStateManager.updatePlayerProgress({
            coinsCollected: newCoinCount
        });
        
        console.log(`💰 Awarded ${amount} coins! Total: ${newCoinCount}`);
    }
    
    /**
     * Get earned medals for display
     */
    getEarnedMedals() {
        const earnedMedals = [];
        
        Object.entries(this.mentorAchievements).forEach(([sceneKey, achievement]) => {
            if (achievement.unlocked) {
                earnedMedals.push({
                    sceneKey,
                    name: achievement.name,
                    medalImage: achievement.medalImage,
                    description: achievement.description
                });
            }
        });
        
        return earnedMedals;
    }

    /**
     * Check if all mentor achievements are unlocked
     */
    checkAllMentorsCompleted() {
        const allMentorsCompleted = Object.values(this.mentorAchievements).every(achievement => achievement.unlocked);
        
        if (allMentorsCompleted && !this.masterAchievement.unlocked) {
            // Unlock master achievement
            this.masterAchievement.unlocked = true;
            
            // Award bonus coins
            this.awardCoins(this.masterAchievement.coinReward);
            
            // Mark special flag for Armansu storyline
            this.gameStateManager.updateGameState({
                armansuUnlocked: true
            });
            
            this.saveAchievements();
            
            console.log(`👑 MASTER ACHIEVEMENT UNLOCKED: ${this.masterAchievement.name}`);
            console.log('🌟 Armansu storyline is now available!');
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Get achievement for specific scene
     */
    getAchievement(sceneName) {
        return this.mentorAchievements[sceneName] || null;
    }
    
    /**
     * Get all unlocked achievements
     */
    getUnlockedAchievements() {
        const unlocked = [];
        
        // Add unlocked mentor achievements
        Object.values(this.mentorAchievements).forEach(achievement => {
            if (achievement.unlocked) {
                unlocked.push(achievement);
            }
        });
        
        // Add master achievement if unlocked
        if (this.masterAchievement.unlocked) {
            unlocked.push(this.masterAchievement);
        }
        
        return unlocked;
    }
    
    /**
     * Get total coins earned from achievements
     */
    getTotalAchievementCoins() {
        let total = 0;
        
        Object.values(this.mentorAchievements).forEach(achievement => {
            if (achievement.unlocked) {
                total += achievement.coinReward;
            }
        });
        
        if (this.masterAchievement.unlocked) {
            total += this.masterAchievement.coinReward;
        }
        
        return total;
    }
    
    /**
     * Check if all mentor achievements are unlocked
     */
    hasAllMentorAchievements() {
        return Object.values(this.mentorAchievements).every(achievement => achievement.unlocked);
    }

    /**
     * Check if Armansu storyline is unlocked
     */
    isArmansuUnlocked() {
        const gameState = this.gameStateManager.loadGameState();
        return gameState.armansuUnlocked === true;
    }
    
    /**
     * Get achievement progress summary
     */
    getProgressSummary() {
        const mentorCount = Object.keys(this.mentorAchievements).length;
        const unlockedCount = Object.values(this.mentorAchievements).filter(a => a.unlocked).length;
        const totalCoins = this.getTotalAchievementCoins();
        
        return {
            mentorProgress: `${unlockedCount}/${mentorCount}`,
            unlockedCount,
            totalMentors: mentorCount,
            totalCoins,
            masterUnlocked: this.masterAchievement.unlocked,
            armansuUnlocked: this.isArmansuUnlocked()
        };
    }
    
    /**
     * Reset all achievements (for testing)
     */
    resetAchievements() {
        Object.values(this.mentorAchievements).forEach(achievement => {
            achievement.unlocked = false;
        });
        this.masterAchievement.unlocked = false;
        
        this.gameStateManager.updateGameState({
            armansuUnlocked: false
        });
        
        this.saveAchievements();
        console.log('🔄 All achievements reset');
    }
}