// import React, { useState, useEffect } from 'react';

// const ScientificCalculator = ({ theme = 'light' }) => {
//   const [input, setInput] = useState('0');
//   const [result, setResult] = useState('');
//   const [isRadians, setIsRadians] = useState(true);
//   const [memory, setMemory] = useState(0);
//   const [shiftMode, setShiftMode] = useState(false);
//   const [error, setError] = useState('');
//   const [bracketCount, setBracketCount] = useState(0);
//   const [history, setHistory] = useState([]);
//   const [showHistory, setShowHistory] = useState(false);
  
//   // Theme-based styling
//   const isDark = theme === 'dark';
  
//   const styles = {
//     calculator: {
//       backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
//       color: isDark ? '#ffffff' : '#333333',
//       borderRadius: '16px',
//       boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.6)' : '0 10px 30px rgba(0, 0, 0, 0.15)',
//       maxWidth: '100%',
//       margin: '0 auto',
//       padding: '1rem',
//     },
//     display: {
//       backgroundColor: isDark ? '#2d2d2d' : '#e8e8e8',
//       borderRadius: '12px',
//       padding: '0.75rem',
//       marginBottom: '0.75rem',
//       boxShadow: isDark ? 'inset 0 2px 8px rgba(0, 0, 0, 0.3)' : 'inset 0 2px 8px rgba(0, 0, 0, 0.05)',
//     },
//     button: {
//       backgroundColor: isDark ? '#3a3a3a' : '#fff',
//       color: isDark ? '#fff' : '#333',
//       borderColor: isDark ? '#555' : '#ddd',
//       borderRadius: '8px',
//       fontWeight: '500',
//       transition: 'all 0.15s ease',
//       height: '100%',
//       boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
//     },
//     operatorButton: {
//       backgroundColor: isDark ? '#444' : '#f0f0f0',
//       color: isDark ? '#fff' : '#333',
//       borderRadius: '8px',
//       fontWeight: '600',
//       boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
//     },
//     functionButton: {
//       backgroundColor: isDark ? '#333' : '#e0e0e0',
//       color: isDark ? '#fff' : '#333',
//       borderRadius: '8px',
//       fontSize: '0.9rem',
//       boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
//     },
//     equalsButton: {
//       backgroundColor: isDark ? '#4caf50' : '#4caf50',
//       color: '#fff',
//       borderRadius: '8px',
//       fontWeight: 'bold',
//       boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
//     },
//     errorMsg: {
//       color: isDark ? '#ff6b6b' : '#d32f2f',
//       fontSize: '0.8rem',
//       height: '1rem',
//       textAlign: 'right',
//       padding: '0.5rem 0.5rem 0',
//     },
//     activeButton: {
//       backgroundColor: isDark ? '#555' : '#d4d4d4',
//       boxShadow: isDark ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' : 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
//     },
//     historyPanel: {
//       backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
//       borderRadius: '12px',
//       marginBottom: '0.75rem',
//       maxHeight: '150px',
//       overflowY: 'auto',
//       padding: '0.75rem',
//       boxShadow: isDark ? 'inset 0 2px 8px rgba(0, 0, 0, 0.3)' : 'inset 0 2px 8px rgba(0, 0, 0, 0.05)',
//     },
//     historyItem: {
//       borderBottom: `1px solid ${isDark ? '#444' : '#ddd'}`,
//       padding: '0.5rem 0',
//       cursor: 'pointer',
//     },
//     modeButton: {
//       padding: '0.25rem 0.5rem',
//       borderRadius: '8px',
//       transition: 'all 0.15s ease',
//       cursor: 'pointer',
//     }
//   };

//   // Reset error message after 3 seconds
//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         setError('');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   // Track open brackets
//   useEffect(() => {
//     let count = 0;
//     for (let char of input) {
//       if (char === '(') count++;
//       if (char === ')') count--;
//     }
//     setBracketCount(count);
//   }, [input]);

//   const appendToInput = (value) => {
//     // Clear error if present
//     if (error) setError('');
    
//     // Handle special cases for operators
//     const operators = ['+', '-', '×', '÷', '^', '%'];
//     const lastChar = input.slice(-1);
    
//     // If we're starting a new calculation after a result
//     if (result && !operators.includes(value) && !['(', '.'].includes(value)) {
//       if ('0123456789'.includes(value)) {
//         setInput(value);
//         setResult('');
//         return;
//       }
//     }
    
//     // Reset result display when starting a new input
//     if (result && !operators.includes(value)) {
//       setResult('');
//     }
    
//     // Append value based on context
//     if (input === '0') {
//       if (value === '.') {
//         setInput('0.');
//       } else if (!operators.includes(value)) {
//         setInput(value);
//       } else {
//         setInput('0' + value);
//       }
//     } else {
//       // Don't allow two operators in a row
//       if (operators.includes(lastChar) && operators.includes(value)) {
//         setInput(input.slice(0, -1) + value);
//       } else {
//         setInput(input + value);
//       }
//     }
//   };

//   const clearInput = () => {
//     setInput('0');
//     setResult('');
//     setError('');
//     setBracketCount(0);
//   };

//   const backspace = () => {
//     if (error) {
//       setError('');
//       return;
//     }
    
//     if (input.length === 1) {
//       setInput('0');
//     } else {
//       const lastChar = input.slice(-1);
//       if (lastChar === '(') setBracketCount(prev => prev - 1);
//       if (lastChar === ')') setBracketCount(prev => prev + 1);
//       setInput(input.slice(0, -1));
//     }
//   };

//   const calculateResult = () => {
//     try {
//       // Add missing closing brackets if needed
//       let expressionToEvaluate = input;
//       if (bracketCount > 0) {
//         expressionToEvaluate += ')'.repeat(bracketCount);
//       }
      
//       // Convert input to a safe expression
//       expressionToEvaluate = expressionToEvaluate
//         .replace(/π/g, 'Math.PI')
//         .replace(/e/g, 'Math.E')
//         .replace(/sin\(/g, isRadians ? 'Math.sin(' : 'Math.sin((Math.PI/180)*')
//         .replace(/cos\(/g, isRadians ? 'Math.cos(' : 'Math.cos((Math.PI/180)*')
//         .replace(/tan\(/g, isRadians ? 'Math.tan(' : 'Math.tan((Math.PI/180)*')
//         .replace(/log\(/g, 'Math.log10(')
//         .replace(/ln\(/g, 'Math.log(')
//         .replace(/sqrt\(/g, 'Math.sqrt(')
//         .replace(/cbrt\(/g, 'Math.cbrt(')
//         .replace(/asin\(/g, isRadians ? 'Math.asin(' : '(180/Math.PI)*Math.asin(')
//         .replace(/acos\(/g, isRadians ? 'Math.acos(' : '(180/Math.PI)*Math.acos(')
//         .replace(/atan\(/g, isRadians ? 'Math.atan(' : '(180/Math.PI)*Math.atan(')
//         .replace(/\^/g, '**')
//         .replace(/×/g, '*')
//         .replace(/÷/g, '/');
      
