import React, { useState, useContext, useEffect } from 'react';
import GameContext from '../contexts/GameContext';
import { getSaveInfo, getAllSaves, deleteSavedGame } from '../utils/localStorage';

function SaveLoadMenu({ onClose }) {
    const { gameState, loadSavedGame, saveCurrentGame, hasActiveSave } = useContext(GameContext);
    const [activeTab, setActiveTab] = useState('save');
    const [saves, setSaves] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        refreshSaves();
    }, []);

    const refreshSaves = () => {
        setSaves(getAllSaves());
    };

    const handleSave = (slot) => {
        if (!gameState.playerName) {
            setMessage('Cannot save: No active game');
            return;
        }

        const success = saveCurrentGame(slot);
        if (success) {
            setMessage(`Game saved successfully to ${slot === 'auto' ? 'Auto-Save' : `Slot ${slot}`}`);
            refreshSaves();
        } else {
            setMessage('Failed to save game');
        }
        
        setTimeout(() => setMessage(''), 3000);
    };

    const handleLoad = (slot) => {
        const success = loadSavedGame(slot);
        if (success) {
            setMessage('Game loaded successfully');
            setTimeout(() => {
                setMessage('');
                onClose();
            }, 1000);
        } else {
            setMessage('Failed to load game');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDelete = (slot) => {
        if (window.confirm(`Are you sure you want to delete this save file?`)) {
            const success = deleteSavedGame(slot);
            if (success) {
                setMessage('Save deleted successfully');
                refreshSaves();
            } else {
                setMessage('Failed to delete save');
            }
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const getSceneDisplayName = (sceneId) => {
        // Convert scene IDs to more readable names
        const sceneNames = {
            'start': 'Beginning',
            'askAlbularyo': 'Healer\'s Hut',
            'askCaptain': 'Town Hall',
            'oldChurch_entry': 'Old Church',
            'bellTower': 'Bell Tower',
            'altar': 'Church Altar',
            'gameOver_hp': 'Game Over',
            'goodEnding': 'Victory!'
        };
        return sceneNames[sceneId] || sceneId;
    };

    return (
        <div className="save-load-overlay">
            <div className="save-load-menu">
                <div className="save-load-header">
                    <h2>Save & Load Game</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="save-load-tabs">
                    <button 
                        className={activeTab === 'save' ? 'active' : ''}
                        onClick={() => setActiveTab('save')}
                    >
                        Save Game
                    </button>
                    <button 
                        className={activeTab === 'load' ? 'active' : ''}
                        onClick={() => setActiveTab('load')}
                    >
                        Load Game
                    </button>
                </div>

                {message && (
                    <div className="save-load-message">
                        {message}
                    </div>
                )}

                <div className="save-load-content">
                    {activeTab === 'save' && (
                        <div className="save-section">
                            <h3>Save Current Game</h3>
                            {!gameState.playerName ? (
                                <p>No active game to save</p>
                            ) : (
                                <div>
                                    <p><strong>Current Game:</strong> {gameState.playerName}</p>
                                    <p><strong>Location:</strong> {getSceneDisplayName(gameState.currentSceneId)}</p>
                                    <p><strong>HP:</strong> {gameState.hp} | <strong>Items:</strong> {gameState.inventory.length}</p>
                                    
                                    <div className="save-slots">
                                        <button onClick={() => handleSave(1)}>Save to Slot 1</button>
                                        <button onClick={() => handleSave(2)}>Save to Slot 2</button>
                                        <button onClick={() => handleSave(3)}>Save to Slot 3</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'load' && (
                        <div className="load-section">
                            <h3>Load Saved Game</h3>
                            {saves.length === 0 ? (
                                <p>No saved games found</p>
                            ) : (
                                <div className="saved-games">
                                    {saves.map((save, index) => (
                                        <div key={index} className="save-slot">
                                            <div className="save-info">
                                                <h4>{save.slot === 'auto' ? 'Auto-Save' : `Slot ${save.slot}`}</h4>
                                                <p><strong>Player:</strong> {save.playerName}</p>
                                                <p><strong>Location:</strong> {getSceneDisplayName(save.currentSceneId)}</p>
                                                <p><strong>HP:</strong> {save.hp} | <strong>Items:</strong> {save.inventoryCount}</p>
                                                <p><strong>Saved:</strong> {formatTimestamp(save.timestamp)}</p>
                                            </div>
                                            <div className="save-actions">
                                                <button 
                                                    className="load-button"
                                                    onClick={() => handleLoad(save.slot)}
                                                >
                                                    Load
                                                </button>
                                                {save.slot !== 'auto' && (
                                                    <button 
                                                        className="delete-button"
                                                        onClick={() => handleDelete(save.slot)}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SaveLoadMenu;