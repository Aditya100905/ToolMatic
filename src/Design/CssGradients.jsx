import { useState, useEffect, useRef } from "react";
import {
  Copy,
  X,
  Check,
  Sliders,
  Download,
  RefreshCw,
  Save,
  Trash2,
  Sparkles,
  Plus,
  Settings,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  Code,
  Image,
  Undo,
  Redo,
  PlusCircle,
  MinusCircle,
  Palette,
  Share,
  ExternalLink,
} from "lucide-react";

// StyleSheet with animations and styles
const styleSheet = `
  .color-stop {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.2);
    cursor: pointer;
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 10;
    transition: transform 0.2s ease;
  }
  .color-stop:hover, .color-stop.active {
    transform: translate(-50%, -50%) scale(1.2);
    z-index: 20;
  }
  .color-stop-container {
    position: relative;
    height: 30px;
    width: 100%;
    margin: 20px 0;
  }
  .gradient-track {
    position: absolute;
    height: 16px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 8px;
  }
  @keyframes fadeIn {
    from { opacity: 0 }
    to { opacity: 1 }
  }
  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }
  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0 }
    to { transform: translateY(0); opacity: 1 }
  }
  .slide-in {
    animation: slideIn 0.3s ease forwards;
  }
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.8 }
    50% { transform: scale(1.05); opacity: 1 }
    100% { transform: scale(1); opacity: 0.8 }
  }
  .pulse {
    animation: pulse 2s infinite ease-in-out;
  }
  @keyframes shimmer {
    0% { background-position: -200% 0 }
    100% { background-position: 200% 0 }
  }
  .shimmer {
    background: linear-gradient(90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(255,255,255,0.2) 50%, 
      rgba(255,255,255,0) 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  .ai-suggestion-card {
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .ai-suggestion-card:hover {
    transform: translateY(-4px);
  }
  .gradient-preview {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .saved-gradient {
    transition: all 0.2s ease;
  }
  .saved-gradient:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  .angle-picker {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin: 0 auto;
  }
  .angle-picker-handle {
    position: absolute;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .angle-picker-line {
    position: absolute;
    width: 2px;
    height: 50%;
    background: rgba(255,255,255,0.7);
    bottom: 50%;
    left: 50%;
    transform-origin: bottom center;
    pointer-events: none;
  }
  .code-container {
    position: relative;
  }
  .code-copy-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .code-container:hover .code-copy-btn {
    opacity: 1;
  }
  .scrollbar-custom::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .scrollbar-custom::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-custom::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
  }
  .history-item {
    transition: all 0.2s ease;
  }
  .history-item:hover {
    transform: translateX(4px);
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spinning {
    animation: spin 1s linear infinite;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .grid-cols-2 {
      grid-template-columns: 1fr;
    }
    .angle-picker {
      width: 60px;
      height: 60px;
    }
  }

  /* Tooltip styles */
  .tooltip {
    position: relative;
  }
  .tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
  .tooltip-text {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s ease;
    position: absolute;
    z-index: 100;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

// Utility function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Convert RGB to hex
const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Function to check if a color is dark
const isColorDark = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return false;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance < 0.5;
};

// Get a random color
const getRandomColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

// AI-based color suggestion implementation
const getAIColorSuggestions = async () => {
  // Normally this would be an API call, but we'll simulate it
  const colorPalettes = [
    {
      name: "Sunset Vibes",
      colors: ["#FF512F", "#F09819", "#FF8C00", "#FF6B6B"],
    },
    {
      name: "Ocean Blue",
      colors: ["#2E3192", "#1BFFFF", "#4364F7", "#06BEB6"],
    },
    {
      name: "Forest Green",
      colors: ["#134E5E", "#71B280", "#2D6A4F", "#40916C"],
    },
    {
      name: "Purple Haze",
      colors: ["#BC4E9C", "#F80759", "#834D9B", "#D04ED6"],
    },
    { name: "Midnight", colors: ["#232526", "#414345", "#000046", "#1CB5E0"] },
    { name: "Candy", colors: ["#FF61D2", "#FE9090", "#FF85A2", "#FBB03B"] },
    {
      name: "Lemon Lime",
      colors: ["#C6FF00", "#A8FF00", "#FC4A1A", "#F7B733"],
    },
    { name: "Electric", colors: ["#0072FF", "#00C6FF", "#00F260", "#0575E6"] },
    { name: "Autumn", colors: ["#DAA520", "#D76B00", "#A52A2A", "#FFA500"] },
    { name: "Neon City", colors: ["#FF00FF", "#00FFFF", "#FF00CC", "#00CCFF"] },
  ];

  // Simulate AI response delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return 3 random palettes
  const shuffled = [...colorPalettes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

// Main component
const GradientGenerator = ({ theme = "light" }) => {
  // State variables
  const [gradientType, setGradientType] = useState("linear");
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState([
    { color: "#6366f1", position: 0 },
    { color: "#ec4899", position: 100 },
  ]);
  const [activeStopIndex, setActiveStopIndex] = useState(null);
  const [isEditingColorStop, setIsEditingColorStop] = useState(false);
  const [isDraggingStop, setIsDraggingStop] = useState(false);
  const [previewStyle, setPreviewStyle] = useState({});
  const [cssCode, setCssCode] = useState("");
  const [savedGradients, setSavedGradients] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiGenerationType, setAiGenerationType] = useState("palettes");
  const [aiPrompt, setAiPrompt] = useState("");
  const [urlShare, setUrlShare] = useState(null);
  const [previewSize, setPreviewSize] = useState({ width: 400, height: 300 });
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [activeTab, setActiveTab] = useState("editor");
  const [cssOutput, setCssOutput] = useState("css");
  const [viewMode, setViewMode] = useState("advanced");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [presetGradients, setPresetGradients] = useState([]);
  const [showPresets, setShowPresets] = useState(false);
  const [previewShape, setPreviewShape] = useState("rectangle");

  const colorStopContainerRef = useRef(null);
  const anglePickerRef = useRef(null);

  // Load saved gradients from localStorage
  useEffect(() => {
    const storedGradients = localStorage.getItem("savedGradients");
    if (storedGradients) {
      setSavedGradients(JSON.parse(storedGradients));
    }

    // Load preset gradients - these could come from a real API too
    setPresetGradients([
      {
        name: "Instagram",
        type: "radial",
        angle: 90,
        colorStops: [
          { color: "#833ab4", position: 0 },
          { color: "#fd1d1d", position: 50 },
          { color: "#fcb045", position: 100 },
        ],
      },
      {
        name: "Midnight City",
        type: "linear",
        angle: 135,
        colorStops: [
          { color: "#232526", position: 0 },
          { color: "#414345", position: 100 },
        ],
      },
      {
        name: "Emerald Water",
        type: "linear",
        angle: 180,
        colorStops: [
          { color: "#348F50", position: 0 },
          { color: "#56B4D3", position: 100 },
        ],
      },
      {
        name: "Purple Love",
        type: "linear",
        angle: 45,
        colorStops: [
          { color: "#cc2b5e", position: 0 },
          { color: "#753a88", position: 100 },
        ],
      },
      {
        name: "Sunset",
        type: "linear",
        angle: 180,
        colorStops: [
          { color: "#FF512F", position: 0 },
          { color: "#F09819", position: 100 },
        ],
      },
      {
        name: "Northern Lights",
        type: "linear",
        angle: 215,
        colorStops: [
          { color: "#4CA1AF", position: 0 },
          { color: "#C4E0E5", position: 100 },
        ],
      },
    ]);
  }, []);

  // Generate gradient CSS and preview
  useEffect(() => {
    const generateGradientString = () => {
      // Sort color stops by position
      const sortedStops = [...colorStops].sort(
        (a, b) => a.position - b.position
      );

      const colorString = sortedStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(", ");

      if (gradientType === "linear") {
        return `linear-gradient(${angle}deg, ${colorString})`;
      } else if (gradientType === "radial") {
        return `radial-gradient(circle, ${colorString})`;
      } else if (gradientType === "conic") {
        return `conic-gradient(from ${angle}deg, ${colorString})`;
      }
    };

    const gradientString = generateGradientString();
    setPreviewStyle({
      background: gradientString,
    });

    // Generate CSS code
    if (cssOutput === "css") {
      setCssCode(`background: ${gradientString};\n`);
    } else if (cssOutput === "tailwind") {
      setCssCode(
        `/* Note: This is custom Tailwind CSS that needs to be added to your config */\n/* Use with className="bg-custom-gradient" */\n`.concat(
          `'custom-gradient': '${gradientString}',\n`
        )
      );
    } else if (cssOutput === "svg") {
      // Generate SVG gradient
      let svgGradient;
      const gradientId = "customGradient";

      if (gradientType === "linear") {
        // Calculate x1, y1, x2, y2 based on angle
        const angleRad = (angle - 90) * (Math.PI / 180);
        const x1 = 50 + Math.cos(angleRad) * 50;
        const y1 = 50 + Math.sin(angleRad) * 50;
        const x2 = 50 - Math.cos(angleRad) * 50;
        const y2 = 50 - Math.sin(angleRad) * 50;

        svgGradient = `<linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
  ${colorStops
    .sort((a, b) => a.position - b.position)
    .map(
      (stop) =>
        `  <stop offset="${stop.position}%" style="stop-color:${stop.color}"/>`
    )
    .join("\n")}
