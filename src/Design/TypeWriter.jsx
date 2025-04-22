import { useState, useEffect, useRef } from "react";
import {
  Copy,
  X,
  Check,
  Sliders,
  Search,
  Download,
  Play,
  Pause,
  Type,
  RefreshCw,
  Edit3,
  FileText,
  Globe,
  Plus,
  Trash2,
  Save,
  Move,
  Text,
  List,
  AlignCenter,
  Box,
  Droplet,
  Wand2,
} from "lucide-react";

// Font options expanded with more choices
const fontOptions = [
  { name: "Monospace", value: "font-mono" },
  { name: "Sans-serif", value: "font-sans" },
  { name: "Serif", value: "font-serif" },
  { name: "Cursive", value: "font-['Comic_Sans_MS',_cursive]" },
  { name: "Fantasy", value: "font-['Papyrus',_fantasy]" },
  { name: "Terminal", value: "font-['Courier_New',_monospace]" },
  { name: "Elegant", value: "font-['Garamond',_serif]" },
  { name: "Modern", value: "font-['Arial',_sans-serif]" },
  { name: "Clean", value: "font-['Helvetica',_sans-serif]" },
  { name: "Technical", value: "font-['Consolas',_monospace]" },
];

// Cursor styles for typewriter effect
const cursorStyles = [
  { name: "Solid", value: "border-r-2 border-current" },
  {
    name: "Block",
    value: "after:content-['▋'] after:ml-1 after:animate-pulse",
  },
  { name: "Underscore", value: "border-b-2 border-current" },
  { name: "Blinking Bar", value: "border-r-2 border-current animate-pulse" },
  { name: "None", value: "" },
];

// Text effect types
const effectTypes = [
  { name: "Typewriter", value: "typewriter" },
  { name: "Fade In", value: "fade-in" },
  { name: "Highlight", value: "highlight" },
  { name: "Gradient", value: "gradient" },
  { name: "Shadow", value: "shadow" },
  { name: "Glitch", value: "glitch" },
  { name: "Blur Reveal", value: "blur-reveal" },
  { name: "Text Reveal", value: "text-reveal" },
];

// Expanded stylesheet to handle multiple effect types
const styleSheet = `
/* Base Typography Styles */
.typography-effect {
  display: inline-block;
  max-width: 100%;
}

/* Typewriter Effect Styles */
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink {
  50% { border-color: transparent }
}

.effect-typewriter {
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  animation: typing var(--typing-duration, 3.5s) var(--typing-steps, steps(40, end)) forwards,
             blink var(--blink-duration, 0.75s) var(--blink-timing, step-end) var(--blink-iteration, infinite);
}

.typewriter-instant {
  width: 100%;
  animation: none;
}

.typewriter-container {
  display: inline-block;
  max-width: 100%;
}

.char-by-char .typewriter-char {
  opacity: 0;
}

.char-by-char .typewriter-char.visible {
  opacity: 1;
  transition: opacity 0.1s;
}

.type-mode-word .typewriter-word {
  opacity: 0;
}

.type-mode-word .typewriter-word.visible {
  opacity: 1;
  transition: opacity 0.2s;
}

.cursor-blink {
  animation: blink 0.75s step-end infinite;
}

/* Fade In Effect */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.effect-fade-in {
  opacity: 0;
  animation: fadeIn var(--fade-duration, 1.5s) var(--fade-timing, ease) forwards;
  animation-delay: var(--fade-delay, 0s);
}

.fade-in-instant {
  opacity: 1;
  animation: none;
}

/* Highlight Effect */
@keyframes highlightAnim {
  0% { background-size: 0% 100%; }
  100% { background-size: 100% 100%; }
}

.effect-highlight {
  background-image: linear-gradient(transparent calc(100% - var(--highlight-height, 6px)), var(--highlight-color, #ffde59) calc(100% - var(--highlight-height, 6px)));
  background-repeat: no-repeat;
  background-size: 0% 100%;
  animation: highlightAnim var(--highlight-duration, 1.5s) var(--highlight-timing, ease) forwards;
  animation-delay: var(--highlight-delay, 0s);
}

.highlight-instant {
  background-size: 100% 100%;
  animation: none;
}

/* Gradient Effect */
.effect-gradient {
  background-image: var(--gradient, linear-gradient(to right, #6366f1, #8b5cf6));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-size: 200% auto;
  animation: gradientAnimation var(--gradient-duration, 3s) linear infinite;
}

@keyframes gradientAnimation {
  0% { background-position: 0% center; }
  50% { background-position: 100% center; }
  100% { background-position: 0% center; }
}

/* Shadow Effect */
.effect-shadow {
  text-shadow: var(--shadow, 2px 2px 4px rgba(0, 0, 0, 0.5));
  animation: shadowPulse var(--shadow-duration, 2s) ease-in-out infinite;
}

@keyframes shadowPulse {
  0% { text-shadow: var(--shadow, 2px 2px 4px rgba(0, 0, 0, 0.5)); }
  50% { text-shadow: var(--shadow-pulse, 3px 3px 6px rgba(0, 0, 0, 0.7)); }
  100% { text-shadow: var(--shadow, 2px 2px 4px rgba(0, 0, 0, 0.5)); }
}

/* Glitch Effect */
@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-3px, 3px);
  }
  40% {
    transform: translate(-3px, -3px);
  }
  60% {
    transform: translate(3px, 3px);
  }
  80% {
    transform: translate(3px, -3px);
  }
  100% {
    transform: translate(0);
  }
}

.effect-glitch {
  position: relative;
  animation: glitch var(--glitch-duration, 0.5s) ease-in-out infinite;
}

.effect-glitch::before,
.effect-glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.effect-glitch::before {
  left: 2px;
  color: var(--glitch-color-1, #ff00ff);
  clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%, 0 66%, 100% 66%, 100% 100%, 0 100%);
  animation: glitch var(--glitch-duration, 0.5s) ease-in-out infinite;
  animation-delay: 0.1s;
}

.effect-glitch::after {
  left: -2px;
  color: var(--glitch-color-2, #00ffff);
  clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%, 0 66%, 100% 66%, 100% 100%, 0 100%);
  animation: glitch var(--glitch-duration, 0.5s) ease-in-out infinite;
  animation-delay: 0.2s;
}

/* Blur Reveal Effect */
@keyframes blurReveal {
  0% { filter: blur(10px); opacity: 0; }
  100% { filter: blur(0); opacity: 1; }
}

.effect-blur-reveal {
  filter: blur(10px);
  opacity: 0;
  animation: blurReveal var(--blur-duration, 2s) forwards;
  animation-delay: var(--blur-delay, 0s);
}

.blur-reveal-instant {
  filter: blur(0);
  opacity: 1;
  animation: none;
}

/* Text Reveal Effect */
@keyframes textReveal {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}

.effect-text-reveal {
  clip-path: inset(0 100% 0 0);
  animation: textReveal var(--reveal-duration, 2s) var(--reveal-timing, cubic-bezier(0.77, 0, 0.18, 1)) forwards;
  animation-delay: var(--reveal-delay, 0s);
}

.text-reveal-instant {
  clip-path: inset(0 0 0 0);
  animation: none;
}
`;

// Typography Preview Component
const TypographyPreview = ({
  text,
  settings,
  isPlaying,
  theme,
  charByCharRef,
  wordByWordRef,
}) => {
  const [visibleChars, setVisibleChars] = useState(0);
  const [visibleWords, setVisibleWords] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    if (!isPlaying || settings.effectType !== "typewriter") return;

    let interval;
    if (settings.typeMode === "char-by-char") {
      setVisibleChars(0);
      interval = setInterval(() => {
        setVisibleChars((prev) => {
          if (prev >= text.length) {
            clearInterval(interval);
            return text.length;
          }
          return prev + 1;
        });
      }, settings.speed);
    } else if (settings.typeMode === "word-by-word") {
      setVisibleWords(0);
      interval = setInterval(() => {
        setVisibleWords((prev) => {
          if (prev >= words.length) {
            clearInterval(interval);
            return words.length;
          }
          return prev + 1;
        });
      }, settings.speed * 5);
    }

    return () => clearInterval(interval);
  }, [
    isPlaying,
    settings.typeMode,
    settings.speed,
    text,
    words.length,
    settings.effectType,
  ]);

  // Style variables based on effect type
  const getStyleVariables = () => {
    const baseStyle = {
      "--typing-duration": `${(settings.speed / 100) * 5}s`,
      "--typing-steps": `steps(${text.length}, end)`,
      "--blink-duration": "0.75s",
      "--blink-iteration": settings.cursorBlink ? "infinite" : "0",
    };

    switch (settings.effectType) {
      case "typewriter":
        return baseStyle;
      case "fade-in":
        return {
          "--fade-duration": `${settings.speed / 30}s`,
          "--fade-delay": `${settings.delay / 1000}s`,
          "--fade-timing": settings.timingFunction || "ease",
        };
      case "highlight":
        return {
          "--highlight-duration": `${settings.speed / 30}s`,
          "--highlight-delay": `${settings.delay / 1000}s`,
          "--highlight-timing": settings.timingFunction || "ease",
          "--highlight-height": `${settings.highlightHeight || 6}px`,
          "--highlight-color": settings.highlightColor || "#ffde59",
        };
      case "gradient":
        return {
          "--gradient":
            settings.gradient || "linear-gradient(to right, #6366f1, #8b5cf6)",
          "--gradient-duration": `${settings.speed * 0.1}s`,
        };
      case "shadow":
        return {
          "--shadow": settings.shadow || "2px 2px 4px rgba(0, 0, 0, 0.5)",
          "--shadow-pulse":
            settings.shadowPulse || "3px 3px 6px rgba(0, 0, 0, 0.7)",
          "--shadow-duration": `${settings.speed * 0.05}s`,
        };
      case "glitch":
        return {
          "--glitch-duration": `${settings.speed * 0.01}s`,
          "--glitch-color-1": settings.glitchColor1 || "#ff00ff",
          "--glitch-color-2": settings.glitchColor2 || "#00ffff",
        };
      case "blur-reveal":
        return {
          "--blur-duration": `${settings.speed / 30}s`,
          "--blur-delay": `${settings.delay / 1000}s`,
        };
      case "text-reveal":
        return {
          "--reveal-duration": `${settings.speed / 30}s`,
          "--reveal-delay": `${settings.delay / 1000}s`,
          "--reveal-timing":
            settings.timingFunction || "cubic-bezier(0.77, 0, 0.18, 1)",
        };
      default:
        return {};
    }
  };

  const getBaseClasses = () => {
    return `${settings.fontFamily} ${settings.fontSize} ${settings.fontWeight} ${settings.fontStyle} ${settings.textColor}`;
  };

  // For typewriter effect
  if (settings.effectType === "typewriter") {
    if (settings.typeMode === "css-animation") {
      return (
        <div className="typewriter-container">
          <div
            className={`effect-typewriter ${getBaseClasses()} ${settings.cursorStyle} ${!isPlaying ? "typewriter-instant" : ""}`}
            style={getStyleVariables()}
          >
            {text || "Type something..."}
          </div>
        </div>
      );
    } else if (settings.typeMode === "char-by-char") {
      return (
        <div
          className={`typewriter-container char-by-char ${getBaseClasses()}`}
          ref={charByCharRef}
        >
          {text.split("").map((char, i) => (
            <span
              key={i}
              className={`typewriter-char ${i < visibleChars ? "visible" : ""}`}
            >
              {char}
            </span>
          ))}
          {settings.cursorStyle && (
            <span
              className={`${settings.cursorStyle} ${settings.cursorBlink ? "cursor-blink" : ""}`}
            ></span>
          )}
        </div>
      );
    } else {
      return (
        <div
          className={`typewriter-container type-mode-word ${getBaseClasses()}`}
          ref={wordByWordRef}
        >
          {words.map((word, i) => (
            <span key={i}>
              <span
                className={`typewriter-word ${i < visibleWords ? "visible" : ""}`}
              >
                {word}
              </span>
              {i < words.length - 1 && " "}
            </span>
          ))}
          {settings.cursorStyle && (
            <span
              className={`${settings.cursorStyle} ${settings.cursorBlink ? "cursor-blink" : ""}`}
            ></span>
          )}
        </div>
      );
    }
  }

  // For other effect types
  const effectClass = `effect-${settings.effectType}`;
  const instantClass = !isPlaying ? `${settings.effectType}-instant` : "";

  // Special handling for glitch effect which needs data attribute
  if (settings.effectType === "glitch") {
    return (
      <div
        className={`typography-effect ${effectClass} ${getBaseClasses()}`}
        style={getStyleVariables()}
        data-text={text || "Glitch Text"}
      >
        {text || "Glitch Text"}
      </div>
    );
  }

  return (
    <div
      className={`typography-effect ${effectClass} ${instantClass} ${getBaseClasses()}`}
      style={getStyleVariables()}
    >
      {text || "Typography Effect"}
    </div>
  );
};

