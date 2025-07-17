# Koremz RPG Game

A web-based RPG adventure game built with Phaser.js featuring the character Dimash exploring a fantasy world.

## 🎮 Features

- **Character Movement**: Smooth WASD controls for character movement
- **Sprite Animation**: Directional character sprites with walking animations
- **Map Exploration**: Large background map to explore
- **Responsive Design**: Scales to fit different screen sizes
- **Modern Architecture**: Built following SOLID principles

## 🚀 Getting Started

### Prerequisites
- Node.js (for development server)
- Modern web browser

### Installation

1. Navigate to the game directory:
```bash
cd game_scripts
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## 🎯 Controls

- **W** - Move Up
- **A** - Move Left  
- **S** - Move Down
- **D** - Move Right

## 📁 Project Structure

```
game_scripts/
├── src/
│   ├── config/
│   │   └── GameConfig.js      # Game configuration and constants
│   ├── managers/
│   │   ├── AssetManager.js    # Asset loading and management
│   │   └── InputManager.js    # Input handling and controls
│   ├── entities/
│   │   └── Player.js          # Player character logic
│   ├── scenes/
│   │   └── GameScene.js       # Main game scene
│   └── Game.js                # Game entry point
├── index.html                 # Main HTML file
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🏗️ Architecture

The game follows SOLID principles:

- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Easy to extend with new features
- **Liskov Substitution**: Components can be easily replaced
- **Interface Segregation**: Clean, focused interfaces
- **Dependency Inversion**: High-level modules don't depend on low-level details

## 🎨 Assets

- **Map**: `../game_assets/map/map1.png` - Game world background
- **Character Sprites**: 
  - `dimash_stay.png` - Idle animation
  - `dimash_up.png` - Walking up
  - `dimash_down.png` - Walking down
  - `dimash_left.png` - Walking left
  - `dimash_right.png` - Walking right

## 🔧 Development

### Adding New Features

1. **New Entities**: Add to `src/entities/`
2. **New Scenes**: Add to `src/scenes/`
3. **New Managers**: Add to `src/managers/`
4. **Configuration**: Update `src/config/GameConfig.js`

### Debugging

Set `debug: true` in the physics configuration in `Game.js` to see collision boxes and physics bodies.

## 📝 License

MIT License - Feel free to use this project for learning and development.

## 🎯 Future Enhancements

- NPCs and dialogue system
- Inventory and items
- Combat system
- Multiple maps and scenes
- Sound effects and music
- Save/load functionality