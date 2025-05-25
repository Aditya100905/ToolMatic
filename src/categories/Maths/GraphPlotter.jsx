import React, { useState, useRef, useEffect, useCallback } from "react";
import * as math from "mathjs";
import {
  Plus,
  Trash2,
  X,
  Copy,
  Download,
  Grid,
  Trash,
  AlertTriangle,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Utility function to generate visually distinct random colors
const generateDistinctRandomColor = (index) => {
  // Predefined color palette with good visual distinction
  const colorPalette = [
    "#FF6B6B", // Coral Red
    "#4ECDC4", // Turquoise
    "#45B7D1", // Sky Blue
    "#FDCB6E", // Sunflower Yellow
    "#6C5CE7", // Purple
    "#A8E6CF", // Mint Green
    "#FF8ED4", // Pink
    "#FAD390", // Muted Orange
    "#6A89CC", // Soft Blue
    "#7ED6DF", // Light Blue
    "#E056FD", // Bright Magenta
    "#48DBFB", // Bright Cyan
  ];

  // If index is within palette, return that color
  // Otherwise, generate a random HSL color
  if (index < colorPalette.length) {
    return colorPalette[index];
  }

  // For additional equations, generate random HSL color
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
};

// Function to check if two equations are mathematically equivalent
const areEquationsEquivalent = (expr1, expr2) => {
  try {
    // Generate a set of test points
    const testPoints = [-10, -3, -1, 0, 0.5, 1, 2, 5, 10];

    // Compare function outputs at each test point
    for (const x of testPoints) {
      // Evaluate both expressions at this point
      const value1 = math.evaluate(expr1, { x });
      const value2 = math.evaluate(expr2, { x });

      // If either result is NaN or Infinity, skip this test point
      if (!isFinite(value1) || !isFinite(value2)) {
        continue;
      }

      // If values differ significantly, they're not equivalent
      if (Math.abs(value1 - value2) > 1e-10) {
        return false;
      }
    }

    // If all test points match, equations are likely equivalent
    return true;
  } catch (err) {
    // If there's an error in evaluation, assume they're different
    return false;
  }
};

// Utility function to validate equation across multiple points
const validateEquation = (expression) => {
  try {
    // Test equation at multiple points
    const testPoints = [-100, -10, -1, 0, 1, 10, 100];
    let validPoints = 0;
    let warnings = [];

    for (const x of testPoints) {
      try {
        const result = math.evaluate(expression, { x });
        if (isFinite(result)) {
          validPoints++;
        }
      } catch (error) {
        // Specific point failed
      }
    }

    // Check if equation is valid for at least some points
    if (validPoints === 0) {
      return {
        valid: false,
        message: "Equation is not plottable at any test points",
        severity: "error",
      };
    } else if (validPoints < testPoints.length) {
      return {
        valid: true,
        message: `Equation has discontinuities or undefined regions`,
        severity: "warning",
      };
    }

    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      message: err.message,
      severity: "error",
    };
  }
};