//       // Validate expression before evaluation
//       if (/[a-zA-Z]/.test(expressionToEvaluate.replace(/Math\.|sin|cos|tan|log|sqrt|cbrt|asin|acos|atan|PI|E/g, ''))) {
//         throw new Error("Invalid characters in expression");
//       }
      
//       // Calculate and format result
//       const calculatedResult = eval(expressionToEvaluate);
      
//       if (!isFinite(calculatedResult)) {
//         throw new Error("Result is undefined or infinity");
//       }
      
//       // Format the result nicely
//       let formattedResult;
//       if (Number.isInteger(calculatedResult)) {
//         formattedResult = calculatedResult.toString();
//       } else {
//         // Show up to 8 decimal places but trim trailing zeros
//         formattedResult = parseFloat(calculatedResult.toFixed(8)).toString();
//       }
      
//       setResult(formattedResult);
      
//       // Add to history
//       setHistory(prev => [{
//         expression: input + (bracketCount > 0 ? ')'.repeat(bracketCount) : ''),
//         result: formattedResult
//       }, ...prev.slice(0, 9)]);
      
//       setInput(formattedResult);
//       setError('');
//     } catch (error) {
//       setError('Invalid expression');
//       console.error("Calculation error:", error);
//     }
//   };

//   const calculateFactorial = () => {
//     try {
//       const num = parseFloat(input);
//       if (num < 0 || !Number.isInteger(num)) {
//         setError('Only non-negative integers allowed for factorial');
//         return;
//       }
      
//       if (num > 170) {
//         setError('Number too large for factorial');
//         return;
//       }
      
//       let factorial = 1;
//       for (let i = 2; i <= num; i++) {
//         factorial *= i;
//       }
      
//       setResult(factorial.toString());
      
//       // Add to history
//       setHistory(prev => [{
//         expression: `${input}!`,
//         result: factorial.toString()
//       }, ...prev.slice(0, 9)]);
      
//       setInput(factorial.toString());
//       setError('');
//     } catch (error) {
//       setError('Factorial calculation error');
//     }
//   };

//   const handleSquare = () => {
//     try {
//       const num = parseFloat(input);
//       const result = num * num;
      
//       if (!isFinite(result)) {
//         setError('Result too large');
//         return;
//       }
      
//       setResult(result.toString());
      
//       // Add to history
//       setHistory(prev => [{
//         expression: `${input}²`,
//         result: result.toString()
//       }, ...prev.slice(0, 9)]);
      
//       setInput(result.toString());
//       setError('');
//     } catch (error) {
//       setError('Calculation error');
//     }
//   };

//   const handleCube = () => {
//     try {
//       const num = parseFloat(input);
//       const result = num * num * num;
      
//       if (!isFinite(result)) {
//         setError('Result too large');
//         return;
//       }
      
//       setResult(result.toString());
      
//       // Add to history
//       setHistory(prev => [{
//         expression: `${input}³`,
//         result: result.toString()
//       }, ...prev.slice(0, 9)]);
      
//       setInput(result.toString());
//       setError('');
//     } catch (error) {
//       setError('Calculation error');
//     }
//   };

//   const handleFunction = (func) => {
//     if (input === '0') {
//       setInput(`${func}(`);
//     } else {
//       // Check if we're already in the middle of an expression
//       const lastChar = input.slice(-1);
//       const operators = ['+', '-', '×', '÷', '^', '(', '%'];
      
//       // If last character is an operator or we're starting a new calculation after a result
//       if (operators.includes(lastChar) || result) {
//         setInput(input + `${func}(`);
//       } else {
//         // Otherwise, assume we want to apply the function to the current value
//         setInput(`${func}(${input})`);
//       }
//     }
    
//     setBracketCount(prev => prev + 1);
//     setError('');
//   };

//   const handleParenthesis = () => {
//     // Smart bracket handling
//     if (bracketCount > 0) {
//       // Close a bracket
//       appendToInput(')');
//       setBracketCount(prev => prev - 1);
//     } else {
//       // Open a bracket
//       const lastChar = input.slice(-1);
//       const operators = ['+', '-', '×', '÷', '^', '(', '%'];
      
//       if (input === '0') {
//         setInput('(');
//       } else if (operators.includes(lastChar)) {
//         setInput(input + '(');
//       } else {
//         // If we're not after an operator, add multiply then open bracket
//         setInput(input + '×(');
//       }
      
//       setBracketCount(prev => prev + 1);
//     }
//   };

//   const handlePi = () => {
//     if (input === '0') {
//       setInput('π');
//     } else {
//       const lastChar = input.slice(-1);
//       const operators = ['+', '-', '×', '÷', '^', '(', '%'];
      
//       if (operators.includes(lastChar)) {
//         setInput(input + 'π');
//       } else {
//         // If we're not after an operator, add multiply then pi
//         setInput(input + '×π');
//       }
//     }
//   };

//   const handleE = () => {
//     if (input === '0') {
//       setInput('e');
//     } else {
//       const lastChar = input.slice(-1);
//       const operators = ['+', '-', '×', '÷', '^', '(', '%'];
      
//       if (operators.includes(lastChar)) {
//         setInput(input + 'e');
//       } else {
//         // If we're not after an operator, add multiply then e
//         setInput(input + '×e');
//       }
//     }
//   };

//   const toggleAngleMode = () => {
//     setIsRadians(!isRadians);
//   };

//   const toggleShiftMode = () => {
//     setShiftMode(!shiftMode);
//   };

//   const handleMemoryStore = () => {
//     try {
//       setMemory(parseFloat(result || input));
//     } catch (error) {
//       setError('Memory store error');
//     }
//   };

//   const handleMemoryRecall = () => {
//     if (memory !== null) {
//       setInput(memory.toString());
//     }
//   };

//   const handleMemoryClear = () => {
//     setMemory(0);
//     setError('');
//   };

//   const handleMemoryAdd = () => {
//     try {
//       setMemory(memory + parseFloat(result || input));
//     } catch (error) {
//       setError('Memory add error');
//     }
//   };

//   const handleMemorySubtract = () => {
//     try {
//       setMemory(memory - parseFloat(result || input));
//     } catch (error) {
//       setError('Memory subtract error');
//     }
//   };

//   const handleHistoryItemClick = (item) => {
//     setInput(item.expression);
//     setResult(item.result);
//   };

//   const handleAngleModeFromDisplay = () => {
//     setIsRadians(!isRadians);
//   };

//   const clearHistory = () => {
//     setHistory([]);
//   };

//   const renderButton = (label, onClick, buttonStyle = styles.button, isActive = false) => (
//     <button 
//       onClick={onClick}
//       className="p-1 sm:p-2 lg:p-3 m-0.5 sm:m-1 text-xs sm:text-sm md:text-base rounded text-center transition-all hover:opacity-90 active:translate-y-0.5"
//       style={{
//         ...buttonStyle,
//         ...(isActive ? styles.activeButton : {})
//       }}
//     >
//       {label}
//     </button>
//   );

