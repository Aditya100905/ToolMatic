import { useState, useEffect, useRef } from "react";
import {
  Copy,
  Check,
  X,
  Download,
  Save,
  Trash2,
  Plus,
  Settings,
  RotateCw,
  Code,
  Layers,
  Grid as GridIcon,
  Move,
  LayoutGrid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  MoreHorizontal,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Maximize,
  Minimize,
} from "lucide-react";

const FlexGridGenerator = ({ theme = "light" }) => {
  // Main states
  const [layoutType, setLayoutType] = useState("flexbox"); // flexbox or grid
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [containerSettings, setContainerSettings] = useState({
    width: "500px",
    height: "400px",
    background: "#f0f0f0",
    padding: "20px",
    gap: "10px",
    borderRadius: "8px",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    alignItems: "center",
    // Grid specific
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "auto",
    gridAutoFlow: "row",
  });

  // UI states
  const [cssCode, setCssCode] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [isEditingContainer, setIsEditingContainer] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [savedLayouts, setSavedLayouts] = useState([]);
  const [layoutName, setLayoutName] = useState("");
  const [activeSettingsTab, setActiveSettingsTab] = useState("container");
  const [isResizing, setIsResizing] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [draggedElement, setDraggedElement] = useState(null);

  // References
  const containerRef = useRef(null);
  const resizeHandleRef = useRef(null);

  // Load saved layouts from local storage
  useEffect(() => {
    const storedLayouts = localStorage.getItem("savedLayouts");
    if (storedLayouts) {
      setSavedLayouts(JSON.parse(storedLayouts));
    }
  }, []);

  // Generate a new unique element
  const addNewElement = () => {
    const newId = Date.now().toString();
    const randomHue = Math.floor(Math.random() * 360);
    const newElement = {
      id: newId,
      width: "100px",
      height: "100px",
      background: `hsl(${randomHue}, 80%, 80%)`,
      color: `hsl(${randomHue}, 80%, 30%)`,
      borderRadius: "4px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "10px",
      flexGrow: "0",
      flexShrink: "1",
      flexBasis: "auto",
      // Grid specific
      gridColumn: "auto",
      gridRow: "auto",
      alignSelf: "auto",
      justifySelf: "auto",
      content: `Item ${elements.length + 1}`,
    };

    setElements([...elements, newElement]);
    setSelectedElementId(newId);
    setActiveSettingsTab("element");
  };

  // Remove an element
  const removeElement = (id) => {
    const filteredElements = elements.filter((element) => element.id !== id);
    setElements(filteredElements);
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // Update container settings
  const updateContainerSetting = (property, value) => {
    setContainerSettings({
      ...containerSettings,
      [property]: value,
    });
  };

  // Update element settings
  const updateElementSetting = (id, property, value) => {
    const updatedElements = elements.map((element) => {
      if (element.id === id) {
        return { ...element, [property]: value };
      }
      return element;
    });
    setElements(updatedElements);
  };

  // Generate CSS and HTML code
  useEffect(() => {
    // Generate container CSS
    let containerCSS = `.container {\n`;
    containerCSS += `  width: ${containerSettings.width};\n`;
    containerCSS += `  height: ${containerSettings.height};\n`;
    containerCSS += `  background: ${containerSettings.background};\n`;
    containerCSS += `  padding: ${containerSettings.padding};\n`;
    containerCSS += `  gap: ${containerSettings.gap};\n`;
    containerCSS += `  border-radius: ${containerSettings.borderRadius};\n`;

    if (layoutType === "flexbox") {
      containerCSS += `  display: flex;\n`;
      containerCSS += `  flex-direction: ${containerSettings.flexDirection};\n`;
      containerCSS += `  flex-wrap: ${containerSettings.flexWrap};\n`;
      containerCSS += `  justify-content: ${containerSettings.justifyContent};\n`;
      containerCSS += `  align-items: ${containerSettings.alignItems};\n`;
    } else {
      containerCSS += `  display: grid;\n`;
      containerCSS += `  grid-template-columns: ${containerSettings.gridTemplateColumns};\n`;
      containerCSS += `  grid-template-rows: ${containerSettings.gridTemplateRows};\n`;
      containerCSS += `  grid-auto-flow: ${containerSettings.gridAutoFlow};\n`;
    }
    containerCSS += `}\n\n`;

    // Generate elements CSS
    let elementsCSS = "";
    elements.forEach((element, index) => {
      elementsCSS += `.item-${index + 1} {\n`;
      elementsCSS += `  width: ${element.width};\n`;
      elementsCSS += `  height: ${element.height};\n`;
      elementsCSS += `  background: ${element.background};\n`;
      elementsCSS += `  color: ${element.color};\n`;
      elementsCSS += `  border-radius: ${element.borderRadius};\n`;
      elementsCSS += `  padding: ${element.padding};\n`;

      if (layoutType === "flexbox") {
        if (element.flexGrow !== "0")
          elementsCSS += `  flex-grow: ${element.flexGrow};\n`;
        if (element.flexShrink !== "1")
          elementsCSS += `  flex-shrink: ${element.flexShrink};\n`;
        if (element.flexBasis !== "auto")
          elementsCSS += `  flex-basis: ${element.flexBasis};\n`;
      } else {
        if (element.gridColumn !== "auto")
          elementsCSS += `  grid-column: ${element.gridColumn};\n`;
        if (element.gridRow !== "auto")
          elementsCSS += `  grid-row: ${element.gridRow};\n`;
        if (element.alignSelf !== "auto")
          elementsCSS += `  align-self: ${element.alignSelf};\n`;
        if (element.justifySelf !== "auto")
          elementsCSS += `  justify-self: ${element.justifySelf};\n`;
      }

      elementsCSS += `  display: flex;\n`;
      elementsCSS += `  justify-content: center;\n`;
      elementsCSS += `  align-items: center;\n`;
      elementsCSS += `}\n\n`;
    });

    setCssCode(containerCSS + elementsCSS);

    // Generate HTML code
    let html = `<div class="container">\n`;
    elements.forEach((element, index) => {
      html += `  <div class="item-${index + 1}">${element.content}</div>\n`;
    });
    html += `</div>`;

    setHtmlCode(html);
  }, [elements, containerSettings, layoutType]);

  // Copy code to clipboard
  const copyCodeToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Generate CSS for elements for the preview
  const getElementStyle = (element) => {
    const style = {
      width: element.width,
      height: element.height,
      background: element.background,
      color: element.color,
      borderRadius: element.borderRadius,
      padding: element.padding,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    };

    if (layoutType === "flexbox") {
      style.flexGrow = element.flexGrow;
      style.flexShrink = element.flexShrink;
      style.flexBasis = element.flexBasis;
    } else {
      if (element.gridColumn !== "auto") style.gridColumn = element.gridColumn;
      if (element.gridRow !== "auto") style.gridRow = element.gridRow;
      if (element.alignSelf !== "auto") style.alignSelf = element.alignSelf;
      if (element.justifySelf !== "auto")
        style.justifySelf = element.justifySelf;
    }

    return style;
  };

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing && containerRef.current) {
        const width =
          e.clientX - containerRef.current.getBoundingClientRect().left;
        const height =
          e.clientY - containerRef.current.getBoundingClientRect().top;

        setContainerSettings({
          ...containerSettings,
          width: `${Math.max(200, width)}px`,
          height: `${Math.max(150, height)}px`,
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, containerSettings]);

  // Save layout
  const saveLayout = () => {
    if (!layoutName.trim()) return;

    const newLayout = {
      id: Date.now().toString(),
      name: layoutName,
      type: layoutType,
      containerSettings: { ...containerSettings },
      elements: [...elements],
    };

    const updatedLayouts = [...savedLayouts, newLayout];
    setSavedLayouts(updatedLayouts);
    localStorage.setItem("savedLayouts", JSON.stringify(updatedLayouts));

    setSaveModalOpen(false);
    setLayoutName("");
  };

  // Load layout
  const loadLayout = (layout) => {
    setLayoutType(layout.type);
    setContainerSettings({ ...layout.containerSettings });
    setElements([...layout.elements]);
    setSelectedElementId(null);
    setActiveTab("editor");
  };

  // Delete layout
  const deleteLayout = (id, e) => {
    e.stopPropagation();
    const updatedLayouts = savedLayouts.filter((layout) => layout.id !== id);
    setSavedLayouts(updatedLayouts);
    localStorage.setItem("savedLayouts", JSON.stringify(updatedLayouts));
  };

  // Download layout as JSON
  const downloadLayout = () => {
    const layout = {
      type: layoutType,
      containerSettings: { ...containerSettings },
      elements: [...elements],
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(layout, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "layout.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // CSS for the generator
  const styleSheet = `
    .container-preview {
      transition: all 0.3s ease;
      position: relative;
      overflow: visible;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .element-item {
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      user-select: none;
      position: relative;
    }
    
    .element-item.selected {
      box-shadow: 0 0 0 2px #3b82f6;
    }
    
    .resize-handle {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 20px;
      height: 20px;
      cursor: nwse-resize;
      z-index: 10;
    }
    
    .controls-bar {
      position: absolute;
      top: -30px;
      left: 0;
      right: 0;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 0 8px;
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
    
    .saved-layout-card {
      transition: all 0.2s ease;
    }
    
    .saved-layout-card:hover {
      transform: translateY(-4px);
    }
    
    @keyframes fadeIn {
      from { opacity: 0 }
      to { opacity: 1 }
    }
    
    .fade-in {
      animation: fadeIn 0.3s ease forwards;
    }
    
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0 }
      to { transform: translateY(0); opacity: 1 }
    }
    
    .slide-in {
      animation: slideIn 0.3s ease forwards;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
    }
    
    .modal {
      background: white;
      border-radius: 8px;
      padding: 20px;
      width: 400px;
      max-width: 90%;
    }
    
    .color-input-wrapper {
      position: relative;
      display: flex;
    }
    
    .color-picker {
      width: 30px;
      height: 30px;
      padding: 0;
      border: none;
      cursor: pointer;
    }
    
    @media (max-width: 768px) {
      .grid-cols-2 {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <div
      className={`min-h-screen mt-20 transition-colors duration-200 ${
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
            {layoutType === "flexbox" ? (
              <LayoutGrid className="w-6 h-6 text-blue-500" />
            ) : (
              <GridIcon className="w-6 h-6 text-indigo-500" />
            )}
            <h1 className="text-xl font-bold">Layout Builder</h1>
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
              onClick={() => setActiveTab("code")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === "code"
                  ? theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-900"
                  : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Code
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
              My Layouts
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {/* Editor Tab */}
        {activeTab === "editor" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left sidebar */}
            <div
              className={`col-span-1 lg:col-span-2 p-6 rounded-lg ${
                theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"
              }`}
            >
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Layout Type</h2>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLayoutType("flexbox")}
                    className={`py-2 px-3 rounded-md flex items-center justify-center gap-2 ${
                      layoutType === "flexbox"
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700 border border-blue-300"
                        : theme === "dark"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <LayoutGrid size={16} />
                    Flexbox
                  </button>
                  <button
                    onClick={() => setLayoutType("grid")}
                    className={`py-2 px-3 rounded-md flex items-center justify-center gap-2 ${
                      layoutType === "grid"
                        ? theme === "dark"
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-100 text-indigo-700 border border-indigo-300"
                        : theme === "dark"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <GridIcon size={16} />
                    Grid
                  </button>
                </div>
              </div>

              {/* Settings Tabs */}
              <div className="mb-6">
                <div className="flex border-b mb-4">
                  <button
                    onClick={() => setActiveSettingsTab("container")}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeSettingsTab === "container"
                        ? theme === "dark"
                          ? "border-b-2 border-blue-500 text-blue-400"
                          : "border-b-2 border-blue-500 text-blue-600"
                        : ""
                    }`}
                  >
                    Container
                  </button>
                  <button
                    onClick={() => {
                      if (selectedElementId) setActiveSettingsTab("element");
                    }}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeSettingsTab === "element"
                        ? theme === "dark"
                          ? "border-b-2 border-blue-500 text-blue-400"
                          : "border-b-2 border-blue-500 text-blue-600"
                        : selectedElementId
                          ? ""
                          : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!selectedElementId}
                  >
                    Element
                  </button>
                </div>

                {/* Container Settings */}
                {activeSettingsTab === "container" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Size
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs mb-1">Width</label>
                          <input
                            type="text"
                            value={containerSettings.width}
                            onChange={(e) =>
                              updateContainerSetting("width", e.target.value)
                            }
                            className={`w-full px-3 py-2 rounded text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-300"
                            } border`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1">Height</label>
                          <input
                            type="text"
                            value={containerSettings.height}
                            onChange={(e) =>
                              updateContainerSetting("height", e.target.value)
                            }
                            className={`w-full px-3 py-2 rounded text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-300"
                            } border`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Background
                        </label>
                        <div className="color-input-wrapper">
                          <input
                            type="color"
                            value={containerSettings.background}
                            onChange={(e) =>
                              updateContainerSetting(
                                "background",
                                e.target.value
                              )
                            }
                            className="color-picker rounded-l"
                          />
                          <input
                            type="text"
                            value={containerSettings.background}
                            onChange={(e) =>
                              updateContainerSetting(
                                "background",
                                e.target.value
                              )
                            }
                            className={`flex-1 px-3 py-2 rounded-r text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-300"
                            } border`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Border Radius
                        </label>
                        <input
                          type="text"
                          value={containerSettings.borderRadius}
                          onChange={(e) =>
                            updateContainerSetting(
                              "borderRadius",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 rounded text-sm ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-300"
                          } border`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Padding
                        </label>
                        <input
                          type="text"
                          value={containerSettings.padding}
                          onChange={(e) =>
                            updateContainerSetting("padding", e.target.value)
                          }
                          className={`w-full px-3 py-2 rounded text-sm ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-300"
                          } border`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Gap
                        </label>
                        <input
                          type="text"
                          value={containerSettings.gap}
                          onChange={(e) =>
                            updateContainerSetting("gap", e.target.value)
                          }
                          className={`w-full px-3 py-2 rounded text-sm ${
                            theme === "dark"
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-300"
                          } border`}
                        />
                      </div>
                    </div>

                    {/* Flexbox specific settings */}
                    {layoutType === "flexbox" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Direction
                          </label>
                          <select
                            value={containerSettings.flexDirection}
                            onChange={(e) =>
                              updateContainerSetting(
                                "flexDirection",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 rounded text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-300"
                            } border`}
                          >
                            <option value="row">Row</option>
                            <option value="row-reverse">Row Reverse</option>
                            <option value="column">Column</option>
                            <option value="column-reverse">
                              Column Reverse
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Wrap
                          </label>
                          <select
                            value={containerSettings.flexWrap}
                            onChange={(e) =>
                              updateContainerSetting("flexWrap", e.target.value)
                            }
                            className={`w-full px-3 py-2 rounded text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-300"
                            } border`}
                          >
                            <option value="nowrap">No Wrap</option>
                            <option value="wrap">Wrap</option>
                            <option value="wrap-reverse">Wrap Reverse</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Justify Content
                          </label>
                          <select
                            value={containerSettings.justifyContent}
                            onChange={(e) =>
                              updateContainerSetting(
                                "justifyContent",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 rounded text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-300"
                            } border`}
                          >
                            <option value="flex-start">Flex Start</option>
                            <option value="flex-end">Flex End</option>
                            <option value="center">Center</option>
                            <option value="space-between">Space Between</option>
                            <option value="space-around">Space Around</option>
                            <option value="space-evenly">Space Evenly</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Align Items
                          </label>
                          <select
                            value={containerSettings.alignItems}
                            onChange={(e) =>
                              updateContainerSetting(
                                "alignItems",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 rounded text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-300"
                            } border`}
                          >
                            <option value="stretch">Stretch</option>
                            <option value="flex-start">Flex Start</option>
                            <option value="flex-end">Flex End</option>
                            <option value="center">Center</option>
                            <option value="baseline">Baseline</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Grid specific settings */}
                    {layoutType === "grid" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Grid Template Columns
                          </label>
                          <input
                            type="text"
                            value={containerSettings.gridTemplateColumns}
                            onChange={(e) =>
                              updateContainerSetting(
                                "gridTemplateColumns",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 rounded text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-300"
                            } border`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Grid Template Rows
                          </label>
                          <input
                            type="text"
                            value={containerSettings.gridTemplateRows}
                            onChange={(e) =>
                              updateContainerSetting(
                                "gridTemplateRows",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 rounded text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-300"
                            } border`}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Grid Auto Flow
                          </label>
                          <select
                            value={containerSettings.gridAutoFlow}
                            onChange={(e) =>
                              updateContainerSetting(
                                "gridAutoFlow",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 rounded text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-300"
                            } border`}
                          >
                            <option value="row">Row</option>
                            <option value="column">Column</option>
                            <option value="row dense">Row Dense</option>
                            <option value="column dense">Column Dense</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Element Settings */}
                {activeSettingsTab === "element" && selectedElementId && (
                  <div className="space-y-4">
                    {elements.map((element) => {
                      if (element.id === selectedElementId) {
                        return (
                          <div key={element.id} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Content
                              </label>
                              <input
                                type="text"
                                value={element.content}
                                onChange={(e) =>
                                  updateElementSetting(
                                    element.id,
                                    "content",
                                    e.target.value
                                  )
                                }
                                className={`w-full px-3 py-2 rounded text-sm ${
                                  theme === "dark"
                                    ? "bg-gray-700 border-gray-600"
                                    : "bg-white border-gray-300"
                                } border`}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Width
                                </label>
                                <input
                                  type="text"
                                  value={element.width}
                                  onChange={(e) =>
                                    updateElementSetting(
                                      element.id,
                                      "width",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full px-3 py-2 rounded text-sm ${
                                    theme === "dark"
                                      ? "bg-gray-700 border-gray-600"
                                      : "bg-white border-gray-300"
                                  } border`}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Height
                                </label>
                                <input
                                  type="text"
                                  value={element.height}
                                  onChange={(e) =>
                                    updateElementSetting(
                                      element.id,
                                      "height",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full px-3 py-2 rounded text-sm ${
                                    theme === "dark"
                                      ? "bg-gray-700 border-gray-600"
                                      : "bg-white border-gray-300"
                                  } border`}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Background
                                </label>
                                <div className="color-input-wrapper">
                                  <input
                                    type="color"
                                    value={element.background}
                                    onChange={(e) =>
                                      updateElementSetting(
                                        element.id,
                                        "background",
                                        e.target.value
                                      )
                                    }
                                    className="color-picker rounded-l"
                                  />
                                  <input
                                    type="text"
                                    value={element.background}
                                    onChange={(e) =>
                                      updateElementSetting(
                                        element.id,
                                        "background",
                                        e.target.value
                                      )
                                    }
                                    className={`flex-1 px-3 py-2 rounded-r text-sm ${
                                      theme === "dark"
                                        ? "bg-gray-700 border-gray-600"
                                        : "bg-white border-gray-300"
                                    } border`}
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Text Color
                                </label>
                                <div className="color-input-wrapper">
                                  <input
                                    type="color"
                                    value={element.color}
                                    onChange={(e) =>
                                      updateElementSetting(
                                        element.id,
                                        "color",
                                        e.target.value
                                      )
                                    }
                                    className="color-picker rounded-l"
                                  />
                                  <input
                                    type="text"
                                    value={element.color}
                                    onChange={(e) =>
                                      updateElementSetting(
                                        element.id,
                                        "color",
                                        e.target.value
                                      )
                                    }
                                    className={`flex-1 px-3 py-2 rounded-r text-sm ${
                                      theme === "dark"
                                        ? "bg-gray-700 border-gray-600"
                                        : "bg-white border-gray-300"
                                    } border`}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Border Radius
                                </label>
                                <input
                                  type="text"
                                  value={element.borderRadius}
                                  onChange={(e) =>
                                    updateElementSetting(
                                      element.id,
                                      "borderRadius",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full px-3 py-2 rounded text-sm ${
                                    theme === "dark"
                                      ? "bg-gray-700 border-gray-600"
                                      : "bg-white border-gray-300"
                                  } border`}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Padding
                                </label>
                                <input
                                  type="text"
                                  value={element.padding}
                                  onChange={(e) =>
                                    updateElementSetting(
                                      element.id,
                                      "padding",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full px-3 py-2 rounded text-sm ${
                                    theme === "dark"
                                      ? "bg-gray-700 border-gray-600"
                                      : "bg-white border-gray-300"
                                  } border`}
                                />
                              </div>
                            </div>

                            {/* Flexbox specific element settings */}
                            {layoutType === "flexbox" && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Flex Grow
                                    </label>
                                    <input
                                      type="text"
                                      value={element.flexGrow}
                                      onChange={(e) =>
                                        updateElementSetting(
                                          element.id,
                                          "flexGrow",
                                          e.target.value
                                        )
                                      }
                                      className={`w-full px-3 py-2 rounded text-sm ${
                                        theme === "dark"
                                          ? "bg-gray-700 border-gray-600"
                                          : "bg-white border-gray-300"
                                      } border`}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Flex Shrink
                                    </label>
                                    <input
                                      type="text"
                                      value={element.flexShrink}
                                      onChange={(e) =>
                                        updateElementSetting(
                                          element.id,
                                          "flexShrink",
                                          e.target.value
                                        )
                                      }
                                      className={`w-full px-3 py-2 rounded text-sm ${
                                        theme === "dark"
                                          ? "bg-gray-700 border-gray-600"
                                          : "bg-white border-gray-300"
                                      } border`}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Flex Basis
                                    </label>
                                    <input
                                      type="text"
                                      value={element.flexBasis}
                                      onChange={(e) =>
                                        updateElementSetting(
                                          element.id,
                                          "flexBasis",
                                          e.target.value
                                        )
                                      }
                                      className={`w-full px-3 py-2 rounded text-sm ${
                                        theme === "dark"
                                          ? "bg-gray-700 border-gray-600"
                                          : "bg-white border-gray-300"
                                      } border`}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Grid specific element settings */}
                            {layoutType === "grid" && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Grid Column
                                    </label>
                                    <input
                                      type="text"
                                      value={element.gridColumn}
                                      onChange={(e) =>
                                        updateElementSetting(
                                          element.id,
                                          "gridColumn",
                                          e.target.value
                                        )
                                      }
                                      className={`w-full px-3 py-2 rounded text-sm ${
                                        theme === "dark"
                                          ? "bg-gray-700 border-gray-600"
                                          : "bg-white border-gray-300"
                                      } border`}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Grid Row
                                    </label>
                                    <input
                                      type="text"
                                      value={element.gridRow}
                                      onChange={(e) =>
                                        updateElementSetting(
                                          element.id,
                                          "gridRow",
                                          e.target.value
                                        )
                                      }
                                      className={`w-full px-3 py-2 rounded text-sm ${
                                        theme === "dark"
                                          ? "bg-gray-700 border-gray-600"
                                          : "bg-white border-gray-300"
                                      } border`}
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Align Self
                                    </label>
                                    <select
                                      value={element.alignSelf}
                                      onChange={(e) =>
                                        updateElementSetting(
                                          element.id,
                                          "alignSelf",
                                          e.target.value
                                        )
                                      }
                                      className={`w-full px-3 py-2 rounded text-sm ${
                                        theme === "dark"
                                          ? "bg-gray-700 border-gray-600"
                                          : "bg-white border-gray-300"
                                      } border`}
                                    >
                                      <option value="auto">Auto</option>
                                      <option value="start">Start</option>
                                      <option value="end">End</option>
                                      <option value="center">Center</option>
                                      <option value="stretch">Stretch</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Justify Self
                                    </label>
                                    <select
                                      value={element.justifySelf}
                                      onChange={(e) =>
                                        updateElementSetting(
                                          element.id,
                                          "justifySelf",
                                          e.target.value
                                        )
                                      }
                                      className={`w-full px-3 py-2 rounded text-sm ${
                                        theme === "dark"
                                          ? "bg-gray-700 border-gray-600"
                                          : "bg-white border-gray-300"
                                      } border`}
                                    >
                                      <option value="auto">Auto</option>
                                      <option value="start">Start</option>
                                      <option value="end">End</option>
                                      <option value="center">Center</option>
                                      <option value="stretch">Stretch</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}

                            <button
                              onClick={() => removeElement(element.id)}
                              className={`mt-4 px-3 py-2 rounded text-sm flex items-center gap-2 ${
                                theme === "dark"
                                  ? "bg-red-900 text-red-100 hover:bg-red-800"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              <Trash2 size={14} />
                              Remove Element
                            </button>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>

              <div className="flex space-x-2 mt-6">
                <button
                  onClick={addNewElement}
                  className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-medium ${
                    theme === "dark"
                      ? "bg-blue-700 text-white hover:bg-blue-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <Plus size={16} />
                  Add Element
                </button>

                <button
                  onClick={() => setSaveModalOpen(true)}
                  className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-medium ${
                    theme === "dark"
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  <Save size={16} />
                  Save Layout
                </button>

                <button
                  onClick={downloadLayout}
                  className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-medium ${
                    theme === "dark"
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="col-span-1 lg:col-span-3">
              <div className="relative mb-4">
                <div
                  className={`container-preview ${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  }`}
                  ref={containerRef}
                  style={{
                    width: containerSettings.width,
                    height: containerSettings.height,
                    background: containerSettings.background,
                    padding: containerSettings.padding,
                    gap: containerSettings.gap,
                    borderRadius: containerSettings.borderRadius,
                    display: layoutType === "flexbox" ? "flex" : "grid",
                    flexDirection:
                      layoutType === "flexbox"
                        ? containerSettings.flexDirection
                        : undefined,
                    flexWrap:
                      layoutType === "flexbox"
                        ? containerSettings.flexWrap
                        : undefined,
                    justifyContent:
                      layoutType === "flexbox"
                        ? containerSettings.justifyContent
                        : undefined,
                    alignItems:
                      layoutType === "flexbox"
                        ? containerSettings.alignItems
                        : undefined,
                    gridTemplateColumns:
                      layoutType === "grid"
                        ? containerSettings.gridTemplateColumns
                        : undefined,
                    gridTemplateRows:
                      layoutType === "grid"
                        ? containerSettings.gridTemplateRows
                        : undefined,
                    gridAutoFlow:
                      layoutType === "grid"
                        ? containerSettings.gridAutoFlow
                        : undefined,
                  }}
                >
                  {elements.map((element, index) => (
                    <div
                      key={element.id}
                      className={`element-item ${selectedElementId === element.id ? "selected" : ""}`}
                      style={getElementStyle(element)}
                      onClick={() => {
                        setSelectedElementId(element.id);
                        setActiveSettingsTab("element");
                      }}
                    >
                      {element.content}
                    </div>
                  ))}
                  <div
                    className="resize-handle"
                    ref={resizeHandleRef}
                    onMouseDown={() => setIsResizing(true)}
                  >
                    <div
                      className={`w-4 h-4 flex items-center justify-center ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22 22L13 13M13 22L22 13"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Code Tab */}
        {activeTab === "code" && (
          <div
            className={`p-6 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"
            }`}
          >
            <div className="mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveSettingsTab("html")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeSettingsTab === "html"
                      ? theme === "dark"
                        ? "border-b-2 border-blue-500 text-blue-400"
                        : "border-b-2 border-blue-500 text-blue-600"
                      : ""
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setActiveSettingsTab("css")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeSettingsTab === "css"
                      ? theme === "dark"
                        ? "border-b-2 border-blue-500 text-blue-400"
                        : "border-b-2 border-blue-500 text-blue-600"
                      : ""
                  }`}
                >
                  CSS
                </button>
              </div>

              <div className="mt-4">
                {activeSettingsTab === "html" && (
                  <div className="code-container">
                    <button
                      onClick={() => copyCodeToClipboard(htmlCode)}
                      className={`code-copy-btn p-2 rounded ${
                        theme === "dark"
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <pre
                      className={`p-4 rounded-lg overflow-x-auto scrollbar-custom ${
                        theme === "dark"
                          ? "bg-gray-900 text-gray-300"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <code>{htmlCode}</code>
                    </pre>
                  </div>
                )}

                {activeSettingsTab === "css" && (
                  <div className="code-container">
                    <button
                      onClick={() => copyCodeToClipboard(cssCode)}
                      className={`code-copy-btn p-2 rounded ${
                        theme === "dark"
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <pre
                      className={`p-4 rounded-lg overflow-x-auto scrollbar-custom ${
                        theme === "dark"
                          ? "bg-gray-900 text-gray-300"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <code>{cssCode}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Library Tab */}
        {activeTab === "library" && (
          <div
            className={`p-6 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white shadow-sm"
            }`}
          >
            <h2 className="text-lg font-medium mb-4">Saved Layouts</h2>

            {savedLayouts.length === 0 ? (
              <div
                className={`text-center py-10 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>You don't have any saved layouts yet.</p>
                <p className="text-sm mt-2">
                  Create and save layouts to access them here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {savedLayouts.map((layout) => (
                  <div
                    key={layout.id}
                    onClick={() => loadLayout(layout)}
                    className={`saved-layout-card p-4 rounded-lg cursor-pointer ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium truncate">{layout.name}</h3>
                      <button
                        onClick={(e) => deleteLayout(layout.id, e)}
                        className={`p-1 rounded hover:bg-opacity-80 ${
                          theme === "dark"
                            ? "hover:bg-gray-500"
                            : "hover:bg-gray-300"
                        }`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center text-xs">
                      {layout.type === "flexbox" ? (
                        <>
                          <LayoutGrid size={12} className="mr-1" /> Flexbox
                        </>
                      ) : (
                        <>
                          <GridIcon size={12} className="mr-1" /> Grid
                        </>
                      )}
                      <span className="mx-2">•</span>
                      <span>{layout.elements.length} elements</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Save Layout Modal */}
      {saveModalOpen && (
        // full‑screen dark overlay
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            theme === "dark" ? "bg-black/60" : "bg-gray-500/40"
          }`}
        >
          {/* the modal box: bg changes based on theme */}
          <div
            className={`w-96 p-6 rounded-2xl shadow-xl slide-in transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-900 text-gray-100"
                : "bg-white text-gray-900"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Save Layout</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Layout Name
              </label>
              <input
                type="text"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                autoFocus
                placeholder="My Awesome Layout"
                className={`w-full px-3 py-2 rounded border text-sm ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white"
                    : "bg-white border-gray-300 placeholder-gray-500 text-gray-900"
                }`}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSaveModalOpen(false)}
                className={`px-4 py-2 rounded text-sm ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={saveLayout}
                className={`px-4 py-2 rounded text-sm ${
                  theme === "dark"
                    ? "bg-blue-700 text-white hover:bg-blue-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlexGridGenerator;
