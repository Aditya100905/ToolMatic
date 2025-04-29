import { useState, useEffect, useRef } from "react";
import { Copy, X, Check, Sliders, Search, Download, Play, Pause, Type, RefreshCw, Edit3, FileText, Globe, Plus, Trash2, Save, Move } from "lucide-react";

const fontOptions = [
  { name: "Monospace", value: "font-mono" },
  { name: "Sans-serif", value: "font-sans" },
  { name: "Serif", value: "font-serif" },
  { name: "Cursive", value: "font-['Comic_Sans_MS',_cursive]" },
  { name: "Fantasy", value: "font-['Papyrus',_fantasy]" },
  { name: "Terminal", value: "font-['Courier_New',_monospace]" },
  { name: "Elegant", value: "font-['Garamond',_serif]" },
  { name: "Playful", value: "font-['Trebuchet_MS',_sans-serif]" }
];

const cursorStyles = [
  { name: "Solid", value: "border-r-2 border-current" },
  { name: "Block", value: "after:content-['▋'] after:ml-1 after:animate-pulse" },
  { name: "Underscore", value: "border-b-2 border-current" },
  { name: "Blinking Bar", value: "border-r-2 border-current animate-pulse" },
  { name: "None", value: "" }
];

const styleSheet = `
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink {
  50% { border-color: transparent }
}

.typewriter {
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
`;

const TypewriterPreview = ({
  text,
  settings,
  isPlaying,
  theme,
  charByCharRef,
  wordByWordRef
}) => {
  const [visibleChars, setVisibleChars] = useState(0);
  const [visibleWords, setVisibleWords] = useState(0);
  const words = text.split(' ');
  
  useEffect(() => {
    if (!isPlaying) return;
    
    let interval;
    if (settings.typeMode === 'char-by-char') {
      setVisibleChars(0);
      interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= text.length) {
            clearInterval(interval);
            return text.length;
          }
          return prev + 1;
        });
      }, settings.speed);
    } else if (settings.typeMode === 'word-by-word') {
      setVisibleWords(0);
      interval = setInterval(() => {
        setVisibleWords(prev => {
          if (prev >= words.length) {
            clearInterval(interval);
            return words.length;
          }
          return prev + 1;
        });
      }, settings.speed * 5);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, settings.typeMode, settings.speed, text, words.length]);
  
  if (settings.typeMode === 'css-animation') {
    const typingDuration = (settings.speed / 100) * 5;
    const animationStyle = {
      '--typing-duration': `${typingDuration}s`,
      '--typing-steps': `steps(${text.length}, end)`,
      '--blink-duration': '0.75s',
      '--blink-iteration': settings.cursorBlink ? 'infinite' : '0'
    };
    
    return (
      <div className="typewriter-container">
        <div
          className={`typewriter ${settings.fontFamily} ${settings.fontSize} ${settings.fontWeight} ${settings.fontStyle} ${settings.cursorStyle} ${!isPlaying ? 'typewriter-instant' : ''} ${settings.textColor}`}
          style={animationStyle}
        >
          {text || 'Type something...'}
        </div>
      </div>
    );
  } else if (settings.typeMode === 'char-by-char') {
    return (
      <div className={`typewriter-container char-by-char ${settings.fontFamily} ${settings.fontSize} ${settings.fontWeight} ${settings.fontStyle} ${settings.textColor}`} ref={charByCharRef}>
        {text.split('').map((char, i) => (
          <span 
            key={i} 
            className={`typewriter-char ${i < visibleChars ? 'visible' : ''}`}
          >
            {char}
          </span>
        ))}
        {settings.cursorStyle && (
          <span className={`${settings.cursorStyle} ${settings.cursorBlink ? 'cursor-blink' : ''}`}></span>
        )}
      </div>
    );
  } else { // word-by-word
    return (
      <div className={`typewriter-container type-mode-word ${settings.fontFamily} ${settings.fontSize} ${settings.fontWeight} ${settings.fontStyle} ${settings.textColor}`} ref={wordByWordRef}>
        {words.map((word, i) => (
          <span key={i}>
            <span 
              className={`typewriter-word ${i < visibleWords ? 'visible' : ''}`}
            >
              {word}
            </span>
            {i < words.length - 1 && ' '}
          </span>
        ))}
        {settings.cursorStyle && (
          <span className={`${settings.cursorStyle} ${settings.cursorBlink ? 'cursor-blink' : ''}`}></span>
        )}
      </div>
    );
  }
};

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

