import React, { useState, useEffect } from "react";

const CamelCase = ({ text }) => {
  const [camelText, setCamelText] = useState("");

  useEffect(() => {
    if (text) {
      setCamelText(convertToCamelCase(text));
    }
  }, [text]);

  const convertToCamelCase = (str) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
      .split(" ")
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");
  };

  return <>{camelText}</>;
};

export default CamelCase;
