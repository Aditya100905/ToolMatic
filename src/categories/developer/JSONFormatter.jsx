import { useState, useRef, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialOceanic,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../../ThemeProvider";
import { toast } from "react-toastify";

const detectFileType = (code) => {
  if (!code.trim()) return "Empty";

  // Try to parse as JSON
  try {
    JSON.parse(code);
    return "JSON";
  } catch (e) {
    // Check if it might be YAML
    if (code.includes(":") && !code.includes("{") && !code.includes("[")) {
      return "YAML";
    }

    // Check if it might be XML/HTML
    if (code.includes("<") && code.includes(">")) {
      return "XML/HTML";
    }

    // Check if it might be CSV
    if (code.includes(",") && code.split("\n").length > 1) {
      return "CSV";
    }

    return "Unknown";
  }
};

export default function JSONFormatter() {
  const { theme, toggleTheme } = useTheme();
  const [inputJSON, setInputJSON] = useState("");
  const [outputJSON, setOutputJSON] = useState("");
  const [fileName, setFileName] = useState("formatted.json");
  const [warning, setWarning] = useState({ show: false, type: "" });
  const [indentation, setIndentation] = useState(2);
  const [compactMode, setCompactMode] = useState(false);
  const [sortKeys, setSortKeys] = useState(false);
  const downloadLink = useRef(null);
  const [fileType, setFileType] = useState("Empty");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) toggleTheme(savedTheme);

    // Try to load from local storage
    const savedInput = localStorage.getItem("jsonFormatterInput");
    if (savedInput) setInputJSON(savedInput);
  }, []);

  useEffect(() => {
    // Detect file type when input changes
    const detected = detectFileType(inputJSON);
    setFileType(detected);
    setWarning({
      show: detected !== "JSON" && detected !== "Empty",
      type: detected,
    });

    // Save to local storage
    localStorage.setItem("jsonFormatterInput", inputJSON);
  }, [inputJSON]);

  const formatJSON = (json, indentSpaces, sort, compact) => {
    try {
      const parsed = JSON.parse(json);

      // Sort keys if requested
      const processedObj = sort ? sortObjectKeys(parsed) : parsed;

      // Format with specified spacing
      if (compact) {
        return JSON.stringify(processedObj);
      } else {
        return JSON.stringify(processedObj, null, indentSpaces);
      }
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  };

  const sortObjectKeys = (obj) => {
    // If it's not an object or is null, return as is
    if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
      return obj;
    }

    // Create a new sorted object
    const sortedObj = {};
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sortedObj[key] = sortObjectKeys(obj[key]);
      });

    return sortedObj;
  };

  const handleBeautify = () => {
    try {
      const formattedJSON = formatJSON(
        inputJSON,
        indentation,
        sortKeys,
        compactMode
      );
      setOutputJSON(formattedJSON);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCodeChange = (e) => {
    const newInput = e.target.value;
    setInputJSON(newInput);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputJSON);
    } catch (error) {
      toast.error("Failed to copy!");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([outputJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    downloadLink.current.href = url;
    downloadLink.current.download = fileName.endsWith(".json")
      ? fileName
      : `${fileName}.json`;
    downloadLink.current.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInputJSON("");
    setOutputJSON("");
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setInputJSON(clipboardText);
    } catch (error) {
      toast.error("Failed to paste from clipboard!");
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(inputJSON);
      setOutputJSON(JSON.stringify(parsed));
    } catch (error) {
      toast.error("Invalid JSON format.");
    }
  };

  const getFileTypeIndicator = () => {
    const colors = {
      JSON: "bg-green-500",
      YAML: "bg-yellow-500",
      "XML/HTML": "bg-purple-500",
      CSV: "bg-blue-500",
      Unknown: "bg-red-500",
      Empty: "bg-gray-500",
    };

    return (
      <div className="flex items-center gap-2 mt-2 mb-4">
        <div
          className={`w-3 h-3 rounded-full ${colors[fileType] || "bg-gray-500"}`}
        ></div>
        <span className="text-sm">
          {fileType === "JSON"
            ? "Valid JSON detected"
            : fileType === "Empty"
              ? "Input is empty"
              : `Warning: Input appears to be ${fileType}`}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4 pt-24 pb-10 
        ${theme === "dark" ? "bg-[#0e0e0e] text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <div
        className={`w-full max-w-4xl p-8 rounded-2xl shadow-xl
        ${theme === "dark" ? "bg-[#121212]" : "bg-white"}`}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          JSON Formatter & Validator
        </h2>

        {/* Input Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* File Name Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Output Filename
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 
                ${theme === "dark" ? "bg-[#1e1e1e] border-gray-700" : "bg-gray-50 border-gray-300"}`}
              placeholder="e.g., formatted.json"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>

          {/* Indentation Options */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Indent Size
            </label>
            <select
              value={indentation}
              onChange={(e) => setIndentation(parseInt(e.target.value))}
              className={`p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 
                ${theme === "dark" ? "bg-[#1e1e1e] border-gray-700" : "bg-gray-50 border-gray-300"}`}
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>
        </div>

        {/* Format Options */}
        <div className="flex gap-6 mb-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={() => setSortKeys(!sortKeys)}
              className="accent-blue-500 cursor-pointer"
            />
            Sort Keys
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={compactMode}
              onChange={() => setCompactMode(!compactMode)}
              className="accent-blue-500 cursor-pointer"
            />
            Compact Mode
          </label>
        </div>

        {getFileTypeIndicator()}

        {/* Code Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Input JSON</label>
          <div className="relative">
            <textarea
              className={`w-full p-4 rounded-lg h-60 font-mono resize-none border focus:outline-none focus:ring-2 focus:ring-blue-400 
                ${theme === "dark" ? "bg-[#1e1e1e] border-gray-700" : "bg-gray-50 border-gray-300"}`}
              placeholder="Paste or type your JSON here..."
              value={inputJSON}
              onChange={handleCodeChange}
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={handlePaste}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
                title="Paste from clipboard"
              >
                Paste
              </button>
              <button
                onClick={handleClear}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
                title="Clear input"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg transition"
            onClick={handleBeautify}
          >
            Format
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg transition"
            onClick={handleMinify}
          >
            Minify
          </button>
          {outputJSON && (
            <>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-lg transition"
                onClick={handleCopy}
              >
                Copy
              </button>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-lg transition"
                onClick={handleDownload}
              >
                Download
              </button>
            </>
          )}
        </div>

        {/* Hidden Download Link */}
        <a ref={downloadLink} style={{ display: "none" }} />

        {/* Output JSON */}
        {outputJSON && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Formatted Output
            </label>
            <div
              className={`rounded-lg border p-4 overflow-auto 
              ${theme === "dark" ? "border-gray-700 bg-[#1e1e1e]" : "border-gray-300 bg-gray-50"}`}
            >
              <SyntaxHighlighter
                language="json"
                style={theme === "dark" ? materialOceanic : prism}
                customStyle={{
                  background: "transparent",
                  margin: 0,
                  padding: 0,
                }}
                codeTagProps={{
                  style: { background: "transparent" },
                }}
                wrapLongLines={true}
              >
                {outputJSON}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
