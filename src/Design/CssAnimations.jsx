import { useState, useEffect, useRef } from 'react';
import { Copy, Settings, X, Check, Sliders, Heart, Search, Download, Play, 
  Pause, Monitor, Smartphone, RefreshCw, ChevronRight, ChevronDown, BookOpen,
  Maximize, Minimize, Grid, List } from 'lucide-react';

// Separated stylesheet for better organization
const styleSheet = `
@keyframes fadeIn {from{opacity:0}to{opacity:1}}
.fade-in{animation:fadeIn 1.5s ease forwards}
@keyframes slideIn{from{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}
.slide-in{animation:slideIn 1s ease forwards}
@keyframes float{0%{transform:translateY(0px)}50%{transform:translateY(-15px)}100%{transform:translateY(0px)}}
.floating{animation:float 3s ease-in-out infinite}
@keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}
.shake{animation:shake 0.8s ease-in-out infinite}
@keyframes flip{0%{transform:perspective(400px) rotateY(0)}100%{transform:perspective(400px) rotateY(360deg)}}
.flip{animation:flip 1.5s ease-in-out infinite}
@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}}
.pulse{animation:pulse 2s infinite ease-in-out}
@keyframes glowPulse{0%,100%{box-shadow:0 0 5px rgba(66,153,225,0.5)}50%{box-shadow:0 0 20px rgba(66,153,225,0.8)}}
.glow-pulse{animation:glowPulse 2s infinite}
@keyframes typing{from{width:0}to{width:100%}}
@keyframes blink{50%{border-color:transparent}}
.typewriter{overflow:hidden;white-space:nowrap;border-right:3px solid;width:0;animation:typing 3.5s steps(40,end) forwards,blink .75s step-end infinite}
@keyframes rubberBand{0%{transform:scale3d(1,1,1)}30%{transform:scale3d(1.25,0.75,1)}40%{transform:scale3d(0.75,1.25,1)}50%{transform:scale3d(1.15,0.85,1)}65%{transform:scale3d(0.95,1.05,1)}75%{transform:scale3d(1.05,0.95,1)}100%{transform:scale3d(1,1,1)}}
.rubber-band{animation:rubberBand 1s infinite}
@keyframes rotateIn{from{transform-origin:center;transform:rotate3d(0,0,1,-200deg);opacity:0}to{transform-origin:center;transform:none;opacity:1}}
.rotate-in{animation:rotateIn 1s infinite}
@keyframes bounceInUp{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.610,0.355,1.000)}from{opacity:0;transform:translate3d(0,3000px,0)}60%{opacity:1;transform:translate3d(0,-20px,0)}75%{transform:translate3d(0,10px,0)}90%{transform:translate3d(0,-5px,0)}to{transform:none}}
.bounce-in-up{animation:bounceInUp 3s infinite}
@keyframes swing{20%{transform:rotate3d(0,0,1,15deg)}40%{transform:rotate3d(0,0,1,-10deg)}60%{transform:rotate3d(0,0,1,5deg)}80%{transform:rotate3d(0,0,1,-5deg)}to{transform:rotate3d(0,0,1,0deg)}}
.swing{transform-origin:top center;animation:swing 1s infinite}
@keyframes gradientMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.gradient-move{background:linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab);background-size:400% 400%;animation:gradientMove 10s ease infinite}
@keyframes expandRotate{0%{transform:scale(0) rotate(0deg)}100%{transform:scale(1) rotate(360deg)}}
.expand-rotate{animation:expandRotate 1s ease infinite alternate}
@keyframes heartbeat{0%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}}
.heartbeat{animation:heartbeat 1.5s ease-in-out infinite}
@keyframes jello{from,11.1%,to{transform:none}22.2%{transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{transform:skewX(6.25deg) skewY(6.25deg)}44.4%{transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}}
.jello{animation:jello 1s infinite;transform-origin:center}
@keyframes ripple{0%{box-shadow:0 0 0 0 rgba(66,153,225,0.4)}100%{box-shadow:0 0 0 20px rgba(66,153,225,0)}}
.ripple{animation:ripple 1.5s infinite}
@keyframes wobble{from{transform:none}15%{transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)}30%{transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg)}45%{transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)}60%{transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg)}75%{transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)}to{transform:none}}
.wobble{animation:wobble 2s infinite}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.shimmer{background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.2) 50%,rgba(255,255,255,0) 100%);background-size:200% 100%;animation:shimmer 2s infinite}
@keyframes morphPath{0%{d:path("M10,10 C50,30 60,30 90,10")}50%{d:path("M10,30 C30,10 70,60 90,30")}100%{d:path("M10,10 C50,30 60,30 90,10")}}
.morph-path{animation:morphPath 3s ease-in-out infinite}
.card-stack{position:relative}
.stacked-card{position:absolute;top:0;left:0;width:100%;transition:all 0.3s ease}
.stacked-card:nth-child(1){transform:translateY(0) scale(1);z-index:5}
.stacked-card:nth-child(2){transform:translateY(15px) scale(0.95);z-index:4}
.stacked-card:nth-child(3){transform:translateY(30px) scale(0.9);z-index:3}
.card-stack:hover .stacked-card:nth-child(2){transform:translateY(20px) scale(0.95)}
.card-stack:hover .stacked-card:nth-child(3){transform:translateY(40px) scale(0.9)}

/* Added improved transitions */
.anim-grid-item {
  transition: all 0.3s ease;
}
.anim-grid-item:hover {
  transform: translateY(-5px);
}
.preview-container {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
}
.preview-element {
  transition: transform 0.3s ease;
}
.preview-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}
.preview-container:hover .preview-controls {
  transform: translateY(0);
}
.category-pill {
  transition: all 0.2s ease;
}
.category-pill:hover {
  filter: brightness(1.1);
}
.custom-animation {
  transition: all 0.3s ease;
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
.play-animation-btn {
  transition: all 0.2s ease;
}
`;

