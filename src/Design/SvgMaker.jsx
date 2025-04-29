// import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import { Download, Circle, Square, Type, Triangle, ArrowUp, X, Copy, Trash2, Plus, Minus, Move, Grid, Save } from 'lucide-react';

// // Main SVG Maker Component
// export default function SVGMaker({ isOpen = true, onClose = () => {}, theme = 'light' }) {
//   // State management
//   const [elements, setElements] = useState([]);
//   const [selectedElement, setSelectedElement] = useState(null);
//   const [action, setAction] = useState('select'); // 'select', 'draw', 'move', 'resize'
//   const [shapeType, setShapeType] = useState('rect');
//   const [color, setColor] = useState('#3b82f6');
//   const [strokeColor, setStrokeColor] = useState('#000000');
//   const [strokeWidth, setStrokeWidth] = useState(2);
//   const [text, setText] = useState('Text');
//   const [fontSize, setFontSize] = useState(24);
//   const [showColorPicker, setShowColorPicker] = useState(false);
//   const [showStrokeColorPicker, setShowStrokeColorPicker] = useState(false);
//   const svgRef = useRef(null);
//   const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 600 });
//   const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
//   const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [copying, setCopying] = useState(false);
//   const [showGrid, setShowGrid] = useState(false);
//   const [gridSize, setGridSize] = useState(20);
//   const [downloadUrl, setDownloadUrl] = useState(null);
  
//   // For history tracking
//   const [history, setHistory] = useState([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   const [fileName, setFileName] = useState('drawing.svg');

//   // Colors palette
//   const colorPalette = useMemo(() => [
//     '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
//     '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
//     '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
//     '#ec4899', '#f43f5e', '#000000', '#ffffff'
//   ], []);

//   // Initialize history with empty array
//   useEffect(() => {
//     if (history.length === 0) {
//       setHistory([[]]);
//       setHistoryIndex(0);
//     }
//   }, []);

//   // Effect for tracking history when elements change
//   useEffect(() => {
//     if (elements.length > 0 || historyIndex === -1) {
//       // Only add to history if elements actually changed to avoid infinite loops
//       const currentState = JSON.stringify(elements);
//       const lastHistoryState = history[historyIndex] ? JSON.stringify(history[historyIndex]) : '';
      
//       if (currentState !== lastHistoryState) {
//         const newHistory = historyIndex === -1 ? [] : history.slice(0, historyIndex + 1);
//         newHistory.push([...elements]);
//         setHistory(newHistory);
//         setHistoryIndex(newHistory.length - 1);
//       }
//     }
//   }, [elements]);

//   // Effect for keyboard shortcuts
//   useEffect(() => {
//     if (!isOpen) return;

//     const handleKeyDown = (e) => {
//       // Delete key
//       if (e.key === 'Delete' && selectedElement) {
//         deleteSelected();
//       }
//       // Ctrl+Z for undo
//       if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
//         e.preventDefault();
//         undo();
//       }
//       // Ctrl+Y for redo
//       if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
//         e.preventDefault();
//         redo();
//       }
//       // Ctrl+D for duplicate
//       if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElement) {
//         e.preventDefault();
//         duplicateSelected();
//       }
//       // Escape to deselect
//       if (e.key === 'Escape') {
//         setSelectedElement(null);
//         setAction('select');
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [isOpen, selectedElement, history, historyIndex]);

//   // Clean up download URL when component unmounts
//   useEffect(() => {
//     return () => {
//       if (downloadUrl) {
//         URL.revokeObjectURL(downloadUrl);
//       }
//     };
//   }, [downloadUrl]);

//   // Handler functions
//   const handleSvgClick = useCallback((e) => {
//     if (!svgRef.current) return;
    
//     if (action === 'draw') {
//       const svgRect = svgRef.current.getBoundingClientRect();
//       const x = (e.clientX - svgRect.left) / zoom;
//       const y = (e.clientY - svgRect.top) / zoom;
      