// Component to display code
const CodeDisplay = ({ code, theme, onCopy, onDownload }) => {
  return (
    <div className="code-container relative rounded-lg overflow-hidden">
      <pre
        className={`p-4 overflow-auto max-h-72 text-sm font-mono
        ${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-800"}`}
      >
        <code className="relative">
          {code.split("\n").map((line, i) => (
            <div key={i} className="table-row">
              <span
                className={`table-cell pr-4 text-right select-none opacity-50 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
              >
                {i + 1}
              </span>
              <span className="table-cell">{line}</span>
            </div>
          ))}
        </code>
      </pre>
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={onDownload}
          className="p-1.5 rounded-md 
            text-gray-400 hover:text-gray-100
            transition-colors duration-200
            bg-opacity-80 bg-gray-800 hover:bg-gray-700"
          title="Download code"
          aria-label="Download code"
        >
          <Download size={16} />
        </button>
        <button
          onClick={onCopy}
          className="p-1.5 rounded-md 
            text-gray-400 hover:text-gray-100
            transition-colors duration-200
            bg-opacity-80 bg-gray-800 hover:bg-gray-700"
          title="Copy to clipboard"
          aria-label="Copy code to clipboard"
        >
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
};

// Thumbnail component
const Thumbnail = ({ settings, theme, text }) => {
  const getBaseClasses = () => {
    return `${settings.fontFamily} ${settings.fontSize} ${settings.fontWeight} ${settings.fontStyle} ${settings.textColor}`;
  };

  const getEffectClasses = () => {
    switch (settings.effectType) {
      case "typewriter":
        return `effect-typewriter ${settings.cursorStyle}`;
      case "fade-in":
        return "effect-fade-in";
      case "highlight":
        return "effect-highlight";
      case "gradient":
        return "effect-gradient";
      case "shadow":
        return "effect-shadow";
      case "glitch":
        return "effect-glitch";
      case "blur-reveal":
        return "effect-blur-reveal";
      case "text-reveal":
        return "effect-text-reveal";
      default:
        return "";
    }
  };

  const getStyleVariables = () => {
    const baseStyle = {};
    switch (settings.effectType) {
      case "typewriter":
        return {
          ...baseStyle,
          "--typing-duration": "3.5s",
          "--typing-steps": "steps(40, end)",
          "--blink-duration": "0.75s",
        };
      case "highlight":
        return {
          "--highlight-color": settings.highlightColor || "#ffde59",
          "--highlight-height": `${settings.highlightHeight || 6}px`,
        };
      case "gradient":
        return {
          "--gradient":
            settings.gradient || "linear-gradient(to right, #6366f1, #8b5cf6)",
        };
      case "shadow":
        return {
          "--shadow": settings.shadow || "2px 2px 4px rgba(0, 0, 0, 0.5)",
          "--shadow-pulse":
            settings.shadowPulse || "3px 3px 6px rgba(0, 0, 0, 0.7)",
        };
      case "glitch":
        return {
          "--glitch-color-1": settings.glitchColor1 || "#ff00ff",
          "--glitch-color-2": settings.glitchColor2 || "#00ffff",
        };
      default:
        return {};
    }
  };

  const effectClass = getEffectClasses();
  const effectStyle = getStyleVariables();

  if (settings.effectType === "glitch") {
    return (
      <div
        className={`h-full w-full flex items-center justify-center rounded transition-all ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
      >
        <div
          data-text={text || "Typography Effect"}
          className={`${getBaseClasses()} ${effectClass} overflow-hidden`}
          style={effectStyle}
        >
          {text || "Typography Effect"}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full w-full flex items-center justify-center rounded transition-all ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
    >
      <div
        className={`${getBaseClasses()} ${effectClass} overflow-hidden`}
        style={effectStyle}
      >
        {text || "Typography Effect"}
      </div>
    </div>
  );
};

// Preset component
const TypographyPreset = ({ preset, onApply, theme }) => {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        theme === "dark"
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-white hover:bg-gray-50"
      } shadow`}
      onClick={() => onApply(preset.settings)}
    >
      <div className="h-16 mb-2 overflow-hidden rounded">
        <Thumbnail
          settings={preset.settings}
          theme={theme}
          text={preset.sample}
        />
      </div>
      <h3
        className={`text-sm font-medium ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {preset.name}
      </h3>
      <p
        className={`text-xs mt-1 ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {preset.description}
      </p>
    </div>
  );
};

// Main Typography Library Component
const TypographyLibrary = ({ theme = "light" }) => {
  const [activeEffectIndex, setActiveEffectIndex] = useState(0);
  const [typographyEffects, setTypographyEffects] = useState([
    {
      name: "Default Effect",
      text: "ToolMatic is a collection of essential tools designed for developers, engineers, and students.",
      settings: {
        effectType: "typewriter", // Default to typewriter for compatibility
        fontFamily: "font-mono",
        fontSize: "text-lg",
        fontWeight: "font-normal",
        fontStyle: "",
        textColor: theme === "dark" ? "text-blue-400" : "text-blue-600",
        cursorStyle: "border-r-2 border-current",
        cursorBlink: true,
        typeMode: "css-animation",
        speed: 50,
        delay: 0,
        loop: false,
        loopDelay: 2,
        deleteBeforeLoop: true,
        timingFunction: "ease",
        highlightColor: "#ffde59",
        highlightHeight: 6,
        gradient: "linear-gradient(to right, #6366f1, #8b5cf6)",
        shadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        shadowPulse: "3px 3px 6px rgba(0, 0, 0, 0.7)",
        glitchColor1: "#ff00ff",
        glitchColor2: "#00ffff",
      },
    },
  ]);

  const [isPlaying, setIsPlaying] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [view, setView] = useState("editor");
  const [activeTab, setActiveTab] = useState("style");
  const [isCreatingNewEffect, setIsCreatingNewEffect] = useState(false);
  const [newEffectName, setNewEffectName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const charByCharRef = useRef(null);
  const wordByWordRef = useRef(null);

  const currentEffect = typographyEffects[activeEffectIndex];

  // Extended presets for all effect types
  const presets = [
    // Typewriter presets
    {
      name: "Classic Terminal",
      description: "Green text on black, monospace font",
      settings: {
        ...currentEffect.settings,
        effectType: "typewriter",
        fontFamily: "font-mono",
        fontSize: "text-lg",
        fontWeight: "font-normal",
        textColor: "text-green-500",
        cursorStyle: "border-r-2 border-green-500",
        typeMode: "css-animation",
        speed: 30,
      },
      sample: "C:> Accessing mainframe...",
    },
    {
      name: "Elegant Script",
      description: "Cursive with slow typing and block cursor",
      settings: {
        ...currentEffect.settings,
        effectType: "typewriter",
        fontFamily: "font-['Garamond',_serif]",
        fontSize: "text-xl",
        fontWeight: "font-light",
        fontStyle: "italic",
        textColor: theme === "dark" ? "text-purple-400" : "text-purple-700",
        cursorStyle: "after:content-['▋'] after:ml-1 after:animate-pulse",
        typeMode: "char-by-char",
        speed: 80,
      },
      sample: "Once upon a time...",
    },
    // Fade-in presets
    {
      name: "Subtle Fade",
      description: "Gentle fade-in animation",
      settings: {
        ...currentEffect.settings,
        effectType: "fade-in",
        fontFamily: "font-sans",
        fontSize: "text-xl",
        fontWeight: "font-normal",
        textColor: theme === "dark" ? "text-blue-400" : "text-blue-600",
        speed: 60,
        delay: 200,
        timingFunction: "ease",
      },
      sample: "Fading into view...",
    },
    // Highlight presets
    {
      name: "Yellow Marker",
      description: "Text with yellow highlight effect",
      settings: {
        ...currentEffect.settings,
        effectType: "highlight",
        fontFamily: "font-serif",
        fontSize: "text-xl",
        fontWeight: "font-medium",
        textColor: theme === "dark" ? "text-gray-200" : "text-gray-800",
        speed: 50,
        highlightColor: "#ffde59",
        highlightHeight: 8,
      },
      sample: "Important information",
    },
    // Gradient presets
    {
      name: "Purple Haze",
      description: "Purple-blue gradient text effect",
      settings: {
        ...currentEffect.settings,
        effectType: "gradient",
        fontFamily: "font-sans",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        gradient: "linear-gradient(to right, #6366f1, #8b5cf6)",
        speed: 30,
      },
      sample: "Gradient Text",
    },
    {
      name: "Sunset",
      description: "Red-orange-yellow gradient",
      settings: {
        ...currentEffect.settings,
        effectType: "gradient",
        fontFamily: "font-sans",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        gradient: "linear-gradient(to right, #ef4444, #f59e0b, #eab308)",
        speed: 40,
      },
      sample: "Vibrant Colors",
    },
    // Shadow presets
    {
      name: "Deep Shadow",
      description: "Text with pronounced shadow effect",
      settings: {
        ...currentEffect.settings,
        effectType: "shadow",
        fontFamily: "font-serif",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        textColor: theme === "dark" ? "text-gray-200" : "text-gray-800",
        shadow: "3px 3px 5px rgba(0, 0, 0, 0.6)",
        shadowPulse: "4px 4px 8px rgba(0, 0, 0, 0.8)",
        speed: 40,
      },
      sample: "Deep Shadow",
    },
    // Glitch presets
    {
      name: "Cyberpunk Glitch",
      description: "Digital distortion effect",
      settings: {
        ...currentEffect.settings,
        effectType: "glitch",
        fontFamily: "font-mono",
        fontSize: "text-xl",
        fontWeight: "font-bold",
        textColor: "text-white",
        glitchColor1: "#ff00ff",
        glitchColor2: "#00ffff",
        speed: 20,
      },
      sample: "SYSTEM ERROR",
    },
    // Blur reveal presets
    {
      name: "Focus In",
      description: "Text becomes clear from blur",
      settings: {
        ...currentEffect.settings,
        effectType: "blur-reveal",
        fontFamily: "font-sans",
        fontSize: "text-xl",
        fontWeight: "font-medium",
        textColor: theme === "dark" ? "text-cyan-400" : "text-cyan-600",
        speed: 70,
        delay: 300,
      },
      sample: "Coming into focus",
    },
    // Text reveal presets
    {
      name: "Slide Reveal",
      description: "Text revealed with slide effect",
      settings: {
        ...currentEffect.settings,
        effectType: "text-reveal",
        fontFamily: "font-sans",
        fontSize: "text-xl",
        fontWeight: "font-medium",
        textColor: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
        speed: 60,
        timingFunction: "cubic-bezier(0.77, 0, 0.18, 1)",
      },
      sample: "Revealed Content",
    },
  ];

  // Functions
  // Functions
  const handleSettingsChange = (key, value) => {
    setTypographyEffects((prev) => {
      const updated = [...prev];
      updated[activeEffectIndex] = {
        ...updated[activeEffectIndex],
        settings: {
          ...updated[activeEffectIndex].settings,
          [key]: value,
        },
      };
      return updated;
    });
  };

  const handleTextChange = (text) => {
    setTypographyEffects((prev) => {
      const updated = [...prev];
      updated[activeEffectIndex] = {
        ...updated[activeEffectIndex],
        text,
      };
      return updated;
    });
  };

  const handleCreateNewEffect = () => {
    if (!newEffectName.trim()) return;

    setTypographyEffects((prev) => [
      ...prev,
      {
        name: newEffectName,
        text: "Your new typography effect",
        settings: { ...currentEffect.settings },
      },
    ]);
    setActiveEffectIndex(typographyEffects.length);
    setNewEffectName("");
    setIsCreatingNewEffect(false);
  };

  const handleDeleteEffect = (index) => {
    if (typographyEffects.length <= 1) return;

    setTypographyEffects((prev) => prev.filter((_, i) => i !== index));
    setActiveEffectIndex((prev) =>
      prev >= index ? Math.max(0, prev - 1) : prev
    );
  };

  const handleRenameEffect = (index, newName) => {
    setTypographyEffects((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        name: newName,
      };
      return updated;
    });
  };

  const handleDuplicateEffect = (index) => {
    const effectToDuplicate = typographyEffects[index];
    setTypographyEffects((prev) => [
      ...prev,
      {
        name: `${effectToDuplicate.name} (Copy)`,
        text: effectToDuplicate.text,
        settings: { ...effectToDuplicate.settings },
      },
    ]);
    setActiveEffectIndex(typographyEffects.length);
  };

  const handleApplyPreset = (presetSettings) => {
    setTypographyEffects((prev) => {
      const updated = [...prev];
      updated[activeEffectIndex] = {
        ...updated[activeEffectIndex],
        settings: {
          ...updated[activeEffectIndex].settings,
          ...presetSettings,
        },
      };
      return updated;
    });
  };

  const generateCssCode = () => {
    const { settings } = currentEffect;
    let cssCode = styleSheet;

    // Add specific customizations based on current settings
    if (settings.effectType === "typewriter") {
      cssCode += `\n/* Custom Typewriter Settings */
.custom-typewriter {
  --typing-duration: ${(settings.speed / 100) * 5}s;
  --typing-steps: steps(${currentEffect.text.length}, end);
  --blink-duration: 0.75s;
  --blink-iteration: ${settings.cursorBlink ? "infinite" : "0"};
}`;
    } else if (settings.effectType === "highlight") {
      cssCode += `\n/* Custom Highlight Settings */
.custom-highlight {
  --highlight-duration: ${settings.speed / 30}s;
  --highlight-delay: ${settings.delay / 1000}s;
  --highlight-timing: ${settings.timingFunction || "ease"};
  --highlight-height: ${settings.highlightHeight || 6}px;
  --highlight-color: ${settings.highlightColor || "#ffde59"};
}`;
    }

    return cssCode;
  };

  const generateHtmlCode = () => {
    const { settings } = currentEffect;
    const text = currentEffect.text || "Typography Effect";

    // Base element with classes based on effect type
    let htmlCode = "";

    if (settings.effectType === "typewriter") {
      if (settings.typeMode === "css-animation") {
        htmlCode = `<div class="typewriter-container">
  <div class="effect-typewriter custom-typewriter ${settings.fontFamily} ${settings.fontSize} ${settings.fontWeight} ${settings.fontStyle} ${settings.textColor} ${settings.cursorStyle}">
    ${text}
  </div>
</div>`;
      } else if (settings.typeMode === "char-by-char") {
        const chars = text
          .split("")
          .map((char, i) => `<span class="typewriter-char">${char}</span>`)
          .join("");

        htmlCode = `<div class="typewriter-container char-by-char ${settings.fontFamily} ${settings.fontSize} ${settings.fontWeight} ${settings.fontStyle} ${settings.textColor}">
  ${chars}
  ${settings.cursorStyle ? `<span class="${settings.cursorStyle} ${settings.cursorBlink ? "cursor-blink" : ""}"></span>` : ""}
</div>

<script>
  // JavaScript to animate char-by-char
  const chars = document.querySelectorAll('.typewriter-char');
  let i = 0;
  const interval = setInterval(() => {
    if (i < chars.length) {
      chars[i].classList.add('visible');
      i++;
    } else {
      clearInterval(interval);
    }
  }, ${settings.speed});
</script>`;
      } else {
        // word-by-word
        const words = text
          .split(" ")
          .map(
            (word, i) =>
              `<span><span class="typewriter-word">${word}</span>${i < text.split(" ").length - 1 ? " " : ""}</span>`
          )
          .join("");

        htmlCode = `<div class="typewriter-container type-mode-word ${settings.fontFamily} ${settings.fontSize} ${settings.fontWeight} ${settings.fontStyle} ${settings.textColor}">
  ${words}
  ${settings.cursorStyle ? `<span class="${settings.cursorStyle} ${settings.cursorBlink ? "cursor-blink" : ""}"></span>` : ""}
</div>

<script>
  // JavaScript to animate word-by-word
  const words = document.querySelectorAll('.typewriter-word');
  let i = 0;
  const interval = setInterval(() => {
    if (i < words.length) {
      words[i].classList.add('visible');
      i++;
    } else {
      clearInterval(interval);
    }
  }, ${settings.speed * 5});
</script>`;
      }
    } else if (settings.effectType === "glitch") {
      htmlCode = `<div 
  class="typography-effect effect-glitch ${settings.fontFamily} ${settings.fontSize} ${settings.fontWeight} ${settings.fontStyle} ${settings.textColor}"
  data-text="${text}"
  style="--glitch-duration: ${settings.speed * 0.01}s; --glitch-color-1: ${settings.glitchColor1 || "#ff00ff"}; --glitch-color-2: ${settings.glitchColor2 || "#00ffff"}">
  ${text}
</div>`;
    } else {
      // For all other effects (fade-in, highlight, gradient, shadow, blur-reveal, text-reveal)
      const effectClass = `effect-${settings.effectType}`;
      const styleVars = [];

      switch (settings.effectType) {
        case "fade-in":
          styleVars.push(`--fade-duration: ${settings.speed / 30}s`);
          styleVars.push(`--fade-delay: ${settings.delay / 1000}s`);
          styleVars.push(`--fade-timing: ${settings.timingFunction || "ease"}`);
          break;
        case "highlight":
          styleVars.push(`--highlight-duration: ${settings.speed / 30}s`);
          styleVars.push(`--highlight-delay: ${settings.delay / 1000}s`);
          styleVars.push(
            `--highlight-timing: ${settings.timingFunction || "ease"}`
          );
          styleVars.push(
            `--highlight-height: ${settings.highlightHeight || 6}px`
          );
          styleVars.push(
            `--highlight-color: ${settings.highlightColor || "#ffde59"}`
          );
          break;
        case "gradient":
          styleVars.push(
            `--gradient: ${settings.gradient || "linear-gradient(to right, #6366f1, #8b5cf6)"}`
          );
          styleVars.push(`--gradient-duration: ${settings.speed * 0.1}s`);
          break;
        case "shadow":
          styleVars.push(
            `--shadow: ${settings.shadow || "2px 2px 4px rgba(0, 0, 0, 0.5)"}`
          );
          styleVars.push(
            `--shadow-pulse: ${settings.shadowPulse || "3px 3px 6px rgba(0, 0, 0, 0.7)"}`
          );
          styleVars.push(`--shadow-duration: ${settings.speed * 0.05}s`);
          break;
        case "blur-reveal":
          styleVars.push(`--blur-duration: ${settings.speed / 30}s`);
          styleVars.push(`--blur-delay: ${settings.delay / 1000}s`);
          break;
        case "text-reveal":
          styleVars.push(`--reveal-duration: ${settings.speed / 30}s`);
          styleVars.push(`--reveal-delay: ${settings.delay / 1000}s`);
          styleVars.push(
            `--reveal-timing: ${settings.timingFunction || "cubic-bezier(0.77, 0, 0.18, 1)"}`
          );
          break;
      }

      const styleString =
        styleVars.length > 0 ? ` style="${styleVars.join("; ")}"` : "";

      htmlCode = `<div 
  class="typography-effect ${effectClass} ${settings.fontFamily} ${settings.fontSize} ${settings.fontWeight} ${settings.fontStyle} ${settings.textColor}"${styleString}>
  ${text}
</div>`;
    }

    return htmlCode;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(
      generateCssCode() + "\n\n" + generateHtmlCode()
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadCode = () => {
    const cssCode = generateCssCode();
    const htmlCode = generateHtmlCode();
    const fullCode = `/* Typography Effect CSS */
${cssCode}

/* HTML Implementation */
${htmlCode}`;

    const blob = new Blob([fullCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `typography-effect-${currentEffect.name.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate CSS code
  const htmlCode = generateHtmlCode();
  const cssCode = generateCssCode();
  const combinedCode = `/* Typography Effect CSS */
${cssCode}

/* HTML Implementation */
${htmlCode}`;

  // Filter effects based on search query
  const filteredPresets = presets.filter(
    (preset) =>
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.settings.effectType
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`typography-library mt-16 ${theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"} p-4 rounded-lg shadow-lg`}
    >
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Type
            size={20}
            className={theme === "dark" ? "text-blue-400" : "text-blue-600"}
          />
          Typography Effects Library
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setView(view === "editor" ? "library" : "editor")}
            className={`p-2 rounded-md flex items-center gap-1 text-sm ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {view === "editor" ? (
              <>
                <Globe size={16} />
                <span className="hidden sm:inline">Browse Library</span>
              </>
            ) : (
              <>
                <Edit3 size={16} />
                <span className="hidden sm:inline">Editor</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-md flex items-center gap-1 text-sm ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={16} />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main View Switcher */}
      {view === "editor" ? (
        <>
          {/* Effect Selection */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <select
                value={activeEffectIndex}
                onChange={(e) => setActiveEffectIndex(parseInt(e.target.value))}
                className={`p-2 rounded-md text-sm ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300 border-gray-700"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                } border`}
              >
                {typographyEffects.map((effect, index) => (
                  <option key={index} value={index}>
                    {effect.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-1">
                <button
                  onClick={() => handleDuplicateEffect(activeEffectIndex)}
                  title="Duplicate effect"
                  className={`p-1 rounded ${
                    theme === "dark"
                      ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                      : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Copy size={16} />
                </button>

                <button
                  onClick={() => handleDeleteEffect(activeEffectIndex)}
                  title="Delete effect"
                  disabled={typographyEffects.length <= 1}
                  className={`p-1 rounded ${
                    typographyEffects.length <= 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  } ${
                    theme === "dark"
                      ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                      : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {isCreatingNewEffect ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newEffectName}
                  onChange={(e) => setNewEffectName(e.target.value)}
                  placeholder="Effect name"
                  className={`p-2 text-sm rounded-md ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-300 border-gray-700"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  } border`}
                />
                <button
                  onClick={handleCreateNewEffect}
                  className={`p-2 rounded-md text-sm ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => setIsCreatingNewEffect(false)}
                  className={`p-2 rounded-md text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingNewEffect(true)}
                className={`p-2 rounded-md flex items-center gap-1 text-sm ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <Plus size={16} />
                <span>New Effect</span>
              </button>
            )}
          </div>

          {/* Preview Area */}
          <div
            className={`rounded-lg flex items-center justify-center p-8 mb-4 min-h-[120px] transition-colors ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <TypographyPreview
              text={currentEffect.text}
              settings={currentEffect.settings}
              isPlaying={isPlaying}
              theme={theme}
              charByCharRef={charByCharRef}
              wordByWordRef={wordByWordRef}
            />
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <label
              htmlFor="typography-text"
              className={`block mb-2 text-sm font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Text Content
            </label>
            <textarea
              id="typography-text"
              value={currentEffect.text}
              onChange={(e) => handleTextChange(e.target.value)}
              rows={2}
              className={`w-full p-2 rounded-md text-sm ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-300 border-gray-700"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              } border`}
              placeholder="Enter your text here..."
            />
          </div>

          {/* Tabs */}
          <div className="border-b mb-4 flex space-x-4">
            <button
              onClick={() => setActiveTab("style")}
              className={`py-2 px-3 text-sm font-medium ${
                activeTab === "style"
                  ? theme === "dark"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-blue-600 border-b-2 border-blue-600"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-1">
                <Wand2 size={16} />
                <span>Style</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-2 px-3 text-sm font-medium ${
                activeTab === "settings"
                  ? theme === "dark"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-blue-600 border-b-2 border-blue-600"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-1">
                <Sliders size={16} />
                <span>Options</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`py-2 px-3 text-sm font-medium ${
                activeTab === "code"
                  ? theme === "dark"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-blue-600 border-b-2 border-blue-600"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-1">
                <FileText size={16} />
                <span>Code</span>
              </div>
            </button>
          </div>

          {/* Style Tab Content */}
          {activeTab === "style" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                {/* Effect Type */}
                <div className="mb-4">
                  <label
                    htmlFor="effect-type"
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Effect Type
                  </label>
                  <select
                    id="effect-type"
                    value={currentEffect.settings.effectType}
                    onChange={(e) =>
                      handleSettingsChange("effectType", e.target.value)
                    }
                    className={`w-full p-2 rounded-md text-sm ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300 border-gray-700"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    } border`}
                  >
                    {effectTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Family */}
                <div className="mb-4">
                  <label
                    htmlFor="font-family"
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Font Family
                  </label>
                  <select
                    id="font-family"
                    value={currentEffect.settings.fontFamily}
                    onChange={(e) =>
                      handleSettingsChange("fontFamily", e.target.value)
                    }
                    className={`w-full p-2 rounded-md text-sm ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300 border-gray-700"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    } border`}
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div className="mb-4">
                  <label
                    htmlFor="font-size"
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Font Size
                  </label>
                  <select
                    id="font-size"
                    value={currentEffect.settings.fontSize}
                    onChange={(e) =>
                      handleSettingsChange("fontSize", e.target.value)
                    }
                    className={`w-full p-2 rounded-md text-sm ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300 border-gray-700"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    } border`}
                  >
                    <option value="text-xs">Extra Small</option>
                    <option value="text-sm">Small</option>
                    <option value="text-base">Base</option>
                    <option value="text-lg">Large</option>
                    <option value="text-xl">Extra Large</option>
                    <option value="text-2xl">2XL</option>
                    <option value="text-3xl">3XL</option>
                    <option value="text-4xl">4XL</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Font Weight */}
                <div className="mb-4">
                  <label
                    htmlFor="font-weight"
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Font Weight
                  </label>
                  <select
                    id="font-weight"
                    value={currentEffect.settings.fontWeight}
                    onChange={(e) =>
                      handleSettingsChange("fontWeight", e.target.value)
                    }
                    className={`w-full p-2 rounded-md text-sm ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300 border-gray-700"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    } border`}
                  >
                    <option value="font-thin">Thin</option>
                    <option value="font-light">Light</option>
                    <option value="font-normal">Normal</option>
                    <option value="font-medium">Medium</option>
                    <option value="font-semibold">Semibold</option>
                    <option value="font-bold">Bold</option>
                    <option value="font-extrabold">Extra Bold</option>
                  </select>
                </div>

                {/* Font Style */}
                <div className="mb-4">
                  <label
                    htmlFor="font-style"
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Font Style
                  </label>
                  <select
                    id="font-style"
                    value={currentEffect.settings.fontStyle}
                    onChange={(e) =>
                      handleSettingsChange("fontStyle", e.target.value)
                    }
                    className={`w-full p-2 rounded-md text-sm ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300 border-gray-700"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    } border`}
                  >
                    <option value="">Normal</option>
                    <option value="italic">Italic</option>
                    <option value="underline">Underlined</option>
                    <option value="line-through">Strikethrough</option>
                  </select>
                </div>

                {/* Text Color */}
                <div className="mb-4">
                  <label
                    htmlFor="text-color"
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Text Color
                  </label>
                  <select
                    id="text-color"
                    value={currentEffect.settings.textColor}
                    onChange={(e) =>
                      handleSettingsChange("textColor", e.target.value)
                    }
                    className={`w-full p-2 rounded-md text-sm ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300 border-gray-700"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    } border`}
                  >
                    <option
                      value={theme === "dark" ? "text-white" : "text-black"}
                    >
                      Default
                    </option>
                    <option value="text-red-500">Red</option>
                    <option value="text-orange-500">Orange</option>
                    <option value="text-yellow-500">Yellow</option>
                    <option value="text-green-500">Green</option>
                    <option value="text-blue-500">Blue</option>
                    <option value="text-indigo-500">Indigo</option>
                    <option value="text-purple-500">Purple</option>
                    <option value="text-pink-500">Pink</option>
                    <option
                      value={
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }
                    >
                      Gray
                    </option>
                  </select>
                </div>
              </div>

              {/* Effect-specific controls */}
              <div className="col-span-1 md:col-span-2">
                {currentEffect.settings.effectType === "typewriter" && (
                  <>
                    <h3
                      className={`mb-3 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Typewriter Options
                    </h3>

                    {/* Type Mode */}
                    <div className="mb-4">
                      <label
                        htmlFor="type-mode"
                        className={`block mb-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Animation Type
                      </label>
                      <select
                        id="type-mode"
                        value={currentEffect.settings.typeMode}
                        onChange={(e) =>
                          handleSettingsChange("typeMode", e.target.value)
                        }
                        className={`w-full p-2 rounded-md text-sm ${
                          theme === "dark"
                            ? "bg-gray-800 text-gray-300 border-gray-700"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        } border`}
                      >
                        <option value="css-animation">CSS Animation</option>
                        <option value="char-by-char">
                          Character by Character
                        </option>
                        <option value="word-by-word">Word by Word</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="cursor-style"
                        className={`block mb-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Cursor Style
                      </label>
                      <select
                        id="cursor-style"
                        value={currentEffect.settings.cursorStyle}
                        onChange={(e) =>
                          handleSettingsChange("cursorStyle", e.target.value)
                        }
                        className={`w-full p-2 rounded-md text-sm ${
                          theme === "dark"
                            ? "bg-gray-800 text-gray-300 border-gray-700"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        } border`}
                      >
                        {cursorStyles.map((style) => (
                          <option key={style.value} value={style.value}>
                            {style.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label
                        className={`flex items-center space-x-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={currentEffect.settings.cursorBlink}
                          onChange={(e) =>
                            handleSettingsChange(
                              "cursorBlink",
                              e.target.checked
                            )
                          }
                          className="rounded text-blue-600"
                        />
                        <span>Blinking Cursor</span>
                      </label>
                    </div>
                  </>
                )}

                {currentEffect.settings.effectType === "highlight" && (
                  <>
                    <h3
                      className={`mb-3 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Highlight Options
                    </h3>

                    <div className="mb-4">
                      <label
                        htmlFor="highlight-color"
                        className={`block mb-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Highlight Color
                      </label>
                      <input
                        type="text"
                        id="highlight-color"
                        value={
                          currentEffect.settings.highlightColor || "#ffde59"
                        }
                        onChange={(e) =>
                          handleSettingsChange("highlightColor", e.target.value)
                        }
                        className={`w-full p-2 rounded-md text-sm ${
                          theme === "dark"
                            ? "bg-gray-800 text-gray-300 border-gray-700"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        } border`}
                        placeholder="#ffde59"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="highlight-height"
                        className={`block mb-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Highlight Height (px)
                      </label>
                      <input
                        type="number"
                        id="highlight-height"
                        value={currentEffect.settings.highlightHeight || 6}
                        onChange={(e) =>
                          handleSettingsChange(
                            "highlightHeight",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full p-2 rounded-md text-sm ${
                          theme === "dark"
                            ? "bg-gray-800 text-gray-300 border-gray-700"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        } border`}
                        min="1"
                        max="20"
                      />
                    </div>
                  </>
                )}

                {currentEffect.settings.effectType === "gradient" && (
                  <>
                    <h3
                      className={`mb-3 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Gradient Options
                    </h3>

                    <div className="mb-4">
                      <label
                        htmlFor="gradient"
                        className={`block mb-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Gradient CSS
                      </label>
                      <input
                        type="text"
                        id="gradient"
                        value={
                          currentEffect.settings.gradient ||
                          "linear-gradient(to right, #6366f1, #8b5cf6)"
                        }
                        onChange={(e) =>
                          handleSettingsChange("gradient", e.target.value)
                        }
                        className={`w-full p-2 rounded-md text-sm ${
                          theme === "dark"
                            ? "bg-gray-800 text-gray-300 border-gray-700"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        } border`}
                        placeholder="linear-gradient(to right, #6366f1, #8b5cf6)"
                      />
                    </div>
                  </>
                )}

                {currentEffect.settings.effectType === "shadow" && (
                  <>
                    <h3
                      className={`mb-3 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Shadow Options
                    </h3>

                    <div className="mb-4">
                      <label
                        htmlFor="shadow"
                        className={`block mb-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Shadow CSS
                      </label>
                      <input
                        type="text"
                        id="shadow"
                        value={
                          currentEffect.settings.shadow ||
                          "2px 2px 4px rgba(0, 0, 0, 0.5)"
                        }
                        onChange={(e) =>
                          handleSettingsChange("shadow", e.target.value)
                        }
                        className={`w-full p-2 rounded-md text-sm ${
                          theme === "dark"
                            ? "bg-gray-800 text-gray-300 border-gray-700"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        } border`}
                        placeholder="2px 2px 4px rgba(0, 0, 0, 0.5)"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="shadow-pulse"
                        className={`block mb-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Pulse Shadow CSS
                      </label>
                      <input
                        type="text"
                        id="shadow-pulse"
                        value={
                          currentEffect.settings.shadowPulse ||
                          "3px 3px 6px rgba(0, 0, 0, 0.7)"
                        }
                        onChange={(e) =>
                          handleSettingsChange("shadowPulse", e.target.value)
                        }
                        className={`w-full p-2 rounded-md text-sm ${
                          theme === "dark"
                            ? "bg-gray-800 text-gray-300 border-gray-700"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        } border`}
                        placeholder="3px 3px 6px rgba(0, 0, 0, 0.7)"
                      />
                    </div>
                  </>
                )}

                {currentEffect.settings.effectType === "glitch" && (
                  <>
                    <h3
                      className={`mb-3 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Glitch Options
                    </h3>

                    <div className="mb-4">
                      <label
                        htmlFor="glitch-color-1"
                        className={`block mb-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Glitch Color 1
                      </label>
                      <input
                        type="text"
                        id="glitch-color-1"
                        value={currentEffect.settings.glitchColor1 || "#ff00ff"}
                        onChange={(e) =>
                          handleSettingsChange("glitchColor1", e.target.value)
                        }
                        className={`w-full p-2 rounded-md text-sm ${
                          theme === "dark"
                            ? "bg-gray-800 text-gray-300 border-gray-700"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        } border`}
                        placeholder="#ff00ff"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="glitch-color-2"
                        className={`block mb-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Glitch Color 2
                      </label>
                      <input
                        type="text"
                        id="glitch-color-2"
                        value={currentEffect.settings.glitchColor2 || "#00ffff"}
                        onChange={(e) =>
                          handleSettingsChange("glitchColor2", e.target.value)
                        }
                        className={`w-full p-2 rounded-md text-sm ${
                          theme === "dark"
                            ? "bg-gray-800 text-gray-300 border-gray-700"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        } border`}
                        placeholder="#00ffff"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label
                    htmlFor="animation-speed"
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Animation Speed
                  </label>
                  <input
                    type="range"
                    id="animation-speed"
                    min="10"
                    max="100"
                    value={currentEffect.settings.speed}
                    onChange={(e) =>
                      handleSettingsChange("speed", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span
                      className={
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }
                    >
                      Slow
                    </span>
                    <span
                      className={
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }
                    >
                      Fast
                    </span>
                  </div>
                </div>

                {(currentEffect.settings.effectType === "fade-in" ||
                  currentEffect.settings.effectType === "highlight" ||
                  currentEffect.settings.effectType === "blur-reveal" ||
                  currentEffect.settings.effectType === "text-reveal") && (
                  <div className="mb-4">
                    <label
                      htmlFor="animation-delay"
                      className={`block mb-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Animation Delay (ms)
                    </label>
                    <input
                      type="range"
                      id="animation-delay"
                      min="0"
                      max="2000"
                      step="100"
                      value={currentEffect.settings.delay}
                      onChange={(e) =>
                        handleSettingsChange("delay", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }
                      >
                        0ms
                      </span>
                      <span
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }
                      >
                        2000ms
                      </span>
                    </div>
                  </div>
                )}

                {(currentEffect.settings.effectType === "fade-in" ||
                  currentEffect.settings.effectType === "highlight" ||
                  currentEffect.settings.effectType === "text-reveal") && (
                  <div className="mb-4">
                    <label
                      htmlFor="timing-function"
                      className={`block mb-2 text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Timing Function
                    </label>
                    <select
                      id="timing-function"
                      value={currentEffect.settings.timingFunction || "ease"}
                      onChange={(e) =>
                        handleSettingsChange("timingFunction", e.target.value)
                      }
                      className={`w-full p-2 rounded-md text-sm ${
                        theme === "dark"
                          ? "bg-gray-800 text-gray-300 border-gray-700"
                          : "bg-gray-100 text-gray-700 border-gray-300"
                      } border`}
                    >
                      <option value="ease">Ease</option>
                      <option value="ease-in">Ease In</option>
                      <option value="ease-out">Ease Out</option>
                      <option value="ease-in-out">Ease In Out</option>
                      <option value="linear">Linear</option>
                      <option value="cubic-bezier(0.77, 0, 0.18, 1)">
                        Custom Bezier
                      </option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-4">
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Advanced Options
                  </label>

                  <div className="space-y-2">
                    {currentEffect.settings.effectType === "typewriter" && (
                      <label
                        className={`flex items-center space-x-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={currentEffect.settings.loop}
                          onChange={(e) =>
                            handleSettingsChange("loop", e.target.checked)
                          }
                          className="rounded text-blue-600"
                        />
                        <span>Loop Animation</span>
                      </label>
                    )}

                    {currentEffect.settings.effectType === "typewriter" &&
                      currentEffect.settings.loop && (
                        <>
                          <label
                            className={`flex items-center space-x-2 text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={currentEffect.settings.deleteBeforeLoop}
                              onChange={(e) =>
                                handleSettingsChange(
                                  "deleteBeforeLoop",
                                  e.target.checked
                                )
                              }
                              className="rounded text-blue-600"
                            />
                            <span>Delete Before Loop</span>
                          </label>

                          <div className="pl-6">
                            <label
                              htmlFor="loop-delay"
                              className={`block mb-1 text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              Loop Delay (seconds)
                            </label>
                            <input
                              type="number"
                              id="loop-delay"
                              min="0"
                              max="10"
                              step="0.5"
                              value={currentEffect.settings.loopDelay}
                              onChange={(e) =>
                                handleSettingsChange(
                                  "loopDelay",
                                  parseFloat(e.target.value)
                                )
                              }
                              className={`w-24 p-1 rounded-md text-sm ${
                                theme === "dark"
                                  ? "bg-gray-800 text-gray-300 border-gray-700"
                                  : "bg-gray-100 text-gray-700 border-gray-300"
                              } border`}
                            />
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "code" && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h3
                  className={`font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Export Code
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyCode}
                    className={`p-2 rounded-md flex items-center gap-1 text-sm ${
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {copiedCode ? (
                      <>
                        <Check size={16} className="text-green-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadCode}
                    className={`p-2 rounded-md flex items-center gap-1 text-sm ${
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <CodeDisplay
                code={combinedCode}
                theme={theme}
                onCopy={handleCopyCode}
                onDownload={handleDownloadCode}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex mb-4">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className={`absolute left-3 top-2.5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search effects..."
                  className={`w-full pl-10 pr-4 py-2 rounded-md text-sm ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-300 border-gray-700"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  } border`}
                />
              </div>
              <button
                onClick={() => setSearchQuery("")}
                className={`ml-2 p-2 rounded-md flex items-center gap-1 text-sm ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <RefreshCw size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.map((preset, index) => (
                <TypographyPreset
                  key={index}
                  preset={preset}
                  onApply={handleApplyPreset}
                  theme={theme}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TypographyLibrary;
