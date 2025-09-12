import React, { useContext } from 'react';
import GameContext from '../contexts/GameContext';

function GameScreen() {
    const { gameState, makeChoice, storyData } = useContext(GameContext);
    const currentScene = storyData[gameState.currentSceneId];

    if (!currentScene) {
        return <div>Error: Scene not found!</div>;
    }

    const isChoiceDisabled = (choice) => {
        // Check for 'requires'
        if (choice.requires && !gameState.inventory.includes(choice.requires)) {
            return true;
        }
        // Check for 'hideIf' (meaning, if the item IS in inventory, hide this choice)
        if (choice.hideIf && gameState.inventory.includes(choice.hideIf)) {
            return true;
        }
        return false;
    };

    return (
        <div className="game-screen">
            <div className="player-stats">
                <p><strong>Hunter:</strong> {gameState.playerName}</p>
                <p><strong>HP:</strong> {gameState.hp}</p>
                <p><strong>Inventory:</strong> {gameState.inventory.length > 0 ? gameState.inventory.join(', ') : 'Empty'}</p>
            </div>

            <div className="story-content">
                <p>{currentScene.text}</p>
            </div>

            <div className="choices">
                {currentScene.choices && currentScene.choices.map((choice, index) => (
                    <button
                        key={index}
                        onClick={() => makeChoice(choice)}
                        disabled={isChoiceDisabled(choice)}
                        style={{ display: isChoiceDisabled(choice) ? 'none' : 'block' }} // Hide disabled choices
                    >
                        {choice.text}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default GameScreen;