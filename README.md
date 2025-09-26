# Aswang Hunter - Folk Horror Text Experience

A text-based adventure game with localStorage save functionality, built with React and Vite.

## Features

### Save/Load System
- **Auto-Save**: Game automatically saves your progress as you play
- **Manual Save Slots**: Save to 3 different manual save slots
- **Continue Game**: Resume from where you left off when you return to the game
- **Save Management**: View, load, and delete save files with detailed information

### How to Save/Load
1. **Auto-Save**: Your progress is automatically saved whenever you make a choice
2. **Manual Save**: Click the "💾 Save/Load" button in the top-right corner during gameplay, or press the 'S' key
3. **Load Game**: Use the Save/Load menu to load any saved game
4. **Continue**: If you have a saved game, the landing screen will show a "Continue" button

### Technical Implementation
- Uses browser's localStorage for persistent save data
- Save data includes: player name, HP, inventory, current scene, game state
- Save files are timestamped and include validation
- Supports both auto-save and manual save slots (1-3)

## Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
