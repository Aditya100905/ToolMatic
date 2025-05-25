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
    highlightInline: true,
  });
  const [isDiffLoading, setIsDiffLoading] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [diffStats, setDiffStats] = useState({
    added: 0,
    removed: 0,
    modified: 0,
    unchanged: 0,
  });

  const textArea1Ref = useRef(null);
  const textArea2Ref = useRef(null);
  const resultsRef = useRef(null);

  // Improved dark theme color palette
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
      highlightAdded: "bg-green-100 text-green-800",
      highlightRemoved: "bg-red-100 text-red-800",
    },
    dark: {
      background: "bg-[#0e0e0e]",
      text: "text-gray-100",
      card: "bg-[#121212]",
      border: "border-gray-800",
      input: "bg-[#1e1e1e] border-gray-700 text-gray-100",
      button: "bg-blue-700 hover:bg-blue-600 text-white",
      added: "bg-[#143a25] text-green-300 border border-green-800",
      removed: "bg-[#4a1c1c] text-red-300 border border-red-800",
      unchanged: "bg-[#202020] text-gray-300",
      secondaryButton: "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-200",
      optionsBg: "bg-[#0a0a0a]",
      textareaBg: "bg-[#1a1a1a]",
      resultsBg: "bg-[#0a0a0a]",
      highlightAdded: "bg-[#0d2518] text-green-300",
      highlightRemoved: "bg-[#2d1212] text-red-300",
      tableBg: "bg-[#161616]",
      tableHeader: "bg-[#0a0a0a]",
      inputFocus: "focus:ring-blue-700 focus:border-blue-600",
      buttonHover: "hover:bg-[#2a2a2a]",
      stats: "bg-[#1a1a1a]",
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

  // Calculate difference statistics
  const calculateDiffStats = (diffs) => {
    const stats = {
      added: 0,
      removed: 0,
      modified: 0,
      unchanged: 0,
    };

    diffs.forEach((diff) => {
      if (diff.type === "added") stats.added++;
      else if (diff.type === "removed") stats.removed++;
      else if (diff.type === "modified") stats.modified++;
      else if (diff.type === "unchanged") stats.unchanged++;
    });

    return stats;
  };

  // Function to find differences between texts with debounce-like functionality for large texts
  const compareTexts = () => {
    if (!text1 && !text2) {
      setDifferences([]);
      setShowComparison(true);
      setDiffStats({ added: 0, removed: 0, modified: 0, unchanged: 0 });
      return;
    }

    setIsDiffLoading(true);

    // Use setTimeout to prevent UI freezing for large text comparisons
    setTimeout(() => {
      // Check if texts are identical before normalization
      const textsAreIdentical = text1 === text2;

      let processedText1 = normalizeText(text1);
      let processedText2 = normalizeText(text2);

      // Check if texts are identical after normalization
      const normalizedTextsAreIdentical = processedText1 === processedText2;

      if (textsAreIdentical || normalizedTextsAreIdentical) {
        setDifferences([]);
        setShowComparison(true);
        setDiffStats({ added: 0, removed: 0, modified: 0, unchanged: 0 });
        setIsDiffLoading(false);
        return;
      }

      // Get lines based on comparison options
      const lines1 = processedText1.split("\n");
      const lines2 = processedText2.split("\n");
      const result = [];

      // Handle word-by-word diff for improved accuracy using dynamic programming approach
      if (compareOptions.wordByWord) {
        const diffs = computeLineByLineDiff(lines1, lines2);
        const stats = calculateDiffStats(diffs);

        setDifferences(diffs);
        setDiffStats(stats);
        setShowComparison(true);
        setIsDiffLoading(false);
        return;
      }

      // Line by line comparison (simpler approach)
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
        } else if (i < lines1.length && i < lines2.length) {
          // Both lines exist but are different
          result.push({
            type: "modified",
            lineNumber: i + 1,
            text1: line1,
            text2: line2,
            // Generate inline differences
            inlineDiff: compareOptions.highlightInline
              ? computeInlineDifferences(
                  line1,
                  line2,
                  compareOptions.ignoreCase
                )
              : null,
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

      const stats = calculateDiffStats(result);
      setDifferences(result);
      setDiffStats(stats);
      setShowComparison(true);
      setIsDiffLoading(false);

      // Scroll to results
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 10);
  };

  // Compute line-by-line diff using a better algorithm
  const computeLineByLineDiff = (lines1, lines2) => {
    // Implementation of a line-based diff with word-level granularity
    const result = [];

    // Use Longest Common Subsequence approach for matching
    const lcsMatrix = buildLCSMatrix(lines1, lines2);
    const matches = extractLCSMatches(
      lcsMatrix,
      lines1,
      lines2,
      lines1.length,
      lines2.length
    );

    let i1 = 0,
      i2 = 0,
      matchIdx = 0;

    while (i1 < lines1.length || i2 < lines2.length) {
      // If we're at a match point
      if (
        matchIdx < matches.length &&
        i1 === matches[matchIdx][0] &&
        i2 === matches[matchIdx][1]
      ) {
        result.push({
          type: "unchanged",
          text: lines1[i1],
          lineNumber: i1 + 1,
        });
        i1++;
        i2++;
        matchIdx++;
      }
      // Handle deleted lines
      else if (matchIdx < matches.length && i1 < matches[matchIdx][0]) {
        result.push({
          type: "removed",
          text: lines1[i1],
          lineNumber: i1 + 1,
        });
        i1++;
      }
      // Handle added lines
      else if (matchIdx < matches.length && i2 < matches[matchIdx][1]) {
        result.push({
          type: "added",
          text: lines2[i2],
          lineNumber: i2 + 1,
        });
        i2++;
      }
      // Both lines exist but are different - show as modified with word diff
      else if (i1 < lines1.length && i2 < lines2.length) {
        // Calculate detailed word differences for display
        const wordDiff = computeWordDifferences(
          lines1[i1],
          lines2[i2],
          compareOptions.ignoreCase
        );

        result.push({
          type: "modified",
          lineNumber: i1 + 1,
          text1: lines1[i1],
          text2: lines2[i2],
          wordDiff1: wordDiff.first,
          wordDiff2: wordDiff.second,
          inlineDiff: compareOptions.highlightInline
            ? computeInlineDifferences(
                lines1[i1],
                lines2[i2],
                compareOptions.ignoreCase
              )
            : null,
        });
        i1++;
        i2++;
      }
      // Handle trailing lines
      else if (i1 < lines1.length) {
        result.push({
          type: "removed",
          text: lines1[i1],
          lineNumber: i1 + 1,
        });
        i1++;
      } else if (i2 < lines2.length) {
        result.push({
          type: "added",
          text: lines2[i2],
          lineNumber: i2 + 1,
        });
        i2++;
      }
    }

    return result;
  };

  // Build Longest Common Subsequence matrix for diff algorithm
  const buildLCSMatrix = (a, b) => {
    const matrix = Array(a.length + 1)
      .fill()
      .map(() => Array(b.length + 1).fill(0));

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1;
        } else {
          matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
        }
      }
    }

    return matrix;
  };

  // Extract matched indices from LCS matrix
  const extractLCSMatches = (matrix, a, b, i, j) => {
    const matches = [];

    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) {
        matches.unshift([i - 1, j - 1]);
        i--;
        j--;
      } else if (matrix[i - 1][j] > matrix[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return matches;
  };

  // Compute word-level differences for a pair of lines
  const computeWordDifferences = (line1, line2, ignoreCase) => {
    // Split into words while preserving whitespace
    const words1 = line1
      .split(/(\s+|[.,!?;:()[\]{}'"<>])/g)
      .filter((w) => w !== "");
    const words2 = line2
      .split(/(\s+|[.,!?;:()[\]{}'"<>])/g)
      .filter((w) => w !== "");

    const result = {
      first: words1.map((word) => ({ text: word, changed: true })),
      second: words2.map((word) => ({ text: word, changed: true })),
    };

    // Simple greedy matching algorithm
    for (let i = 0; i < words1.length; i++) {
      const word1 = ignoreCase ? words1[i].toLowerCase() : words1[i];

      for (let j = 0; j < words2.length; j++) {
        const word2 = ignoreCase ? words2[j].toLowerCase() : words2[j];

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

  // Compute character-level differences for inline highlighting
  const computeInlineDifferences = (text1, text2, ignoreCase) => {
    if (!text1 || !text2) return null;

    // Tokenize by character for fine-grained comparison
    const chars1 = text1.split("");
    const chars2 = text2.split("");

    // Use a simple LCS approach for character differences
    const lcsMatrix = buildLCSMatrix(chars1, chars2);
    const matches = extractLCSMatches(
      lcsMatrix,
      chars1,
      chars2,
      chars1.length,
      chars2.length
    );

    // Build highlighted sequences
    const sequence1 = chars1.map((char, idx) => {
      return {
        char,
        highlighted: !matches.some(([i]) => i === idx),
      };
    });

    const sequence2 = chars2.map((char, idx) => {
      return {
        char,
        highlighted: !matches.some(([, j]) => j === idx),
      };
    });

    return { sequence1, sequence2 };
  };

  // Reset comparison results
  const resetComparison = () => {
    setText1("");
    setText2("");
    setDifferences([]);
    setShowComparison(false);
    setDiffStats({ added: 0, removed: 0, modified: 0, unchanged: 0 });
  };

  // Copy comparison results
  const copyComparisonResults = () => {
    let resultText = "";
    differences.forEach((diff) => {
      if (diff.type === "modified") {
        resultText += `- ${diff.text1}\n+ ${diff.text2}\n`;
      } else {
        const prefix =
          diff.type === "added" ? "+ " : diff.type === "removed" ? "- " : "  ";
        resultText += `${prefix}${diff.text}\n`;
      }
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

  // Apply syntax highlighting to differences with inline highlighting
  const renderDiffContent = (item) => {
    if (item.type === "modified") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div
            className={`${colors.removed} px-2 py-1 rounded overflow-x-auto`}
          >
            {item.wordDiff1 ? (
              item.wordDiff1.map((word, i) => (
                <span
                  key={i}
                  className={word.changed ? "bg-[#3a1515] px-1 rounded" : ""}
                >
                  {word.text}
                </span>
              ))
            ) : item.inlineDiff ? (
              item.inlineDiff.sequence1.map((char, i) => (
                <span
                  key={i}
                  className={char.highlighted ? "bg-[#3a1515]" : ""}
                >
                  {char.char}
                </span>
              ))
            ) : (
              <span>{item.text1}</span>
            )}
          </div>
          <div className={`${colors.added} px-2 py-1 rounded overflow-x-auto`}>
            {item.wordDiff2 ? (
              item.wordDiff2.map((word, i) => (
                <span
                  key={i}
                  className={word.changed ? "bg-[#0d3922] px-1 rounded" : ""}
                >
                  {word.text}
                </span>
              ))
            ) : item.inlineDiff ? (
              item.inlineDiff.sequence2.map((char, i) => (
                <span
                  key={i}
                  className={char.highlighted ? "bg-[#0d3922]" : ""}
                >
                  {char.char}
                </span>
              ))
            ) : (
              <span>{item.text2}</span>
            )}
          </div>
        </div>
      );
    }

    if (
      item.text &&
      (item.text.trim().startsWith("//") ||
        item.text.includes("{") ||
        item.text.includes("function") ||
        item.text.includes("=") ||
        item.text.includes("(") ||
        item.text.includes("<") ||
        item.text.includes(">"))
    ) {
      // Likely code - apply syntax highlighting
      // Escape HTML characters first
      const escapedText = item.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return (
        <div
          className="whitespace-pre-wrap overflow-x-auto"
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

  // Show/hide statistics
  const toggleStats = () => {
    setStatsVisible(!statsVisible);
  };

  return (
    <div
      className={`${colors.background} ${colors.text} min-h-screen mt-12 sm:mt-10 md:mt-8`}
    >
      <div className="px-4 py-8 md:py-12 max-w-6xl mx-auto">
        <div
          className={`${colors.card} rounded-lg shadow-lg border ${colors.border} overflow-hidden`}
        >
          <div className="p-6 md:p-8">
            {/* Header with improved styling */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
              <h1 className="text-2xl font-bold flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-blue-500"
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

              <div className="flex flex-wrap justify-end gap-1 space-x-2">
                <button
                  onClick={loadExample}
                  className={`text-sm px-3 py-1 rounded flex items-center ${colors.secondaryButton}`}
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Example
                </button>
                <button
                  onClick={resetComparison}
                  className={`text-sm px-3 py-1 rounded flex items-center ${colors.secondaryButton}`}
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset
                </button>
              </div>
            </div>

            {/* Comparison Options with improved styling */}
            <div
              className={`${colors.optionsBg} rounded-lg p-4 mb-6 border border-gray-800`}
            >
              <h2 className="font-medium mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Comparison Options
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-blue-600 bg-gray-700 border-gray-600"
                    checked={compareOptions.ignoreWhitespace}
                    onChange={() => toggleOption("ignoreWhitespace")}
                  />
                  <span className="text-sm md:text-base group-hover:text-blue-400 transition-colors">
                    Ignore whitespace
                  </span>
                </label>

                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-blue-600 bg-gray-700 border-gray-600"
                    checked={compareOptions.ignoreCase}
                    onChange={() => toggleOption("ignoreCase")}
                  />
                  <span className="text-sm md:text-base group-hover:text-blue-400 transition-colors">
                    Ignore case
                  </span>
                </label>

                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-blue-600 bg-gray-700 border-gray-600"
                    checked={compareOptions.ignoreEmptyLines}
                    onChange={() => toggleOption("ignoreEmptyLines")}
                  />
                  <span className="text-sm md:text-base group-hover:text-blue-400 transition-colors">
                    Ignore empty lines
                  </span>
                </label>

                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-blue-600 bg-gray-700 border-gray-600"
                    checked={compareOptions.wordByWord}
                    onChange={() => toggleOption("wordByWord")}
                  />
                  <span className="text-sm md:text-base group-hover:text-blue-400 transition-colors">
                    Word-by-word diff
                  </span>
                </label>

                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-blue-600 bg-gray-700 border-gray-600"
                    checked={compareOptions.highlightInline}
                    onChange={() => toggleOption("highlightInline")}
                  />
                  <span className="text-sm md:text-base group-hover:text-blue-400 transition-colors">
                    Highlight changes
                  </span>
                </label>
              </div>
            </div>

            {/* Input Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Left Text Area */}
              <div
                className={`${colors.textareaBg} rounded-lg border ${colors.border} p-2`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-blue-400">Original Text</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => pasteText("text1")}
                      className={`text-xs px-2 py-1 rounded ${colors.secondaryButton} flex items-center`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
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
                      Paste
                    </button>
                    <button
                      onClick={() => copyText("text1")}
                      className={`text-xs px-2 py-1 rounded ${colors.secondaryButton} flex items-center`}
                    >
                      {copyStatus.text1 ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
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
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <textarea
                  ref={textArea1Ref}
                  className={`w-full ${colors.input} font-mono text-sm p-3 rounded transition-all h-64 ${colors.inputFocus} focus:outline-none ${
                    isSwapping ? "transform translate-x-full opacity-0" : ""
                  }`}
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  placeholder="Enter or paste original text here..."
                />
              </div>

              {/* Swap Button (Shown between textareas on mobile) */}
              <div className="flex justify-center items-center md:hidden">
                <button
                  onClick={swapTexts}
                  className={`${colors.secondaryButton} p-2 rounded-full ${colors.buttonHover}`}
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

              {/* Right Text Area */}
              <div
                className={`${colors.textareaBg} rounded-lg border ${colors.border} p-2 relative`}
              >
                {/* Swap Button (Shown on larger screens) */}
                <button
                  onClick={swapTexts}
                  className={`absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${colors.secondaryButton} p-2 rounded-full hidden md:block ${colors.buttonHover}`}
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

                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-blue-400">Modified Text</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => pasteText("text2")}
                      className={`text-xs px-2 py-1 rounded ${colors.secondaryButton} flex items-center`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
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
                      Paste
                    </button>
                    <button
                      onClick={() => copyText("text2")}
                      className={`text-xs px-2 py-1 rounded ${colors.secondaryButton} flex items-center`}
                    >
                      {copyStatus.text2 ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
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
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <textarea
                  ref={textArea2Ref}
                  className={`w-full ${colors.input} font-mono text-sm p-3 rounded transition-all h-64 ${colors.inputFocus} focus:outline-none ${
                    isSwapping ? "transform -translate-x-full opacity-0" : ""
                  }`}
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  placeholder="Enter or paste modified text here..."
                />
              </div>
            </div>

            {/* Compare Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={compareTexts}
                disabled={isDiffLoading}
                className={`${
                  colors.button
                } py-2 px-8 rounded-md font-medium flex items-center justify-center w-full md:w-auto ${
                  isDiffLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isDiffLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
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
                )}
                {isDiffLoading ? "Processing..." : "Compare Texts"}
              </button>
            </div>

            {/* Results Section */}
            {showComparison && (
              <div ref={resultsRef}>
                <div className="border-t border-b border-gray-800 py-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <h2 className="text-xl font-semibold mb-3 md:mb-0 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
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
                    Comparison Results
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={toggleStats}
                      className={`text-sm px-3 py-1 rounded flex items-center ${colors.secondaryButton}`}
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      {statsVisible ? "Hide Stats" : "Show Stats"}
                    </button>
                    <button
                      onClick={copyComparisonResults}
                      className={`text-sm px-3 py-1 rounded flex items-center ${colors.secondaryButton}`}
                    >
                      {copyStatus.results ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied
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
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy Results
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Stats section */}
                {statsVisible && (
                  <div
                    className={`${colors.stats} p-4 mb-6 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4`}
                  >
                    <div className="bg-[#143a25] rounded-lg p-3 flex flex-col items-center justify-center">
                      <span className="text-green-300 text-2xl font-bold">
                        {diffStats.added}
                      </span>
                      <span className="text-sm text-green-400">Added</span>
                    </div>
                    <div className="bg-[#4a1c1c] rounded-lg p-3 flex flex-col items-center justify-center">
                      <span className="text-red-300 text-2xl font-bold">
                        {diffStats.removed}
                      </span>
                      <span className="text-sm text-red-400">Removed</span>
                    </div>
                    <div className="bg-[#2d2a12] rounded-lg p-3 flex flex-col items-center justify-center">
                      <span className="text-yellow-300 text-2xl font-bold">
                        {diffStats.modified}
                      </span>
                      <span className="text-sm text-yellow-400">Modified</span>
                    </div>
                    <div className="bg-[#1e293b] rounded-lg p-3 flex flex-col items-center justify-center">
                      <span className="text-blue-300 text-2xl font-bold">
                        {diffStats.unchanged}
                      </span>
                      <span className="text-sm text-blue-400">Unchanged</span>
                    </div>
                  </div>
                )}

                {/* Results display with improved styling */}
                <div
                  className={`${colors.resultsBg} rounded-lg border ${colors.border} p-4`}
                >
                  {differences.length === 0 ? (
                    <div className="text-center py-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-green-500 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p className="text-lg font-medium text-green-400">
                        The texts are identical
                      </p>
                      <p className="text-gray-400 mt-2">
                        No differences were found between the two text inputs.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 font-mono text-sm">
                      {differences.map((item, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            item.type === "unchanged"
                              ? colors.unchanged
                              : item.type === "added"
                                ? colors.added
                                : item.type === "removed"
                                  ? colors.removed
                                  : "bg-transparent"
                          } ${
                            item.type !== "modified" ? "rounded px-2 py-1" : ""
                          }`}
                        >
                          {item.type !== "modified" && (
                            <div className="mr-3 text-gray-500 w-8 flex-shrink-0 text-right">
                              {item.lineNumber}
                            </div>
                          )}
                          <div className="flex-grow">
                            {renderDiffContent(item)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextComparison;
