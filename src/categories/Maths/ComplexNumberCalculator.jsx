import { useState, useEffect, useRef } from "react";

export default function ComplexNumberCalculator({ theme = "light" }) {
  const [real1, setReal1] = useState("");
  const [imag1, setImag1] = useState("");
  const [real2, setReal2] = useState("");
  const [imag2, setImag2] = useState("");
  const [operation, setOperation] = useState("+");
  const [result, setResult] = useState({ real: 0, imag: 0 });
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [displayMode, setDisplayMode] = useState("rectangular");
  const [precision, setPrecision] = useState(4);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const calculatorRef = useRef(null);
  const real1Ref = useRef(null);

  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("complexCalcHistory");
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage:", e);
    } finally {
      setHistoryLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!historyLoaded) return;
    try {
      localStorage.setItem("complexCalcHistory", JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage:", e);
      showToastNotification("Could not save history to local storage", "error");
    }
  }, [history, historyLoaded]);

  // Auto-hide error message
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Add keyboard shortcut for calculation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        calculate();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [real1, imag1, real2, imag2, operation]);

  // Set focus to the first input on initial load
  useEffect(() => {
    if (real1Ref.current) {
      real1Ref.current.focus();
    }
  }, []);

  // Theme styles with improved color schemes and modern UI
  const themeStyles = {
    dark: {
      bg: "bg-[#0e0e0e]",
      text: "text-gray-100",
      input:
        "bg-[#121212] text-gray-200 border-[#2a2a2a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      button:
        "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md",
      select:
        "bg-[#121212] text-gray-200 border-[#2a2a2a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      card: "bg-[#121212] border-[#2a2a2a] shadow-xl",
      historyItem: "bg-[#1a1a1a] hover:bg-[#252525]",
      tab: "bg-[#1a1a1a] hover:bg-[#252525]",
      activeTab: "bg-blue-600 text-white shadow-md",
      error: "text-red-300 bg-red-900/20 border border-red-800/50",
      success: "text-green-300 bg-green-900/20 border border-green-800/50",
      info: "text-blue-300 bg-blue-900/20 border border-blue-800/50",
      secondary:
        "bg-[#2a2a2a] hover:bg-[#353535] active:bg-[#404040] text-gray-200 shadow",
      actionButton:
        "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md",
      accent: "text-blue-400",
      toast: {
        error: "bg-[#2c1215] border-l-4 border-red-500 text-red-200",
        success: "bg-[#1a2c1a] border-l-4 border-green-500 text-green-200",
        info: "bg-[#1a222c] border-l-4 border-blue-500 text-blue-200",
      },
      alternativeFormat: "bg-[#1a1a1a] bg-opacity-80",
    },
    light: {
      bg: "bg-gray-50",
      text: "text-gray-900",
      input:
        "bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      button:
        "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-md",
      select:
        "bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      card: "bg-white border-gray-200 shadow-lg",
      historyItem: "bg-gray-100 hover:bg-gray-200",
      tab: "bg-gray-200 hover:bg-gray-300",
      activeTab: "bg-blue-500 text-white shadow-md",
      error: "text-red-600 bg-red-100 border border-red-300",
      success: "text-green-600 bg-green-100 border border-green-300",
      info: "text-blue-600 bg-blue-100 border border-blue-300",
      secondary:
        "bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 shadow",
      actionButton:
        "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white shadow-md",
      accent: "text-blue-600",
      toast: {
        error: "bg-red-100 border-l-4 border-red-500 text-red-700",
        success: "bg-green-100 border-l-4 border-green-500 text-green-700",
        info: "bg-blue-100 border-l-4 border-blue-500 text-blue-700",
      },
      alternativeFormat: "bg-blue-50",
    },
  };

  const styles = themeStyles[theme];

  const showToastNotification = (message, type = "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const calculate = () => {
    setError("");

    // Input validation
    if (
      needsSecondNumber &&
      ((real1 === "" && imag1 === "") || (real2 === "" && imag2 === ""))
    ) {
      setError("Please enter complex numbers for calculation");
      return;
    }

    if (!needsSecondNumber && real1 === "" && imag1 === "") {
      setError("Please enter a complex number for calculation");
      return;
    }

    // Convert inputs to numbers
    const a = parseFloat(real1) || 0;
    const b = parseFloat(imag1) || 0;
    const c = parseFloat(real2) || 0;
    const d = parseFloat(imag2) || 0;

    let resultReal = 0;
    let resultImag = 0;

    try {
      switch (operation) {
        case "+":
          resultReal = a + c;
          resultImag = b + d;
          break;
        case "-":
          resultReal = a - c;
          resultImag = b - d;
          break;
        case "*":
          resultReal = a * c - b * d;
          resultImag = a * d + b * c;
          break;
        case "/":
          const denominator = c * c + d * d;
          if (denominator === 0 || isNaN(denominator)) {
            throw new Error("Division by zero is undefined");
          }
          resultReal = (a * c + b * d) / denominator;
          resultImag = (b * c - a * d) / denominator;

          // Check for NaN results
          if (isNaN(resultReal) || isNaN(resultImag)) {
            throw new Error("Invalid division operation");
          }
          break;
        case "abs":
          resultReal = Math.sqrt(a * a + b * b);
          resultImag = 0;
          break;
        case "conj":
          resultReal = a;
          resultImag = -b;
          break;
        case "pow":
          if (a === 0 && b === 0) {
            throw new Error("0^z is undefined for z ≠ 0");
          }

          // Special case for real powers
          if (d === 0) {
            const r = Math.sqrt(a * a + b * b);
            const theta = Math.atan2(b, a);

            const newR = Math.pow(r, c);
            const newTheta = theta * c;

            resultReal = newR * Math.cos(newTheta);
            resultImag = newR * Math.sin(newTheta);
          } else {
            // DeMoivre's formula for complex powers
            const rA = Math.sqrt(a * a + b * b);
            const thetaA = Math.atan2(b, a);

            const lnRA = Math.log(rA);
            const newR = Math.exp(lnRA * c - thetaA * d);
            const newTheta = lnRA * d + thetaA * c;

            resultReal = newR * Math.cos(newTheta);
            resultImag = newR * Math.sin(newTheta);
          }
          break;
        case "sqrt":
          const r = Math.sqrt(a * a + b * b);
          const theta = Math.atan2(b, a);
          const newR = Math.sqrt(r);
          const newTheta = theta / 2;

          resultReal = newR * Math.cos(newTheta);
          resultImag = newR * Math.sin(newTheta);
          break;
        case "exp":
          const exp_a = Math.exp(a);
          resultReal = exp_a * Math.cos(b);
          resultImag = exp_a * Math.sin(b);
          break;
        case "log":
          if (a === 0 && b === 0) {
            throw new Error("ln(0) is undefined");
          }
          resultReal = Math.log(Math.sqrt(a * a + b * b));
          resultImag = Math.atan2(b, a);
          break;
        case "inverse":
          const denom = a * a + b * b;
          if (denom === 0) {
            throw new Error("Inverse of 0 is undefined");
          }
          resultReal = a / denom;
          resultImag = -b / denom;
          break;
        case "arg":
          if (a === 0 && b === 0) {
            throw new Error("Argument of 0 is undefined");
          }
          resultReal = Math.atan2(b, a);
          resultImag = 0;
          break;
      }

      // Round to specified decimal places
      const factor = Math.pow(10, precision);
      resultReal = Math.round(resultReal * factor) / factor;
      resultImag = Math.round(resultImag * factor) / factor;

      const newResult = { real: resultReal, imag: resultImag };
      setResult(newResult);

      // Create new history item
      const historyItem = {
        z1: formatComplex(a, b),
        z2: formatComplex(c, d),
        op: operation,
        result: newResult,
        timestamp: new Date().toISOString(),
      };

      // Check if this result already exists in history
      const isDuplicate = history.some(
        (item) =>
          item.op === operation &&
          item.result.real === newResult.real &&
          item.result.imag === newResult.imag &&
          item.z1 === formatComplex(a, b) &&
          (needsSecondNumber ? item.z2 === formatComplex(c, d) : true)
      );

      // Only add to history if not a duplicate
      if (!isDuplicate) {
        setHistory((prev) => [historyItem, ...prev].slice(0, 20));
      }

      setShowResult(true);
    } catch (err) {
      setError(err.message);
      showToastNotification(err.message, "error");
    }
  };

  const formatComplex = (real, imag, mode = displayMode) => {
    // Handle zero case
    if (real === 0 && imag === 0) return "0";

    real = parseFloat(real);
    imag = parseFloat(imag);

    // Choose formatting based on display mode
    switch (mode) {
      case "rectangular":
        if (imag === 0) return real.toFixed(precision);
        if (real === 0)
          return imag === 1
            ? "i"
            : imag === -1
              ? "-i"
              : `${imag.toFixed(precision)}i`;
        const sign = imag > 0 ? "+" : "";
        const imagPart =
          imag === 1 ? "i" : imag === -1 ? "-i" : `${imag.toFixed(precision)}i`;
        return `${real.toFixed(precision)}${sign}${imagPart}`;

      case "polar":
        const r = Math.sqrt(real * real + imag * imag);
        let theta = Math.atan2(imag, real);
        theta = (theta * 180) / Math.PI; // Convert to degrees
        return `${r.toFixed(precision)} ∠ ${theta.toFixed(precision)}°`;

      case "exponential": {
        const radius = Math.sqrt(real * real + imag * imag);
        const angle = Math.atan2(imag, real);
        return (
          <>
            {radius.toFixed(precision)} e
            <sup> i ({angle.toFixed(precision)})</sup>
          </>
        );
      }

      default:
        return `${real.toFixed(precision)}${imag >= 0 ? "+" : ""}${imag.toFixed(precision)}i`;
    }
  };

  const needsSecondNumber = ![
    "abs",
    "conj",
    "sqrt",
    "exp",
    "log",
    "inverse",
    "arg",
  ].includes(operation);

  const toggleHistoryView = () => {
    setShowHistory(!showHistory);
  };

  const useHistoryItem = (item) => {
    setReal1(item.result.real.toString());
    setImag1(item.result.imag.toString());
    setShowHistory(false);
  };

  const deleteHistoryItem = (index, e) => {
    e.stopPropagation(); // Prevent triggering the useHistoryItem
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const clearCalculator = () => {
    setReal1("");
    setImag1("");
    setReal2("");
    setImag2("");
    setShowResult(false);
    setError("");

    // Focus the first input after clearing
    if (real1Ref.current) {
      real1Ref.current.focus();
    }
  };

  // Helper function to get operation symbol
  const getOperationSymbol = (op) => {
    const symbols = {
      "+": "+",
      "-": "-",
      "*": "×",
      "/": "÷",
      pow: "^",
    };
    return symbols[op] || op;
  };

  // Helper function to get operation name
  const getOperationName = (op) => {
    const names = {
      abs: "abs",
      conj: "conj",
      sqrt: "√",
      exp: "exp",
      log: "ln",
      inverse: "1/",
      arg: "arg",
    };
    return names[op] || op;
  };

  return (
    <div
      className={`${styles.bg} ${styles.text} min-h-screen w-full flex flex-col items-center justify-start pt-20 sm:pt-24 pb-8 px-4 sm:px-6`}
      ref={calculatorRef}
    >
      <div
        className={`w-full max-w-7xl ${!showResult && !showHistory ? "flex justify-center" : ""}`}
      >
        {/* Responsive layout that adapts to different screen sizes */}
        <div
          className={`flex flex-col xl:flex-row gap-6 ${!showResult && !showHistory ? "w-full xl:max-w-lg" : "w-full"}`}
        >
          {/* Main Calculator Panel */}
          <div
            className={`w-full ${showResult || showHistory ? "xl:w-2/3" : ""} ${styles.card} border rounded-xl p-4 md:p-6 shadow-lg mb-6 xl:mb-0 transition-all duration-300`}
          >
            <h1 className="text-2xl font-bold mb-6 text-center">
              Complex Number Calculator
            </h1>

            {/* Display Mode Selector */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-sm">
                Display Format
              </label>
              <div className="flex mb-2 text-sm">
                {["rectangular", "polar", "exponential"].map((mode) => (
                  <button
                    key={mode}
                    className={`flex-1 py-2 px-3 ${
                      mode === "rectangular"
                        ? "rounded-l-lg"
                        : mode === "exponential"
                          ? "rounded-r-lg"
                          : ""
                    } ${
                      displayMode === mode ? styles.activeTab : styles.tab
                    } transition-colors duration-200`}
                    onClick={() => setDisplayMode(mode)}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Precision Selector */}
            <div className="mb-5 xl:mb-0 flex flex-col xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center mb-2 xl:mb-0">
                <label className="font-medium text-sm">Precision</label>
              </div>

              <div className="flex items-center w-full xl:w-9/12">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={precision}
                  onChange={(e) => setPrecision(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <span className="ml-2 text-sm font-medium px-2 py-1 rounded bg-opacity-20 bg-blue-500">
                  {precision}
                </span>
              </div>
            </div>

            {/* First Complex Number */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-sm">
                First Complex Number (z₁)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-1/2">
                  <input
                    type="number"
                    placeholder="Real part"
                    className={`w-full p-3 rounded-lg border ${styles.input} transition-colors`}
                    value={real1}
                    onChange={(e) => setReal1(e.target.value)}
                    ref={real1Ref}
                  />
                </div>
                <div className="flex w-full sm:w-1/2">
                  <input
                    type="number"
                    placeholder="Imaginary"
                    className={`w-full rounded-l-lg border-y border-l ${styles.input} transition-colors p-3`}
                    value={imag1}
                    onChange={(e) => setImag1(e.target.value)}
                  />
                  <span
                    className={`inline-flex items-center px-3 rounded-r-lg border-y border-r ${styles.input} transition-colors min-w-8 justify-center`}
                  >
                    i
                  </span>
                </div>
              </div>
            </div>

            {/* Operation Selector */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-sm">
                Operation
              </label>
              <select
                className={`w-full p-3 rounded-lg border ${styles.select} transition-colors`}
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
              >
                <optgroup label="Basic Operations">
                  <option value="+">Addition (z₁ + z₂)</option>
                  <option value="-">Subtraction (z₁ - z₂)</option>
                  <option value="*">Multiplication (z₁ × z₂)</option>
                  <option value="/">Division (z₁ ÷ z₂)</option>
                  <option value="pow">Power (z₁^z₂)</option>
                  <option value="inverse">Inverse (1/z₁)</option>
                </optgroup>
                <optgroup label="Single Number Operations">
                  <option value="abs">Absolute Value (|z₁|)</option>
                  <option value="arg">Argument (arg z₁)</option>
                  <option value="conj">Conjugate (z₁*)</option>
                  <option value="sqrt">Square Root (√z₁)</option>
                  <option value="exp">Exponential (e^z₁)</option>
                  <option value="log">Natural Logarithm (ln z₁)</option>
                </optgroup>
              </select>
            </div>

            {/* Second Complex Number (Conditionally shown) */}
            {needsSecondNumber && (
              <div className="mb-5">
                <label className="block mb-2 font-medium text-sm">
                  Second Complex Number (z₂)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="w-full sm:w-1/2">
                    <input
                      type="number"
                      placeholder="Real part"
                      className={`w-full p-3 rounded-lg border ${styles.input} transition-colors`}
                      value={real2}
                      onChange={(e) => setReal2(e.target.value)}
                    />
                  </div>
                  <div className="flex w-full sm:w-1/2">
                    <input
                      type="number"
                      placeholder="Imaginary"
                      className={`w-full rounded-l-lg border-y border-l ${styles.input} transition-colors p-3`}
                      value={imag2}
                      onChange={(e) => setImag2(e.target.value)}
                    />
                    <span
                      className={`inline-flex items-center px-3 rounded-r-lg border-y border-r ${styles.input} transition-colors min-w-8 justify-center`}
                    >
                      i
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div
                className={`p-3 rounded-lg mb-4 ${styles.error} transition-all`}
              >
                <p className="font-medium text-sm">Error: {error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                className={`sm:col-span-2 py-3 px-4 rounded-lg font-medium ${styles.actionButton} transition-colors text-base`}
                onClick={calculate}
              >
                Calculate (Ctrl+Enter)
              </button>
              <button
                className={`py-3 px-4 rounded-lg font-medium ${styles.secondary} transition-colors`}
                onClick={clearCalculator}
              >
                Clear
              </button>
              <button
                className={`py-3 px-4 rounded-lg font-medium ${styles.secondary} transition-colors`}
                onClick={toggleHistoryView}
              >
                {showHistory ? "Hide History" : "History"}
              </button>
              {showHistory && history.length > 0 && (
                <button
                  className="sm:col-span-2 py-2 px-4 mt-2 rounded-lg font-medium text-red-500 border border-red-500 hover:bg-red-500/20 hover:text-white transition-all"
                  onClick={clearHistory}
                >
                  Clear History
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 text-xs text-center opacity-75">
              <p>
                Press Ctrl+Enter to quickly calculate • History is saved locally
              </p>
            </div>
          </div>

          {/* Result and History Panel */}
          {(showResult || showHistory) && (
            <div className="w-full text-center  overflow-auto xl:w-1/2 flex flex-col gap-6">
              {/* Result */}
              {showResult && (
                <div
                  className={`${styles.card} border rounded-xl p-4 md:p-6 shadow-lg transition-all duration-300`}
                >
                  <h2 className="text-xl font-semibold mb-4">Result</h2>
                  <div
                    className={`p-4 rounded-lg border ${theme === "dark" ? "border-[#2a2a2a]" : "border-gray-200"} transition-colors mb-4 overflow-x-auto`}
                  >
                    <div className="text-xl font-medium break-all">
                      {formatComplex(result.real, result.imag)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-70">
                      Alternative formats
                    </div>
                    <div
                      className={`p-4 text-start rounded-lg ${styles.alternativeFormat} overflow-x-auto`}
                    >
                      {["rectangular", "polar", "exponential"].map((format) => (
                        <div
                          key={format}
                          className="text-sm mb-1 flex flex-wrap gap-1"
                        >
                          <span
                            className={`font-medium ${styles.accent} min-w-20`}
                          >
                            {format.charAt(0).toUpperCase() + format.slice(1)}:
                          </span>
                          <span className="break-all">
                            {formatComplex(result.real, result.imag, format)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* History */}
              {showHistory && (
                <div
                  className={`${styles.card} border rounded-xl p-4 md:p-6 shadow-lg transition-all duration-300`}
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Calculation History
                  </h2>
                  {history.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto rounded-lg border border-[#2a2a2a]">
                      {history.map((item, index) => {
                        const date = new Date(item.timestamp);
                        const formattedTime = date.toLocaleTimeString();
                        return (
                          <div
                            key={index}
                            className={`p-4 ${index !== history.length - 1 ? (theme === "dark" ? "border-b border-[#2a2a2a]" : "border-b border-gray-200") : ""} ${styles.historyItem} cursor-pointer hover:opacity-80 transition-colors`}
                            onClick={() => useHistoryItem(item)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="overflow-hidden flex-grow mr-2">
                                <span className="text-xs opacity-75">
                                  {formattedTime}
                                </span>
                                <div className="font-medium break-all">
                                  <span className="block sm:hidden">
                                    {item.z2
                                      ? `${item.z1} ${getOperationSymbol(item.op)} ${item.z2} = ${formatComplex(item.result.real, item.result.imag)}`
                                      : `${getOperationName(item.op)}(${item.z1}) = ${formatComplex(item.result.real, item.result.imag)}`}
                                  </span>
                                  <span className="hidden sm:block">
                                    {item.z2
                                      ? `${item.z1} ${getOperationSymbol(item.op)} ${item.z2} = ${formatComplex(item.result.real, item.result.imag)}`
                                      : `${getOperationName(item.op)}(${item.z1}) = ${formatComplex(item.result.real, item.result.imag)}`}
                                  </span>
                                </div>
                              </div>
                              <button
                                className="ml-2 p-2 rounded-full hover:bg-opacity-20 hover:bg-red-500 transition-colors flex-shrink-0"
                                onClick={(e) => deleteHistoryItem(index, e)}
                                aria-label="Delete history item"
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-6 opacity-70">
                      <p>No calculations in history</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 min-w-[300px] max-w-sm rounded-lg shadow-lg ${styles.toast[toastType]} transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{toastMessage}</div>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
