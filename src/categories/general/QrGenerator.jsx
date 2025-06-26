import React, { useEffect, useState, useRef } from "react";
import { saveAs } from "file-saver";

const Qr = ({ theme }) => {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#000000");
  const [BGColor, setBGColor] = useState("#ffffff");
  const [qrCode, setQrCode] = useState("");
  const [format, setFormat] = useState("png");
  const [size, setSize] = useState(300);
  const [errorLevel, setErrorLevel] = useState("H");
  const [loading, setLoading] = useState(false);
  const [margin, setMargin] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dotStyle, setDotStyle] = useState("square");
  const [customStyle, setCustomStyle] = useState({});
  const [activePanel, setActivePanel] = useState("appearance");
  const qrImageRef = useRef(null);

  const isDarkTheme = theme === "dark";
  const bgClass = isDarkTheme ? "bg-gray-900" : "bg-white";
  const textClass = isDarkTheme ? "text-white" : "text-gray-800";
  const panelBgClass = isDarkTheme ? "bg-gray-800" : "bg-gray-100";
  const inputBgClass = isDarkTheme
    ? "bg-gray-700 border-gray-600"
    : "bg-white border-gray-300";
  const buttonClass = isDarkTheme
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-blue-500 hover:bg-blue-600";
  const secondaryButtonClass = isDarkTheme
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-200 hover:bg-gray-300";

  const QrGenerator = async () => {
    if (text.trim() !== "") {
      setLoading(true);

      try {
        let qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
          text
        )}&light=${encodeURIComponent(BGColor)}&dark=${encodeURIComponent(
          color
        )}&ecLevel=${errorLevel}&format=${format}&size=${size}x${size}&margin=${margin}`;

        if (dotStyle !== "square") {
          qrUrl += `&style=${dotStyle}`;
        }

        const response = await fetch(qrUrl);
        if (!response.ok) throw new Error("Failed to generate QR code");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setQrCode(url);

        // Save to history if not already there
        const newEntry = {
          text,
          timestamp: new Date().toLocaleString(),
          url,
          format,
        };

        setHistory((prev) => {
          // Don't add duplicates based on text content
          if (!prev.some((item) => item.text === text)) {
            return [newEntry, ...prev].slice(0, 10); // Keep last 10 entries
          }
          return prev;
        });
      } catch (error) {
        console.error("Error fetching QR code:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setQrCode("");
    }
  };

  useEffect(() => {
    if (text.trim() !== "") {
      const debounce = setTimeout(() => {
        QrGenerator();
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [text, color, BGColor, format, size, errorLevel, margin, dotStyle]);

  const downloadQRCode = () => {
    if (qrCode) {
      const filename = text.trim()
        ? `${text.split(" ").slice(0, 2).join("_").replace(/[^\w]/gi, "_")}`
        : "QR_Code";
      saveAs(qrCode, `${filename}.${format}`);
    }
  };

  const copyQRCodeToClipboard = async () => {
    if (!qrCode) return;

    try {
      if (navigator.clipboard && navigator.clipboard.write) {
        const response = await fetch(qrCode);
        const blob = await response.blob();

        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);

        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        return;
      }

      if (qrImageRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = qrImageRef.current.width;
        canvas.height = qrImageRef.current.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(qrImageRef.current, 0, 0);

        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
          } catch (err) {
            console.error("Failed to copy: ", err);
          }
        });
      }
    } catch (err) {
      console.error("Error copying QR code:", err);
    }
  };

  const shareQRCode = async () => {
    if (!qrCode || !navigator.share) return;

    try {
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const file = new File([blob], `qrcode.${format}`, { type: blob.type });

      await navigator.share({
        title: "QR Code",
        text: `QR Code for: ${text.substring(0, 50)}${
          text.length > 50 ? "..." : ""
        }`,
        files: [file],
      });
    } catch (err) {
      console.error("Error sharing QR code:", err);
    }
  };

  const loadFromHistory = (item) => {
    setText(item.text);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    setShowHistory(false);
  };

  // Quick presets
  const presets = [
    { label: "URL", example: "https://example.com" },
    { label: "Email", example: "mailto:example@example.com" },
    { label: "Phone", example: "tel:+1234567890" },
    { label: "WiFi", example: "WIFI:S:NetworkName;T:WPA;P:Password;;" },
    {
      label: "vCard",
      example:
        "BEGIN:VCARD\nVERSION:3.0\nN:Doe;John\nTEL:123456789\nEMAIL:john@example.com\nEND:VCARD",
    },
  ];

  const applyPreset = (preset) => {
    setText(preset.example);
  };

  return (
    <div
      className={`flex flex-col mt-16 items-center justify-center min-h-screen w-full transition-all duration-300 ${
        isDarkTheme ? "bg-black text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-5xl p-5 md:p-8 rounded-xl shadow-xl ${bgClass} transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1
            className={`text-2xl md:text-3xl font-bold ${
              isDarkTheme ? "text-blue-400" : "text-blue-600"
            }`}
          >
            QR Code Generator
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-3 py-2 rounded-lg transition ${secondaryButtonClass} flex items-center`}
            >
              <span className="material-icons text-sm mr-1"></span>
              History
            </button>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-2 rounded-lg transition ${secondaryButtonClass} flex items-center`}
            >
              <span className="material-icons text-sm mr-1">
                {previewMode ? "" : ""}
              </span>
              {previewMode ? "Edit" : "Preview"}
            </button>
          </div>
        </div>

        {showHistory && (
          <div className={`mb-6 p-4 rounded-lg ${panelBgClass}`}>
            <div className="flex justify-between mb-3">
              <h3 className="font-medium">Recent QR Codes</h3>
              <button
                onClick={clearHistory}
                className={`text-sm px-2 py-1 rounded ${secondaryButtonClass}`}
              >
                Clear History
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-sm opacity-70">No history yet</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg cursor-pointer hover:opacity-80 transition ${
                      isDarkTheme ? "bg-gray-700" : "bg-white"
                    }`}
                    onClick={() => loadFromHistory(item)}
                  >
                    <img
                      src={item.url}
                      alt="History QR"
                      className="w-full h-auto mb-1"
                    />
                    <p className="text-xs truncate">{item.text}</p>
                    <p className="text-xs opacity-60">{item.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Input and Preview */}
          <div className="flex-1 flex flex-col gap-6">
            <div className={`p-4 rounded-lg ${panelBgClass}`}>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                className={`border p-3 rounded-lg w-full h-24 transition-colors ${inputBgClass} ${textClass}`}
                placeholder="Enter URL, text, or data for your QR code"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Quick Templates
                </label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => applyPreset(preset)}
                      className={`text-sm px-3 py-1 rounded-full transition ${secondaryButtonClass}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={QrGenerator}
                  disabled={!text.trim() || loading}
                  className={`flex items-center justify-center px-6 py-2 rounded-lg shadow-md transition ${
                    !text.trim() || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : `${buttonClass} text-white`
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      Generating...
                    </>
                  ) : (
                    <>Generate QR</>
                  )}
                </button>

                <button
                  onClick={() => setText("")}
                  disabled={!text}
                  className={`px-4 py-2 rounded-lg transition ${
                    !text ? "opacity-50 cursor-not-allowed" : ""
                  } ${secondaryButtonClass}`}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* QR Code Preview */}
            {qrCode && (
              <div
                className={`flex flex-col items-center p-6 rounded-lg ${panelBgClass}`}
              >
                <div
                  className={`p-6 rounded-lg ${
                    previewMode ? panelBgClass : "bg-white"
                  }`}
                >
                  <img
                    ref={qrImageRef}
                    src={qrCode}
                    alt="Generated QR Code"
                    className="max-w-full h-auto shadow-lg"
                    style={{
                      width: `${previewMode ? size : Math.min(300, size)}px`,
                      maxWidth: "100%",
                    }}
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <button
                    onClick={downloadQRCode}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center"
                  >
                    <span className="material-icons text-sm mr-1"></span>
                    Download
                  </button>
                  <button
                    onClick={copyQRCodeToClipboard}
                    className={`px-4 py-2 rounded-lg shadow-md transition flex items-center ${
                      copySuccess
                        ? "bg-green-600 text-white"
                        : secondaryButtonClass
                    }`}
                  >
                    <span className="material-icons text-sm mr-1">
                      {copySuccess ? "" : ""}
                    </span>
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>
                  {navigator.share && (
                    <button
                      onClick={shareQRCode}
                      className={`px-4 py-2 rounded-lg shadow-md transition flex items-center ${secondaryButtonClass}`}
                    >
                      <span className="material-icons text-sm mr-1"></span>
                      Share
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Settings Panels */}
          {!previewMode && (
            <div className="flex-1">
              {/* Tabs for settings panels */}
              <div className="flex mb-4 border-b border-gray-300">
                {["appearance", "size", "advanced"].map((panel) => (
                  <button
                    key={panel}
                    onClick={() => setActivePanel(panel)}
                    className={`py-2 px-4 capitalize ${
                      activePanel === panel
                        ? `border-b-2 ${
                            isDarkTheme
                              ? "border-blue-400 text-blue-400"
                              : "border-blue-600 text-blue-600"
                          }`
                        : "opacity-70"
                    }`}
                  >
                    {panel}
                  </button>
                ))}
              </div>

              {/* Appearance Settings */}
              {activePanel === "appearance" && (
                <div className={`p-4 mb-4 rounded-lg ${panelBgClass}`}>
                  <h3 className="font-medium mb-4">Appearance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>QR Color:</span>
                      <div className="flex items-center">
                        <input
                          type="color"
                          className="w-10 h-10 rounded cursor-pointer border-0"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                        />
                        <input
                          type="text"
                          className={`ml-2 w-24 border p-1 rounded text-center ${inputBgClass} ${textClass}`}
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Background:</span>
                      <div className="flex items-center">
                        <input
                          type="color"
                          className="w-10 h-10 rounded cursor-pointer border-0"
                          value={BGColor}
                          onChange={(e) => setBGColor(e.target.value)}
                        />
                        <input
                          type="text"
                          className={`ml-2 w-24 border p-1 rounded text-center ${inputBgClass} ${textClass}`}
                          value={BGColor}
                          onChange={(e) => setBGColor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Dot Style:</span>
                      <select
                        className={`border p-2 rounded-lg cursor-pointer w-36 ${inputBgClass} ${textClass}`}
                        value={dotStyle}
                        onChange={(e) => setDotStyle(e.target.value)}
                      >
                        <option value="square">Square (Default)</option>
                        <option value="rounded">Rounded</option>
                        <option value="dots">Dots</option>
                        <option value="classy">Classy</option>
                        <option value="classy-rounded">Classy Rounded</option>
                      </select>
                    </div>

                    {/* Color presets */}
                    <div>
                      <span className="block mb-2">Color Presets:</span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { fg: "#000000", bg: "#FFFFFF", name: "Classic" },
                          { fg: "#0078D7", bg: "#FFFFFF", name: "Blue" },
                          { fg: "#009688", bg: "#FFFFFF", name: "Teal" },
                          { fg: "#673AB7", bg: "#FFFFFF", name: "Purple" },
                          { fg: "#FFFFFF", bg: "#000000", name: "Inverse" },
                          { fg: "#F44336", bg: "#FFFFFF", name: "Red" },
                          { fg: "#4CAF50", bg: "#FFFFFF", name: "Green" },
                          { fg: "#FF9800", bg: "#FFFFFF", name: "Orange" },
                        ].map((preset, i) => (
                          <button
                            key={i}
                            className={`p-2 text-xs rounded-lg border transition hover:opacity-80 ${
                              isDarkTheme
                                ? "border-gray-600"
                                : "border-gray-300"
                            }`}
                            onClick={() => {
                              setColor(preset.fg);
                              setBGColor(preset.bg);
                            }}
                          >
                            <div
                              className="w-full h-6 mb-1 rounded"
                              style={{ background: preset.fg }}
                            ></div>
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Size & Format Settings */}
              {activePanel === "size" && (
                <div className={`p-4 mb-4 rounded-lg ${panelBgClass}`}>
                  <h3 className="font-medium mb-4">Size & Format</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span>Size: {size}px</span>
                        <input
                          type="number"
                          className={`border p-1 rounded w-20 text-center ${inputBgClass} ${textClass}`}
                          min="100"
                          max="1000"
                          value={size}
                          onChange={(e) => setSize(Number(e.target.value))}
                        />
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="1000"
                        step="10"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span>Margin: {margin}</span>
                        <input
                          type="number"
                          className={`border p-1 rounded w-20 text-center ${inputBgClass} ${textClass}`}
                          min="0"
                          max="10"
                          value={margin}
                          onChange={(e) => setMargin(Number(e.target.value))}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Format:</span>
                      <div className="flex gap-2">
                        {["png", "svg", "jpg"].map((fmt) => (
                          <button
                            key={fmt}
                            className={`px-4 py-2 rounded-lg transition ${
                              format === fmt
                                ? buttonClass + " text-white"
                                : secondaryButtonClass
                            }`}
                            onClick={() => setFormat(fmt)}
                          >
                            {fmt.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              {activePanel === "advanced" && (
                <div className={`p-4 mb-4 rounded-lg ${panelBgClass}`}>
                  <h3 className="font-medium mb-4">Advanced Options</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Error Correction:</span>
                      <select
                        className={`border p-2 rounded-lg cursor-pointer w-48 ${inputBgClass} ${textClass}`}
                        value={errorLevel}
                        onChange={(e) => setErrorLevel(e.target.value)}
                      >
                        <option value="L">Low (7% - smaller size)</option>
                        <option value="M">Medium (15%)</option>
                        <option value="Q">Quartile (25%)</option>
                        <option value="H">High (30% - most reliable)</option>
                      </select>
                    </div>

                    <div>
                      <span className="block mb-2">Error Correction Info:</span>
                      <p className="text-sm opacity-80">
                        Higher error correction makes QR codes more reliable
                        even when partially damaged or obscured, but results in
                        a more complex code with more modules.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-opacity-30 border-l-4 border-blue-500 text-sm">
                      <span className="font-medium block mb-1">
                        QR Code Tips:
                      </span>
                      <ul className="list-disc list-inside space-y-1 opacity-80">
                        <li>Test your QR code on multiple devices</li>
                        <li>
                          Higher contrast between colors improves scan
                          reliability
                        </li>
                        <li>SVG format is best for printing at any size</li>
                        <li>
                          Shorter content will produce simpler, more reliable
                          codes
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info footer */}
      <div className="mt-6 text-center text-sm opacity-70 px-4 max-w-lg">
        <p>Scan the QR code with any device QR scanner to test it</p>
        <p className="mt-1">
          {navigator.share
            ? "Use the Share button to share directly to other apps"
            : "Download your QR code to share it with others"}
        </p>
      </div>
    </div>
  );
};

export default Qr;
