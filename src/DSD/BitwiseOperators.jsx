import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaCopy } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const BitwiseOperators = ({ theme }) => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [base1, setBase1] = useState("decimal");
  const [base2, setBase2] = useState("decimal");
  const [result, setResult] = useState(null);
  const [operation, setOperation] = useState("AND");
  const [resultFormat, setResultFormat] = useState("decimal");
  const [solutionSteps, setSolutionSteps] = useState([]);

  const darkTheme = {
    container: "sm:w-2xl mt-16 mb-0 p-6 bg-black",
    card: "max-w-xl mx-auto bg-[#121212] bg-opacity-80 shadow-lg rounded-lg p-8",
    header: "text-3xl font-bold mb-6 text-center text-white",
    fieldLabel: "block text-sm font-medium mb-1 text-gray-400",
    input: "w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500 text-white",
    button: "w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold shadow-md transition-all",
    resultCard: "mt-6 p-4 rounded-lg shadow-md bg-gray-800 text-white",
    resultTitle: "text-xl font-bold text-green-400",
    resultText: "text-2xl font-mono",
    outputText: `text-xl font-bold text-green-400`,
  copyIcon: "cursor-pointer text-gray-400 hover:text-blue-400 transition",
    solutionCard: "mt-4 p-6 bg-gray-800 rounded-lg shadow-md",
    solutionHeader: "text-4xl font-bold mb-4 text-center",
    stepTitle: "text-lg font-bold text-blue-400",
    solutionText: "text-sm leading-relaxed text-white",
    highlight: "text-yellow-300 font-semibold"
  };

  const lightTheme = {
    container: "sm:w-2xl mt-16 mb-0 p-6 bg-gray-100",
    card: "max-w-xl mx-auto bg-gray-100 bg-opacity-90 shadow-lg rounded-lg p-8",
    header: "text-3xl font-bold mb-6 text-center text-black",
    fieldLabel: "block text-sm font-medium mb-1 text-gray-600",
    input: "w-full p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-400 text-black",
    button: "w-full py-3 px-6 bg-blue-500 hover:bg-blue-400 rounded-lg font-semibold shadow-md transition-all text-white",
    resultCard: "mt-6 p-4 rounded-lg shadow-md bg-white text-black",
    resultTitle: "text-xl font-bold text-green-600",
    resultText: "text-2xl font-mono",
    outputText: `text-xl font-bold text-green-600`,
    copyIcon: "cursor-pointer text-gray-500 hover:text-blue-500 transition",
  solutionCard: "mt-4 p-6 bg-gray-50 rounded-lg shadow-md",
    solutionHeader: "text-4xl font-bold mb-4 text-center",
    stepTitle: "text-lg font-bold text-blue-600",
    solutionText: "text-sm leading-relaxed text-black",
    highlight: "text-yellow-500 font-semibold"
  };
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;
  const isSingleOperand = ["NOT", "LEFT_SHIFT", "RIGHT_SHIFT"].includes(operation);

  // Converts a number string from one base to another
  const convertBase = (value, fromBase, toBase) => {
    if (!value) return "";
    try {
      const num = parseInt(value, fromBase === "binary" ? 2 : 10);
      switch (toBase) {
        case "binary":
          return num.toString(2);
        case "decimal":
          return num.toString(10);
        case "hexadecimal":
          return num.toString(16).toUpperCase();
        case "octal":
          return num.toString(8);
        default:
          return value;
      }
    } catch {
      toast.error("Invalid number format!");
      return "";
    }
  };

  const handleBaseChange = (setBase, setNum, num, fromBase, toBase) => {
    setBase(toBase);
    const converted = convertBase(num, fromBase, toBase);
    setNum(converted);
  };

  // Formats the result according to the chosen format
  const formatResult = (res) => {
    if (res === null) return "";
    switch (resultFormat) {
      case "binary":
        return res.toString(2);
      case "decimal":
        return res.toString(10);
      case "hexadecimal":
        return res.toString(16).toUpperCase();
      case "octal":
        return res.toString(8);
      default:
        return res.toString();
    }
  };

  const handleCalculate = () => {
    if (!num1 || (!isSingleOperand && !num2)) {
      toast.warn("Enter valid number(s)!");
      setResult(null);
      setSolutionSteps([]);
      return;
    }

    const n1 = parseInt(num1, base1 === "binary" ? 2 : 10);
    const n2 = parseInt(num2, base2 === "binary" ? 2 : 10);

    if (isNaN(n1) || (!isSingleOperand && isNaN(n2))) {
      toast.error("Invalid number(s)!");
      setResult(null);
      setSolutionSteps([]);
      return;
    }

    let res;
    const steps = [];
    switch (operation) {
      case "AND":
        res = n1 & n2;
        steps.push(`Convert ${n1} to binary: ${n1.toString(2)}`);
        steps.push(`Convert ${n2} to binary: ${n2.toString(2)}`);
        steps.push(`Apply AND: ${n1.toString(2)} & ${n2.toString(2)} = ${res.toString(2)}`);
        steps.push(`Final result in ${resultFormat}: ${formatResult(res)}`);
        break;
      case "OR":
        res = n1 | n2;
        steps.push(`Convert ${n1} to binary: ${n1.toString(2)}`);
        steps.push(`Convert ${n2} to binary: ${n2.toString(2)}`);
        steps.push(`Apply OR: ${n1.toString(2)} | ${n2.toString(2)} = ${res.toString(2)}`);
        steps.push(`Final result in ${resultFormat}: ${formatResult(res)}`);
        break;
      case "XOR":
        res = n1 ^ n2;
        steps.push(`Convert ${n1} to binary: ${n1.toString(2)}`);
        steps.push(`Convert ${n2} to binary: ${n2.toString(2)}`);
        steps.push(`Apply XOR: ${n1.toString(2)} ^ ${n2.toString(2)} = ${res.toString(2)}`);
        steps.push(`Final result in ${resultFormat}: ${formatResult(res)}`);
        break;
      case "NOT":
        res = ~n1;
        steps.push(`Convert ${n1} to binary: ${n1.toString(2)}`);
        steps.push(`Apply NOT: ~${n1.toString(2)} = ${res.toString(2)}`);
        steps.push(`Final result in ${resultFormat}: ${formatResult(res)}`);
        break;
      case "LEFT_SHIFT":
        res = n1 << 1;
        steps.push(`Convert ${n1} to binary: ${n1.toString(2)}`);
        steps.push(`Apply LEFT SHIFT by 1: ${n1.toString(2)} << 1 = ${res.toString(2)}`);
        steps.push(`Final result in ${resultFormat}: ${formatResult(res)}`);
        break;
      case "RIGHT_SHIFT":
        res = n1 >> 1;
        steps.push(`Convert ${n1} to binary: ${n1.toString(2)}`);
        steps.push(`Apply RIGHT SHIFT by 1: ${n1.toString(2)} >> 1 = ${res.toString(2)}`);
        steps.push(`Final result in ${resultFormat}: ${formatResult(res)}`);
        break;
      default:
        toast.error("Invalid Operation!");
        setSolutionSteps([]);
        return;
    }
    setResult(res);
    setSolutionSteps(steps);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Result copied to clipboard!");
  };

  return (
    <div className="flex min-h-screen justify-center items-center ">

    <div className="flex min-h-screen justify-center items-center ">
    <div className={currentTheme.container}>
      <div className={currentTheme.card}>
        <h1 className={currentTheme.header}>Bitwise Operators</h1>

        {/* Operands */}
        <div className="flex flex-col gap-4">
          {/* Operand 1 */}
          <div className="flex items-center gap-4">
            <select
              value={base1}
              onChange={(e) =>
                handleBaseChange(setBase1, setNum1, num1, base1, e.target.value)
              }
              className={`p-2 border rounded ${currentTheme.input}`}
            >
              <option value="decimal">Decimal</option>
              <option value="binary">Binary</option>
            </select>
            <input
              type="text"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder={`Enter ${base1 === "binary" ? "binary" : "decimal"} number`}
              className={`w-full p-3 border rounded ${currentTheme.input}`}
            />
          </div>

          {/* Operand 2 (hidden for single-operand operations) */}
          {!isSingleOperand && (
            <div className="flex items-center gap-4">
              <select
                value={base2}
                onChange={(e) =>
                  handleBaseChange(setBase2, setNum2, num2, base2, e.target.value)
                }
                className={`p-2 border rounded ${currentTheme.input}`}
              >
                <option value="decimal">Decimal</option>
                <option value="binary">Binary</option>
              </select>
              <input
                type="text"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                placeholder={`Enter ${base2 === "binary" ? "binary" : "decimal"} number`}
                className={`w-full p-3 border rounded ${currentTheme.input}`}
              />
            </div>
          )}
        </div>

        {/* Operation Selector */}
        <div className="my-6">
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className={`w-full p-3 border rounded ${currentTheme.input}`}
          >
            <option value="AND">AND (&)</option>
            <option value="OR">OR (|)</option>
            <option value="XOR">XOR (^)</option>
            <option value="NOT">NOT (~)</option>
            <option value="LEFT_SHIFT">{`LEFT SHIFT (<<)`}</option>
            <option value="RIGHT_SHIFT">{`RIGHT SHIFT (>>)`}</option>
          </select>
        </div>

        {/* Result Format Selector */}
        <div className="my-4">
          <label className={currentTheme.fieldLabel}>Result Format:</label>
          <select
            value={resultFormat}
            onChange={(e) => setResultFormat(e.target.value)}
            className={`w-full p-2 border rounded ${currentTheme.input}`}
          >
            <option value="decimal">Decimal</option>
            <option value="binary">Binary</option>
            <option value="hexadecimal">Hexadecimal</option>
            <option value="octal">Octal</option>
          </select>
        </div>

        {/* Calculate Button */}
        <button onClick={handleCalculate} className={currentTheme.button}>
          Calculate
        </button>

        {/* Result Display */}
        {result !== null && (
          <div className={currentTheme.resultCard}>
            <div className="flex items-center justify-between">
              {/* <h2 className={currentTheme.resultTitle}>Result:</h2> */}

              <h2 className="text-xl font-bold">
                  Output:
                  <p className={currentTheme.outputText}>{formatResult(result)}</p>
                </h2>
                <FaCopy
                className={currentTheme.copyIcon}
                onClick={() => copyToClipboard(formatResult(result))}
              />
            </div>
            
          </div>
        )}
        {solutionSteps.length > 0 && (
                  <div className={currentTheme.solutionCard}>
                    <h3 className={currentTheme.solutionHeader}>
                      Detailed Solution Steps:
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {solutionSteps.map((step, idx) => {
                        const processedStep = step.replace(
                          /(\d+)/g,
                          `<span class="${currentTheme.highlight}">$1</span>`
                        );
                        return (
                          <li
                            key={idx}
                            dangerouslySetInnerHTML={{
                              __html: `<span class="${currentTheme.stepTitle}">Step ${
                                idx + 1
                              }:</span> <span class="${currentTheme.solutionText}">${processedStep}</span>`
                            }}
                          />
                        );
                      })}
                    </ul>
                  </div>
                )}
        <ToastContainer />
      </div>
    </div>
    </div>
    </div>
  );
};

export default BitwiseOperators;
