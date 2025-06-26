import { useState, useRef, useEffect } from "react";
import { History, Trash2, Clock, Calculator, Zap, BookOpen, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import * as math from 'mathjs';

export default function EnhancedCalculusSolver({ theme = 'light' }) {
  const [expression, setExpression] = useState("");
  const [variable, setVariable] = useState("x");
  const [operation, setOperation] = useState("derivative");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [bounds, setBounds] = useState({ lower: "", upper: "" });
  const [showBounds, setShowBounds] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFunctionPanel, setShowFunctionPanel] = useState(true);
  
  const expressionRef = useRef(null);

  // Load history from memory on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('calculusHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
      }
    } catch (error) {
      console.error('Failed to load history from localStorage:', error);
      setHistory([]);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem('calculusHistory', JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save history to localStorage:', error);
      }
    }
  }, [history]);

  const themeStyles = {
    dark: {
      bg: "bg-[#0e0e0e]",
      text: "text-gray-100",
      textSecondary: "text-gray-300",
      textMuted: "text-gray-400",
      input: "bg-[#121212] text-gray-200 border-[#2a2a2a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      button: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md",
      select: "bg-[#121212] text-gray-200 border-[#2a2a2a] focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      card: "bg-[#121212] border-[#2a2a2a] shadow-xl",
      historyItem: "bg-[#1a1a1a] hover:bg-[#252525]",
      tab: "bg-[#1a1a1a] hover:bg-[#252525]",
      activeTab: "bg-blue-600 text-white shadow-md",
      error: "text-red-300 bg-red-900/20 border border-red-800/50",
      success: "text-green-300 bg-green-900/20 border border-green-800/50",
      info: "text-blue-300 bg-blue-900/20 border border-blue-800/50",
      secondary: "bg-[#2a2a2a] hover:bg-[#353535] active:bg-[#404040] text-gray-200 shadow",
      actionButton: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md",
      accent: "text-blue-400",
      primaryGradient: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
      secondaryGradient: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
      result: "bg-[#1a1a1a] border-[#2a2a2a]",
      alternativeFormat: "bg-[#1a1a1a] bg-opacity-80",
    },
    light: {
      bg: "bg-gray-50",
      text: "text-gray-900",
      textSecondary: "text-gray-700",
      textMuted: "text-gray-500",
      input: "bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      button: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-md",
      select: "bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
      card: "bg-white border-gray-200 shadow-lg",
      historyItem: "bg-gray-100 hover:bg-gray-200",
      tab: "bg-gray-200 hover:bg-gray-300",
      activeTab: "bg-blue-500 text-white shadow-md",
      error: "text-red-600 bg-red-100 border border-red-300",
      success: "text-green-600 bg-green-100 border border-green-300",
      info: "text-blue-600 bg-blue-100 border border-blue-300",
      secondary: "bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 shadow",
      actionButton: "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white shadow-md",
      accent: "text-blue-600",
      primaryGradient: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
      secondaryGradient: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      result: "bg-gray-50 border-gray-200",
      alternativeFormat: "bg-blue-50",
    },
  };

  const currentTheme = themeStyles[theme];

  const functionCategories = {
    basic: [
      { label: "x²", value: "x^2", tooltip: "x squared" },
      { label: "x³", value: "x^3", tooltip: "x cubed" },
      { label: "√x", value: "sqrt(x)", tooltip: "square root" },
      { label: "∛x", value: "cbrt(x)", tooltip: "cube root" },
      { label: "1/x", value: "1/x", tooltip: "reciprocal" },
      { label: "|x|", value: "abs(x)", tooltip: "absolute value" }
    ],
    trigonometric: [
      { label: "sin(x)", value: "sin(x)", tooltip: "sine function" },
      { label: "cos(x)", value: "cos(x)", tooltip: "cosine function" },
      { label: "tan(x)", value: "tan(x)", tooltip: "tangent function" },
      { label: "sec(x)", value: "sec(x)", tooltip: "secant function" },
      { label: "csc(x)", value: "csc(x)", tooltip: "cosecant function" },
      { label: "cot(x)", value: "cot(x)", tooltip: "cotangent function" }
    ],
    exponential: [
      { label: "eˣ", value: "e^x", tooltip: "exponential function" },
      { label: "2ˣ", value: "2^x", tooltip: "2 to the power of x" },
      { label: "ln(x)", value: "ln(x)", tooltip: "natural logarithm" },
      { label: "log(x)", value: "log(x)", tooltip: "logarithm base 10" },
      { label: "log₂(x)", value: "log2(x)", tooltip: "logarithm base 2" }
    ],
    constants: [
      { label: "π", value: "pi", tooltip: "pi constant (≈3.14159)" },
      { label: "e", value: "e", tooltip: "Euler's number (≈2.71828)" },
      { label: "φ", value: "phi", tooltip: "Golden ratio (≈1.618)" }
    ]
  };

  // Enhanced integration table with more functions
  const knownIntegrals = {
    'sin(x)': '-cos(x)',
    'cos(x)': 'sin(x)',
    'tan(x)': 'ln(abs(sec(x)))',
    'sec(x)': 'ln(abs(sec(x) + tan(x)))',
    'csc(x)': '-ln(abs(csc(x) + cot(x)))',
    'cot(x)': 'ln(abs(sin(x)))',
    'sec(x)^2': 'tan(x)',
    'csc(x)^2': '-cot(x)',
    'sec(x)*tan(x)': 'sec(x)',
    'csc(x)*cot(x)': '-csc(x)',
    'asin(x)': 'x*asin(x) + sqrt(1-x^2)',
    'acos(x)': 'x*acos(x) - sqrt(1-x^2)',
    'atan(x)': 'x*atan(x) - (1/2)*ln(1+x^2)',
    '1/sqrt(1-x^2)': 'asin(x)',
    '1/(1+x^2)': 'atan(x)',
    '1/sqrt(x^2-1)': 'ln(abs(x + sqrt(x^2-1)))',
    'e^x': 'e^x',
    '1/x': 'ln(abs(x))',
    'sqrt(x)': '(2/3)*x^(3/2)',
    '1/sqrt(x)': '2*sqrt(x)',
    'ln(x)': 'x*ln(x) - x',
    'log(x)': 'x*log(x)/ln(10) - x/ln(10)',
    'sinh(x)': 'cosh(x)',
    'cosh(x)': 'sinh(x)',
    'tanh(x)': 'ln(cosh(x))',
    'sech(x)^2': 'tanh(x)',
    'csch(x)^2': '-coth(x)',
    'sech(x)*tanh(x)': '-sech(x)',
    'csch(x)*coth(x)': '-csch(x)'
  };

  const differentiate = (expr, variable) => {
    try {
      const derivative = math.derivative(expr, variable);
      const simplified = math.simplify(derivative);
      return simplified.toString();
    } catch (error) {
      throw new Error("Unable to compute derivative: " + error.message);
    }
  };

  const integrate = (expr, variable, lowerBound = null, upperBound = null) => {
    try {
      if (lowerBound !== null && upperBound !== null) {
        // For definite integrals, use numerical integration
        const compiled = math.compile(expr);
        const scope = {};
        
        const f = (x) => {
          scope[variable] = x;
          return compiled.evaluate(scope);
        };

        const result = adaptiveSimpson(f, lowerBound, upperBound, 1e-10);
        
        return result.toFixed(8);
      } else {
        // For indefinite integrals, use enhanced symbolic integration
        return findAntiderivativeAdvanced(expr, variable) + " + C";
      }
    } catch (error) {
      throw new Error("Unable to compute integral: " + error.message);
    }
  };

  const adaptiveSimpson = (f, a, b, tolerance) => {
    const simpson = (f, a, b) => {
      const h = (b - a) / 6;
      return h * (f(a) + 4*f((a+b)/2) + f(b));
    };
    
    const adaptiveHelper = (f, a, b, tolerance, S) => {
      const c = (a + b) / 2;
      const left = simpson(f, a, c);
      const right = simpson(f, c, b);
      
      if (Math.abs(left + right - S) <= 15 * tolerance) {
        return left + right + (left + right - S) / 15;
      }
      
      return adaptiveHelper(f, a, c, tolerance/2, left) + adaptiveHelper(f, c, b, tolerance/2, right);
    };
    
    const S = simpson(f, a, b);
    return adaptiveHelper(f, a, b, tolerance, S);
  };

  const findAntiderivativeAdvanced = (expr, variable) => {
    try {
      // First, try to simplify the expression
      const simplified = math.simplify(expr).toString();
      
      // Check if it's a direct match in our known integrals
      if (knownIntegrals[simplified]) {
        return knownIntegrals[simplified];
      }
      
      // Handle sums and differences by splitting the expression
      if (simplified.includes('+') || simplified.includes('-')) {
        return integrateSum(simplified, variable);
      }
      
      // Handle products with constants
      const constantMatch = simplified.match(/^([+-]?\d+(?:\.\d+)?)\s*\*\s*(.+)$/);
      if (constantMatch) {
        const constant = parseFloat(constantMatch[1]);
        const functionPart = constantMatch[2];
        const integral = findAntiderivativeAdvanced(functionPart, variable);
        return `${constant}*(${integral})`;
      }
      
      // Handle basic power functions
      if (simplified === variable) return `${variable}^2/2`;
      if (simplified === '1') return variable;
      if (simplified.match(/^\d+$/)) return `${simplified}*${variable}`;
      
      // Handle power functions with coefficients
      const powerPattern = new RegExp(`^([+-]?\\d*(?:\\.\\d+)?)\\*?${variable}\\^([+-]?\\d+(?:\\.\\d+)?)$`);
      const powerMatch = simplified.match(powerPattern);
      if (powerMatch) {
        const coeff = powerMatch[1] === '' ? 1 : (powerMatch[1] === '-' ? -1 : parseFloat(powerMatch[1]));
        const power = parseFloat(powerMatch[2]);
        if (power !== -1) {
          const newCoeff = coeff / (power + 1);
          const newPower = power + 1;
          return `${newCoeff}*${variable}^${newPower}`;
        }
      }
      
      // Handle linear functions
      const constPattern = new RegExp(`^([+-]?\\d+(?:\\.\\d+)?)\\*${variable}$`);
      const constMatch = simplified.match(constPattern);
      if (constMatch) {
        const coeff = parseFloat(constMatch[1]);
        return `${coeff/2}*${variable}^2`;
      }
      
      // Handle 1/x
      if (simplified === `1/${variable}`) return `ln(abs(${variable}))`;
      
      // Handle specific trigonometric functions
      for (const [pattern, integral] of Object.entries(knownIntegrals)) {
        if (simplified.includes(pattern.replace('x', variable))) {
          return integral.replace(/x/g, variable);
        }
      }
      
      // Try using mathjs for more complex expressions
      try {
        // Use mathjs to attempt symbolic integration
        const result = math.evaluate(`integrate(${expr}, ${variable})`);
        if (result && typeof result === 'string') {
          return result;
        }
      } catch (e) {
        // If mathjs fails, continue with our custom logic
      }
      
      // Last resort: use numerical approximation message
      throw new Error(`Symbolic integration not available for "${expr}". Try using definite integral with bounds for numerical result.`);
      
    } catch (error) {
      throw new Error(`Integration failed: ${error.message}`);
    }
  };

  const integrateSum = (expr, variable) => {
    // Split the expression into terms
    const terms = expr.split(/([+-])/).filter(term => term.trim() !== '');
    let result = '';
    let currentSign = '+';
    
    for (let i = 0; i < terms.length; i++) {
      const term = terms[i].trim();
      
      if (term === '+' || term === '-') {
        currentSign = term;
        continue;
      }
      
      try {
        const termIntegral = findAntiderivativeAdvanced(term, variable);
        if (result === '') {
          result = currentSign === '+' ? termIntegral : `-${termIntegral}`;
        } else {
          result += ` ${currentSign} ${termIntegral}`;
        }
      } catch (error) {
        // If we can't integrate a term, throw an error
        throw new Error(`Cannot integrate term: ${term}`);
      }
    }
    
    return result || '0';
  };

  const insertFunction = (value) => {
    const input = expressionRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newExpression = expression.substring(0, start) + value + expression.substring(end);
    setExpression(newExpression);
    
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + value.length, start + value.length);
    }, 0);
  };

  const addToHistory = (expr, op, variable, result) => {
    const historyItem = {
      id: Date.now(),
      expression: expr,
      operation: op,
      variable: variable,
      result: result,
      bounds: showBounds ? bounds : null,
      timestamp: new Date().toLocaleString()
    };
    setHistory(prev => [historyItem, ...prev.slice(0, 19)]); // Keep last 20 items
  };

  const loadFromHistory = (item) => {
    setExpression(item.expression);
    setOperation(item.operation);
    setVariable(item.variable);
    setResult(item.result);
    setShowResult(true);
    if (item.bounds) {
      setBounds(item.bounds);
      setShowBounds(true);
    }
    setShowHistory(false);
  };

