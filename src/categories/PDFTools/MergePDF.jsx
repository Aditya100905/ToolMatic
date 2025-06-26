import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import FileUploader from "./FileUploader";
import {
  XCircleIcon,
  ArrowsUpDownIcon,
  DocumentTextIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "../../ThemeProvider";

export default function MergePDF() {
  const { theme } = useTheme();
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    // Calculate total size of files
    const size = files.reduce((total, file) => total + file.size, 0);
    setTotalSize(size);
  }, [files]);

  const handleFileChange = (event) => {
    const newFiles = [...event.target.files];

    // Filter out non-PDF files
    const pdfFiles = newFiles.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length !== newFiles.length) {
      setError("Only PDF files are allowed!");
    }

    if (pdfFiles.length > 0 && files.length === 0) {
      setFilename(pdfFiles[0].name.replace(/\.pdf$/, ""));
    }

    setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = [...event.dataTransfer.files];

    // Filter out non-PDF files
    const pdfFiles = droppedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length !== droppedFiles.length) {
      setError("Only PDF files are allowed!");
    }

    if (pdfFiles.length > 0 && files.length === 0) {
      setFilename(pdfFiles[0].name.replace(/\.pdf$/, ""));
    }

    setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      setFilename("");
    }
  };

  const clearAllFiles = () => {
    setFiles([]);
    setFilename("");
    setError("");
    setSuccess(false);
  };

  // Handle file reordering with drag and drop
  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop1 = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem !== null) {
      const newFiles = [...files];
      const draggedFile = newFiles[draggedItem];

      // Remove the dragged item
      newFiles.splice(draggedItem, 1);

      // Insert at new position
      newFiles.splice(dropIndex, 0, draggedFile);

      setFiles(newFiles);
      setDraggedItem(null);
    }
  };

  const moveFileUp = (index) => {
    if (index <= 0) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index - 1]] = [
      newFiles[index - 1],
      newFiles[index],
    ];
    setFiles(newFiles);
  };

  const moveFileDown = (index) => {
    if (index >= files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [
      newFiles[index + 1],
      newFiles[index],
    ];
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Select at least two PDFs to merge!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(`Error merging PDFs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format bytes to readable format
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
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
        <h2 className="text-3xl font-bold mb-2 text-center">Merge PDFs</h2>
        <p
          className={`text-center mb-6 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Combine multiple PDF files into one document
        </p>

        {error && (
          <div className="text-red-500 text-center mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-center mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            PDF successfully merged and downloaded!
          </div>
        )}

        {files.length === 0 ? (
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

              <h3 className="text-xl font-medium mb-2">
                Upload your PDF files
              </h3>

              <p
                className={`mb-6 max-w-md ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Select or drag & drop PDF files here to merge them into a single
                document
              </p>

              {/* The FileUploader component */}
              <FileUploader onChange={handleFileChange} hasFiles={false} />

              <div
                className={`w-full max-w-sm mt-8 pt-6 border-t ${
                  theme === "dark"
                    ? "border-gray-700 text-gray-400"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span>• Process files locally</span>
                  <span>• Rearrange document order</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* File Upload Button when files exist */}
            <FileUploader
              onChange={handleFileChange}
              hasFiles={files.length > 0}
            />

            {/* File Stats */}
            <div className="mt-4 text-center">
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {files.length} {files.length === 1 ? "file" : "files"} selected
                • Total size: {formatBytes(totalSize)}
              </p>
            </div>

            {/* Optional Filename Input */}
            <div className="mt-6">
              <label className="block font-medium mb-2">Output Filename:</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename for the merged PDF"
                className={`w-full px-4 py-3 rounded-lg border ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-white"
                    : "border-gray-300 bg-white text-black"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            {/* Uploaded PDFs List */}
            <div
              className={`mt-6 p-4 rounded-lg ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Selected PDFs:</h3>
                <div className="text-sm text-blue-500">Drag to reorder</div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {files.map((file, index) => {
                  const fileURL = URL.createObjectURL(file);
                  return (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop1(e, index)}
                      className={`flex items-center justify-between shadow-sm rounded-lg px-4 py-3 ${
                        theme === "dark"
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                          : "bg-white hover:bg-gray-100 text-gray-800"
                      } transition-colors cursor-grab border border-transparent hover:border-blue-400`}
                    >
                      <div className="flex items-center min-w-0">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold mr-3">
                          {index + 1}
                        </span>
                        <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                        <a
                          href={fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate mr-2 hover:text-blue-500"
                          title={file.name}
                        >
                          {file.name}
                        </a>
                        <span className="text-xs text-gray-500 ml-2 hidden sm:inline">
                          {formatBytes(file.size)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveFileUp(index)}
                          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                            index === 0 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowsUpDownIcon className="h-4 w-4 rotate-180" />
                        </button>
                        <button
                          onClick={() => moveFileDown(index)}
                          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                            index === files.length - 1
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={index === files.length - 1}
                          title="Move down"
                        >
                          <ArrowsUpDownIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"
                          title="Remove file"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              {files.length > 1 && (
                <button
                  onClick={mergePDFs}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-medium transition flex items-center justify-center min-w-32 ${
                    loading
                      ? "bg-green-400 dark:bg-green-600 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-400 shadow-md hover:shadow-lg"
                  } text-white`}
                >
                  {loading ? "Merging..." : "Merge PDFs"}
                </button>
              )}

              <button
                onClick={clearAllFiles}
                className="px-6 py-3 rounded-lg font-medium bg-red-500 hover:bg-red-400 transition text-white shadow-md hover:shadow-lg"
              >
                Clear All
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Your files are processed locally in your browser. No uploads to any
        server.
      </div>
    </div>
  );
}