const Thumbnail = ({ settings, theme, text }) => {
  return (
    <div 
      className={`h-full w-full flex items-center justify-center rounded transition-all ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
    >
      <div 
        className={`${settings.fontFamily} ${settings.fontSize} ${settings.fontWeight} ${settings.fontStyle} ${settings.cursorStyle} ${settings.textColor} overflow-hidden whitespace-nowrap border-r-2 border-current typewriter`}
        style={{
          '--typing-duration': '3.5s',
          '--typing-steps': 'steps(40, end)',
          '--blink-duration': '0.75s'
        }}
      >
        {text || 'Typewriter Effect'}
      </div>
    </div>
  );
};

const TypewriterPreset = ({ preset, onApply, theme }) => {
  return (
    <div 
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
      } shadow`}
      onClick={() => onApply(preset.settings)}
    >
      <div className="h-16 mb-2 overflow-hidden rounded">
        <Thumbnail settings={preset.settings} theme={theme} text={preset.sample} />
      </div>
      <h3 className={`text-sm font-medium ${
        theme === "dark" ? "text-gray-200" : "text-gray-800"
      }`}>
        {preset.name}
      </h3>
      <p className={`text-xs mt-1 ${
        theme === "dark" ? "text-gray-400" : "text-gray-500"
      }`}>
        {preset.description}
      </p>
    </div>
  );
};

