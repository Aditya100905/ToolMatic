import React, { useState } from "react";
import { simplify, evaluate, derivative, parse, rationalize } from "mathjs";

const MathSolver = ({ theme = "light" }) => {
  const [equation, setEquation] = useState("");
  const [solution, setSolution] = useState("");
  const [error, setError] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [history, setHistory] = useState([]);

  // Theme-based styling
  const isDark = theme === "dark";
  
  const themeStyles = {
    container: isDark ? "bg-gray-900" : "bg-white",
    header: isDark 
      ? "bg-gradient-to-r from-indigo-900 to-purple-900" 
      : "bg-gradient-to-r from-blue-600 to-indigo-700", headerText: isDark ? "text-gray-100" : "text-white", headerSubtext: isDark ? "text-indigo-200" : "text-blue-100", cardBg: isDark ? "bg-gray-800" : "bg-white", inputBg: isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900", inputBorder: isDark ? "border-gray-600" : "border-gray-300", inputFocus: isDark ? "focus:ring-purple-500 focus:border-purple-500" : "focus:ring-blue-500 focus:border-blue-500", primaryButton: isDark 
      ? "bg-purple-600 hover:bg-purple-700 text-white" 
      : "bg-blue-600 hover:bg-blue-700 text-white",
    secondaryButton: isDark 
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
      : "bg-gray-200 hover:bg-gray-300 text-gray-800",
    resultBox: isDark ? "bg-gray-750 border-gray-700" : "bg-blue-50 border-blue-100", resultTitle: isDark ? "text-purple-300" : "text-blue-800", resultLabel: isDark ? "text-gray-400" : "text-gray-700", resultText: isDark ? "text-gray-200" : "text-gray-900", divider: isDark ? "border-gray-700" : "border-gray-200", historyTitle: isDark ? "text-gray-400" : "text-gray-500", historyItem: isDark ? "hover:bg-gray-750" : "hover:bg-gray-100", historyText: isDark ? "text-gray-300" : "text-gray-800", historySubtext: isDark ? "text-gray-500" : "text-gray-500", infoText: isDark ? "text-gray-400" : "text-gray-500", errorBg: isDark ? "bg-red-900/30 border-red-800" : "bg-red-100 border-red-500", errorText: isDark ? "text-red-300" : "text-red-700",
  };

  const solveLinearEquation = (leftSide, rightSide) => {
    try {      const allVariables = new Set([
        ...(leftSide.match(/[a-zA-Z]/g) || []), 
        ...(rightSide.match(/[a-zA-Z]/g) || [])
      ]);
            if (allVariables.size === 0) {
        return "No variables found in equation";
      }      const variable = Array.from(allVariables)[0];      const parsedLeft = parse(leftSide);
      const parsedRight = parse(rightSide);      const subtracted = parse(`(${leftSide}) - (${rightSide})`);
      const standardForm = simplify(subtracted).toString();
      let withVariable = [];
      let withoutVariable = [];
    
      const terms = standardForm.replace(/\s+/g, '')
        .replace(/-/g, '+-')
        .split('+')
        .filter(term => term !== '');
      terms.forEach(term => {
        if (term.includes(variable)) {
          withVariable.push(term);
        } else {
          withoutVariable.push(term);
        }
      });
      let leftCoefficient = withVariable.length > 0
        ? simplify(withVariable.join('+'))
        : '0';
      let rightConstant = withoutVariable.length > 0
        ? simplify(`-(${withoutVariable.join('+')})`).toString()
        : '0';
      if (leftCoefficient.toString() === variable) {
        leftCoefficient = '1';
      } 
      else if (leftCoefficient.toString() === `-${variable}`) {
        leftCoefficient = '-1';
      }
      else {
        leftCoefficient = leftCoefficient.toString().replace(variable, '');
        if (leftCoefficient === '') leftCoefficient = '1';
        if (leftCoefficient === '-') leftCoefficient = '-1';
      }
      const solution = simplify(`(${rightConstant})/(${leftCoefficient})`).toString();
      
      return `${variable} = ${solution}`;
    } catch (err) {
      return `Error solving linear equation: ${err.message}`;
    }
  };
  const solveQuadraticEquation = (equation) => {
    try {
      const sides = equation.split('=');
      if (sides.length !== 2) {
        throw new Error("Invalid equation format");
      }
      
      const leftSide = sides[0].trim();
      const rightSide = sides[1].trim();
      
      // Find the variable (assuming one variable)
      const variables = new Set([
        ...(leftSide.match(/[a-zA-Z]/g) || []), 
        ...(rightSide.match(/[a-zA-Z]/g) || [])
      ]);
      
      if (variables.size === 0) {
        throw new Error("No variables found");
      }
      
      const variable = Array.from(variables)[0];
      
      // Get the standardized form ax² + bx + c = 0
      const standardForm = simplify(`(${leftSide}) - (${rightSide})`).toString();
      
      // Extract coefficients
      // We'll use a simplified approach that works for many quadratic equations
      
      // This regex looks for terms in the form of:
      // ax², ax^2, ax*x, a*x*x, a*x^2, etc.
      const quadraticTermRegex = new RegExp(`([+-]?\\s*\\d*\\.?\\d*\\s*\\*?\\s*${variable}\\s*\\^\\s*2|[+-]?\\s*\\d*\\.?\\d*\\s*\\*?\\s*${variable}\\s*\\*\\s*${variable})`, 'g');
      // This regex looks for terms in the form of:
      // bx, b*x, etc.
      const linearTermRegex = new RegExp(`([+-]?\\s*\\d*\\.?\\d*\\s*\\*?\\s*${variable}(?!\\^|\\*${variable}))`, 'g');
      
      // Extract terms
      const quadraticTerms = standardForm.match(quadraticTermRegex) || [];
      const linearTerms = standardForm.match(linearTermRegex) || [];
      
      // Remove extracted terms from the equation to find constant term
      let remaining = standardForm;
      [...quadraticTerms, ...linearTerms].forEach(term => {
        remaining = remaining.replace(term, '');
      });
      
      // Clean up remaining to find constant term
      remaining = remaining.replace(/[+\-\s]+$/, '').trim();
      if (remaining === '') remaining = '0';
      if (remaining === '+') remaining = '0';
      if (remaining === '-') remaining = '0';
      
      // Parse coefficients
      let a = 0, b = 0, c = 0;
      
      if (quadraticTerms.length > 0) {
        // Combine and simplify quadratic terms
        const combinedQuadratic = simplify(quadraticTerms.join('+')).toString();
        // Extract coefficient of x²
        const aMatch = combinedQuadratic.match(new RegExp(`([+-]?\\s*\\d*\\.?\\d*)\\s*\\*?\\s*${variable}(?:\\s*\\^\\s*2|\\s*\\*\\s*${variable})`));
        if (aMatch) {
          const aCoef = aMatch[1].trim();
          a = aCoef === '' ? 1 : aCoef === '-' ? -1 : parseFloat(aCoef);
        }
      }
      
      if (linearTerms.length > 0) {
        // Combine and simplify linear terms
        const combinedLinear = simplify(linearTerms.join('+')).toString();
        // Extract coefficient of x
        const bMatch = combinedLinear.match(new RegExp(`([+-]?\\s*\\d*\\.?\\d*)\\s*\\*?\\s*${variable}`));
        if (bMatch) {
          const bCoef = bMatch[1].trim();
          b = bCoef === '' ? 1 : bCoef === '-' ? -1 : parseFloat(bCoef);
        }
      }
      
      // Parse constant term
      try {
        c = evaluate(remaining);
      } catch (e) {
        c = 0;
      }
      
      // Apply quadratic formula: x = (-b ± sqrt(b² - 4ac)) / 2a
      if (a === 0) {
        // If a = 0, it's actually a linear equation
        if (b === 0) {
          if (c === 0) {
            return "Infinite solutions (identity)";
          } else {
            return "No solution (contradiction)";
          }
        } else {
          return `${variable} = ${-c / b}`;
        }
      } else {
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant < 0) {
          // Complex solutions
          const realPart = -b / (2 * a);
          const imaginaryPart = Math.sqrt(Math.abs(discriminant)) / (2 * a);
          
          return `${variable} = ${realPart.toFixed(4)} + ${imaginaryPart.toFixed(4)}i or ${realPart.toFixed(4)} - ${imaginaryPart.toFixed(4)}i`;
        } else if (discriminant === 0) {
          // One solution
          const solution = -b / (2 * a);
          return `${variable} = ${solution.toFixed(4)}`;
        } else {
          // Two solutions
          const solution1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const solution2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          return `${variable} = ${solution1.toFixed(4)} or ${variable} = ${solution2.toFixed(4)}`;
        }
      }
    } catch (err) {
      return `Error solving quadratic equation: ${err.message}`;
    }
  };

  // Check if an equation is likely to be quadratic
  const isQuadraticEquation = (equation) => {
    const variables = equation.match(/[a-zA-Z]/g) || [];
    if (variables.length === 0) return false;
    
    const variable = variables[0];
    const squared = new RegExp(`${variable}\\s*\\^\\s*2|${variable}\\s*\\*\\s*${variable}`, 'g');
    
    return squared.test(equation);
  };

  const handleSolve = () => {
    if (!equation.trim()) {
      setError("Please enter a valid equation or expression.");
      setSolution("");
      return;
    }

    setIsCalculating(true);
    setError("");

    setTimeout(() => {
      try {
        let result = "";
        let simplified = "";
        let derivativeResult = "";
        let steps = [];
        const isEquation = equation.includes("=");

        if (isEquation) {
          const sides = equation.split("=");
          
          if (sides.length === 2) {
            const leftSide = sides[0].trim();
            const rightSide = sides[1].trim();
            
            // Determine if equation is quadratic
            if (isQuadraticEquation(`${leftSide} - (${rightSide})`)) {
              steps.push("Identified as a quadratic equation");
              steps.push(`Standard form: ${leftSide} = ${rightSide}`);
              steps.push("Using quadratic formula: x = (-b ± √(b² - 4ac)) / 2a");
              result = solveQuadraticEquation(equation);
            } else {
              steps.push("Identified as a linear equation");
              steps.push(`Standard form: ${leftSide} = ${rightSide}`);
              steps.push("Moving all terms with the variable to one side");
              result = solveLinearEquation(leftSide, rightSide);
            }
            
            // Try to simplify both sides for display
            try {
              simplified = `${simplify(leftSide).toString()} = ${simplify(rightSide).toString()}`;
              steps.push(`Simplified form: ${simplified}`);
            } catch (err) {
              simplified = "Cannot simplify equation";
            }
          } else {
            result = "Invalid equation format";
          }
        } else {
          // Handle expressions - this should work reliably
          try {
            steps.push("Processing mathematical expression");
            // Basic simplification
            simplified = simplify(equation).toString();
            steps.push(`Simplified form: ${simplified}`);
          } catch (err) {
            simplified = "Cannot simplify";
          }

          try {
            // Evaluation
            let evaluated = evaluate(equation);
            steps.push("Evaluating expression");
            
            // Handle numerical result
            if (typeof evaluated === 'number') {
              // For better display of exact values
              if (equation.includes('pi') || equation.includes('PI') || equation.includes('π')) {
                // Special case for better display
                result = Number.isInteger(evaluated) ? evaluated.toString() : evaluated.toFixed(8);
              } else {
                result = Number.isInteger(evaluated) ? evaluated.toString() : evaluated.toFixed(8);
              }
              
              // Check if we can rationalize (convert to fraction) for cleaner display
              try {
                const rational = rationalize(equation);
                if (rational) {
                  const rationalStr = rational.toString();
                  if (rationalStr !== simplified) {
                    steps.push(`Rational form: ${rationalStr}`);
                  }
                }
              } catch (err) {
                // Silently fail, rationalization is just a nice-to-have
              }
            } else {
              // For non-numerical results
              result = String(evaluated);
            }
            steps.push(`Result: ${result}`);
          } catch (err) {
            result = "Cannot evaluate";
          }

          // Calculate derivative if there are variables
          try {
            // Check if there's a variable to differentiate with respect to
            const variableMatch = equation.match(/[a-zA-Z]/g);
            if (variableMatch && variableMatch.length > 0) {
              const variable = variableMatch[0]; // Use first variable found
              derivativeResult = derivative(equation, variable).toString();
              steps.push(`Derivative with respect to ${variable}: ${derivativeResult}`);
            }
          } catch (err) {
            derivativeResult = "";
          }
        }

        const solutionObj = {
          equation,
          simplified: simplified || "N/A",
          result: result || "N/A",
          derivative: derivativeResult || "N/A",
          steps: steps
        };

        setSolution(solutionObj);
        setHistory(prev => [solutionObj, ...prev.slice(0, 4)]);
        setIsCalculating(false);
      } catch (err) {
        setError("Error processing the input: " + (err.message || "Unknown error"));
        setSolution("");
        setIsCalculating(false);
      }
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSolve();
    }
  };

  const loadFromHistory = (item) => {
    setEquation(item.equation);
    setSolution(item);
    setError("");
  };

  const clearAll = () => {
    setEquation("");
    setSolution("");
    setError("");
  };

  // Function to provide examples to users
  const useExample = (exampleEquation) => {
    setEquation(exampleEquation);
    setSolution("");
    setError("");
  };

  return (
    <div className={`flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-6 transition-colors duration-200 ${themeStyles.container}`}>
      <div className={`w-full rounded-lg shadow-lg overflow-hidden ${themeStyles.cardBg} transition-colors duration-200`}>
        {/* Header */}
        <div className={`${themeStyles.header} p-4 md:p-6 transition-colors duration-200`}>
          <h2 className={`text-xl md:text-2xl font-bold ${themeStyles.headerText}`}>Advanced Math Solver</h2>
          <p className={`${themeStyles.headerSubtext} text-sm md:text-base mt-1`}>
            Solve equations, simplify expressions, and calculate derivatives
          </p>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6">
          <div className="relative">
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., 2*x + 3 = 7, x^2 - 4 = 0, or sin(pi/6)"
              className={`w-full p-3 border rounded-lg outline-none transition-all text-base md:text-lg
                ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputFocus}`}
            />
            {equation && (
              <button 
                onClick={clearAll}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 
                  ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Clear input"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleSolve}
              disabled={isCalculating}
              className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors duration-200 
                flex items-center justify-center disabled:opacity-70 ${themeStyles.primaryButton}`}
            >
              {isCalculating ? (
                <span>Calculating...</span>
              ) : (
                <span>Solve</span>
              )}
            </button>
            
            <button
              onClick={clearAll}
              className={`font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${themeStyles.secondaryButton}`}
            >
              Clear
            </button>
          </div>
          
          {/* Example buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`text-xs ${themeStyles.resultLabel}`}>Try:</span>
            <button 
              onClick={() => useExample("2*x + 3 = 7")}
              className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              2*x + 3 = 7
            </button>
            <button 
              onClick={() => useExample("x^2 - 4 = 0")}
              className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              x^2 - 4 = 0
            </button>
            <button 
              onClick={() => useExample("x^2 + 2*x + 1 = 0")}
              className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              x^2 + 2*x + 1 = 0
            </button>
            <button 
              onClick={() => useExample("sin(pi/6) + cos(pi/3)")}
              className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              sin(pi/6) + cos(pi/3)
            </button>
          </div>
        </div>

        {/* Results Area */}
        {error && (
          <div className={`mx-4 md:mx-6 mb-4 p-3 border-l-4 rounded ${themeStyles.errorBg}`}>
            <p className="font-medium">Error</p>
            <p className={themeStyles.errorText}>{error}</p>
          </div>
        )}

        {solution && (
          <div className={`mx-4 md:mx-6 mb-4 p-4 rounded-lg border transition-colors duration-200 ${themeStyles.resultBox}`}>
            <h3 className={`text-lg font-semibold mb-2 ${themeStyles.resultTitle}`}>Solution</h3>
            
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row">
                <span className={`font-medium min-w-24 ${themeStyles.resultLabel}`}>Input:</span>
                <span className={themeStyles.resultText}>{solution.equation}</span>
              </div>
              
              {solution.simplified !== "N/A" && (
                <div className="flex flex-col md:flex-row">
                  <span className={`font-medium min-w-24 ${themeStyles.resultLabel}`}>Simplified:</span>
                  <span className={themeStyles.resultText}>{solution.simplified}</span>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row">
                <span className={`font-medium min-w-24 ${themeStyles.resultLabel}`}>Result:</span>
                <span className={themeStyles.resultText}>{solution.result}</span>
              </div>
              
              {solution.derivative !== "N/A" && solution.derivative && (
                <div className="flex flex-col md:flex-row">
                  <span className={`font-medium min-w-24 ${themeStyles.resultLabel}`}>Derivative:</span>
                  <span className={themeStyles.resultText}>{solution.derivative}</span>
                </div>
              )}
              
              {/* Solution steps */}
              {solution.steps && solution.steps.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-gray-700">
                  <span className={`font-medium ${themeStyles.resultLabel}`}>Steps:</span>
                  <ol className={`mt-1 pl-5 list-decimal ${themeStyles.resultText}`}>
                    {solution.steps.map((step, index) => (
                      <li key={index} className="mt-1">{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className={`border-t px-4 md:px-6 py-4 transition-colors duration-200 ${themeStyles.divider}`}>
            <h3 className={`text-sm font-medium mb-2 ${themeStyles.historyTitle}`}>Recent Calculations</h3>
            <div className="space-y-2">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => loadFromHistory(item)}
                  className={`w-full text-left p-2 rounded transition-colors duration-150 
                    focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-purple-500' : 'focus:ring-blue-500'} 
                    ${themeStyles.historyItem}`}
                >
                  <div className={`text-sm font-medium ${themeStyles.historyText}`}>{item.equation}</div>
                  <div className={`text-xs ${themeStyles.historySubtext}`}>= {item.result}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Information */}
      <div className={`mt-6 text-sm text-center max-w-xl ${themeStyles.infoText}`}>
        <p>Supports linear equations (ax + b = c), quadratic equations (ax² + bx + c = 0), and expressions.</p>
        <p className="mt-1">Use "pi" for π, "*" for multiplication, "^" for exponents, and standard functions like sin(), cos(), etc.</p>
      </div>
    </div>
  );
};

export default MathSolver;