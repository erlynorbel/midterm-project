import React, { useEffect, useRef, useState, useCallback } from 'react';

function LandingScreen({ onContinue }) {
  const activated = useRef(false);
  const startBtnRef = useRef(null);
  const [mountedAt] = useState(() => Date.now());
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    const buttonTimer = setTimeout(() => setShowButton(true), 800);
    return () => clearTimeout(buttonTimer);
  }, []);

  // Focus button when shown for accessibility
  useEffect(() => {
    if (showButton) {
      const id = setTimeout(() => startBtnRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [showButton]);

  const proceed = useCallback(() => {
    if (activated.current) return;
    activated.current = true;
    onContinue();
  }, [onContinue]);

  const handleKey = useCallback((e) => {
    if (activated.current) return;
    if (e.repeat) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      proceed();
    }
  }, [proceed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
  <div className="landing-screen" aria-labelledby="game-title">
      <div className="logo-cluster">
        <h1 id="game-title" className="game-title">ASWANG HUNTER<span className="title-caret" aria-hidden="true">▌</span></h1>
        <p className="tagline animated-sub">FOLK HORROR TEXT EXPERIENCE</p>
      </div>
      {showButton && (
        <button
          ref={startBtnRef}
            type="button"
            className="press-start improved"
            onClick={proceed}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); proceed(); } }}
        >
          Begin
        </button>
      )}
      <div className="ambient-notes">
        <span>Enter / Space</span>
        <span className="sep">•</span>
        <span>No Save Persistence</span>
        <span className="sep">•</span>
        <span>Choices Matter</span>
      </div>
    </div>
  );
}

export default LandingScreen;
