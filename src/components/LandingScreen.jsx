import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import GameContext from '../contexts/GameContext';
import { getSaveInfo } from '../utils/localStorage';

function LandingScreen({ onContinue }) {
  const { loadSavedGame, hasActiveSave } = useContext(GameContext);
  const activated = useRef(false);
  const startBtnRef = useRef(null);
  const continueBtnRef = useRef(null);
  const [mountedAt] = useState(() => Date.now());
  const [showButton, setShowButton] = useState(false);
  const [autoSaveInfo, setAutoSaveInfo] = useState(null);

  useEffect(() => {
    const buttonTimer = setTimeout(() => setShowButton(true), 800);
    return () => clearTimeout(buttonTimer);
  }, []);

  useEffect(() => {
    // Check for auto-save
    const saveInfo = getSaveInfo('auto');
    setAutoSaveInfo(saveInfo);
  }, []);

  // Focus appropriate button when shown for accessibility
  useEffect(() => {
    if (showButton) {
      const id = setTimeout(() => {
        if (autoSaveInfo && continueBtnRef.current) {
          continueBtnRef.current.focus();
        } else if (startBtnRef.current) {
          startBtnRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(id);
    }
  }, [showButton, autoSaveInfo]);

  const proceed = useCallback(() => {
    if (activated.current) return;
    activated.current = true;
    onContinue();
  }, [onContinue]);

  const continueSaved = useCallback(() => {
    if (activated.current) return;
    activated.current = true;
    loadSavedGame('auto');
  }, [loadSavedGame]);

  const handleKey = useCallback((e) => {
    if (activated.current) return;
    if (e.repeat) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (autoSaveInfo && continueBtnRef.current === document.activeElement) {
        continueSaved();
      } else {
        proceed();
      }
    }
    if (e.key === 'c' || e.key === 'C') {
      if (autoSaveInfo) {
        e.preventDefault();
        continueSaved();
      }
    }
  }, [proceed, continueSaved, autoSaveInfo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="landing-screen" aria-labelledby="game-title">
      <div className="logo-cluster">
        <h1 id="game-title" className="game-title">ASWANG HUNTER<span className="title-caret" aria-hidden="true">▌</span></h1>
        <p className="tagline animated-sub">FOLK HORROR TEXT EXPERIENCE</p>
      </div>
      {showButton && (
        <div className="landing-buttons">
          {autoSaveInfo && (
            <button
              ref={continueBtnRef}
              type="button"
              className="press-start improved continue-button"
              onClick={continueSaved}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); continueSaved(); } }}
            >
              Continue ({autoSaveInfo.playerName})
            </button>
          )}
          <button
            ref={startBtnRef}
            type="button"
            className="press-start improved"
            onClick={proceed}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); proceed(); } }}
          >
            {autoSaveInfo ? 'New Game' : 'Begin'}
          </button>
        </div>
      )}
      <div className="ambient-notes">
        <span>Enter / Space</span>
        {autoSaveInfo && (
          <>
            <span className="sep">•</span>
            <span>C to Continue</span>
          </>
        )}
        <span className="sep">•</span>
        <span>Auto Save Enabled</span>
        <span className="sep">•</span>
        <span>Choices Matter</span>
      </div>
    </div>
  );
}

export default LandingScreen;