//       if (shapeType === 'text') {
//         const newText = {
//           id: Date.now(),
//           type: 'text',
//           x: snapToGrid(x),
//           y: snapToGrid(y),
//           text,
//           fontSize,
//           fill: color,
//           stroke: strokeColor,
//           strokeWidth
//         };
//         setElements(prev => [...prev, newText]);
//         setSelectedElement(newText);
//         setAction('select'); // Automatically switch to select after placing text
//       } else {
//         setStartPoint({ x: snapToGrid(x), y: snapToGrid(y) });
//         setEndPoint({ x: snapToGrid(x), y: snapToGrid(y) });
//         setIsDragging(true);
//       }
//     } else if (action === 'select') {
//       // If clicking on canvas (not on an element), deselect
//       setSelectedElement(null);
//     }
//   }, [action, shapeType, text, fontSize, color, strokeColor, strokeWidth, zoom]);

//   const snapToGrid = useCallback((value) => {
//     if (!showGrid) return value;
//     return Math.round(value / gridSize) * gridSize;
//   }, [showGrid, gridSize]);

//   const handleMouseMove = useCallback((e) => {
//     if (!isDragging || !svgRef.current) return;
    
//     const svgRect = svgRef.current.getBoundingClientRect();
//     const x = (e.clientX - svgRect.left) / zoom;
//     const y = (e.clientY - svgRect.top) / zoom;
    
//     if (action === 'draw') {
//       setEndPoint({ x: snapToGrid(x), y: snapToGrid(y) });
//     } else if (action === 'move' && selectedElement) {
//       const newX = snapToGrid(x - dragOffset.x);
//       const newY = snapToGrid(y - dragOffset.y);
      
//       setElements(prev => prev.map(el => {
//         if (el.id === selectedElement.id) {
//           if (el.type === 'rect' || el.type === 'triangle' || el.type === 'text') {
//             return { ...el, x: newX, y: newY };
//           } else if (el.type === 'ellipse') {
//             return { ...el, x: newX, y: newY };
//           }
//         }
//         return el;
//       }));
//     }
//   }, [isDragging, action, selectedElement, dragOffset, zoom, snapToGrid]);

//   const handleMouseUp = useCallback(() => {
//     if (isDragging && action === 'draw') {
//       const newElement = createElementFromPoints();
//       if (newElement) {
//         setElements(prev => [...prev, newElement]);
//         setSelectedElement(newElement);
//         setAction('select'); // Automatically switch to select after drawing
//       }
//     }
//     setIsDragging(false);
//   }, [isDragging, action, elements]);

//   const startDragging = useCallback((e, element) => {
//     e.stopPropagation();
//     if (!svgRef.current) return;
    
//     if (action === 'select' || action === 'move') {
//       setSelectedElement(element);
//       setAction('move');
//       setIsDragging(true);
      
//       const svgRect = svgRef.current.getBoundingClientRect();
//       const x = (e.clientX - svgRect.left) / zoom;
//       const y = (e.clientY - svgRect.top) / zoom;
      
//       setDragOffset({ 
//         x: x - element.x, 
//         y: y - element.y 
//       });
//     }
//   }, [action, zoom]);

//   const createElementFromPoints = useCallback(() => {
//     // Ensure start point is the top-left corner for consistent element creation
//     const x1 = Math.min(startPoint.x, endPoint.x);
//     const y1 = Math.min(startPoint.y, endPoint.y);
//     const x2 = Math.max(startPoint.x, endPoint.x);
//     const y2 = Math.max(startPoint.y, endPoint.y);
    
//     const width = x2 - x1;
//     const height = y2 - y1;
    
//     // Ignore very small elements (likely accidental clicks)
//     if (width < 5 && height < 5) return null;
    
//     const commonProps = {
//       id: Date.now(),
//       fill: color,
//       stroke: strokeColor,
//       strokeWidth
//     };
    