const UltimateGraphPlotter = ({
  theme = "light",
  initialEquations = ["x^2"],
}) => {
  // State Management
  const [equations, setEquations] = useState(
    initialEquations.map((expr, index) => ({
      id: `eq-${index}`,
      expression: expr,
      color: generateDistinctRandomColor(index),
      isVisible: true,
      hasWarnings: false,
      warningMessage: "",
    }))
  );
  const [currentEquation, setCurrentEquation] = useState("");
  const [graphState, setGraphState] = useState({
    scale: 1,
    targetScale: 1,
    offsetX: 0,
    offsetY: 0,
    velocity: { x: 0, y: 0 },
    isDragging: false,
  });
  // Add state for grid visibility
  const [showGrid, setShowGrid] = useState(true);
  // Add state for equation validation status
  const [validationStatus, setValidationStatus] = useState({
    isValid: true,
    message: "",
  });

  // Refs
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const isAnimatingRef = useRef(false);

  // Theme-based styling
  const themeStyles = {
    light: {
      background: "bg-white",
      container: "bg-gray-50",
      text: "text-gray-800",
      input: "bg-white border-gray-300",
      grid: {
        color: "rgba(175,175,175,0.5)",
        axes: "black",
      },
    },
    dark: {
      background: "bg-black",
      container: "bg-[#212121]",
      text: "text-gray-100",
      input: "bg-black border-gray-600 text-gray-100",
      grid: {
        color: "rgba(211, 211, 211,0.3)",
        axes: "white",
      },
    },
  };

  // Draw Grid
  const drawGrid = (ctx, width, height) => {
    if (!showGrid) {
      // If grid is disabled, only draw axes
      const gridConfig = themeStyles[theme].grid;
      ctx.strokeStyle = gridConfig.axes;
      ctx.lineWidth = 2;

      // X-axis
      ctx.beginPath();
      ctx.moveTo(0, height / 2 + graphState.offsetY);
      ctx.lineTo(width, height / 2 + graphState.offsetY);
      ctx.stroke();

      // Y-axis
      ctx.beginPath();
      ctx.moveTo(width / 2 + graphState.offsetX, 0);
      ctx.lineTo(width / 2 + graphState.offsetX, height);
      ctx.stroke();
      return;
    }

    const gridConfig = themeStyles[theme].grid;
    const gridSize = 50 * graphState.scale;

    ctx.strokeStyle = gridConfig.color;
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (
      let x = width / 2 + (graphState.offsetX % gridSize);
      x < width;
      x += gridSize
    ) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (
      let x = width / 2 + (graphState.offsetX % gridSize);
      x > 0;
      x -= gridSize
    ) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (
      let y = height / 2 + (graphState.offsetY % gridSize);
      y < height;
      y += gridSize
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (
      let y = height / 2 + (graphState.offsetY % gridSize);
      y > 0;
      y -= gridSize
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw bold axes
    ctx.strokeStyle = gridConfig.axes;
    ctx.lineWidth = 2;
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2 + graphState.offsetY);
    ctx.lineTo(width, height / 2 + graphState.offsetY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(width / 2 + graphState.offsetX, 0);
    ctx.lineTo(width / 2 + graphState.offsetX, height);
    ctx.stroke();

    // Add axis labels and values
    ctx.font = "12px Arial";
    ctx.fillStyle = gridConfig.axes;
    ctx.textAlign = "center";

    // X-axis values
    const xValueInterval = Math.max(1, Math.round(10 / graphState.scale)); // Adjust interval based on zoom
    for (let i = -20; i <= 20; i += xValueInterval) {
      if (i === 0) continue; // Skip zero as it's the origin

      const xPos = width / 2 + graphState.offsetX + i * gridSize;
      // Only draw if within bounds
      if (xPos > 0 && xPos < width) {
        ctx.fillText(i.toString(), xPos, height / 2 + graphState.offsetY + 20);
      }
    }

    // Y-axis values
    const yValueInterval = Math.max(1, Math.round(10 / graphState.scale));
    for (let i = -20; i <= 20; i += yValueInterval) {
      if (i === 0) continue; // Skip zero as it's the origin

      const yPos = height / 2 + graphState.offsetY - i * gridSize;
      // Only draw if within bounds
      if (yPos > 0 && yPos < height) {
        ctx.fillText(
          i.toString(),
          width / 2 + graphState.offsetX - 20,
          yPos + 4
        );
      }
    }

    // Origin label
    ctx.fillText(
      "0",
      width / 2 + graphState.offsetX - 10,
      height / 2 + graphState.offsetY + 20
    );
  };

  // Draw Equations
  const drawEquations = (ctx, width, height) => {
    equations.forEach((eq) => {
      if (!eq.isVisible) return;

      try {
        ctx.strokeStyle = eq.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const gridSize = 50 * graphState.scale;
        const centerX = width / 2 + graphState.offsetX;
        const centerY = height / 2 + graphState.offsetY;

        // Optimize by only calculating points within visible range
        // and adjusting resolution based on complexity
        const step = 1; // Can be adjusted for performance
        let lastY = null;
        let pointsDrawn = 0;
        let discontinuities = 0;

        for (let px = 0; px < width; px += step) {
          // Convert screen x to mathematical x
          const x = (px - centerX) / gridSize;

          try {
            const y = math.evaluate(eq.expression, { x });

            // Check for discontinuities or very large jumps
            const screenY = centerY - y * gridSize;

            // Skip drawing line segments for extreme jumps (discontinuities)
            const isValidPoint =
              isFinite(screenY) && Math.abs(screenY) < height * 10;

            if (isValidPoint) {
              if (lastY === null || px === 0) {
                ctx.moveTo(px, screenY);
              } else {
                // Only connect points if the jump isn't too extreme
                if (Math.abs(screenY - lastY) < height / 4) {
                  // Lowered threshold for better discontinuity detection
                  ctx.lineTo(px, screenY);
                } else {
                  ctx.moveTo(px, screenY);
                  discontinuities++;
                }
              }
              lastY = screenY;
              pointsDrawn++;
            } else {
              lastY = null;
              discontinuities++;
            }
          } catch (err) {
            // Skip this point silently
            lastY = null;
            discontinuities++;
          }
        }

        ctx.stroke();

        // If no points were drawn or too many discontinuities, update equation with warning
        if (pointsDrawn === 0 && !eq.hasWarnings) {
          // Update equation with warning, but only if not already warned
          setEquations((prev) =>
            prev.map((e) =>
              e.id === eq.id
                ? {
                    ...e,
                    hasWarnings: true,
                    warningMessage: "No valid points to plot in current view",
                  }
                : e
            )
          );
        } else if (discontinuities > width / 10 && !eq.hasWarnings) {
          // If more than 10% are discontinuities
          setEquations((prev) =>
            prev.map((e) =>
              e.id === eq.id
                ? {
                    ...e,
                    hasWarnings: true,
                    warningMessage: "Function has many discontinuities",
                  }
                : e
            )
          );
        } else if (
          pointsDrawn > 0 &&
          discontinuities < width / 10 &&
          eq.hasWarnings
        ) {
          // Clear warning if function is now plotting correctly
          setEquations((prev) =>
            prev.map((e) =>
              e.id === eq.id
                ? {
                    ...e,
                    hasWarnings: false,
                    warningMessage: "",
                  }
                : e
            )
          );
        }
      } catch (err) {
        console.error(`Error drawing equation ${eq.expression}:`, err);

        // Update equation with error warning
        if (!eq.hasWarnings) {
          setEquations((prev) =>
            prev.map((e) =>
              e.id === eq.id
                ? {
                    ...e,
                    hasWarnings: true,
                    warningMessage: "Error plotting function",
                  }
                : e
            )
          );
        }
      }
    });
  };

  // Animation loop
  const animate = useCallback(
    (timestamp) => {
      if (!isAnimatingRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Calculate delta time for smooth animations
      const deltaTime = lastTimeRef.current
        ? (timestamp - lastTimeRef.current) / 1000
        : 0.016;
      lastTimeRef.current = timestamp;

      // Apply smooth scale transition
      const scaleDiff = graphState.targetScale - graphState.scale;
      const newScale =
        Math.abs(scaleDiff) < 0.001
          ? graphState.targetScale
          : graphState.scale + scaleDiff * Math.min(deltaTime * 10, 0.3);

      // Apply inertia and friction when not dragging
      let newVelocityX = graphState.velocity.x;
      let newVelocityY = graphState.velocity.y;
      let newOffsetX = graphState.offsetX;
      let newOffsetY = graphState.offsetY;

      if (!graphState.isDragging) {
        // Apply friction to velocity
        const friction = 0.9;
        newVelocityX *= friction;
        newVelocityY *= friction;

        // Apply velocity to position
        newOffsetX += newVelocityX * deltaTime * 60;
        newOffsetY += newVelocityY * deltaTime * 60;

        // Stop animation if movement becomes negligible
        if (
          Math.abs(newVelocityX) < 0.1 &&
          Math.abs(newVelocityY) < 0.1 &&
          Math.abs(scaleDiff) < 0.001
        ) {
          isAnimatingRef.current = false;
        }
      }

      // Update state
      setGraphState((prev) => ({
        ...prev,
        scale: newScale,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
        velocity: { x: newVelocityX, y: newVelocityY },
      }));

      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    },
    [graphState]
  );

  // Start animation if not running
  const ensureAnimationIsRunning = useCallback(() => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  // Render Canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    // Clear canvas with background color based on theme
    ctx.fillStyle = theme === "light" ? "white" : "black";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx, width, height);

    // Draw equations
    drawEquations(ctx, width, height);
  }, [drawEquations, theme, showGrid]);

  // Setup Canvas and Event Listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    // Set canvas size to container size
    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      renderCanvas();
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Advanced Panning with inertia
    const handleMouseDown = (e) => {
      setGraphState((prev) => ({
        ...prev,
        isDragging: true,
        velocity: { x: 0, y: 0 }, // Reset velocity when starting to drag
      }));

      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";

      // Ensure animation is running for smooth interactions
      ensureAnimationIsRunning();
    };

    const handleMouseMove = (e) => {
      if (!graphState.isDragging) return;

      const deltaX = e.clientX - lastMousePositionRef.current.x;
      const deltaY = e.clientY - lastMousePositionRef.current.y;

      // Update velocity based on mouse movement
      setGraphState((prev) => ({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY,
        velocity: {
          x: deltaX * 0.3, // Scale velocity to make it feel natural
          y: deltaY * 0.3,
        },
      }));

      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setGraphState((prev) => ({ ...prev, isDragging: false }));
      canvas.style.cursor = "grab";
    };

    const handleWheel = (e) => {
      e.preventDefault();

      // Calculate target scale with smooth zoom
      const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
      const newTargetScale = Math.max(
        0.1,
        Math.min(10, graphState.targetScale * scaleChange)
      );

      // Get mouse position relative to canvas for zoom targeting
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Set new target scale
      setGraphState((prev) => ({
        ...prev,
        targetScale: newTargetScale,
      }));

      // Ensure animation is running for smooth zoom
      ensureAnimationIsRunning();
    };

    // Touch events for mobile support
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
      }
    };

    const handleTouchEnd = () => {
      handleMouseUp();
    };

    // Event Listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    // Touch support
    canvas.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);

      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      // Cancel any pending animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        isAnimatingRef.current = false;
      }
    };
  }, [
    graphState.isDragging,
    graphState.targetScale,
    renderCanvas,
    ensureAnimationIsRunning,
  ]);

  // Render canvas after each frame
  useEffect(() => {
    renderCanvas();
  }, [graphState, equations, renderCanvas]);

  // Live validation of current equation
  useEffect(() => {
    // Don't validate empty input
    if (!currentEquation.trim()) {
      setValidationStatus({ isValid: true, message: "" });
      return;
    }

    // Validate with delay to avoid unnecessary validation during typing
    const validationTimer = setTimeout(() => {
      try {
        // Basic syntax check
        math.parse(currentEquation);

        // Extended validation
        const validationResult = validateEquation(currentEquation);

        if (!validationResult.valid) {
          setValidationStatus({
            isValid: false,
            message: validationResult.message || "Invalid equation",
          });
        } else if (validationResult.severity === "warning") {
          setValidationStatus({
            isValid: true,
            message: validationResult.message,
            isWarning: true,
          });
        } else {
          setValidationStatus({ isValid: true, message: "" });
        }
      } catch (err) {
        setValidationStatus({
          isValid: false,
          message: `Syntax error: ${err.message}`,
        });
      }
    }, 500);

    return () => clearTimeout(validationTimer);
  }, [currentEquation]);

  // Update color for a specific equation
  const updateEquationColor = (id, newColor) => {
    setEquations((prev) =>
      prev.map((eq) => (eq.id === id ? { ...eq, color: newColor } : eq))
    );
  };

  // Toggle equation visibility
  const toggleEquationVisibility = (id) => {
    setEquations((prev) =>
      prev.map((eq) =>
        eq.id === id ? { ...eq, isVisible: !eq.isVisible } : eq
      )
    );
  };

  // Add equation method
  const addEquation = (equation) => {
    try {
      // Validate equation
      const validationResult = validateEquation(equation);

      if (!validationResult.valid) {
        toast.error(`Cannot plot equation: ${validationResult.message}`);
        return;
      }

      // Check if equation is mathematically equivalent to any existing equation
      const duplicateEquation = equations.find((eq) =>
        areEquationsEquivalent(eq.expression, equation)
      );

      if (duplicateEquation) {
        toast.info(
          "This equation is mathematically equivalent to an existing equation"
        );
        setCurrentEquation("");
        return;
      }

      const newEquation = {
        id: `eq-${Date.now()}`,
        expression: equation,
        color: generateDistinctRandomColor(equations.length),
        isVisible: true,
        hasWarnings: validationResult.severity === "warning",
        warningMessage:
          validationResult.severity === "warning"
            ? validationResult.message
            : "",
      };

      setEquations((prev) => [...prev, newEquation]);
      setCurrentEquation("");

      // Show warning if there's a non-critical issue
      if (validationResult.severity === "warning") {
        toast.warning(validationResult.message);
      } else {
        toast.success("Equation added successfully");
      }
    } catch (err) {
      toast.error(`Invalid equation: ${err.message}`);
    }
  };

  const clearAllEquations = () => {
    // Clear all equations
    setEquations([]);
    toast.info("All equations cleared");
  };

  // Function to download the graph with correct theme
  const downloadGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // The canvas already has the correct theme applied
    // because we're now explicitly setting the background in renderCanvas
    const link = document.createElement("a");
    link.download = "graph.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Graph downloaded");
  };

  // Reset view to default state
  const resetView = () => {
    setGraphState({
      scale: 1,
      targetScale: 1,
      offsetX: 0,
      offsetY: 0,
      velocity: { x: 0, y: 0 },
      isDragging: false,
    });
    ensureAnimationIsRunning();
    toast.info("View reset to default");
  };

  const currentTheme = themeStyles[theme];

  // Function to provide examples for user
  const insertExample = (example) => {
    setCurrentEquation(example);
  };

  return (
    <div
      className={`${currentTheme.background} mt-10 items-center min-h-screen`}
    >
      <div className="flex flex-col items-center">
        <div
          className={`w-full mb-0 mt-10 max-w-4xl mx-auto p-4 rounded-xl shadow-md ${currentTheme.container} sm:p-6`}
        >
          {/* Equation Input Section */}
          <div className="flex flex-col mb-4">
            <div className="flex space-x-2">
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={currentEquation}
                  onChange={(e) => setCurrentEquation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!currentEquation) return;
                      addEquation(currentEquation);
                    }
                  }}
                  placeholder="Enter equation (e.g., x^2, sin(x))"
                  className={`w-full p-2 border rounded ${currentTheme.input} ${currentTheme.text} ${!validationStatus.isValid ? "border-red-500" : validationStatus.isWarning ? "border-yellow-500" : ""}`}
                />
                {currentEquation && (
                  <button
                    onClick={() => setCurrentEquation("")}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 ${currentTheme.text}`}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  if (!currentEquation) return;
                  addEquation(currentEquation);
                }}
                disabled={!validationStatus.isValid}
                className={`bg-blue-500 text-white p-2 rounded ${!validationStatus.isValid ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Plus />
              </button>
            </div>

            {/* Validation feedback */}
            {currentEquation && !validationStatus.isValid && (
              <div className="mt-2 text-red-500 flex items-center text-sm">
                <AlertTriangle size={16} className="mr-1" />
                {validationStatus.message}
              </div>
            )}
            {currentEquation &&
              validationStatus.isValid &&
              validationStatus.isWarning && (
                <div className="mt-2 text-yellow-500 flex items-center text-sm">
                  <AlertTriangle size={16} className="mr-1" />
                  {validationStatus.message}
                </div>
              )}

            {/* Quick examples */}
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={`${currentTheme.text} text-sm`}>Try:</span>
              {[
                { label: "sin(x)", value: "sin(x)" },
                { label: "1/x", value: "1/x" },
                { label: "sqrt(x)", value: "sqrt(x)" },
                { label: "x³ - 3x", value: "x^3 - 3*x" },
                { label: "tan(x)", value: "tan(x)" },
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => insertExample(example.value)}
                  className={`
        text-sm px-3 py-1 rounded-md 
        transition-colors duration-200
        ${
          theme === "dark"
            ? "bg-blue-700 text-white hover:bg-blue-600"
            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
        }
      `}
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          {/* Graph Display Section */}
          <div className="relative" ref={containerRef}>
            <canvas
              ref={canvasRef}
              className="w-full h-64 md:h-96 rounded-lg cursor-grab"
              style={{ touchAction: "none" }}
            />

            {/* Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                onClick={resetView}
                className="p-2 bg-blue-500 text-white rounded-full shadow-md"
                title="Reset view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 ${showGrid ? "bg-blue-500" : "bg-gray-400"} text-white rounded-full shadow-md`}
                title={`${showGrid ? "Hide" : "Show"} grid`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={downloadGraph}
                className="p-2 bg-blue-500 text-white rounded-full shadow-md"
                title="Download graph as PNG"
              >
                <Download size={18} />
              </button>
              <button
                onClick={clearAllEquations}
                className="p-2 bg-red-500 text-white rounded-full shadow-md"
                title="Clear all equations"
              >
                <Trash size={18} />
              </button>
            </div>
          </div>

          {/* Equations List Section */}
          <div className="mt-4">
            <h3 className={`${currentTheme.text} font-medium mb-2`}>
              Equations
            </h3>
            <div className="max-h-64 overflow-y-auto pr-2">
              {equations.length === 0 ? (
                <div className={`${currentTheme.text} text-sm italic`}>
                  No equations added yet. Enter an equation above to get
                  started.
                </div>
              ) : (
                equations.map((eq) => (
                  <div
                    key={eq.id}
                    className={`flex items-center gap-2 p-2 mb-2 border rounded ${currentTheme.input} ${eq.isVisible ? "" : "opacity-50"}`}
                  >
                    {/* Visibility toggle */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={eq.isVisible}
                        onChange={() => toggleEquationVisibility(eq.id)}
                        className="w-4 h-4"
                      />
                    </div>

                    {/* Color picker */}
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={eq.color}
                        onChange={(e) =>
                          updateEquationColor(eq.id, e.target.value)
                        }
                        className="w-6 h-6 p-0 border-0 rounded"
                      />
                    </div>

                    {/* Equation text */}
                    <div className={`flex-grow ${currentTheme.text}`}>
                      <span className="font-mono">{eq.expression}</span>
                      {eq.hasWarnings && (
                        <div className="text-yellow-500 text-xs mt-1 flex items-center">
                          <AlertTriangle size={12} className="mr-1" />
                          {eq.warningMessage}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // Copy to clipboard and input field
                          navigator.clipboard.writeText(eq.expression);
                          setCurrentEquation(eq.expression);
                          toast.info("Equation copied");
                        }}
                        className={`p-1 ${currentTheme.text} hover:text-blue-500`}
                        title="Copy equation"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEquations(equations.filter((e) => e.id !== eq.id));
                        }}
                        className={`p-1 ${currentTheme.text} hover:text-red-500`}
                        title="Delete equation"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme={theme} autoClose={3000} />
    </div>
  );
};

export default UltimateGraphPlotter;