// Component definitions
const CategoryPill = ({ label, active, onClick, theme }) => (
  <button
    onClick={onClick}
    className={`category-pill px-3 py-1 text-sm font-medium rounded-full transition-all
      ${active 
        ? theme === 'dark' 
          ? 'bg-blue-600 text-white' 
          : 'bg-blue-500 text-white' 
        : theme === 'dark' 
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
  >
    {label}
  </button>
);

const AnimationCard = ({ animation, theme, isSelected, onSelect, isFavorite, onToggleFavorite, categoryColor }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  
  const category = animationCategories[animation];
  const displayName = animation.replace(/([A-Z])/g, ' $1').trim();
  
  const getCategoryColor = () => {
    switch(category) {
      case 'entrance': return 'border-blue-500';
      case 'attention': return 'border-purple-500';
      case 'continuous': return 'border-green-500';
      case 'special': return 'border-orange-500';
      default: return 'border-gray-300';
    }
  };
  
  return (
    <div 
      className={`anim-grid-item relative cursor-pointer rounded-lg overflow-hidden shadow
        ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} 
        ${isSelected ? theme === 'dark' ? 'ring-2 ring-blue-500' : 'ring-2 ring-blue-400' : ''}
        border-l-4 ${getCategoryColor()}`}
      onClick={onSelect}
    >
      <div className="p-3 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {displayName}
          </h3>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(animation);
            }}
            className={`text-lg transition-transform duration-200 hover:scale-110 
              ${isFavorite ? 'text-yellow-400' : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center relative overflow-hidden rounded-md
          ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}">
          <div className={`${isPlaying ? animation === 'typewriter' ? 'typewriter' : animationClassNames[animation] : ''}`}>
            {animationDisplayElements[animation](theme)}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 py-1 px-2 flex justify-between
            bg-opacity-70 bg-black transform translate-y-full transition-transform
            group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="text-white p-1 rounded hover:bg-gray-700"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
          <span className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            .{animation.replace(/([A-Z])/g, '-$1').toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

const CodeDisplay = ({ code, theme, language = 'css', onCopy }) => {
  return (
    <div className="code-container relative rounded-lg overflow-hidden">
      <pre className={`p-4 overflow-auto max-h-72 text-sm scrollbar-custom font-mono
        ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
        <code>{code}</code>
      </pre>
      <button
        onClick={onCopy}
        className="code-copy-btn absolute top-2 right-2 p-1.5 rounded-md 
          text-gray-400 hover:text-gray-100
          transition-colors duration-200
          bg-opacity-80 bg-gray-800 hover:bg-gray-700"
        title="Copy to clipboard"
      >
        <Copy size={16} />
      </button>
    </div>
  );
};

// Animation utility functions
const animationCategories = {
  fadeIn: 'entrance', slideIn: 'entrance', rotateIn: 'entrance', bounceInUp: 'entrance', typewriter: 'entrance',
  shake: 'attention', pulse: 'attention', heartbeat: 'attention', wobble: 'attention', jello: 'attention', rubberBand: 'attention',
  float: 'continuous', flip: 'continuous', swing: 'continuous', gradientMove: 'continuous', expandRotate: 'continuous',
  glowPulse: 'special', ripple: 'special', shimmer: 'special', morphSVG: 'special', stackedCards: 'special'
};

// Mapping for class names
const animationClassNames = {
  fadeIn: 'fade-in',
  slideIn: 'slide-in',
  float: 'floating',
  shake: 'shake',
  flip: 'flip',
  pulse: 'pulse',
  glowPulse: 'glow-pulse',
  rubberBand: 'rubber-band',
  rotateIn: 'rotate-in',
  bounceInUp: 'bounce-in-up',
  swing: 'swing',
  gradientMove: 'gradient-move',
  expandRotate: 'expand-rotate',
  heartbeat: 'heartbeat',
  jello: 'jello',
  ripple: 'ripple',
  wobble: 'wobble',
  shimmer: 'shimmer',
  morphSVG: 'morph-path',
  stackedCards: 'card-stack'
};

const animationSnippets = {
  fadeIn: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.fade-in {
  animation: fadeIn 1.5s ease forwards;
}`,
  slideIn: `@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.slide-in {
  animation: slideIn 1s ease forwards;
}`,
  float: `@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}
.floating {
  animation: float 3s ease-in-out infinite;
}`,
  shake: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
.shake {
  animation: shake 0.8s ease-in-out infinite;
}`,
  flip: `@keyframes flip {
  0% { transform: perspective(400px) rotateY(0); }
  100% { transform: perspective(400px) rotateY(360deg); }
}
.flip {
  animation: flip 1.5s ease-in-out infinite;
}`,
  pulse: `@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
.pulse {
  animation: pulse 2s infinite ease-in-out;
}`,
  glowPulse: `@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 5px rgba(66, 153, 225, 0.5); }
  50% { box-shadow: 0 0 20px rgba(66, 153, 225, 0.8); }
}
.glow-pulse {
  animation: glowPulse 2s infinite;
}`,
  typewriter: `@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
@keyframes blink {
  50% { border-color: transparent }
}
.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid;
  width: 0;
  animation: 
    typing 3.5s steps(40, end) forwards,
    blink .75s step-end infinite;
}`,
  rubberBand: `@keyframes rubberBand {
  0% { transform: scale3d(1, 1, 1); }
  30% { transform: scale3d(1.25, 0.75, 1); }
  40% { transform: scale3d(0.75, 1.25, 1); }
  50% { transform: scale3d(1.15, 0.85, 1); }
  65% { transform: scale3d(0.95, 1.05, 1); }
  75% { transform: scale3d(1.05, 0.95, 1); }
  100% { transform: scale3d(1, 1, 1); }
}
.rubber-band {
  animation: rubberBand 1s infinite;
}`,
  rotateIn: `@keyframes rotateIn {
  from {
    transform-origin: center;
    transform: rotate3d(0, 0, 1, -200deg);
    opacity: 0;
  }
  to {
    transform-origin: center;
    transform: none;
    opacity: 1;
  }
}
.rotate-in {
  animation: rotateIn 1s infinite;
}`,
  bounceInUp: `@keyframes bounceInUp {
  from, 60%, 75%, 90%, to {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }
  75% {
    transform: translate3d(0, 10px, 0);
  }
  90% {
    transform: translate3d(0, -5px, 0);
  }
  to {
    transform: none;
  }
}
.bounce-in-up {
  animation: bounceInUp 3s infinite;
}`,
  swing: `@keyframes swing {
  20% { transform: rotate3d(0, 0, 1, 15deg); }
  40% { transform: rotate3d(0, 0, 1, -10deg); }
  60% { transform: rotate3d(0, 0, 1, 5deg); }
  80% { transform: rotate3d(0, 0, 1, -5deg); }
  to { transform: rotate3d(0, 0, 1, 0deg); }
}
.swing {
  transform-origin: top center;
  animation: swing 1s infinite;
}`,
  gradientMove: `@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.gradient-move {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientMove 10s ease infinite;
}`,
  expandRotate: `@keyframes expandRotate {
  0% { transform: scale(0) rotate(0deg); }
  100% { transform: scale(1) rotate(360deg); }
}
.expand-rotate {
  animation: expandRotate 1s ease infinite alternate;
}`,
  heartbeat: `@keyframes heartbeat {
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
}
.heartbeat {
  animation: heartbeat 1.5s ease-in-out infinite;
}`,
  jello: `@keyframes jello {
  from, 11.1%, to { transform: none; }
  22.2% { transform: skewX(-12.5deg) skewY(-12.5deg); }
  33.3% { transform: skewX(6.25deg) skewY(6.25deg); }
  44.4% { transform: skewX(-3.125deg) skewY(-3.125deg); }
  55.5% { transform: skewX(1.5625deg) skewY(1.5625deg); }
  66.6% { transform: skewX(-0.78125deg) skewY(-0.78125deg); }
  77.7% { transform: skewX(0.390625deg) skewY(0.390625deg); }
  88.8% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg); }
}
.jello {
  animation: jello 1s infinite;
  transform-origin: center;
}`,
  ripple: `@keyframes ripple {
  0% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(66, 153, 225, 0);
  }
}
.ripple {
  animation: ripple 1.5s infinite;
}`,
  wobble: `@keyframes wobble {
  from {
    transform: none;
  }
  15% {
    transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
  }
  30% {
    transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
  }
  45% {
    transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
  }
  60% {
    transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
  }
  75% {
    transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
  }
  to {
    transform: none;
  }
}
.wobble {
  animation: wobble 2s infinite;
}`,
  shimmer: `@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.shimmer {
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.2) 50%, 
    rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}`,
  morphSVG: `@keyframes morphPath {
  0% {
    d: path("M10,10 C50,30 60,30 90,10");
  }
  50% {
    d: path("M10,30 C30,10 70,60 90,30");
  }
  100% {
    d: path("M10,10 C50,30 60,30 90,10");
  }
}
.morph-path {
  animation: morphPath 3s ease-in-out infinite;
}`,
  stackedCards: `/* Stacked cards with hover effect */
