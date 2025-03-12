import { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import MergePDF from "./MergePDF";
import SplitPDF from "./SplitPDF";
import CompressPDF from "./CompressPDF";

export default function PDFTools() {
  const [activeTool, setActiveTool] = useState("merge");
  const [files, setFiles] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleFileSelection = (e) => {
    if (activeTool === "merge" && e.target.files.length > 1) {
      setFiles(Array.from(e.target.files));
    } else {
      setFiles([e.target.files[0]]);
    }
  };

  const handleClearFiles = () => {
    setFiles([]);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"} min-h-screen p-6`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 bg-gray-300 p-2 rounded-full hover:bg-gray-400 transition cursor-pointer"
      >
        {isDarkMode ? <FaMoon /> : <FaSun />}
      </button>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => {
            setActiveTool("merge");
            handleClearFiles();
          }}
          className={`px-6 py-3 rounded-lg ${activeTool === "merge" ? "bg-blue-500 text-white" : "bg-gray-300"} cursor-pointer`}
        >
          Merge PDF
        </button>
        <button
          onClick={() => {
            setActiveTool("split");
            handleClearFiles();
          }}
          className={`px-6 py-3 rounded-lg ${activeTool === "split" ? "bg-blue-500 text-white" : "bg-gray-300"} cursor-pointer`}
        >
          Split PDF
        </button>

      </div>

      <div className="text-center mb-4">
        {files.length > 0 && (
          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {files.map((file, index) => (
              <p key={index}>{file.name}</p>
            ))}
          </div>
        )}
      </div>

      {/* Render Active Tool */}
      {activeTool === "merge" && <MergePDF files={files} theme={isDarkMode ? "dark" : "light"} />}
      {activeTool === "split" && <SplitPDF files={files} theme={isDarkMode ? "dark" : "light"} />}
    </div>
  );
}
