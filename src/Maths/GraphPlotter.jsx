import React, { useState, useRef, useCallback } from "react";
import Plot from "react-plotly.js";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { create, all } from "mathjs";

// Create a MathJS instance for expression parsing
const math = create(all);

const GraphPlotter = ({ theme }) => {
  // State for multiple function expressions
  const [functions, setFunctions] = useState(["x^3"]);
  // Using a ref for potential Plotly instance access
  const plotRef = useRef(null);
  // The current x-axis domain
  const [xRange, setXRange] = useState([-10, 10]);
  // A base resolution that the user can also adjust (optional)
  const [baseResolution, setBaseResolution] = useState(500);

  // Add a new function input field
  const handleAddFunction = () => {
    setFunctions((prev) => [...prev, ""]);
  };

  // Remove a function input field
  const handleRemoveFunction = (index) => {
    setFunctions((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a function's expression
  const handleChange = (index, value) => {
    setFunctions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Parse and compile an expression using MathJS
  const compileExpression = (expression) => {
    try {
      const node = math.parse(expression);
      return node.compile();
    } catch (error) {
      return null;
    }
  };

  // Generate plot data using a dynamically computed number of points
  const generatePlotData = useCallback(() => {
    const [minX, maxX] = xRange;
    // Compute number of sample points based on domain width
    // This ensures a minimum resolution of baseResolution and scales up with the range (up to a maximum)
    const computedSamplePoints = Math.min(
      5000,
      Math.max(baseResolution, Math.round((maxX - minX) * 100))
    );
    const step = (maxX - minX) / computedSamplePoints;
    const dataArr = [];

    functions.forEach((func, idx) => {
      const compiled = compileExpression(func);
      if (!compiled) return; // Skip invalid expressions

      const xValues = [];
      const yValues = [];
      for (let i = 0; i <= computedSamplePoints; i++) {
        const x = minX + i * step;
        xValues.push(x);
        try {
          const y = compiled.evaluate({ x });
          yValues.push(y);
        } catch {
          yValues.push(NaN);
        }
      }
      dataArr.push({
        x: xValues,
        y: yValues,
        type: "scatter",
        mode: "lines",
        name: `f${idx + 1}(x) = ${func}`,
        line: { width: 2 },
      });
    });
    return dataArr;
  }, [functions, xRange, baseResolution]);

  // Expand the x-axis range when the user pans/zooms beyond the current domain
  const handleRelayout = (relayoutData) => {
    const newX0 = relayoutData["xaxis.range[0]"];
    const newX1 = relayoutData["xaxis.range[1]"];
    if (typeof newX0 !== "undefined" && typeof newX1 !== "undefined") {
      let [oldMin, oldMax] = xRange;
      let newMin = oldMin;
      let newMax = oldMax;
      if (newX0 < oldMin) newMin = Math.floor(newX0) - 10;
      if (newX1 > oldMax) newMax = Math.ceil(newX1) + 10;
      if (newMin !== oldMin || newMax !== oldMax) {
        setXRange([newMin, newMax]);
      }
    }
  };

  return (
    <motion.div
      className={`min-h-screen p-6 rounded-xl shadow-xl ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Function Input Fields */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:mt-30 mt-20">
        {functions.map((func, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              placeholder={`f${index + 1}(x)`}
              value={func}
              onChange={(e) => handleChange(index, e.target.value)}
              className="flex-1 p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => handleRemoveFunction(index)}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-r-lg transition"
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>

      {/* Optional: Resolution Slider */}
      <div className="mb-6">
        <label className="mr-4">
          Base Resolution:
          <input
            type="number"
            value={baseResolution}
            onChange={(e) => setBaseResolution(Number(e.target.value) || 500)}
            className="ml-2 p-1 border rounded"
            style={{ width: "80px" }}
          />
        </label>
        <span>
          (Current computed samples depend on domain width; minimum is this value.)
        </span>
      </div>

      {/* Plot Area */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <Plot
          ref={plotRef}
          data={generatePlotData()}
          layout={{
            title: `Graph Plotter (x from ${xRange[0]} to ${xRange[1]})`,
            xaxis: {
              title: "X-Axis",
              showline: true,
              mirror: true,
              linecolor: theme === "dark" ? "#fff" : "#000",
              gridcolor: theme === "dark" ? "#444" : "#ccc",
            },
            yaxis: {
              title: "Y-Axis",
              showline: true,
              mirror: true,
              linecolor: theme === "dark" ? "#fff" : "#000",
              gridcolor: theme === "dark" ? "#444" : "#ccc",
            },
            paper_bgcolor: theme === "dark" ? "#2d3748" : "#fff",
            plot_bgcolor: theme === "dark" ? "#2d3748" : "#fff",
            font: { color: theme === "dark" ? "#fff" : "#000" },
            dragmode: "pan",
            hovermode: "closest",
            margin: { t: 60, r: 50, b: 60, l: 50 },
          }}
          config={{
            responsive: true,
            displaylogo: false,
            scrollZoom: true,
            modeBarButtonsToAdd: ["drawline", "drawopenpath", "eraseshape"],
          }}
          className="w-full h-[600px]"
          onRelayout={handleRelayout}
        />
      </div>
    </motion.div>
  );
};

export default GraphPlotter;
