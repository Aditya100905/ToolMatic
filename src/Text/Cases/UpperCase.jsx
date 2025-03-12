import React, { useState, useEffect } from 'react';

const UpperCase = ({ text }) => {
    const [upperText, setUpperText] = useState('');

    useEffect(() => {
        if (text) {
            setUpperText(text.toUpperCase());
        }
    }, [text]); // Runs when 'text' prop changes

    return (
        <div>
            <h2>Uppercase Text:</h2>
            <p>{upperText}</p>
        </div>
    );
};

export default UpperCase;
