
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBackspace } from "react-icons/fa";

// Mapping theme styles
const getThemeStyles = (theme) => ({
  container: theme === "dark" ? "bg-[#1a1a1a] text-white" : "bg-gray-100 text-black",
  display: theme === "dark" ? "bg-[#333] text-white" : "bg-white text-black",
  btn: theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-200",
  equals: "bg-blue-600 hover:bg-blue-500 text-white",
  clear: "bg-red-600 hover:bg-red-500 text-white",
});

const ScientificCalculator = ({ theme = "light" }) => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  const themeStyles = getThemeStyles(theme);

  // Handle button clicks
  const handleClick = (value) => {
    setExpression((prev) => prev + value);
  };

  // Evaluate the expression
  const calculate = () => {
    try {
      const sanitizedExpression = expression
        .replace(/π/g, Math.PI)
        .replace(/e/g, Math.E)
        .replace(/√/g, "Math.sqrt")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/\^/g, "**"); // Exponentiation

      const evalResult = eval(sanitizedExpression);
      setResult(evalResult);
    } catch (error) {
      toast.error("Invalid Expression!");
      setResult("");
    }
  };

  const clear = () => {
    setExpression("");
    setResult("");
  };

  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  return (
    <motion.div
      className={`min-h-screen p-6 flex justify-center items-center ${themeStyles.container}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
        <ToastContainer />

        {/* Display */}
        <div className={`p-4 rounded-md mb-4 ${themeStyles.display}`}>
          <div className="text-lg min-h-[2rem]">{expression || "0"}</div>
          <div className="text-2xl font-bold">{result || " "}</div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* Numbers */}
          {[7, 8, 9, "/", 4, 5, 6, "*", 1, 2, 3, "-", 0, ".", "π", "+"].map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn.toString())}
              className={`p-4 rounded ${themeStyles.btn} transition-all`}
            >
              {btn}
            </button>
          ))}

          {/* Scientific Functions */}
          {["sin(", "cos(", "tan(", "log(", "ln(", "√(", "e", "^"].map((func) => (
            <button
              key={func}
              onClick={() => handleClick(func)}
              className={`p-4 rounded ${themeStyles.btn} transition-all`}
            >
              {func}
            </button>
          ))}

          {/* Controls */}
          <button onClick={backspace} className={`p-4 rounded ${themeStyles.clear} transition-all`}>
            <FaBackspace />
          </button>
          <button onClick={clear} className={`p-4 rounded ${themeStyles.clear} transition-all`}>
            C
          </button>
          <button onClick={calculate} className={`p-4 rounded ${themeStyles.equals} transition-all col-span-2`}>
            =
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ScientificCalculator;
