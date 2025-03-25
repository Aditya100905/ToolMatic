import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BitwiseOperators = ({ theme }) => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [base1, setBase1] = useState("decimal");
  const [base2, setBase2] = useState("decimal");
  const [result, setResult] = useState(null);
  const [operation, setOperation] = useState("AND");
  const [resultFormat, setResultFormat] = useState("decimal");

  // Theme classes
  const themeClass = theme === "dark" ? "bg-[#121212] text-white" : "bg-gray-100 text-black";
  const inputClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
  const btnClass = theme === "dark" ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400";
  const resultClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";

  const isSingleOperand = ["NOT", "LEFT_SHIFT", "RIGHT_SHIFT"].includes(operation);

  // Function to handle base conversions
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

  const handleCalculate = () => {
    if (!num1 || (!isSingleOperand && !num2)) {
      toast.warn("Enter valid number(s)!");
      setResult(null);
      return;
    }

    const n1 = parseInt(num1, base1 === "binary" ? 2 : 10);
    const n2 = parseInt(num2, base2 === "binary" ? 2 : 10);

    if (isNaN(n1) || (!isSingleOperand && isNaN(n2))) {
      toast.error("Invalid number(s)!");
      setResult(null);
      return;
    }

    let res;
    switch (operation) {
      case "AND":
        res = n1 & n2;
        break;
      case "OR":
        res = n1 | n2;
        break;
      case "XOR":
        res = n1 ^ n2;
        break;
      case "NOT":
        res = ~n1;
        break;
      case "LEFT_SHIFT":
        res = n1 << 1; // Single operand, shifting by 1
        break;
      case "RIGHT_SHIFT":
        res = n1 >> 1; // Single operand, shifting by 1
        break;
      default:
        res = "Invalid Operation";
    }

    setResult(res);
  };

  // Function to format the result
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

  return (
    <div className={`h-screen mt-16 mb-0 p-6 ${themeClass}`}>
      <div className="max-w-xl mx-auto bg-opacity-80 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Bitwise Operators</h1>

        <div className="flex flex-col gap-4">
          {/* Operand 1 with Base Selector */}
          <div className="flex items-center gap-4">
            <select
              value={base1}
              onChange={(e) => handleBaseChange(setBase1, setNum1, num1, base1, e.target.value)}
              className={`p-2 border rounded ${inputClass}`}
            >
              <option value="decimal">Decimal</option>
              <option value="binary">Binary</option>
            </select>

            <input
              type="text"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder={`Enter ${base1 === "binary" ? "binary" : "decimal"} number`}
              className={`w-full p-3 border rounded ${inputClass} sm:text-xl text-xs`}
            />
          </div>

          {/* Operand 2 with Base Selector (hidden for single operand) */}
          {!isSingleOperand && (
            <div className="flex items-center gap-4">
              <select
                value={base2}
                onChange={(e) => handleBaseChange(setBase2, setNum2, num2, base2, e.target.value)}
                className={`p-2 border rounded ${inputClass}`}
              >
                <option value="decimal">Decimal</option>
                <option value="binary">Binary</option>
              </select>

              <input
                type="text"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                placeholder={`Enter ${base2 === "binary" ? "binary" : "decimal"} number`}
                className={`w-full p-3 border rounded ${inputClass} sm:text-xl text-xs`}
                />
            </div>
          )}
        </div>

        {/* Operation Selector (Retained Original Position) */}
        <div className="my-6">
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className={`w-full p-3 border rounded ${inputClass}`}
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
          <label className="block mb-2">Result Format:</label>
          <select
            value={resultFormat}
            onChange={(e) => setResultFormat(e.target.value)}
            className={`w-full p-2 border rounded ${inputClass}`}
          >
            <option value="decimal">Decimal</option>
            <option value="binary">Binary</option>
            <option value="hexadecimal">Hexadecimal</option>
            <option value="octal">Octal</option>
          </select>
        </div>

        {/* Calculate Button */}
        <button onClick={handleCalculate} className={`w-full p-3 rounded-lg shadow-md ${btnClass}`}>
          Calculate
        </button>

        {/* Result Display */}
        {result !== null && (
          <div className={`mt-6 p-4 rounded-lg shadow-md ${resultClass}`}>
            <h2 className="text-xl font-semibold">Result:</h2>
            <p className="text-2xl font-mono">{formatResult(result)}</p>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default BitwiseOperators;
