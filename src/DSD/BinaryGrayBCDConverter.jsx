import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaExchangeAlt, FaCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Extended Theme styles (matching BaseConverter UI)
const darkTheme = {
  container: "max-w-2xl w-11/12 flex items-center pt-2 bg-black",
  card: "w-2xl mx-auto mt-20 my-10 p-8 bg-[#121212] rounded-2xl shadow-lg text-white",
  header: "text-4xl font-bold mb-8 text-center",
  fieldLabel: "block text-sm font-medium mb-1 text-gray-400",
  input:
    "w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500",
  select:
    "w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500",
  button:
    "w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold shadow-md transition-all",
  swapButton:
    "p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition mx-2",
  outputCard:
    "mt-4 p-3 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-between",
  outputText: "text-xl font-bold text-green-400",
  copyIcon: "cursor-pointer text-gray-400 hover:text-blue-400 transition",
  solutionCard: "mt-4 p-6 bg-gray-800 rounded-lg shadow-md",
  solutionHeader: "text-2xl font-bold mb-4 text-center",
  stepTitle: "text-lg font-bold text-blue-400",
  solutionText: "text-sm leading-relaxed text-white",
  highlight: "text-yellow-300 font-semibold",
};

const lightTheme = {
  container: "max-w-2xl w-11/12 flex items-center pt-2 bg-gray-100",
  card: "w-2xl mx-auto mt-20 my-10 p-8 bg-white rounded-2xl shadow-lg text-black",
  header: "text-4xl font-bold mb-8 text-center",
  fieldLabel: "block text-sm font-medium mb-1 text-gray-600",
  input:
    "w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400",
  select:
    "w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400",
  button:
    "w-full py-3 px-6 bg-blue-500 hover:bg-blue-400 rounded-lg font-semibold shadow-md transition-all text-white",
  swapButton:
    "p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition mx-2",
  outputCard:
    "mt-4 p-3 bg-gray-50 rounded-lg border border-gray-300 flex items-center justify-between",
  outputText: "text-xl font-bold text-green-600",
  copyIcon: "cursor-pointer text-gray-500 hover:text-blue-500 transition",
  solutionCard: "mt-4 p-6 bg-gray-50 rounded-lg shadow-md",
  solutionHeader: "text-2xl font-bold mb-4 text-center",
  stepTitle: "text-lg font-bold text-blue-600",
  solutionText: "text-sm leading-relaxed text-black",
  highlight: "text-yellow-500 font-semibold",
};