const TypewriterLibrary = ({ theme = "light" }) => {
  const [activeEffectIndex, setActiveEffectIndex] = useState(0);
  const [typographyEffects, setTypographyEffects] = useState([
    {
      name: "Default Effect",
      text: "The quick brown fox jumps over the lazy dog.",
      settings: {
        fontFamily: "font-mono",
        fontSize: "text-lg",
        fontWeight: "font-normal",
        fontStyle: "",
        textColor: theme === "dark" ? "text-blue-400" : "text-blue-600",
        cursorStyle: "border-r-2 border-current",
        cursorBlink: true,
        typeMode: "css-animation",
        speed: 50,
        loop: false,
        loopDelay: 2,
        deleteBeforeLoop: true
      }
    }
  ]);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [view, setView] = useState("editor"); // "editor", "presets", "examples", "code", "effects"
  const [activeTab, setActiveTab] = useState("style"); // "style", "animation", "advanced"
  const [isCreatingNewEffect, setIsCreatingNewEffect] = useState(false);
  const [newEffectName, setNewEffectName] = useState("");
  const charByCharRef = useRef(null);
  const wordByWordRef = useRef(null);
  
  const currentEffect = typographyEffects[activeEffectIndex];

  const presets = [
    {
      name: "Classic Terminal",
      description: "Green text on black, monospace font",
      settings: {
        ...currentEffect.settings,
        fontFamily: "font-mono",
        fontSize: "text-lg",
        fontWeight: "font-normal",
        textColor: "text-green-500",
        cursorStyle: "border-r-2 border-green-500",
        typeMode: "css-animation",
        speed: 30
      },
      sample: "C:> Accessing mainframe..."
    },
    {
      name: "Elegant Script",
      description: "Cursive with slow typing and block cursor",
      settings: {
        ...currentEffect.settings,
        fontFamily: "font-['Garamond',_serif]",
        fontSize: "text-xl",
        fontWeight: "font-light",
        fontStyle: "italic",
        textColor: theme === "dark" ? "text-purple-400" : "text-purple-700",
        cursorStyle: "after:content-['▋'] after:ml-1 after:animate-pulse",
        typeMode: "char-by-char",
        speed: 80
      },
      sample: "Once upon a time..."
    },
    {
      name: "Modern Tech",
      description: "Clean sans-serif with word-by-word typing",
      settings: {
        ...currentEffect.settings,
        fontFamily: "font-sans",
        fontSize: "text-lg",
        fontWeight: "font-medium",
        textColor: theme === "dark" ? "text-blue-400" : "text-blue-600",
        cursorStyle: "border-b-2 border-current",
        typeMode: "word-by-word",
        speed: 40
      },
      sample: "Building the future of web experiences"
    },
    {
      name: "Newspaper Headline",
      description: "Bold serif font with fast typing",
      settings: {
        ...currentEffect.settings,
        fontFamily: "font-serif",
        fontSize: "text-2xl",
        fontWeight: "font-bold",
        textColor: theme === "dark" ? "text-gray-200" : "text-gray-800",
        cursorStyle: "",
        typeMode: "css-animation",
        speed: 70
      },
      sample: "BREAKING NEWS"
    },
    {
      name: "Retro Game Text",
      description: "Pixelated-style typing for game-like interfaces",
      settings: {
        ...currentEffect.settings,
        fontFamily: "font-mono",
        fontSize: "text-base",
        fontWeight: "font-bold",
        textColor: theme === "dark" ? "text-green-400" : "text-green-600",
        cursorStyle: "after:content-['▋'] after:ml-1",
        typeMode: "char-by-char",
        speed: 35,
        cursorBlink: true
      },
      sample: "PRESS START TO CONTINUE..."
    },
    {
      name: "Futuristic UI",
      description: "Clean, high-tech interface typing effect",
      settings: {
        ...currentEffect.settings,
        fontFamily: "font-sans",
        fontSize: "text-xl",
        fontWeight: "font-light",
        textColor: theme === "dark" ? "text-cyan-400" : "text-cyan-600",
        cursorStyle: "border-b-2 border-current",
        typeMode: "css-animation",
        speed: 60
      },
      sample: "Initializing system interface..."
    },
    {
      name: "Handwritten Note",
      description: "Natural-looking handwriting effect",
      settings: {
        ...currentEffect.settings,
        fontFamily: "font-['Comic_Sans_MS',_cursive]",
        fontSize: "text-lg",
        fontWeight: "font-normal",
        fontStyle: "italic",
        textColor: theme === "dark" ? "text-indigo-300" : "text-indigo-700",
        cursorStyle: "",
        typeMode: "word-by-word",
        speed: 25
      },
      sample: "Dear friend, I wanted to tell you..."
    },
    {
      name: "Code Editor",
      description: "Programming-style typing effect",
      settings: {
        ...currentEffect.settings,
        fontFamily: "font-mono",
        fontSize: "text-sm",
        fontWeight: "font-normal",
        textColor: theme === "dark" ? "text-green-400" : "text-green-700",
        cursorStyle: "border-r-2 border-current animate-pulse",
        typeMode: "char-by-char",
        speed: 20
      },
      sample: "function createTypingEffect() { ... }"
    }
  ];

  const generateCSSForEffect = (effect) => {
    let duration = (effect.settings.speed / 100) * 5;
    if (duration < 0.5) duration = 0.5;
    
    let css = `.typewriter-effect-${sanitizeName(effect.name)} {
  font-family: ${effect.settings.fontFamily.includes('font-mono') ? 'monospace' : 
                effect.settings.fontFamily.includes('font-sans') ? 'sans-serif' : 
                effect.settings.fontFamily.includes('font-serif') ? 'serif' : 
                effect.settings.fontFamily.includes('Comic_Sans_MS') ? "'Comic Sans MS', cursive" :
                effect.settings.fontFamily.includes('Papyrus') ? "'Papyrus', fantasy" :
                effect.settings.fontFamily.includes('Courier') ? "'Courier New', monospace" :
                effect.settings.fontFamily.includes('Garamond') ? "'Garamond', serif" :
                "'Trebuchet MS', sans-serif"};
  ${effect.settings.fontWeight.includes('font-bold') ? 'font-weight: bold;' : 
    effect.settings.fontWeight.includes('font-light') ? 'font-weight: 300;' : 
    effect.settings.fontWeight.includes('font-medium') ? 'font-weight: 500;' : 
    'font-weight: normal;'}
  ${effect.settings.fontStyle.includes('italic') ? 'font-style: italic;' : ''}
  ${effect.settings.fontSize.includes('text-xs') ? 'font-size: 0.75rem;' :
    effect.settings.fontSize.includes('text-sm') ? 'font-size: 0.875rem;' :
    effect.settings.fontSize.includes('text-base') ? 'font-size: 1rem;' :
    effect.settings.fontSize.includes('text-lg') ? 'font-size: 1.125rem;' :
    effect.settings.fontSize.includes('text-xl') ? 'font-size: 1.25rem;' :
    effect.settings.fontSize.includes('text-2xl') ? 'font-size: 1.5rem;' :
    effect.settings.fontSize.includes('text-3xl') ? 'font-size: 1.875rem;' : ''}
  color: ${effect.settings.textColor.includes('blue') ? '#3b82f6' : 
          effect.settings.textColor.includes('green') ? '#10b981' :
          effect.settings.textColor.includes('purple') ? '#8b5cf6' :
          effect.settings.textColor.includes('gray') ? '#6b7280' :
          effect.settings.textColor.includes('cyan') ? '#06b6d4' :
          effect.settings.textColor.includes('indigo') ? '#6366f1' : 'currentColor'};
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  ${effect.settings.cursorStyle.includes('border-r') ? 'border-right: 2px solid currentColor;' : 
    effect.settings.cursorStyle.includes('border-b') ? 'border-bottom: 2px solid currentColor;' : 
    effect.settings.cursorStyle.includes('after:content') ? "position: relative;" : ''}
  animation: 
    typing-${sanitizeName(effect.name)} ${duration}s steps(40, end) forwards${effect.settings.loop ? `, typing-delete-${sanitizeName(effect.name)} 0s step-end ${effect.settings.loopDelay}s forwards, typing-reset-${sanitizeName(effect.name)} 0s step-end ${(effect.settings.loopDelay + 0.1)}s forwards` : ''}
    ${effect.settings.cursorStyle && effect.settings.cursorBlink ? `, cursor-blink-${sanitizeName(effect.name)} 0.75s step-end infinite` : ''};
}

${effect.settings.cursorStyle.includes('after:content') ? `.typewriter-effect-${sanitizeName(effect.name)}::after {
  content: "▋";
  margin-left: 2px;
  ${effect.settings.cursorBlink ? `animation: cursor-blink-${sanitizeName(effect.name)} 0.75s step-end infinite;` : ''}
}` : ''}

@keyframes typing-${sanitizeName(effect.name)} {
  from { width: 0 }
  to { width: 100% }
}

${effect.settings.loop ? `@keyframes typing-delete-${sanitizeName(effect.name)} {
  to { width: 0 }
}

@keyframes typing-reset-${sanitizeName(effect.name)} {
  to { width: 0 }
}` : ''}

${effect.settings.cursorBlink ? `@keyframes cursor-blink-${sanitizeName(effect.name)} {
  50% { 
    ${effect.settings.cursorStyle.includes('border') ? 'border-color: transparent' : 'opacity: 0'}
  }
}` : ''}`;

    return css;
  };

  const generateHTMLForEffect = (effect) => {
    return `<div class="typewriter-effect-${sanitizeName(effect.name)}">
  ${effect.text}
</div>`;
  };

  const generateCSSForAllEffects = () => {
    return typographyEffects.map(effect => generateCSSForEffect(effect)).join('\n\n');
  };

  const generateHTMLForAllEffects = () => {
    return typographyEffects.map(effect => {
      return `<!-- ${effect.name} -->
${generateHTMLForEffect(effect)}`;
    }).join('\n\n');
  };

  const getFullCodeForCurrentEffect = () => {
    return `/* CSS */
${generateCSSForEffect(currentEffect)}

<!-- HTML -->
${generateHTMLForEffect(currentEffect)}`;
  };

  const getFullCodeForAllEffects = () => {
    return `/* CSS for all effects */
${generateCSSForAllEffects()}

<!-- HTML for all effects -->
${generateHTMLForAllEffects()}`;
  };

  const copyCodeToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const updateSetting = (key, value) => {
    const updatedEffects = [...typographyEffects];
    updatedEffects[activeEffectIndex] = {
      ...updatedEffects[activeEffectIndex],
      settings: {
        ...updatedEffects[activeEffectIndex].settings,
        [key]: value
      }
    };
    setTypographyEffects(updatedEffects);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10);
  };

  const updateText = (text) => {
    const updatedEffects = [...typographyEffects];
    updatedEffects[activeEffectIndex] = {
      ...updatedEffects[activeEffectIndex],
      text
    };
    setTypographyEffects(updatedEffects);
  };

  const applyPreset = (presetSettings) => {
    const updatedEffects = [...typographyEffects];
    updatedEffects[activeEffectIndex] = {
      ...updatedEffects[activeEffectIndex],
      settings: presetSettings
    };
    setTypographyEffects(updatedEffects);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10);
  };

  const addNewEffect = () => {
    if (!newEffectName.trim()) return;
    
    const newEffect = {
      name: newEffectName.trim(),
      text: "Type your text here...",
      settings: { ...typographyEffects[0].settings }
    };
    
    setTypographyEffects([...typographyEffects, newEffect]);
    setActiveEffectIndex(typographyEffects.length);
    setIsCreatingNewEffect(false);
    setNewEffectName("");
  };

  const deleteEffect = (index) => {
    if (typographyEffects.length === 1) {
      // Don't delete the last remaining effect
      return;
    }
    
    const updatedEffects = typographyEffects.filter((_, i) => i !== index);
    setTypographyEffects(updatedEffects);
    
    if (activeEffectIndex >= updatedEffects.length) {
      setActiveEffectIndex(updatedEffects.length - 1);
    } else if (activeEffectIndex === index) {
      setActiveEffectIndex(Math.max(0, index - 1));
    }
  };

  const renameEffect = (index, newName) => {
    if (!newName.trim()) return;
    
    const updatedEffects = [...typographyEffects];
    updatedEffects[index] = {
      ...updatedEffects[index],
      name: newName.trim()
    };
    setTypographyEffects(updatedEffects);
  };

  const sanitizeName = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  };

  const downloadCode = (code, filename) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSS = () => {
    downloadCode(generateCSSForAllEffects(), 'typewriter-effects.css');
  };

  const downloadHTML = () => {
    downloadCode(generateHTMLForAllEffects(), 'typewriter-effects.html');
  };

  const downloadCurrentEffectCode = () => {
    downloadCode(getFullCodeForCurrentEffect(), `typewriter-effect-${sanitizeName(currentEffect.name)}.txt`);
  };

  const downloadAllEffectsCode = () => {
    downloadCode(getFullCodeForAllEffects(), 'all-typewriter-effects.txt');
  };

  return (
    <div className={`min-h-screen mt-22 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <style>{styleSheet}</style>
      <header className={`py-4 px-6 border-b ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} sticky top-0 z-10`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Type size={24} className={theme === "dark" ? "text-blue-400" : "text-blue-600"} />
              <div className={`text-2xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                TypeWriter Library
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setView("editor")}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm
                  ${view === "editor" 
                    ? theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                    : theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
              >
                <Edit3 size={16} />
                Editor
              </button>
              
              <button
                onClick={() => setView("presets")}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm
                  ${view === "presets" 
                    ? theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                    : theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
              >
                <FileText size={16} />
                Presets
              </button>

              <button
                onClick={() => setView("effects")}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm
                  ${view === "effects" 
                    ? theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                    : theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
              >
                <Sliders size={16} />
                My Effects
              </button>
              
              <button
                onClick={() => setView("code")}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm
                  ${view === "code" 
                    ? theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                    : theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
              >
                <Globe size={16} />
                Get Code
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-6">
        {/* Effects Selector */}
        <div className={`p-4 mb-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center justify-between mb-2">
          <h2 className={`text-lg font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Current Effect: <span className="font-semibold">{currentEffect.name}</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={resetAnimation}
                className={`p-1.5 rounded flex items-center justify-center ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                title="Reset animation"
              >
                <RefreshCw size={16} className={theme === "dark" ? "text-gray-300" : "text-gray-700"} />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-1.5 rounded flex items-center justify-center ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                title={isPlaying ? "Pause animation" : "Play animation"}
              >
                {isPlaying ? (
                  <Pause size={16} className={theme === "dark" ? "text-gray-300" : "text-gray-700"} />
                ) : (
                  <Play size={16} className={theme === "dark" ? "text-gray-300" : "text-gray-700"} />
                )}
              </button>
            </div>
          </div>
          
          <div className={`p-8 mt-4 flex items-center justify-center rounded-lg ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
            <TypewriterPreview 
              text={currentEffect.text} 
              settings={currentEffect.settings} 
              isPlaying={isPlaying}
              theme={theme}
              charByCharRef={charByCharRef}
              wordByWordRef={wordByWordRef}
            />
          </div>
          
          <div className="mt-4">
            <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Text Content
            </label>
            <input
              type="text"
              value={currentEffect.text}
              onChange={(e) => updateText(e.target.value)}
              className={`w-full rounded-md px-4 py-2 
                ${theme === "dark" 
                  ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500" 
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } border focus:ring-1 focus:ring-blue-500 outline-none`}
              placeholder="Type the text for your effect..."
            />
          </div>
        </div>

        {view === "editor" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor Panel */}
            <div className={`col-span-2 p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex border-b mb-4 pb-2">
                <button
                  onClick={() => setActiveTab("style")}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg mr-2 
                    ${activeTab === "style" 
                      ? theme === "dark" 
                        ? "bg-gray-700 text-white border-b-2 border-blue-500" 
                        : "bg-gray-100 text-gray-900 border-b-2 border-blue-500"
                      : theme === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Style
                </button>
                <button
                  onClick={() => setActiveTab("animation")}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg mr-2 
                    ${activeTab === "animation" 
                      ? theme === "dark" 
                        ? "bg-gray-700 text-white border-b-2 border-blue-500" 
                        : "bg-gray-100 text-gray-900 border-b-2 border-blue-500"
                      : theme === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Animation
                </button>
                <button
                  onClick={() => setActiveTab("advanced")}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg 
                    ${activeTab === "advanced" 
                      ? theme === "dark" 
                        ? "bg-gray-700 text-white border-b-2 border-blue-500" 
                        : "bg-gray-100 text-gray-900 border-b-2 border-blue-500"
                      : theme === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Advanced
                </button>
              </div>
              
              {activeTab === "style" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Font Family
                      </label>
                      <select
                        value={currentEffect.settings.fontFamily}
                        onChange={(e) => updateSetting("fontFamily", e.target.value)}
                        className={`w-full rounded-md px-3 py-2 
                          ${theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-gray-200" 
                            : "bg-white border-gray-300 text-gray-900"
                          } border`}
                      >
                        {fontOptions.map(font => (
                          <option key={font.value} value={font.value}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Font Size
                      </label>
                      <select
                        value={currentEffect.settings.fontSize}
                        onChange={(e) => updateSetting("fontSize", e.target.value)}
                        className={`w-full rounded-md px-3 py-2 
                          ${theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-gray-200" 
                            : "bg-white border-gray-300 text-gray-900"
                          } border`}
                      >
                        <option value="text-xs">Extra Small</option>
                        <option value="text-sm">Small</option>
                        <option value="text-base">Base</option>
                        <option value="text-lg">Large</option>
                        <option value="text-xl">Extra Large</option>
                        <option value="text-2xl">2XL</option>
                        <option value="text-3xl">3XL</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Font Weight
                      </label>
                      <select
                        value={currentEffect.settings.fontWeight}
                        onChange={(e) => updateSetting("fontWeight", e.target.value)}
                        className={`w-full rounded-md px-3 py-2 
                          ${theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-gray-200" 
                            : "bg-white border-gray-300 text-gray-900"
                          } border`}
                      >
                        <option value="font-light">Light</option>
                        <option value="font-normal">Normal</option>
                        <option value="font-medium">Medium</option>
                        <option value="font-bold">Bold</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        Font Style
                      </label>
                      <select
                        value={currentEffect.settings.fontStyle}
                        onChange={(e) => updateSetting("fontStyle", e.target.value)}
                        className={`w-full rounded-md px-3 py-2 
                          ${theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-gray-200" 
                            : "bg-white border-gray-300 text-gray-900"
                          } border`}
                      >
                        <option value="">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Text Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["text-blue-600", "text-green-600", "text-purple-600", "text-gray-800", "text-cyan-600", "text-indigo-600", "text-red-600", "text-yellow-600"].map(color => (
                        <button
                          key={color}
                          onClick={() => updateSetting("textColor", theme === "dark" ? color.replace("-600", "-400").replace("-800", "-200") : color)}
                          className={`h-8 rounded-md border ${theme === "dark" ? "border-gray-600" : "border-gray-300"} ${
                            currentEffect.settings.textColor === (theme === "dark" ? color.replace("-600", "-400").replace("-800", "-200") : color) 
                              ? "ring-2 ring-offset-2 ring-blue-500" 
                              : ""
                          }`}
                          style={{ 
                            backgroundColor: color.includes("blue") ? "#2563eb" : 
                                            color.includes("green") ? "#16a34a" : 
                                            color.includes("purple") ? "#9333ea" : 
                                            color.includes("gray") ? "#374151" : 
                                            color.includes("cyan") ? "#0891b2" :
                                            color.includes("indigo") ? "#4f46e5" :
                                            color.includes("red") ? "#dc2626" :
                                            "#ca8a04"
                          }}
                        ></button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Cursor Style
                    </label>
                    <select
                      value={currentEffect.settings.cursorStyle}
                      onChange={(e) => updateSetting("cursorStyle", e.target.value)}
                      className={`w-full rounded-md px-3 py-2 
                        ${theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-gray-200" 
                          : "bg-white border-gray-300 text-gray-900"
                        } border`}
                    >
                      {cursorStyles.map(style => (
                        <option key={style.value} value={style.value}>
                          {style.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cursorBlink"
                      checked={currentEffect.settings.cursorBlink}
                      onChange={(e) => updateSetting("cursorBlink", e.target.checked)}
                      className={`rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} focus:ring-blue-500`}
                    />
                    <label htmlFor="cursorBlink" className={`ml-2 block text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Blinking Cursor
                    </label>
                  </div>
                </div>
              )}
              
              {activeTab === "animation" && (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Animation Type
                    </label>
                    <select
                      value={currentEffect.settings.typeMode}
                      onChange={(e) => updateSetting("typeMode", e.target.value)}
                      className={`w-full rounded-md px-3 py-2 
                        ${theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-gray-200" 
                          : "bg-white border-gray-300 text-gray-900"
                        } border`}
                    >
                      <option value="css-animation">CSS Animation</option>
                      <option value="char-by-char">Character by Character</option>
                      <option value="word-by-word">Word by Word</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Animation Speed: {currentEffect.settings.speed}%
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={currentEffect.settings.speed}
                      onChange={(e) => updateSetting("speed", parseInt(e.target.value))}
                      className={`w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>Slow</span>
                      <span>Fast</span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "advanced" && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="loopAnimation"
                      checked={currentEffect.settings.loop}
                      onChange={(e) => updateSetting("loop", e.target.checked)}
                      className={`rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} focus:ring-blue-500`}
                    />
                    <label htmlFor="loopAnimation" className={`ml-2 block text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      Loop Animation
                    </label>
                  </div>
                  
                  {currentEffect.settings.loop && (
                    <>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          Loop Delay (seconds): {currentEffect.settings.loopDelay}s
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="5"
                          step="0.5"
                          value={currentEffect.settings.loopDelay}
                          onChange={(e) => updateSetting("loopDelay", parseFloat(e.target.value))}
                          className={`w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="deleteBeforeLoop"
                          checked={currentEffect.settings.deleteBeforeLoop}
                          onChange={(e) => updateSetting("deleteBeforeLoop", e.target.checked)}
                          className={`rounded ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"} focus:ring-blue-500`}
                        />
                        <label htmlFor="deleteBeforeLoop" className={`ml-2 block text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          Delete Text Before Loop
                        </label>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Preview & Code Panel */}
            <div className="col-span-1 space-y-4">
              <div className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <h2 className={`text-lg font-medium mb-3 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                  Preview
                </h2>
                <div className={`p-6 rounded-lg h-48 flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
                  <TypewriterPreview 
                    text={currentEffect.text} 
                    settings={currentEffect.settings}
                    isPlaying={isPlaying}
                    theme={theme}
                    charByCharRef={charByCharRef}
                    wordByWordRef={wordByWordRef}
                  />
                </div>
              </div>
              
              <div className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex justify-between items-center mb-3">
                  <h2 className={`text-lg font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                    Current Effect Code
                  </h2>
                  <button
                    onClick={() => copyCodeToClipboard(getFullCodeForCurrentEffect())}
                    className={`p-1.5 rounded flex items-center justify-center
                      ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                    title="Copy code"
                  >
                    {copiedCode ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} className={theme === "dark" ? "text-gray-300" : "text-gray-700"} />
                    )}
                  </button>
                </div>
                <div className={`max-h-48 overflow-y-auto rounded-lg ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"} p-3`}>
                  <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                    <code className={theme === "dark" ? "text-gray-300" : "text-gray-800"}>
                      {generateCSSForEffect(currentEffect)}
                    </code>
                  </pre>
                </div>
                <div className="mt-4">
                  <button
                    onClick={downloadCurrentEffectCode}
                    className={`text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-md
                      ${theme === "dark" 
                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                  >
                    <Download size={16} />
                    Download Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {view === "presets" && (
          <div className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`text-xl font-medium mb-6 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Preset Typewriter Effects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {presets.map((preset, index) => (
                <TypewriterPreset 
                  key={index} 
                  preset={preset} 
                  onApply={applyPreset} 
                  theme={theme} 
                />
              ))}
            </div>
          </div>
        )}
        
        {view === "effects" && (
          <div className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                My Typewriter Effects
              </h2>
              
              {!isCreatingNewEffect && (
                <button
                  onClick={() => setIsCreatingNewEffect(true)}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm
                    ${theme === "dark" 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                >
                  <Plus size={16} />
                  Create New Effect
                </button>
              )}
            </div>
            
            {isCreatingNewEffect && (
              <div className={`mb-6 p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <h3 className={`text-lg font-medium mb-3 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                  Create New Effect
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEffectName}
                    onChange={(e) => setNewEffectName(e.target.value)}
                    placeholder="Effect name"
                    className={`flex-grow rounded-md px-4 py-2 
                      ${theme === "dark" 
                        ? "bg-gray-800 border-gray-600 text-gray-200 focus:border-blue-500" 
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      } border focus:ring-1 focus:ring-blue-500 outline-none`}
                  />
                  <button
                    onClick={addNewEffect}
                    className={`px-4 py-2 rounded-md 
                      ${theme === "dark" 
                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsCreatingNewEffect(false)}
                    className={`px-4 py-2 rounded-md 
                      ${theme === "dark" 
                        ? "bg-gray-600 hover:bg-gray-500 text-white" 
                        : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                      }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {typographyEffects.map((effect, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border cursor-pointer transition-all
                    ${activeEffectIndex === index
                      ? theme === "dark" 
                        ? "border-blue-500 bg-blue-900 bg-opacity-20" 
                        : "border-blue-500 bg-blue-50"
                      : theme === "dark"
                        ? "border-gray-700 hover:border-gray-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setActiveEffectIndex(index)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Move size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
                      <h3 className={`font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                        {effect.name}
                      </h3>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newName = prompt("Enter new name for this effect:", effect.name);
                          if (newName) renameEffect(index, newName);
                        }}
                        className={`p-1.5 rounded 
                          ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                        title="Rename effect"
                      >
                        <Edit3 size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Are you sure you want to delete this effect?")) {
                            deleteEffect(index);
                          }
                        }}
                        className={`p-1.5 rounded 
                          ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                        title="Delete effect"
                      >
                        <Trash2 size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
                      </button>
                    </div>
                  </div>
                  
                  <div className={`h-12 mt-2 rounded flex items-center px-4 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                    <div className={`${effect.settings.fontFamily} ${effect.settings.fontSize} ${effect.settings.fontWeight} ${effect.settings.fontStyle} ${effect.settings.textColor}`}>
                      {effect.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {view === "code" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h2 className={`text-xl font-medium mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                CSS Code
              </h2>
              <CodeDisplay 
                code={generateCSSForAllEffects()}
                theme={theme}
                onCopy={() => copyCodeToClipboard(generateCSSForAllEffects())}
                onDownload={downloadCSS}
              />
            </div>
            
            <div className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h2 className={`text-xl font-medium mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                HTML Code
              </h2>
              <CodeDisplay 
                code={generateHTMLForAllEffects()}
                theme={theme}
                onCopy={() => copyCodeToClipboard(generateHTMLForAllEffects())}
                onDownload={downloadHTML}
              />
            </div>
            
            <div className={`p-6 rounded-lg shadow-md col-span-1 lg:col-span-2 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
              <h2 className={`text-xl font-medium mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Complete Code (All Effects)
              </h2>
              <CodeDisplay 
                code={getFullCodeForAllEffects()}
                theme={theme}
                onCopy={() => copyCodeToClipboard(getFullCodeForAllEffects())}
                onDownload={downloadAllEffectsCode}
              />
              
              <div className="mt-6 border-t pt-4">
                <h3 className={`text-lg font-medium mb-3 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                  Usage Instructions
                </h3>
                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Copy the CSS code into your stylesheet or a <code className="font-mono text-sm">&lt;style&gt;</code> tag in your HTML document.</li>
                    <li>Add the HTML code for the specific effect you want to use in your page.</li>
                    <li>Customize the text content by modifying the content inside the div element.</li>
                    <li>To use multiple effects, make sure to include all needed CSS.</li>
                    <li>Adjust the CSS variables to customize the typing duration and other animation properties if needed.</li>
                    <li>For more complex effects, consider using JavaScript to control the animation timing and behavior.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      

    </div>
  );
};

export default TypewriterLibrary;