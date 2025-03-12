import React from "react";

const DotCase = ({ text }) => {
  const toDotCase = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ".");
  };

  return <>{toDotCase(text)}</>;
};

export default DotCase;
