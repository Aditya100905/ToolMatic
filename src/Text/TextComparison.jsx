import React, { useState, useEffect, useRef } from "react";

const TextComparison = ({ theme = "dark" }) => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [differences, setDifferences] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [copyStatus, setCopyStatus] = useState({
    text1: false,
    text2: false,
    results: false,
  });
  const [compareOptions, setCompareOptions] = useState({
    ignoreWhitespace: false,
    ignoreCase: false,
    ignoreEmptyLines: false,
    wordByWord: false,
  });

  const textArea1Ref = useRef(null);
  const textArea2Ref = useRef(null);

  // Improved theme colors with better contrast and proper dark theme
  const themeColors = {
    light: {
      background: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white",
      border: "border-gray-200",
      input: "bg-white border-gray-300",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      added: "bg-green-600 text-white border border-green-800",
      removed: "bg-red-500 text-white border border-red-700",
      unchanged: "bg-gray-100 text-gray-800",
      secondaryButton: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    },
    dark: {
      background: "bg-black",
      text: "text-gray-100",
      card: "bg-[#212121]",
      border: "border-gray-700",
      input: "bg-[#141414] border-gray-600 text-white",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      added: "bg-green-800 text-white border border-green-800",
      removed: "bg-red-700 text-white border border-red-700",
      unchanged: "bg-gray-700 text-gray-200",
      secondaryButton: "bg-gray-700 hover:bg-gray-600 text-gray-200",
      optionsBg: "bg-[#121212]",
      textareaBg: "bg-gray-700",
      resultsBg: "bg-[#141414]",
    },
  };

  const colors = themeColors[theme] || themeColors.dark;

  // Function to normalize text based on options
  const normalizeText = (text) => {
    let result = text;

    if (compareOptions.ignoreCase) {
      result = result.toLowerCase();
    }

    if (compareOptions.ignoreWhitespace) {
      result = result.replace(/\s+/g, " ").trim();
    }

    if (compareOptions.ignoreEmptyLines) {
      result = result
        .split("\n")
        .filter((line) => line.trim() !== "")
        .join("\n");
    }

    return result;
  };

  // Function to find differences between texts
  const compareTexts = () => {
    if (!text1 && !text2) {
      setDifferences([]);
      setShowComparison(true);
      return;
    }

    // Check if texts are identical before normalization
    const textsAreIdentical = text1 === text2;

    let processedText1 = normalizeText(text1);
    let processedText2 = normalizeText(text2);

    // Check if texts are identical after normalization
    const normalizedTextsAreIdentical = processedText1 === processedText2;

    // If texts are identical (either originally or after normalization),
    // set an empty differences array, but still show the comparison section
    if (textsAreIdentical || normalizedTextsAreIdentical) {
      setDifferences([]);
      setShowComparison(true);
      return;
    }

    // Get lines based on comparison options
    const lines1 = processedText1.split("\n");
    const lines2 = processedText2.split("\n");
    const result = [];

    const maxLines = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || "";
      const line2 = lines2[i] || "";

      // Start with direct equality check
      let isEqual = line1 === line2;

      // Only check case insensitive comparison if not already equal
      if (compareOptions.ignoreCase && !isEqual) {
        isEqual = line1.toLowerCase() === line2.toLowerCase();
      }

      // Only check whitespace normalization if still not equal
      if (compareOptions.ignoreWhitespace && !isEqual) {
        isEqual =
          line1.trim().replace(/\s+/g, " ") ===
          line2.trim().replace(/\s+/g, " ");
      }

      // Handle empty lines comparison
      if (
        compareOptions.ignoreEmptyLines &&
        line1.trim() === "" &&
        line2.trim() === ""
      ) {
        isEqual = true;
      }

      if (isEqual) {
        result.push({ type: "unchanged", text: line1, lineNumber: i + 1 });
      } else if (compareOptions.wordByWord && line1 && line2) {
        // Word by word comparison for this line
        const words1 = line1.split(/(\s+)/);
        const words2 = line2.split(/(\s+)/);

        // Use a simplified diff algorithm for word comparison
        const wordDiff = simpleDiff(words1, words2, compareOptions.ignoreCase);

        result.push({
          type: "modified",
          lineNumber: i + 1,
          wordDiff1: wordDiff.first,
          wordDiff2: wordDiff.second,
          text1: line1,
          text2: line2,
        });
      } else {
        if (i < lines1.length) {
          result.push({ type: "removed", text: line1, lineNumber: i + 1 });
        }
        if (i < lines2.length) {
          result.push({ type: "added", text: line2, lineNumber: i + 1 });
        }
      }
    }

    setDifferences(result);
    setShowComparison(true);
  };

  // Simple diff algorithm for word-by-word comparison
  const simpleDiff = (sequence1, sequence2, ignoreCase) => {
    const result = {
      first: sequence1.map((word) => ({ text: word, changed: true })),
      second: sequence2.map((word) => ({ text: word, changed: true })),
    };

    // Mark unchanged parts
    for (let i = 0; i < sequence1.length; i++) {
      for (let j = 0; j < sequence2.length; j++) {
        const word1 = ignoreCase ? sequence1[i].toLowerCase() : sequence1[i];
        const word2 = ignoreCase ? sequence2[j].toLowerCase() : sequence2[j];

        if (
          word1 === word2 &&
          result.first[i].changed &&
          result.second[j].changed
        ) {
          result.first[i].changed = false;
          result.second[j].changed = false;
          break;
        }
      }
    }

    return result;
  };

  // Reset comparison results
  const resetComparison = () => {
    setText1("");
    setText2("");
    setDifferences([]);
    setShowComparison(false);
  };

  // Copy comparison results
  const copyComparisonResults = () => {
    let resultText = "";
    differences.forEach((diff) => {
      const prefix =
        diff.type === "added" ? "+ " : diff.type === "removed" ? "- " : "  ";
      resultText += `${prefix}${diff.text}\n`;
    });

    navigator.clipboard
      .writeText(resultText)
      .then(() => {
        setCopyStatus({ ...copyStatus, results: true });
        setTimeout(
          () => setCopyStatus({ ...copyStatus, results: false }),
          2000
        );
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  // Copy text from textarea
  const copyText = (source) => {
    const text = source === "text1" ? text1 : text2;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyStatus({ ...copyStatus, [source]: true });
        setTimeout(
          () => setCopyStatus({ ...copyStatus, [source]: false }),
          2000
        );
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  // Paste text to textarea
  const pasteText = async (target) => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (target === "text1") {
        setText1(clipboardText);
      } else {
        setText2(clipboardText);
      }
    } catch (err) {
      console.error("Failed to paste text: ", err);

      // Fallback for browsers that don't support clipboard API
      const targetRef = target === "text1" ? textArea1Ref : textArea2Ref;
      if (targetRef.current) {
        targetRef.current.focus();
        document.execCommand("paste");
      }
    }
  };

  // Swap text areas with animation
  const swapTexts = () => {
    setIsSwapping(true);

    setTimeout(() => {
      const temp = text1;
      setText1(text2);
      setText2(temp);
      setIsSwapping(false);
    }, 300);
  };

  // Toggle an option
  const toggleOption = (option) => {
    setCompareOptions({
      ...compareOptions,
      [option]: !compareOptions[option],
    });
  };

  // Improved syntax highlighting
  const syntaxHighlight = (text) => {
    return (
      text
        // Keywords
        .replace(
          /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|switch|case|break|continue|default|new|this)\b/g,
          '<span class="text-purple-400">$1</span>'
        )
        // Booleans and nulls
        .replace(
          /\b(true|false|null|undefined|NaN)\b/g,
          '<span class="text-yellow-400">$1</span>'
        )
        // Strings
        .replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
        .replace(/'([^']*)'/g, "<span class=\"text-green-400\">'$1'</span>")
        .replace(/`([^`]*)`/g, '<span class="text-green-400">`$1`</span>')
        // Comments
        .replace(/\/\/(.*)/g, '<span class="text-gray-500">// $1</span>')
        // Numbers
        .replace(/\b(\d+)\b/g, '<span class="text-blue-400">$1</span>')
        // JSX/HTML tags
        .replace(
          /(&lt;\/?\w+)(\s+[^>]*)?(&gt;)/g,
          '<span class="text-red-400">$1$2$3</span>'
        )
    );
  };

  // Apply simple syntax highlighting to differences
  const renderDiffContent = (item) => {
    if (item.type === "modified") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className={`${colors.removed} px-2 py-1 rounded`}>
            {item.wordDiff1.map((word, i) => (
              <span
                key={i}
                className={word.changed ? "bg-red-800 rounded px-1" : ""}
              >
                {word.text}
              </span>
            ))}
          </div>
          <div className={`${colors.added} px-2 py-1 rounded`}>
            {item.wordDiff2.map((word, i) => (
              <span
                key={i}
                className={word.changed ? "bg-green-800 rounded px-1" : ""}
              >
                {word.text}
              </span>
            ))}
          </div>
        </div>
      );
    }

    if (
      item.text.trim().startsWith("//") ||
      item.text.includes("{") ||
      item.text.includes("function") ||
      item.text.includes("=") ||
      item.text.includes("(") ||
      item.text.includes("<") ||
      item.text.includes(">")
    ) {
      // Likely code - apply syntax highlighting
      // Escape HTML characters first
      const escapedText = item.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return (
        <div
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: syntaxHighlight(escapedText),
          }}
        />
      );
    }

    return <span className="whitespace-pre-wrap">{item.text}</span>;
  };

  // Load example data
  const loadExample = () => {
    setText1(`function calculateTotal(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i].price;
  }
  return sum;
}`);
    setText2(`function calculateTotal(items) {
  // Sum all prices using reduce
  return items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);
}`);
  };

  return (
    <div className={`${colors.background} ${colors.text} mt-16 min-h-screen`}>
      <div className="px-4 py-8 md:py-12 max-w-6xl mx-auto">
        <div
          className={`${colors.card} rounded-lg shadow-lg border ${colors.border} overflow-hidden`}
        >
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Text Comparison
            </h1>

            {/* Comparison Options */}
            <div
              className={`${theme === "dark" ? colors.optionsBg : "bg-gray-100"} rounded-lg p-4 mb-6`}
            >
              <h2 className="font-medium mb-3">Comparison Options</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-blue-600"
                    checked={compareOptions.ignoreWhitespace}
                    onChange={() => toggleOption("ignoreWhitespace")}
                  />
                  <span className="text-sm md:text-base">
                    Ignore whitespace
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-blue-600"
                    checked={compareOptions.ignoreCase}
                    onChange={() => toggleOption("ignoreCase")}
                  />
                  <span className="text-sm md:text-base">Ignore case</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-blue-600"
                    checked={compareOptions.ignoreEmptyLines}
                    onChange={() => toggleOption("ignoreEmptyLines")}
                  />
                  <span className="text-sm md:text-base">
                    Ignore empty lines
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-blue-600"
                    checked={compareOptions.wordByWord}
                    onChange={() => toggleOption("wordByWord")}
                  />
                  <span className="text-sm md:text-base">
                    Word-by-word diff
                  </span>
                </label>
              </div>
            </div>

            {/* Text Area Containers */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 mb-6 relative">
              {/* Original Text */}
              <div
                className={`${theme === "dark" ? "bg-gray-750" : "bg-gray-50"} rounded-lg p-4 transition-transform duration-300 ${isSwapping ? "transform translate-x-full opacity-0" : ""}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <label className="block font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Original Text
                  </label>
                  <div className="flex space-x-1">
                    <button
                      className={`text-sm px-2 py-1 rounded ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"} flex items-center transition-colors`}
                      onClick={() => copyText("text1")}
                      title="Copy text"
                    >
                      {copyStatus.text1 ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-green-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                            />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      className={`text-sm px-2 py-1 rounded ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"} flex items-center transition-colors`}
                      onClick={() => pasteText("text1")}
                      title="Paste text"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span>Paste</span>
                    </button>
                    <button
                      className={`text-sm px-2 py-1 rounded ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"} transition-colors`}
                      onClick={() => setText1("")}
                      title="Clear text"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className={`relative rounded-md shadow-sm`}>
                  <textarea
                    ref={textArea1Ref}
                    className={`w-full p-3 rounded-md ${colors.input} h-64 md:h-72 font-mono text-sm resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow`}
                    value={text1}
                    onChange={(e) => setText1(e.target.value)}
                    placeholder="Paste original text here..."
                  />
                </div>
              </div>

              {/* Swap Button (Desktop) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                <button
                  className={`p-2 rounded-full ${colors.secondaryButton} shadow-lg hover:scale-110 transition-transform ${isSwapping ? "animate-spin" : ""}`}
                  onClick={swapTexts}
                  disabled={isSwapping}
                  title="Swap texts"
                  aria-label="Swap texts"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </button>
              </div>

              {/* Swap Button (Mobile - Between Text Areas) */}
              <div className="md:hidden flex justify-center -my-2 z-10">
                <button
                  className={`p-2 rounded-full ${colors.secondaryButton} shadow-lg hover:scale-110 transition-transform ${isSwapping ? "animate-spin" : ""}`}
                  onClick={swapTexts}
                  disabled={isSwapping}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </button>
              </div>

              {/* Modified Text */}
              <div
                className={`${theme === "dark" ? "bg-gray-750" : "bg-gray-50"} rounded-lg p-4 transition-transform duration-300 ${isSwapping ? "transform -translate-x-full opacity-0" : ""}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <label className="block font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Modified Text
                  </label>
                  <div className="flex space-x-1">
                    <button
                      className={`text-sm px-2 py-1 rounded ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"} flex items-center transition-colors`}
                      onClick={() => copyText("text2")}
                      title="Copy text"
                    >
                      {copyStatus.text2 ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-green-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                            />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      className={`text-sm px-2 py-1 rounded ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"} flex items-center transition-colors`}
                      onClick={() => pasteText("text2")}
                      title="Paste text"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span>Paste</span>
                    </button>
                    <button
                      className={`text-sm px-2 py-1 rounded ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"} transition-colors`}
                      onClick={() => setText2("")}
                      title="Clear text"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className={`relative rounded-md shadow-sm`}>
                  <textarea
                    ref={textArea2Ref}
                    className={`w-full p-3 rounded-md ${colors.input} h-64 md:h-72 font-mono text-sm resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow`}
                    value={text2}
                    onChange={(e) => setText2(e.target.value)}
                    placeholder="Paste modified text here..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 mb-8">
              <button
                className={`${colors.button} rounded-md py-2 px-4 font-medium transition-colors flex items-center justify-center`}
                onClick={compareTexts}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Compare Texts
              </button>
              <button
                className={`${colors.secondaryButton} rounded-md py-2 px-4 font-medium transition-colors flex items-center justify-center`}
                onClick={resetComparison}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset
              </button>
              <button
                className={`${colors.secondaryButton} rounded-md py-2 px-4 font-medium transition-colors flex items-center justify-center`}
                onClick={loadExample}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Load Example
              </button>
            </div>

            {/* Comparison Results */}
            {showComparison && (
              <div
                className={`${theme === "dark" ? colors.resultsBg : "bg-gray-50"} rounded-lg p-4 mb-4 border ${colors.border}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    Comparison Results
                  </h2>
                  <div className="flex items-center">
                    <button
                      className={`text-sm px-3 py-1 rounded ${colors.secondaryButton} flex items-center transition-colors`}
                      onClick={copyComparisonResults}
                    >
                      {copyStatus.results ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                            />
                          </svg>
                          <span>Copy Results</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {differences.length === 0 ? (
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-md flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">
                      No differences found. The texts are identical
                      {compareOptions.ignoreCase ||
                      compareOptions.ignoreWhitespace ||
                      compareOptions.ignoreEmptyLines
                        ? " (after applying the selected comparison options)"
                        : ""}
                      .
                    </span>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead
                        className={
                          theme === "dark" ? "bg-[#212121]" : "bg-gray-50"
                        }
                      >
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider w-16"
                          >
                            Line
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
                          >
                            Content
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        className={`divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-200"}`}
                      >
                        {differences.map((item, index) => (
                          <tr
                            key={index}
                            className={`
                              ${item.type === "added" ? colors.added : ""}
                              ${item.type === "removed" ? colors.removed : ""}
                              ${item.type === "unchanged" ? colors.unchanged : ""}
                            `}
                          >
                            <td className="px-4 py-2 text-sm whitespace-nowrap font-mono">
                              {item.lineNumber}
                              {item.type === "added" && (
                                <span className="ml-1">+</span>
                              )}
                              {item.type === "removed" && (
                                <span className="ml-1">-</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm font-mono">
                              {renderDiffContent(item)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextComparison;