</linearGradient>`;
      } else if (gradientType === "radial") {
        svgGradient = `<radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
  ${colorStops
    .sort((a, b) => a.position - b.position)
    .map(
      (stop) =>
        `  <stop offset="${stop.position}%" style="stop-color:${stop.color}"/>`
    )
    .join("\n")}
</radialGradient>`;
      }

      setCssCode(`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${svgGradient}
  </defs>
  <rect width="100%" height="100%" fill="url(#${gradientId})" />
</svg>`);
    }
  }, [colorStops, gradientType, angle, cssOutput]);

  // Track changes for undo/redo
  const trackChange = (newState) => {
    setUndoStack((prev) => [
      ...prev,
      {
        colorStops: [...colorStops],
        gradientType,
        angle,
      },
    ]);
    setRedoStack([]);
  };

  // Handle undo
  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const lastState = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    setRedoStack((prev) => [
      ...prev,
      {
        colorStops: [...colorStops],
        gradientType,
        angle,
      },
    ]);

    setColorStops(lastState.colorStops);
    setGradientType(lastState.gradientType);
    setAngle(lastState.angle);
    setUndoStack(newUndoStack);
  };

  // Handle redo
  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    setUndoStack((prev) => [
      ...prev,
      {
        colorStops: [...colorStops],
        gradientType,
        angle,
      },
    ]);

    setColorStops(nextState.colorStops);
    setGradientType(nextState.gradientType);
    setAngle(nextState.angle);
    setRedoStack(newRedoStack);
  };

  // Add a new color stop
  const addColorStop = () => {
    if (colorStops.length >= 7) return; // Limit to 7 color stops

    trackChange();

    // Find a good position for the new stop
    const positions = colorStops.map((stop) => stop.position);
    const sortedPositions = [...positions].sort((a, b) => a - b);

    let newPosition = 50;
    if (sortedPositions.length >= 2) {
      // Find the largest gap between existing stops
      let maxGap = 0;
      let gapPosition = 50;

      for (let i = 0; i < sortedPositions.length - 1; i++) {
        const gap = sortedPositions[i + 1] - sortedPositions[i];
        if (gap > maxGap) {
          maxGap = gap;
          gapPosition = sortedPositions[i] + gap / 2;
        }
      }

      newPosition = gapPosition;
    }

    // Create a color that's different from the existing ones
    // Simple approach: mix the colors on either side
    const newColor = getRandomColor();

    setColorStops([...colorStops, { color: newColor, position: newPosition }]);

    // Set the new stop as active
    setActiveStopIndex(colorStops.length);
  };

  // Remove a color stop
  const removeColorStop = (index) => {
    if (colorStops.length <= 2) return; // Keep at least 2 stops

    trackChange();

    const newStops = colorStops.filter((_, i) => i !== index);
    setColorStops(newStops);

    if (activeStopIndex === index) {
      setActiveStopIndex(null);
    } else if (activeStopIndex > index) {
      setActiveStopIndex(activeStopIndex - 1);
    }
  };

  // Handle color stop position change via mouse events
  const handleMouseDown = (index, e) => {
    setActiveStopIndex(index);
    setIsDraggingStop(true);

    const handleMouseMove = (e) => {
      if (isDraggingStop && colorStopContainerRef.current) {
        const rect = colorStopContainerRef.current.getBoundingClientRect();
        const newPosition = Math.max(
          0,
          Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
        );

        const newStops = colorStops.map((stop, i) => {
          if (i === index) {
            return { ...stop, position: newPosition };
          }
          return stop;
        });

        setColorStops(newStops);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingStop(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      trackChange();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle angle picker change
  const handleAnglePickerMouseDown = (e) => {
    e.preventDefault();

    const handleMouseMove = (e) => {
      if (anglePickerRef.current) {
        const rect = anglePickerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate angle based on mouse position relative to center
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const angle = Math.round(Math.atan2(dy, dx) * (180 / Math.PI) + 90);

        // Normalize angle to 0-360
        const normalizedAngle = angle < 0 ? angle + 360 : angle;
        setAngle(normalizedAngle % 360);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      trackChange();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    handleMouseMove(e); // Set angle immediately on click
  };

  // Save current gradient
  const saveGradient = () => {
    const newGradient = {
      id: Date.now().toString(),
      name: `Gradient ${savedGradients.length + 1}`,
      type: gradientType,
      angle,
      colorStops: [...colorStops],
      preview: previewStyle.background,
    };

    const updatedGradients = [...savedGradients, newGradient];
    setSavedGradients(updatedGradients);
    localStorage.setItem("savedGradients", JSON.stringify(updatedGradients));
  };

  // Apply saved gradient
  const applySavedGradient = (savedGradient) => {
    trackChange();

    setGradientType(savedGradient.type);
    setAngle(savedGradient.angle);
    setColorStops([...savedGradient.colorStops]);
  };

  // Remove saved gradient
  const removeSavedGradient = (id) => {
    const updatedGradients = savedGradients.filter(
      (gradient) => gradient.id !== id
    );
    setSavedGradients(updatedGradients);
    localStorage.setItem("savedGradients", JSON.stringify(updatedGradients));
  };

  // Copy CSS code to clipboard
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Generate random gradient
  const generateRandomGradient = () => {
    trackChange();

    // Random gradient type
    const types = ["linear", "radial", "conic"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setGradientType(randomType);

    // Random angle
    const randomAngle = Math.floor(Math.random() * 360);
    setAngle(randomAngle);

    // Random number of stops (2-5)
    const numStops = Math.floor(Math.random() * 4) + 2;

    // Generate random color stops
    const newStops = [];
    for (let i = 0; i < numStops; i++) {
      newStops.push({
        color: getRandomColor(),
        position: i * (100 / (numStops - 1)),
      });
    }

    setColorStops(newStops);
  };

  // Load AI suggestions
  const loadAISuggestions = async () => {
    setIsLoadingAI(true);

    try {
      const suggestions = await getAIColorSuggestions();

      // Transform suggestions into usable gradients
      const gradientSuggestions = suggestions.map((suggestion) => {
        const colorStops = suggestion.colors.map((color, index) => ({
          color,
          position: index * (100 / (suggestion.colors.length - 1)),
        }));

        return {
          name: suggestion.name,
          colorStops,
          type: Math.random() > 0.5 ? "linear" : "radial",
          angle: Math.floor(Math.random() * 360),
        };
      });

      setAiSuggestions(gradientSuggestions);
    } catch (error) {
      console.error("Error loading AI suggestions:", error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Apply AI suggestion
  const applyAiSuggestion = (suggestion) => {
    trackChange();

    setGradientType(suggestion.type);
    setAngle(suggestion.angle);
    setColorStops([...suggestion.colorStops]);
  };

  // Share gradient via URL
  const shareGradientUrl = () => {
    // Encode current gradient state to a URL parameter
    const gradientData = {
      type: gradientType,
      angle,
      stops: colorStops,
    };

    const encodedData = encodeURIComponent(JSON.stringify(gradientData));
    const shareUrl = `${window.location.origin}${window.location.pathname}?gradient=${encodedData}`;

    setUrlShare(shareUrl);
    navigator.clipboard.writeText(shareUrl);
    setTimeout(() => setUrlShare(null), 3000);
  };

  // Convert gradient to image and download
  const downloadGradientImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    // Create a gradient on the canvas
    let gradient;

    if (gradientType === "linear") {
      // Calculate start and end points based on angle
      const angleRad = (angle - 90) * (Math.PI / 180);
      const x1 = 400 + Math.cos(angleRad) * 400;
      const y1 = 300 + Math.sin(angleRad) * 300;
      const x2 = 400 - Math.cos(angleRad) * 400;
      const y2 = 300 - Math.sin(angleRad) * 300;

      gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    } else if (gradientType === "radial") {
      gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
    } else if (gradientType === "conic") {
      // Canvas doesn't support conic gradients directly, so we'll use a linear one as fallback
      gradient = ctx.createLinearGradient(0, 0, 800, 600);
    }

    // Add color stops
    colorStops.forEach((stop) => {
      gradient.addColorStop(stop.position / 100, stop.color);
    });

    // Fill canvas with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Create downloadable link
    const link = document.createElement("a");
    link.download = "gradient.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Calculate UI state
  const colorStopElements = colorStops.map((stop, index) => (
    <div
      key={index}
      className={`color-stop ${activeStopIndex === index ? "active" : ""}`}
      style={{
        backgroundColor: stop.color,
        left: `${stop.position}%`,
        top: "50%",
        boxShadow:
          activeStopIndex === index
            ? "0 0 0 2px white, 0 0 0 4px rgba(66, 153, 225, 0.6)"
            : "",
      }}
      onMouseDown={(e) => handleMouseDown(index, e)}
      onClick={() => setActiveStopIndex(index)}
    />
  ));

  // Calculate angle picker position
  const angleRadians = (angle - 90) * (Math.PI / 180);
  const handleX = Math.cos(angleRadians) * 30 + 40; // 40 is half of the 80px angle picker
  const handleY = Math.sin(angleRadians) * 30 + 40;

  return (
    <div
      className={`min-h-screen mt-16 transition-colors duration-200 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <style>{styleSheet}</style>

      {/* Header */}
      <header
        className={`py-4 px-6 border-b sticky top-0 z-20 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="w-6 h-6 text-purple-500" />
            <h1 className="text-xl font-bold">Gradient Studio</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === "editor"
                  ? theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-900"
                  : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Editor
            </button>

            <button
              onClick={() => setActiveTab("library")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === "library"
                  ? theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-900"
                  : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Library
            </button>

            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                showAiPanel
                  ? theme === "dark"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-500 text-white"
                  : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              AI Assist
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {activeTab === "editor" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Controls */}
            <div
              className={`col-span-1 p-6 rounded-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"
              }`}
            >
              <div className="space-y-6">
                {/* Basic Controls */}
                <div>
                  <h2 className="text-lg font-medium mb-4">Gradient Type</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {["linear", "radial", "conic"].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          trackChange();
                          setGradientType(type);
                        }}
                        className={`py-2 px-3 rounded-md text-sm capitalize ${
                          gradientType === type
                            ? theme === "dark"
                              ? "bg-purple-600 text-white"
                              : "bg-purple-100 text-purple-700 border border-purple-300"
                            : theme === "dark"
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Angle Control - only for linear and conic */}
                {(gradientType === "linear" || gradientType === "conic") && (
                  <div>
                    <h2 className="text-lg font-medium mb-4">Angle</h2>
                    <div className="flex items-center justify-between">
                      <div
                        ref={anglePickerRef}
                        className="angle-picker"
                        style={{
                          background: theme === "dark" ? "#374151" : "#E5E7EB",
                          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                        onMouseDown={handleAnglePickerMouseDown}
                      >
                        <div
                          className="angle-picker-line"
                          style={{
                            transform: `translateX(-50%) rotate(${angle}deg)`,
                          }}
                        />
                        <div
                          className="angle-picker-handle"
                          style={{ left: handleX, top: handleY }}
                        />
                      </div>

                      <div className="ml-4">
                        <input
                          type="number"
                          value={angle}
                          onChange={(e) => {
                            const newAngle = parseInt(e.target.value) % 360;
                            setAngle(newAngle < 0 ? newAngle + 360 : newAngle);
                          }}
                          className={`w-16 px-2 py-1 text-center rounded ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-300"
                          } border`}
                        />
                        <span className="ml-1">°</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Color Stops Control */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Color Stops</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={addColorStop}
                        disabled={colorStops.length >= 7}
                        className={`p-1.5 rounded ${
                          colorStops.length >= 7
                            ? theme === "dark"
                              ? "bg-gray-700 text-gray-500"
                              : "bg-gray-200 text-gray-400"
                            : theme === "dark"
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        title="Add Color Stop"
                      >
                        <Plus size={16} />
                      </button>
                      {activeStopIndex !== null && colorStops.length > 2 && (
                        <button
                          onClick={() => removeColorStop(activeStopIndex)}
                          className={`p-1.5 rounded ${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          title="Remove Selected Color Stop"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Color Stop Track */}
                  <div
                    ref={colorStopContainerRef}
                    className="color-stop-container"
                  >
                    <div
                      className="gradient-track"
                      style={{ background: previewStyle.background }}
                    />
                    {colorStopElements}
                  </div>

                  {/* Active Color Stop Controls */}
                  {activeStopIndex !== null && (
                    <div
                      className="mt-4 p-4 rounded-md border fade-in slide-in"
                      style={{
                        borderColor: theme === "dark" ? "#4B5563" : "#E5E7EB",
                        background: theme === "dark" ? "#374151" : "#F9FAFB",
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{
                            backgroundColor: colorStops[activeStopIndex].color,
                          }}
                        />
                        <span className="font-medium">
                          Stop {activeStopIndex + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">Color</label>
                          <div className="flex">
                            <input
                              type="color"
                              value={colorStops[activeStopIndex].color}
                              onChange={(e) => {
                                const newStops = colorStops.map((stop, i) => {
                                  if (i === activeStopIndex) {
                                    return { ...stop, color: e.target.value };
                                  }
                                  return stop;
                                });
                                setColorStops(newStops);
                              }}
                              className="w-10 h-10 p-1 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={colorStops[activeStopIndex].color}
                              onChange={(e) => {
                                const newStops = colorStops.map((stop, i) => {
                                  if (i === activeStopIndex) {
                                    return { ...stop, color: e.target.value };
                                  }
                                  return stop;
                                });
                                setColorStops(newStops);
                              }}
                              className={`flex-1 ml-2 px-2 py-1 rounded ${
                                theme === "dark"
                                  ? "bg-gray-700 border-gray-600"
                                  : "bg-white border-gray-300"
                              } border`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm mb-1">Position</label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={Math.round(
                                colorStops[activeStopIndex].position
                              )}
                              onChange={(e) => {
                                const newPosition = Math.max(
                                  0,
                                  Math.min(100, parseFloat(e.target.value))
                                );
                                const newStops = colorStops.map((stop, i) => {
                                  if (i === activeStopIndex) {
                                    return { ...stop, position: newPosition };
                                  }
                                  return stop;
                                });
                                setColorStops(newStops);
                              }}
                              className={`flex-1 px-2 py-1 rounded ${
                                theme === "dark"
                                  ? "bg-gray-700 border-gray-600"
                                  : "bg-white border-gray-300"
                              } border`}
                            />
                            <span className="ml-1">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={saveGradient}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      theme === "dark"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-purple-500 hover:bg-purple-600 text-white"
                    }`}
                  >
                    <Save size={16} className="mr-1" />
                    Save
                  </button>

                  <button
                    onClick={generateRandomGradient}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      theme === "dark"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white"
                    }`}
                  >
                    <RefreshCw size={16} className="mr-1" />
                    Random
                  </button>

                  <button
                    onClick={downloadGradientImage}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    <Download size={16} className="mr-1" />
                    Export
                  </button>

                  <button
                    onClick={shareGradientUrl}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    <Share size={16} className="mr-1" />
                    Share
                  </button>
                </div>

                {urlShare && (
                  <div
                    className={`mt-2 p-3 rounded text-sm ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    URL copied to clipboard!
                  </div>
                )}

                {/* History Controls */}
                <div className="flex space-x-2">
                  <button
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className={`p-2 rounded ${
                      undoStack.length === 0
                        ? theme === "dark"
                          ? "bg-gray-700 text-gray-500"
                          : "bg-gray-200 text-gray-400"
                        : theme === "dark"
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    title="Undo"
                  >
                    <Undo size={16} />
                  </button>

                  <button
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className={`p-2 rounded ${
                      redoStack.length === 0
                        ? theme === "dark"
                          ? "bg-gray-700 text-gray-500"
                          : "bg-gray-200 text-gray-400"
                        : theme === "dark"
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    title="Redo"
                  >
                    <Redo size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Center Panel - Preview and Code */}
            <div className="col-span-1 lg:col-span-2">
              <div
                className={`rounded-lg overflow-hidden ${
                  theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"
                }`}
              >
                {/* Preview Section */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Preview</h2>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <label className="mr-2 text-sm">Shape:</label>
                        <select
                          value={previewShape}
                          onChange={(e) => setPreviewShape(e.target.value)}
                          className={`rounded px-2 py-1 text-sm ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-300"
                          } border`}
                        >
                          <option value="rectangle">Rectangle</option>
                          <option value="circle">Circle</option>
                          <option value="text">Text</option>
                        </select>
                      </div>

                      <div className="flex items-center text-sm">
                        <button
                          onClick={() =>
                            setPreviewSize({ width: 400, height: 300 })
                          }
                          className={`px-2 py-1 rounded ${
                            previewSize.width === 400
                              ? theme === "dark"
                                ? "bg-gray-700"
                                : "bg-gray-200"
                              : ""
                          }`}
                        >
                          S
                        </button>
                        <button
                          onClick={() =>
                            setPreviewSize({ width: 600, height: 400 })
                          }
                          className={`px-2 py-1 rounded ${
                            previewSize.width === 600
                              ? theme === "dark"
                                ? "bg-gray-700"
                                : "bg-gray-200"
                              : ""
                          }`}
                        >
                          M
                        </button>
                        <button
                          onClick={() =>
                            setPreviewSize({ width: 800, height: 500 })
                          }
                          className={`px-2 py-1 rounded ${
                            previewSize.width === 800
                              ? theme === "dark"
                                ? "bg-gray-700"
                                : "bg-gray-200"
                              : ""
                          }`}
                        >
                          L
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    {previewShape === "rectangle" && (
                      <div
                        className="gradient-preview rounded-lg shadow-lg"
                        style={{
                          ...previewStyle,
                          width: `${previewSize.width}px`,
                          height: `${previewSize.height}px`,
                          maxWidth: "100%",
                        }}
                      />
                    )}

                    {previewShape === "circle" && (
                      <div
                        className="gradient-preview rounded-full shadow-lg"
                        style={{
                          ...previewStyle,
                          width: `${Math.min(previewSize.width, previewSize.height)}px`,
                          height: `${Math.min(previewSize.width, previewSize.height)}px`,
                          maxWidth: "100%",
                        }}
                      />
                    )}

                    {previewShape === "text" && (
                      <div className="text-center">
                        <h1
                          className="text-6xl font-bold py-12"
                          style={{
                            backgroundImage: previewStyle.background,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          Gradient Text
                        </h1>
                      </div>
                    )}
                  </div>
                </div>

                {/* Code Output */}
                <div
                  className={`border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium">Code</h2>
                      <div className="flex items-center">
                        <select
                          value={cssOutput}
                          onChange={(e) => setCssOutput(e.target.value)}
                          className={`rounded px-2 py-1 text-sm ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-300"
                          } border`}
                        >
                          <option value="css">CSS</option>
                          <option value="tailwind">Tailwind CSS</option>
                          <option value="svg">SVG</option>
                        </select>
                      </div>
                    </div>

                    <div className="code-container">
                      <pre
                        className={`p-4 rounded-md text-sm overflow-x-auto scrollbar-custom ${
                          theme === "dark"
                            ? "bg-gray-900 text-gray-300"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <code>{cssCode}</code>
                      </pre>
                      <button
                        onClick={copyCodeToClipboard}
                        className={`code-copy-btn p-1.5 rounded ${
                          theme === "dark"
                            ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                        title="Copy to clipboard"
                      >
                        {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Suggestions Panel */}
              {showAiPanel && (
                <div
                  className={`mt-6 rounded-lg overflow-hidden fade-in slide-in ${
                    theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                        <h2 className="text-lg font-medium">AI Suggestions</h2>
                      </div>
                      <button
                        onClick={() => setShowAiPanel(false)}
                        className={`p-1 rounded-full ${
                          theme === "dark"
                            ? "text-gray-400 hover:bg-gray-700"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="mb-4">
                      <button
                        onClick={loadAISuggestions}
                        className={`flex items-center px-4 py-2 rounded-md ${
                          theme === "dark"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-purple-500 hover:bg-purple-600 text-white"
                        }`}
                        disabled={isLoadingAI}
                      >
                        {isLoadingAI ? (
                          <>
                            <RotateCw size={16} className="mr-2 spinning" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} className="mr-2" />
                            Generate Color Palettes
                          </>
                        )}
                      </button>
                    </div>

                    {aiSuggestions.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {aiSuggestions.map((suggestion, index) => {
                          // Create a gradient preview
                          const colorStopsStr = suggestion.colorStops
                            .map((stop) => `${stop.color} ${stop.position}%`)
                            .join(", ");

                          const gradientStr =
                            suggestion.type === "linear"
                              ? `linear-gradient(${suggestion.angle}deg, ${colorStopsStr})`
                              : `radial-gradient(circle, ${colorStopsStr})`;

                          return (
                            <div
                              key={index}
                              className={`ai-suggestion-card rounded-lg overflow-hidden ${
                                theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                              }`}
                              onClick={() => applyAiSuggestion(suggestion)}
                            >
                              <div
                                className="h-32 w-full"
                                style={{ background: gradientStr }}
                              />
                              <div className="p-3">
                                <h3 className="font-medium">
                                  {suggestion.name}
                                </h3>
                                <div className="flex mt-2">
                                  {suggestion.colorStops.map((stop, i) => (
                                    <div
                                      key={i}
                                      className="w-6 h-6 rounded-full mr-1"
                                      style={{
                                        backgroundColor: stop.color,
                                        boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          activeTab === "library" && (
            <div
              className={`p-6 rounded-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">My Saved Gradients</h2>
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className={`flex items-center px-3 py-1.5 rounded text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {showPresets ? "Hide" : "Show"} Presets
                  {showPresets ? (
                    <ChevronUp size={16} className="ml-1" />
                  ) : (
                    <ChevronDown size={16} className="ml-1" />
                  )}
                </button>
              </div>

              {/* Preset Gradients */}
              {showPresets && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Preset Gradients</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {presetGradients.map((preset, index) => {
                      // Create a gradient preview
                      const colorStopsStr = preset.colorStops
                        .map((stop) => `${stop.color} ${stop.position}%`)
                        .join(", ");

                      const gradientStr =
                        preset.type === "linear"
                          ? `linear-gradient(${preset.angle}deg, ${colorStopsStr})`
                          : preset.type === "radial"
                            ? `radial-gradient(circle, ${colorStopsStr})`
                            : `conic-gradient(from ${preset.angle}deg, ${colorStopsStr})`;

                      return (
                        <div
                          key={index}
                          className="saved-gradient rounded-lg overflow-hidden shadow-sm cursor-pointer"
                          onClick={() => {
                            applySavedGradient(preset);
                            setActiveTab("editor");
                          }}
                        >
                          <div
                            className="h-24 w-full"
                            style={{ background: gradientStr }}
                          />
                          <div
                            className={`p-3 text-center ${
                              theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                            }`}
                          >
                            <h4 className="font-medium text-sm truncate">
                              {preset.name}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <hr
                    className={`my-6 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                  />
                </div>
              )}

              {/* User Saved Gradients */}
              {savedGradients.length === 0 ? (
                <div
                  className={`text-center py-12 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <div className="mb-4">
                    <Save size={48} className="mx-auto opacity-40" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No saved gradients yet
                  </h3>
                  <p className="max-w-md mx-auto text-sm">
                    Create your first gradient in the editor and click "Save" to
                    add it to your library.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {savedGradients.map((gradient) => {
                    return (
                      <div
                        key={gradient.id}
                        className="saved-gradient rounded-lg overflow-hidden shadow-sm"
                      >
                        <div
                          className="h-32 w-full cursor-pointer"
                          style={{ background: gradient.preview }}
                          onClick={() => {
                            applySavedGradient(gradient);
                            setActiveTab("editor");
                          }}
                        />
                        <div
                          className={`p-3 flex justify-between items-center ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <h4 className="font-medium text-sm truncate">
                            {gradient.name}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSavedGradient(gradient.id);
                            }}
                            className={`p-1.5 rounded-full ${
                              theme === "dark"
                                ? "text-gray-400 hover:bg-gray-200"
                                : "text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
};
export default GradientGenerator;
