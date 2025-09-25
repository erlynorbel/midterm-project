import React, { useState, useContext, useEffect, useRef } from 'react';
import GameContext from '../contexts/GameContext';

function StartScreen() {
    const [name, setName] = useState('');
    const { startGame } = useContext(GameContext);
    const inputRef = useRef(null);

    useEffect(() => {
        // autofocus after transition
        const id = setTimeout(() => inputRef.current?.focus(), 200);
        return () => clearTimeout(id);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) startGame(name.trim());
    };

    return (
        <div className="start-screen fade-in">
            <h2 style={{ letterSpacing: '3px', marginTop: 0, fontWeight: 600 }}>Identify Yourself</h2>
            <p style={{ maxWidth: 560, lineHeight: 1.5, margin: '0 auto 1.3rem', opacity: .8 }}>
                You step beyond the kapre-shadowed trail. An old woman watches from a bamboo window. The night is waiting.
            </p>
            <form onSubmit={handleSubmit} autoComplete="off">
                <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    maxLength={18}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter hunter name"
                    spellCheck="false"
                    required
                />
                <button type="submit" className="primary-btn">Begin Hunt</button>
            </form>
        </div>
    );
}

export default StartScreen;