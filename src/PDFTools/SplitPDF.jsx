import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import FileUploader from "./FileUploader";
import { XCircleIcon, DocumentTextIcon, DocumentPlusIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../ThemeProvider";

export default function SplitPDF() {
  const { theme } = useTheme();
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState("");
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPageCount = async () => {
      if (!file) return;
      
      try {
        const fileBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        setTotalPages(pdf.getPageCount());
      } catch (err) {
        setError("Error reading PDF file");
      }
    };
    
    fetchPageCount();
  }, [file]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFilename(selectedFile.name.replace(/\.pdf$/, "-split"));
      setError("");
    } else if (selectedFile) {
      setError("Only PDF files are allowed!");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setFilename(droppedFile.name.replace(/\.pdf$/, "-split"));
      setError("");
    } else if (droppedFile) {
      setError("Only PDF files are allowed!");
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPageRange("");
    setFilename("");
    setError("");
    setSuccess(false);
    setTotalPages(0);
  };

  const splitPDF = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    if (!pageRange.trim()) {
      setError("Please enter a valid page range (e.g., 1,3-5).");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const fileBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBytes);
      const newPdf = await PDFDocument.create();

      const pagesToExtract = new Set();
      const pageRangeParts = pageRange.split(",");
      let invalidRange = false;
      
      for (const part of pageRangeParts) {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(num => parseInt(num.trim()));
          if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > pdf.getPageCount()) {
            invalidRange = true;
            break;
          }
          for (let i = start; i <= end; i++) {
            pagesToExtract.add(i - 1);
          }
        } else {
          const pageNum = parseInt(part.trim()) - 1;
          if (isNaN(pageNum) || pageNum < 0 || pageNum >= pdf.getPageCount()) {
            invalidRange = true;
            break;
          }
          pagesToExtract.add(pageNum);
        }
      }

      if (invalidRange) {
        setError(`Invalid page range. Document has ${pdf.getPageCount()} pages.`);
        setLoading(false);
        return;
      }

      if (pagesToExtract.size === 0) {
        setError("No valid pages selected.");
        setLoading(false);
        return;
      }

      // Extract pages in order
      const sortedPages = Array.from(pagesToExtract).sort((a, b) => a - b);
      for (const pageIndex of sortedPages) {
        const [copiedPage] = await newPdf.copyPages(pdf, [pageIndex]);
        newPdf.addPage(copiedPage);
      }

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });

      const finalFilename = filename.trim()
        ? filename.endsWith(".pdf")
          ? filename
          : `${filename}.pdf`
        : `${file.name.replace(/\.pdf$/, "-split")}.pdf`;

      saveAs(blob, finalFilename);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(`Error splitting PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div
      className={`min-h-screen mt-10 flex flex-col items-center justify-center px-4 py-8 transition-colors ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div
        className={`max-w-2xl w-full p-6 rounded-2xl shadow-xl transition-all ${
          theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"
        }`}
      >
        <h2 className="text-3xl font-bold mb-2 text-center">Split PDF</h2>
        <p className={`text-center mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          Extract specific pages from your PDF document
        </p>

        {error && (
          <div className="text-red-500 text-center mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-center mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            PDF successfully split and downloaded!
          </div>
        )}

        {!file ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-8 ${
              theme === "dark" ? "border-gray-700" : "border-gray-300"
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center text-center">
              <DocumentPlusIcon 
                className={`w-16 h-16 mb-4 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-500"
                }`} 
              />
              
              <h3 className="text-xl font-medium mb-2">Upload your PDF file</h3>
              
              <p className={`mb-6 max-w-md ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>
                Select or drag & drop a PDF file here to extract specific pages
              </p>
              
              <FileUploader onChange={handleFileChange} hasFiles={false} />
              
              <div className={`w-full max-w-sm mt-8 pt-6 border-t ${
                theme === "dark" ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"
              }`}>
                <div className="flex items-center justify-between text-sm">
                  <span>• Process files locally</span>
                  <span>• Extract specific pages</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* File Upload Button when file exists */}
            <FileUploader onChange={handleFileChange} hasFiles={true} />

            {/* File Stats */}
            <div className="mt-4 text-center">
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                File selected • Size: {formatBytes(file.size)} • Pages: {totalPages}
              </p>
            </div>

            {/* Selected PDF Display */}
            <div
              className={`mt-6 p-4 rounded-lg ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-50"
              }`}
            >
              <h3 className="text-lg font-semibold mb-3">Selected PDF:</h3>
              <div
                className={`flex items-center justify-between shadow-sm rounded-lg px-4 py-3 ${
                  theme === "dark" 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
                    : "bg-white hover:bg-gray-100 text-gray-800"
                } transition-colors border border-transparent`}
              >
                <div className="flex items-center min-w-0 overflow-hidden">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                  <a
                    href={URL.createObjectURL(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:text-blue-500"
                    title={file.name}
                  >
                    {file.name}
                  </a>
                  <span className="text-xs text-gray-500 ml-2 hidden sm:inline">
                    {formatBytes(file.size)}
                  </span>
                </div>
                
                <button 
                  onClick={clearSelection} 
                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"
                  title="Remove file"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Page Range Input */}
            <div className="mt-6">
              <label className="block font-medium mb-2">
                Pages to Extract (e.g., 1, 3-5, 7):
                <span className={`ml-2 text-sm font-normal ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Document has {totalPages} pages
                </span>
              </label>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="Enter page numbers or ranges (e.g., 1, 3-5, 7)"
                className={`w-full px-4 py-3 rounded-lg border ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-white"
                    : "border-gray-300 bg-white text-black"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Output Filename Input */}
            <div className="mt-6">
              <label className="block font-medium mb-2">Output Filename:</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename for the split PDF"
                className={`w-full px-4 py-3 rounded-lg border ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-white"
                    : "border-gray-300 bg-white text-black"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={splitPDF}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition flex items-center justify-center min-w-32 ${
                  loading
                    ? "bg-green-400 dark:bg-green-600 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-400 shadow-md hover:shadow-lg"
                } text-white`}
              >
                {loading ? "Processing..." : "Split PDF"}
              </button>
              
              <button
                onClick={clearSelection}
                className="px-6 py-3 rounded-lg font-medium bg-red-500 hover:bg-red-400 transition text-white shadow-md hover:shadow-lg"
              >
                Clear
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Your files are processed locally in your browser. No uploads to any server.
      </div> 
    </div>
  );
}