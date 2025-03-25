import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaExchangeAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BaseConverter = ({ theme }) => {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState("binary");
  const [toBase, setToBase] = useState("decimal");
  const [customFromBase, setCustomFromBase] = useState("");
  const [customToBase, setCustomToBase] = useState("");
  const [output, setOutput] = useState("");

  // Function to convert between bases (including custom)
  const convert = () => {
    try {
      if (!input.trim()) {
        toast.warn("Enter a valid value!");
        setOutput("");
        return;
      }

      let fromBaseValue = fromBase === "custom" ? parseInt(customFromBase) : getBaseValue(fromBase);
      let toBaseValue = toBase === "custom" ? parseInt(customToBase) : getBaseValue(toBase);

      // Validate custom base range
      if (
        (fromBase === "custom" && (fromBaseValue < 2 || fromBaseValue > 36)) ||
        (toBase === "custom" && (toBaseValue < 2 || toBaseValue > 36))
      ) {
        toast.error("Custom base must be between 2 and 36!");
        return;
      }

      // Convert input to decimal
      let decimalValue = parseInt(input, fromBaseValue);

      if (isNaN(decimalValue)) {
        toast.error("Invalid number for the selected base!");
        return;
      }

      // Convert decimal to target base
      let result = decimalValue.toString(toBaseValue).toUpperCase();

      setOutput(result);
      toast.success("Conversion successful!");
    } catch (error) {
      toast.error("Invalid conversion!");
    }
  };

  // Helper function to get base value
  const getBaseValue = (base) => {
    switch (base) {
      case "binary": return 2;
      case "decimal": return 10;
      case "hexadecimal": return 16;
      case "octal": return 8;
      default: return NaN;
    }
  };

  // Swap bases
  const swapBases = () => {
    setFromBase(toBase);
    setToBase(fromBase);
    setCustomFromBase(customToBase);
    setCustomToBase(customFromBase);
    setOutput("");
  };

  return (
    <div className={`${theme === "dark" ? "bg-[#121212] text-white" : "bg-gray-100 text-black"} min-h-screen p-4 mt-16`}>
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-lg mx-auto rounded-lg shadow-lg p-6 ${theme === "dark" ? "bg-[#1E1E1E] text-white" : "bg-white text-black"}`}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Base Converter</h1>

        {/* Input Field */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Enter Value:</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter number..."
            className={`w-full p-2 border rounded ${theme === "dark" ? "bg-[#1E1E1E] text-white border-gray-700" : "bg-white text-black border-gray-300"}`}
          />
        </div>

        {/* Base Selectors */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-1/2">
            <label className="block text-sm mb-1">From:</label>
            <select
              value={fromBase}
              onChange={(e) => setFromBase(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none 
                ${theme === "dark" ? "bg-[#1E1E1E] text-white border-gray-700" : "bg-white text-black border-gray-300"}`}
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
                className={`w-full mt-2 p-2 border rounded ${theme === "dark" ? "bg-[#1E1E1E] text-white border-gray-700" : "bg-white text-black border-gray-300"}`}
              />
            )}
          </div>

          <button
            onClick={swapBases}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 mx-2 transition"
          >
            <FaExchangeAlt />
          </button>

          <div className="w-1/2">
            <label className="block text-sm mb-1">To:</label>
            <select
              value={toBase}
              onChange={(e) => setToBase(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none 
                ${theme === "dark" ? "bg-[#1E1E1E] text-white border-gray-700" : "bg-white text-black border-gray-300"}`}
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
                className={`w-full mt-2 p-2 border rounded ${theme === "dark" ? "bg-[#1E1E1E] text-white border-gray-700" : "bg-white text-black border-gray-300"}`}
              />
            )}
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={convert}
          className={`w-full p-3 rounded-md text-white bg-green-500 hover:bg-green-600 transition`}
        >
          Convert
        </button>

        {/* Output Display */}
        {output && (
          <div className={`mt-4 p-3 border rounded-lg ${theme === "dark" ? "bg-[#1E1E1E] text-white border-gray-700" : "bg-white text-black border-gray-300"}`}>
            <h2 className="text-lg font-semibold">Output:</h2>
            <p className="text-xl break-words">{output}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BaseConverter;
