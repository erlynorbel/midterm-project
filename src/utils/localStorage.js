// localStorage utility functions for game save/load functionality

const SAVE_KEY = 'midterm-game-save';
const SAVE_SLOT_PREFIX = 'midterm-game-save-slot-';

/**
 * Save game state to localStorage
 * @param {Object} gameState - The current game state to save
 * @param {number} slot - Optional save slot number (1-3), defaults to auto-save slot
 */
export const saveGameState = (gameState, slot = 'auto') => {
  try {
    const saveKey = slot === 'auto' ? SAVE_KEY : `${SAVE_SLOT_PREFIX}${slot}`;
    const saveData = {
      gameState,
      timestamp: new Date().toISOString(),
      version: '1.0' // For future compatibility
    };
    
    localStorage.setItem(saveKey, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Failed to save game state:', error);
    return false;
  }
};

/**
 * Load game state from localStorage
 * @param {number} slot - Optional save slot number (1-3), defaults to auto-save slot
 * @returns {Object|null} - The saved game state or null if not found
 */
export const loadGameState = (slot = 'auto') => {
  try {
    const saveKey = slot === 'auto' ? SAVE_KEY : `${SAVE_SLOT_PREFIX}${slot}`;
    const savedData = localStorage.getItem(saveKey);
    
    if (!savedData) {
      return null;
    }
    
    const parseData = JSON.parse(savedData);
    
    // Validate the save data structure
    if (!parseData.gameState || !parseData.timestamp) {
      console.warn('Invalid save data structure');
      return null;
    }
    
    return parseData.gameState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

/**
 * Check if a save exists
 * @param {number} slot - Optional save slot number (1-3), defaults to auto-save slot
 * @returns {boolean} - Whether a save exists in the specified slot
 */
export const hasSavedGame = (slot = 'auto') => {
  try {
    const saveKey = slot === 'auto' ? SAVE_KEY : `${SAVE_SLOT_PREFIX}${slot}`;
    return localStorage.getItem(saveKey) !== null;
  } catch (error) {
    console.error('Failed to check for saved game:', error);
    return false;
  }
};

/**
 * Get save info without loading the full game state
 * @param {number} slot - Optional save slot number (1-3), defaults to auto-save slot
 * @returns {Object|null} - Save info (timestamp, player name, current scene) or null
 */
export const getSaveInfo = (slot = 'auto') => {
  try {
    const saveKey = slot === 'auto' ? SAVE_KEY : `${SAVE_SLOT_PREFIX}${slot}`;
    const savedData = localStorage.getItem(saveKey);
    
    if (!savedData) {
      return null;
    }
    
    const parseData = JSON.parse(savedData);
    
    return {
      timestamp: parseData.timestamp,
      playerName: parseData.gameState?.playerName || 'Unknown',
      currentSceneId: parseData.gameState?.currentSceneId || 'unknown',
      hp: parseData.gameState?.hp || 0,
      inventoryCount: parseData.gameState?.inventory?.length || 0
    };
  } catch (error) {
    console.error('Failed to get save info:', error);
    return null;
  }
};

/**
 * Delete a saved game
 * @param {number} slot - Optional save slot number (1-3), defaults to auto-save slot
 * @returns {boolean} - Whether the deletion was successful
 */
export const deleteSavedGame = (slot = 'auto') => {
  try {
    const saveKey = slot === 'auto' ? SAVE_KEY : `${SAVE_SLOT_PREFIX}${slot}`;
    localStorage.removeItem(saveKey);
    return true;
  } catch (error) {
    console.error('Failed to delete saved game:', error);
    return false;
  }
};

/**
 * Get all available save slots with their info
 * @returns {Array} - Array of save slot info objects
 */
export const getAllSaves = () => {
  const saves = [];
  
  // Check auto-save
  const autoSave = getSaveInfo('auto');
  if (autoSave) {
    saves.push({ slot: 'auto', ...autoSave });
  }
  
  // Check manual save slots 1-3
  for (let i = 1; i <= 3; i++) {
    const saveInfo = getSaveInfo(i);
    if (saveInfo) {
      saves.push({ slot: i, ...saveInfo });
    }
  }
  
  return saves;
};

/**
 * Clear all saved games
 */
export const clearAllSaves = () => {
  try {
    deleteSavedGame('auto');
    for (let i = 1; i <= 3; i++) {
      deleteSavedGame(i);
    }
    return true;
  } catch (error) {
    console.error('Failed to clear all saves:', error);
    return false;
  }
};