.card-stack {
  position: relative;
}
.stacked-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
}
.stacked-card:nth-child(1) {
  transform: translateY(0) scale(1);
  z-index: 5;
}
.stacked-card:nth-child(2) {
  transform: translateY(15px) scale(0.95);
  z-index: 4;
}
.stacked-card:nth-child(3) {
  transform: translateY(30px) scale(0.9);
  z-index: 3;
}
.card-stack:hover .stacked-card:nth-child(2) {
  transform: translateY(20px) scale(0.95);
}
.card-stack:hover .stacked-card:nth-child(3) {
  transform: translateY(40px) scale(0.9);
}`
};

const tailwindEquivalents = {
  fadeIn: `// Add to tailwind.config.js:
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 1.5s ease forwards',
      }
    }
  }
}

// Usage:
<div className="animate-fade-in">...</div>`,
};

const animationDisplayElements = {
  fadeIn: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Fade In
    </div>
  ),
  slideIn: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Slide In
    </div>
  ),
  float: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Float
    </div>
  ),
  shake: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Shake
    </div>
  ),
  flip: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Flip
    </div>
  ),

    // Continuing the animationDisplayElements definition
  pulse: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Pulse
    </div>
  ),
  glowPulse: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} 
      p-4 rounded-lg shadow-md text-lg font-medium`}>
      Glow
    </div>
  ),
  typewriter: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Typing...
    </div>
  ),
  rubberBand: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Rubber
    </div>
  ),
  rotateIn: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Rotate
    </div>
  ),
  bounceInUp: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Bounce
    </div>
  ),
  swing: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Swing
    </div>
  ),
  gradientMove: (theme) => (
    <div className="w-24 h-12 rounded-lg text-white flex items-center justify-center">
      Gradient
    </div>
  ),
  expandRotate: (theme) => (
    <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
  ),
  heartbeat: (theme) => (
    <Heart size={30} className={theme === 'dark' ? 'text-red-500' : 'text-red-600'} fill="currentColor" />
  ),
  jello: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Jello
    </div>
  ),
  ripple: (theme) => (
    <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
  ),
  wobble: (theme) => (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg font-medium`}>
      Wobble
    </div>
  ),
  shimmer: (theme) => (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
      Shimmer
    </div>
  ),
  morphSVG: () => (
    <svg viewBox="0 0 100 100" width="100" height="60">
      <path d="M10,10 C50,30 60,30 90,10" stroke="#3B82F6" strokeWidth="4" fill="none" className="morph-path" />
    </svg>
  ),
  stackedCards: (theme) => (
    <div className="card-stack w-24 h-16 relative">
      <div className={`stacked-card rounded-lg ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'} w-full h-full`}></div>
      <div className={`stacked-card rounded-lg ${theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-400'} w-full h-full`}></div>
      <div className={`stacked-card rounded-lg ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400'} w-full h-full`}></div>
    </div>
  )
};

