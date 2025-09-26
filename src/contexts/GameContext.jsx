import React, { createContext, useState, useEffect, useCallback } from 'react';
import storyData from './story.json'; // Import your story data
import { saveGameState, loadGameState, hasSavedGame } from '../utils/localStorage';

const GameContext = createContext();

const initialGameState = {
    playerName: '',
    hp: 100,
    inventory: [],
    currentSceneId: 'start',
    isGameOver: false,
    isVictory: false,
};

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState(initialGameState);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved game state on initialization
    useEffect(() => {
        const loadSavedGame = () => {
            try {
                const savedState = loadGameState();
                if (savedState) {
                    // Validate that the saved state has required properties
                    const validatedState = {
                        ...initialGameState,
                        ...savedState,
                        // Ensure inventory is an array
                        inventory: Array.isArray(savedState.inventory) ? savedState.inventory : [],
                        // Ensure HP is within valid range
                        hp: Math.max(0, Math.min(100, savedState.hp || 100))
                    };
                    setGameState(validatedState);
                } else {
                    setGameState(initialGameState);
                }
            } catch (error) {
                console.error('Error loading saved game:', error);
                setGameState(initialGameState);
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedGame();
    }, []);

    // Auto-save game state whenever it changes (except for initial load)
    useEffect(() => {
        if (!isLoading && gameState.playerName) {
            // Only save if the player has started a game (has a name)
            saveGameState(gameState);
        }
    }, [gameState, isLoading]);

    // Effect to check for HP game over condition
    useEffect(() => {
        if (gameState.hp <= 0 && !gameState.isGameOver && !gameState.isVictory) {
            setGameState(prevState => ({
                ...prevState,
                currentSceneId: 'gameOver_hp',
                isGameOver: true,
            }));
        }
    }, [gameState.hp, gameState.isGameOver, gameState.isVictory]);

    const startGame = useCallback((playerName) => {
        setGameState({
            ...initialGameState,
            playerName: playerName,
        });
    }, []);

    const resetGame = useCallback(() => {
        setGameState(initialGameState);
    }, []);

    const makeChoice = useCallback((choice) => {
        setGameState(prevState => {
            let newState = { ...prevState };
            const currentScene = storyData[prevState.currentSceneId];

            if (currentScene.onArrive) {
                if (currentScene.onArrive.addItem) {
                    newState.inventory = [...newState.inventory, currentScene.onArrive.addItem];
                }
                if (currentScene.onArrive.takeDamage) {
                    newState.hp = Math.max(0, newState.hp - currentScene.onArrive.takeDamage);
                }
            }

            if (choice.onArrive) {
                if (choice.onArrive.addItem) {
                    newState.inventory = [...newState.inventory, choice.onArrive.addItem];
                }
                if (choice.onArrive.takeDamage) {
                    newState.hp = Math.max(0, newState.hp - choice.onArrive.takeDamage);
                }
            }

            newState.currentSceneId = choice.to;

            const nextScene = storyData[newState.currentSceneId];
            if (nextScene?.isEnding) {
                newState.isVictory = (newState.currentSceneId === 'goodEnding');
                newState.isGameOver = !newState.isVictory;
            }

            return newState;
        });
    }, []);

    const loadSavedGame = useCallback((slot = 'auto') => {
        try {
            const savedState = loadGameState(slot);
            if (savedState) {
                const validatedState = {
                    ...initialGameState,
                    ...savedState,
                    inventory: Array.isArray(savedState.inventory) ? savedState.inventory : [],
                    hp: Math.max(0, Math.min(100, savedState.hp || 100))
                };
                setGameState(validatedState);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading saved game:', error);
            return false;
        }
    }, []);

    const saveCurrentGame = useCallback((slot = 'auto') => {
        if (!gameState.playerName) {
            console.warn('Cannot save game: no player name set');
            return false;
        }
        return saveGameState(gameState, slot);
    }, [gameState]);

    const hasActiveSave = useCallback((slot = 'auto') => {
        return hasSavedGame(slot);
    }, []);

    return (
        <GameContext.Provider value={{ 
            gameState, 
            isLoading,
            startGame, 
            resetGame, 
            makeChoice, 
            storyData,
            loadSavedGame,
            saveCurrentGame,
            hasActiveSave
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContext;