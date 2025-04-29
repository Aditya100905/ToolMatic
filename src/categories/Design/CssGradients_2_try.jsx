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
  Edit,
  AlertTriangle,
} from "lucide-react";

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
  
  /* Glass morphism */
  .glassmorphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  /* New animations */
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }
  
  .float {
    animation: float 5s ease-in-out infinite;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .ai-glow {
    box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
  }
  
  .ai-badge {
    background: linear-gradient(45deg, #7c3aed, #c026d3);
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

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

const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const isColorDark = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return false;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance < 0.5;
};

const getRandomColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

// Enhanced AI color suggestions with more personalization
const getAIColorSuggestions = async (preferences = {}) => {
  // Base color palettes
  const colorPalettes = [
    {
      name: "Sunset Vibes",
      colors: ["#FF512F", "#F09819", "#FF8C00", "#FF6B6B"],
      tags: ["warm", "vibrant", "orange", "red"],
    },
    {
      name: "Ocean Blue",
      colors: ["#2E3192", "#1BFFFF", "#4364F7", "#06BEB6"],
      tags: ["cool", "blue", "water", "calm"],
    },
    {
      name: "Forest Green",
      colors: ["#134E5E", "#71B280", "#2D6A4F", "#40916C"],
      tags: ["natural", "green", "calm", "earth"],
    },
    {
      name: "Purple Haze",
      colors: ["#BC4E9C", "#F80759", "#834D9B", "#D04ED6"],
      tags: ["vibrant", "purple", "pink", "elegant"],
    },
    {
      name: "Midnight",
      colors: ["#232526", "#414345", "#000046", "#1CB5E0"],
      tags: ["dark", "blue", "professional", "night"],
    },
    {
      name: "Candy",
      colors: ["#FF61D2", "#FE9090", "#FF85A2", "#FBB03B"],
      tags: ["playful", "vibrant", "pink", "yellow"],
    },
    {
      name: "Lemon Lime",
      colors: ["#C6FF00", "#A8FF00", "#FC4A1A", "#F7B733"],
      tags: ["fresh", "green", "citrus", "energetic"],
    },
    {
      name: "Electric",
      colors: ["#0072FF", "#00C6FF", "#00F260", "#0575E6"],
      tags: ["vibrant", "blue", "green", "modern"],
    },
    {
      name: "Autumn",
      colors: ["#DAA520", "#D76B00", "#A52A2A", "#FFA500"],
      tags: ["warm", "orange", "brown", "natural"],
    },
    {
      name: "Neon City",
      colors: ["#FF00FF", "#00FFFF", "#FF00CC", "#00CCFF"],
      tags: ["vibrant", "neon", "cyberpunk", "futuristic"],
    },
    {
      name: "Pastel Dream",
      colors: ["#FFD1DC", "#B0E0E6", "#FDFD96", "#CDB4DB"],
      tags: ["soft", "pastel", "calm", "gentle"],
    },
    {
      name: "Deep Space",
      colors: ["#111111", "#3D1B5C", "#071A52", "#086972"],
      tags: ["dark", "space", "mysterious", "professional"],
    },
    {
      name: "Coral Reef",
      colors: ["#FF7F50", "#89CFF0", "#F4A460", "#00CED1"],
      tags: ["tropical", "blue", "orange", "water"],
    },
    {
      name: "Strawberry Mint",
      colors: ["#FF5E5B", "#D8F0E5", "#A4DE02", "#76BAFF"],
      tags: ["fresh", "red", "green", "cool"],
    },
    {
      name: "Golden Hour",
      colors: ["#FFC857", "#E9724C", "#C5283D", "#255F85"],
      tags: ["warm", "sunset", "gold", "orange"],
    },
  ];

  // For demonstration, we'll simulate an AI delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Personalization based on preferences
  let filteredPalettes = [...colorPalettes];

  // Filter by tags if provided
  if (preferences.tags && preferences.tags.length > 0) {
    filteredPalettes = filteredPalettes.filter((palette) =>
      preferences.tags.some((tag) => palette.tags.includes(tag.toLowerCase()))
    );
  }

  // If we have favorites, boost them to the top
  if (preferences.favoriteColors && preferences.favoriteColors.length > 0) {
    // Sort palettes based on how many colors they share with favorites
    filteredPalettes.sort((a, b) => {
      const aMatches = a.colors.filter((color) =>
        preferences.favoriteColors.some(
          (favColor) => colorSimilarity(color, favColor) > 0.7
        )
      ).length;

      const bMatches = b.colors.filter((color) =>
        preferences.favoriteColors.some(
          (favColor) => colorSimilarity(color, favColor) > 0.7
        )
      ).length;

      return bMatches - aMatches;
    });
  }

  // If we don't have enough results after filtering, add some random ones
  if (filteredPalettes.length < 3) {
    const remainingPalettes = colorPalettes.filter(
      (palette) => !filteredPalettes.includes(palette)
    );
    const shuffledRemaining = [...remainingPalettes].sort(
      () => 0.5 - Math.random()
    );
    filteredPalettes = [
      ...filteredPalettes,
      ...shuffledRemaining.slice(0, 3 - filteredPalettes.length),
    ];
  }

  // Take the top 3 results
  const result = filteredPalettes.slice(0, 3);

  // Add AI-generated names based on user preferences if they exist
  if (preferences.mood || preferences.goal) {
    const moods = {
      energetic: "Vibrant",
      calm: "Serene",
      professional: "Business",
      playful: "Playful",
      modern: "Modern",
      elegant: "Elegant",
    };

    const goals = {
      website: "Web",
      branding: "Brand",
      presentation: "Presentation",
      art: "Creative",
      ui: "Interface",
    };

    result.forEach((palette, index) => {
      if (preferences.mood && preferences.goal) {
        const moodPrefix = moods[preferences.mood] || "Custom";
        const goalPrefix = goals[preferences.goal] || "Design";
        palette.name = `${moodPrefix} ${goalPrefix} ${index + 1}`;
      }
    });
  }

  return result;
};

// Simplified color similarity function (0-1 scale)
const colorSimilarity = (color1, color2) => {
  // Simple implementation for demo
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const rDiff = Math.abs(rgb1.r - rgb2.r) / 255;
  const gDiff = Math.abs(rgb1.g - rgb2.g) / 255;
  const bDiff = Math.abs(rgb1.b - rgb2.b) / 255;

  // Return similarity (1 - average difference)
  return 1 - (rDiff + gDiff + bDiff) / 3;
};

const GradientGenerator = ({ theme = "light" }) => {
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
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [gradientName, setGradientName] = useState("");
  const [gradientTags, setGradientTags] = useState("");
  const [aiPreferences, setAiPreferences] = useState({
    tags: [],
    mood: "",
    goal: "",
    favoriteColors: [],
  });
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [aiHistory, setAiHistory] = useState([]);
  const [gradientUsage, setGradientUsage] = useState("website");

  const colorStopContainerRef = useRef(null);
  const anglePickerRef = useRef(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    const storedGradients = localStorage.getItem("savedGradients");
    if (storedGradients) {
      setSavedGradients(JSON.parse(storedGradients));
    }

    // Load AI preferences if they exist
    const storedAiPrefs = localStorage.getItem("aiPreferences");
    if (storedAiPrefs) {
      setAiPreferences(JSON.parse(storedAiPrefs));
    }

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

  useEffect(() => {
    const generateGradientString = () => {
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

    if (cssOutput === "css") {
      setCssCode(`background: ${gradientString};\n`);
    } else if (cssOutput === "tailwind") {
      setCssCode(
        `/* Note: This is custom Tailwind CSS that needs to be added to your config */\n/* Use with className="bg-custom-gradient" */\n`.concat(
          `'custom-gradient': '${gradientString}',\n`
        )
      );
    } else if (cssOutput === "svg") {
      let svgGradient;
      const gradientId = "customGradient";

      if (gradientType === "linear") {
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
        `<stop offset="${stop.position}%" style="stop-color:${stop.color}"/>`
    )
    .join("\n")}
</linearGradient>`;
      } else if (gradientType === "radial") {
        svgGradient = `<radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
  ${colorStops
    .sort((a, b) => a.position - b.position)
    .map(
      (stop) =>
        `<stop offset="${stop.position}%" style="stop-color:${stop.color}"/>`
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

  // Effect to focus on name input when save modal opens
  useEffect(() => {
    if (showSaveModal && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
    }
  }, [showSaveModal]);

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

  const addColorStop = () => {
    if (colorStops.length >= 7) return;
    trackChange();
    const positions = colorStops.map((stop) => stop.position);
    const sortedPositions = [...positions].sort((a, b) => a - b);
    let newPosition = 50;

    if (sortedPositions.length >= 2) {
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

    const newColor = getRandomColor();
    setColorStops([...colorStops, { color: newColor, position: newPosition }]);
    setActiveStopIndex(colorStops.length);
  };

  const removeColorStop = (index) => {
    if (colorStops.length <= 2) return;
    trackChange();
    const newStops = colorStops.filter((_, i) => i !== index);
    setColorStops(newStops);
    if (activeStopIndex === index) {
      setActiveStopIndex(null);
    } else if (activeStopIndex > index) {
      setActiveStopIndex(activeStopIndex - 1);
    }
  };

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

  const handleAnglePickerMouseDown = (e) => {
    e.preventDefault();

    const handleMouseMove = (e) => {
      if (anglePickerRef.current) {
        const rect = anglePickerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const angle = Math.round(Math.atan2(dy, dx) * (180 / Math.PI) + 90);
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
    handleMouseMove(e);
  };

  const openSaveModal = () => {
    const suggestedName = `Gradient ${savedGradients.length + 1}`;
    setGradientName(suggestedName);

    // Generate tags based on colors
    const tags = [];
    colorStops.forEach((stop) => {
      const rgb = hexToRgb(stop.color);
      if (rgb) {
        // Add color family tags
        if (rgb.r > rgb.g && rgb.r > rgb.b) tags.push("red");
        else if (rgb.g > rgb.r && rgb.g > rgb.b) tags.push("green");
        else if (rgb.b > rgb.r && rgb.b > rgb.g) tags.push("blue");

        // Add brightness tags
        const brightness = (rgb.r + rgb.g + rgb.b) / 3;
        if (brightness < 85) tags.push("dark");
        else if (brightness > 170) tags.push("light");

        // Add specific color tags
        if (rgb.r > 200 && rgb.g > 200 && rgb.b < 100) tags.push("yellow");
        if (rgb.r > 200 && rgb.g < 100 && rgb.b > 200) tags.push("purple");
        if (rgb.r < 100 && rgb.g > 150 && rgb.b > 150) tags.push("teal");
        if (rgb.r > 200 && rgb.g > 100 && rgb.g < 150 && rgb.b < 100)
          tags.push("orange");
      }
    });

    setGradientTags([...new Set(tags)].join(", "));
    setShowSaveModal(true);
  };

  const saveGradient = () => {
    const newGradient = {
      id: Date.now().toString(),
      name: gradientName || `Gradient ${savedGradients.length + 1}`,
      type: gradientType,
      angle,
      colorStops: [...colorStops],
      tags: gradientTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      date: new Date().toISOString(),
    };

    const updatedGradients = [...savedGradients, newGradient];
    setSavedGradients(updatedGradients);
    localStorage.setItem("savedGradients", JSON.stringify(updatedGradients));
    setShowSaveModal(false);

    // Show confirmation visual feedback
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const loadGradient = (gradient) => {
    trackChange();
    setGradientType(gradient.type);
    setAngle(gradient.angle);
    setColorStops([...gradient.colorStops]);
  };

  const deleteGradient = (id, e) => {
    e.stopPropagation();
    const updatedGradients = savedGradients.filter((g) => g.id !== id);
    setSavedGradients(updatedGradients);
    localStorage.setItem("savedGradients", JSON.stringify(updatedGradients));
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const handleExport = () => {
    // Create a data URL for the gradient
    const canvas = document.createElement("canvas");
    canvas.width = previewSize.width;
    canvas.height = previewSize.height;
    const ctx = canvas.getContext("2d");

    // Create a gradient
    let grad;
    if (gradientType === "linear") {
      const angleRad = (angle * Math.PI) / 180;
      const x0 = previewSize.width / 2 - Math.cos(angleRad) * previewSize.width;
      const y0 =
        previewSize.height / 2 - Math.sin(angleRad) * previewSize.height;
      const x1 = previewSize.width / 2 + Math.cos(angleRad) * previewSize.width;
      const y1 =
        previewSize.height / 2 + Math.sin(angleRad) * previewSize.height;
      grad = ctx.createLinearGradient(x0, y0, x1, y1);
    } else if (gradientType === "radial") {
      grad = ctx.createRadialGradient(
        previewSize.width / 2,
        previewSize.height / 2,
        0,
        previewSize.width / 2,
        previewSize.height / 2,
        previewSize.width / 2
      );
    } else {
      // Conic gradient not directly supported in canvas, fallback to radial
      grad = ctx.createRadialGradient(
        previewSize.width / 2,
        previewSize.height / 2,
        0,
        previewSize.width / 2,
        previewSize.height / 2,
        previewSize.width / 2
      );
    }

    // Add color stops
    colorStops.forEach((stop) => {
      grad.addColorStop(stop.position / 100, stop.color);
    });

    // Apply gradient
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, previewSize.width, previewSize.height);

    // Create download link
    const link = document.createElement("a");
    link.download = `gradient-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const shareGradient = () => {
    // Create URL params from current gradient state
    const params = new URLSearchParams();
    params.append("type", gradientType);
    params.append("angle", angle);
    params.append("stops", JSON.stringify(colorStops));

    // Create shareable URL
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    // Copy to clipboard
    navigator.clipboard.writeText(url);
    setUrlShare(url);
    setTimeout(() => setUrlShare(null), 2000);
  };

  const handleGenerateAI = async () => {
    setIsLoadingAI(true);
    try {
      // For demonstration, we're using the mock AI function
      const suggestions = await getAIColorSuggestions(aiPreferences);
      setAiSuggestions(suggestions);

      // Update AI history
      const historyEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        preferences: { ...aiPreferences },
        results: suggestions,
      };

      setAiHistory((prev) => [historyEntry, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const applyAiSuggestion = (palette) => {
    trackChange();
    // Apply the colors from the palette
    const newStops = palette.colors.map((color, index) => ({
      color,
      position: index * (100 / (palette.colors.length - 1)),
    }));

    setColorStops(newStops);

    // Add to AI preferences favorites
    setAiPreferences((prev) => ({
      ...prev,
      favoriteColors: [
        ...new Set([...prev.favoriteColors, ...palette.colors]),
      ].slice(0, 10),
    }));

    // Save preferences
    localStorage.setItem(
      "aiPreferences",
      JSON.stringify({
        ...aiPreferences,
        favoriteColors: [
          ...new Set([...aiPreferences.favoriteColors, ...palette.colors]),
        ].slice(0, 10),
      })
    );
  };

  const toggleAiSettings = () => {
    setShowAiSettings(!showAiSettings);
  };

  const updateAiPreferences = (key, value) => {
    const newPrefs = { ...aiPreferences, [key]: value };
    setAiPreferences(newPrefs);
    localStorage.setItem("aiPreferences", JSON.stringify(newPrefs));
  };

  const handlePreviewShapeChange = (shape) => {
    setPreviewShape(shape);
  };

  const handleSizeChange = (dimension, value) => {
    setPreviewSize((prev) => ({
      ...prev,
      [dimension]: parseInt(value) || prev[dimension],
    }));
  };

  const renderColorStopControls = () => {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label
            className={`text-${theme === "dark" ? "white" : "gray-800"} font-medium`}
          >
            Color Stops
          </label>
          <div className="flex gap-1">
            <button
              onClick={addColorStop}
              disabled={colorStops.length >= 7}
              className={`p-1 rounded-md ${
                colorStops.length >= 7
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title="Add Color Stop"
            >
              <PlusCircle size={18} />
            </button>
            <button
              onClick={() =>
                activeStopIndex !== null && removeColorStop(activeStopIndex)
              }
              disabled={colorStops.length <= 2 || activeStopIndex === null}
              className={`p-1 rounded-md ${
                colorStops.length <= 2 || activeStopIndex === null
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title="Remove Selected Color Stop"
            >
              <MinusCircle size={18} />
            </button>
          </div>
        </div>
        <div className="color-stop-container" ref={colorStopContainerRef}>
          <div
            className="gradient-track"
            style={{
              background: previewStyle.background,
            }}
          ></div>
          {colorStops.map((stop, index) => (
            <div
              key={index}
              className={`color-stop ${activeStopIndex === index ? "active" : ""}`}
              style={{
                backgroundColor: stop.color,
                left: `${stop.position}%`,
                borderColor: isColorDark(stop.color) ? "white" : "black",
              }}
              onMouseDown={(e) => handleMouseDown(index, e)}
            ></div>
          ))}
        </div>
        {activeStopIndex !== null && (
          <div className="mt-4 flex gap-4 slide-in">
            <div>
              <label
                className={`block text-sm font-medium text-${theme === "dark" ? "white" : "gray-700"} mb-1`}
              >
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorStops[activeStopIndex]?.color || "#000000"}
                  onChange={(e) => {
                    const newStops = colorStops.map((stop, i) =>
                      i === activeStopIndex
                        ? { ...stop, color: e.target.value }
                        : stop
                    );
                    setColorStops(newStops);
                  }}
                  className="w-12 h-8 rounded-md cursor-pointer"
                  onBlur={trackChange}
                />
                <input
                  type="text"
                  value={colorStops[activeStopIndex]?.color || ""}
                  onChange={(e) => {
                    const newStops = colorStops.map((stop, i) =>
                      i === activeStopIndex
                        ? { ...stop, color: e.target.value }
                        : stop
                    );
                    setColorStops(newStops);
                  }}
                  className={`px-2 py-1 border rounded-md bg-${
                    theme === "dark" ? "gray-800" : "white"
                  } text-${theme === "dark" ? "white" : "gray-800"} w-24`}
                  onBlur={trackChange}
                />
              </div>
            </div>
            <div>
              <label
                className={`block text-sm font-medium text-${theme === "dark" ? "white" : "gray-700"} mb-1`}
              >
                Position
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={colorStops[activeStopIndex]?.position || 0}
                  onChange={(e) => {
                    const newStops = colorStops.map((stop, i) =>
                      i === activeStopIndex
                        ? { ...stop, position: parseFloat(e.target.value) }
                        : stop
                    );
                    setColorStops(newStops);
                  }}
                  className="w-24"
                  onMouseUp={trackChange}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round(colorStops[activeStopIndex]?.position || 0)}
                  onChange={(e) => {
                    const newValue = Math.max(
                      0,
                      Math.min(100, parseInt(e.target.value) || 0)
                    );
                    const newStops = colorStops.map((stop, i) =>
                      i === activeStopIndex
                        ? { ...stop, position: newValue }
                        : stop
                    );
                    setColorStops(newStops);
                  }}
                  className={`px-2 py-1 border rounded-md bg-${
                    theme === "dark" ? "gray-800" : "white"
                  } text-${theme === "dark" ? "white" : "gray-800"} w-16`}
                  onBlur={trackChange}
                />
                <span className="text-sm">%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAnglePicker = () => {
    if (gradientType === "radial") return null;

    const angleRadians = ((angle - 90) * Math.PI) / 180;
    const handleX = 50 + Math.cos(angleRadians) * 40;
    const handleY = 50 + Math.sin(angleRadians) * 40;

    return (
      <div className="my-6">
        <label
          className={`block text-${theme === "dark" ? "white" : "gray-800"} font-medium mb-2`}
        >
          Angle: {angle}°
        </label>
        <div className="flex items-center gap-4">
          <div
            className="angle-picker"
            ref={anglePickerRef}
            style={{
              background:
                "conic-gradient(from 0deg, #f87171, #60a5fa, #4ade80, #fbbf24, #f87171)",
              cursor: "grab",
            }}
            onMouseDown={handleAnglePickerMouseDown}
          >
            <div
              className="angle-picker-line"
              style={{
                transform: `translateX(-50%) rotate(${angle}deg)`,
              }}
            ></div>
            <div
              className="angle-picker-handle"
              style={{
                left: `${handleX}%`,
                top: `${handleY}%`,
              }}
            ></div>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <input
              type="range"
              min="0"
              max="359"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full"
              onMouseUp={trackChange}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  trackChange();
                  setAngle(0);
                }}
                className={`px-2 py-1 text-xs rounded-md bg-${
                  theme === "dark" ? "gray-800" : "gray-200"
                } hover:bg-${theme === "dark" ? "gray-700" : "gray-300"}`}
              >
                0°
              </button>
              <button
                onClick={() => {
                  trackChange();
                  setAngle(45);
                }}
                className={`px-2 py-1 text-xs rounded-md bg-${
                  theme === "dark" ? "gray-800" : "gray-200"
                } hover:bg-${theme === "dark" ? "gray-700" : "gray-300"}`}
              >
                45°
              </button>
              <button
                onClick={() => {
                  trackChange();
                  setAngle(90);
                }}
                className={`px-2 py-1 text-xs rounded-md bg-${
                  theme === "dark" ? "gray-800" : "gray-200"
                } hover:bg-${theme === "dark" ? "gray-700" : "gray-300"}`}
              >
                90°
              </button>
              <button
                onClick={() => {
                  trackChange();
                  setAngle(135);
                }}
                className={`px-2 py-1 text-xs rounded-md bg-${
                  theme === "dark" ? "gray-800" : "gray-200"
                } hover:bg-${theme === "dark" ? "gray-700" : "gray-300"}`}
              >
                135°
              </button>
              <button
                onClick={() => {
                  trackChange();
                  setAngle(180);
                }}
                className={`px-2 py-1 text-xs rounded-md bg-${
                  theme === "dark" ? "gray-800" : "gray-200"
                } hover:bg-${theme === "dark" ? "gray-700" : "gray-300"}`}
              >
                180°
              </button>
              <input
                type="number"
                min="0"
                max="359"
                value={angle}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setAngle(Math.max(0, Math.min(359, val)));
                  }
                }}
                onBlur={trackChange}
                className={`ml-auto px-2 py-1 border rounded-md bg-${
                  theme === "dark" ? "gray-800" : "white"
                } text-${theme === "dark" ? "white" : "gray-800"} w-16`}
              />
              <span className="text-sm">°</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    return (
      <div className="my-6">
        <div className="flex items-center justify-between mb-2">
          <label
            className={`text-${theme === "dark" ? "white" : "gray-800"} font-medium`}
          >
            Preview
          </label>
          <div className="flex gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => handlePreviewShapeChange("rectangle")}
                className={`px-2 py-1 text-xs ${
                  previewShape === "rectangle"
                    ? `bg-${theme === "dark" ? "gray-700" : "gray-300"}`
                    : `bg-${theme === "dark" ? "gray-900" : "white"}`
                }`}
              >
                Rectangle
              </button>
              <button
                onClick={() => handlePreviewShapeChange("circle")}
                className={`px-2 py-1 text-xs ${
                  previewShape === "circle"
                    ? `bg-${theme === "dark" ? "gray-700" : "gray-300"}`
                    : `bg-${theme === "dark" ? "gray-900" : "white"}`
                }`}
              >
                Circle
              </button>
              <button
                onClick={() => handlePreviewShapeChange("card")}
                className={`px-2 py-1 text-xs ${
                  previewShape === "card"
                    ? `bg-${theme === "dark" ? "gray-700" : "gray-300"}`
                    : `bg-${theme === "dark" ? "gray-900" : "white"}`
                }`}
              >
                Card
              </button>
            </div>
            <button
              onClick={handleExport}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-${
                theme === "dark" ? "gray-800" : "gray-200"
              } hover:bg-${theme === "dark" ? "gray-700" : "gray-300"}`}
              title="Export as PNG"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>
        <div
          className="gradient-preview rounded-lg shadow-lg overflow-hidden mx-auto"
          style={{
            ...previewStyle,
            width: `${previewSize.width}px`,
            height: `${previewSize.height}px`,
            borderRadius:
              previewShape === "circle"
                ? "50%"
                : previewShape === "card"
                  ? "12px"
                  : "",
          }}
        >
          {previewShape === "card" && (
            <div
              className={`p-4 h-full flex flex-col ${isColorDark(colorStops[0]?.color) ? "text-white" : "text-gray-800"}`}
            >
              <h3 className="text-xl font-bold mb-2">Gradient Card</h3>
              <p className="text-sm opacity-80">
                This is how your gradient would look on a card component
              </p>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-xs opacity-70">Sample UI Element</span>
                <button
                  className={`px-3 py-1 text-sm rounded-full ${isColorDark(colorStops[0]?.color) ? "bg-white text-gray-800" : "bg-gray-800 text-white"}`}
                >
                  Button
                </button>
              </div>
            </div>
          )}
        </div>
        {viewMode === "advanced" && (
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            <div className="flex items-center">
              <label className="text-sm mr-1">W:</label>
              <input
                type="number"
                value={previewSize.width}
                onChange={(e) => handleSizeChange("width", e.target.value)}
                className={`px-2 py-1 border rounded-md bg-${
                  theme === "dark" ? "gray-800" : "white"
                } text-${theme === "dark" ? "white" : "gray-800"} w-16 text-sm`}
              />
              <span className="text-xs ml-1">px</span>
            </div>
            <div className="flex items-center">
              <label className="text-sm mr-1">H:</label>
              <input
                type="number"
                value={previewSize.height}
                onChange={(e) => handleSizeChange("height", e.target.value)}
                className={`px-2 py-1 border rounded-md bg-${
                  theme === "dark" ? "gray-800" : "white"
                } text-${theme === "dark" ? "white" : "gray-800"} w-16 text-sm`}
              />
              <span className="text-xs ml-1">px</span>
            </div>
            <button
              onClick={shareGradient}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-${
                theme === "dark" ? "gray-800" : "gray-200"
              } hover:bg-${theme === "dark" ? "gray-700" : "gray-300"}`}
              title="Copy shareable link"
            >
              <Share size={14} />
              {urlShare ? "Copied!" : "Share"}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderCodeOutput = () => {
    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <label
            className={`text-${theme === "dark" ? "white" : "gray-800"} font-medium`}
          >
            Code Output
          </label>
          <div className="flex">
            <select
              value={cssOutput}
              onChange={(e) => setCssOutput(e.target.value)}
              className={`text-sm px-2 py-1 border rounded-l-md bg-${
                theme === "dark" ? "gray-800" : "white"
              } text-${theme === "dark" ? "white" : "gray-800"}`}
            >
              <option value="css">CSS</option>
              <option value="tailwind">Tailwind CSS</option>
              <option value="svg">SVG</option>
            </select>
            <button
              onClick={copyCodeToClipboard}
              className={`px-2 py-1 flex items-center gap-1 rounded-r-md bg-${
                theme === "dark" ? "gray-700" : "gray-300"
              } hover:bg-${theme === "dark" ? "gray-600" : "gray-400"}`}
              title="Copy code"
            >
              {copiedCode ? <Check size={14} /> : <Copy size={14} />}
              <span className="text-sm">{copiedCode ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
        <div
          className={`code-container bg-${theme === "dark" ? "gray-800" : "gray-100"} rounded-md p-4 overflow-x-auto scrollbar-custom`}
        >
          <pre
            className={`text-${theme === "dark" ? "gray-300" : "gray-700"} text-sm`}
          >
            {cssCode}
          </pre>
          <button
            onClick={copyCodeToClipboard}
            className={`code-copy-btn p-1 rounded-md text-${
              theme === "dark" ? "gray-300" : "gray-600"
            } hover:bg-${theme === "dark" ? "gray-700" : "gray-200"}`}
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
    );
  };

  const renderSavedGradients = () => {
    if (savedGradients.length === 0) {
      return (
        <div
          className={`text-center py-8 text-${theme === "dark" ? "gray-400" : "gray-500"}`}
        >
          <Save size={32} className="mx-auto mb-2 opacity-50" />
          <p>No saved gradients yet</p>
          <p className="text-sm mt-2">
            Create and save gradients to see them here
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {savedGradients.map((gradient) => (
          <div
            key={gradient.id}
            className={`saved-gradient rounded-md overflow-hidden cursor-pointer bg-${
              theme === "dark" ? "gray-800" : "white"
            } shadow-md border border-${theme === "dark" ? "gray-700" : "gray-200"}`}
            onClick={() => loadGradient(gradient)}
          >
            <div
              className="h-24 w-full"
              style={{
                background:
                  gradient.type === "linear"
                    ? `linear-gradient(${gradient.angle}deg, ${gradient.colorStops
                        .map((stop) => `${stop.color} ${stop.position}%`)
                        .join(", ")})`
                    : gradient.type === "radial"
                      ? `radial-gradient(circle, ${gradient.colorStops
                          .map((stop) => `${stop.color} ${stop.position}%`)
                          .join(", ")})`
                      : `conic-gradient(from ${gradient.angle}deg, ${gradient.colorStops
                          .map((stop) => `${stop.color} ${stop.position}%`)
                          .join(", ")})`,
              }}
            ></div>
            <div className="p-3">
              <div className="flex justify-between items-center">
                <h3
                  className={`text-${theme === "dark" ? "white" : "gray-800"} font-medium`}
                >
                  {gradient.name}
                </h3>
                <button
                  onClick={(e) => deleteGradient(gradient.id, e)}
                  className={`p-1 rounded-full hover:bg-${
                    theme === "dark" ? "gray-700" : "gray-200"
                  } text-${theme === "dark" ? "gray-400" : "gray-500"}`}
                  title="Delete gradient"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {gradient.tags && gradient.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {gradient.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className={`text-xs px-1.5 py-0.5 rounded-full bg-${
                        theme === "dark" ? "gray-700" : "gray-200"
                      } text-${theme === "dark" ? "gray-300" : "gray-600"}`}
                    >
                      {tag}
                    </span>
                  ))}
                  {gradient.tags.length > 3 && (
                    <span
                      className={`text-xs text-${theme === "dark" ? "gray-400" : "gray-500"}`}
                    >
                      +{gradient.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPresets = () => {
    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-${theme === "dark" ? "white" : "gray-800"} font-medium`}
          >
            Preset Gradients
          </h3>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className={`flex items-center gap-1 text-sm text-${
              theme === "dark" ? "gray-300" : "gray-600"
            }`}
          >
            {showPresets ? (
              <>
                <ChevronUp size={14} />
                Hide
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                Show
              </>
            )}
          </button>
        </div>
        {showPresets && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2 fade-in">
            {presetGradients.map((preset, index) => (
              <div
                key={index}
                className={`rounded-md cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
                onClick={() => loadGradient(preset)}
              >
                <div
                  className="h-16 w-full"
                  style={{
                    background:
                      preset.type === "linear"
                        ? `linear-gradient(${preset.angle}deg, ${preset.colorStops
                            .map((stop) => `${stop.color} ${stop.position}%`)
                            .join(", ")})`
                        : preset.type === "radial"
                          ? `radial-gradient(circle, ${preset.colorStops
                              .map((stop) => `${stop.color} ${stop.position}%`)
                              .join(", ")})`
                          : `conic-gradient(from ${preset.angle}deg, ${preset.colorStops
                              .map((stop) => `${stop.color} ${stop.position}%`)
                              .join(", ")})`,
                  }}
                ></div>
                <div
                  className={`p-2 bg-${theme === "dark" ? "gray-800" : "white"} text-${theme === "dark" ? "white" : "gray-800"} text-sm`}
                >
                  {preset.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAIPanel = () => {
    if (!showAiPanel) {
      return (
        <button
          onClick={() => setShowAiPanel(true)}
          className={`mt-6 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg border-2 border-dashed border-${
            theme === "dark" ? "purple-700" : "purple-400"
          } text-${theme === "dark" ? "purple-400" : "purple-700"} hover:bg-${
            theme === "dark" ? "purple-900/20" : "purple-50"
          } transition-colors`}
        >
          <Sparkles size={20} />
          <span className="font-medium">Generate with AI</span>
        </button>
      );
    }

    return (
      <div
        className={`mt-6 p-4 rounded-lg border border-${theme === "dark" ? "purple-800" : "purple-200"} bg-${
          theme === "dark" ? "gray-800/50" : "purple-50"
        } fade-in`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Sparkles
              size={18}
              className={`text-${theme === "dark" ? "purple-400" : "purple-600"}`}
            />
            <h3
              className={`font-medium text-${theme === "dark" ? "white" : "gray-800"}`}
            >
              AI Color Suggestions
            </h3>
            <span className="ai-badge">AI</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={toggleAiSettings}
              className={`p-1 rounded-md text-${theme === "dark" ? "gray-400" : "gray-500"} hover:bg-${
                theme === "dark" ? "gray-700" : "gray-200"
              }`}
              title="AI Settings"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => setShowAiPanel(false)}
              className={`p-1 rounded-md text-${theme === "dark" ? "gray-400" : "gray-500"} hover:bg-${
                theme === "dark" ? "gray-700" : "gray-200"
              }`}
              title="Close AI panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {showAiSettings && (
          <div
            className={`mb-4 p-3 rounded-md bg-${theme === "dark" ? "gray-700" : "white"} border border-${
              theme === "dark" ? "gray-600" : "gray-200"
            } slide-in`}
          >
            <h4 className="font-medium mb-2">AI Preferences</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Color Tags</label>
                <input
                  type="text"
                  placeholder="vibrant, cool, pastel, dark..."
                  value={aiPreferences.tags.join(", ")}
                  onChange={(e) =>
                    updateAiPreferences(
                      "tags",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    )
                  }
                  className={`w-full px-3 py-2 rounded-md border bg-${
                    theme === "dark" ? "gray-800" : "white"
                  } border-${theme === "dark" ? "gray-600" : "gray-300"}`}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Mood</label>
                <select
                  value={aiPreferences.mood}
                  onChange={(e) => updateAiPreferences("mood", e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border bg-${
                    theme === "dark" ? "gray-800" : "white"
                  } border-${theme === "dark" ? "gray-600" : "gray-300"}`}
                >
                  <option value="">Select a mood</option>
                  <option value="energetic">Energetic</option>
                  <option value="calm">Calm</option>
                  <option value="professional">Professional</option>
                  <option value="playful">Playful</option>
                  <option value="modern">Modern</option>
                  <option value="elegant">Elegant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Purpose</label>
                <select
                  value={aiPreferences.goal}
                  onChange={(e) => updateAiPreferences("goal", e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border bg-${
                    theme === "dark" ? "gray-800" : "white"
                  } border-${theme === "dark" ? "gray-600" : "gray-300"}`}
                >
                  <option value="">Select a purpose</option>
                  <option value="website">Website</option>
                  <option value="branding">Branding</option>
                  <option value="presentation">Presentation</option>
                  <option value="art">Art</option>
                  <option value="ui">UI Design</option>
                </select>
              </div>
              {aiPreferences.favoriteColors.length > 0 && (
                <div>
                  <label className="block text-sm mb-1">Favorite Colors</label>
                  <div className="flex flex-wrap gap-2">
                    {aiPreferences.favoriteColors.map((color, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        ></div>
                        <button
                          onClick={() => {
                            const newFavorites = [
                              ...aiPreferences.favoriteColors,
                            ];
                            newFavorites.splice(i, 1);
                            updateAiPreferences("favoriteColors", newFavorites);
                          }}
                          className="text-xs opacity-60 hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs mt-3 opacity-70">
              Your preferences help the AI generate more personalized gradients.
              They're saved locally between sessions.
            </p>
          </div>
        )}

        <button
          onClick={handleGenerateAI}
          disabled={isLoadingAI}
          className={`w-full py-2 px-4 rounded-md bg-${
            theme === "dark" ? "purple-700" : "purple-600"
          } hover:bg-${theme === "dark" ? "purple-600" : "purple-700"} text-white flex items-center justify-center gap-2 ${
            isLoadingAI ? "opacity-70 cursor-wait" : ""
          }`}
        >
          {isLoadingAI ? (
            <>
              <RefreshCw size={16} className="spinning" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Color Palettes
            </>
          )}
        </button>

        {aiSuggestions.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => applyAiSuggestion(suggestion)}
                className={`ai-suggestion-card p-2 rounded-md border border-${
                  theme === "dark" ? "gray-700" : "gray-200"
                } bg-${theme === "dark" ? "gray-800" : "white"} cursor-pointer`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-2">
                    <h4
                      className={`text-sm font-medium text-${theme === "dark" ? "white" : "gray-800"} truncate`}
                    >
                      {suggestion.name}
                    </h4>
                    <span className="text-xs ai-badge pulse">AI</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {suggestion.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-full h-10 rounded-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      ></div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {suggestion.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className={`text-xs px-1 py-0.5 rounded-full bg-${
                          theme === "dark" ? "gray-700" : "gray-100"
                        } text-${theme === "dark" ? "gray-300" : "gray-600"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {aiHistory.length > 0 && (
          <div className="mt-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => {
                const historyElem = document.getElementById("ai-history");
                if (historyElem) {
                  historyElem.style.display =
                    historyElem.style.display === "none" ? "block" : "none";
                }
              }}
            >
              <h4 className="text-sm font-medium">Recent Generations</h4>
              <ChevronDown size={16} />
            </div>
            <div id="ai-history" className="mt-2" style={{ display: "none" }}>
              {aiHistory.map((entry, i) => (
                <div
                  key={i}
                  className="history-item py-1 px-2 text-sm opacity-80 hover:opacity-100 cursor-pointer"
                  onClick={() => {
                    // Apply this history entry's parameters
                    setAiPreferences(entry.preferences);
                    setAiSuggestions(entry.results);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw size={12} />
                    <span>
                      {new Date(entry.timestamp).toLocaleTimeString()} -
                      {entry.preferences.tags.length > 0
                        ? ` ${entry.preferences.tags.join(", ")}`
                        : " Default"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTabs = () => {
    return (
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("editor")}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "editor"
              ? `border-b-2 border-${theme === "dark" ? "purple-500" : "purple-600"} text-${
                  theme === "dark" ? "white" : "gray-800"
                }`
              : `text-${theme === "dark" ? "gray-400" : "gray-500"} hover:text-${
                  theme === "dark" ? "gray-300" : "gray-700"
                }`
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "saved"
              ? `border-b-2 border-${theme === "dark" ? "purple-500" : "purple-600"} text-${
                  theme === "dark" ? "white" : "gray-800"
                }`
              : `text-${theme === "dark" ? "gray-400" : "gray-500"} hover:text-${
                  theme === "dark" ? "gray-300" : "gray-700"
                }`
          }`}
        >
          Saved Gradients
        </button>
      </div>
    );
  };

  const renderSaveModal = () => {
    if (!showSaveModal) return null;

    return (
      <div className="modal-overlay">
        <div
          className={`modal-content bg-${theme === "dark" ? "gray-800" : "white"} p-5`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-${theme === "dark" ? "white" : "gray-800"} font-medium`}
            >
              Save Gradient
            </h3>
            <button
              onClick={() => setShowSaveModal(false)}
              className={`p-2 rounded-full hover:bg-${theme === "dark" ? "gray-700" : "gray-100"}`}
            >
              <X size={18} />
            </button>
          </div>

          <div
            className="h-24 w-full mb-4 rounded-md"
            style={{
              background:
                gradientType === "linear"
                  ? `linear-gradient(${angle}deg, ${colorStops
                      .map((stop) => `${stop.color} ${stop.position}%`)
                      .join(", ")})`
                  : gradientType === "radial"
                    ? `radial-gradient(circle, ${colorStops
                        .map((stop) => `${stop.color} ${stop.position}%`)
                        .join(", ")})`
                    : `conic-gradient(from ${angle}deg, ${colorStops
                        .map((stop) => `${stop.color} ${stop.position}%`)
                        .join(", ")})`,
            }}
          ></div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium text-${theme === "dark" ? "gray-300" : "gray-700"} mb-1`}
            >
              Name
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={gradientName}
              onChange={(e) => setGradientName(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border bg-${
                theme === "dark" ? "gray-700" : "white"
              } border-${theme === "dark" ? "gray-600" : "gray-300"} text-${theme === "dark" ? "white" : "gray-800"}`}
              placeholder="My Awesome Gradient"
            />
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium text-${theme === "dark" ? "gray-300" : "gray-700"} mb-1`}
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={gradientTags}
              onChange={(e) => setGradientTags(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border bg-${
                theme === "dark" ? "gray-700" : "white"
              } border-${theme === "dark" ? "gray-600" : "gray-300"} text-${theme === "dark" ? "white" : "gray-800"}`}
              placeholder="blue, dark, professional"
            />
          </div>

          <div className="mb-4">
            <label
              className={`block text-sm font-medium text-${theme === "dark" ? "gray-300" : "gray-700"} mb-1`}
            >
              Purpose
            </label>
            <select
              value={gradientUsage}
              onChange={(e) => setGradientUsage(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border bg-${
                theme === "dark" ? "gray-700" : "white"
              } border-${theme === "dark" ? "gray-600" : "gray-300"} text-${theme === "dark" ? "white" : "gray-800"}`}
            >
              <option value="website">Website Background</option>
              <option value="ui">UI Element</option>
              <option value="button">Button</option>
              <option value="card">Card</option>
              <option value="banner">Banner</option>
              <option value="logo">Logo</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowSaveModal(false)}
              className={`px-4 py-2 rounded-md bg-${theme === "dark" ? "gray-700" : "gray-200"} text-${
                theme === "dark" ? "white" : "gray-800"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={saveGradient}
              className={`px-4 py-2 rounded-md bg-${theme === "dark" ? "purple-600" : "purple-600"} text-white`}
            >
              Save Gradient
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`gradient-generator max-w-4xl mx-auto p-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
    >
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />
      {renderSaveModal()}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Palette
            size={24}
            className={`text-${theme === "dark" ? "purple-400" : "purple-600"}`}
          />
          Gradient Generator
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              trackChange();
              const randomColor1 = getRandomColor();
              const randomColor2 = getRandomColor();
              setColorStops([
                { color: randomColor1, position: 0 },
                { color: randomColor2, position: 100 },
              ]);
            }}
            className={`p-2 rounded-md text-${theme === "dark" ? "gray-300" : "gray-600"} hover:bg-${
              theme === "dark" ? "gray-700" : "gray-200"
            }`}
            title="Random Colors"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={openSaveModal}
            className={`p-2 rounded-md text-${theme === "dark" ? "gray-300" : "gray-600"} hover:bg-${
              theme === "dark" ? "gray-700" : "gray-200"
            }`}
            title="Save Gradient"
          >
            <Save size={18} />
          </button>
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className={`p-2 rounded-md ${
              undoStack.length === 0
                ? `opacity-50 cursor-not-allowed text-${theme === "dark" ? "gray-500" : "gray-400"}`
                : `text-${theme === "dark" ? "gray-300" : "gray-600"} hover:bg-${
                    theme === "dark" ? "gray-700" : "gray-200"
                  }`
            }`}
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className={`p-2 rounded-md ${
              redoStack.length === 0
                ? `opacity-50 cursor-not-allowed text-${theme === "dark" ? "gray-500" : "gray-400"}`
                : `text-${theme === "dark" ? "gray-300" : "gray-600"} hover:bg-${
                    theme === "dark" ? "gray-700" : "gray-200"
                  }`
            }`}
            title="Redo"
          >
            <Redo size={18} />
          </button>
          <button
            onClick={() =>
              setViewMode(viewMode === "simple" ? "advanced" : "simple")
            }
            className={`p-2 rounded-md text-${theme === "dark" ? "gray-300" : "gray-600"} hover:bg-${
              theme === "dark" ? "gray-700" : "gray-200"
            }`}
            title={viewMode === "simple" ? "Advanced Mode" : "Simple Mode"}
          >
            {viewMode === "simple" ? <Sliders size={18} /> : <Code size={18} />}
          </button>
        </div>
      </div>

      {renderTabs()}

      {activeTab === "editor" ? (
        <>
          <div className="mb-6">
            <label
              className={`block text-${theme === "dark" ? "white" : "gray-800"} font-medium mb-2`}
            >
              Gradient Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={gradientType === "linear"}
                  onChange={() => {
                    trackChange();
                    setGradientType("linear");
                  }}
                  className="mr-2"
                />
                <span>Linear</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={gradientType === "radial"}
                  onChange={() => {
                    trackChange();
                    setGradientType("radial");
                  }}
                  className="mr-2"
                />
                <span>Radial</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={gradientType === "conic"}
                  onChange={() => {
                    trackChange();
                    setGradientType("conic");
                  }}
                  className="mr-2"
                />
                <span>Conic</span>
              </label>
            </div>
          </div>

          {renderColorStopControls()}
          {renderAnglePicker()}
          {renderPreview()}
          {renderPresets()}
          {renderAIPanel()}
          {viewMode === "advanced" && renderCodeOutput()}
        </>
      ) : (
        renderSavedGradients()
      )}
    </div>
  );
};

export default GradientGenerator;
