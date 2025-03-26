import React, { useState, useEffect } from "react";
import { FaExchangeAlt, FaCopy, FaRedo } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Comprehensive area conversion rates (all standardized to square meters)
const areaConversionRates = {
  squareMeter: 1,
  squareKilometer: 1e6, // 1 km² = 1,000,000 m²
  squareMile: 2589988.110336, // 1 mi² ≈ 2,589,988.11 m²
  hectare: 10000, // 1 ha = 10,000 m²
  acre: 4046.8564224, // 1 ac ≈ 4,046.8564224 m²
  squareYard: 0.83612736, // 1 yd² ≈ 0.83612736 m²
  squareFoot: 0.09290304, // 1 ft² ≈ 0.09290304 m²
  squareInch: 0.00064516, // 1 in² ≈ 0.00064516 m²
};

// Mapping of unit keys to full names with SI abbreviations
const unitLabels = {
  squareMeter: "Square Meter (m²)",
  squareKilometer: "Square Kilometer (km²)",
  squareMile: "Square Mile (mi²)",
  hectare: "Hectare (ha)",
  acre: "Acre (ac)",
  squareYard: "Square Yard (yd²)",
  squareFoot: "Square Foot (ft²)",
  squareInch: "Square Inch (in²)",
};

const AreaConverter = ({ theme }) => {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("squareMeter");
  const [toUnit, setToUnit] = useState("squareKilometer");
  const [outputValue, setOutputValue] = useState("");
  const [formula, setFormula] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Conversion logic with improved accuracy
  const convertArea = (value, fromUnit, toUnit) => {
    const valueInSquareMeters = parseFloat(value) * areaConversionRates[fromUnit];
    const convertedValue = valueInSquareMeters / areaConversionRates[toUnit];
    return convertedValue;
  };

  // Automatically convert on change
  useEffect(() => {
    if (inputValue && !isNaN(inputValue)) {
      handleConvert();
    }
  }, [fromUnit, toUnit, inputValue]);

  const handleConvert = () => {
    if (!inputValue || isNaN(inputValue)) {
      setOutputValue("");
      setFormula("");
      return;
    }
    try {
      const result = convertArea(parseFloat(inputValue), fromUnit, toUnit);
      const formattedResult = result.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      });
      setOutputValue(formattedResult);

      const conversionRatio = convertArea(1, fromUnit, toUnit);
      setFormula(
        `1 ${unitLabels[fromUnit]} = ${conversionRatio.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        })} ${unitLabels[toUnit]}`
      );
    } catch (error) {
      toast.error("Conversion error occurred!");
      setOutputValue("");
      setFormula("");
    }
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopyResult = () => {
    if (outputValue) {
      navigator.clipboard.writeText(outputValue);
      toast.success("Copied to clipboard!");
    }
  };

  const handleReset = () => {
    setInputValue("");
    setOutputValue("");
    setFormula("");
    setFromUnit("squareMeter");
    setToUnit("squareKilometer");
  };

  const themeStyles = {
    container: `transition-all duration-500 ${
      theme === "dark"
        ? "bg-gradient-to-br from-[#0a0a0a] to-[#1c1c1c] text-white"
        : "bg-gradient-to-br from-gray-100 to-gray-200 text-black"
    }`,
    card: `transition-all duration-500 ${
      theme === "dark"
        ? "bg-[#121212] border border-gray-700 shadow-2xl"
        : "bg-white border border-gray-200 shadow-xl"
    }`,
    input: `transition-all duration-500 ${
      theme === "dark"
        ? "bg-[#181818] text-white border-gray-700"
        : "bg-gray-50 text-black border-gray-300"
    }`,
    select: `transition-all duration-500 ${
      theme === "dark"
        ? "bg-[#1a1a1a] text-white border-gray-700"
        : "bg-gray-100 text-black border-gray-300"
    }`,
    button: `transition-all duration-500 ${
      theme === "dark"
        ? "bg-blue-900 hover:bg-blue-800 text-white"
        : "bg-blue-500 hover:bg-blue-600 text-white"
    }`,
    formula: `transition-all duration-500 ${
      theme === "dark"
        ? "bg-yellow-900 text-yellow-200"
        : "bg-yellow-100 text-yellow-800"
    }`,
  };

  return (
    <div className={`min-h-screen flex justify-center items-center ${themeStyles.container} p-4 sm:mt-20 md:mt-0 mt-12 sm:p-6`}>
      <ToastContainer />
      <div className={`w-full max-w-4xl rounded-2xl p-6 sm:p-10 ${themeStyles.card}`}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 pb-5">
          📐 Area Unit Converter
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-col w-full">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className={`p-3 sm:p-4 md:p-6 text-base sm:text-xl md:text-2xl rounded-xl border-2 focus:ring-4 focus:ring-blue-500 transition-all duration-300 ${themeStyles.input}`}
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className={`p-2 sm:p-3 md:p-4 mt-2 sm:mt-4 rounded-xl border-2 text-sm sm:text-base md:text-lg ${themeStyles.select}`}
            >
              {Object.keys(areaConversionRates).map((unit) => (
                <option key={unit} value={unit}>
                  {unitLabels[unit] || (unit.charAt(0).toUpperCase() + unit.slice(1))}
                </option>
              ))}
            </select>
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold opacity-50 my-4 md:my-0">=</div>
          <div className="flex flex-col w-full">
            <div className="relative">
              <input
                type="text"
                value={outputValue}
                readOnly
                placeholder="Converted value"
                className={`p-3 sm:p-4 md:p-6 text-base sm:text-xl md:text-2xl rounded-xl border-2 w-full pr-12 sm:pr-16 ${themeStyles.input}`}
              />
              <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button onClick={handleCopyResult} className="text-gray-500 hover:text-blue-600 transition-colors" title="Copy Result">
                  <FaCopy size={isMobile ? 16 : 20} />
                </button>
              </div>
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className={`p-2 sm:p-3 md:p-4 mt-2 sm:mt-4 rounded-xl border-2 text-sm sm:text-base md:text-lg ${themeStyles.select}`}
            >
              {Object.keys(areaConversionRates).map((unit) => (
                <option key={unit} value={unit}>
                  {unitLabels[unit] || (unit.charAt(0).toUpperCase() + unit.slice(1))}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
          <button onClick={handleSwap} className={`flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-lg ${themeStyles.button} font-bold hover:scale-105 transition-all`}>
            <FaExchangeAlt size={isMobile ? 16 : 20} />
            Swap Units
          </button>
          <button onClick={handleReset} className={`flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-bold hover:scale-105 transition-all`}>
            <FaRedo size={isMobile ? 16 : 20} />
            Reset
          </button>
        </div>
        {formula && (
          <div className={`mt-4 sm:mt-8 p-3 rounded-lg ${themeStyles.formula} flex items-center text-xs sm:text-sm`}>
            <span className="font-bold mr-2">Conversion Ratio:</span> {formula}
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaConverter;
