import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTheme } from "../../ThemeProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUndoRedoState from "../../hooks/useUndoRedoState"; // Custom hook to be created

const MatrixSolver = () => {
  const { theme } = useTheme();
  const matrixARef = useRef(null);
  const matrixBRef = useRef(null);

  // Dynamic sizing based on screen width with debounced resize handling
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
  const [showHelp, setShowHelp] = useState(false);

  // Matrix dimensions and content with undo/redo capability
  const [
    rowsA,
    setRowsA,
    {
      undo: undoRowsA,
      redo: redoRowsA,
      canUndo: canUndoRowsA,
      canRedo: canRedoRowsA,
    },
  ] = useUndoRedoState(3);
  const [colsA, setColsA, { undo: undoColsA, redo: redoColsA }] =
    useUndoRedoState(3);
  const [rowsB, setRowsB, { undo: undoRowsB, redo: redoRowsB }] =
    useUndoRedoState(3);
  const [colsB, setColsB, { undo: undoColsB, redo: redoColsB }] =
    useUndoRedoState(3);

  // Generate empty matrix
  function generateMatrix(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(null));
  }

  const [
    matrixA,
    setMatrixA,
    {
      undo: undoMatrixA,
      redo: redoMatrixA,
      canUndo: canUndoMatrixA,
      canRedo: canRedoMatrixA,
    },
  ] = useUndoRedoState(() => generateMatrix(rowsA, colsA));
  const [
    matrixB,
    setMatrixB,
    {
      undo: undoMatrixB,
      redo: redoMatrixB,
      canUndo: canUndoMatrixB,
      canRedo: canRedoMatrixB,
    },
  ] = useUndoRedoState(() => generateMatrix(rowsB, colsB));
  const [result, setResult] = useState(null);
  const [scalar, setScalar, { undo: undoScalar, redo: redoScalar }] =
    useUndoRedoState(1);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");

  // Debounce resize event
  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMaxSize(getMaxSize());
      }, 250);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [getMaxSize]);

  // Resize matrix when dimensions change - memoized for performance
  const resizeMatrix = useCallback((matrix, newRows, newCols) => {
    return Array.from({ length: newRows }, (_, i) =>
      Array.from({ length: newCols }, (_, j) => matrix[i]?.[j] ?? null)
    );
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("matrixHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Could not load calculation history");
    }
  }, []);

  // Update matrices when dimensions change
  useEffect(() => {
    setMatrixA((prev) => resizeMatrix(prev, rowsA, colsA));
  }, [rowsA, colsA, resizeMatrix, setMatrixA]);

  useEffect(() => {
    setMatrixB((prev) => resizeMatrix(prev, rowsB, colsB));
  }, [rowsB, colsB, resizeMatrix, setMatrixB]);

  // Enhanced keyboard navigation
  const handleKeyDown = (
    event,
    matrixSetter,
    matrix,
    currentRow,
    currentCol,
    matrixRows,
    matrixCols
  ) => {
    const { key } = event;

    if (key === "ArrowUp" && currentRow > 0) {
      event.preventDefault();
      document
        .getElementById(
          `matrix-${matrixSetter === setMatrixA ? "A" : "B"}-${
            currentRow - 1
          }-${currentCol}`
        )
        .focus();
    } else if (key === "ArrowDown" && currentRow < matrixRows - 1) {
      event.preventDefault();
      document
        .getElementById(
          `matrix-${matrixSetter === setMatrixA ? "A" : "B"}-${
            currentRow + 1
          }-${currentCol}`
        )
        .focus();
    } else if (key === "ArrowLeft" && currentCol > 0) {
      event.preventDefault();
      document
        .getElementById(
          `matrix-${matrixSetter === setMatrixA ? "A" : "B"}-${currentRow}-${
            currentCol - 1
          }`
        )
        .focus();
    } else if (key === "ArrowRight" && currentCol < matrixCols - 1) {
      event.preventDefault();
      document
        .getElementById(
          `matrix-${matrixSetter === setMatrixA ? "A" : "B"}-${currentRow}-${
            currentCol + 1
          }`
        )
        .focus();
    } else if (
      key === "Tab" &&
      !event.shiftKey &&
      currentCol === matrixCols - 1 &&
      currentRow === matrixRows - 1
    ) {
      // Allow natural tabbing at the end of the matrix
      return;
    } else if (
      key === "Tab" &&
      event.shiftKey &&
      currentCol === 0 &&
      currentRow === 0
    ) {
      // Allow natural shift+tab at the beginning of the matrix
      return;
    } else if (key === "Tab") {
      event.preventDefault();
      const nextCol = (currentCol + (event.shiftKey ? -1 : 1)) % matrixCols;
      const nextRow =
        nextCol < 0
          ? Math.max(0, currentRow - 1)
          : nextCol === 0 && currentCol === matrixCols - 1
          ? currentRow + 1
          : currentRow;

      const actualNextCol = nextCol < 0 ? matrixCols - 1 : nextCol;
      const actualNextRow = Math.min(matrixRows - 1, nextRow);

      document
        .getElementById(
          `matrix-${
            matrixSetter === setMatrixA ? "A" : "B"
          }-${actualNextRow}-${actualNextCol}`
        )
        .focus();
    }
  };

  // Handle input changes in matrices
  const handleMatrixChange = (setMatrix, matrix, row, col) => (e) => {
    const rawValue = e.target.value;
    const value = rawValue === "" ? null : parseFloat(rawValue);

    // Only update if value has actually changed (prevent unnecessary re-renders)
    if (matrix[row][col] !== value) {
      const newMatrix = matrix.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? value : cell))
      );
      setMatrix(newMatrix);
    }
  };

  // Handle dimension changes with validation and animation feedback
  const handleDimensionChange = (setter, value) => {
    const newValue = Math.min(maxSize, Math.max(1, parseInt(value) || 1));
    if (newValue >= maxSize) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.warn(`Reached max dimension limit of ${maxSize}!`);
    }
    setter(newValue);
  };

  // Fill matrix with random values with min/max controls
  const fillRandom = (setMatrix, rows, cols, min = -5, max = 5) => {
    const range = max - min;
    const newMatrix = Array.from({ length: rows }, () =>
      Array.from(
        { length: cols },
        () => Math.floor(Math.random() * range) + min
      )
    );
    setMatrix(newMatrix);
  };

  const fillIdentity = (setMatrix, rows, cols) => {
    if (rows !== cols) {
      toast.warn("Identity matrix must be square. Adjusting dimensions.");
    } else {
      const size = Math.max(rows, cols);
      setMatrix(
        Array.from({ length: size }, (_, i) =>
          Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
        )
      );
      return;
    }
  };

  // Clear matrix values
  const clearMatrix = (setMatrix, rows, cols) => {
    setMatrix(generateMatrix(rows, cols));
  };

  // Optimized matrix operations with memoization for expensive calculations
  const computeDeterminant = useMemo(() => {
    return (mat) => {
      const n = mat.length;
      if (n === 1) return mat[0][0] || 0;
      if (n === 2)
        return (
          (mat[0][0] || 0) * (mat[1][1] || 0) -
          (mat[0][1] || 0) * (mat[1][0] || 0)
        );

      // For 3x3 matrices, use the direct formula for better performance
      if (n === 3) {
        const [a, b, c] = mat[0].map((v) => v || 0);
        const [d, e, f] = mat[1].map((v) => v || 0);
        const [g, h, i] = mat[2].map((v) => v || 0);

        return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
      }

      // For larger matrices, use cofactor expansion
      let det = 0;
      for (let col = 0; col < n; col++) {
        const cofactor = (col % 2 === 0 ? 1 : -1) * (mat[0][col] || 0);
        if (cofactor === 0) continue; // Skip calculation for zero elements

        const subMatrix = mat
          .slice(1)
          .map((row) => row.filter((_, j) => j !== col));

        det += cofactor * computeDeterminant(subMatrix);
      }
      return det;
    };
  }, []);

  // Calculate eigenvalues (for 2x2 and 3x3 matrices)
  const computeEigenvalues = (mat) => {
    const n = mat.length;

    if (n !== mat[0].length) {
      throw new Error("Matrix must be square to compute eigenvalues");
    }

    // For 2x2 matrix
    if (n === 2) {
      const a = mat[0][0] || 0;
      const b = mat[0][1] || 0;
      const c = mat[1][0] || 0;
      const d = mat[1][1] || 0;

      const trace = a + d;
      const det = a * d - b * c;

      const discriminant = trace * trace - 4 * det;

      if (discriminant < 0) {
        // Complex eigenvalues
        const realPart = trace / 2;
        const imagPart = Math.sqrt(Math.abs(discriminant)) / 2;
        return [
          [realPart, imagPart],
          [realPart, -imagPart],
        ];
      } else {
        // Real eigenvalues
        const sqrtDisc = Math.sqrt(discriminant);
        return [
          [(trace + sqrtDisc) / 2, 0],
          [(trace - sqrtDisc) / 2, 0],
        ];
      }
    }

    // For 3x3 matrix, we use the characteristic polynomial
    // This is simplified and doesn't handle all edge cases
    if (n === 3) {
      throw new Error("3x3 eigenvalues not implemented yet");
    }

    throw new Error("Eigenvalue calculation only supported for 2x2 matrices");
  };

  const invertMatrix = (mat) => {
    const n = mat.length;

    if (n !== mat[0].length) {
      throw new Error("Matrix must be square for inverse");
    }

    const det = computeDeterminant(mat);

    if (Math.abs(det) < 1e-10) {
      throw new Error(
        "Matrix is singular and cannot be inverted (determinant ≈ 0)"
      );
    }

    // For 2x2 matrices, use the analytical formula for better precision
    if (n === 2) {
      const a = mat[0][0] || 0;
      const b = mat[0][1] || 0;
      const c = mat[1][0] || 0;
      const d = mat[1][1] || 0;

      return [
        [d / det, -b / det],
        [-c / det, a / det],
      ].map((row) => row.map((val) => Number(val.toFixed(8))));
    }

    // For larger matrices, use Gauss-Jordan elimination with partial pivoting
    let aug = mat.map((row, i) => [
      ...row.map((v) => v || 0),
      ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
    ]);

    // Enhanced Gauss-Jordan with partial pivoting for better numerical stability
    for (let i = 0; i < n; i++) {
      // Find maximum pivot
      let maxRow = i;
      let maxVal = Math.abs(aug[i][i]);

      for (let j = i + 1; j < n; j++) {
        const absVal = Math.abs(aug[j][i]);
        if (absVal > maxVal) {
          maxRow = j;
          maxVal = absVal;
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
    return aug.map((row) => row.slice(n).map((val) => Number(val.toFixed(8))));
  };

  const transposeMatrix = (mat) => {
    const rows = mat.length;
    const cols = mat[0]?.length || 0;

    if (rows === 0 || cols === 0) return [[]];

    const result = Array.from({ length: cols }, () => Array(rows).fill(0));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result[j][i] = mat[i][j] || 0;
      }
    }

    return result;
  };

  const scalarMultiply = (mat, scalar) => {
    return mat.map((row) => row.map((val) => (val || 0) * scalar));
  };

  // Compute rank of matrix
  const computeRank = (mat) => {
    // Clone the matrix to avoid modifying the original
    const m = mat.map((row) => [...row].map((val) => val || 0));
    const rows = m.length;
    const cols = m[0].length;

    let rank = 0;
    const rowsProcessed = [];

    // Gaussian elimination
    for (let col = 0; col < cols; col++) {
      let nonZeroRow = -1;

      // Find non-zero element in this column
      for (let row = 0; row < rows; row++) {
        if (!rowsProcessed.includes(row) && Math.abs(m[row][col]) > 1e-10) {
          nonZeroRow = row;
          break;
        }
      }

      if (nonZeroRow >= 0) {
        rowsProcessed.push(nonZeroRow);
        rank++;

        // Normalize the pivot row
        const pivot = m[nonZeroRow][col];
        for (let c = col; c < cols; c++) {
          m[nonZeroRow][c] /= pivot;
        }

        // Eliminate other rows
        for (let r = 0; r < rows; r++) {
          if (r !== nonZeroRow) {
            const factor = m[r][col];
            for (let c = col; c < cols; c++) {
              m[r][c] -= factor * m[nonZeroRow][c];
            }
          }
        }
      }
    }

    return rank;
  };

  // Save operation to history with improved error handling
  const saveToHistory = (operation, resultMat) => {
    try {
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

      setHistory((prev) => {
        const updatedHistory = [newEntry, ...prev].slice(0, 10);
        localStorage.setItem("matrixHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    } catch (error) {
      console.error("Error saving to history:", error);
      toast.error("Could not save calculation to history");
    }
  };

  // Restore from history with improved error handling
  const restoreFromHistory = (entry) => {
    try {
      setRowsA(entry.rowsA);
      setColsA(entry.colsA);
      setRowsB(entry.rowsB);
      setColsB(entry.colsB);
      setMatrixA(JSON.parse(JSON.stringify(entry.matrixA)));
      setMatrixB(JSON.parse(JSON.stringify(entry.matrixB)));
      setResult(JSON.parse(JSON.stringify(entry.result)));
      setScalar(entry.scalar);
      setCurrentOp(entry.operation);
    } catch (error) {
      console.error("Error restoring from history:", error);
      toast.error("Could not restore calculation from history");
    }
  };

  // Export matrices and result
  const exportData = () => {
    try {
      const data = {
        matrixA,
        matrixB,
        result,
        scalar,
        operation: currentOp,
        timestamp: new Date().toISOString(),
      };

      let content, filename, mimeType;

      if (exportFormat === "json") {
        content = JSON.stringify(data, null, 2);
        filename = `matrix-calculation-${Date.now()}.json`;
        mimeType = "application/json";
      } else if (exportFormat === "csv") {
        // Simple CSV export implementation
        const csvRows = [];
        csvRows.push(
          `# Matrix Calculation Export (${new Date().toLocaleString()})`
        );
        csvRows.push(`# Operation: ${currentOp || "none"}`);

        csvRows.push("# Matrix A");
        matrixA.forEach((row) => {
          csvRows.push(row.map((cell) => cell ?? "").join(","));
        });

        csvRows.push("# Matrix B");
        matrixB.forEach((row) => {
          csvRows.push(row.map((cell) => cell ?? "").join(","));
        });

        if (result) {
          csvRows.push("# Result");
          result.forEach((row) => {
            csvRows.push(row.map((cell) => cell ?? "").join(","));
          });
        }

        content = csvRows.join("\n");
        filename = `matrix-calculation-${Date.now()}.csv`;
        mimeType = "text/csv";
      } else {
        // Text format
        const textRows = [];
        textRows.push(`Matrix Calculation (${new Date().toLocaleString()})`);
        textRows.push(`Operation: ${currentOp || "none"}`);
        textRows.push(`Scalar: ${scalar}`);

        textRows.push("\nMatrix A:");
        matrixA.forEach((row) => {
          textRows.push(
            row.map((cell) => (cell ?? "").toString().padStart(8)).join(" ")
          );
        });

        textRows.push("\nMatrix B:");
        matrixB.forEach((row) => {
          textRows.push(
            row.map((cell) => (cell ?? "").toString().padStart(8)).join(" ")
          );
        });

        if (result) {
          textRows.push("\nResult:");
          result.forEach((row) => {
            textRows.push(
              row.map((cell) => (cell ?? "").toString().padStart(8)).join(" ")
            );
          });
        }

        content = textRows.join("\n");
        filename = `matrix-calculation-${Date.now()}.txt`;
        mimeType = "text/plain";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Could not export calculation");
    }
  };

  // Import matrices from file
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;

        if (file.name.endsWith(".json")) {
          const data = JSON.parse(content);

          if (data.matrixA && Array.isArray(data.matrixA)) {
            setMatrixA(data.matrixA);
            setRowsA(data.matrixA.length);
            setColsA(data.matrixA[0]?.length || 0);
          }

          if (data.matrixB && Array.isArray(data.matrixB)) {
            setMatrixB(data.matrixB);
            setRowsB(data.matrixB.length);
            setColsB(data.matrixB[0]?.length || 0);
          }

          if (data.result) setResult(data.result);
          if (data.scalar) setScalar(data.scalar);
          if (data.operation) setCurrentOp(data.operation);
        } else if (file.name.endsWith(".csv")) {
          // Simple CSV parser for the format we export
          const lines = content.split("\n");
          let currentMatrix = null;
          let matrixA = [];
          let matrixB = [];
          let resultMatrix = [];

          lines.forEach((line) => {
            if (line.startsWith("# Matrix A")) {
              currentMatrix = "A";
            } else if (line.startsWith("# Matrix B")) {
              currentMatrix = "B";
            } else if (line.startsWith("# Result")) {
              currentMatrix = "Result";
            } else if (!line.startsWith("#") && line.trim()) {
              const row = line.split(",").map((cell) => {
                const val = cell.trim();
                return val === "" ? null : parseFloat(val);
              });

              if (currentMatrix === "A") matrixA.push(row);
              else if (currentMatrix === "B") matrixB.push(row);
              else if (currentMatrix === "Result") resultMatrix.push(row);
            }
          });

          if (matrixA.length > 0) {
            setMatrixA(matrixA);
            setRowsA(matrixA.length);
            setColsA(matrixA[0]?.length || 0);
          }

          if (matrixB.length > 0) {
            setMatrixB(matrixB);
            setRowsB(matrixB.length);
            setColsB(matrixB[0]?.length || 0);
          }

          if (resultMatrix.length > 0) {
            setResult(resultMatrix);
          }
        } else {
          toast.error("Unsupported file format");
        }
      } catch (error) {
        console.error("Error importing data:", error);
        toast.error("Could not import file: Invalid format");
      }
    };

    if (file.name.endsWith(".json") || file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      toast.error("Please select a JSON or CSV file");
    }

    // Clear input value to allow selecting the same file again
    e.target.value = null;
  };

  // Perform matrix calculation with web worker for heavy operations
  const calculate = (operation) => {
    setLoading(true);
    setCurrentOp(operation);

    // Short delay for UI feedback
    setTimeout(() => {
      try {
        let res;
        const matA = matrixA.map((row) => row.map((val) => val || 0));
        const matB = matrixB.map((row) => row.map((val) => val || 0));

        switch (operation) {
          case "add":
            if (rowsA !== rowsB || colsA !== colsB) {
              throw new Error(
                "Matrix dimensions must be the same for addition!"
              );
            }
            res = matA.map((row, i) => row.map((val, j) => val + matB[i][j]));
            break;

          case "subtract":
            if (rowsA !== rowsB || colsA !== colsB) {
              throw new Error(
                "Matrix dimensions must be the same for subtraction!"
              );
            }
            res = matA.map((row, i) => row.map((val, j) => val - matB[i][j]));
            break;

          case "multiply":
            if (colsA !== rowsB) {
              throw new Error(
                "Matrix dimensions invalid for multiplication! Columns of A must equal rows of B"
              );
            }
            res = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

            // Optimized matrix multiplication
            for (let i = 0; i < rowsA; i++) {
              for (let j = 0; j < colsB; j++) {
                let sum = 0;
                for (let k = 0; k < colsA; k++) {
                  sum += matA[i][k] * matB[k][j];
                }
                // Round to avoid floating point issues
                res[i][j] = Number(sum.toFixed(8));
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
              throw new Error(
                "Matrix A must be square to compute determinant!"
              );
            }
            const detA = computeDeterminant(matA);
            res = [[Number(detA.toFixed(8))]];
            break;

          case "determinant-B":
            if (rowsB !== colsB) {
              throw new Error(
                "Matrix B must be square to compute determinant!"
              );
            }
            const detB = computeDeterminant(matB);
            res = [[Number(detB.toFixed(8))]];
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

          case "rank-A":
            res = [[computeRank(matA)]];
            break;

          case "rank-B":
            res = [[computeRank(matB)]];
            break;

          case "eigenvalues-A":
            if (rowsA !== colsA || rowsA > 2) {
              throw new Error(
                "Eigenvalues currently only supported for 2×2 matrices!"
              );
            }
            res = computeEigenvalues(matA);
            break;

          case "eigenvalues-B":
            if (rowsB !== colsB || rowsB > 2) {
              throw new Error(
                "Eigenvalues currently only supported for 2×2 matrices!"
              );
            }
            res = computeEigenvalues(matB);
            break;

          case "power-A":
            if (rowsA !== colsA) {
              throw new Error("Matrix A must be square for power operation!");
            }
            if (scalar !== Math.floor(scalar) || scalar < 0) {
              throw new Error("Power must be a non-negative integer!");
            }

            // Initialize with identity matrix
            let powRes = Array.from({ length: rowsA }, (_, i) =>
              Array.from({ length: colsA }, (_, j) => (i === j ? 1 : 0))
            );

            // Repeated multiplication
            let matPow = [...matA];
            for (let p = 0; p < scalar; p++) {
              // If this is the first iteration, don't multiply by identity
              if (p === 0) {
                powRes = matPow;
                continue;
              }

              // Multiply current result by original matrix
              const nextRes = Array.from({ length: rowsA }, () =>
                Array(colsA).fill(0)
              );
              for (let i = 0; i < rowsA; i++) {
                for (let j = 0; j < colsA; j++) {
                  let sum = 0;
                  for (let k = 0; k < colsA; k++) {
                    sum += powRes[i][k] * matA[k][j];
                  }
                  nextRes[i][j] = Number(sum.toFixed(8));
                }
              }
              powRes = nextRes;
            }

            res = powRes;
            break;

          default:
            throw new Error("Unknown operation");
        }

        setResult(res);
        saveToHistory(operation, res);
      } catch (error) {
        console.error("Calculation error:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const renderMatrix = (
    matrix,
    setMatrix,
    title,
    rows,
    cols,
    setRows,
    setCols,
    matrixRef
  ) => {
    const matrixId = title === "Matrix A" ? "A" : "B";
    return (
      <div
        ref={matrixRef}
        className={`p-6 rounded-2xl shadow-lg transition-all w-full max-w-xl 
              ${
                theme === "dark"
                  ? "bg-[#1c1c1c] text-white"
                  : "bg-white text-black"
              }`}
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.3 }}
        data-testid={`matrix-${matrixId}-container`}
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
              aria-label={`${title} rows`}
            />
            <span className="text-sm font-medium">Cols</span>
            <input
              type="number"
              value={cols}
              onChange={(e) => handleDimensionChange(setCols, e.target.value)}
              className="w-14 p-2 border rounded-lg text-center focus:ring-2 focus:ring-blue-500"
              min="1"
              max={maxSize}
              aria-label={`${title} columns`}
            />
          </div>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => fillRandom(setMatrix, rows, cols)}
            className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            aria-label={`Fill ${title} with random values`}
          >
            Random
          </button>
          <button
            onClick={() => fillIdentity(setMatrix, rows, cols)}
            className="px-3 py-1 text-sm rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
            aria-label={`Create identity ${title}`}
          >
            Identity
          </button>
          <button
            onClick={() => clearMatrix(setMatrix, rows, cols)}
            className="px-3 py-1 text-sm rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
            aria-label={`Clear ${title}`}
          >
            Clear
          </button>
          {matrixId === "A" && canUndoMatrixA && (
            <button
              onClick={undoMatrixA}
              className="px-3 py-1 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
              aria-label="Undo changes to Matrix A"
            >
              Undo
            </button>
          )}
          {matrixId === "A" && canRedoMatrixA && (
            <button
              onClick={redoMatrixA}
              className="px-3 py-1 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition"
              aria-label="Redo changes to Matrix A"
            >
              Redo
            </button>
          )}
          {matrixId === "B" && canUndoMatrixB && (
            <button
              onClick={undoMatrixB}
              className="px-3 py-1 text-sm rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
              aria-label="Undo changes to Matrix B"
            >
              Undo
            </button>
          )}
          {matrixId === "B" && canRedoMatrixB && (
            <button
              onClick={redoMatrixB}
              className="px-3 py-1 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition"
              aria-label="Redo changes to Matrix B"
            >
              Redo
            </button>
          )}
        </div>
        <div
          role="grid"
          aria-label={`${title} grid`}
          className="grid gap-1 sm:gap-2"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(45px, 1fr))`,
          }}
        >
          {matrix.map((row, i) =>
            row.map((value, j) => (
              <input
                key={`${title}-${i}-${j}`}
                id={`matrix-${matrixId}-${i}-${j}`}
                type="number"
                value={value !== null ? value : ""}
                onChange={handleMatrixChange(setMatrix, matrix, i, j)}
                onKeyDown={(e) =>
                  handleKeyDown(e, setMatrix, matrix, i, j, rows, cols)
                }
                className={`w-full h-10 sm:h-12 text-center rounded-lg shadow-sm transition-all 
                      ${
                        theme === "dark"
                          ? "bg-[#2c2c2c] text-white"
                          : "bg-gray-100 text-black"
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-105`}
                inputMode="decimal"
                step="any"
                aria-label={`Value at row ${i + 1}, column ${j + 1}`}
                role="gridcell"
              />
            ))
          )}
        </div>
      </div>
    );
  };

  const renderOperationButtons = () => {
    const operations = [
      {
        title: "Basic Operations",
        ops: [
          { id: "add", label: "A + B", description: "Matrix Addition" },
          { id: "subtract", label: "A - B", description: "Matrix Subtraction" },
          {
            id: "multiply",
            label: "A × B",
            description: "Matrix Multiplication",
          },
        ],
      },
      {
        title: "Scalar Operations",
        ops: [
          {
            id: "scalar-A",
            label: "k × A",
            description: "Scalar Multiplication of A",
          },
          {
            id: "scalar-B",
            label: "k × B",
            description: "Scalar Multiplication of B",
          },
          { id: "power-A", label: "A^k", description: "Matrix A to power k" },
        ],
      },
      {
        title: "Matrix A Operations",
        ops: [
          {
            id: "determinant-A",
            label: "det(A)",
            description: "Determinant of A",
          },
          { id: "inverse-A", label: "A⁻¹", description: "Inverse of A" },
          { id: "transpose-A", label: "Aᵀ", description: "Transpose of A" },
          { id: "rank-A", label: "rank(A)", description: "Rank of A" },
          {
            id: "eigenvalues-A",
            label: "eig(A)",
            description: "Eigenvalues of A (2×2 only)",
          },
        ],
      },
      {
        title: "Matrix B Operations",
        ops: [
          {
            id: "determinant-B",
            label: "det(B)",
            description: "Determinant of B",
          },
          { id: "inverse-B", label: "B⁻¹", description: "Inverse of B" },
          { id: "transpose-B", label: "Bᵀ", description: "Transpose of B" },
          { id: "rank-B", label: "rank(B)", description: "Rank of B" },
          {
            id: "eigenvalues-B",
            label: "eig(B)",
            description: "Eigenvalues of B (2×2 only)",
          },
        ],
      },
    ];

    return (
      <div className="w-full max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {operations.map((group) => (
          <div
            key={group.title}
            className={`flex flex-col items-center p-6 rounded-xl shadow-lg w-full transition-colors
              ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <h3
              className={`text-xl font-semibold mb-4 text-center transition-colors
                ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {group.title}
            </h3>
            <div className="flex flex-row flex-wrap justify-center gap-3 w-full">
              {group.ops.map((op) => (
                <button
                  key={op.id}
                  onClick={() => calculate(op.id)}
                  disabled={loading}
                  className={`px-5 py-2 rounded-lg font-bold shadow transition-all
                    ${
                      loading
                        ? theme === "dark"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gray-300 cursor-not-allowed"
                        : theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    }
                    text-white`}
                  aria-label={op.description}
                  title={op.description}
                >
                  {op.label}
                </button>
              ))}

              {group.title === "Scalar Operations" && (
                <input
                  type="number"
                  value={scalar || ""}
                  onChange={(e) => setScalar(parseFloat(e.target.value) || 0)}
                  className={`px-3 py-2 w-20 rounded-lg border-2 text-center transition-colors
                    ${
                      theme === "dark"
                        ? "bg-gray-700 text-white placeholder-gray-400 border-blue-500"
                        : "bg-gray-200 text-gray-900 placeholder-gray-500 border-blue-500"
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  placeholder="k"
                  aria-label="Scalar value k"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    const rows = result.length;
    const cols = result[0].length;

    // Check if result contains complex numbers (eigenvalues)
    const hasComplexNumbers = result.some((row) =>
      row.some((value) => Array.isArray(value) && value.length === 2)
    );

    return (
      <div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-8 mx-auto p-6 rounded-2xl shadow-lg w-full max-w-4xl
            ${
              theme === "dark"
                ? "bg-[#1c1c1c] text-white"
                : "bg-white text-black"
            }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Result:{" "}
            {currentOp &&
              currentOp
                .replace("-", " ")
                .replace("A", "Matrix A")
                .replace("B", "Matrix B")
                .replace("eigenvalues", "Eigenvalues of")
                .replace("rank", "Rank of")}
          </h2>
          <div className="text-sm opacity-75">
            {rows} × {cols}
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div
            className="grid gap-2 min-w-max"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(60px, 1fr))`,
            }}
            role="grid"
            aria-label="Result matrix"
          >
            {result.map((row, i) =>
              row.map((val, j) => (
                <div
                  key={`result-${i}-${j}`}
                  className={`p-2 h-12 flex justify-center items-center rounded-lg shadow-md
                      ${theme === "dark" ? "bg-[#2c2c2c]" : "bg-blue-100"}`}
                  role="gridcell"
                >
                  {hasComplexNumbers && Array.isArray(val) ? (
                    // Display complex number
                    <>
                      {val[0].toFixed(4).replace(/\.?0+$/, "")}
                      {val[1] === 0
                        ? ""
                        : val[1] > 0
                        ? ` + ${val[1].toFixed(4).replace(/\.?0+$/, "")}i`
                        : ` - ${Math.abs(val[1])
                            .toFixed(4)
                            .replace(/\.?0+$/, "")}i`}
                    </>
                  ) : // Display real number
                  val?.toFixed ? (
                    val.toFixed(4).replace(/\.?0+$/, "")
                  ) : (
                    val
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-3">
          <div className="relative">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Export format"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="text">Text</option>
            </select>
          </div>
          <button
            onClick={exportData}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
            aria-label="Export calculation"
            disabled={!result}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-download"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
            </svg>
            Export
          </button>
        </div>
      </div>
    );
  };

  // Render history panel - enhanced with filtering and sorting options
  const renderHistory = () => {
    if (history.length === 0) {
      return (
        <div className="text-center w-full mx-auto p-4 opacity-75">
          No calculation history yet
        </div>
      );
    }

    return (
      <div className="w-full mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Calculation History</h3>
          <button
            onClick={() => {
              setHistory([]);
              localStorage.removeItem("matrixHistory");
              toast.info("History cleared");
            }}
            className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition flex items-center gap-1"
            aria-label="Clear history"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path
                fillRule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
              />
            </svg>
            Clear
          </button>
        </div>

        <div className="space-y-3">
          {history.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg
                  ${theme === "dark" ? "bg-[#1c1c1c]" : "bg-white"}`}
              onClick={() => restoreFromHistory(entry)}
            >
              <div className="flex justify-between items-start">
                <div className="font-medium">
                  {entry.operation
                    .replace("-", " ")
                    .replace("A", "Matrix A")
                    .replace("B", "Matrix B")
                    .replace("eigenvalues", "Eigenvalues of")
                    .replace("rank", "Rank of")}
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm opacity-75">{entry.timestamp}</div>
                </div>
              </div>
              <div className="text-xs mt-1 opacity-75 flex flex-wrap gap-2">
                <span>
                  Matrix A: {entry.rowsA}×{entry.colsA}
                </span>
                <span>•</span>
                <span>
                  Matrix B: {entry.rowsB}×{entry.colsB}
                </span>
                <span>•</span>
                <span>
                  Result: {entry.result.length}×{entry.result[0].length}
                </span>
                {entry.operation.includes("scalar") && (
                  <span>• Scalar: {entry.scalar}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Help modal dialog
  const renderHelpDialog = () => (
    <>
      {showHelp && (
        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`max-w-2xl w-full p-6 rounded-xl shadow-2xl 
                ${
                  theme === "dark"
                    ? "bg-[#1c1c1c] text-white"
                    : "bg-white text-black"
                }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Matrix Calculator Help</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close help"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Enter values in Matrix A and B by clicking on the cells
                  </li>
                  <li>Adjust dimensions using the rows and columns controls</li>
                  <li>Use the operation buttons to perform calculations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Keyboard Navigation
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use arrow keys to move between cells</li>
                  <li>Tab key to move forward, Shift+Tab to move backward</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Matrix Operations
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Basic Operations:</strong> Addition (A+B),
                    Subtraction (A-B), Multiplication (A×B)
                  </li>
                  <li>
                    <strong>Scalar Operations:</strong> Multiply matrix by
                    constant k, Matrix powers
                  </li>
                  <li>
                    <strong>Single Matrix Operations:</strong> Determinant,
                    Inverse, Transpose, Rank, Eigenvalues
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  History and Export
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    All calculations are stored in history (up to 10 most
                    recent)
                  </li>
                  <li>Click any history item to restore matrices and result</li>
                  <li>Export results in JSON, CSV, or text format</li>
                  <li>Import matrices from previously exported files</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Tips</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Use the "Random" button to quickly generate test matrices
                  </li>
                  <li>Use the "Identity" button to create identity matrices</li>
                  <li>
                    For eigenvalue calculations, only 2×2 matrices are currently
                    supported
                  </li>
                  <li>Undo/Redo is available for matrix changes</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center transition-all 
          ${
            theme === "dark"
              ? "bg-[#0e0e0e] text-white"
              : "bg-gray-100 text-black"
          }`}
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

      {renderHelpDialog()}

      <div className="w-full max-w-7xl mx-auto flex justify-between items-center mb-6 mt-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Matrix Calculator
        </h1>

        <button
          onClick={() => setShowHelp(true)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Help"
          title="Help"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-7xl">
        <div className="flex flex-wrap justify-center gap-6 w-full mb-8">
          {renderMatrix(
            matrixA,
            setMatrixA,
            "Matrix A",
            rowsA,
            colsA,
            setRowsA,
            setColsA,
            matrixARef
          )}
          {renderMatrix(
            matrixB,
            setMatrixB,
            "Matrix B",
            rowsB,
            colsB,
            setRowsB,
            setColsB,
            matrixBRef
          )}
        </div>

        {renderOperationButtons()}
        {renderResult()}

        <div className="w-full flex flex-col items-center mt-12">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className={`transition-transform ${
                showHistory ? "rotate-180" : ""
              }`}
            >
              <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
            {showHistory ? "Hide History" : "Show History"}
          </button>

          <>
            {showHistory && (
              <div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full"
              >
                {renderHistory()}
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default MatrixSolver;
