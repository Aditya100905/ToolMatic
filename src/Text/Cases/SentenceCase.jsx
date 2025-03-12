import React, { useState, useEffect } from 'react';

const SentenceCase = ({ text }) => {
    const [sentenceText, setSentenceText] = useState('');

    useEffect(() => {
        if (text) {
            setSentenceText(formatSentenceCase(text));
        }
    }, [text]);

    const formatSentenceCase = (str) => {
        return str
            .split(/([.!?]+[\s\n]*)/g) // Split at sentence-ending punctuation but keep it
            .map((part, index, arr) => {
                if (index === 0 || arr[index - 1].match(/[.!?]+/)) {
                    return part.charAt(0).toUpperCase() + part.slice(1);
                }
                return part;
            })
            .join('');
    };

    return <>{sentenceText}</>;
};

export default SentenceCase;