//   const convertToStandard = () => {
//     try {
//       const num = parseFloat(input);
//       setInput(num.toExponential(4));
//     } catch (error) {
//       setError('Cannot convert to scientific notation');
//     }
//   };

//   const calculatePercentage = () => {
//     try {
//       const lastOperatorIndex = Math.max(
//         input.lastIndexOf('+'),
//         input.lastIndexOf('-'),
//         input.lastIndexOf('×'),
//         input.lastIndexOf('÷')
//       );
      
//       if (lastOperatorIndex === -1) {
//         // No operator, just convert to percentage
//         const value = parseFloat(input) / 100;
//         setInput(value.toString());
//       } else {
//         // Get the number after the last operator
//         const baseValue = input.substring(0, lastOperatorIndex);
//         const operator = input[lastOperatorIndex];
//         const percentValue = parseFloat(input.substring(lastOperatorIndex + 1)) / 100;
        
//         let newValue;
//         if (operator === '+' || operator === '-') {
//           // For + and -, calculate percent of the base value
//           const base = eval(baseValue.replace(/×/g, '*').replace(/÷/g, '/'));
//           newValue = percentValue * base;
//         } else {
//           // For × and ÷, just use the percentage value
//           newValue = percentValue;
//         }
        
//         // Replace the percentage part
//         setInput(baseValue + operator + newValue.toString());
//       }
//     } catch (error) {
//       setError('Percentage calculation error');
//     }
//   };

//   return (
//     <div className="flex md:mt-16 mt-20 justify-center items-center w-full px-2 py-4">
//       <div className="w-full sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-2/5 rounded-2xl overflow-hidden shadow-2xl" style={styles.calculator}>
//         {/* History panel (collapsible) */}
//         {showHistory && (
//           <div style={styles.historyPanel} className="mb-3">
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="font-bold text-sm sm:text-base">Calculation History</h3>
//               <button
//                 onClick={clearHistory}
//                 className="text-xs py-1 px-2 rounded"
//                 style={styles.functionButton}
//               >
//                 Clear History
//               </button>
//             </div>
//             {history.length === 0 ? (
//               <p className="text-sm italic opacity-70">No history yet</p>
//             ) : (
//               history.map((item, index) => (
//                 <div 
//                   key={index}
//                   style={styles.historyItem}
//                   onClick={() => handleHistoryItemClick(item)}
//                   className="hover:opacity-80"
//                 >
//                   <div className="text-xs opacity-70">{item.expression} =</div>
//                   <div className="font-bold">{item.result}</div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
        
//         {/* Display */}
//         <div className="w-full rounded-xl" style={styles.display}>
//           <div className="text-xs sm:text-sm opacity-70 h-4 sm:h-6 overflow-x-auto whitespace-nowrap">
//             {result && `${input} =`}
//           </div>
//           <div className="text-xl sm:text-2xl md:text-3xl font-bold overflow-x-auto whitespace-nowrap pb-1 sm:pb-2">
//             {result || input}
//           </div>
//           <div className="flex flex-wrap justify-between text-xs mt-1 sm:mt-2 border-t pt-1 sm:pt-2 border-opacity-20" style={{ borderColor: isDark ? '#555' : '#ccc' }}>
//             <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
//               <span 
//                 className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs cursor-pointer hover:opacity-80`}
//                 style={{ 
//                   backgroundColor: isRadians ? (isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)') : 'transparent',
//                   ...styles.modeButton
//                 }}
//                 onClick={handleAngleModeFromDisplay}
//               >
//                 RAD
//               </span>
//               <span 
//                 className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs cursor-pointer hover:opacity-80`}
//                 style={{ 
//                   backgroundColor: !isRadians ? (isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)') : 'transparent',
//                   ...styles.modeButton
//                 }}
//                 onClick={handleAngleModeFromDisplay}
//               >
//                 DEG
//               </span>
//               {shiftMode && (
//                 <span className="px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs bg-opacity-20 bg-blue-500" style={{ backgroundColor: isDark ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)' }}>
//                   SHIFT
//                 </span>
//               )}
//               <span 
//                 className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs cursor-pointer hover:opacity-80 ml-1`}
//                 style={{
//                   backgroundColor: showHistory ? (isDark ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)') : 'transparent',
//                   ...styles.modeButton
//                 }}
//                 onClick={() => setShowHistory(!showHistory)}
//               >
//                 {showHistory ? 'HIDE HISTORY' : 'HISTORY'}
//               </span>
//             </div>
//             <div>
//               {bracketCount > 0 && (
//                 <span className="px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs bg-opacity-20 bg-yellow-500" style={{ backgroundColor: isDark ? 'rgba(255, 193, 7, 0.2)' : 'rgba(255, 193, 7, 0.1)' }}>
//                   {bracketCount} open bracket{bracketCount > 1 ? 's' : ''}
//                 </span>
//               )}
//               {memory !== 0 && (
//                 <span className="px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs bg-opacity-20 bg-purple-500 ml-1" style={{ backgroundColor: isDark ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.1)' }}>
//                   M
//                 </span>
//               )}
//             </div>
//           </div>
//           <div style={styles.errorMsg} className="text-xs sm:text-sm">{error}</div>
//         </div>

//         {/* Button grid - standard layout for larger screens */}
//         <div className="hidden md:grid grid-cols-5 gap-1 sm:gap-2">
//           {/* Row 1 */}
//           {renderButton(shiftMode ? 'DEG' : 'RAD', toggleAngleMode, styles.functionButton, isRadians)}
//           {renderButton('MC', handleMemoryClear, styles.functionButton)}
//           {renderButton('MR', handleMemoryRecall, styles.functionButton)}
//           {renderButton('M+', handleMemoryAdd, styles.functionButton)}
//           {renderButton('M-', handleMemorySubtract, styles.functionButton)}

//           {/* Row 2 */}
//           {renderButton('SHIFT', toggleShiftMode, styles.functionButton, shiftMode)}
//           {renderButton(shiftMode ? 'x³' : 'x²', shiftMode ? handleCube : handleSquare, styles.functionButton)}
//           {renderButton(shiftMode ? 'cbrt(' : 'sqrt(', () => handleFunction(shiftMode ? 'cbrt' : 'sqrt'), styles.functionButton)}
//           {renderButton('( )', handleParenthesis, styles.functionButton)}
//           {renderButton('C', clearInput, {
//             ...styles.operatorButton,
//             backgroundColor: isDark ? '#d32f2f' : '#ffcdd2',
//             color: isDark ? '#fff' : '#d32f2f'
//           })}

