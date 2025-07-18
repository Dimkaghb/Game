/**
 * Game Configuration
 * Central configuration for the RPG game following SOLID principles
 */
class GameConfig {
    static get GAME() {
        return {
            WIDTH: 1024,
            HEIGHT: 768,
            BACKGROUND_COLOR: '#2c3e50',
            PHYSICS: Phaser.Physics.ARCADE,
            PARENT: 'game-container'
        };
    }
    
    static get PLAYER() {
        return {
            SPEED: 120,
            START_X: 512,
            START_Y: 384,
            SPRITE_SIZE: 32,
            SCALE: 1.2
        };
    }
    
    static get ASSETS() {
        return {
            MAP: {
                BACKGROUND: {
                    KEY: 'map1',
                    PATH: 'assets/map/map1.png'
                },
                BAHREDDINS_HOME: {
                    KEY: 'bahreddins_home',
                    PATH: 'assets/map/bahreddins_home.png'
                }
            },
            PLAYER: {
                STAY: {
                    KEY: 'dimash_stay',
                    PATH: 'assets/dimash_character_assets/dimash_stay.png'
                },
                UP: {
                    KEY: 'dimash_up',
                    PATH: 'assets/dimash_character_assets/dimash_up.png'
                },
                DOWN: {
                    KEY: 'dimash_down',
                    PATH: 'assets/dimash_character_assets/dimash_down.png'
                },
                LEFT: {
                    KEY: 'dimash_left',
                    PATH: 'assets/dimash_character_assets/dimash_left.png'
                },
                RIGHT: {
                    KEY: 'dimash_right',
                    PATH: 'assets/dimash_character_assets/dimash_right.png'
                },
                HITTING_FROM_RIGHT: {
                    KEY: 'dimash_hitting_fromright',
                    PATH: 'assets/dimash_character_assets/dimash_hitting_fromright.png'
                },
                HITTING_FROM_LEFT: {
                    KEY: 'dimash_hitting_fromleft',
                    PATH: 'assets/dimash_character_assets/dimash_hitting_fromleft.png'
                }
            },
            VILLAIN: {
                ARMANSU: {
                    KEY: 'armansu1',
                    PATH: 'assets/armansu_assets/armansu1.png'
                }
            },
            COMPANION: {
                BAHREDDIN: {
                    KEY: 'bahreddin',
                    PATH: 'assets/bahreddin_assets/bahreddin.png'
                },
                BAHREDDIN_LEFT: {
                    KEY: 'bahreddin_left',
                    PATH: 'assets/bahreddin_assets/bahreddin_left.png'
                },
                BAHREDDIN_RIGHT: {
                    KEY: 'bahreddin_right',
                    PATH: 'assets/bahreddin_assets/bahreddin_right.png'
                }
            },
            TELEPORT: {
                CAVE: {
                    KEY: 'cave_teleport',
                    PATH: 'assets/map/cave_teleport.png'
                },
                DIRECTION_MAP: {
                    KEY: 'direction_map',
                    PATH: 'assets/map/direction_map.png'
                }
            },
            BERNAR: {
                MAP: {
                    KEY: 'bernar_map',
                    PATH: 'assets/map/bernar_map.png'
                },
                SNAKE_HEAD: {
                    KEY: 'snake_head_bernar',
                    PATH: 'assets/bernar_assets/snake_head_bernar.png'
                },
                SNAKE_BODY: {
                    KEY: 'snake_body',
                    PATH: 'assets/bernar_assets/snake_body.png'
                },
                BERNAR1: {
                    KEY: 'bernar1',
                    PATH: 'assets/bernar_assets/bernar1.png'
                },
                BERNAR_LAUGH: {
                    KEY: 'bernar_laugh',
                    PATH: 'assets/bernar_assets/bernar_laugh.png'
                },
                BERNAR_LAUGH2: {
                    KEY: 'bernar_laugh2',
                    PATH: 'assets/bernar_assets/bernar_laugh2.png'
                },
                DOCKER: {
                    KEY: 'docker',
                    PATH: 'assets/gaming_items/docker.png'
                },
                BURGER: {
                    KEY: 'burger',
                    PATH: 'assets/gaming_items/burger.png'
                }
            }
        };
    }
    
    static get CONTROLS() {
        return {
            UP: 'W',
            DOWN: 'S', 
            LEFT: 'A',
            RIGHT: 'D'
        };
    }
    
    static get ANIMATIONS() {
        return {
            FRAME_RATE: 8,
            REPEAT: -1
        };
    }
    
    static get VILLAIN() {
        return {
            INTRO_DELAY: 2000, // Reduced from 3 to 2 seconds
            ENTRANCE_DURATION: 1500, // Reduced from 2 to 1.5 seconds for entrance animation
            DIALOGUE_DURATION: 2500, // Reduced from 4 to 2.5 seconds for each dialogue
            SCALE: 1.8,
            QUOTES: [
                "Dimash... So you dare to enter my realm?",
                "Your journey ends here, foolish hero!",
                "I am Armansu, and this world belongs to ME!",
                "Prepare yourself for eternal darkness!"
            ]
        };
    }
    
