import React from "react";

const TitleCase = ({ text }) => {
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return <>{toTitleCase(text)}</>;
};

export default TitleCase;
