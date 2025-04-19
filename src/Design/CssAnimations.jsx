import { useState, useEffect } from 'react';
import { Copy, Settings, X, Check, Sliders, Heart, Search, Download, Play, 
  Pause, Monitor, Smartphone, RefreshCw, ChevronRight, ChevronDown, BookOpen,
  Maximize, Minimize, Grid, List, Info, ExternalLink } from 'lucide-react';

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
@keyframes skewBounce{0%{transform:none}25%{transform:skewX(15deg) translateY(-10px)}50%{transform:skewX(-15deg) translateY(0)}75%{transform:skewX(5deg) translateY(-5px)}100%{transform:none}}
.skew-bounce{animation:skewBounce 1.5s infinite ease-in-out}
@keyframes slideFromTop{0%{transform:translateY(-100%);opacity:0}100%{transform:translateY(0);opacity:1}}
.slide-from-top{animation:slideFromTop 1s forwards ease-out}
@keyframes elasticScale{0%{transform:scale(0)}55%{transform:scale(1.1)}70%{transform:scale(0.95)}100%{transform:scale(1)}}
.elastic-scale{animation:elasticScale 1s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94)}
@keyframes revealText{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0 0 0)}}
.reveal-text{animation:revealText 1.5s forwards cubic-bezier(0.86, 0, 0.07, 1)}
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
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
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
const CategoryPill = ({ label, active, onClick, theme, icon }) => (
  <button
    onClick={onClick}
    className={`category-pill px-3 py-1.5 text-sm font-medium rounded-full transition-all flex items-center gap-1.5
      ${active 
        ? theme === 'dark' 
          ? 'bg-blue-600 text-white' 
          : 'bg-blue-500 text-white' 
        : theme === 'dark' 
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
  >
    {icon && icon}
    {label}
  </button>
);

const AnimationCard = ({ animation, theme, isSelected, onSelect, isFavorite, onToggleFavorite, customizationOptions }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [isCustomizing, setIsCustomizing] = useState(false);
  
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

  const cardStyle = {
    animationDuration: customizationOptions?.duration 
      ? `${customizationOptions.duration}s` 
      : undefined
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
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className={`p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500`}
              title={isPlaying ? "Pause animation" : "Play animation"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(animation);
              }}
              className={`p-1 rounded-full transition-transform duration-200 hover:scale-110 
                ${isFavorite ? 'text-yellow-400' : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
        
        <div className={`flex-1 flex items-center justify-center relative overflow-hidden rounded-md
          ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <div 
            className={`${isPlaying ? animation === 'typewriter' ? 'typewriter' : animationClassNames[animation] : ''}`}
            style={cardStyle}
          >
            {animationDisplayElements[animation](theme)}
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

const CodeDisplay = ({ code, theme, language = 'css', onCopy, showLineNumbers = true }) => {
  return (
    <div className="code-container relative rounded-lg overflow-hidden">
      <pre className={`p-4 overflow-auto max-h-72 text-sm scrollbar-custom font-mono
        ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
        {showLineNumbers ? (
          <code className="relative">
            {code.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className={`table-cell pr-4 text-right select-none opacity-50 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {i + 1}
                </span>
                <span className="table-cell">{line}</span>
              </div>
            ))}
          </code>
        ) : (
          <code>{code}</code>
        )}
      </pre>
      <button
        onClick={onCopy}
        className="code-copy-btn absolute top-2 right-2 p-1.5 rounded-md 
          text-gray-400 hover:text-gray-100
          transition-colors duration-200
          bg-opacity-80 bg-gray-800 hover:bg-gray-700"
        title="Copy to clipboard"
        aria-label="Copy code to clipboard"
      >
        <Copy size={16} />
      </button>
    </div>
  );
};

// Animation utility functions
const animationCategories = {
  fadeIn: 'entrance', 
  slideIn: 'entrance', 
  rotateIn: 'entrance', 
  bounceInUp: 'entrance', 
  typewriter: 'entrance',
  slideFromTop: 'entrance',
  elasticScale: 'entrance',
  revealText: 'entrance',
  shake: 'attention', 
  pulse: 'attention', 
  heartbeat: 'attention', 
  wobble: 'attention', 
  jello: 'attention', 
  rubberBand: 'attention',
  skewBounce: 'attention',
  float: 'continuous', 
  flip: 'continuous', 
  swing: 'continuous', 
  gradientMove: 'continuous', 
  expandRotate: 'continuous',
  glowPulse: 'special', 
  ripple: 'special', 
  shimmer: 'special', 
  morphSVG: 'special', 
  stackedCards: 'special'
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
  stackedCards: 'card-stack',
  skewBounce: 'skew-bounce',
  slideFromTop: 'slide-from-top',
  elasticScale: 'elastic-scale',
  revealText: 'reveal-text'
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
}`,
  skewBounce: `@keyframes skewBounce {
  0% { transform: none; }
  25% { transform: skewX(15deg) translateY(-10px); }
  50% { transform: skewX(-15deg) translateY(0); }
  75% { transform: skewX(5deg) translateY(-5px); }
  100% { transform: none; }
}
.skew-bounce {
  animation: skewBounce 1.5s infinite ease-in-out;
}`,
  slideFromTop: `@keyframes slideFromTop {
  0% { transform: translateY(-100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.slide-from-top {
  animation: slideFromTop 1s forwards ease-out;
}`,
  elasticScale: `@keyframes elasticScale {
  0% { transform: scale(0); }
  55% { transform: scale(1.1); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
.elastic-scale {
  animation: elasticScale 1s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94);
}`,
  revealText: `@keyframes revealText {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}
.reveal-text {
  animation: revealText 1.5s forwards cubic-bezier(0.86, 0, 0.07, 1);
}`
};

// Elements to display in each animation preview
const animationDisplayElements = {
  fadeIn: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Hello</div>,
  slideIn: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Slide</div>,
  float: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Float</div>,
  shake: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Shake</div>,
  flip: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Flip</div>,
  pulse: (theme) => <div className={`w-16 h-16 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}></div>,
  glowPulse: (theme) => <div className={`w-16 h-16 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}></div>,
  typewriter: (theme) => <div className={`font-mono ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Typing...</div>,
  rubberBand: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Rubber</div>,
  rotateIn: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Rotate</div>,
  bounceInUp: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Bounce</div>,
  swing: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Swing</div>,
  gradientMove: (theme) => <div className="w-16 h-16 rounded-lg"></div>,
  expandRotate: (theme) => <div className={`w-16 h-16 rounded-lg ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}></div>,
  heartbeat: (theme) => <Heart size={32} className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />,
  jello: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Jello</div>,
  ripple: (theme) => <div className={`w-12 h-12 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}></div>,
  wobble: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Wobble</div>,
  shimmer: (theme) => <div className={`w-24 h-8 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>,
  morphSVG: () => (
    <svg width="100" height="40" viewBox="0 0 100 40">
      <path 
        d="M10,10 C50,30 60,30 90,10" 
        stroke="#3182CE" 
        strokeWidth="4" 
        fill="none" 
        className="morph-path"
      />
    </svg>
  ),
  stackedCards: (theme) => (
    <div className="card-stack w-24 h-16">
      <div className={`stacked-card rounded-md p-2 ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}>
        <div className={`text-xs font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-white'}`}>Card 1</div>
      </div>
      <div className={`stacked-card rounded-md p-2 ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'}`}>
        <div className={`text-xs font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-white'}`}>Card 2</div>
      </div>
      <div className={`stacked-card rounded-md p-2 ${theme === 'dark' ? 'bg-blue-300' : 'bg-blue-400'}`}>
        <div className={`text-xs font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-white'}`}>Card 3</div>
      </div>
    </div>
  ),
  skewBounce: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Skew</div>,
  slideFromTop: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Drop</div>,
  elasticScale: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Pop</div>,
  revealText: (theme) => <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Reveal</div>,
};

// Usage examples for each animation
const animationUsageExamples = {
  fadeIn: `<div class="fade-in">Content that fades in</div>`,
  slideIn: `<div class="slide-in">Content that slides in from left</div>`,
  float: `<button class="floating">Floating Button</button>`,
  shake: `<div class="shake">Attention! Shake effect</div>`,
  flip: `<div class="flip">3D Flip Animation</div>`,
  pulse: `<button class="pulse">Pulsing Button</button>`,
  glowPulse: `<div class="glow-pulse rounded-md p-4">Glowing content</div>`,
  typewriter: `<h1 class="typewriter">This text types out gradually</h1>`,
  rubberBand: `<button class="rubber-band">Elastic Button</button>`,
  rotateIn: `<div class="rotate-in">Rotating Elements</div>`,
  bounceInUp: `<div class="bounce-in-up">Content bounces from bottom</div>`,
  swing: `<div class="swing">Swinging element</div>`,
  gradientMove: `<button class="gradient-move text-white p-4">Colorful Button</button>`,
  expandRotate: `<div class="expand-rotate">Growing & rotating element</div>`,
  heartbeat: `<button class="heartbeat">♥ Like Button</button>`,
  jello: `<div class="jello">Wobbling element</div>`,
  ripple: `<button class="ripple">Click me</button>`,
  wobble: `<div class="wobble">Unsteady Element</div>`,
  shimmer: `<div class="shimmer">Loading indicator</div>`,
  morphSVG: `<svg width="100" height="50">
  <path d="..." stroke="#3182CE" fill="none" class="morph-path"/>
</svg>`,
  stackedCards: `<div class="card-stack">
  <div class="stacked-card">Card 1</div>
  <div class="stacked-card">Card 2</div>
  <div class="stacked-card">Card 3</div>
</div>`,
  skewBounce: `<div class="skew-bounce">Bouncy skew animation</div>`,
  slideFromTop: `<div class="slide-from-top">Slides in from top</div>`,
  elasticScale: `<div class="elastic-scale">Scales with elastic effect</div>`,
  revealText: `<h2 class="reveal-text">Text reveals from left to right</h2>`
};

// Animation customization options
const getDefaultCustomizationOptions = () => ({
  duration: 1,
  delay: 0,
  timing: 'ease',
  iterations: 'infinite'
});

// Main component
const AnimationsLibrary = () => {
  const [theme, setTheme] = useState('light');
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid');
  const [favoriteAnimations, setFavoriteAnimations] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [customizationOptions, setCustomizationOptions] = useState(getDefaultCustomizationOptions());
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(false);
  
  // Filter animations based on selected category and search
  const filteredAnimations = Object.keys(animationCategories).filter(animation => {
    const matchesCategory = selectedCategory === 'all' || 
                           selectedCategory === 'favorites' && favoriteAnimations.includes(animation) ||
                           animationCategories[animation] === selectedCategory;
    
    const matchesSearch = animation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         animationCategories[animation].toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  const categories = ['all', 'favorites', 'entrance', 'attention', 'continuous', 'special'];
  
  // Select an animation
  const handleSelectAnimation = (animation) => {
    setSelectedAnimation(animation);
    setCustomizationOptions(getDefaultCustomizationOptions());
    setShowCustomizationPanel(false);
  };
  
  // Toggle favorite status
  const toggleFavorite = (animation) => {
    setFavoriteAnimations(prev => 
      prev.includes(animation) 
        ? prev.filter(a => a !== animation)
        : [...prev, animation]
    );
  };
  
  // Copy code to clipboard
  const copyCodeToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  // Update customization options
  const updateCustomizationOption = (option, value) => {
    setCustomizationOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  // Generate customized CSS code
  const getCustomizedCode = () => {
    if (!selectedAnimation) return '';
    
    const originalCode = animationSnippets[selectedAnimation];
    let customizedCode = originalCode;
    
    if (customizationOptions.duration !== 1) {
      customizedCode = customizedCode.replace(
        /animation:.*?;/g, 
        (match) => match.replace(/\d+(\.\d+)?s/, `${customizationOptions.duration}s`)
      );
    }
    
    if (customizationOptions.delay > 0) {
      customizedCode = customizedCode.replace(
        /animation:.*?;/g, 
        (match) => {
          if (match.includes('delay')) {
            return match.replace(/\d+(\.\d+)?s delay/, `${customizationOptions.delay}s delay`);
          } else {
            return match.replace(';', ` ${customizationOptions.delay}s;`);
          }
        }
      );
    }
    
    if (customizationOptions.timing !== 'ease') {
      customizedCode = customizedCode.replace(
        /animation:.*?;/g, 
        (match) => {
          return match.replace(/(linear|ease|ease-in|ease-out|ease-in-out)/, customizationOptions.timing);
        }
      );
    }
    
    if (customizationOptions.iterations !== 'infinite') {
      customizedCode = customizedCode.replace(
        /animation:.*?;/g, 
        (match) => {
          if (match.includes('infinite')) {
            return match.replace(/infinite/, customizationOptions.iterations);
          } else {
            const insertPoint = match.lastIndexOf(';');
            return `${match.substring(0, insertPoint)} ${customizationOptions.iterations}${match.substring(insertPoint)}`;
          }
        }
      );
    }
    
    return customizedCode;
  };
  
  const getAnimationUsageCode = () => {
    if (!selectedAnimation) return '';
    return animationUsageExamples[selectedAnimation];
  };
  
  return (
    <div className={`min-h-screen mt-16 transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <style>{styleSheet}</style>
      
      {/* Header */}
      <header className={`py-4 px-6 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} sticky top-0 z-10`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                CSS Animation Library
              </div>
              
              <button 
                onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} 
                className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Monitor size={20} />
                ) : (
                  <Smartphone size={20} />
                )}
              </button>
            </div>
            
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search animations..."
                className={`pl-10 pr-4 py-2 w-full rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                } transition-colors duration-200`}
              />
            </div>
            
            <div className="flex items-center gap-2 md:justify-end">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded ${
                  view === 'grid' 
                    ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700' 
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Grid view"
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${
                  view === 'list' 
                    ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700' 
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="List view"
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-custom">
            {categories.map(category => (
              <CategoryPill
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                theme={theme}
                icon={category === 'favorites' ? <Heart size={14} /> : null}
              />
            ))}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Animation Grid/List */}
          <div className={`${selectedAnimation ? 'lg:w-3/5' : 'w-full'}`}>
            {filteredAnimations.length === 0 ? (
              <div className={`p-8 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-5xl mb-4">😕</div>
                <h3 className="text-xl font-medium mb-2">No animations found</h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className={`mt-4 px-4 py-2 rounded-md flex items-center justify-center gap-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  <RefreshCw size={16} />
                  Reset filters
                </button>
              </div>
            ) : (
              <div className={`${
                view === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'flex flex-col gap-3'
              }`}>
                {filteredAnimations.map(animation => (
                  <AnimationCard
                    key={animation}
                    animation={animation}
                    theme={theme}
                    isSelected={selectedAnimation === animation}
                    onSelect={() => handleSelectAnimation(animation)}
                    isFavorite={favoriteAnimations.includes(animation)}
                    onToggleFavorite={toggleFavorite}
                    customizationOptions={customizationOptions}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Animation Detail Panel */}
          {selectedAnimation && (
            <div className={`lg:w-2/5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
              <div className="flex justify-between items-center p-4 border-b 
                             ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}">
                <h2 className="text-xl font-bold">
                  {selectedAnimation.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(selectedAnimation)}
                    className={`p-1.5 rounded-full transition-all duration-200 ${
                      favoriteAnimations.includes(selectedAnimation) 
                        ? 'text-yellow-400' 
                        : theme === 'dark' ? 'text-gray-400 hover:text-yellow-300' : 'text-gray-500 hover:text-yellow-400'
                    }`}
                    title={favoriteAnimations.includes(selectedAnimation) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart size={18} fill={favoriteAnimations.includes(selectedAnimation) ? "currentColor" : "none"} />
                  </button>
                  
                  <button
                    onClick={() => setShowCustomizationPanel(!showCustomizationPanel)}
                    className={`p-1.5 rounded-full ${
                      theme === 'dark' 
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    title="Customize animation"
                  >
                    <Sliders size={18} />
                  </button>
                  
                  <button
                    onClick={() => setSelectedAnimation(null)}
                    className={`p-1.5 rounded-full ${
                      theme === 'dark' 
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    title="Close panel"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              {/* Animation Preview */}
              <div className={`p-8 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <div 
                  className={animationClassNames[selectedAnimation]}
                  style={{
                    animationDuration: `${customizationOptions.duration}s`,
                    animationDelay: customizationOptions.delay > 0 ? `${customizationOptions.delay}s` : undefined,
                    animationTimingFunction: customizationOptions.timing,
                    animationIterationCount: customizationOptions.iterations
                  }}
                >
                  {animationDisplayElements[selectedAnimation](theme)}
                </div>
              </div>
              
              {/* Customization Panel */}
              {showCustomizationPanel && (
                <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-850' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Customize Animation</h3>
                    <button
                      onClick={() => setCustomizationOptions(getDefaultCustomizationOptions())}
                      className={`text-xs px-2 py-1 rounded ${
                        theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      Reset
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Duration */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Duration: {customizationOptions.duration}s
                        </label>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={customizationOptions.duration}
                        onChange={(e) => updateCustomizationOption('duration', parseFloat(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    {/* Delay */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Delay: {customizationOptions.delay}s
                        </label>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.1"
                        value={customizationOptions.delay}
                        onChange={(e) => updateCustomizationOption('delay', parseFloat(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    {/* Timing Function */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Timing Function
                      </label>
                      <select
                        value={customizationOptions.timing}
                        onChange={(e) => updateCustomizationOption('timing', e.target.value)}
                        className={`w-full p-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="ease">ease</option>
                        <option value="linear">linear</option>
                        <option value="ease-in">ease-in</option>
                        <option value="ease-out">ease-out</option>
                        <option value="ease-in-out">ease-in-out</option>
                        <option value="cubic-bezier(0.68, -0.55, 0.27, 1.55)">bounce</option>
                      </select>
                    </div>
                    
                    {/* Iteration Count */}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Iterations
                      </label>
                      <select
                        value={customizationOptions.iterations}
                        onChange={(e) => updateCustomizationOption('iterations', e.target.value)}
                        className={`w-full p-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="infinite">infinite</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
          {/* Code Display */}
          <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>CSS Code</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyCodeToClipboard(getCustomizedCode())}
                      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition-colors
                        ${theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                    >
                      {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCode ? 'Copied!' : 'Copy code'}
                    </button>
                    <a
                      href={`data:text/css;charset=utf-8,${encodeURIComponent(getCustomizedCode())}`}
                      download={`${selectedAnimation}.css`}
                      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition-colors
                        ${theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                </div>
                <CodeDisplay
                  code={getCustomizedCode()}
                  theme={theme}
                  language="css"
                  onCopy={() => copyCodeToClipboard(getCustomizedCode())}
                />
              </div>
              
              {/* Usage Example */}
              <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    Usage Example
                  </h3>
                  <button
                    onClick={() => copyCodeToClipboard(getAnimationUsageCode())}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition-colors
                      ${theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  >
                    {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCode ? 'Copied!' : 'Copy example'}
                  </button>
                </div>
                <CodeDisplay
                  code={getAnimationUsageCode()}
                  theme={theme}
                  language="html"
                  onCopy={() => copyCodeToClipboard(getAnimationUsageCode())}
                />
              </div>
              
              {/* Additional Info */}
              <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Tips & Usage
                </h3>
                <div className={`text-sm space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>
                    <span className="font-medium">Category:</span> {animationCategories[selectedAnimation].charAt(0).toUpperCase() + animationCategories[selectedAnimation].slice(1)}
                  </p>
                  <p>
                    <span className="font-medium">Best for:</span> {
                      {
                        'entrance': 'Introducing new elements or transitions between pages',
                        'attention': 'Drawing focus to important elements or alerts',
                        'continuous': 'Maintaining visual interest with subtle movement',
                        'special': 'Creating unique interactive experiences'
                      }[animationCategories[selectedAnimation]]
                    }
                  </p>
                  <p>
                    <span className="font-medium">Performance:</span> {
                      ['fadeIn', 'slideIn', 'pulse', 'glowPulse'].includes(selectedAnimation)
                        ? 'High - Uses well-optimized properties'
                        : ['float', 'shake', 'heartbeat', 'ripple'].includes(selectedAnimation)
                          ? 'Medium - Generally performs well across devices'
                          : 'Use sparingly - May cause performance issues on low-end devices'
                    }
                  </p>
                  <div className="flex items-center gap-1 mt-3">
                    <Info size={16} className="text-blue-500" />
                    <span className="text-xs">Remember to include both keyframes and class in your CSS</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
    </div>
  );
};

export default AnimationsLibrary;