    static get COMPANION() {
        return {
            SCALE: 1.3,
            ENTRANCE_DURATION: 1200, // Reduced from 1500 to 1200
            DIALOGUE_DURATION: 3000, // Reduced from 5 to 3 seconds for each dialogue
            EXIT_DURATION: 1500, // Reduced from 2000 to 1500
            DIALOGUE: [
                "Dimash! I called you here because Armansu has stolen my Epitet app right before demo day!",
                "Please help me get it back! This is our only chance to save the project!",
                "Go with me, brave hero! Together we can defeat this evil!"
            ],
            FINAL_QUOTE: "Go with me!"
        };
    }
    
    static get TELEPORT() {
        return {
            CAVE: {
                SCALE: 0.8,
                POSITION_X: 900, // Right side of the map
                POSITION_Y: 400, // Center vertically
                COLLISION_RADIUS: 80
            },
            DIRECTION_MAP: {
                SCALE: 1.0,
                FADE_DURATION: 1000,
                DISPLAY_DURATION: 15000, // Increased to 15 seconds for interaction
                LEAVE_BUTTON: {
                    TEXT: '✕ Leave',
                    POSITION_X: 50,
                    POSITION_Y: 50,
                    STYLE: {
                        fontSize: '20px',
                        fontFamily: 'Arial',
                        fill: '#ffffff',
                        backgroundColor: '#ff4444',
                        padding: { x: 15, y: 8 },
                        borderRadius: 5
                    }
                },
                REALITIES: {
                    DIANA: {
                        NAME: 'Diana',
                        POSITION_X: 200,
                        POSITION_Y: 150,
                        DESCRIPTION: 'Diana\'s Reality: A world of artistic expression and creative innovation.'
                    },
                    ASSELYA: {
                        NAME: 'Asselya',
                        POSITION_X: 400,
                        POSITION_Y: 200,
                        DESCRIPTION: 'Asselya\'s Reality: A realm of scientific discovery and technological advancement.'
                    },
                    BERNAR: {
                        NAME: 'Bernar',
                        POSITION_X: 600,
                        POSITION_Y: 180,
                        DESCRIPTION: 'Bernar\'s Reality: A dimension of strategic thinking and business excellence.'
                    },
                    ABAY: {
                        NAME: 'Abay',
                        POSITION_X: 300,
                        POSITION_Y: 350,
                        DESCRIPTION: 'Abay\'s Reality: A world of wisdom, poetry, and cultural heritage.'
                    },
                    BAHREDDIN_HOME: {
                        NAME: 'Bahreddin Home',
                        POSITION_X: 500,
                        POSITION_Y: 400,
                        DESCRIPTION: 'Bahreddin\'s Home: The peaceful sanctuary where adventures begin and end.'
                    }
                },
                REALITY_BUTTON_STYLE: {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    fill: '#ffffff',
                    backgroundColor: '#4ecdc4',
                    padding: { x: 10, y: 6 },
                    borderRadius: 3
                },
                REALITY_DESCRIPTION_STYLE: {
                    fontSize: '18px',
                    fontFamily: 'Arial',
                    fill: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { x: 20, y: 15 },
                    borderRadius: 8,
                    alpha: 0.9
                }
            }
        };
    }
    
