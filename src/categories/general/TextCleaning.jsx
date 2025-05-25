import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TextCleaning = ({ theme }) => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  // Theme classes
  const themeClass =
    theme === "dark" ? "bg-[#121212] text-white" : "bg-gray-100 text-black";
  const inputClass =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
  const btnClass =
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-500"
      : "bg-blue-500 hover:bg-blue-400";
  const resultClass =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-black";

  // Remove duplicates
  const removeDuplicateLines = () => {
    if (!text.trim()) {
      toast.warn("Enter some text!");
      return;
    }
    const lines = text.split("\n");
    const uniqueLines = [...new Set(lines)];
    setResult(uniqueLines.join("\n"));
    toast.success("Duplicate lines removed!");
  };

  // Remove extra spaces & tabs properly
  const removeExtraSpaces = () => {
    if (!text.trim()) {
      toast.warn("Enter some text!");
      return;
    }

    const cleanedText = text
      .split("\n")
      .map((line) => line.replace(/[\t ]+/g, " ").trim()) // Replace tabs & multiple spaces
      .join("\n");

    setResult(cleanedText);
    toast.success("Extra spaces removed!");
  };

  // Remove empty lines
  const removeEmptyLines = () => {
    if (!text.trim()) {
      toast.warn("Enter some text!");
      return;
    }

    const cleanedText = text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n");

    setResult(cleanedText);
    toast.success("Empty lines removed!");
  };

  // Combined formatter (removes duplicates, trims, spaces, and empty lines)
  const formatText = () => {
    if (!text.trim()) {
      toast.warn("Enter some text!");
      return;
    }

    const cleanedText = text
      .split("\n")
      .map((line) => line.replace(/[\t ]+/g, " ").trim()) // Normalize spaces & tabs
      .filter((line) => line !== "") // Remove empty lines
      .filter((line, index, arr) => arr.indexOf(line) === index) // Remove duplicates
      .join("\n");

    setResult(cleanedText);
    toast.success("Text formatted!");
  };

  // Clear Text
  const clearText = () => {
    setText("");
    setResult("");
    toast.info("Text cleared!");
  };

  return (
    <div className={`${themeClass} min-h-screen p-4 mt-16`}>
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4">Text Cleaner :</h1>

        {/* Text Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          className={`w-full h-40 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
        />

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={removeDuplicateLines}
            className={`px-4 py-2 rounded ${btnClass}`}
          >
            Remove Duplicates
          </button>
          <button
            onClick={removeExtraSpaces}
            className={`px-4 py-2 rounded ${btnClass}`}
          >
            Remove Extra Spaces
          </button>
          <button
            onClick={removeEmptyLines}
            className={`px-4 py-2 rounded ${btnClass}`}
          >
            Remove Empty Lines
          </button>
          <button
            onClick={formatText}
            className={`px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white`}
          >
            Format Text
          </button>
          <button
            onClick={clearText}
            className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded text-white"
          >
            Clear
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Cleaned Text:</h2>
            <textarea
              value={result}
              readOnly
              className={`w-full h-40 p-3 rounded-lg border focus:outline-none ${resultClass}`}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TextCleaning;
