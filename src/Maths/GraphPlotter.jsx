import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as math from 'mathjs';
import { 
  Plus, 
  Trash2, 
  X,
  Copy,
  Download
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Utility function to generate visually distinct random colors
const generateDistinctRandomColor = (index) => {
  // Predefined color palette with good visual distinction
  const colorPalette = [
    '#FF6B6B',  // Coral Red
    '#4ECDC4',  // Turquoise
    '#45B7D1',  // Sky Blue
    '#FDCB6E',  // Sunflower Yellow
    '#6C5CE7',  // Purple
    '#A8E6CF',  // Mint Green
    '#FF8ED4',  // Pink
    '#FAD390',  // Muted Orange
    '#6A89CC',  // Soft Blue
    '#7ED6DF',  // Light Blue
    '#E056FD',  // Bright Magenta
    '#48DBFB',  // Bright Cyan
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

const UltimateGraphPlotter = ({ 
  theme = 'light', 
  initialEquations = ['x^2'] 
}) => {
  // State Management
  const [equations, setEquations] = useState(
    initialEquations.map((expr, index) => ({
      id: `eq-${index}`, 
      expression: expr, 
      color: generateDistinctRandomColor(index),
      isVisible: true
    }))
  );
  const [currentEquation, setCurrentEquation] = useState('');
  const [graphState, setGraphState] = useState({
    scale: 1,
    targetScale: 1,
    offsetX: 0,
    offsetY: 0,
    velocity: { x: 0, y: 0 },
    isDragging: false
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
      background: 'bg-white',
      container: 'bg-gray-50',
      text: 'text-gray-800',
      input: 'bg-white border-gray-300',
      grid: {
        color: 'rgba(200,200,200,0.5)',
        axes: 'rgba(0,0,0,0.7)'
      }
    },
    dark: {
      background: 'bg-black',
      container: 'bg-[#212121]',
      text: 'text-gray-100',
      input: 'bg-black border-gray-600 text-gray-100',
      grid: {
        color: 'rgba(100,100,100,0.3)',
        axes: 'rgba(255,255,255,0.7)'
      }
    }
  };

  // Draw Grid
  const drawGrid = (ctx, width, height) => {
    const gridConfig = themeStyles[theme].grid;
    const gridSize = 50 * graphState.scale;
    
    ctx.strokeStyle = gridConfig.color;
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let x = width/2 + (graphState.offsetX % gridSize); x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let x = width/2 + (graphState.offsetX % gridSize); x > 0; x -= gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = height/2 + (graphState.offsetY % gridSize); y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let y = height/2 + (graphState.offsetY % gridSize); y > 0; y -= gridSize) {
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
    ctx.moveTo(0, height/2 + graphState.offsetY);
    ctx.lineTo(width, height/2 + graphState.offsetY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(width/2 + graphState.offsetX, 0);
    ctx.lineTo(width/2 + graphState.offsetX, height);
    ctx.stroke();
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
        const centerX = width/2 + graphState.offsetX;
        const centerY = height/2 + graphState.offsetY;

        // Optimize by only calculating points within visible range
        // and adjusting resolution based on complexity
        const step = 1; // Can be adjusted for performance
        let lastY = null;
        
        for (let px = 0; px < width; px += step) {
          // Convert screen x to mathematical x
          const x = (px - centerX) / gridSize;
          
          try {
            const y = math.evaluate(eq.expression, { x });
            
            // Check for discontinuities or very large jumps
            const screenY = centerY - y * gridSize;
            
            // Skip drawing line segments for extreme jumps (discontinuities)
            const isValidPoint = isFinite(screenY) && Math.abs(screenY) < height * 10;
            
            if (isValidPoint) {
              if (lastY === null || px === 0) {
                ctx.moveTo(px, screenY);
              } else {
                // Only connect points if the jump isn't too extreme
                if (Math.abs(screenY - lastY) < height) {
                  ctx.lineTo(px, screenY);
                } else {
                  ctx.moveTo(px, screenY);
                }
              }
              lastY = screenY;
            } else {
              lastY = null;
            }
          } catch (err) {
            // Skip this point silently
            lastY = null;
          }
        }
        
        ctx.stroke();
      } catch (err) {
        console.error(`Error drawing equation ${eq.expression}:`, err);
      }
    });
  };

  // Animation loop
  const animate = useCallback((timestamp) => {
    if (!isAnimatingRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Calculate delta time for smooth animations
    const deltaTime = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0.016;
    lastTimeRef.current = timestamp;
    
    // Apply smooth scale transition
    const scaleDiff = graphState.targetScale - graphState.scale;
    const newScale = Math.abs(scaleDiff) < 0.001 
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
      if (Math.abs(newVelocityX) < 0.1 && 
          Math.abs(newVelocityY) < 0.1 && 
          Math.abs(scaleDiff) < 0.001) {
        isAnimatingRef.current = false;
      }
    }
    
    // Update state
    setGraphState(prev => ({
      ...prev,
      scale: newScale,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
      velocity: { x: newVelocityX, y: newVelocityY },
    }));
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate);
  }, [graphState]);
  
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

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Clear canvas with background color based on theme
    ctx.fillStyle = theme === 'light' ? 'white' : 'black';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx, width, height);

    // Draw equations
    drawEquations(ctx, width, height);
  }, [drawEquations, theme]);

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
    window.addEventListener('resize', resizeCanvas);

    // Advanced Panning with inertia
    const handleMouseDown = (e) => {
      setGraphState(prev => ({ 
        ...prev, 
        isDragging: true,
        velocity: { x: 0, y: 0 } // Reset velocity when starting to drag
      }));
      
      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
      
      // Ensure animation is running for smooth interactions
      ensureAnimationIsRunning();
    };

    const handleMouseMove = (e) => {
      if (!graphState.isDragging) return;
      
      const deltaX = e.clientX - lastMousePositionRef.current.x;
      const deltaY = e.clientY - lastMousePositionRef.current.y;
      
      // Update velocity based on mouse movement
      setGraphState(prev => ({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY,
        velocity: { 
          x: deltaX * 0.3, // Scale velocity to make it feel natural
          y: deltaY * 0.3
        }
      }));
      
      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setGraphState(prev => ({ ...prev, isDragging: false }));
      canvas.style.cursor = 'grab';
    };

    const handleWheel = (e) => {
      e.preventDefault();
      
      // Calculate target scale with smooth zoom
      const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
      const newTargetScale = Math.max(0.1, Math.min(10, graphState.targetScale * scaleChange));
      
      // Get mouse position relative to canvas for zoom targeting
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Set new target scale
      setGraphState(prev => ({
        ...prev,
        targetScale: newTargetScale
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
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    // Touch support
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      
      // Cancel any pending animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        isAnimatingRef.current = false;
      }
    };
  }, [graphState.isDragging, graphState.targetScale, renderCanvas, ensureAnimationIsRunning]);

  // Render canvas after each frame
  useEffect(() => {
    renderCanvas();
  }, [graphState, equations, renderCanvas]);

  // Update color for a specific equation
  const updateEquationColor = (id, newColor) => {
    setEquations(prev => 
      prev.map(eq => 
        eq.id === id ? { ...eq, color: newColor } : eq
      )
    );
  };

  // Toggle equation visibility
  const toggleEquationVisibility = (id) => {
    setEquations(prev => 
      prev.map(eq => 
        eq.id === id ? { ...eq, isVisible: !eq.isVisible } : eq
      )
    );
  };

  // Add equation method
  const addEquation = (equation) => {
    try {
      // Validate equation
      math.evaluate(equation, { x: 1 });

      const newEquation = {
        id: `eq-${Date.now()}`,
        expression: equation,
        color: generateDistinctRandomColor(equations.length),
        isVisible: true
      };
      setEquations((prev) => [...prev, newEquation]);
      setCurrentEquation('');
    } catch (err) {
      toast.error(`Invalid equation: ${err.message}`);
    }
  };

  // Function to download the graph with correct theme
  const downloadGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // The canvas already has the correct theme applied
    // because we're now explicitly setting the background in renderCanvas
    const link = document.createElement('a');
    link.download = 'graph.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Graph downloaded');
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className={`${currentTheme.background} mt-10 items-center min-h-screen`}>
      <div className="flex flex-col items-center">
        <div
          className={`w-full mb-0 mt-10 max-w-4xl mx-auto p-4 rounded-xl shadow-md ${currentTheme.container} sm:p-6`}
        >
          {/* Equation Input Section */}
          <div className="flex space-x-2 mb-4">
            <div className="flex-grow relative">
              <input
                type="text"
                value={currentEquation}
                onChange={(e) => setCurrentEquation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (!currentEquation) return;
                    addEquation(currentEquation);
                  }
                }}
                placeholder="Enter equation (e.g., x^2, sin(x))"
                className={`w-full p-2 border rounded ${currentTheme.input} ${currentTheme.text}`}
              />
              {currentEquation && (
                <button
                  onClick={() => setCurrentEquation('')}
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
              className="bg-blue-500 text-white p-2 rounded"
            >
              <Plus />
            </button>
          </div>

          {/* Graph Container */}
          <div
            ref={containerRef}
            className={`relative w-full aspect-video border rounded overflow-hidden ${currentTheme.container}`}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab touch-none"
            />
          </div>

          {/* Download Graph Button */}
          <div className="mt-2 flex justify-end">
            <button
              onClick={downloadGraph}
              className={`flex items-center space-x-2 p-2 rounded ${
                theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-100'
              }`}
            >
              <Download size={20} />
              <span>Download Graph</span>
            </button>
          </div>

          {/* Equation List with Color Picker */}
          <div className="mt-4 space-y-2">
            {equations.map((eq) => (
              <div
                key={eq.id}
                className={`flex justify-between items-center p-2 rounded ${
                  theme === 'light' ? 'bg-gray-100' : 'bg-black'
                } ${!eq.isVisible ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  {/* Color Picker */}
                  <input 
                    type="color" 
                    value={eq.color}
                    onChange={(e) => updateEquationColor(eq.id, e.target.value)}
                    className="w-6 h-6 p-0 border-none rounded-full cursor-pointer"
                  />
                  <span className={currentTheme.text}>{eq.expression}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleEquationVisibility(eq.id)}
                    className={`${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    {eq.isVisible ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(eq.expression)
                        .then(() => toast.success('Equation copied to clipboard'))
                        .catch(() => toast.error('Failed to copy equation'));
                    }}
                    className={`${
                      theme === 'light' ? 'text-blue-500' : 'text-blue-400'
                    }`}
                  >
                    <Copy size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setEquations((prev) => prev.filter((e) => e.id !== eq.id));
                    }}
                    className={`${
                      theme === 'light' ? 'text-red-500' : 'text-red-400'
                    }`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Toast Container */}
          <ToastContainer
            theme={theme === 'light' ? 'light' : 'dark'}
          />
        </div>
      </div>
    </div>
  );
}

export default UltimateGraphPlotter;