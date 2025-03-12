
import React from "react";

const PascalCase = ({ text }) => {
  const toPascalCase = (str) => {
    return str
      .toLowerCase()
      .replace(/(?:^|\s|_|\-|\.)\w/g, (match) => match.toUpperCase())
      .replace(/\s|_|-|\./g, "");
  };

  return <>{toPascalCase(text)}</>;
};

export default PascalCase;
