import React, { useState, useEffect } from "react";

const SnakeCase = ({ text }) => {
  const [snakeText, setSnakeText] = useState("");

  useEffect(() => {
    if (text) {
      setSnakeText(convertToSnakeCase(text));
    }
  }, [text]);

  const convertToSnakeCase = (str) => {
    return str
      .trim()
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, "") // Remove special characters except underscores
      .toLowerCase();
  };

  return <>{snakeText}</>;
};

export default SnakeCase;
