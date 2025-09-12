import React, { useState, useContext } from 'react';
import GameContext from '../contexts/GameContext';

function StartScreen() {
    const [name, setName] = useState('');
    const { startGame } = useContext(GameContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            startGame(name.trim());
        }
    };

    return (
        <div className="start-screen">
            <h1>Aswang Hunter</h1>
            <p>Enter your name to begin your journey.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                />
                <button type="submit">Start Hunt</button>
            </form>
            <p>
You arrive at the dimly lit town of San Gubat. The air is heavy with fear. Who do you seek for information first?
</p>
        </div>
    );
}

export default StartScreen;