const clearHistory = () => {
  setHistory([]);
  try {
    localStorage.removeItem('calculusHistory');
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy result:', err);
    }
  };

  const calculate = async () => {
    setError("");
    setResult("");
    setIsCalculating(true);

    if (!expression.trim()) {
      setError("Please enter a mathematical expression");
      setIsCalculating(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      let resultValue = "";

      if (operation === "derivative") {
        resultValue = differentiate(expression, variable);
      } else if (operation === "integral") {
        if (showBounds && bounds.lower !== "" && bounds.upper !== "") {
          const lower = parseFloat(bounds.lower);
          const upper = parseFloat(bounds.upper);
          if (isNaN(lower) || isNaN(upper)) {
            throw new Error("Invalid bounds. Please enter valid numbers.");
          }
          if (lower >= upper) {
            throw new Error("Lower bound must be less than upper bound.");
          }
          resultValue = integrate(expression, variable, lower, upper);
        } else {
          resultValue = integrate(expression, variable);
        }
      }

      setResult(resultValue);
      setShowResult(true);
      addToHistory(expression, operation, variable, resultValue);
    } catch (err) {
      setError(err.message);
      setShowResult(false);
    } finally {
      setIsCalculating(false);
    }
  };

  const clear = () => {
    setExpression("");
    setResult("");
    setError("");
    setShowResult(false);
    setBounds({ lower: "", upper: "" });
    setShowBounds(false);
    expressionRef.current?.focus();
  };

  const toggleBounds = () => {
    setShowBounds(!showBounds);
    if (!showBounds) {
      setBounds({ lower: "", upper: "" });
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-all duration-300`}>
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
            <div className="xl:col-span-3">
              <div className={`${currentTheme.card} rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border`}>
                <div className="mb-6 sm:mb-8">
                  <label className={`block text-sm font-semibold ${currentTheme.textSecondary} mb-3 sm:mb-4 flex items-center gap-2`}>
                    <Calculator className="w-4 h-4" />
                    Choose Operation
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => setOperation("derivative")}
                      className={`group py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        operation === "derivative"
                          ? `${currentTheme.primaryGradient} text-white shadow-lg`
                          : `${currentTheme.secondary} hover:shadow-md`
                      }`}
                    >
                      <div className="text-xl sm:text-2xl mb-1">d/dx</div>
                      <div className="text-sm opacity-90">Derivative</div>
                      <div className="text-xs opacity-70 mt-1">Find rate of change</div>
                    </button>
                    <button
                      onClick={() => setOperation("integral")}
                      className={`group py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        operation === "integral"
                          ? `${currentTheme.primaryGradient} text-white shadow-lg`
                          : `${currentTheme.secondary} hover:shadow-md`
                      }`}
                    >
                      <div className="text-xl sm:text-2xl mb-1">∫</div>
                      <div className="text-sm opacity-90">Integral</div>
                      <div className="text-xs opacity-70 mt-1">Find area under curve</div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="lg:col-span-1">
                    <label className={`block text-sm font-semibold ${currentTheme.textSecondary} mb-3`}>
                      Variable
                    </label>
                    <input
                      type="text"
                      value={variable}
                      onChange={(e) => setVariable(e.target.value)}
                      className={`w-full p-3 border rounded-xl ${currentTheme.input} text-center font-mono text-lg`}
                      placeholder="x"
                    />
                  </div>

                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-3">
                      <label className={`block text-sm font-semibold ${currentTheme.textSecondary} flex items-center gap-2`}>
                        <Zap className="w-4 h-4" />
                        Quick Functions
                      </label>
                      <button
                        onClick={() => setShowFunctionPanel(!showFunctionPanel)}
                        className={`p-2 ${currentTheme.secondary} rounded-lg transition-colors`}
                      >
                        {showFunctionPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {showFunctionPanel && (
                      <div className="space-y-3 sm:space-y-4">
                        {Object.entries(functionCategories).map(([category, functions]) => (
                          <div key={category}>
                            <h4 className={`text-xs font-medium ${currentTheme.textMuted} mb-2 uppercase tracking-wider`}>
                              {category}
                            </h4>
                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                              {functions.map((func, index) => (
                                <button
                                  key={index}
                                  onClick={() => insertFunction(func.value)}
                                  title={func.tooltip}
                                  className={`p-2 ${currentTheme.secondary} rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95`}
                                >
                                  {func.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6 sm:mb-8">
                  <label className={`block text-sm font-semibold ${currentTheme.textSecondary} mb-3 flex items-center gap-2`}>
                    <BookOpen className="w-4 h-4" />
                    Mathematical Expression
                  </label>
                  <input
                    ref={expressionRef}
                    type="text"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && calculate()}
                    className={`w-full p-3 sm:p-4 border rounded-xl ${currentTheme.input} font-mono text-base sm:text-lg placeholder-opacity-50`}
                    placeholder="Enter your expression (e.g., tan(x) + e^x)"
                  />
                  <div className={`mt-2 text-xs ${currentTheme.textMuted} flex flex-wrap gap-4`}>
                    <span>• Use * for multiplication</span>
                    <span>• Use ^ for exponents</span>
                    <span>• Use parentheses for grouping</span>
                    <span>• Press Enter to calculate</span>
                  </div>
                </div>

                {operation === "integral" && (
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <input type="checkbox"
                        id="bounds"
                        checked={showBounds}
                        onChange={toggleBounds}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="bounds" className={`text-sm font-medium ${currentTheme.textSecondary}`}>
                        Definite Integral (with bounds)
                      </label>
                    </div>
                    {showBounds && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs font-medium ${currentTheme.textMuted} mb-2`}>
                            Lower Bound
                          </label>
                          <input
                            type="number"
                            value={bounds.lower}
                            onChange={(e) => setBounds({...bounds, lower: e.target.value})}
                            className={`w-full p-3 border rounded-xl ${currentTheme.input} text-center`}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium ${currentTheme.textMuted} mb-2`}>
                            Upper Bound
                          </label>
                          <input
                            type="number"
                            value={bounds.upper}
                            onChange={(e) => setBounds({...bounds, upper: e.target.value})}
                            className={`w-full p-3 border rounded-xl ${currentTheme.input} text-center`}
                            placeholder="1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <button
                    onClick={calculate}
                    disabled={isCalculating || !expression.trim()}
                    className={`flex-1 py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${currentTheme.primaryGradient} text-white shadow-lg hover:shadow-xl`}
                  >
                    {isCalculating ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Computing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Calculate {operation === "derivative" ? "Derivative" : "Integral"}
                      </div>
                    )}
                  </button>
                  <button
                    onClick={clear}
                    className={`py-3 sm:py-4 px-4 sm:px-6 rounded-xl ${currentTheme.secondary} transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </div>
                  </button>
                </div>

                {error && (
                  <div className={`p-4 rounded-xl ${currentTheme.error} mb-6`}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">!</div>
                      <div className="font-medium">Error</div>
                    </div>
                    <div className="mt-2 text-sm">{error}</div>
                  </div>
                )}

                {showResult && result && (
                  <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${currentTheme.success} border`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">✓</div>
                        <div className="font-semibold">
                          {operation === "derivative" ? "Derivative" : "Integral"} Result
                        </div>
                      </div>
                      <button
                        onClick={copyResult}
                        className={`p-2 ${currentTheme.secondary} rounded-lg transition-all duration-200 hover:shadow-md`}
                        title="Copy result"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className={`p-4 rounded-lg ${currentTheme.result} font-mono text-lg break-all`}>
                      {result}
                    </div>
                    {operation === "integral" && showBounds && bounds.lower !== "" && bounds.upper !== "" && (
                      <div className={`mt-3 p-3 rounded-lg ${currentTheme.alternativeFormat} text-sm`}>
                        <div className="font-medium mb-1">Definite Integral:</div>
                        <div className="font-mono">
                          ∫[{bounds.lower}→{bounds.upper}] {expression} d{variable} = {result}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="xl:col-span-1">
              <div className={`${currentTheme.card} rounded-2xl sm:rounded-3xl p-4 sm:p-6 border sticky top-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold text-lg ${currentTheme.text} flex items-center gap-2`}>
                    <History className="w-5 h-5" />
                    History
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className={`p-2 ${currentTheme.secondary} rounded-lg transition-colors`}
                    >
                      {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className={`p-2 ${currentTheme.secondary} rounded-lg transition-colors hover:bg-red-600 hover:text-white`}
                        title="Clear all history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {showHistory && (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.length === 0 ? (
                      <div className={`text-center py-8 ${currentTheme.textMuted}`}>
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">No calculations yet</div>
                      </div>
                    ) : (
                      history.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => loadFromHistory(item)}
                          className={`p-3 rounded-xl ${currentTheme.historyItem} border cursor-pointer transition-all duration-200 hover:shadow-md`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              item.operation === 'derivative' ? currentTheme.primaryGradient : currentTheme.secondaryGradient
                            } text-white font-medium`}>
                              {item.operation === 'derivative' ? 'd/dx' : '∫'}
                            </div>
                            <div className={`text-xs ${currentTheme.textMuted}`}>
                              {item.variable}
                            </div>
                          </div>
                          <div className={`text-sm font-mono ${currentTheme.textSecondary} mb-1 truncate`}>
                            {item.expression}
                          </div>
                          <div className={`text-xs font-mono ${currentTheme.textMuted} truncate`}>
                            = {item.result}
                          </div>
                          <div className={`text-xs ${currentTheme.textMuted} mt-2`}>
                            {item.timestamp}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                <div className={`mt-6 p-4 rounded-xl ${currentTheme.info}`}>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Quick Tips
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Use parentheses for clarity</li>
                    <li>• Try sin(x), cos(x), tan(x)</li>
                    <li>• Use e^x for exponentials</li>
                    <li>• Use ln(x) for natural log</li>
                    <li>• Powers: x^2, x^3, etc.</li>
                    <li>• Constants: pi, e</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}