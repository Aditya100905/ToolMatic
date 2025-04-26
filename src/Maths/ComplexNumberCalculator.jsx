import { isResultSet } from 'mathjs';
import { useState, useEffect, useRef } from 'react';

export default function ComplexNumberCalculator({ theme = 'light' }) {
  const [real1, setReal1] = useState('');
  const [imag1, setImag1] = useState('');
  const [real2, setReal2] = useState('');
  const [imag2, setImag2] = useState('');
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState({ real: 0, imag: 0 });
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [displayMode, setDisplayMode] = useState('rectangular');
  const [precision, setPrecision] = useState(4);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');
  
  const calculatorRef = useRef(null);
  const real1Ref = useRef(null);
  
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('complexCalcHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage:', e);
    } finally {
      setHistoryLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!historyLoaded) return;
    try {
      localStorage.setItem('complexCalcHistory', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage:', e);
      showToastNotification('Could not save history to local storage', 'error');
    }
  }, [history, historyLoaded]);
  
  // Auto-hide error message
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Add keyboard shortcut for calculation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        calculate();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [real1, imag1, real2, imag2, operation]);
  
  // Set focus to the first input on initial load
  useEffect(() => {
    if (real1Ref.current) {
      real1Ref.current.focus();
    }
  }, []);

  // Theme styles with improved color schemes and modern UI
  const themeStyles = {
    dark: {
      bg: 'bg-black',
      text: 'text-white',
      input: 'bg-black text-white border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md',
      select: 'bg-black text-white border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      card: 'bg-[#1E1E1E] border-slate-700 shadow-xl',
      historyItem: 'bg-gray-900 hover:bg-slate-600',
      tab: 'bg-slate-800 hover:bg-slate-700',
      activeTab: 'bg-blue-600 text-white shadow-md',
      error: 'text-red-400 bg-red-900/30 border border-red-800',
      success: 'text-green-400 bg-green-900/30 border border-green-800',
      info: 'text-blue-400 bg-blue-900/30 border border-blue-800',
      secondary: 'bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white shadow',
      actionButton: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md',
      accent: 'text-blue-400',
      toast: {
        error: 'bg-red-900 border-l-4 border-red-500 text-white',
        success: 'bg-green-900 border-l-4 border-green-500 text-white',
        info: 'bg-blue-900 border-l-4 border-blue-500 text-white'
      }
    },
    light: {
      bg: 'bg-gray-50',
      text: 'text-gray-900',
      input: 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-md',
      select: 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      card: 'bg-white border-gray-200 shadow-lg',
      historyItem: 'bg-gray-100 hover:bg-gray-200',
      tab: 'bg-gray-200 hover:bg-gray-300',
      activeTab: 'bg-blue-500 text-white shadow-md',
      error: 'text-red-600 bg-red-100 border border-red-300',
      success: 'text-green-600 bg-green-100 border border-green-300',
      info: 'text-blue-600 bg-blue-100 border border-blue-300',
      secondary: 'bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 shadow',
      actionButton: 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white shadow-md',
      accent: 'text-blue-600',
      toast: {
        error: 'bg-red-100 border-l-4 border-red-500 text-red-700',
        success: 'bg-green-100 border-l-4 border-green-500 text-green-700',
        info: 'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
      }
    }
  };

  const styles = themeStyles[theme];

  const showToastNotification = (message, type = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const calculate = () => {
    setError('');
    
    // Input validation
    if (needsSecondNumber && (real1 === '' && imag1 === '' || real2 === '' && imag2 === '')) {
      setError('Please enter complex numbers for calculation');
      showToastNotification('Please enter complex numbers for calculation');
      return;
    }
    
    if (!needsSecondNumber && (real1 === '' && imag1 === '')) {
      setError('Please enter a complex number for calculation');
      showToastNotification('Please enter a complex number for calculation');
      return;
    }
    
    // Convert inputs to numbers
    const a = parseFloat(real1) || 0;
    const b = parseFloat(imag1) || 0;
    const c = parseFloat(real2) || 0;
    const d = parseFloat(imag2) || 0;

    let resultReal = 0;
    let resultImag = 0;

    try {
      switch (operation) {
        case '+':
          resultReal = a + c;
          resultImag = b + d;
          break;
        case '-':
          resultReal = a - c;
          resultImag = b - d;
          break;
        case '*':
          resultReal = a * c - b * d;
          resultImag = a * d + b * c;
          break;
        case '/':
          const denominator = c * c + d * d;
          if (denominator === 0 || isNaN(denominator)) {
            throw new Error("Division by zero is undefined");
          }
          resultReal = (a * c + b * d) / denominator;
          resultImag = (b * c - a * d) / denominator;
          
          // Check for NaN results
          if (isNaN(resultReal) || isNaN(resultImag)) {
            throw new Error("Invalid division operation");
          }
          break;
        case 'abs':
          resultReal = Math.sqrt(a * a + b * b);
          resultImag = 0;
          break;
        case 'conj':
          resultReal = a;
          resultImag = -b;
          break;
        case 'pow':
          if (a === 0 && b === 0) {
            throw new Error("0^z is undefined for z ≠ 0");
          }
          
          // Special case for real powers
          if (d === 0) {
            const r = Math.sqrt(a * a + b * b);
            const theta = Math.atan2(b, a);
            
            const newR = Math.pow(r, c);
            const newTheta = theta * c;
            
            resultReal = newR * Math.cos(newTheta);
            resultImag = newR * Math.sin(newTheta);
          } else {
            // DeMoivre's formula for complex powers
            const rA = Math.sqrt(a * a + b * b);
            const thetaA = Math.atan2(b, a);
            
            const lnRA = Math.log(rA);
            const newR = Math.exp(lnRA * c - thetaA * d);
            const newTheta = lnRA * d + thetaA * c;
            
            resultReal = newR * Math.cos(newTheta);
            resultImag = newR * Math.sin(newTheta);
          }
          break;
        case 'sqrt':
          const r = Math.sqrt(a * a + b * b);
          const theta = Math.atan2(b, a);
          const newR = Math.sqrt(r);
          const newTheta = theta / 2;
          
          resultReal = newR * Math.cos(newTheta);
          resultImag = newR * Math.sin(newTheta);
          break;
        case 'exp':
          const exp_a = Math.exp(a);
          resultReal = exp_a * Math.cos(b);
          resultImag = exp_a * Math.sin(b);
          break;
        case 'log':
          if (a === 0 && b === 0) {
            throw new Error("ln(0) is undefined");
          }
          resultReal = Math.log(Math.sqrt(a * a + b * b));
          resultImag = Math.atan2(b, a);
          break;
        case 'inverse':
          const denom = a * a + b * b;
          if (denom === 0) {
            throw new Error("Inverse of 0 is undefined");
          }
          resultReal = a / denom;
          resultImag = -b / denom;
          break;
        case 'arg':
          if (a === 0 && b === 0) {
            throw new Error("Argument of 0 is undefined");
          }
          resultReal = Math.atan2(b, a);
          resultImag = 0;
          break;
      }

      // Round to specified decimal places
      const factor = Math.pow(10, precision);
      resultReal = Math.round(resultReal * factor) / factor;
      resultImag = Math.round(resultImag * factor) / factor;

      const newResult = { real: resultReal, imag: resultImag };
      setResult(newResult);

      // Create new history item
      const historyItem = {
        z1: formatComplex(a, b),
        z2: formatComplex(c, d),
        op: operation,
        result: newResult,
        timestamp: new Date().toISOString()
      };
      
      // Check if this result already exists in history
      const isDuplicate = history.some(item => 
        item.op === operation && 
        item.result.real === newResult.real && 
        item.result.imag === newResult.imag &&
        item.z1 === formatComplex(a, b) &&
        (needsSecondNumber ? item.z2 === formatComplex(c, d) : true)
      );
      
      // Only add to history if not a duplicate
      if (!isDuplicate) {
        setHistory(prev => [historyItem, ...prev].slice(0, 20));
      }
      
      setShowResult(true);
    } catch (err) {
      setError(err.message);
      showToastNotification(err.message, 'error');
    }
  };

  const formatComplex = (real, imag, mode = displayMode) => {
    // Handle zero case
    if (real === 0 && imag === 0) return '0';
    
    real = parseFloat(real);
    imag = parseFloat(imag);
    
    // Choose formatting based on display mode
    switch (mode) {
      case 'rectangular':
        if (imag === 0) return real.toFixed(precision);
        if (real === 0) return imag === 1 ? 'i' : imag === -1 ? '-i' : `${imag.toFixed(precision)}i`;
        const sign = imag > 0 ? '+' : '';
        const imagPart = imag === 1 ? 'i' : imag === -1 ? '-i' : `${imag.toFixed(precision)}i`;
        return `${real.toFixed(precision)}${sign}${imagPart}`;
      
      case 'polar':
        const r = Math.sqrt(real * real + imag * imag);
        let theta = Math.atan2(imag, real);
        theta = theta * 180 / Math.PI; // Convert to degrees
        return `${r.toFixed(precision)} ∠ ${theta.toFixed(precision)}°`;
      
      case 'exponential': {
        const radius = Math.sqrt(real * real + imag * imag);
        const angle = Math.atan2(imag, real);
        return (
          <>
            {radius.toFixed(precision)} e<sup> i ({angle.toFixed(precision)})</sup>
          </>
        );
      }
      
      default:
        return `${real.toFixed(precision)}${imag >= 0 ? '+' : ''}${imag.toFixed(precision)}i`;
    }
  };

  const needsSecondNumber = !['abs', 'conj', 'sqrt', 'exp', 'log', 'inverse', 'arg'].includes(operation);

  const toggleHistoryView = () => {
    setShowHistory(!showHistory);
  };

  const useHistoryItem = (item) => {
    setReal1(item.result.real.toString());
    setImag1(item.result.imag.toString());
    setShowHistory(false);
  };
  
  const deleteHistoryItem = (index, e) => {
    e.stopPropagation(); // Prevent triggering the useHistoryItem
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    showToastNotification('History item deleted', 'info');
  };
  
  const clearHistory = () => {
    setHistory([]);
    showToastNotification('History cleared', 'info');
  };

  const clearCalculator = () => {
    setReal1('');
    setImag1('');
    setReal2('');
    setImag2('');
    setShowResult(false);
    setError('');
    
    // Focus the first input after clearing
    if (real1Ref.current) {
      real1Ref.current.focus();
    }
  };

  // Helper function to get operation symbol
  const getOperationSymbol = (op) => {
    const symbols = {
      '+': '+',
      '-': '-',
      '*': '×',
      '/': '÷',
      'pow': '^'
    };
    return symbols[op] || op;
  };

  // Helper function to get operation name
  const getOperationName = (op) => {
    const names = {
      'abs': 'abs',
      'conj': 'conj',
      'sqrt': '√',
      'exp': 'exp',
      'log': 'ln',
      'inverse': '1/',
      'arg': 'arg'
    };
    return names[op] || op;
  };

  // return (
  //   <div className={`${styles.bg} ${styles.text} min-h-screen flex justify-center items-center ${showHistory ? "mt-14" : "mt-1"}`} ref={calculatorRef}>
  //     <div className={`w-full max-w-md sm:max-w-lg mx-auto p-4 sm:p-6 rounded-lg ${styles.card} border transition-all mt-12`}>
  //       <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Complex Number Calculator</h1>
        
  //       {/* Display mode selector */}
  //       <div className="mb-4">
  //         <label className="block mb-2 font-medium text-sm">Display Format</label>
  //         <div className="flex mb-2 text-xs sm:text-sm">
  //           <button 
  //             className={`flex-1 py-2 px-1 sm:px-3 rounded-l ${displayMode === 'rectangular' ? styles.activeTab : styles.tab} transition-colors`}
  //             onClick={() => setDisplayMode('rectangular')}
  //           >
  //             Rectangular
  //           </button>
  //           <button 
  //             className={`flex-1 py-2 px-1 sm:px-3 ${displayMode === 'polar' ? styles.activeTab : styles.tab} transition-colors`}
  //             onClick={() => setDisplayMode('polar')}
  //           >
  //             Polar
  //           </button>
  //           <button 
  //             className={`flex-1 py-2 px-1 sm:px-3 rounded-r ${displayMode === 'exponential' ? styles.activeTab : styles.tab} transition-colors`}
  //             onClick={() => setDisplayMode('exponential')}
  //           >
  //             Exponential
  //           </button>
  //         </div>
  //       </div>
        
  //       {/* Precision selector */}
  //       <div className="mb-4">
  //         <div className="flex justify-between items-center mb-2">
  //           <label className="font-medium text-sm">Precision</label>
  //           <span className="text-sm font-medium px-2 py-1 rounded bg-opacity-20 bg-blue-500">{precision}</span>
  //         </div>
  //         <div className="flex items-center">
  //           <input
  //             type="range"
  //             min="1"
  //             max="10"
  //             value={precision}
  //             onChange={(e) => setPrecision(parseInt(e.target.value))}
  //             className="w-full accent-blue-500"
  //           />
  //         </div>
  //       </div>
        
  //       {/* First complex number */}
  //       <div className="mb-4">
  //         <label className="block mb-2 font-medium text-sm">First Complex Number (z₁)</label>
  //         <div className="flex space-x-2">
  //           <div className="w-1/2">
  //             <input
  //               type="number"
  //               placeholder="Real part"
  //               className={`w-full p-2 rounded border ${styles.input} transition-colors`}
  //               value={real1}
  //               onChange={(e) => setReal1(e.target.value)}
  //               ref={real1Ref}
  //             />
  //           </div>
  //           <div className="flex w-1/2">
  //             <input
  //               type="number"
  //               placeholder="Imaginary"
  //               className={`w-full p-2 rounded-l border-y border-l ${styles.input} transition-colors`}
  //               value={imag1}
  //               onChange={(e) => setImag1(e.target.value)}
  //             />
  //             <span className={`inline-flex items-center px-2 rounded-r border-y border-r ${styles.input} transition-colors`}>i</span>
  //           </div>
  //         </div>
  //       </div>
        
  //       {/* Operation */}
  //       <div className="mb-4">
  //         <label className="block mb-2 font-medium text-sm">Operation</label>
  //         <select
  //           className={`w-full p-2 rounded border ${styles.select} transition-colors`}
  //           value={operation}
  //           onChange={(e) => setOperation(e.target.value)}
  //         >
  //           <optgroup label="Basic Operations">
  //             <option value="+">Addition (z₁ + z₂)</option>
  //             <option value="-">Subtraction (z₁ - z₂)</option>
  //             <option value="*">Multiplication (z₁ × z₂)</option>
  //             <option value="/">Division (z₁ ÷ z₂)</option>
  //             <option value="pow">Power (z₁^z₂)</option>
  //             <option value="inverse">Inverse (1/z₁)</option>
  //           </optgroup>
  //           <optgroup label="Single Number Operations">
  //             <option value="abs">Absolute Value (|z₁|)</option>
  //             <option value="arg">Argument (arg z₁)</option>
  //             <option value="conj">Conjugate (z₁*)</option>
  //             <option value="sqrt">Square Root (√z₁)</option>
  //             <option value="exp">Exponential (e^z₁)</option>
  //             <option value="log">Natural Logarithm (ln z₁)</option>
  //           </optgroup>
  //         </select>
  //       </div>
        
  //       {/* Second complex number - conditionally shown */}
  //       {needsSecondNumber && (
  //         <div className="mb-4">
  //           <label className="block mb-2 font-medium text-sm">Second Complex Number (z₂)</label>
  //           <div className="flex space-x-2">
  //             <div className="w-1/2">
  //               <input
  //                 type="number"
  //                 placeholder="Real part"
  //                 className={`w-full p-2 rounded border ${styles.input} transition-colors`}
  //                 value={real2}
  //                 onChange={(e) => setReal2(e.target.value)}
  //               />
  //             </div>
  //             <div className="flex w-1/2">
  //               <input
  //                 type="number"
  //                 placeholder="Imaginary"
  //                 className={`w-full p-2 rounded-l border-y border-l ${styles.input} transition-colors`}
  //                 value={imag2}
  //                 onChange={(e) => setImag2(e.target.value)}
  //               />
  //               <span className={`inline-flex items-center px-2 rounded-r border-y border-r ${styles.input} transition-colors`}>i</span>
  //             </div>
  //           </div>
  //         </div>
  //       )}
        
  //       {/* Error message */}
  //       {error && (
  //         <div className={`p-3 rounded mb-4 ${styles.error} transition-all`}>
  //           <p className="font-medium text-sm">Error: {error}</p>
  //         </div>
  //       )}
        
  //       {/* Action buttons */}
  //       <div className="grid grid-cols-2 sm:flex flex-wrap gap-2 mb-4">
  //         <button
  //           className={`col-span-2 py-2 px-4 rounded font-medium ${styles.actionButton} transition-colors`}
  //           onClick={calculate}
  //         >
  //           Calculate (Ctrl+Enter)
  //         </button>
  //         <button
  //           className={`py-2 px-4 rounded font-medium ${styles.secondary} transition-colors`}
  //           onClick={clearCalculator}
  //         >
  //           Clear
  //         </button>
  //         <button
  //           className={`py-2 px-4 rounded font-medium ${styles.secondary} transition-colors`}
  //           onClick={toggleHistoryView}
  //         >
  //           {showHistory ? 'Hide History' : 'History'}
  //         </button>
  //         {showHistory && history.length > 0 && (
  //           <button
  //           className={`py-2 px-4 rounded-2xl font-medium text-red-500 border border-red-500 bg-red-500/10 hover:bg-red-500/20 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out`}
  //           onClick={clearHistory}
  //           >
  //             Clear History
  //           </button>
  //         )}
  //       </div>
        
  //       {/* Result */}
  //       {showResult && (
  //         <div className="mt-4 animate-fadeIn">
  //           <h2 className="text-lg font-semibold mb-2">Result</h2>
  //           <div className={`p-4 rounded border ${styles.card} transition-colors`}>
  //             <div className="text-lg font-medium break-words">
  //               {formatComplex(result.real, result.imag)}
  //             </div>
  //           </div>
  //           <div className="mt-2 flex flex-col space-y-1">
  //             <div className="text-xs font-semibold uppercase tracking-wider opacity-70">Alternative formats</div>
  //             <div className="text-sm">
  //               <span className={`font-medium ${styles.accent}`}>Rectangular: </span>
  //               <span className="break-words">{formatComplex(result.real, result.imag, 'rectangular')}</span>
  //             </div>
  //             <div className="text-sm">
  //               <span className={`font-medium ${styles.accent}`}>Polar: </span>
  //               <span className="break-words">{formatComplex(result.real, result.imag, 'polar')}</span>
  //             </div>
  //             <div className="text-sm">
  //               <span className={`font-medium ${styles.accent}`}>Exponential: </span>
  //               <span className="break-words">{formatComplex(result.real, result.imag, 'exponential')}</span>
  //             </div>
  //           </div>
  //         </div>
  //       )}
        
  //       {/* History panel */}
  //       {showHistory && (
  //         <div className="mt-4 animate-fadeIn">
  //           <h2 className="text-lg font-semibold mb-2">Calculation History</h2>
  //           {history.length > 0 ? (
  //             <div className="max-h-60 overflow-y-auto rounded border">
  //               {history.map((item, index) => {
  //                 const date = new Date(item.timestamp);
  //                 const formattedTime = date.toLocaleTimeString();
  //                 return (
  //                   <div 
  //                     key={index} 
  //                     className={`p-3 ${index !== history.length - 1 ? 'border-b' : ''} ${styles.historyItem} cursor-pointer hover:opacity-80 transition-colors`}
  //                     onClick={() => useHistoryItem(item)}
  //                   >
  //                     <div className="flex justify-between items-center">
  //                       <div className="overflow-hidden flex-grow mr-2">
  //                         <span className="text-xs opacity-75">{formattedTime}</span>
  //                         <div className="font-medium text-sm truncate">
  //                           {!['abs', 'conj', 'sqrt', 'exp', 'log', 'inverse', 'arg'].includes(item.op) ? 
  //                             `${item.z1} ${getOperationSymbol(item.op)} ${item.z2} = ` : 
  //                             `${getOperationName(item.op)}(${item.z1}) = `}
  //                           {formatComplex(item.result.real, item.result.imag)}
  //                         </div>
  //                       </div>
  //                       <div className="flex items-center space-x-2">
  //                         <button 
  //                           className="text-xs rounded-full px-2 py-1 bg-opacity-20 text-blue-200 bg-blue-700 hover:bg-opacity-30"
  //                           onClick={(e) => {
  //                             e.stopPropagation();
  //                             useHistoryItem(item);
  //                           }}
  //                         >
  //                           Use
  //                         </button>
  //                         <button 
  //                           className="text-xs rounded-full px-2 py-1 bg-opacity-20 bg-red-700 hover:bg-opacity-30 text-red-200 dark:text-red-200"
  //                           onClick={(e) => deleteHistoryItem(index, e)}
  //                         >
  //                           Delete
  //                         </button>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           ) : (
  //             <div className="p-4 text-center text-gray-500 italic border rounded">
  //               No calculation history yet
  //             </div>
  //           )}
  //         </div>
  //       )}
        
  //       {/* Info footer */}
  //       <div className="mt-6 text-xs text-center opacity-75">
  //         <p>Press Ctrl+Enter to quickly calculate • History is saved locally</p>
  //       </div>
  //     </div>
      
  //     {/* Toast notification */}
  //     {showToast && (
  //       <div className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:w-64 md:w-80 p-3 rounded shadow-lg animate-fadeIn ${styles.toast[toastType]} z-50`}>
  //         <div className="flex items-center justify-between">
  //           <span className="font-medium">{toastMessage}</span>
  //           <button 
  //             className="ml-2 hover:opacity-70" 
  //             onClick={() => setShowToast(false)}
  //           >
  //             ×
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

return (
  <div
    className={`${styles.bg} ${styles.text} min-h-screen flex justify-center items-center pt-16 sm:${showResult? "pb-10 mt-10" : "pb-0"} ${showResult? "mt-14 mx-2" : "mt-4 mx-2 pb-4"}`}
    ref={calculatorRef}
  >
    <div
      className={`w-full max-w-md sm:max-w-lg mx-auto p-4 sm:p-6 rounded-lg ${styles.card} border transition-all`}
    >
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Complex Number Calculator
      </h1>

      {/* Display mode selector */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-sm">Display Format</label>
        <div className="flex mb-2 text-xs sm:text-sm">
          <button
            className={`flex-1 py-2 px-1 sm:px-3 rounded-l ${
              displayMode === 'rectangular' ? styles.activeTab : styles.tab
            } transition-colors`}
            onClick={() => setDisplayMode('rectangular')}
          >
            Rectangular
          </button>
          <button
            className={`flex-1 py-2 px-1 sm:px-3 ${
              displayMode === 'polar' ? styles.activeTab : styles.tab
            } transition-colors`}
            onClick={() => setDisplayMode('polar')}
          >
            Polar
          </button>
          <button
            className={`flex-1 py-2 px-1 sm:px-3 rounded-r ${
              displayMode === 'exponential' ? styles.activeTab : styles.tab
            } transition-colors`}
            onClick={() => setDisplayMode('exponential')}
          >
            Exponential
          </button>
        </div>
      </div>

      {/* Precision selector */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="font-medium text-sm">Precision</label>
          <span className="text-sm font-medium px-2 py-1 rounded bg-opacity-20 bg-blue-500">
            {precision}
          </span>
        </div>
        <div className="flex items-center">
          <input
            type="range"
            min="1"
            max="10"
            value={precision}
            onChange={(e) => setPrecision(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </div>

      {/* First complex number */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-sm">First Complex Number (z₁)</label>
        <div className="flex space-x-2">
          <div className="w-1/2">
            <input
              type="number"
              placeholder="Real part"
              className={`w-full p-2 rounded border ${styles.input} transition-colors`}
              value={real1}
              onChange={(e) => setReal1(e.target.value)}
              ref={real1Ref}
            />
          </div>
          <div className="flex w-1/2">
            <input
              type="number"
              placeholder="Imaginary"
              className={`w-full p-2 rounded-l border-y border-l ${styles.input} transition-colors`}
              value={imag1}
              onChange={(e) => setImag1(e.target.value)}
            />
            <span className={`inline-flex items-center px-2 rounded-r border-y border-r ${styles.input} transition-colors`}>
              i
            </span>
          </div>
        </div>
      </div>

      {/* Operation */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-sm">Operation</label>
        <select
          className={`w-full p-2 rounded border ${styles.select} transition-colors`}
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <optgroup label="Basic Operations">
            <option value="+">Addition (z₁ + z₂)</option>
            <option value="-">Subtraction (z₁ - z₂)</option>
            <option value="*">Multiplication (z₁ × z₂)</option>
            <option value="/">Division (z₁ ÷ z₂)</option>
            <option value="pow">Power (z₁^z₂)</option>
            <option value="inverse">Inverse (1/z₁)</option>
          </optgroup>
          <optgroup label="Single Number Operations">
            <option value="abs">Absolute Value (|z₁|)</option>
            <option value="arg">Argument (arg z₁)</option>
            <option value="conj">Conjugate (z₁*)</option>
            <option value="sqrt">Square Root (√z₁)</option>
            <option value="exp">Exponential (e^z₁)</option>
            <option value="log">Natural Logarithm (ln z₁)</option>
          </optgroup>
        </select>
      </div>

      {/* Second complex number - conditionally shown */}
      {needsSecondNumber && (
        <div className="mb-4">
          <label className="block mb-2 font-medium text-sm">Second Complex Number (z₂)</label>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <input
                type="number"
                placeholder="Real part"
                className={`w-full p-2 rounded border ${styles.input} transition-colors`}
                value={real2}
                onChange={(e) => setReal2(e.target.value)}
              />
            </div>
            <div className="flex w-1/2">
              <input
                type="number"
                placeholder="Imaginary"
                className={`w-full p-2 rounded-l border-y border-l ${styles.input} transition-colors`}
                value={imag2}
                onChange={(e) => setImag2(e.target.value)}
              />
              <span className={`inline-flex items-center px-2 rounded-r border-y border-r ${styles.input} transition-colors`}>
                i
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className={`p-3 rounded mb-4 ${styles.error} transition-all`}>
          <p className="font-medium text-sm">Error: {error}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-2 mb-4">
        <button
          className={`col-span-2 py-2 px-4 rounded font-medium ${styles.actionButton} transition-colors`}
          onClick={calculate}
        >
          Calculate (Ctrl+Enter)
        </button>
        <button
          className={`py-2 px-4 rounded font-medium ${styles.secondary} transition-colors`}
          onClick={clearCalculator}
        >
          Clear
        </button>
        <button
          className={`py-2 px-4 rounded font-medium ${styles.secondary} transition-colors`}
          onClick={toggleHistoryView}
        >
          {showHistory ? 'Hide History' : 'History'}
        </button>
        {showHistory && history.length > 0 && (
          <button
            className="py-2 px-4 rounded-2xl font-medium text-red-500 border border-red-500 bg-red-500/10 hover:bg-red-500/20 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={clearHistory}
          >
            Clear History
          </button>
        )}
      </div>

      {/* Result */}
      {showResult && (
        <div className="mt-4 animate-fadeIn">
          <h2 className="text-lg font-semibold mb-2">Result</h2>
          <div className={`p-4 rounded border ${styles.card} transition-colors`}>
            <div className="text-lg font-medium break-words">
              {formatComplex(result.real, result.imag)}
            </div>
          </div>
          <div className="mt-2 flex flex-col space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-70">
              Alternative formats
            </div>
            <div className="text-sm">
              <span className={`font-medium ${styles.accent}`}>Rectangular: </span>
              <span className="break-words">{formatComplex(result.real, result.imag, 'rectangular')}</span>
            </div>
            <div className="text-sm">
              <span className={`font-medium ${styles.accent}`}>Polar: </span>
              <span className="break-words">{formatComplex(result.real, result.imag, 'polar')}</span>
            </div>
            <div className="text-sm">
              <span className={`font-medium ${styles.accent}`}>Exponential: </span>
              <span className="break-words">{formatComplex(result.real, result.imag, 'exponential')}</span>
            </div>
          </div>
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <div className="mt-4 animate-fadeIn">
          <h2 className="text-lg font-semibold mb-2">Calculation History</h2>
          {history.length > 0 ? (
            <div className="max-h-60 overflow-y-auto rounded border">
              {history.map((item, index) => {
                const date = new Date(item.timestamp);
                const formattedTime = date.toLocaleTimeString();
                return (
                  <div
                    key={index}
                    className={`p-3 ${index !== history.length - 1 ? 'border-b' : ''} ${styles.historyItem} cursor-pointer hover:opacity-80 transition-colors`}
                    onClick={() => useHistoryItem(item)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="overflow-hidden flex-grow mr-2">
                        <span className="text-xs opacity-75">{formattedTime}</span>
                        <div className="font-medium text-sm truncate">...</div>
                      </div>
                      <div className="flex items-center space-x-2">...</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 italic border rounded">
              No calculation history yet
            </div>
          )}
        </div>
      )}

      {/* Info footer */}
      <div className="mt-6 text-xs text-center opacity-75">
        <p>Press Ctrl+Enter to quickly calculate • History is saved locally</p>
      </div>
    </div>

    {/* Toast notification */}
    {showToast && (
      <div className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:w-64 md:w-80 p-3 rounded shadow-lg animate-fadeIn ${styles.toast[toastType]} z-50`}>
        <div className="flex items-center justify-between">
          <span className="font-medium">{toastMessage}</span>
          <button
            className="ml-2 hover:opacity-70"
            onClick={() => setShowToast(false)}
          >
            ×
          </button>
        </div>
      </div>
    )}
  </div>
);


}