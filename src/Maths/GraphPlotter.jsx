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
    offsetX: 0,
    offsetY: 0
  });

  // Refs
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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
      try {
        ctx.strokeStyle = eq.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const gridSize = 50 * graphState.scale;
        const centerX = width/2 + graphState.offsetX;
        const centerY = height/2 + graphState.offsetY;

        for (let px = 0; px < width; px++) {
          // Convert screen x to mathematical x
          const x = (px - centerX) / gridSize;
          
          try {
            const y = math.evaluate(eq.expression, { x });
            
            // Convert mathematical y to screen y
            const screenY = centerY - y * gridSize;
            
            if (px === 0) {
              ctx.moveTo(px, screenY);
            } else {
              ctx.lineTo(px, screenY);
            }
          } catch (err) {
            console.error('Equation eval error:', err);
          }
        }
        
        ctx.stroke();
      } catch (err) {
        console.error(`Error drawing equation ${eq.expression}:`, err);
      }
    });
  };

  // Render Canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx, width, height);

    // Draw equations
    drawEquations(ctx, width, height);
  }, [equations, graphState, theme]);

  // Setup Canvas and Event Listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    // Set canvas size to container size
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      renderCanvas();
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Panning
    let isPanning = false;
    let lastX, lastY;

    const handleMouseDown = (e) => {
      isPanning = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
      if (!isPanning) return;

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;

      setGraphState((prev) => ({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY
      }));

      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMouseUp = () => {
      isPanning = false;
      canvas.style.cursor = 'grab';
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
      
      setGraphState((prev) => ({
        ...prev,
        scale: Math.max(0.1, Math.min(10, prev.scale * scaleChange))
      }));
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [renderCanvas]);

  // Render canvas when equations or graph state changes
  useEffect(() => {
    renderCanvas();
  }, [equations, graphState, renderCanvas, theme]);

  // Update color for a specific equation
  const updateEquationColor = (id, newColor) => {
    setEquations(prev => 
      prev.map(eq => 
        eq.id === id ? { ...eq, color: newColor } : eq
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
              onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const link = document.createElement('a');
                link.download = 'graph.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                toast.success('Graph downloaded');
              }}
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
                }`}
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