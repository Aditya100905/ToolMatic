import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Complement = ({ theme = "dark" }) => {
  // Theme definitions using Tailwind CSS classes
  const darkTheme = {
    container:
      "max-w-2xl w-11/12 mx-auto mt-20 my-10 p-8 bg-[#121212] rounded-2xl shadow-lg text-white",
    input:
      "w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500",
    button:
      "w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold shadow-md transition-all",
    card: "p-6 bg-[#121212] rounded-lg shadow-md mt-6",
    header: "text-4xl font-bold mb-8 text-center",
    fieldLabel: "block text-sm font-medium mb-1 text-gray-400",
    outputText: `text-xl font-bold text-green-400`,

    result: "text-xl font-bold text-green-400",
    resultField:
      "flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600",
    copyIcon:
      "cursor-pointer text-gray-400 hover:text-blue-400 transition",
    stepTitle: "text-lg font-bold mb-2 text-blue-400",
    solutionText: "whitespace-pre-wrap text-sm leading-relaxed",
    highlight: "text-yellow-300 font-semibold",
  };

  const lightTheme = {
    container:
      "w-3xl mx-auto mt-20 my-10 p-8 bg-white rounded-2xl shadow-lg text-black",
    input:
      "w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400",
    button:
      "w-full py-3 px-6 bg-blue-500 hover:bg-blue-400 rounded-lg font-semibold shadow-md transition-all text-white",
    card: "p-6 bg-gray-50 rounded-lg shadow-md mt-6",
    header: "text-4xl font-bold mb-8 text-center",
    fieldLabel: "block text-sm font-medium mb-1 text-gray-600",
    outputText: `text-xl font-bold text-green-600`,

    result: "text-xl font-bold text-green-600",
    resultField:
      "flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-300",
    copyIcon:
      "cursor-pointer text-gray-500 hover:text-blue-500 transition",
    stepTitle: "text-lg font-bold mb-2 text-blue-600",
    solutionText: "whitespace-pre-wrap text-sm leading-relaxed",
    highlight: "text-yellow-500 font-semibold",
  };

  const styles = theme === "light" ? lightTheme : darkTheme;
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;


  // State variables
  const [number, setNumber] = useState(10);
  const [bitWidth, setBitWidth] = useState(8);
  const [complementType, setComplementType] = useState("1's");
  const [resultValue, setResultValue] = useState("");
  const [solution, setSolution] = useState("");

  // Toast notifications
  const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Helper functions for conversions
  const toBinary = (num, bits) => num.toString(2).padStart(bits, "0");
  const binaryToDecimal = (binary) => parseInt(binary, 2);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  const calculateSolution = () => {
    if (isNaN(number) || isNaN(bitWidth) || bitWidth <= 0) {
      showToast("Invalid input. Please enter valid values.");
      return;
    }

    let num = parseInt(number, 10);
    let bits = parseInt(bitWidth, 10);
    let stepsText = "";
    let finalResult = "";
    let displayResult = "";

    // Adjust bitWidth if necessary
    const minBits = num.toString(2).length;
    if (bits < minBits) {
      showToast(`Bit width increased to ${minBits} to fit the binary number.`, "info");
      bits = minBits;
    }

    if (complementType === "1's") {
      const binary = toBinary(num, bits);
      const onesComp = binary
        .split("")
        .map(bit => (bit === "0" ? "1" : "0"))
        .join("");
      finalResult = onesComp;

      stepsText += `<div class="${styles.stepTitle}">Step 1: Convert to Binary</div>`;
      stepsText += `Decimal: <span class="${styles.highlight}">${num}</span> → Binary: <span class="${styles.highlight}">${binary}</span>\n\n`;
      stepsText += `<div class="${styles.stepTitle}">Step 2: Invert the Bits (1's Complement)</div>`;
      stepsText += `Resulting Binary: <span class="${styles.highlight}">${onesComp}</span>\n\n`;
      
      // Back conversion: Binary to Decimal
      const convertedDecimal = binaryToDecimal(onesComp);
      stepsText += `<div class="${styles.stepTitle}">Step 3: Convert Back to Decimal</div>`;
      stepsText += `Binary: <span class="${styles.highlight}">${onesComp}</span> → Decimal: <span class="${styles.highlight}">${convertedDecimal}</span>\n`;
      
      displayResult = `${convertedDecimal} (${onesComp})`;
    } else if (complementType === "2's") {
      const binary = toBinary(num, bits);
      const onesComp = binary
        .split("")
        .map(bit => (bit === "0" ? "1" : "0"))
        .join("");
      const twosCompDecimal = binaryToDecimal(onesComp) + 1;
      const twosComp = toBinary(twosCompDecimal, bits);
      finalResult = twosComp;

      stepsText += `<div class="${styles.stepTitle}">Step 1: Convert to Binary</div>`;
      stepsText += `Decimal: <span class="${styles.highlight}">${num}</span> → Binary: <span class="${styles.highlight}">${binary}</span>\n\n`;
      stepsText += `<div class="${styles.stepTitle}">Step 2: Compute 1's Complement</div>`;
      stepsText += `Invert bits → <span class="${styles.highlight}">${onesComp}</span>\n\n`;
      stepsText += `<div class="${styles.stepTitle}">Step 3: Add 1 (2's Complement)</div>`;
      stepsText += `Resulting Binary: <span class="${styles.highlight}">${twosComp}</span>\n\n`;
      
      // Back conversion: Binary to Decimal
      const convertedDecimal = binaryToDecimal(twosComp);
      stepsText += `<div class="${styles.stepTitle}">Step 4: Convert Back to Decimal</div>`;
      stepsText += `Binary: <span class="${styles.highlight}">${twosComp}</span> → Decimal: <span class="${styles.highlight}">${convertedDecimal}</span>\n`;
      
      displayResult = `${convertedDecimal} (${twosComp})`;
    } else if (complementType === "9's") {
      const numStr = num.toString().padStart(bits, "0");
      let ninesComp = "";
      // Calculate 9's complement digit-by-digit
      for (let i = 0; i < numStr.length; i++) {
        const digit = parseInt(numStr[i], 10);
        ninesComp += (9 - digit).toString();
      }
      finalResult = ninesComp;

      stepsText += `<div class="${styles.stepTitle}">Step 1: Format the Number</div>`;
      stepsText += `Decimal: <span class="${styles.highlight}">${num}</span> → Padded: <span class="${styles.highlight}">${numStr}</span>\n\n`;
      stepsText += `<div class="${styles.stepTitle}">Step 2: Compute 9's Complement</div>`;
      stepsText += `Each digit subtracted from 9 → Result: <span class="${styles.highlight}">${ninesComp}</span>\n\n`;

      // Convert decimal result to binary
      const decValue = parseInt(ninesComp, 10);
      const binaryValue = decValue.toString(2);
      stepsText += `<div class="${styles.stepTitle}">Step 3: Convert Result to Binary</div>`;
      stepsText += `Decimal: <span class="${styles.highlight}">${ninesComp}</span> → Binary: <span class="${styles.highlight}">${binaryValue}</span>\n`;
      
      displayResult = `${ninesComp} (${binaryValue})`;
    } else if (complementType === "10's") {
      const numStr = num.toString().padStart(bits, "0");
      let ninesComp = "";
      // Calculate 9's complement digit-by-digit
      for (let i = 0; i < numStr.length; i++) {
        const digit = parseInt(numStr[i], 10);
        ninesComp += (9 - digit).toString();
      }
      // Add 1 to get 10's complement
      const tensComp = (parseInt(ninesComp, 10) + 1).toString().padStart(bits, "0");
      finalResult = tensComp;

      stepsText += `<div class="${styles.stepTitle}">Step 1: Format the Number</div>`;
      stepsText += `Decimal: <span class="${styles.highlight}">${num}</span> → Padded: <span class="${styles.highlight}">${numStr}</span>\n\n`;
      stepsText += `<div class="${styles.stepTitle}">Step 2: Compute 9's Complement</div>`;
      stepsText += `Each digit subtracted from 9 → Result: <span class="${styles.highlight}">${ninesComp}</span>\n\n`;
      stepsText += `<div class="${styles.stepTitle}">Step 3: Add 1 (10's Complement)</div>`;
      stepsText += `Resulting Decimal: <span class="${styles.highlight}">${tensComp}</span>\n\n`;
      
      // Convert decimal result to binary
      const decValue = parseInt(tensComp, 10);
      const binaryValue = decValue.toString(2);
      stepsText += `<div class="${styles.stepTitle}">Step 4: Convert Result to Binary</div>`;
      stepsText += `Decimal: <span class="${styles.highlight}">${tensComp}</span> → Binary: <span class="${styles.highlight}">${binaryValue}</span>\n`;
      
      displayResult = `${tensComp} (${binaryValue})`;
    }

    setResultValue(displayResult);
    setSolution(stepsText);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-2">

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      <ToastContainer />
      <h1 className={styles.header}>Complement Calculator</h1>

      <div className="space-y-4">
        <label className={styles.fieldLabel}>Decimal Number</label>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className={styles.input}
        />

        <label className={styles.fieldLabel}>Bit Width</label>
        <input
          type="number"
          value={bitWidth}
          onChange={(e) => setBitWidth(e.target.value)}
          className={styles.input}
        />

        <label className={styles.fieldLabel}>Complement Type</label>
        <select
          value={complementType}
          onChange={(e) => setComplementType(e.target.value)}
          className={styles.input}
        >
          <option>1's Complement</option>
          <option>2's Complement</option>
          <option>9's Complement</option>
          <option>10's Complement</option>
        </select>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={calculateSolution}
          className={styles.button}
        >
          Calculate
        </motion.button>

        {resultValue && (
          <div className={styles.resultField}>
            <h2 className="text-xl font-bold">
                  Output:
                  <p className={currentTheme.outputText}>{resultValue}</p>
                </h2>
            <FaCopy
              className={styles.copyIcon}
              onClick={() => copyToClipboard(resultValue)}
            />
          </div>
        )}

        {solution && (
          <div
            className={styles.card}
            dangerouslySetInnerHTML={{ __html: solution }}
          />
        )}
      </div>
    </motion.div>

    </div>
  );
};

export default Complement;