//     if (shapeType === 'rect') {
//       return {
//         ...commonProps,
//         type: 'rect',
//         x: x1,
//         y: y1,
//         width,
//         height
//       };
//     } else if (shapeType === 'ellipse') {
//       return {
//         ...commonProps,
//         type: 'ellipse',
//         x: x1 + width / 2,
//         y: y1 + height / 2,
//         rx: width / 2,
//         ry: height / 2
//       };
//     } else if (shapeType === 'triangle') {
//       const points = `${x1 + width/2},${y1} ${x1},${y2} ${x2},${y2}`;
//       return {
//         ...commonProps,
//         type: 'triangle',
//         x: x1,
//         y: y1,
//         width,
//         height,
//         points
//       };
//     }
//     return null;
//   }, [startPoint, endPoint, shapeType, color, strokeColor, strokeWidth]);

//   // Element manipulation functions
//   const deleteSelected = useCallback(() => {
//     if (selectedElement) {
//       setElements(prev => prev.filter(el => el.id !== selectedElement.id));
//       setSelectedElement(null);
//     }
//   }, [selectedElement]);

//   const duplicateSelected = useCallback(() => {
//     if (selectedElement) {
//       const newElement = {
//         ...selectedElement,
//         id: Date.now(),
//         x: selectedElement.x + 20,
//         y: selectedElement.y + 20
//       };
//       setElements(prev => [...prev, newElement]);
//       setSelectedElement(newElement);
//     }
//   }, [selectedElement]);

//   const bringToFront = useCallback(() => {
//     if (selectedElement) {
//       setElements(prev => [
//         ...prev.filter(el => el.id !== selectedElement.id),
//         selectedElement
//       ]);
//     }
//   }, [selectedElement]);

//   // SVG export functions
//   const prepareSVGForExport = useCallback(() => {
//     if (!svgRef.current) return null;
    
//     // Create a clone of the SVG for export
//     const svgClone = svgRef.current.cloneNode(true);
    
//     // Remove any UI-specific elements (like selection indicators)
//     const elementsToRemove = svgClone.querySelectorAll('[data-ui-element="true"]');
//     elementsToRemove.forEach(el => el.remove());
    
//     return svgClone;
//   }, []);

//   const downloadSVG = useCallback(() => {
//     const svgForExport = prepareSVGForExport();
//     if (!svgForExport) return;
    
//     const svgContent = svgForExport.outerHTML;
//     const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    
//     // Revoke previous URL if exists
//     if (downloadUrl) {
//       URL.revokeObjectURL(downloadUrl);
//     }
    
//     const url = URL.createObjectURL(blob);
//     setDownloadUrl(url);
    
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }, [fileName, downloadUrl, prepareSVGForExport]);

//   const downloadCode = useCallback(() => {
//     const svgForExport = prepareSVGForExport();
//     if (!svgForExport) return;
    
//     const svgContent = svgForExport.outerHTML;
    
//     // Create a formatted version with indentation for readability
//     const formattedSVG = svgContent
//       .replace(/<([^\s>]+)([^>]*)\/>/g, "<$1$2></$1>") // Convert self-closing tags
//       .replace(/></g, ">\n<")                         // Add newlines between tags
//       .replace(/(<[^\/][^>]*>)/g, "  $1");            // Add indentation
    
//     const blob = new Blob([formattedSVG], { type: 'text/plain' });
    
//     // Revoke previous URL if exists
//     if (downloadUrl) {
//       URL.revokeObjectURL(downloadUrl);
//     }
    
//     const url = URL.createObjectURL(blob);
//     setDownloadUrl(url);
    
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${fileName.replace('.svg', '')}-code.txt`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }, [fileName, downloadUrl, prepareSVGForExport]);

//   const copySVGCode = useCallback(() => {
//     const svgForExport = prepareSVGForExport();
//     if (!svgForExport) return;
    
//     const svgContent = svgForExport.outerHTML;
    
//     navigator.clipboard.writeText(svgContent)
//       .then(() => {
//         setCopying(true);
//         setTimeout(() => setCopying(false), 2000);
//       });
//   }, [prepareSVGForExport]);

//   // History functions
//   const undo = useCallback(() => {
//     if (historyIndex > 0) {
//       setHistoryIndex(historyIndex - 1);
//       setElements(history[historyIndex - 1] || []);
//       setSelectedElement(null); // Deselect when undoing
//     }
//   }, [historyIndex, history]);

//   const redo = useCallback(() => {
//     if (historyIndex < history.length - 1) {
//       setHistoryIndex(historyIndex + 1);
//       setElements(history[historyIndex + 1] || []);
//       setSelectedElement(null); // Deselect when redoing
//     }
//   }, [historyIndex, history]);

//   // Rendering functions
//   const renderElement = useCallback((element) => {
//     const isSelected = selectedElement && selectedElement.id === element.id;
//     const selectedProps = isSelected ? {
//       strokeDasharray: "5,5",
//       strokeWidth: element.strokeWidth + 1
//     } : {};
    
//     switch (element.type) {
//       case 'rect':
//         return (
//           <rect
//             key={element.id}
//             x={element.x}
//             y={element.y}
//             width={element.width}
//             height={element.height}
//             fill={element.fill}
//             stroke={isSelected ? "#ff0000" : element.stroke}
//             strokeWidth={element.strokeWidth}
//             onClick={(e) => startDragging(e, element)}
//             style={{ cursor: 'move' }}
//             {...selectedProps}
//           />
//         );
//       case 'ellipse':
//         return (
//           <ellipse
//             key={element.id}
//             cx={element.x}
//             cy={element.y}
//             rx={element.rx}
//             ry={element.ry}
//             fill={element.fill}
//             stroke={isSelected ? "#ff0000" : element.stroke}
//             strokeWidth={element.strokeWidth}
//             onClick={(e) => startDragging(e, element)}
//             style={{ cursor: 'move' }}
//             {...selectedProps}
//           />
//         );
//       case 'triangle':
//         return (
//           <polygon
//             key={element.id}
//             points={element.points}
//             fill={element.fill}
//             stroke={isSelected ? "#ff0000" : element.stroke}
//             strokeWidth={element.strokeWidth}
//             onClick={(e) => startDragging(e, element)}
//             style={{ cursor: 'move' }}
//             {...selectedProps}
//           />
//         );
//       case 'text':
//         return (
//           <text
//             key={element.id}
//             x={element.x}
//             y={element.y}
//             fill={element.fill}
//             fontSize={element.fontSize}
//             fontFamily="Arial, sans-serif"
//             onClick={(e) => startDragging(e, element)}
//             style={{ cursor: 'move' }}
//             {...selectedProps}
//           >
//             {element.text}
//           </text>
//         );
//       default:
//         return null;
//     }
//   }, [selectedElement, startDragging]);

//   const renderPreview = useCallback(() => {
//     if (!isDragging || action !== 'draw') return null;
    
//     const x1 = Math.min(startPoint.x, endPoint.x);
//     const y1 = Math.min(startPoint.y, endPoint.y);
//     const x2 = Math.max(startPoint.x, endPoint.x);
//     const y2 = Math.max(startPoint.y, endPoint.y);
    
//     const width = x2 - x1;
//     const height = y2 - y1;
    
//     switch (shapeType) {
//       case 'rect':
//         return (
//           <rect
//             x={x1}
//             y={y1}
//             width={width}
//             height={height}
//             fill={color}
//             stroke={strokeColor}
//             strokeWidth={strokeWidth}
//             opacity={0.6}
//             data-ui-element="true"
//           />
//         );
//       case 'ellipse':
//         return (
//           <ellipse
//             cx={x1 + width / 2}
//             cy={y1 + height / 2}
//             rx={width / 2}
//             ry={height / 2}
//             fill={color}
//             stroke={strokeColor}
//             strokeWidth={strokeWidth}
//             opacity={0.6}
//             data-ui-element="true"
//           />
//         );
//       case 'triangle':
//         const points = `${x1 + width/2},${y1} ${x1},${y2} ${x2},${y2}`;
//         return (
//           <polygon
//             points={points}
//             fill={color}
//             stroke={strokeColor}
//             strokeWidth={strokeWidth}
//             opacity={0.6}
//             data-ui-element="true"
//           />
//         );
//       default:
//         return null;
//     }
//   }, [isDragging, action, shapeType, startPoint, endPoint, color, strokeColor, strokeWidth]);

//   const renderGrid = useCallback(() => {
//     if (!showGrid) return null;
    
//     const horizontalLines = [];
//     const verticalLines = [];
    
//     for (let i = 0; i <= svgDimensions.height; i += gridSize) {
//       horizontalLines.push(
//         <line 
//           key={`h-${i}`}
//           x1={0}
//           y1={i}
//           x2={svgDimensions.width}
//           y2={i}
//           stroke="#cccccc"
//           strokeWidth={0.5}
//           data-ui-element="true"
//         />
//       );
//     }
    
//     for (let i = 0; i <= svgDimensions.width; i += gridSize) {
//       verticalLines.push(
//         <line 
//           key={`v-${i}`}
//           x1={i}
//           y1={0}
//           x2={i}
//           y2={svgDimensions.height}
//           stroke="#cccccc"
//           strokeWidth={0.5}
//           data-ui-element="true"
//         />
//       );
//     }
    
//     return (
//       <g opacity={0.3}>
//         {horizontalLines}
//         {verticalLines}
//       </g>
//     );
//   }, [showGrid, gridSize, svgDimensions]);

//   // Determine theme-specific styles
//   const bgColor = theme === 'light' ? 'bg-gray-100' : 'bg-gray-900';
//   const textColor = theme === 'light' ? 'text-gray-900' : 'text-gray-100';
//   const buttonBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
//   const buttonHover = theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700';
//   const borderColor = theme === 'light' ? 'border-gray-300' : 'border-gray-700';
//   const canvasBg = theme === 'light' ? '#ffffff' : '#1e1e1e';
//   const activeBg = theme === 'light' ? 'bg-blue-100' : 'bg-blue-900';

//   if (!isOpen) return null;

//   return (
//     <div className={`fixed inset-0 mt-16 ${bgColor} ${textColor} flex flex-col overflow-hidden`}>
//       {/* Header with title and main controls */}
//       <div className="border-b p-3 flex justify-between items-center">
//         <div className="text-2xl font-bold">SVG Maker</div>
//         <div className="flex gap-2">
//           <div className="flex items-center mr-4">
//             <input
//               type="text"
//               value={fileName}
//               onChange={(e) => setFileName(e.target.value)}
//               className={`${buttonBg} px-2 py-1 rounded border ${borderColor} text-sm w-40`}
//               placeholder="filename.svg"
//             />
//           </div>
//           <button 
//             onClick={downloadSVG}
//             className={`p-2 rounded ${buttonBg} ${buttonHover} flex items-center gap-1`}
//             title="Download SVG"
//           >
//             <Download size={20} />
//             <span className="text-sm">SVG</span>
//           </button>
//           <button 
//             onClick={downloadCode}
//             className={`p-2 rounded ${buttonBg} ${buttonHover} flex items-center gap-1`}
//             title="Download Code"
//           >
//             <Save size={20} />
//             <span className="text-sm">Code</span>
//           </button>
//           <button 
//             onClick={copySVGCode}
//             className={`p-2 rounded ${buttonBg} ${buttonHover} relative flex items-center gap-1`}
//             title="Copy SVG code"
//           >
//             <Copy size={20} />
//             <span className="text-sm">Copy</span>
//             {copying && (
//               <span className="absolute -top-8 -left-8 bg-green-500 text-white text-xs px-2 py-1 rounded">
//                 Copied!
//               </span>
//             )}
//           </button>
//           <button 
//             onClick={onClose}
//             className={`p-2 rounded ${buttonBg} ${buttonHover}`}
//             title="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>
//       </div>
      
//       <div className="flex flex-1 overflow-hidden">
//         {/* Tools panel */}
//         <div className={`w-64 p-4 border-r ${borderColor} overflow-y-auto`}>
//           {/* Tools section */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">Tools</div>
//             <div className="grid grid-cols-2 gap-2">
//               <button 
//                 onClick={() => setAction('select')}
//                 className={`p-2 rounded flex items-center justify-center gap-1 ${buttonBg} ${buttonHover} ${action === 'select' ? activeBg : ''}`}
//               >
//                 <Move size={16} />
//                 <span>Select</span>
//               </button>
//               <button 
//                 onClick={() => setAction('draw')}
//                 className={`p-2 rounded flex items-center justify-center gap-1 ${buttonBg} ${buttonHover} ${action === 'draw' ? activeBg : ''}`}
//               >
//                 <Square size={16} />
//                 <span>Draw</span>
//               </button>
//             </div>
//           </div>
          
//           {/* Shapes section */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">Shapes</div>
//             <div className="grid grid-cols-4 gap-2">
//               <button 
//                 onClick={() => {
//                   setShapeType('rect');
//                   setAction('draw');
//                 }}
//                 className={`p-2 rounded flex items-center justify-center ${buttonBg} ${buttonHover} ${shapeType === 'rect' && action === 'draw' ? activeBg : ''}`}
//                 title="Rectangle"
//               >
//                 <Square size={20} />
//               </button>
//               <button 
//                 onClick={() => {
//                   setShapeType('ellipse');
//                   setAction('draw');
//                 }}
//                 className={`p-2 rounded flex items-center justify-center ${buttonBg} ${buttonHover} ${shapeType === 'ellipse' && action === 'draw' ? activeBg : ''}`}
//                 title="Circle"
//               >
//                 <Circle size={20} />
//               </button>
//               <button 
//                 onClick={() => {
//                   setShapeType('triangle');
//                   setAction('draw');
//                 }}
//                 className={`p-2 rounded flex items-center justify-center ${buttonBg} ${buttonHover} ${shapeType === 'triangle' && action === 'draw' ? activeBg : ''}`}
//                 title="Triangle"
//               >
//                 <Triangle size={20} />
//               </button>
//               <button 
//                 onClick={() => {
//                   setShapeType('text');
//                   setAction('draw');
//                 }}
//                 className={`p-2 rounded flex items-center justify-center ${buttonBg} ${buttonHover} ${shapeType === 'text' && action === 'draw' ? activeBg : ''}`}
//                 title="Text"
//               >
//                 <Type size={20} />
//               </button>
//             </div>
//           </div>
          
//           {/* Fill Color section */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">Fill Color</div>
//             <div className="flex items-center mb-2">
//               <div 
//                 className="w-8 h-8 rounded mr-2 cursor-pointer border border-gray-400" 
//                 style={{ backgroundColor: color }}
//                 onClick={() => setShowColorPicker(!showColorPicker)}
//               />
//               <input 
//                 type="text" 
//                 value={color} 
//                 onChange={e => setColor(e.target.value)}
//                 className={`${buttonBg} px-2 py-1 rounded flex-1 border ${borderColor}`}
//               />
//             </div>
            
//             {showColorPicker && (
//               <div className="grid grid-cols-5 gap-2 mb-2">
//                 {colorPalette.map(c => (
//                   <div 
//                     key={c} 
//                     className="w-8 h-8 rounded cursor-pointer border border-gray-400" 
//                     style={{ backgroundColor: c }}
//                     onClick={() => {
//                       setColor(c);
//                       setShowColorPicker(false);
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
          
//           {/* Stroke settings */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">Stroke</div>
//             <div className="flex items-center mb-2">
//               <div 
//                 className="w-8 h-8 rounded mr-2 cursor-pointer border border-gray-400" 
//                 style={{ backgroundColor: strokeColor }}
//                 onClick={() => setShowStrokeColorPicker(!showStrokeColorPicker)}
//               />
//               <input 
//                 type="text" 
//                 value={strokeColor} 
//                 onChange={e => setStrokeColor(e.target.value)}
//                 className={`${buttonBg} px-2 py-1 rounded flex-1 border ${borderColor}`}
//               />
//             </div>
            
//             {showStrokeColorPicker && (
//               <div className="grid grid-cols-5 gap-2 mb-2">
//                 {colorPalette.map(c => (
//                   <div 
//                     key={c} 
//                     className="w-8 h-8 rounded cursor-pointer border border-gray-400" 
//                     style={{ backgroundColor: c }}
//                     onClick={() => {
//                       setStrokeColor(c);
//                       setShowStrokeColorPicker(false);
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
            
//             <div className="font-semibold mb-2">Stroke Width</div>
//             <div className="flex items-center">
//               <input 
//                 type="range" 
//                 min="0" 
//                 max="20" 
//                 value={strokeWidth} 
//                 onChange={e => setStrokeWidth(parseInt(e.target.value))}
//                 className="w-full"
//               />
//               <span className="ml-2 w-8 text-center">{strokeWidth}</span>
//             </div>
//           </div>
          
//           {/* Text settings */}
//           {shapeType === 'text' && (
//             <div className="mb-6">
//               <div className="font-semibold mb-2">Text</div>
//               <input 
//                 type="text" 
//                 value={text} 
//                 onChange={e => setText(e.target.value)}
//                 className={`${buttonBg} px-2 py-1 rounded w-full border ${borderColor} mb-2`}
//               />
              
//               <div className="font-semibold mb-2">Font Size</div>
//               <div className="flex items-center">
//                 <input 
//                   type="range" 
//                   min="10" 
//                   max="72" 
//                   value={fontSize} 
//                   onChange={e => setFontSize(parseInt(e.target.value))}
//                   className="w-full"
//                 />
//                 <span className="ml-2 w-8 text-center">{fontSize}</span>
//               </div>
//             </div>
//           )}
          
//           {/* Grid settings */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">Grid</div>
//             <div className="flex items-center mb-2">
//               <input 
//                 type="checkbox" 
//                 id="showGrid" 
//                 checked={showGrid} 
//                 onChange={() => setShowGrid(!showGrid)}
//                 className="mr-2"
//               />
//               <label htmlFor="showGrid">Show Grid</label>
//             </div>
//             {showGrid && (
//               <div className="flex items-center">
//                 <span className="mr-2">Size:</span>
//                 <input 
//                   type="range" 
//                   min="5" 
//                   max="50" 
//                   value={gridSize} 
//                   onChange={e => setGridSize(parseInt(e.target.value))}
//                   className="w-full"
//                 />
//                 <span className="ml-2 w-8 text-center">{gridSize}</span>
//               </div>
//             )}
//           </div>
          
//           {/* Zoom controls */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">Zoom</div>
//             <div className="flex items-center">
//               <button 
//                 onClick={() => setZoom(prev => Math.max(0.25, prev - 0.25))}
//                 className={`p-2 rounded ${buttonBg} ${buttonHover}`}
//                 disabled={zoom <= 0.25}
//               >
//                 <Minus size={16} />
//               </button>
//               <span className="mx-2">{Math.round(zoom * 100)}%</span>
//               <button 
//                 onClick={() => setZoom(prev => prev + 0.25)}
//                 className={`p-2 rounded ${buttonBg} ${buttonHover}`}
//               >
//                 <Plus size={16} />
//               </button>
//             </div>
//           </div>
          
//           {/* History controls */}
//           <div className="mb-6">
//             <div className="font-semibold mb-2">History</div>
//             <div className="grid grid-cols-2 gap-2">
//               <button 
//                 onClick={undo}
//                 disabled={historyIndex <= 0}
//                 className={`p-2 rounded flex items-center justify-center gap-1 ${buttonBg} ${buttonHover} ${historyIndex <= 0 ? 'opacity-50' : ''}`}
//               >
//                 <ArrowUp size={16} className="transform rotate-90" />
//                 <span>Undo</span>
//               </button>
//               <button 
//                 onClick={redo}
//                 disabled={historyIndex >= history.length - 1}
//                 className={`p-2 rounded flex items-center justify-center gap-1 ${buttonBg} ${buttonHover} ${historyIndex >= history.length - 1 ? 'opacity-50' : ''}`}
//               >
//                 <ArrowUp size={16} className="transform -rotate-90" />
//                 <span>Redo</span>
//               </button>
//             </div>
//           </div>
          
//           {/* Selection tools */}
//           {selectedElement && (
//             <div className="mb-6">
//               <div className="font-semibold mb-2">Selection</div>
//               <div className="grid grid-cols-2 gap-2">
//                 <button 
//                   onClick={deleteSelected}
//                   className={`p-2 rounded flex items-center justify-center gap-1 ${buttonBg} ${buttonHover}`}
//                 >
//                   <Trash2 size={16} />
//                   <span>Delete</span>
//                 </button>
//                 <button 
//                   onClick={duplicateSelected}
//                   className={`p-2 rounded flex items-center justify-center gap-1 ${buttonBg} ${buttonHover}`}
//                 >
//                   <Copy size={16} />
//                   <span>Duplicate</span>
//                 </button>
//                 <button 
//                   onClick={bringToFront}
//                   className={`p-2 rounded flex items-center justify-center gap-1 ${buttonBg} ${buttonHover}`}
//                 >
//                   <ArrowUp size={16} />
//                   <span>To Front</span>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* Canvas area */}
//         <div className="flex-1 overflow-auto flex items-center justify-center p-4">
//           <div className="relative">
//             <svg 
//               ref={svgRef}
//               width={svgDimensions.width}
//               height={svgDimensions.height}
//               style={{ 
//                 backgroundColor: canvasBg,
//                 transform: `scale(${zoom})`,
//                 transformOrigin: '0 0'
//               }}
//               className={`border ${borderColor}`}
//               onClick={handleSvgClick}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//               onMouseLeave={handleMouseUp}
//             >
//               {renderGrid()}
//               {elements.map(renderElement)}
//               {renderPreview()}
//             </svg>
            
//             {/* Canvas size controls */}
//             <div className={`absolute -top-10 left-0 flex items-center ${buttonBg} rounded p-1 text-xs`}>
//               <span className="mr-2">Canvas:</span>
//               <input 
//                 type="number" 
//                 value={svgDimensions.width} 
//                 onChange={(e) => setSvgDimensions(prev => ({ ...prev, width: parseInt(e.target.value) || 100 }))}
//                 className={`${buttonBg} border ${borderColor} w-16 px-1 py-0.5 rounded`}
//               />
//               <span className="mx-1">×</span>
//               <input 
//                 type="number" 
//                 value={svgDimensions.height} 
//                 onChange={(e) => setSvgDimensions(prev => ({ ...prev, height: parseInt(e.target.value) || 100 }))}
//                 className={`${buttonBg} border ${borderColor} w-16 px-1 py-0.5 rounded`}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react'

const SvgMaker = () => {
  return (
    <div>
      
    </div>
  )
}

export default SvgMaker