//           {/* Row 3 */}
//           {renderButton(shiftMode ? 'asin(' : 'sin(', () => handleFunction(shiftMode ? 'asin' : 'sin'), styles.functionButton)}
//           {renderButton(shiftMode ? 'acos(' : 'cos(', () => handleFunction(shiftMode ? 'acos' : 'cos'), styles.functionButton)}
//           {renderButton(shiftMode ? 'atan(' : 'tan(', () => handleFunction(shiftMode ? 'atan' : 'tan'), styles.functionButton)}
//           {renderButton(shiftMode ? 'ln(' : 'log(', () => handleFunction(shiftMode ? 'ln' : 'log'), styles.functionButton)}
//           {renderButton('⌫', backspace, styles.operatorButton)}

//           {/* Row 4 */}
//           {renderButton('π', handlePi, styles.functionButton)}
//           {renderButton('e', handleE, styles.functionButton)}
//           {renderButton('^', () => appendToInput('^'), styles.operatorButton)}
//           {renderButton('!', calculateFactorial, styles.functionButton)}
//           {renderButton('%', calculatePercentage, styles.operatorButton)}

//           {/* Row 5 */}
//           {renderButton('7', () => appendToInput('7'))}
//           {renderButton('8', () => appendToInput('8'))}
//           {renderButton('9', () => appendToInput('9'))}
//           {renderButton('÷', () => appendToInput('÷'), styles.operatorButton)}
//           {renderButton('+/-', () => {
//             try {
//               if (input === '0') return;
              
//               // If it's a simple number
//               if (/^-?\d*\.?\d*$/.test(input)) {
//                 setInput(input.startsWith('-') ? input.substring(1) : '-' + input);
//               } else {
//                 // For more complex expressions, wrap in parentheses and negate
//                 setInput(`-(${input})`);
//               }
//             } catch (e) {
//               setError('Sign change error');
//             }
//           }, styles.operatorButton)}

//           {/* Row 6 */}
//           {renderButton('4', () => appendToInput('4'))}
//           {renderButton('5', () => appendToInput('5'))}
//           {renderButton('6', () => appendToInput('6'))}
//           {renderButton('×', () => appendToInput('×'), styles.operatorButton)}
//           {renderButton('MS', handleMemoryStore, styles.functionButton)}

//           {/* Row 7 */}
//           {renderButton('1', () => appendToInput('1'))}
//           {renderButton('2', () => appendToInput('2'))}
//           {renderButton('3', () => appendToInput('3'))}
//           {renderButton('-', () => appendToInput('-'), styles.operatorButton)}
//           {renderButton('=', calculateResult, {
//             ...styles.equalsButton,
//             gridRow: 'span 2'
//           })}

//           {/* Row 8 */}
//           {renderButton('0', () => appendToInput('0'), {
//             ...styles.button,
//             gridColumn: 'span 2'
//           })}
//           {renderButton('.', () => {
//             if (!input.includes('.') || /[+\-×÷^][\d]*$/.test(input)) {
//               appendToInput('.');
//             }
//           })}
//           {renderButton('+', () => appendToInput('+'), styles.operatorButton)}
//         </div>

//         {/* Compact layout for mobile screens */}
//         <div className="md:hidden">
//           {/* Top row - modes and memory */}
//           <div className="grid grid-cols-5 gap-1 mb-1">
//             {renderButton(shiftMode ? 'DEG' : 'RAD', toggleAngleMode, styles.functionButton, isRadians)}
//             {renderButton('SHIFT', toggleShiftMode, styles.functionButton, shiftMode)}
//             {renderButton('M+', handleMemoryAdd, styles.functionButton)}
//             {renderButton('MR', handleMemoryRecall, styles.functionButton)}
//             {renderButton('MC', handleMemoryClear, styles.functionButton)}
//           </div>

//           {/* Clear and backspace */}
//           <div className="grid grid-cols-5 gap-1 mb-1">
//             {renderButton('C', clearInput, {
//               ...styles.operatorButton,
//               backgroundColor: isDark ? '#d32f2f' : '#ffcdd2',
//               color: isDark ? '#fff' : '#d32f2f'
//             })}
//             {renderButton('⌫', backspace, styles.operatorButton)}
//             {renderButton('( )', handleParenthesis, styles.functionButton)}
//             {renderButton('%', calculatePercentage, styles.operatorButton)}
//             {renderButton('MS', handleMemoryStore, styles.functionButton)}
//           </div>

//           {/* Trig and functions */}
//           <div className="grid grid-cols-5 gap-1 mb-1">
//             {renderButton(shiftMode ? 'asin' : 'sin', () => handleFunction(shiftMode? 'asin' : 'sin'), styles.functionButton)}
//             {renderButton(shiftMode ? 'acos' : 'cos', () => handleFunction(shiftMode ? 'acos' : 'cos'), styles.functionButton)}
//             {renderButton(shiftMode ? 'atan' : 'tan', () => handleFunction(shiftMode ? 'atan' : 'tan'), styles.functionButton)}
//             {renderButton(shiftMode ? 'ln' : 'log', () => handleFunction(shiftMode ? 'ln' : 'log'), styles.functionButton)}
//             {renderButton(shiftMode ? 'cbrt' : 'sqrt', () => handleFunction(shiftMode ? 'cbrt' : 'sqrt'), styles.functionButton)}
//           </div>

//           {/* Constants and special functions */}
//           <div className="grid grid-cols-5 gap-1 mb-1">
//             {renderButton('π', handlePi, styles.functionButton)}
//             {renderButton('e', handleE, styles.functionButton)}
//             {renderButton('^', () => appendToInput('^'), styles.operatorButton)}
//             {renderButton(shiftMode ? 'x³' : 'x²', shiftMode ? handleCube : handleSquare, styles.functionButton)}
//             {renderButton('!', calculateFactorial, styles.functionButton)}
//           </div>

//           {/* Numbers and basic operators */}
//           <div className="grid grid-cols-4 gap-1">
//             {renderButton('7', () => appendToInput('7'))}
//             {renderButton('8', () => appendToInput('8'))}
//             {renderButton('9', () => appendToInput('9'))}
//             {renderButton('÷', () => appendToInput('÷'), styles.operatorButton)}

//             {renderButton('4', () => appendToInput('4'))}
//             {renderButton('5', () => appendToInput('5'))}
//             {renderButton('6', () => appendToInput('6'))}
//             {renderButton('×', () => appendToInput('×'), styles.operatorButton)}

//             {renderButton('1', () => appendToInput('1'))}
//             {renderButton('2', () => appendToInput('2'))}
//             {renderButton('3', () => appendToInput('3'))}
//             {renderButton('-', () => appendToInput('-'), styles.operatorButton)}

//             {renderButton('0', () => appendToInput('0'), {
//               ...styles.button,
//               gridColumn: 'span 2'
//             })}
//             {renderButton('.', () => {
//               if (!input.includes('.') || /[+\-×÷^][\d]*$/.test(input)) {
//                 appendToInput('.');
//               }
//             })}
//             {renderButton('+', () => appendToInput('+'), styles.operatorButton)}
//           </div>

