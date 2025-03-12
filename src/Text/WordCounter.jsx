import React, { useState } from "react";
import { useTheme } from "../ThemeProvider"; // Assuming useTheme is available

const WordCounter = () => {
  const { theme } = useTheme(); // Get theme state
  const [inputText, setInputText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [specialCharCounts, setSpecialCharCounts] = useState({});
  const [numberCount, setNumberCount] = useState(0);
  const [spaceCount, setSpaceCount] = useState(0);
  const [totalCharCount, setTotalCharCount] = useState(0);

  // Handle input text change
  const handleChange = (e) => setInputText(e.target.value);

  // Count words and special characters
  const countWordsAndSpecialChars = () => {
    // Count words that contain at least one alphabet character (excluding numbers)
    const words = inputText
      .trim()
      .split(/\s+/)
      .filter((word) => /[a-zA-Z]/.test(word)); // Only include words containing alphabet characters

    // Count numbers separately (ignore them in word count)
    const numbers = inputText.match(/\d+/g) || [];

    // Special character counts
    const specialChars = inputText.match(/[^\w\s\d]/g) || [];

    // Space count
    const spaces = (inputText.match(/\s/g) || []).length;

    // Total character count (including spaces)
    const totalChars = inputText.length;

    // Word count
    setWordCount(words.length);

    // Special character counts
    const counts = specialChars.reduce((acc, char) => {
      acc[char] = acc[char] ? acc[char] + 1 : 1;
      return acc;
    }, {});
    setSpecialCharCounts(counts);

    // Number count
    setNumberCount(numbers.length);

    // Set space count and total character count
    setSpaceCount(spaces);
    setTotalCharCount(totalChars);
  };

  // Handle key press for Ctrl + Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault(); // Prevent the default behavior (new line)
      countWordsAndSpecialChars(); // Trigger the count function
    }
  };

  return (
    <div
      className={`min-h-screen mt-20 flex items-center justify-center px-4 py-8 transition-colors ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`max-w-xl w-full p-6 rounded-2xl shadow-xl ${
          theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Word & Special Character Counter</h2>

        {/* Input Text Area */}
        <textarea
          rows="5"
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyPress} // Listen for keypress events
          placeholder="Type or paste text..."
          className={`w-full px-3 py-2 rounded-lg border ${
            theme === "dark"
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-300 bg-white text-black"
          } focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4`}
        />

        {/* Count Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={countWordsAndSpecialChars}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Count Words & Special Characters
          </button>
        </div>

        {/* Word Count */}
        <div className="text-lg font-medium mb-4">
          <p>Word Count: {wordCount}</p>
          <p>Space Count: {spaceCount}</p>
          <p>Total Character Count (including spaces): {totalCharCount}</p>
        </div>

        {/* Special Character Count Table */}
        {Object.keys(specialCharCounts).length > 0 || numberCount > 0 ? (
          <div className="overflow-x-auto">
            <table
              className={`min-w-full table-auto border-separate border-spacing-0 ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
            >
              <thead>
                <tr
                  className={`${
                    theme === "dark" ? "bg-blue-700 text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  <th className="px-6 py-3 border-b-2 border-gray-300">Character</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(specialCharCounts).map(([char, count]) => (
                  <tr
                    key={char}
                    className={`${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    } border-b border-gray-300`}
                  >
                    <td className="px-6 py-3 border-r border-gray-300">{char}</td>
                    <td className="px-6 py-3">{count}</td>
                  </tr>
                ))}
                {numberCount > 0 && (
                  <tr
                    className={`${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    } border-b border-gray-300`}
                  >
                    <td className="px-6 py-3 border-r border-gray-300">Numbers</td>
                    <td className="px-6 py-3">{numberCount}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center mt-4">No special characters or numbers detected.</p>
        )}
      </div>
    </div>
  );
};

export default WordCounter;
