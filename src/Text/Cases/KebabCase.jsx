import React from "react";

const KebabCase = ({ text }) => {
  const toKebabCase = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  return <>{toKebabCase(text)}</>;
};

export default KebabCase;
