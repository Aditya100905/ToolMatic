import React from "react";

const TrainCase = ({ text }) => {
  const toTrainCase = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/\s+/g, "-");
  };

  return <>{toTrainCase(text)}</>;
};

export default TrainCase;
