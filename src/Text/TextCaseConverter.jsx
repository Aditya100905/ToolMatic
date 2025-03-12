import React, { useState } from "react";
import { useTheme } from "../ThemeProvider"; // Assuming useTheme is available
import { ClipboardIcon } from '@heroicons/react/24/outline'; // Corrected import path for Heroicons v2

const TextCaseConverter = () => {
  const { theme } = useTheme(); // Get theme state
  const [inputText, setInputText] = useState("");
  const [formatType, setFormatType] = useState("SENTENCE"); // Default to Sentence Case

  // Function to handle input text change
  const handleChange = (e) => setInputText(e.target.value);

  // Function to handle format type selection
  const handleFormatChange = (type) => setFormatType(type);

  // Function to get formatted text based on selected format type
  const getFormattedText = () => {
    switch (formatType) {
      case "UPPER":
        return inputText.toUpperCase();
      case "LOWER":
        return inputText.toLowerCase();
      case "SENTENCE":
        return inputText.charAt(0).toUpperCase() + inputText.slice(1).toLowerCase();
      // case "CAMEL":
      //   return inputText.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      //     index === 0 ? match.toLowerCase() : match.toUpperCase()
      //   );
      // case "TITLE":
      //   return inputText.replace(/\b\w/g, (match) => match.toUpperCase());
      default:
        return inputText;
    }
  };

  // Copy to Clipboard function
  const copyToClipboard = () => {
    const textToCopy = getFormattedText();
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Text copied to clipboard!");
    });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`max-w-xl w-full p-6 rounded-2xl shadow-xl ${
          theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Text Case Converter</h2>

        {/* Input Text Area */}
        <textarea
          rows="5"
          value={inputText}
          onChange={handleChange}
          placeholder="Type or paste text..."
          className={`w-full px-3 py-2 rounded-lg border ${
            theme === "dark"
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-300 bg-white text-black"
          } focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4`}
        />

        {/* Buttons for Formatting */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { type: "UPPER", label: "Upper Case" },
            { type: "LOWER", label: "Lower Case" },
            { type: "SENTENCE", label: "Sentence Case" },
            // { type: "CAMEL", label: "Camel Case" },
            // { type: "TITLE", label: "Title Case" },
          ].map(({ type, label }) => (
            <button
              key={type}
              onClick={() => handleFormatChange(type)}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Formatted Text Output */}
        <div
          className={`w-full px-3 py-2 rounded-lg border ${
            theme === "dark"
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-300 bg-white text-black"
          } focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 overflow-y-auto max-h-72`} // Added overflow handling
        >
          <h3 className="text-lg font-semibold mb-2">{formatType} CASE</h3>
          <div className="relative flex items-start justify-start">
            <p className="whitespace-pre-wrap flex-1">{getFormattedText()}</p>
            <button
              onClick={copyToClipboard}
              className="absolute bottom-2 right-4 p-2 items-center bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              <ClipboardIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCaseConverter;
