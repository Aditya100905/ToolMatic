import React from "react";

const AlternatingCase = ({ text }) => {
  const toAlternatingCase = (str) => {
    return str
      .split("")
      .map((char, index) =>
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      )
      .join("");
  };

  return <>{toAlternatingCase(text)}</>;
};

export default AlternatingCase;
