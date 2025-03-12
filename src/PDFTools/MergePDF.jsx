import { useState } from "react"; 
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import FileUploader from "./FileUploader";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../ThemeProvider";

export default function MergePDF() {
  const { theme } = useTheme(); // Get theme state
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const newFiles = [...event.target.files];
    
    if (newFiles.length > 0 && files.length === 0) {
      setFilename(newFiles[0].name.replace(/\.pdf$/, "")); // Default filename
    }
    
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = [...event.dataTransfer.files];
    
    if (droppedFiles.length > 0 && files.length === 0) {
      setFilename(droppedFiles[0].name.replace(/\.pdf$/, "")); // Default filename
    }
    
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const clearAllFiles = () => {
    setFiles([]);
    setFilename("");
    setError("");
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Select at least two PDFs to merge!");
      return;
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const fileBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

    const finalFilename = filename.trim()
      ? filename.endsWith(".pdf")
        ? filename
        : `${filename}.pdf`
      : `${files[0].name.replace(/\.pdf$/, "")}.pdf`;

    saveAs(blob, finalFilename);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div
        className={`max-w-xl w-full p-6 rounded-2xl shadow-xl ${
          theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Merge PDFs</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* File Upload Button */}
        <FileUploader onChange={handleFileChange} hasFiles={files.length > 0} />

        {/* Uploaded PDFs as Clickable Boxes */}
        {files.length > 0 && (
          <div
            className={`mt-10 p-3 rounded-lg ${
              theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100"
            }`}
          >
            <h3 className="text-lg font-medium mb-2">Selected PDFs:</h3>
            <div className="flex items-center gap-3 flex-wrap">
              {files.map((file, index) => {
                const fileURL = URL.createObjectURL(file);
                return (
                  <div
                    key={index}
                    className={`flex items-center shadow-md rounded-lg px-4 py-2 ${
                      theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-black"
                    }`}
                  >
                    <a
                      href={fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-2 underline hover:text-blue-500"
                    >
                      {file.name}
                    </a>
                    <button onClick={() => removeFile(index)} className="text-red-500">
                      <XCircleIcon className="cursor-pointer h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Optional Filename Input */}
        {files.length > 0 && (
          <div className="mt-4">
            <label className="block font-medium mb-2">Save As (Optional):</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename (or default is first file name)"
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === "dark"
                  ? "border-gray-600 dark:bg-gray-700 text-white"
                  : "border-gray-300 bg-white text-black"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
          </div>
        )}

        {/* Merge and Clear Buttons */}
        {files.length > 0 && (
          <div className="mt-6 flex gap-4">
            {files.length > 1 && (
              <button
                onClick={mergePDFs}
                className="px-6 py-3 rounded-lg font-medium bg-green-500 text-white hover:bg-green-400 transition"
              >
                Merge PDFs
              </button>
            )}
            <button
              onClick={clearAllFiles}
              className="px-6 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-400 transition"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
