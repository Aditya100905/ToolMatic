import { useState } from "react";
import * as math from "mathjs";
const EquationSolver = ({ theme = "light" }) => {
  const [equation, setEquation] = useState("");
  const [solution, setSolution] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [variable, setVariable] = useState("x");
  const [equationType, setEquationType] = useState("general");
  const themes = {
    light: {
      background: "bg-gray-100",
      card: "bg-white",
      primary: "bg-blue-500 hover:bg-blue-600",
      secondary: "bg-gray-200 hover:bg-gray-300",
      text: "text-gray-800",
      border: "border-gray-300",
      highlight: "bg-blue-100",
    },
    dark: {
      background: "bg-gray-900",
      card: "bg-gray-800",
      primary: "bg-blue-600 hover:bg-blue-700",
      secondary: "bg-gray-700 hover:bg-gray-600",
      text: "text-gray-100",
      border: "border-gray-700",
      highlight: "bg-gray-700",
    },
    colorful: {
      background: "bg-purple-100",
      card: "bg-white",
      primary: "bg-purple-500 hover:bg-purple-600",
      secondary: "bg-pink-200 hover:bg-pink-300",
      text: "text-gray-800",
      border: "border-purple-300",
      highlight: "bg-pink-100",
    },
  };
  const currentTheme = themes[theme] || themes.light;
  const detectEquationType = (eq) => {
    const eqLower = eq.toLowerCase();
    if (
      eqLower.includes("log(") ||
      eqLower.includes("ln(") ||
      eqLower.includes("log10(")
    ) {
      return "logarithmic";
    } else if (
      eqLower.includes("sin(") ||
      eqLower.includes("cos(") ||
      eqLower.includes("tan(") ||
      eqLower.includes("asin(") ||
      eqLower.includes("acos(") ||
      eqLower.includes("atan(")
    ) {
      return "trigonometric";
    } else if (
      eqLower.includes("e^") ||
      eqLower.includes("exp(") ||
      (eqLower.includes("^") && eqLower.includes(variable))
    ) {
      return "exponential";
    }
    return "general";
  };
  const checkIdentities = (expr) => {
    try {
      if (expr.includes("sin") && expr.includes("cos")) {
        const simplifiedExpr = math.parse(expr);
        const normalized = simplifiedExpr.toString({ parenthesis: "all" });
        if (
          /\(sin\(.+?\)\)\^2\s*\+\s*\(cos\(.+?\)\)\^2/.test(normalized) ||
          /sin\(.+?\)\^2\s*\+\s*cos\(.+?\)\^2/.test(normalized)
        ) {
          return "1 (Pythagorean identity: sin²(x) + cos²(x) = 1)";
        }
        if (
          /\(tan\(.+?\)\)\^2\s*\+\s*1/.test(normalized) ||
          /tan\(.+?\)\^2\s*\+\s*1/.test(normalized)
        ) {
          return "sec²(x) (Identity: tan²(x) + 1 = sec²(x))";
        }
        if (
          /1\s*\+\s*\(cot\(.+?\)\)\^2/.test(normalized) ||
          /1\s*\+\s*cot\(.+?\)\^2/.test(normalized)
        ) {
          return "csc²(x) (Identity: 1 + cot²(x) = csc²(x))";
        }
      }
    } catch (e) {}
    return null;
  };
  const solveLogarithmic = (leftSide, rightSide) => {
    try {
      const expr = `${leftSide} - (${rightSide})`;
      if (leftSide.includes("log(") && !rightSide.includes(variable)) {
        if (leftSide.match(/^log\(\s*${variable}\s*\)$/)) {
          const base = 10;
          const exponent = parseFloat(rightSide);
          if (!isNaN(exponent)) {
            return [Math.pow(base, exponent)];
          }
        } else if (leftSide.match(/^ln\(\s*${variable}\s*\)$/)) {
          const exponent = parseFloat(rightSide);
          if (!isNaN(exponent)) {
            return [Math.exp(exponent)];
          }
        }
      }
      return solveNumerically(expr, 0.0001, 1000, 0.1);
    } catch (err) {
      throw new Error(`Error solving logarithmic equation: ${err.message}`);
    }
  };
  const solveTrigonometric = (leftSide, rightSide) => {
    try {
      const expr = `${leftSide} - (${rightSide})`;
      if (
        leftSide.match(/^sin\(\s*${variable}\s*\)$/) &&
        !rightSide.includes(variable)
      ) {
        const value = parseFloat(rightSide);
        if (!isNaN(value) && value >= -1 && value <= 1) {
          const baseAngle = Math.asin(value);
          return [
            baseAngle,
            Math.PI - baseAngle,
            baseAngle + 2 * Math.PI,
            Math.PI - baseAngle + 2 * Math.PI,
          ].filter((angle) => angle >= -2 * Math.PI && angle <= 2 * Math.PI);
        }
      }
      if (
        leftSide.match(/^cos\(\s*${variable}\s*\)$/) &&
        !rightSide.includes(variable)
      ) {
        const value = parseFloat(rightSide);
        if (!isNaN(value) && value >= -1 && value <= 1) {
          const baseAngle = Math.acos(value);
          return [
            baseAngle,
            -baseAngle,
            baseAngle + 2 * Math.PI,
            -baseAngle + 2 * Math.PI,
          ].filter((angle) => angle >= -2 * Math.PI && angle <= 2 * Math.PI);
        }
      }
      return solveNumerically(expr, -2 * Math.PI, 2 * Math.PI, 0.1);
    } catch (err) {
      throw new Error(`Error solving trigonometric equation: ${err.message}`);
    }
  };
  const solveExponential = (leftSide, rightSide) => {
    try {
      if (
        leftSide.match(/^(\d+|e)\^${variable}$/) &&
        !rightSide.includes(variable)
      ) {
        const base = leftSide.startsWith("e")
          ? Math.E
          : parseFloat(leftSide.split("^")[0]);
        const value = parseFloat(rightSide);
        if (!isNaN(base) && !isNaN(value) && value > 0) {
          return [Math.log(value) / Math.log(base)];
        }
      }
      const expr = `${leftSide} - (${rightSide})`;
      return solveNumerically(expr, -10, 10, 0.1);
    } catch (err) {
      throw new Error(`Error solving exponential equation: ${err.message}`);
    }
  };
  const solveNumerically = (expr, start = -100, end = 100, step = 1) => {
    const compiled = math.compile(expr);
    const solutions = [];
    for (let i = start; i <= end; i += step) {
      const scope = {};
      scope[variable] = i;
      const value = compiled.evaluate(scope);
      const nextScope = {};
      nextScope[variable] = i + step;
      const nextValue = compiled.evaluate(nextScope);
      if (value * nextValue <= 0) {
        const refinedSolution = refineRoot(compiled, i, i + step, 0.0001);
        if (refinedSolution !== null) {
          const roundedSolution =
            Math.round(refinedSolution * 1000000) / 1000000;
          if (
            !solutions.some((sol) => Math.abs(sol - roundedSolution) < 0.0001)
          ) {
            solutions.push(roundedSolution);
          }
        }
      }
      if (Math.abs(value) < 0.0001) {
        const roundedSolution = Math.round(i * 1000000) / 1000000;
        if (
          !solutions.some((sol) => Math.abs(sol - roundedSolution) < 0.0001)
        ) {
          solutions.push(roundedSolution);
        }
      }
    }
    return solutions;
  };
  const refineRoot = (compiled, left, right, tolerance) => {
    let mid, leftValue, midValue;
    for (let i = 0; i < 50; i++) {
      mid = (left + right) / 2;
      const leftScope = {};
      leftScope[variable] = left;
      leftValue = compiled.evaluate(leftScope);
      const midScope = {};
      midScope[variable] = mid;
      midValue = compiled.evaluate(midScope);
      if (Math.abs(midValue) < tolerance) {
        return mid;
      }
      if (leftValue * midValue <= 0) {
        right = mid;
      } else {
        left = mid;
      }
      if (Math.abs(right - left) < tolerance) {
        return mid;
      }
    }
    return null;
  };
  const formatNumber = (num) => {
    if (Math.abs(Math.round(num) - num) < 0.0000001) {
      return Math.round(num);
    }
    const piFactors = [1 / 6, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 5 / 6, 1, 2];
    for (const factor of piFactors) {
      if (Math.abs(num - factor * Math.PI) < 0.0000001) {
        if (factor === 1) return "π";
        if (factor === 2) return "2π";
        return `${factor === 1 ? "" : factor}π`;
      }
      if (Math.abs(num + factor * Math.PI) < 0.0000001) {
        if (factor === 1) return "-π";
        if (factor === 2) return "-2π";
        return `-${factor === 1 ? "" : factor}π`;
      }
    }
    if (Math.abs(num) < 1000 && Math.abs(num) > 0.001) {
      return num.toFixed(6).replace(/\.?0+$/, "");
    }
    return num.toString();
  };
  const formatSolution = (solutions, type) => {
    if (!solutions || solutions.length === 0) {
      return "No solutions found in search range";
    }
    const formattedSolutions = solutions.map((sol) => {
      if (type === "trigonometric") {
        return formatNumber(sol);
      }
      return formatNumber(sol);
    });
    return `${variable} = ${formattedSolutions.join(" or " + variable + " = ")}`;
  };
  const solveEquation = () => {
    setError("");
    try {
      if (!equation.trim()) {
        setError("Please enter an equation");
        return;
      }
      let processedEquation = equation
        .replace(/sin\^2/g, "sin^2")
        .replace(/cos\^2/g, "cos^2")
        .replace(/\^(\d+)/g, "^($1)");
      const detectedType = detectEquationType(processedEquation);
      setEquationType(detectedType);
      const isEquation = processedEquation.includes("=");
      if (isEquation) {
        const [leftSide, rightSide] = processedEquation
          .split("=")
          .map((side) => side.trim());
        if (advancedMode) {
          let solutions = [];
          switch (detectedType) {
            case "logarithmic":
              solutions = solveLogarithmic(leftSide, rightSide);
              break;
            case "trigonometric":
              solutions = solveTrigonometric(leftSide, rightSide);
              break;
            case "exponential":
              solutions = solveExponential(leftSide, rightSide);
              break;
            default:
              try {
                const expr = math.parse(`${leftSide}-(${rightSide})`);
                const simplified = math.simplify(expr);
                const solved = math.solve(simplified, variable);
                if (Array.isArray(solved)) {
                  solutions = solved.map((sol) => parseFloat(sol));
                } else {
                  solutions = [parseFloat(solved)];
                }
              } catch (err) {
                const expr = `${leftSide}-(${rightSide})`;
                solutions = solveNumerically(expr);
              }
          }
          setSolution(formatSolution(solutions, detectedType));
        } else {
          try {
            const result = math.evaluate(processedEquation);
            setSolution(`${result}`);
          } catch (err) {
            setError(
              "Couldn't evaluate equation. Try advanced mode for equations with variables."
            );
          }
        }
      } else {
        try {
          const identityResult = checkIdentities(processedEquation);
          if (identityResult) {
            setSolution(identityResult);
          } else {
            let evalEquation = processedEquation.replace(
              /e\^([^+\-*/\s]+)/g,
              "exp($1)"
            );
            if (advancedMode && evalEquation.includes(variable)) {
              const simplified = math.simplify(evalEquation).toString();
              setSolution(`Simplified: ${simplified}`);
            } else {
              const result = math.evaluate(evalEquation);
              setSolution(
                `${typeof result === "number" ? formatNumber(result) : result}`
              );
            }
          }
        } catch (err) {
          try {
            const simplified = math.simplify(processedEquation).toString();
            setSolution(`Simplified: ${simplified}`);
          } catch (simplifyErr) {
            setError(
              `Couldn't evaluate or simplify the expression: ${simplifyErr.message}`
            );
          }
        }
      }
      if (!error) {
        setHistory((prevHistory) => [
          {
            equation: processedEquation,
            solution,
            type: detectedType,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prevHistory.slice(0, 9),
        ]);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      solveEquation();
    }
  };
  const clearAll = () => {
    setEquation("");
    setSolution("");
    setError("");
  };
  const exampleEquations = [
    { text: "3x + 2 = 8", advanced: true, type: "general" },
    { text: "x^2 - 4 = 0", advanced: true, type: "general" },
    { text: "log(x) = 2", advanced: true, type: "logarithmic" },
    { text: "sin(x) = 0.5", advanced: true, type: "trigonometric" },
    { text: "2^x = 8", advanced: true, type: "exponential" },
    { text: "e^x = 10", advanced: true, type: "exponential" },
    { text: "(sin(x))^2 + (cos(x))^2", advanced: false, type: "trigonometric" },
    { text: "sin(30) + cos(60)", advanced: false, type: "trigonometric" },
  ];
  const insertExample = (example) => {
    setEquation(example.text);
    setAdvancedMode(example.advanced);
    setEquationType(example.type);
  };
  return (
    <div className={`${currentTheme.background} min-h-screen p-4 mt-20`}>
      <div
        className={`max-w-lg mx-auto ${currentTheme.card} rounded-lg shadow-lg p-6 ${currentTheme.text}`}
      >
        <h1 className="text-2xl font-bold mb-4">Equation Solver</h1>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter equation or expression (e.g., sin(x) = 0.5 or log(x) = 2)"
              className={`w-full p-2 ${currentTheme.text} bg-opacity-10 border ${currentTheme.border} rounded`}
            />
          </div>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={solveEquation}
              className={`p-2 ${currentTheme.primary} text-white rounded`}
            >
              Solve
            </button>
            <button
              onClick={clearAll}
              className={`p-2 ${currentTheme.secondary} rounded`}
            >
              Clear
            </button>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="advancedMode"
              checked={advancedMode}
              onChange={() => setAdvancedMode(!advancedMode)}
              className="mr-2"
            />
            <label htmlFor="advancedMode">
              Advanced Mode (for equations with variables)
            </label>
          </div>
          {advancedMode && (
            <div className="mb-4">
              <label className="block mb-1">Variable to solve for:</label>
              <input
                type="text"
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className={`w-16 p-1 ${currentTheme.text} bg-opacity-10 border ${currentTheme.border} rounded`}
                maxLength={1}
              />
            </div>
          )}
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}
        {solution && (
          <div className={`mb-6 p-4 ${currentTheme.highlight} rounded`}>
            <span className="font-bold">Solution:</span> {solution}
            {equationType !== "general" && (
              <div className="text-sm mt-1">
                Equation type detected: {equationType}
              </div>
            )}
          </div>
        )}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Examples:</h3>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {exampleEquations.map((ex, index) => (
              <button
                key={index}
                onClick={() => insertExample(ex)}
                className={`p-1 text-sm ${currentTheme.secondary} rounded`}
              >
                {ex.text}
              </button>
            ))}
          </div>
        </div>
        {history.length > 0 && (
          <div>
            <h3 className="font-bold mb-2">History:</h3>
            <div
              className={`max-h-60 overflow-y-auto border ${currentTheme.border} rounded p-2`}
            >
              {history.map((item, index) => (
                <div
                  key={index}
                  className={`p-2 mb-1 ${currentTheme.highlight} rounded text-sm cursor-pointer`}
                  onClick={() => setEquation(item.equation)}
                >
                  <div>
                    <strong>{item.equation}</strong>
                  </div>
                  <div>{item.solution}</div>
                  <div className="text-xs opacity-70">
                    {item.type !== "general" && `${item.type} • `}
                    {item.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 text-sm opacity-70">
          <p>Supported operations:</p>
          <ul className="list-disc ml-5 mt-1">
            <li>Algebraic: +, -, *, /, ^, (), etc.</li>
            <li>Logarithmic: log(x), ln(x), log10(x)</li>
            <li>
              Trigonometric: sin(x), cos(x), tan(x), asin(x), acos(x), atan(x)
            </li>
            <li>Exponential: e^x, exp(x), a^x</li>
            <li>Mathematical identities (e.g., sin²(x) + cos²(x) = 1)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default EquationSolver;
