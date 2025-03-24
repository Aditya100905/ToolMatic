import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MatrixSolver = () => {
  const { theme } = useTheme();

  // Responsive max size
  const getMaxSize = () => {
    if (window.innerWidth < 640) return 4; // Mobile
    if (window.innerWidth < 1024) return 6; // Tablet
    return 7; // Desktop
  };

  const [maxSize, setMaxSize] = useState(getMaxSize());
  const [currentOp, setCurrentOp] = useState(null);
  const [shake, setShake] = useState(false); // To trigger shake animation

  useEffect(() => {
    const handleResize = () => setMaxSize(getMaxSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [rowsA, setRowsA] = useState(3);
  const [colsA, setColsA] = useState(3);
  const [rowsB, setRowsB] = useState(3);
  const [colsB, setColsB] = useState(3);

  const [matrixA, setMatrixA] = useState(generateMatrix(3, 3));
  const [matrixB, setMatrixB] = useState(generateMatrix(3, 3));
  const [result, setResult] = useState(null);

  const resizeMatrix = (matrix, newRows, newCols) => {
    const resized = Array.from({ length: newRows }, (_, i) =>
      Array.from({ length: newCols }, (_, j) => matrix[i]?.[j] ?? null)
    );
    return resized;
  };

  useEffect(() => {
    setMatrixA((prev) => resizeMatrix(prev, rowsA, colsA));
  }, [rowsA, colsA]);

  useEffect(() => {
    setMatrixB((prev) => resizeMatrix(prev, rowsB, colsB));
  }, [rowsB, colsB]);

  function generateMatrix(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  const handleMatrixChange = (setMatrix, matrix, row, col) => (e) => {
    const value = e.target.value === "" ? null : parseInt(e.target.value) || 0;
    const newMatrix = matrix.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? value : cell))
    );
    setMatrix(newMatrix);
  };

  const handleDimensionChange = (setter, value) => {
    const newValue = Math.min(maxSize + 1, Math.max(1, parseInt(value) || 1));

    if (newValue >= maxSize) {
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake effect
      toast.warn("Reached max dimension limit!");
    } else {
    }

    setter(newValue);
  };

  const calculate = (operation) => {
    let res;
    setCurrentOp(operation);

    switch (operation) {
      case "add":
        if (rowsA !== rowsB || colsA !== colsB) {
          toast.error("Matrix dimensions must be the same for addition!");
          return;
        }
        res = matrixA.map((row, i) =>
          row.map((val, j) => (val || 0) + (matrixB[i][j] || 0))
        );
        break;

      case "subtract":
        if (rowsA !== rowsB || colsA !== colsB) {
          toast.error("Matrix dimensions must be the same for subtraction!");
          return;
        }
        res = matrixA.map((row, i) =>
          row.map((val, j) => (val || 0) - (matrixB[i][j] || 0))
        );
        break;

      case "multiply":
        if (colsA !== rowsB) {
          toast.error("Matrix dimensions invalid for multiplication!");
          return;
        }
        res = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

        for (let i = 0; i < rowsA; i++) {
          for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
              res[i][j] += (matrixA[i][k] || 0) * (matrixB[k][j] || 0);
            }
          }
        }
        break;

      case "transposeA":
        res = matrixA[0].map((_, colIndex) =>
          matrixA.map((row) => row[colIndex])
        );
        break;

      case "transposeB":
        res = matrixB[0].map((_, colIndex) =>
          matrixB.map((row) => row[colIndex])
        );
        break;

      default:
        return;
    }

    setResult(res);
    toast.success(`Operation: ${operation.toUpperCase()} completed!`);
  };

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
      className={`p-8 rounded-2xl shadow-lg transition-all w-full max-w-xl 
        ${theme === "dark" ? "bg-[#1c1c1c] text-white" : "bg-white text-black"}`}
      animate={shake ? { x: [-5, 5, -5, 0] } : { x: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>

        <div className="flex gap-4">
          <input
            type="number"
            value={rows}
            onChange={(e) => handleDimensionChange(setRows, e.target.value)}
            className="w-16 p-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-500"
            min="1"
            max={maxSize}
          />
          <input
            type="number"
            value={cols}
            onChange={(e) => handleDimensionChange(setCols, e.target.value)}
            className="w-16 p-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-500"
            min="1"
            max={maxSize}
          />
        </div>
      </div>

      <div
        className="grid gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(60px, 1fr))`,
        }}
      >
        {matrix.map((row, i) =>
          row.map((value, j) => (
            <input
              key={`${title}-${i}-${j}`}
              type="number"
              value={value ?? ""}
              onChange={handleMatrixChange(setMatrix, matrix, i, j)}
              className={`w-full h-12 sm:h-14 text-center rounded-lg shadow-md transition-all 
                ${theme === "dark" ? "bg-[#2c2c2c] text-white" : "bg-gray-100 text-black"}
                focus:outline-none focus:scale-105`}
            />
          ))
        )}
      </div>
    </motion.div>
  );

  return (
    <div
      className={`min-h-screen p-8 sm:p-12 flex flex-col items-center justify-center transition-all mt-20
        ${theme === "dark" ? "bg-[#0e0e0e] text-white" : "bg-gray-100 text-black"}`}
    >
      <ToastContainer />
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10 sm:mb-14">
        Matrix Operations
      </h1>

      <div className="flex flex-wrap justify-center gap-12 w-full">
        {renderMatrix(matrixA, setMatrixA, "Matrix A", rowsA, colsA, setRowsA, setColsA)}
        {renderMatrix(matrixB, setMatrixB, "Matrix B", rowsB, colsB, setRowsB, setColsB)}
      </div>

      <div className="flex gap-4 my-12 flex-wrap justify-center">
        {["add", "subtract", "multiply", "transposeA", "transposeB"].map((op) => (
          <button key={op} onClick={() => calculate(op)} className="px-8 py-4 rounded-lg font-bold shadow-md transition-all bg-blue-500 text-white hover:bg-blue-600">
            {op.toUpperCase()}
          </button>
        ))}
      </div>

             {result && (
        <div className="mt-10">
          <h2 className="text-3xl font-bold mb-6">Result</h2>
          <div className="grid gap-2 sm:gap-3">
            {result.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((val, j) => (
                  <div key={j} className="w-20 h-20 bg-blue-200 rounded-lg shadow-md flex justify-center items-center">
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default MatrixSolver;