// Main component
export default function AnimationLibrary() {
  const [theme, setTheme] = useState('theme');
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [showTailwind, setShowTailwind] = useState(false);
  
  // Filter animations based on search and category
  const filteredAnimations = Object.keys(animationCategories).filter(animation => {
    const matchesSearch = animation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                           (activeCategory === 'favorites' ? favorites.includes(animation) : 
                            animationCategories[animation] === activeCategory);
    return matchesSearch && matchesCategory;
  });
  
  // Handle copying code
  const handleCopyCode = () => {
    if (selectedAnimation) {
      navigator.clipboard.writeText(showTailwind ? 
        tailwindEquivalents[selectedAnimation] || '// Tailwind equivalent not available' : 
        animationSnippets[selectedAnimation]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = (animation) => {
    setFavorites(prev => 
      prev.includes(animation) 
        ? prev.filter(a => a !== animation) 
        : [...prev, animation]
    );
  };
  
  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('animationFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Check for user's preferred theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('animationFavorites', JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className={`min-h-screen mt-20 ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <style>{styleSheet}</style>
      
      {/* Header */}
      <header className={`px-4 py-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold">
                CSS Animation Library
              </h1>
              <button 
                onClick={toggleTheme}
                className={`ml-4 p-2 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                  </svg>
                )}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search animations..."
                  className={`pl-10 pr-4 py-2 rounded-lg text-sm w-full md:w-64
                    ${theme === 'dark' 
                      ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500' 
                      : 'bg-gray-100 border-gray-300 focus:border-blue-400'} 
                    border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 outline-none`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex border rounded overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' 
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800' 
                    : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}
                >
                  <Grid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' 
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800' 
                    : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mt-4 flex flex-wrap gap-2">
            <CategoryPill 
              label="All" 
              active={activeCategory === 'all'} 
              onClick={() => setActiveCategory('all')}
              theme={theme}
            />
            <CategoryPill 
              label="Favorites" 
              active={activeCategory === 'favorites'} 
              onClick={() => setActiveCategory('favorites')}
              theme={theme}
            />
            <CategoryPill 
              label="Entrance" 
              active={activeCategory === 'entrance'} 
              onClick={() => setActiveCategory('entrance')}
              theme={theme}
            />
            <CategoryPill 
              label="Attention" 
              active={activeCategory === 'attention'} 
              onClick={() => setActiveCategory('attention')}
              theme={theme}
            />
            <CategoryPill 
              label="Continuous" 
              active={activeCategory === 'continuous'} 
              onClick={() => setActiveCategory('continuous')}
              theme={theme}
            />
            <CategoryPill 
              label="Special" 
              active={activeCategory === 'special'} 
              onClick={() => setActiveCategory('special')}
              theme={theme}
            />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Animation grid */}
          <div className={`${selectedAnimation ? 'lg:w-3/5' : 'w-full'}`}>
            {filteredAnimations.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
                : 'space-y-4'
              }>
                {filteredAnimations.map((animation) => (
                  <AnimationCard
                    key={animation}
                    animation={animation}
                    theme={theme}
                    isSelected={selectedAnimation === animation}
                    onSelect={() => setSelectedAnimation(animation)}
                    isFavorite={favorites.includes(animation)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center py-16 
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <Search size={48} strokeWidth={1.5} />
                <p className="mt-4 text-lg">No animations found.</p>
                <p className="text-sm opacity-80">Try changing your search or category filter.</p>
              </div>
            )}
          </div>
          
          {/* Animation details */}
          {selectedAnimation && (
            <div className="lg:w-2/5">
              <div className={`sticky top-4 rounded-lg shadow-lg overflow-hidden border
                ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="p-4 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      {selectedAnimation.replace(/([A-Z])/g, ' $1').trim()}
                    </h2>
                    <button
                      onClick={() => setSelectedAnimation(null)}
                      className={`p-1.5 rounded-full
                        ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Preview */}
                <div className={`p-8 flex items-center justify-center border-b
                  ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`preview-element ${animationClassNames[selectedAnimation]}`}>
                    {animationDisplayElements[selectedAnimation](theme)}
                  </div>
                </div>
                
                {/* Code */}
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <button 
                      onClick={() => setShowCode(true)}
                      className={`px-3 py-1.5 rounded text-sm font-medium
                        ${showCode 
                          ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      CSS
                    </button>
                    <button 
                      onClick={() => setShowCode(false)}
                      className={`px-3 py-1.5 rounded text-sm font-medium
                        ${!showCode 
                          ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      Usage
                    </button>
                    {tailwindEquivalents[selectedAnimation] && (
                      <button 
                        onClick={() => setShowTailwind(!showTailwind)}
                        className={`px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1
                          ${showTailwind 
                            ? theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-gray-200 text-blue-600'
                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 256 154" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M128 0C93.867 0 72.533 17.067 64 51.2C76.8 34.133 93.867 27.733 115.2 32C126.347 34.3 134.751 42.816 144.16 52.35C158.671 67.049 175.855 84.267 213.333 84.267C247.467 84.267 268.8 67.2 277.333 33.067C264.533 50.133 247.467 56.533 226.133 52.267C215.051 49.954 206.647 41.44 197.171 31.889C182.726 17.179 165.541 0 128 0ZM64 84.267C29.867 84.267 8.533 101.333 0 135.467C12.8 118.4 29.867 112 51.2 116.267C62.347 118.566 70.751 127.082 80.16 136.616C94.671 151.316 111.855 168.533 149.333 168.533C183.467 168.533 204.8 151.467 213.333 117.333C200.533 134.4 183.467 140.8 162.133 136.533C151.051 134.221 142.647 125.705 133.171 116.155C118.726 101.446 101.541 84.267 64 84.267Z" />
                        </svg>
                        Tailwind
                      </button>
                    )}
                  </div>
                  
                  {showCode ? (
                    <CodeDisplay 
                      code={showTailwind 
                        ? tailwindEquivalents[selectedAnimation] || '// Tailwind equivalent not available'
                        : animationSnippets[selectedAnimation]} 
                      theme={theme}
                      language={showTailwind ? 'javascript' : 'css'}
                      onCopy={handleCopyCode}
                    />
                  ) : (
                    <div className={`p-4 rounded-lg text-sm ${
                      theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p>To use this animation:</p>
                      <ol className="mt-2 space-y-2 pl-5 list-decimal">
                        <li>Copy the CSS code to your stylesheet</li>
                        <li>Add the <code className="px-1 py-0.5 rounded bg-opacity-20 bg-gray-500 font-mono">{
                          `.${animationClassNames[selectedAnimation]}`
                        }</code> class to your element</li>
                      </ol>
                      <div className="mt-4 p-3 border-l-4 border-blue-500 bg-blue-500 bg-opacity-10 rounded">
                        <p className="text-sm">
                          <strong>Tip:</strong> You can customize the animation duration, timing function, or other properties
                          by modifying the CSS code.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {copied && (
                    <div className="mt-2 flex items-center text-green-500 text-sm">
                      <Check size={16} className="mr-1" />
                      <span>Copied to clipboard!</span>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => toggleFavorite(selectedAnimation)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md
                        ${favorites.includes(selectedAnimation)
                          ? 'text-yellow-400'
                          : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <Heart size={16} fill={favorites.includes(selectedAnimation) ? "currentColor" : "none"} />
                      {favorites.includes(selectedAnimation) ? 'Favorited' : 'Add to Favorites'}
                    </button>
                    
                    <button
                      onClick={() => {
                        const cssText = animationSnippets[selectedAnimation];
                        const blob = new Blob([cssText], { type: 'text/css' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${selectedAnimation}.css`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md
                        ${theme === 'dark' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    >
                      <Download size={16} />
                      Download CSS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
          </div>
  );
}