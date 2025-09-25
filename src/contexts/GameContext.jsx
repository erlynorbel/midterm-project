import React, { createContext, useState, useEffect, useCallback } from 'react';
import storyData from './story.json'; // Import your story data

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

    return (
        <GameContext.Provider value={{ gameState, startGame, resetGame, makeChoice, storyData }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContext;