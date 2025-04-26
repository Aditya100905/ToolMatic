import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MatrixSolver = () => {
  const { theme } = useTheme();
  
  // Dynamic sizing based on screen width
  const getMaxSize = useCallback(() => {
    if (window.innerWidth < 640) return 4;
    if (window.innerWidth < 1024) return 6;
    return 8;
  }, []);
  
  const [maxSize, setMaxSize] = useState(getMaxSize());
  const [currentOp, setCurrentOp] = useState(null);
  const [shake, setShake] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Matrix dimensions and content
  const [rowsA, setRowsA] = useState(3);
  const [colsA, setColsA] = useState(3);
  const [rowsB, setRowsB] = useState(3);
  const [colsB, setColsB] = useState(3);
  const [matrixA, setMatrixA] = useState(() => generateMatrix(3, 3));
  const [matrixB, setMatrixB] = useState(() => generateMatrix(3, 3));
  const [result, setResult] = useState(null);
  const [scalar, setScalar] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => setMaxSize(getMaxSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getMaxSize]);
  
  // Generate empty matrix
  function generateMatrix(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(null));
  }
  
  // Resize matrix when dimensions change
  const resizeMatrix = useCallback((matrix, newRows, newCols) => {
    return Array.from({ length: newRows }, (_, i) =>
      Array.from({ length: newCols }, (_, j) => matrix[i]?.[j] ?? null)
    );
  }, []);
  

  useEffect(() => {
    const savedHistory = localStorage.getItem('matrixHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  
  // Update matrices when dimensions change
  useEffect(() => {
    setMatrixA(prev => resizeMatrix(prev, rowsA, colsA));
  }, [rowsA, colsA, resizeMatrix]);
  
  useEffect(() => {
    setMatrixB(prev => resizeMatrix(prev, rowsB, colsB));
  }, [rowsB, colsB, resizeMatrix]);
  
  // Handle input changes in matrices
  const handleMatrixChange = (setMatrix, matrix, row, col) => (e) => {
    const value = e.target.value === "" ? null : parseFloat(e.target.value);
    const newMatrix = matrix.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? value : cell))
    );
    setMatrix(newMatrix);
  };
  
  // Handle dimension changes with validation
  const handleDimensionChange = (setter, value) => {
    const newValue = Math.min(maxSize, Math.max(1, parseInt(value) || 1));
    if (newValue >= maxSize) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.warn(`Reached max dimension limit of ${maxSize}!`);
    }
    setter(newValue);
  };
  
  // Fill matrix with random values
  const fillRandom = (setMatrix, rows, cols) => {
    const newMatrix = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(Math.random() * 10) - 5)
    );
    setMatrix(newMatrix);
  };
  
  // Clear matrix values
  const clearMatrix = (setMatrix, rows, cols) => {
    setMatrix(generateMatrix(rows, cols));
  };
  
  // Matrix operations
  const computeDeterminant = (mat) => {
    const n = mat.length;
    if (n === 1) return mat[0][0];
    if (n === 2) return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
    
    let det = 0;
    for (let col = 0; col < n; col++) {
      const subMatrix = mat
        .slice(1)
        .map((row) => row.filter((_, j) => j !== col));
      det +=
        (col % 2 === 0 ? 1 : -1) * mat[0][col] * computeDeterminant(subMatrix);
    }
    return det;
  };
  
  const invertMatrix = (mat) => {
    const n = mat.length;
    const det = computeDeterminant(mat);
    
    if (Math.abs(det) < 1e-10) {
      throw new Error("Matrix is singular and cannot be inverted");
    }
    
    let aug = mat.map((row, i) => [
      ...row,
      ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
    ]);
    
    // Gauss-Jordan elimination
    for (let i = 0; i < n; i++) {
      // Find maximum pivot
      let maxRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(aug[j][i]) > Math.abs(aug[maxRow][i])) {
          maxRow = j;
        }
      }
      
      // Swap rows
      if (maxRow !== i) {
        [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];
      }
      
      let pivot = aug[i][i];
      if (Math.abs(pivot) < 1e-10) {
        throw new Error("Matrix is singular and cannot be inverted");
      }
      
      // Scale current row
      for (let j = 0; j < 2 * n; j++) {
        aug[i][j] /= pivot;
      }
      
      // Eliminate other rows
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          let factor = aug[k][i];
          for (let j = 0; j < 2 * n; j++) {
            aug[k][j] -= factor * aug[i][j];
          }
        }
      }
    }
    
    // Extract the right part as the inverse
    return aug.map((row) => row.slice(n).map(val => Number(val.toFixed(4))));
  };
  
  const transposeMatrix = (mat) => {
    const rows = mat.length;
    const cols = mat[0].length;
    const result = Array.from({ length: cols }, () => Array(rows).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result[j][i] = mat[i][j] || 0;
      }
    }
    
    return result;
  };
  
  const scalarMultiply = (mat, scalar) => {
    return mat.map(row => row.map(val => (val || 0) * scalar));
  };
  
// Save operation to history
const saveToHistory = (operation, resultMat) => {
  const newEntry = {
    id: Date.now(),
    operation,
    matrixA: JSON.parse(JSON.stringify(matrixA)),
    matrixB: JSON.parse(JSON.stringify(matrixB)),
    result: JSON.parse(JSON.stringify(resultMat)),
    scalar,
    rowsA,
    colsA,
    rowsB,
    colsB,
    timestamp: new Date().toLocaleString(),
  };

  setHistory(prev => {
    const updatedHistory = [newEntry, ...prev].slice(0, 10);
    localStorage.setItem('matrixHistory', JSON.stringify(updatedHistory)); // Save to localStorage
    return updatedHistory;
  });
};


// Restore from history
const restoreFromHistory = (entry) => {
  setRowsA(entry.rowsA);
  setColsA(entry.colsA);
  setRowsB(entry.rowsB);
  setColsB(entry.colsB);
  setMatrixA(JSON.parse(JSON.stringify(entry.matrixA)));
  setMatrixB(JSON.parse(JSON.stringify(entry.matrixB)));
  setResult(JSON.parse(JSON.stringify(entry.result)));
  setScalar(entry.scalar);
  setCurrentOp(entry.operation);

  toast.info(`Restored: ${entry.operation} (${entry.timestamp})`);
};

  
  // Perform matrix calculation
  const calculate = (operation) => {
    setLoading(true);
    setCurrentOp(operation);
    
    // Short delay for UI feedback
    setTimeout(() => {
      try {
        let res;
        const matA = matrixA.map(row => row.map(val => val || 0));
        const matB = matrixB.map(row => row.map(val => val || 0));
        
        switch (operation) {
          case "add":
            if (rowsA !== rowsB || colsA !== colsB) {
              throw new Error("Matrix dimensions must be the same for addition!");
            }
            res = matA.map((row, i) => row.map((val, j) => val + matB[i][j]));
            break;
            
          case "subtract":
            if (rowsA !== rowsB || colsA !== colsB) {
              throw new Error("Matrix dimensions must be the same for subtraction!");
            }
            res = matA.map((row, i) => row.map((val, j) => val - matB[i][j]));
            break;
            
          case "multiply":
            if (colsA !== rowsB) {
              throw new Error("Matrix dimensions invalid for multiplication! Columns of A must equal rows of B");
            }
            res = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
            for (let i = 0; i < rowsA; i++) {
              for (let j = 0; j < colsB; j++) {
                for (let k = 0; k < colsA; k++) {
                  res[i][j] += matA[i][k] * matB[k][j];
                }
                // Round to avoid floating point issues
                res[i][j] = Number(res[i][j].toFixed(4));
              }
            }
            break;
            
          case "scalar-A":
            res = scalarMultiply(matA, scalar);
            break;
            
          case "scalar-B":
            res = scalarMultiply(matB, scalar);
            break;
            
          case "determinant-A":
            if (rowsA !== colsA) {
              throw new Error("Matrix A must be square to compute determinant!");
            }
            const detA = computeDeterminant(matA);
            res = [[Number(detA.toFixed(4))]];
            break;
            
          case "determinant-B":
            if (rowsB !== colsB) {
              throw new Error("Matrix B must be square to compute determinant!");
            }
            const detB = computeDeterminant(matB);
            res = [[Number(detB.toFixed(4))]];
            break;
            
          case "inverse-A":
            if (rowsA !== colsA) {
              throw new Error("Matrix A must be square for inverse!");
            }
            res = invertMatrix(matA);
            break;
            
          case "inverse-B":
            if (rowsB !== colsB) {
              throw new Error("Matrix B must be square for inverse!");
            }
            res = invertMatrix(matB);
            break;
            
          case "transpose-A":
            res = transposeMatrix(matA);
            break;
            
          case "transpose-B":
            res = transposeMatrix(matB);
            break;
            
          default:
            throw new Error("Unknown operation");
        }
        
        setResult(res);
        saveToHistory(operation, res);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }, 300);
  };
  
  // Render matrix with inputs and controls
  const renderMatrix = (
    matrix,
    setMatrix,
    title,
    rows,
    cols,
    setRows,
    setCols
  ) => (
    <motion.div
      className={`p-6 rounded-2xl shadow-lg transition-all w-full max-w-xl 
        ${theme === "dark" ? "bg-[#1c1c1c] text-white" : "bg-white text-black"}`}
      animate={shake ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-3 items-center">
          <span className="text-sm font-medium">Rows</span>
          <input
            type="number"
            value={rows}
            onChange={(e) => handleDimensionChange(setRows, e.target.value)}
            className="w-14 p-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-500"
            min="1"
            max={maxSize}
          />
          <span className="text-sm font-medium">Cols</span>
          <input
            type="number"
            value={cols}
            onChange={(e) => handleDimensionChange(setCols, e.target.value)}
            className="w-14 p-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-500"
            min="1"
            max={maxSize}
          />
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => fillRandom(setMatrix, rows, cols)}
          className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Random
        </button>
        <button
          onClick={() => clearMatrix(setMatrix, rows, cols)}
          className="px-3 py-1 text-sm rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
        >
          Clear
        </button>
      </div>
      
      <div
        className="grid gap-1 sm:gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(45px, 1fr))`,
        }}
      >
        {matrix.map((row, i) =>
          row.map((value, j) => (
            <input
              key={`${title}-${i}-${j}`}
              type="number"
              value={value !== null ? value : ""}
              onChange={handleMatrixChange(setMatrix, matrix, i, j)}
              className={`w-full h-10 sm:h-12 text-center rounded-lg shadow-sm transition-all 
                ${theme === "dark" ? "bg-[#2c2c2c] text-white" : "bg-gray-100 text-black"}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-105`}
              inputMode="decimal"
              step="any"
            />
          ))
        )}
      </div>
    </motion.div>
  );
  
  // Render operation buttons in groups
  const renderOperationButtons = () => {
    const operations = [
      { 
        title: "Basic Operations",
        ops: [
          { id: "add", label: "A + B" },
          { id: "subtract", label: "A - B" },
          { id: "multiply", label: "A × B" }
        ]
      },
      {
        title: "Scalar Operations",
        ops: [
          { id: "scalar-A", label: "k × A" },
          { id: "scalar-B", label: "k × B" }
        ]
      },
      {
        title: "Matrix A Operations",
        ops: [
          { id: "determinant-A", label: "det(A)" },
          { id: "inverse-A", label: "A⁻¹" },
          { id: "transpose-A", label: "Aᵀ" }
        ]
      },
      {
        title: "Matrix B Operations",
        ops: [
          { id: "determinant-B", label: "det(B)" },
          { id: "inverse-B", label: "B⁻¹" },
          { id: "transpose-B", label: "Bᵀ" }
        ]
      }
    ];
  
    return (
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-wrap gap-8 justify-center text-white">
        {operations.map((group) => (
          <div
            key={group.title}
            className="flex flex-col items-center p-6 bg-gray-800 rounded-xl shadow-lg min-w-[250px]"
          >
            <h3 className="text-xl font-semibold mb-4 text-center">{group.title}</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {group.ops.map((op) => (
                <button
                  key={op.id}
                  onClick={() => calculate(op.id)}
                  disabled={loading}
                  className={`px-5 py-2 rounded-lg font-bold shadow transition-all
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} 
                    text-white`}
                >
                  {op.label}
                </button>
              ))}
  
              {group.title === "Scalar Operations" && (
                <input
                  type="number"
                  value={scalar || ""}
                  onChange={(e) => setScalar(parseFloat(e.target.value) || 0)}
                  className="w-24 px-4 py-2 rounded-lg bg-gray-700 text-white border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center placeholder-gray-400"
                  placeholder="Enter k"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  
  // Render the result matrix
  const renderResult = () => {
    if (!result) return null;
    
    const rows = result.length;
    const cols = result[0].length;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 rounded-2xl shadow-lg w-full max-w-4xl
          ${theme === 'dark' ? 'bg-[#1c1c1c] text-white' : 'bg-white text-black'}"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Result: {currentOp && 
              currentOp.replace("-", " ").replace("A", "Matrix A").replace("B", "Matrix B")}
          </h2>
          <div className="text-sm opacity-75">
            {rows} × {cols}
          </div>
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(60px, 1fr))`,
            }}
          >
            {result.map((row, i) =>
              row.map((val, j) => (
                <div
                  key={`result-${i}-${j}`}
                  className={`p-2 h-12 flex justify-center items-center rounded-lg shadow-md
                    ${theme === "dark" ? "bg-[#2c2c2c]" : "bg-blue-100"}`}
                >
                  {val?.toFixed ? val.toFixed(4).replace(/\.?0+$/, "") : val}
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    );
  };
  
  const renderHistory = () => {
    if (history.length === 0) {
      return (
        <div className="text-center p-4 opacity-75">No calculation history yet</div>
      );
    }
    
    return (
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Calculation History</h3>
          <button
            onClick={() => setHistory([])}
            className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Clear History
          </button>
        </div>
        
        <div className="space-y-3">
          {history.map(entry => (
            <div 
              key={entry.id}
              className={`p-4 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg
                ${theme === "dark" ? "bg-[#1c1c1c]" : "bg-white"}`}
              onClick={() => restoreFromHistory(entry)}
            >
              <div className="flex justify-between">
                <div className="font-medium">
                  {entry.operation.replace("-", " ").replace("A", "Matrix A").replace("B", "Matrix B")}
                </div>
                <div className="text-sm opacity-75">{entry.timestamp}</div>
              </div>
              <div className="text-xs mt-1 opacity-75">
                Matrix A: {entry.rowsA}×{entry.colsA}, 
                Matrix B: {entry.rowsB}×{entry.colsB},
                Result: {entry.result.length}×{entry.result[0].length}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div
      className={`min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center transition-all 
        ${theme === "dark" ? "bg-[#0e0e0e] text-white" : "bg-gray-100 text-black"}`}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
      />
      
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 mt-16">
        Matrix Calculator
      </h1>
      
      <div className="flex flex-wrap justify-center gap-6 w-full mb-8">
        {renderMatrix(
          matrixA,
          setMatrixA,
          "Matrix A",
          rowsA,
          colsA,
          setRowsA,
          setColsA
        )}
        {renderMatrix(
          matrixB,
          setMatrixB,
          "Matrix B",
          rowsB,
          colsB,
          setRowsB,
          setColsB
        )}
      </div>
      
      {renderOperationButtons()}
      
      {renderResult()}
      
      <div className="w-full max-w-4xl mt-8">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`w-full py-2 rounded-lg font-medium transition-all
            ${theme === "dark" ? "bg-[#1c1c1c]" : "bg-white"} 
            hover:opacity-90`}
        >
          {showHistory ? "Hide History" : "Show History"} ({history.length})
        </button>
        
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              {renderHistory()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-center text-sm opacity-75 mt-10 mb-6">
        Matrix Calculator - Supports operations on matrices up to {maxSize}×{maxSize}
      </div>
    </div>
  );
};

export default MatrixSolver;