const BinaryGrayBcdConverter = () => {
  const [theme, setTheme] = useState("dark");
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  const [input, setInput] = useState("");
  const [fromFormat, setFromFormat] = useState("binary");
  const [toFormat, setToFormat] = useState("gray");
  const [output, setOutput] = useState("");
  const [solutionSteps, setSolutionSteps] = useState([]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Validate input based on fromFormat
  const isValidInput = (value, format) => {
    if (format === "binary" || format === "gray") {
      // Must be a string containing only 0 and 1
      return /^[01]+$/.test(value);
    } else if (format === "bcd") {
      // BCD groups: 4 digits (0 or 1) each, separated by space
      return /^([01]{4})( [01]{4})*$/.test(value);
    }
    return false;
  };

  // Conversion Functions generating JSX for solution steps
  const binaryToGray = (binary) => {
    let gray = binary[0];
    const steps = [];
    steps.push(
      <p key="step-0" className={currentTheme.solutionText}>
        <span className={currentTheme.stepTitle}>Gray[0] = Binary[0] =</span>{" "}
        <span className={currentTheme.highlight}>{binary[0]}</span>
      </p>
    );

    for (let i = 1; i < binary.length; i++) {
      const xorVal = binary[i - 1] ^ binary[i];
      gray += xorVal;
      steps.push(
        <p key={`step-${i}`} className={currentTheme.solutionText}>
          <span className={currentTheme.stepTitle}>
            Gray[{i}] = Binary[{i - 1}]{" "}
            <span className={currentTheme.highlight}>{`XOR`}</span> Binary[{i}]
            = {binary[i - 1]} ^ {binary[i]} =
          </span>{" "}
          <span className={currentTheme.highlight}>{xorVal}</span>
        </p>
      );
    }
    return { result: gray, steps };
  };

  const grayToBinary = (gray) => {
    let binary = gray[0];
    const steps = [];
    steps.push(
      <p key="step-0" className={currentTheme.solutionText}>
        <span className={currentTheme.stepTitle}>Binary[0] = Gray[0] =</span>{" "}
        <span className={currentTheme.highlight}>{gray[0]}</span>
      </p>
    );

    for (let i = 1; i < gray.length; i++) {
      const xorVal = binary[i - 1] ^ gray[i];
      binary += xorVal;
      steps.push(
        <p key={`step-${i}`} className={currentTheme.solutionText}>
          <span className={currentTheme.stepTitle}>
            Binary[{i}] = Binary[{i - 1}]{" "}
            <span className={currentTheme.highlight}>{`XOR`}</span> Gray[{i}] ={" "}
            {binary[i - 1]} ^ {gray[i]} ={" "}
            <span className={currentTheme.highlight}>{xorVal}</span>
          </span>
        </p>
      );
    }
    return { result: binary, steps };
  };

  const binaryToBcd = (binary) => {
    const decimal = parseInt(binary, 2);
    const bcd = decimal
      .toString(10)
      .split("")
      .map((d) => parseInt(d).toString(2).padStart(4, "0"))
      .join(" ");
    const steps = [];
    steps.push(
      <p key="step-0" className={currentTheme.stepTitle}>
        Decimal = <span className={currentTheme.highlight}>{decimal}</span>
      </p>
    );
    steps.push(
      <p key="step-1" className={currentTheme.stepTitle}>
        BCD = <span className={currentTheme.highlight}>{bcd}</span>
      </p>
    );
    return { result: bcd, steps };
  };

  const bcdToBinary = (bcd) => {
    const groups = bcd.split(" ");
    const decimal = groups.map((group) => parseInt(group, 2)).join("");
    const binary = parseInt(decimal, 10).toString(2);
    const steps = [];
    steps.push(
      <p key="step-0" className={currentTheme.stepTitle}>
        Decimal = <span className={currentTheme.highlight}>{decimal}</span>
      </p>
    );
    steps.push(
      <p key="step-1" className={currentTheme.stepTitle}>
        Binary = <span className={currentTheme.highlight}>{binary}</span>
      </p>
    );
    return { result: binary, steps };
  };

  const convert = () => {
    if (!input.trim()) {
      toast.warn("Enter a valid value!");
      setOutput("");
      setSolutionSteps([]);
      return;
    }

    if (!isValidInput(input.trim(), fromFormat)) {
      toast.error(`Invalid ${fromFormat} input!`);
      setOutput("");
      setSolutionSteps([]);
      return;
    }

    let result = "";
    let steps = [];

    try {
      switch (`${fromFormat}-${toFormat}`) {
        case "binary-gray":
          ({ result, steps } = binaryToGray(input.trim()));
          break;
        case "gray-binary":
          ({ result, steps } = grayToBinary(input.trim()));
          break;
        case "binary-bcd":
          ({ result, steps } = binaryToBcd(input.trim()));
          break;
        case "bcd-binary":
          ({ result, steps } = bcdToBinary(input.trim()));
          break;
        default:
          toast.error("Invalid conversion!");
          return;
      }

      setOutput(result);
      setSolutionSteps(steps);
    } catch (error) {
      toast.error("Conversion error!");
    }
  };

  const swapFormats = () => {
    setFromFormat(toFormat);
    setToFormat(fromFormat);
    setOutput("");
    setSolutionSteps([]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
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
            <h1 className={currentTheme.header}>Binary-Gray-BCD Converter</h1>

            <div className="mb-4">
              <label className={currentTheme.fieldLabel}>Enter Value:</label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter binary number..."
                className={currentTheme.input}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <select
                value={fromFormat}
                onChange={(e) => setFromFormat(e.target.value)}
                className={currentTheme.select}
              >
                <option value="binary">Binary</option>
                <option value="gray">Gray</option>
                <option value="bcd">BCD</option>
              </select>

              <button onClick={swapFormats} className={currentTheme.swapButton}>
                <FaExchangeAlt />
              </button>

              <select
                value={toFormat}
                onChange={(e) => setToFormat(e.target.value)}
                className={currentTheme.select}
              >
                <option value="binary">Binary</option>
                <option value="gray">Gray</option>
                <option value="bcd">BCD</option>
              </select>
            </div>

            <button onClick={convert} className={currentTheme.button}>
              Convert
            </button>

            {output && (
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
            )}

            {solutionSteps.length > 0 && (
              <div className={currentTheme.solutionCard}>
                <h3 className={currentTheme.solutionHeader}>
                  Detailed Conversion Steps:
                </h3>
                {solutionSteps.map((step, idx) => (
                  <div key={idx}>{step}</div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BinaryGrayBcdConverter;
