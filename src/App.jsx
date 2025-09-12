import React, { useContext } from 'react';
import GameContext, { GameProvider } from './contexts/GameContext';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import './App.css'; // We'll create this soon

function AppContent() {
    const { gameState, resetGame } = useContext(GameContext);

    if (!gameState.playerName) {
        return <StartScreen />;
    }

    if (gameState.isGameOver || gameState.isVictory) {
        const message = gameState.isVictory ? "Congratulations! You saved San Gubat!" : "Game Over!";
        return (
            <div className="game-end-screen">
                <h1>{message}</h1>
                {gameState.currentSceneId && <p>{gameState.storyData[gameState.currentSceneId].text}</p>}
                <button onClick={resetGame}>Play Again</button>
            </div>
        );
    }

    return <GameScreen />;
}

function App() {
    return (
        <GameProvider>
            <div className="App">
                <AppContent />
            </div>
        </GameProvider>
    );
}

export default App;