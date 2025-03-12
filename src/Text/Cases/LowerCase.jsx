import React, { useState, useEffect } from 'react';

const LowerCase = ({ text }) => {
    const [LowerText, setLowerText] = useState('');

    useEffect(() => {
        if (text) {
            setLowerText(text.toLowerCase());
        }
    }, [text]); // Runs when 'text' prop changes

    return (
        <div>
            <h2>Lowercase Text:</h2>
            <p>{LowerText}</p>
        </div>
    );
};

export default LowerCase;