//           {/* Equals button */}
//           <div className="mt-1">
//             {renderButton('=', calculateResult, {
//               ...styles.equalsButton,
//               width: '100%'
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScientificCalculator;

import React, { useState, useEffect } from 'react';

const ScientificCalculator = ({ theme = 'light' }) => {
  const [input, setInput] = useState('0');
  const [result, setResult] = useState('');
  const [isRadians, setIsRadians] = useState(true);
  const [memory, setMemory] = useState(0);
  const [shiftMode, setShiftMode] = useState(false);
  const [error, setError] = useState('');
  const [bracketCount, setBracketCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Theme-based styling
  const isDark = theme === 'dark';
  
  const styles = {
    calculator: {
      backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
      color: isDark ? '#ffffff' : '#333333',
      borderRadius: '16px',
      boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.6)' : '0 10px 30px rgba(0, 0, 0, 0.15)',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '1rem',
    },
    display: {
      backgroundColor: isDark ? '#2d2d2d' : '#e8e8e8',
      borderRadius: '12px',
      padding: '0.75rem',
      marginBottom: '0.75rem',
      boxShadow: isDark ? 'inset 0 2px 8px rgba(0, 0, 0, 0.3)' : 'inset 0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    button: {
      backgroundColor: isDark ? '#3a3a3a' : '#fff',
      color: isDark ? '#fff' : '#333',
      borderColor: isDark ? '#555' : '#ddd',
      borderRadius: '8px',
      fontWeight: '500',
      transition: 'all 0.15s ease',
      height: '100%',
      boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    operatorButton: {
      backgroundColor: isDark ? '#444' : '#f0f0f0',
      color: isDark ? '#fff' : '#333',
      borderRadius: '8px',
      fontWeight: '600',
      boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    functionButton: {
      backgroundColor: isDark ? '#333' : '#e0e0e0',
      color: isDark ? '#fff' : '#333',
      borderRadius: '8px',
      fontSize: '0.9rem',
      boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    equalsButton: {
      backgroundColor: isDark ? '#4caf50' : '#4caf50',
      color: '#fff',
      borderRadius: '8px',
      fontWeight: 'bold',
      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
    },
    errorMsg: {
      color: isDark ? '#ff6b6b' : '#d32f2f',
      fontSize: '0.8rem',
      height: '1rem',
      textAlign: 'right',
      padding: '0.5rem 0.5rem 0',
    },
    activeButton: {
      backgroundColor: isDark ? '#555' : '#d4d4d4',
      boxShadow: isDark ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' : 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    historyPanel: {
      backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
      borderRadius: '12px',
      marginBottom: '0.75rem',
      maxHeight: '150px',
      overflowY: 'auto',
      padding: '0.75rem',
      boxShadow: isDark ? 'inset 0 2px 8px rgba(0, 0, 0, 0.3)' : 'inset 0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    historyItem: {
      borderBottom: `1px solid ${isDark ? '#444' : '#ddd'}`,
      padding: '0.5rem 0',
      cursor: 'pointer',
    },
    modeButton: {
      padding: '0.25rem 0.5rem',
      borderRadius: '8px',
      transition: 'all 0.15s ease',
      cursor: 'pointer',
    }
  };

  // Reset error message after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Track open brackets
  useEffect(() => {
    let count = 0;
    for (let char of input) {
      if (char === '(') count++;
      if (char === ')') count--;
    }
    setBracketCount(count);
  }, [input]);
  
  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent default behavior for certain keys
      if (['+', '-', '*', '/', '=', 'Enter', 'Backspace', 'Delete', 'Escape'].includes(event.key)) {
        event.preventDefault();
      }
      
      // Map keyboard input to calculator functions
      switch (event.key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          appendToInput(event.key);
          break;
        case '.':
          if (!input.includes('.') || /[+\-×÷^][\d]*$/.test(input)) {
            appendToInput('.');
          }
          break;
        case '+':
          appendToInput('+');
          break;
        case '-':
          appendToInput('-');
          break;
        case '*':
          appendToInput('×');
          break;
        case '/':
          appendToInput('÷');
          break;
        case '^':
          appendToInput('^');
          break;
        case '%':
          calculatePercentage();
          break;
        case '(':
          if (input === '0') {
            setInput('(');
          } else {
            const lastChar = input.slice(-1);
            const operators = ['+', '-', '×', '÷', '^', '(', '%'];
            
            if (operators.includes(lastChar)) {
              setInput(input + '(');
            } else {
              setInput(input + '×(');
            }
          }
          setBracketCount(prev => prev + 1);
          break;
        case ')':
          if (bracketCount > 0) {
            appendToInput(')');
            setBracketCount(prev => prev - 1);
          }
          break;
        case 'Enter':
        case '=':
          calculateResult();
          break;
        case 'Backspace':
          backspace();
          break;
        case 'Delete':
        case 'Escape':
          clearInput();
          break;
        case 'p':
          if (event.ctrlKey || event.metaKey) {
            handlePi();
          }
          break;
        case 'e':
          if (event.ctrlKey || event.metaKey) {
            handleE();
          }
          break;
        default:
          break;
      }
    };
    
    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [input, bracketCount]); // Add dependencies

  const appendToInput = (value) => {
    // Clear error if present
    if (error) setError('');
    
    // Handle special cases for operators
    const operators = ['+', '-', '×', '÷', '^', '%'];
    const lastChar = input.slice(-1);
    
    // If we're starting a new calculation after a result
    if (result && !operators.includes(value) && !['(', '.'].includes(value)) {
      if ('0123456789'.includes(value)) {
        setInput(value);
        setResult('');
        return;
      }
    }
    
    // Reset result display when starting a new input
    if (result && !operators.includes(value)) {
      setResult('');
    }
    
    // Append value based on context
    if (input === '0') {
      if (value === '.') {
        setInput('0.');
      } else if (!operators.includes(value)) {
        setInput(value);
      } else {
        setInput('0' + value);
      }
    } else {
      // Don't allow two operators in a row
      if (operators.includes(lastChar) && operators.includes(value)) {
        setInput(input.slice(0, -1) + value);
      } else {
        setInput(input + value);
      }
    }
  };

  const clearInput = () => {
    setInput('0');
    setResult('');
    setError('');
    setBracketCount(0);
  };

  const backspace = () => {
    if (error) {
      setError('');
      return;
    }
    
    if (input.length === 1) {
      setInput('0');
    } else {
      const lastChar = input.slice(-1);
      if (lastChar === '(') setBracketCount(prev => prev - 1);
      if (lastChar === ')') setBracketCount(prev => prev + 1);
      setInput(input.slice(0, -1));
    }
  };

  const calculateResult = () => {
    try {
      // Add missing closing brackets if needed
      let expressionToEvaluate = input;
      if (bracketCount > 0) {
        expressionToEvaluate += ')'.repeat(bracketCount);
      }
      
      // Convert input to a safe expression
      expressionToEvaluate = expressionToEvaluate
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, isRadians ? 'Math.sin(' : 'Math.sin((Math.PI/180)*')
        .replace(/cos\(/g, isRadians ? 'Math.cos(' : 'Math.cos((Math.PI/180)*')
        .replace(/tan\(/g, isRadians ? 'Math.tan(' : 'Math.tan((Math.PI/180)*')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/cbrt\(/g, 'Math.cbrt(')
        .replace(/asin\(/g, isRadians ? 'Math.asin(' : '(180/Math.PI)*Math.asin(')
        .replace(/acos\(/g, isRadians ? 'Math.acos(' : '(180/Math.PI)*Math.acos(')
        .replace(/atan\(/g, isRadians ? 'Math.atan(' : '(180/Math.PI)*Math.atan(')
        .replace(/\^/g, '**')
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
      
      // Validate expression before evaluation
      if (/[a-zA-Z]/.test(expressionToEvaluate.replace(/Math\.|sin|cos|tan|log|sqrt|cbrt|asin|acos|atan|PI|E/g, ''))) {
        throw new Error("Invalid characters in expression");
      }
      
      // Calculate and format result
      const calculatedResult = eval(expressionToEvaluate);
      
      if (!isFinite(calculatedResult)) {
        throw new Error("Result is undefined or infinity");
      }
      
      // Format the result nicely
      let formattedResult;
      if (Number.isInteger(calculatedResult)) {
        formattedResult = calculatedResult.toString();
      } else {
        // Show up to 8 decimal places but trim trailing zeros
        formattedResult = parseFloat(calculatedResult.toFixed(8)).toString();
      }
      
      setResult(formattedResult);
      
      // Add to history
      setHistory(prev => [{
        expression: input + (bracketCount > 0 ? ')'.repeat(bracketCount) : ''),
        result: formattedResult
      }, ...prev.slice(0, 9)]);
      
      setInput(formattedResult);
      setError('');
    } catch (error) {
      setError('Invalid expression');
      console.error("Calculation error:", error);
    }
  };

  const calculateFactorial = () => {
    try {
      const num = parseFloat(input);
      if (num < 0 || !Number.isInteger(num)) {
        setError('Only non-negative integers allowed for factorial');
        return;
      }
      
      if (num > 170) {
        setError('Number too large for factorial');
        return;
      }
      
      let factorial = 1;
      for (let i = 2; i <= num; i++) {
        factorial *= i;
      }
      
      setResult(factorial.toString());
      
      // Add to history
      setHistory(prev => [{
        expression: `${input}!`,
        result: factorial.toString()
      }, ...prev.slice(0, 9)]);
      
      setInput(factorial.toString());
      setError('');
    } catch (error) {
      setError('Factorial calculation error');
    }
  };

  const handleSquare = () => {
    try {
      const num = parseFloat(input);
      const result = num * num;
      
      if (!isFinite(result)) {
        setError('Result too large');
        return;
      }
      
      setResult(result.toString());
      
      // Add to history
      setHistory(prev => [{
        expression: `${input}²`,
        result: result.toString()
      }, ...prev.slice(0, 9)]);
      
      setInput(result.toString());
      setError('');
    } catch (error) {
      setError('Calculation error');
    }
  };

  const handleCube = () => {
    try {
      const num = parseFloat(input);
      const result = num * num * num;
      
      if (!isFinite(result)) {
        setError('Result too large');
        return;
      }
      
      setResult(result.toString());
      
      // Add to history
      setHistory(prev => [{
        expression: `${input}³`,
        result: result.toString()
      }, ...prev.slice(0, 9)]);
      
      setInput(result.toString());
      setError('');
    } catch (error) {
      setError('Calculation error');
    }
  };

  const handleFunction = (func) => {
    if (input === '0') {
      setInput(`${func}(`);
    } else {
      // Check if we're already in the middle of an expression
      const lastChar = input.slice(-1);
      const operators = ['+', '-', '×', '÷', '^', '(', '%'];
      
      // If last character is an operator or we're starting a new calculation after a result
      if (operators.includes(lastChar) || result) {
        setInput(input + `${func}(`);
      } else {
        // Otherwise, assume we want to apply the function to the current value
        setInput(`${func}(${input})`);
      }
    }
    
    setBracketCount(prev => prev + 1);
    setError('');
  };

  const handleParenthesis = () => {
    // Smart bracket handling
    if (bracketCount > 0) {
      // Close a bracket
      appendToInput(')');
      setBracketCount(prev => prev - 1);
    } else {
      // Open a bracket
      const lastChar = input.slice(-1);
      const operators = ['+', '-', '×', '÷', '^', '(', '%'];
      
      if (input === '0') {
        setInput('(');
      } else if (operators.includes(lastChar)) {
        setInput(input + '(');
      } else {
        // If we're not after an operator, add multiply then open bracket
        setInput(input + '×(');
      }
      
      setBracketCount(prev => prev + 1);
    }
  };

  const handlePi = () => {
    if (input === '0') {
      setInput('π');
    } else {
      const lastChar = input.slice(-1);
      const operators = ['+', '-', '×', '÷', '^', '(', '%'];
      
      if (operators.includes(lastChar)) {
        setInput(input + 'π');
      } else {
        // If we're not after an operator, add multiply then pi
        setInput(input + '×π');
      }
    }
  };

  const handleE = () => {
    if (input === '0') {
      setInput('e');
    } else {
      const lastChar = input.slice(-1);
      const operators = ['+', '-', '×', '÷', '^', '(', '%'];
      
      if (operators.includes(lastChar)) {
        setInput(input + 'e');
      } else {
        // If we're not after an operator, add multiply then e
        setInput(input + '×e');
      }
    }
  };

  const toggleAngleMode = () => {
    setIsRadians(!isRadians);
  };

  const toggleShiftMode = () => {
    setShiftMode(!shiftMode);
  };

  const handleMemoryStore = () => {
    try {
      setMemory(parseFloat(result || input));
    } catch (error) {
      setError('Memory store error');
    }
  };

  const handleMemoryRecall = () => {
    if (memory !== null) {
      setInput(memory.toString());
    }
  };

  const handleMemoryClear = () => {
    setMemory(0);
    setError('');
  };

  const handleMemoryAdd = () => {
    try {
      setMemory(memory + parseFloat(result || input));
    } catch (error) {
      setError('Memory add error');
    }
  };

  const handleMemorySubtract = () => {
    try {
      setMemory(memory - parseFloat(result || input));
    } catch (error) {
      setError('Memory subtract error');
    }
  };

  const handleHistoryItemClick = (item) => {
    setInput(item.expression);
    setResult(item.result);
  };

  const handleAngleModeFromDisplay = () => {
    setIsRadians(!isRadians);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const renderButton = (label, onClick, buttonStyle = styles.button, isActive = false) => (
    <button 
      onClick={onClick}
      className="p-1 sm:p-2 lg:p-3 m-0.5 sm:m-1 text-xs sm:text-sm md:text-base rounded text-center transition-all hover:opacity-90 active:translate-y-0.5"
      style={{
        ...buttonStyle,
        ...(isActive ? styles.activeButton : {})
      }}
    >
      {label}
    </button>
  );

  const convertToStandard = () => {
    try {
      const num = parseFloat(input);
      setInput(num.toExponential(4));
    } catch (error) {
      setError('Cannot convert to scientific notation');
    }
  };

  const calculatePercentage = () => {
    try {
      const lastOperatorIndex = Math.max(
        input.lastIndexOf('+'),
        input.lastIndexOf('-'),
        input.lastIndexOf('×'),
        input.lastIndexOf('÷')
      );
      
      if (lastOperatorIndex === -1) {
        // No operator, just convert to percentage
        const value = parseFloat(input) / 100;
        setInput(value.toString());
      } else {
        // Get the number after the last operator
        const baseValue = input.substring(0, lastOperatorIndex);
        const operator = input[lastOperatorIndex];
        const percentValue = parseFloat(input.substring(lastOperatorIndex + 1)) / 100;
        
        let newValue;
        if (operator === '+' || operator === '-') {
          // For + and -, calculate percent of the base value
          const base = eval(baseValue.replace(/×/g, '*').replace(/÷/g, '/'));
          newValue = percentValue * base;
        } else {
          // For × and ÷, just use the percentage value
          newValue = percentValue;
        }
        
        // Replace the percentage part
        setInput(baseValue + operator + newValue.toString());
      }
    } catch (error) {
      setError('Percentage calculation error');
    }
  };

  return (
    <div className="flex md:mt-16 mt-20 justify-center items-center w-full px-2 py-4">
      <div className="w-full sm:w-4/5 md:w-3/4 lg:w-3/5 xl:w-2/5 rounded-2xl overflow-hidden shadow-2xl" style={styles.calculator}>
        {/* History panel (collapsible) */}
        {showHistory && (
          <div style={styles.historyPanel} className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-sm sm:text-base">Calculation History</h3>
              <button
                onClick={clearHistory}
                className="text-xs py-1 px-2 rounded"
                style={styles.functionButton}
              >
                Clear History
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-sm italic opacity-70">No history yet</p>
            ) : (
              history.map((item, index) => (
                <div 
                  key={index}
                  style={styles.historyItem}
                  onClick={() => handleHistoryItemClick(item)}
                  className="hover:opacity-80"
                >
                  <div className="text-xs opacity-70">{item.expression} =</div>
                  <div className="font-bold">{item.result}</div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Display */}
        <div className="w-full rounded-xl" style={styles.display}>
          <div className="text-xs sm:text-sm opacity-70 h-4 sm:h-6 overflow-x-auto whitespace-nowrap">
            {result && `${input} =`}
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold overflow-x-auto whitespace-nowrap pb-1 sm:pb-2">
            {result || input}
          </div>
          <div className="flex flex-wrap justify-between text-xs mt-1 sm:mt-2 border-t pt-1 sm:pt-2 border-opacity-20" style={{ borderColor: isDark ? '#555' : '#ccc' }}>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
              <span 
                className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs cursor-pointer hover:opacity-80`}
                style={{ 
                  backgroundColor: isRadians ? (isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)') : 'transparent',
                  ...styles.modeButton
                }}
                onClick={handleAngleModeFromDisplay}
              >
                RAD
              </span>
              <span 
                className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs cursor-pointer hover:opacity-80`}
                style={{ 
                  backgroundColor: !isRadians ? (isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)') : 'transparent',
                  ...styles.modeButton
                }}
                onClick={handleAngleModeFromDisplay}
              >
                DEG
              </span>
              {shiftMode && (
                <span className="px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs bg-opacity-20 bg-blue-500" style={{ backgroundColor: isDark ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)' }}>
                  SHIFT
                </span>
              )}
              <span 
                className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs cursor-pointer hover:opacity-80 ml-1`}
                style={{
                  backgroundColor: showHistory ? (isDark ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)') : 'transparent',
                  ...styles.modeButton
                }}
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'HIDE HISTORY' : 'HISTORY'}
              </span>
            </div>
            <div>
              {bracketCount > 0 && (
                <span className="px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs bg-opacity-20 bg-yellow-500" style={{ backgroundColor: isDark ? 'rgba(255, 193, 7, 0.2)' : 'rgba(255, 193, 7, 0.1)' }}>
                  {bracketCount} open bracket{bracketCount > 1 ? 's' : ''}
                </span>
              )}
              {memory !== 0 && (
                <span className="px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs bg-opacity-20 bg-purple-500 ml-1" style={{ backgroundColor: isDark ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.1)' }}>
                  M
                </span>
              )}
            </div>
          </div>
          <div style={styles.errorMsg} className="text-xs sm:text-sm">{error}</div>
        </div>

        {/* Button grid - standard layout for larger screens */}
        <div className="hidden md:grid grid-cols-5 gap-1 sm:gap-2">
          {/* Row 1 */}
          {renderButton(shiftMode ? 'DEG' : 'RAD', toggleAngleMode, styles.functionButton, isRadians)}
          {renderButton('MC', handleMemoryClear, styles.functionButton)}
          {renderButton('MR', handleMemoryRecall, styles.functionButton)}
          {renderButton('M+', handleMemoryAdd, styles.functionButton)}
          {renderButton('M-', handleMemorySubtract, styles.functionButton)}

          {/* Row 2 */}
          {renderButton('SHIFT', toggleShiftMode, styles.functionButton, shiftMode)}
          {renderButton(shiftMode ? 'x³' : 'x²', shiftMode ? handleCube : handleSquare, styles.functionButton)}
          {renderButton(shiftMode ? 'cbrt(' : 'sqrt(', () => handleFunction(shiftMode ? 'cbrt' : 'sqrt'), styles.functionButton)}
          {renderButton('( )', handleParenthesis, styles.functionButton)}
          {renderButton('C', clearInput, {
            ...styles.operatorButton,
            backgroundColor: isDark ? '#d32f2f' : '#ffcdd2',
            color: isDark ? '#fff' : '#d32f2f'
          })}

          {/* Row 3 */}
          {renderButton(shiftMode ? 'asin(' : 'sin(', () => handleFunction(shiftMode ? 'asin' : 'sin'), styles.functionButton)}
          {renderButton(shiftMode ? 'acos(' : 'cos(', () => handleFunction(shiftMode ? 'acos' : 'cos'), styles.functionButton)}
          {renderButton(shiftMode ? 'atan(' : 'tan(', () => handleFunction(shiftMode ? 'atan' : 'tan'), styles.functionButton)}
          {renderButton(shiftMode ? 'ln(' : 'log(', () => handleFunction(shiftMode ? 'ln' : 'log'), styles.functionButton)}
          {renderButton('⌫', backspace, styles.operatorButton)}

          {/* Row 4 */}
          {renderButton('π', handlePi, styles.functionButton)}
          {renderButton('e', handleE, styles.functionButton)}
          {renderButton('^', () => appendToInput('^'), styles.operatorButton)}
          {renderButton('!', calculateFactorial, styles.functionButton)}
          {renderButton('%', calculatePercentage, styles.operatorButton)}

          {/* Row 5 */}
          {renderButton('7', () => appendToInput('7'))}
          {renderButton('8', () => appendToInput('8'))}
          {renderButton('9', () => appendToInput('9'))}
          {renderButton('÷', () => appendToInput('÷'), styles.operatorButton)}
          {renderButton('+/-', () => {
            try {
              if (input === '0') return;
              
              // If it's a simple number
              if (/^-?\d*\.?\d*$/.test(input)) {
                setInput(input.startsWith('-') ? input.substring(1) : '-' + input);
              } else {
                // For more complex expressions, wrap in parentheses and negate
                setInput(`-(${input})`);
              }
            } catch (e) {
              setError('Sign change error');
            }
          }, styles.operatorButton)}

{/* Row 6 */}
{renderButton('4', () => appendToInput('4'))}
          {renderButton('5', () => appendToInput('5'))}
          {renderButton('6', () => appendToInput('6'))}
          {renderButton('×', () => appendToInput('×'), styles.operatorButton)}
          {renderButton('1/x', () => {
            try {
              const num = parseFloat(input);
              if (num === 0) {
                setError('Cannot divide by zero');
                return;
              }
              const result = 1 / num;
              setResult(result.toString());
              setInput(result.toString());
              
              // Add to history
              setHistory(prev => [{
                expression: `1/${input}`,
                result: result.toString()
              }, ...prev.slice(0, 9)]);
            } catch (e) {
              setError('Calculation error');
            }
          }, styles.operatorButton)}

          {/* Row 7 */}
          {renderButton('1', () => appendToInput('1'))}
          {renderButton('2', () => appendToInput('2'))}
          {renderButton('3', () => appendToInput('3'))}
          {renderButton('-', () => appendToInput('-'), styles.operatorButton)}
          {renderButton('EXP', convertToStandard, styles.operatorButton)}

          {/* Row 8 */}
          {renderButton('0', () => appendToInput('0'))}
          {renderButton('.', () => {
            if (!input.includes('.') || /[+\-×÷^][\d]*$/.test(input)) {
              appendToInput('.');
            }
          })}
          {renderButton('MS', handleMemoryStore, styles.functionButton)}
          {renderButton('+', () => appendToInput('+'), styles.operatorButton)}
          {renderButton('=', calculateResult, styles.equalsButton)}
        </div>

        {/* Button grid - compact layout for smaller screens */}
        <div className="grid md:hidden grid-cols-4 gap-1 sm:gap-2">
          {/* Row 1 */}
          {renderButton('C', clearInput, {
            ...styles.operatorButton,
            backgroundColor: isDark ? '#d32f2f' : '#ffcdd2',
            color: isDark ? '#fff' : '#d32f2f'
          })}
          {renderButton('( )', handleParenthesis, styles.functionButton)}
          {renderButton('%', calculatePercentage, styles.operatorButton)}
          {renderButton('⌫', backspace, styles.operatorButton)}

          {/* Row 2 */}
          {renderButton(shiftMode ? 'x³' : 'x²', shiftMode ? handleCube : handleSquare, styles.functionButton)}
          {renderButton(shiftMode ? 'cbrt(' : 'sqrt(', () => handleFunction(shiftMode ? 'cbrt' : 'sqrt'), styles.functionButton)}
          {renderButton('^', () => appendToInput('^'), styles.operatorButton)}
          {renderButton('÷', () => appendToInput('÷'), styles.operatorButton)}

          {/* Row 3 */}
          {renderButton('7', () => appendToInput('7'))}
          {renderButton('8', () => appendToInput('8'))}
          {renderButton('9', () => appendToInput('9'))}
          {renderButton('×', () => appendToInput('×'), styles.operatorButton)}

          {/* Row 4 */}
          {renderButton('4', () => appendToInput('4'))}
          {renderButton('5', () => appendToInput('5'))}
          {renderButton('6', () => appendToInput('6'))}
          {renderButton('-', () => appendToInput('-'), styles.operatorButton)}

          {/* Row 5 */}
          {renderButton('1', () => appendToInput('1'))}
          {renderButton('2', () => appendToInput('2'))}
          {renderButton('3', () => appendToInput('3'))}
          {renderButton('+', () => appendToInput('+'), styles.operatorButton)}

          {/* Row 6 */}
          {renderButton('SHIFT', toggleShiftMode, styles.functionButton, shiftMode)}
          {renderButton('0', () => appendToInput('0'))}
          {renderButton('.', () => {
            if (!input.includes('.') || /[+\-×÷^][\d]*$/.test(input)) {
              appendToInput('.');
            }
          })}
          {renderButton('=', calculateResult, styles.equalsButton)}

          {/* Row 7 - Scientific functions (collapsible) */}
          <div className="col-span-4 grid grid-cols-4 gap-1 sm:gap-2 mt-1">
            {renderButton(isRadians ? 'RAD' : 'DEG', toggleAngleMode, styles.functionButton, isRadians)}
            {renderButton('π', handlePi, styles.functionButton)}
            {renderButton('e', handleE, styles.functionButton)}
            {renderButton('!', calculateFactorial, styles.functionButton)}
          </div>

          {/* Row 8 - Trig functions */}
          <div className="col-span-4 grid grid-cols-4 gap-1 sm:gap-2">
            {renderButton(shiftMode ? 'asin(' : 'sin(', () => handleFunction(shiftMode ? 'asin' : 'sin'), styles.functionButton)}
            {renderButton(shiftMode ? 'acos(' : 'cos(', () => handleFunction(shiftMode ? 'acos' : 'cos'), styles.functionButton)}
            {renderButton(shiftMode ? 'atan(' : 'tan(', () => handleFunction(shiftMode ? 'atan' : 'tan'), styles.functionButton)}
            {renderButton(shiftMode ? 'ln(' : 'log(', () => handleFunction(shiftMode ? 'ln' : 'log'), styles.functionButton)}
          </div>

          {/* Row 9 - Memory functions */}
          <div className="col-span-4 grid grid-cols-5 gap-1 sm:gap-2">
            {renderButton('MC', handleMemoryClear, styles.functionButton)}
            {renderButton('MR', handleMemoryRecall, styles.functionButton)}
            {renderButton('MS', handleMemoryStore, styles.functionButton)}
            {renderButton('M+', handleMemoryAdd, styles.functionButton)}
            {renderButton('M-', handleMemorySubtract, styles.functionButton)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;