    static get SCENE() {
        return {
            INTRO_OVERLAY_COLOR: 0x000000,
            INTRO_OVERLAY_ALPHA: 0.7,
            TEXT_STYLE: {
                fontSize: '24px',
                fontFamily: 'Arial',
                fill: '#ff6b6b',
                stroke: '#000000',
                strokeThickness: 2,
                align: 'center',
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000000',
                    blur: 4,
                    stroke: true,
                    fill: true
                }
            },
            COMPANION_TEXT_STYLE: {
                fontSize: '22px',
                fontFamily: 'Arial',
                fill: '#4ecdc4',
                stroke: '#000000',
                strokeThickness: 2,
                align: 'center',
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000000',
                    blur: 4,
                    stroke: true,
                    fill: true
                }
            }
        };
    }
    
    static get CHOICE_SYSTEM() {
        return {
            QUESTION_TEXT: 'What to do next?',
            CHOICES: {
                ASK_BAHREDDIN: {
                    TEXT: '1) What I need to do now?',
                    RESPONSE: 'You should explore the different realities and help people there. Use the door or Back button to access the direction map.'
                },
                HIT_BAHREDDIN: {
                    TEXT: '2) Hit Bahreddin',
                    RESPONSE: 'TY cho sovsem prifigel'
                }
            },
            // New mentor tutorial choices
            MENTOR_CHOICES: {
                BERNAR_MCDONALDS: {
                    TEXT: '1) Will Bernar buy me McDonalds?',
                    RESPONSE: 'Of course! Bernar is legendary for serving McDonalds to his soldiers. He will definitely help you!'
                },
                WHAT_TO_DO: {
                    TEXT: '2) What\'s next?',
                    RESPONSE: 'You need to defeat all the mentors to get to Arman\'s temple and beat Armansu. The path is dangerous, but you must succeed!'
                }
            },
            QUESTION_STYLE: {
                fontSize: '22px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2,
                align: 'center'
            },
            CHOICE_BUTTON_STYLE: {
                fontSize: '18px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                backgroundColor: '#4ecdc4',
                padding: { x: 15, y: 10 },
                borderRadius: 5
            },
            HITTING_ANIMATION: {
                DURATION: 800,
                SHAKE_INTENSITY: 10,
                FLASH_COLOR: 0xff0000,
                FLASH_DURATION: 200
            }
        };
    }
    
    static get MENTORS() {
        return {
            DIANA: {
                NAME: 'Diana',
                DESCRIPTION: 'Pretty girl at first look but can make violence with the attendance',
                POWER: 'Attendance Violence',
                PERSONALITY: 'Deceptively beautiful but dangerous'
            },
            ASSELYA: {
                NAME: 'Asselya',
                DESCRIPTION: 'Pretty woman, kind at first view but can kick any time from nFactorial Incubator',
                POWER: 'Unexpected strikes',
                PERSONALITY: 'Deceptively kind but ready to strike'
            },
            ABAY: {
                NAME: 'Abay',
                DESCRIPTION: 'Tall and quiet, Bahreddin was his best friend a long ago before Abay betrayed him',
                POWER: 'Very fast moving opponent cause it writes in Golang',
                PERSONALITY: 'Former friend turned betrayer, swift as code'
            },
            BERNAR: {
                NAME: 'Bernar',
                DESCRIPTION: 'Legend warrior who once served 100 McDonalds for his soldiers in nFactorial Incubator',
                POWER: 'His main power is his aura and Docker',
                PERSONALITY: 'Legendary warrior with container mastery'
            },
            TUTORIAL_TEXT: [
                'Listen carefully, Dimash. Armansu is secured by four powerful mentors...',
                'Diana: Pretty girl at first look, but she can make violence with the attendance. Don\'t be fooled by her appearance!',
                'Asselya: Pretty woman, kind at first view but can kick any time from nFactorial Incubator.',
                'Abay: Tall and quiet. He was my best friend long ago, before he betrayed me. He\'s very fast moving opponent because he writes in Golang.',
                'Bernar: A legend warrior who once served 100 McDonalds for his soldiers in nFactorial Incubator. His main power is his aura and Docker.',
                'These mentors guard the path to Arman\'s temple. You must be prepared for what lies ahead.'
            ]
        };
    }

    static get BERNAR_SNAKE_GAME() {
        return {
            GRID_SIZE: 48, // Increased from 32 to make snake bigger
            INITIAL_SPEED: 350, // milliseconds between moves (slower)
            SPEED_INCREASE: 10, // speed increase per apple
            APPLES_TO_WIN: 15,
            BERNAR_CELEBRATION_AT: 10, // Show Bernar celebration at 10 apples
            SNAKE_INITIAL_LENGTH: 3,
            GAME_AREA: {
                X: 120,
                Y: 120,
                WIDTH: 784, // Adjusted for bigger grid
                HEIGHT: 528 // Adjusted for bigger grid
            },
            BACKGROUND: {
                OVERLAY_ALPHA: 0.85, // Less transparent, more brick-like
                OVERLAY_COLOR: 0x8B4513, // Brown brick color
                BORDER_COLOR: 0x654321, // Darker brown for border
                BORDER_WIDTH: 6,
                // Grid lines for easier navigation
                GRID_LINES: {
                    ENABLED: true,
                    COLOR: 0x654321,
                    ALPHA: 0.3,
                    WIDTH: 1
                }
            },
            CELEBRATION: {
                LAUGH_DURATION: 3000, // 3 seconds
                FOUNTAIN_DURATION: 2000, // 2 seconds
                BURGER_COUNT: 20,
                FOUNTAIN_SPEED: 300,
                BERNAR_MESSAGE: "Thank you Dimash, get your mack Doncald!"
            },
            UI: {
                SCORE_STYLE: {
                    fontSize: '24px',
                    fontFamily: 'Arial',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 2
                },
                WIN_MESSAGE_STYLE: {
                    fontSize: '32px',
                    fontFamily: 'Arial',
                    fill: '#ffff00',
                    stroke: '#000000',
                    strokeThickness: 3,
                    align: 'center'
                },
                BERNAR_MESSAGE_STYLE: {
                    fontSize: '28px',
                    fontFamily: 'Arial',
                    fill: '#ff6b6b',
                    stroke: '#000000',
                    strokeThickness: 2,
                    align: 'center'
                }
            }
        };
    }
}