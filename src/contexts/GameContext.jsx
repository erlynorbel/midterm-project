import React, { createContext, useState, useEffect, useCallback } from 'react';
import storyData from './story.json'; // Import your story data

const GameContext = createContext();

const initialGameState = {
    playerName: '',
    hp: 100,
    inventory: [], // e.g., ['Asin', 'Bawang', 'Agimat']
    currentSceneId: 'start',
    isGameOver: false,
    isVictory: false,
};

const LOCAL_STORAGE_KEY = 'aswangHunterGameState';

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState(() => {
        const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedState) {
            return JSON.parse(savedState);
        }
        return initialGameState;
    });

    // Effect to save game state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
    }, [gameState]);

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
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear saved game
    }, []);

    const makeChoice = useCallback((choice) => {
        setGameState(prevState => {
            let newState = { ...prevState };
            const currentScene = storyData[prevState.currentSceneId];

            // Apply effects from the scene (onArrive)
            if (currentScene.onArrive) {
                if (currentScene.onArrive.addItem) {
                    newState.inventory = [...newState.inventory, currentScene.onArrive.addItem];
                }
                if (currentScene.onArrive.takeDamage) {
                    newState.hp = Math.max(0, newState.hp - currentScene.onArrive.takeDamage);
                }
            }

            // Apply effects from the chosen choice itself if any
            // (Our current story.json doesn't have choice-specific onArrive, but it's good to be prepared)
            if (choice.onArrive) {
                if (choice.onArrive.addItem) {
                    newState.inventory = [...newState.inventory, choice.onArrive.addItem];
                }
                if (choice.onArrive.takeDamage) {
                    newState.hp = Math.max(0, newState.hp - choice.onArrive.takeDamage);
                }
            }
            
            // Transition to the new scene
            newState.currentSceneId = choice.to;

            // Check for victory/game over conditions based on the new scene
            const nextScene = storyData[newState.currentSceneId];
            if (nextScene.isEnding) {
                newState.isGameOver = (nextScene.currentSceneId === 'gameOver_hp' || nextScene.currentSceneId === 'badEnding_noSalt');
                newState.isVictory = (nextScene.currentSceneId === 'goodEnding');
            }

            return newState;
        });
    }, []);

    return (
        <GameContext.Provider value={{ gameState, startGame, resetGame, makeChoice, storyData }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContext;