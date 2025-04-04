import React, { useEffect, useState, useRef } from "react";
import { saveAs } from "file-saver";

const Qr = ({ theme }) => {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#000000"); // Default: Black
  const [BGColor, setBGColor] = useState("#ffffff"); // Default: White
  const [qrCode, setQrCode] = useState("");
  const [format, setFormat] = useState("png");
  const [size, setSize] = useState(300); // Default size
  const [errorLevel, setErrorLevel] = useState("H"); // Default error correction level
  const [loading, setLoading] = useState(false);
  // const [logo, setLogo] = useState("");
  // const [logoSize, setLogoSize] = useState(20); // Logo size as percentage
  const [margin, setMargin] = useState(1); // QR code margin
  const [previewMode, setPreviewMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef(null);
  const qrImageRef = useRef(null);

  const QrGenerator = async () => {
    if (text.trim() !== "") {
      setLoading(true);
      
      try {
        // Base URL with common parameters
        let qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(
          text
        )}&light=${encodeURIComponent(BGColor)}&dark=${encodeURIComponent(
          color
        )}&ecLevel=${errorLevel}&format=${format}&size=${size}x${size}&margin=${margin}`;
        
        // Add logo if provided
        // if (logo && logo.trim() !== "") {
        //   // For external URLs
        //   if (logo.startsWith('http')) {
        //     qrUrl += `&centerImageUrl=${encodeURIComponent(logo)}&centerImageSizePercentage=${logoSize}`;
        //   } 
        //   // For data URLs from file upload
        //   else if (logo.startsWith('data:')) {
        //     qrUrl += `&centerImageUrl=${encodeURIComponent(logo)}&centerImageSizePercentage=${logoSize}`;
        //   }
        // }

        const response = await fetch(qrUrl);
        if (!response.ok) throw new Error("Failed to generate QR code");
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setQrCode(url);
      } catch (error) {
        console.error("Error fetching QR code:", error);
        // Could add toast notification here
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
  }, [text, color, BGColor, format, size, errorLevel, 
    // logo, logoSize, 
    margin]);

  const downloadQRCode = () => {
    if (qrCode) {
      const filename = text.trim() 
        ? `${text.split(" ").slice(0, 2).join("_").replace(/[^\w]/gi, "_")}`
        : "QR_Code";
      saveAs(qrCode, `${filename}.${format}`);
    }
  };

  // const handleLogoChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     // Check file size - limit to 1MB
  //     if (file.size > 1024 * 1024) {
  //       alert("Logo file is too large. Please use an image smaller than 1MB.");
  //       fileInputRef.current.value = "";
  //       return;
  //     }
      
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setLogo(event.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleLogoUrl = (e) => {
  //   setLogo(e.target.value);
  // };

  // const clearLogo = () => {
  //   setLogo("");
  //   // Also clear the file input
  //   if (fileInputRef.current) fileInputRef.current.value = "";
  // };

  const copyQRCodeToClipboard = async () => {
    if (!qrCode) return;
    
    try {
      // For browsers that support the Clipboard API with writeImage
      if (navigator.clipboard && navigator.clipboard.write) {
        const response = await fetch(qrCode);
        const blob = await response.blob();
        
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        return;
      }
      
      // Fallback using Canvas
      if (qrImageRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = qrImageRef.current.width;
        canvas.height = qrImageRef.current.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(qrImageRef.current, 0, 0);
        
        canvas.toBlob(async (blob) => {
          try {
            // Try to use the clipboard API
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
          } catch (err) {
            console.error("Failed to copy: ", err);
            alert("Failed to copy image. Your browser may not support this feature.");
          }
        });
      }
    } catch (err) {
      console.error("Error copying QR code:", err);
      alert("Could not copy QR code to clipboard. Try downloading instead.");
    }
  };

  return (
    <div
      className={`flex flex-col mt-10 items-center justify-center min-h-screen w-full transition-all duration-300 ${
        theme === "dark" 
          ? "bg-black text-white" 
          : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className={`w-full max-w-4xl p-4 md:p-6 rounded-xl shadow-lg ${
        theme === "dark" 
          ? "bg-gray-900" 
          : "bg-white"
      } transition-all duration-300`}>
        
        <h1 className={`text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center ${
          theme === "dark" ? "text-blue-300" : "text-blue-600"
        }`}>QR Code Generator</h1>
        
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Left Column - Input and Preview */}
          <div className="flex-1 flex flex-col gap-4">
            <div className={`p-3 md:p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                className={`border p-2 md:p-3 rounded w-full h-20 md:h-24 transition-colors ${
                  theme === "dark" 
                    ? "bg-gray-600 border-gray-500 text-white" 
                    : "bg-white border-gray-300 text-black"
                }`}
                placeholder="Enter URL, text, or data for your QR code"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
                <button
                  onClick={QrGenerator}
                  disabled={!text.trim() || loading}
                  className={`flex items-center justify-center px-4 md:px-6 py-2 rounded shadow-md transition ${
                    !text.trim() || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {loading ? "Generating..." : "Generate QR Code"}
                </button>
                
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 md:px-4 py-2 rounded transition ${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {previewMode ? "Edit Mode" : "Preview Mode"}
                </button>
              </div>
            </div>
            
            {/* QR Code Preview */}
            {qrCode && (
              <div className={`flex flex-col items-center p-4 md:p-6 rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <div className={`p-4 rounded-lg ${previewMode ? "" : "bg-white"}`}>
                  <img 
                    ref={qrImageRef}
                    src={qrCode} 
                    alt="Generated QR Code" 
                    className="max-w-full h-auto"
                    style={{ width: `${size}px`, maxWidth: "100%" }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={downloadQRCode}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 rounded shadow-md transition"
                  >
                    Download
                  </button>
                  <button
                    onClick={copyQRCodeToClipboard}
                    className={`px-4 md:px-6 py-2 rounded shadow-md transition ${
                      copySuccess
                        ? "bg-green-500 text-white"
                        : theme === "dark"
                          ? "bg-gray-600 hover:bg-gray-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    {copySuccess ? "Copied!" : "Copy to Clipboard"}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Settings Panels */}
          {!previewMode && (
            <div className="flex-1 my-auto items-center text-center">
              {/* Color Settings */}
              <div className={`p-3 md:p-4 mb-4 rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <h3 className="font-medium mb-3">Appearance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>QR Color:</span>
                    <div className="flex items-center">
                      <input
                        type="color"
                        className="w-8 h-8 md:w-10 md:h-10 rounded cursor-pointer border-0"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                      <input
                        type="text"
                        className={`ml-2 w-20 md:w-24 border p-1 rounded text-center ${
                          theme === "dark" 
                            ? "bg-gray-600 border-gray-500 text-white" 
                            : "bg-white border-gray-300 text-black"
                        }`}
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
                        className="w-8 h-8 md:w-10 md:h-10 rounded cursor-pointer border-0"
                        value={BGColor}
                        onChange={(e) => setBGColor(e.target.value)}
                      />
                      <input
                        type="text"
                        className={`ml-2 w-20 md:w-24 border p-1 rounded text-center ${
                          theme === "dark" 
                            ? "bg-gray-600 border-gray-500 text-white" 
                            : "bg-white border-gray-300 text-black"
                        }`}
                        value={BGColor}
                        onChange={(e) => setBGColor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Size and Format Settings */}
              <div className={`p-3 md:p-4 mb-4 rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <h3 className="font-medium mb-3">Size & Format</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Size (px):</span>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="100"
                        max="500"
                        step="10"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-24 md:w-32 mr-2"
                      />
                      <input
                        type="number"
                        className={`border p-1 rounded w-16 md:w-20 text-center ${
                          theme === "dark" 
                            ? "bg-gray-600 border-gray-500 text-white" 
                            : "bg-white border-gray-300 text-black"
                        }`}
                        min="100"
                        max="500"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Margin:</span>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-24 md:w-32 mr-2"
                      />
                      <input
                        type="number"
                        className={`border p-1 rounded w-16 md:w-20 text-center ${
                          theme === "dark" 
                            ? "bg-gray-600 border-gray-500 text-white" 
                            : "bg-white border-gray-300 text-black"
                        }`}
                        min="0"
                        max="5"
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Format:</span>
                    <select
                      className={`border p-1 md:p-2 rounded cursor-pointer ${
                        theme === "dark" 
                          ? "bg-gray-600 border-gray-500 text-white" 
                          : "bg-white border-gray-300 text-black"
                      }`}
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                    >
                      <option value="png">PNG</option>
                      <option value="svg">SVG</option>
                      <option value="jpg">JPG</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Error Correction:</span>
                    <select
                      className={`border p-1 md:p-2 rounded cursor-pointer ${
                        theme === "dark" 
                          ? "bg-gray-600 border-gray-500 text-white" 
                          : "bg-white border-gray-300 text-black"
                      }`}
                      value={errorLevel}
                      onChange={(e) => setErrorLevel(e.target.value)}
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Logo Settings */}

            </div>
          )}
        </div>
      </div>
      
      {/* Info footer */}
      <div className="my-4 text-center text-sm opacity-70 px-4">
        <p>Scan the QR code with any QR scanner app to test it</p>
      </div>
    </div>
  );
};

export default Qr;