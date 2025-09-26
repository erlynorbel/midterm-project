import React, { useContext, useState, useCallback, useEffect } from 'react';
import GameContext, { GameProvider } from './contexts/GameContext';
import LandingScreen from './components/LandingScreen';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import SaveLoadMenu from './components/SaveLoadMenu';
import './App.css';

function AppContent() {
  const { gameState, resetGame, storyData, isLoading, hasActiveSave } = useContext(GameContext);
  const endingScene = storyData[gameState.currentSceneId];
  const [uiStage, setUiStage] = useState('landing'); // landing | name | game | end
  const [showSaveLoadMenu, setShowSaveLoadMenu] = useState(false);

  // Handle loading state
  useEffect(() => {
    if (!isLoading && gameState.playerName) {
      // Player has a saved game, go directly to game screen
      setUiStage('game');
    } else if (!isLoading && hasActiveSave()) {
      // Has saved game but no current player name, show landing with continue option
      setUiStage('landing');
    }
  }, [isLoading, gameState.playerName, hasActiveSave]);

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

  const toggleSaveLoadMenu = () => {
    setShowSaveLoadMenu(!showSaveLoadMenu);
  };

  const handleKeyPress = useCallback((e) => {
    // Press 'S' to open save/load menu (when in game)
    if (e.key.toLowerCase() === 's' && uiStage === 'game' && !showSaveLoadMenu) {
      e.preventDefault();
      setShowSaveLoadMenu(true);
    }
    // Press 'Escape' to close save/load menu
    if (e.key === 'Escape' && showSaveLoadMenu) {
      e.preventDefault();
      setShowSaveLoadMenu(false);
    }
  }, [uiStage, showSaveLoadMenu]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="loading-screen">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (uiStage === 'landing') return <LandingScreen onContinue={goName} />;
  if (uiStage === 'name') return <StartScreen />;
  if (uiStage === 'game') {
    return (
      <div>
        <GameScreen />
        {gameState.playerName && (
          <div className="game-controls">
            <button 
              className="save-load-button"
              onClick={toggleSaveLoadMenu}
              title="Save/Load Game (Press S)"
            >
              💾 Save/Load
            </button>
          </div>
        )}
        {showSaveLoadMenu && (
          <SaveLoadMenu onClose={() => setShowSaveLoadMenu(false)} />
        )}
      </div>
    );
  }
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