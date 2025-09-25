import React, { useContext, useState, useCallback, useEffect } from 'react';
import GameContext, { GameProvider } from './contexts/GameContext';
import LandingScreen from './components/LandingScreen';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import './App.css';

function AppContent() {
  const { gameState, resetGame, storyData } = useContext(GameContext);
  const endingScene = storyData[gameState.currentSceneId];
  const [uiStage, setUiStage] = useState('landing'); // landing | name | game | end

  // Move to name entry once player decides to continue from landing
  const goName = useCallback(() => setUiStage('name'), []);

  // Transition to game when playerName is set
  useEffect(() => {
    if (gameState.playerName && !gameState.isGameOver && !gameState.isVictory) {
      setUiStage('game');
    }
  }, [gameState.playerName, gameState.isGameOver, gameState.isVictory]);

  // Handle ending
  useEffect(() => {
    if (gameState.isGameOver || gameState.isVictory) {
      setUiStage('end');
    }
  }, [gameState.isGameOver, gameState.isVictory]);

  const handleReplay = () => {
    resetGame();
    setUiStage('landing');
  };

  if (uiStage === 'landing') return <LandingScreen onContinue={goName} />;
  if (uiStage === 'name') return <StartScreen />;
  if (uiStage === 'game') return <GameScreen />;
  if (uiStage === 'end') {
    const isVictory = gameState.isVictory;
    return (
      <div className={`${isVictory ? 'victory-screen' : 'game-over-screen'} game-end-shared fade-in`}>
        <h1>{isVictory ? 'VICTORY' : 'GAME OVER'}</h1>
        {endingScene && <p>{endingScene.text}</p>}
        <div className="end-actions">
          <button onClick={handleReplay}>Play Again</button>
        </div>
      </div>
    );
  }
  return null;
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