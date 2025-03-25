import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaExchangeAlt, FaCopy } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BaseConverter = ({ theme }) => {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState("binary");
  const [toBase, setToBase] = useState("decimal");
  const [customFromBase, setCustomFromBase] = useState("");
  const [customToBase, setCustomToBase] = useState("");
  const [output, setOutput] = useState("");
  const [solutionSteps, setSolutionSteps] = useState([]);

  const baseTheme = {
    container: "max-w-2xl w-11/12 flex items-center pt-2",
    card: "w-11/12 mx-auto mt-20 my-10 p-8 rounded-2xl shadow-lg",
    header: "text-4xl font-bold mb-8 text-center",
    fieldLabel: "block text-sm font-medium mb-1",
    input: "w-full p-3 rounded-lg border focus:ring-2",
    select: "w-full p-3 rounded-lg border focus:ring-2",
    button: "w-full py-3 px-6 rounded-lg font-semibold shadow-md transition-all",
    swapButton: "p-2 rounded-full transition mx-2",
    outputCard: "mt-4 p-3 rounded-lg border flex items-center justify-between",
    outputText: "text-xl font-bold",
    copyIcon: "cursor-pointer transition",
    solutionCard: "mt-4 p-6 rounded-lg shadow-md",
    solutionHeader: "text-4xl font-bold mb-4 text-center",
    stepTitle: "text-lg font-bold",
    solutionText: "text-sm leading-relaxed",
    highlight: "font-semibold"
  };
  
  const darkTheme = {
    ...baseTheme,
    container: `${baseTheme.container} bg-black`,
    card: `${baseTheme.card} bg-[#121212] text-white`,
    fieldLabel: `${baseTheme.fieldLabel} text-gray-400`,
    input: `${baseTheme.input} bg-gray-800 border-gray-600 focus:ring-blue-500`,
    select: `${baseTheme.select} bg-gray-800 border-gray-600 focus:ring-blue-500`,
    button: `${baseTheme.button} bg-blue-600 hover:bg-blue-500`,
    swapButton: `${baseTheme.swapButton} bg-blue-500 text-white hover:bg-blue-600`,
    outputCard: `${baseTheme.outputCard} bg-gray-800 border-gray-600`,
    outputText: `${baseTheme.outputText} text-green-400`,
    copyIcon: `${baseTheme.copyIcon} text-gray-400 hover:text-blue-400`,
    solutionCard: `${baseTheme.solutionCard} bg-gray-800`,
    stepTitle: `${baseTheme.stepTitle} text-blue-400`,
    solutionText: `${baseTheme.solutionText} text-white`,
    highlight: `${baseTheme.highlight} text-yellow-300`
  };
  
  const lightTheme = {
    ...baseTheme,
    container: `${baseTheme.container} bg-gray-100`,
    card: `${baseTheme.card} bg-white text-black`,
    fieldLabel: `${baseTheme.fieldLabel} text-gray-600`,
    input: `${baseTheme.input} bg-gray-100 border-gray-300 focus:ring-blue-400`,
    select: `${baseTheme.select} bg-gray-100 border-gray-300 focus:ring-blue-400`,
    button: `${baseTheme.button} bg-blue-500 hover:bg-blue-400 text-white`,
    swapButton: `${baseTheme.swapButton} bg-blue-500 text-white hover:bg-blue-600`,
    outputCard: `${baseTheme.outputCard} bg-gray-50 border-gray-300`,
    outputText: `${baseTheme.outputText} text-green-600`,
    copyIcon: `${baseTheme.copyIcon} text-gray-500 hover:text-blue-500`,
    solutionCard: `${baseTheme.solutionCard} bg-gray-50`,
    stepTitle: `${baseTheme.stepTitle} text-blue-600`,
    solutionText: `${baseTheme.solutionText} text-black`,
    highlight: `${baseTheme.highlight} text-yellow-500`
  };
  
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  // Helper function to get base value
  const getBaseValue = (base) => {
    switch (base) {
      case "binary":
        return 2;
      case "decimal":
        return 10;
      case "hexadecimal":
        return 16;
      case "octal":
        return 8;
      default:
        return NaN;
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Output copied to clipboard!");
  };

  // Function to convert between bases (including custom)
const convert = () => {
  try {
    // Check if input is empty OR (if binary) contains any non-binary characters.
    if (
      !input.trim() ||
      (fromBase === "binary" && /[^01]/.test(input))
    ) {
      toast.warn("Enter a valid value!");
      setOutput("");
      setSolutionSteps([]);
      return;
    }

    const fromBaseValue =
      fromBase === "custom" ? parseInt(customFromBase) : getBaseValue(fromBase);
    const toBaseValue =
      toBase === "custom" ? parseInt(customToBase) : getBaseValue(toBase);

    // Validate custom base range
    if (
      (fromBase === "custom" &&
        (fromBaseValue < 2 || fromBaseValue > 36)) ||
      (toBase === "custom" && (toBaseValue < 2 || toBaseValue > 36))
    ) {
      toast.error("Custom base must be between 2 and 36!");
      return;
    }

    // Convert input to decimal
    const decimalValue = parseInt(input, fromBaseValue);
    if (isNaN(decimalValue)) {
      toast.error("Invalid number for the selected base!");
      setSolutionSteps([]);
      return;
    }

    // Convert decimal to target base
    const result = decimalValue.toString(toBaseValue).toUpperCase();

    setOutput(result);
    toast.success("Conversion successful!");

    // Build detailed solution steps as an array
    const steps = [
      `Input value: ${input}`,
      `From base: ${
        fromBase === "custom" ? customFromBase : fromBase.toUpperCase()
      } (base ${
        fromBase === "custom" ? fromBaseValue : getBaseValue(fromBase)
      })`,
      `To base: ${
        toBase === "custom" ? customToBase : toBase.toUpperCase()
      } (base ${toBase === "custom" ? toBaseValue : getBaseValue(toBase)})`,
      `Decimal conversion: ${decimalValue}`,
      `Output in target base: ${result}`,
    ];
    setSolutionSteps(steps);
  } catch (error) {
    toast.error("Invalid conversion!");
    setOutput="";
  }
};

  // Swap bases
  const swapBases = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    setCustomFromBase(customToBase);
    setCustomToBase(customFromBase);
    setOutput("");
    setSolutionSteps([]);
  };

  return (
    <div className="flex min-h-screen justify-center items-center">
    <div className={`${currentTheme.container} mt-8`}>
      <div className="w-full">
        <ToastContainer />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={currentTheme.card}
        >
          <h1 className={currentTheme.header}>Base Converter</h1>

          {/* Input Field */}
          <div className="mb-4">
            <label className={currentTheme.fieldLabel}>Enter Value:</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter number..."
              className={currentTheme.input}
            />
          </div>

          {/* Base Selectors */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-1/2">
              <label className={currentTheme.fieldLabel}>From:</label>
              <select
                value={fromBase}
                onChange={(e) => setFromBase(e.target.value)}
                className={currentTheme.select}
              >
                <option value="binary">Binary</option>
                <option value="decimal">Decimal</option>
                <option value="hexadecimal">Hexadecimal</option>
                <option value="octal">Octal</option>
                <option value="custom">Custom</option>
              </select>
              {fromBase === "custom" && (
                <input
                  type="number"
                  placeholder="Enter base (2-36)"
                  value={customFromBase}
                  onChange={(e) => setCustomFromBase(e.target.value)}
                  className={`${currentTheme.input} mt-2`}
                />
              )}
            </div>

            <button onClick={swapBases} className={currentTheme.swapButton}>
              <FaExchangeAlt />
            </button>

            <div className="w-1/2">
              <label className={currentTheme.fieldLabel}>To:</label>
              <select
                value={toBase}
                onChange={(e) => setToBase(e.target.value)}
                className={currentTheme.select}
              >
                <option value="binary">Binary</option>
                <option value="decimal">Decimal</option>
                <option value="hexadecimal">Hexadecimal</option>
                <option value="octal">Octal</option>
                <option value="custom">Custom</option>
              </select>
              {toBase === "custom" && (
                <input
                  type="number"
                  placeholder="Enter base (2-36)"
                  value={customToBase}
                  onChange={(e) => setCustomToBase(e.target.value)}
                  className={`${currentTheme.input} mt-2`}
                />
              )}
            </div>
          </div>

          {/* Convert Button */}
          <button onClick={convert} className={currentTheme.button}>
            Convert
          </button>

          {/* Output Display with Copy Icon */}
          {output && (
            <div className="mt-4">
              <div className={currentTheme.outputCard}>
                <h2 className="text-xl font-bold">
                  Output:
                  <p className={currentTheme.outputText}>{output}</p>
                </h2>
                <FaCopy
                  className={currentTheme.copyIcon}
                  onClick={() => copyToClipboard(output)}
                />
              </div>
            </div>
          )}

          {/* Detailed Solution Display with color-coded numeric values */}
          {solutionSteps.length > 0 && (
            <div className={currentTheme.solutionCard}>
              <h3 className={currentTheme.solutionHeader}>
                Detailed Conversion Steps:
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {solutionSteps.map((step, idx) => {
                  // Wrap all numeric values with a span using the highlight style
                  const processedStep = step.replace(
                    /(\d+)/g,
                    `<span class="${currentTheme.highlight}">$1</span>`
                  );
                  return (
                    <li
                      key={idx}
                      dangerouslySetInnerHTML={{
                        __html: `<span class="${currentTheme.stepTitle}">Step ${idx + 1}:</span> <span class="${currentTheme.solutionText}">${processedStep}</span>`
                      }}
                    />
                  );
                })}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
    </div>
  );
};

export default BaseConverter;
