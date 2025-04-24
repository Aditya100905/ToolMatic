import { useState, useEffect, useCallback, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import FileUploader from "./FileUploader";
import {
  XCircleIcon,
  DocumentTextIcon,
  DocumentPlusIcon,
  ArrowDownTrayIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "../ThemeProvider";

// Set the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

// Generate unique IDs for files
const generateUniqueId = () => Math.random().toString(36).substring(2, 15);

export default function PDFReordering() {
  const { theme } = useTheme();
  const [files, setFiles] = useState([]);
  const [fileIds, setFileIds] = useState({});
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [totalSize, setTotalSize] = useState(0);
  const [conversionProgress, setConversionProgress] = useState({
    current: 0,
    total: 0,
  });
  const [processingAction, setProcessingAction] = useState("");
  const [draggedPage, setDraggedPage] = useState(null);
  const [reorderHistory, setReorderHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [outputFileName, setOutputFileName] = useState("");
  const outputFileNameRef = useRef(null);

  // Format file size in readable units
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

//   // Process uploaded files - keeping original file order
//   const processFiles = useCallback((uploadedFiles) => {
//     const pdfFiles = uploadedFiles.filter((file) => file.type === "application/pdf");
    
//     if (pdfFiles.length !== uploadedFiles.length) {
//       setError("Only PDF files are allowed!");
//     }
    
//     if (pdfFiles.length > 0) {
//       const newFileIds = { ...fileIds };
//       const newFiles = [...files];
//       const fileOrder = newFiles.length; // Starting order for newly added files
      
//       pdfFiles.forEach((file, index) => {
//         if (!newFileIds[file.name]) {
//           const fileId = generateUniqueId();
//           newFileIds[file.name] = fileId;
//           // Store file with its order to maintain upload sequence
//           file.order = fileOrder + index;
//         }
//       });
      
//       setFileIds(newFileIds);
//       setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
      
//       // Set default output filename based on first file
//       if (prevFiles.length === 0 && pdfFiles.length > 0) {
//         const defaultFileName = pdfFiles[0].name.replace(/\.pdf$/i, "") + "-reordered.pdf";
//         setOutputFileName(defaultFileName);
//       }
      
//       setError("");
//     }
//   }, [fileIds, files]);

// Process uploaded files - keeping original file order
const processFiles = useCallback((uploadedFiles) => {
    const pdfFiles = uploadedFiles.filter((file) => file.type === "application/pdf");
    
    if (pdfFiles.length !== uploadedFiles.length) {
      setError("Only PDF files are allowed!");
    }
    
    if (pdfFiles.length > 0) {
      const newFileIds = { ...fileIds };
      const newFiles = [...files];
      const fileOrder = newFiles.length; // Starting order for newly added files
      
      pdfFiles.forEach((file, index) => {
        if (!newFileIds[file.name]) {
          const fileId = generateUniqueId();
          newFileIds[file.name] = fileId;
          // Store file with its order to maintain upload sequence
          file.order = fileOrder + index;
        }
      });
      
      setFileIds(newFileIds);
      setFiles((prevFiles) => {
        // Set default output filename based on first file
        if (prevFiles.length === 0 && pdfFiles.length > 0) {
          const defaultFileName = pdfFiles[0].name.replace(/\.pdf$/i, "") + "-reordered.pdf";
          setOutputFileName(defaultFileName);
        }
        return [...prevFiles, ...pdfFiles];
      });
      
      setError("");
    }
  }, [fileIds, files]);

  // Update total size when files change
  useEffect(() => {
    if (files.length > 0) {
      extractPDFPages();
    }
    
    const size = files.reduce((total, file) => total + file.size, 0);
    setTotalSize(size);
  }, [files]);

  // Handle file selection
  const handleFileChange = (event) => {
    const uploadedFiles = [...event.target.files];
    processFiles(uploadedFiles);
  };

  // Handle file drop
  const handleFileDrop = (event) => {
    event.preventDefault();
    if (!draggedPage) {
      const droppedFiles = [...event.dataTransfer.files];
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    }
    setIsDraggingFile(false);
  };

  // Handle drag events
  const handleDragEnter = (event) => {
    event.preventDefault();
    if (!draggedPage && event.dataTransfer.types.includes('Files')) {
      setIsDraggingFile(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Get file ID
  const getFileId = (file) => {
    return fileIds[file.name] || file.name;
  };

  // Remove a file
  const removeFile = (fileToRemove) => {
    const idToRemove = getFileId(fileToRemove);
    
    // Remove file from files array
    const updatedFiles = files.filter((file) => getFileId(file) !== idToRemove);
    setFiles(updatedFiles);
    
    // Remove pages associated with this file
    const updatedPages = pages.filter((page) => page.fileId !== idToRemove);
    
    // Update page order numbers
    updatedPages.forEach((page, index) => {
      page.newOrder = index + 1;
    });
    
    setPages(updatedPages);
    
    // Update history
    const newHistory = [updatedPages];
    setReorderHistory(newHistory);
    setHistoryIndex(0);
    
    // Update output filename if needed
    if (files.length === 1 && updatedFiles.length === 0) {
      setOutputFileName("");
    } else if (fileToRemove === files[0] && updatedFiles.length > 0) {
      const defaultFileName = updatedFiles[0].name.replace(/\.pdf$/i, "") + "-reordered.pdf";
      setOutputFileName(defaultFileName);
    }
  };

  // Clear all files
  const clearAllFiles = () => {
    setFiles([]);
    setPages([]);
    setFileIds({});
    setError("");
    setSuccess("");
    setOutputFileName("");
    setConversionProgress({ current: 0, total: 0 });
    setReorderHistory([]);
    setHistoryIndex(-1);
  };

  // Show success message
  const showSuccessMessage = (message) => {
    setSuccess(message || "Operation completed successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Extract pages from PDFs - preserving file order
  const extractPDFPages = async () => {
    if (files.length === 0) return;
    
    setLoading(true);
    setProcessingAction("extracting");
    setError("");
    
    let totalPages = 0;
    let processedPages = 0;
    
    try {
      // First pass: count total pages
      for (const file of files) {
        const fileId = getFileId(file);
        
        // Skip already processed files
        if (pages.some((page) => page.fileId === fileId)) {
          const processedFilePages = pages.filter((page) => page.fileId === fileId);
          if (processedFilePages.length > 0) {
            totalPages += processedFilePages.length;
          }
          continue;
        }
        
        const fileReader = new FileReader();
        const fileData = await new Promise((resolve, reject) => {
          fileReader.onload = () => resolve(fileReader.result);
          fileReader.onerror = reject;
          fileReader.readAsArrayBuffer(file);
        });
        
        const typedArray = new Uint8Array(fileData);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        totalPages += pdf.numPages;
      }
      
      setConversionProgress({ current: 0, total: totalPages });
      
      // Second pass: process pages - respect file order
      const newPages = [];
      // Sort files by their order property to maintain upload sequence
      const sortedFiles = [...files].sort((a, b) => (a.order || 0) - (b.order || 0));
      
      for (const file of sortedFiles) {
        const fileId = getFileId(file);
        
        // Skip already processed files
        if (pages.some((page) => page.fileId === fileId)) {
          const existingPages = pages.filter((page) => page.fileId === fileId);
          newPages.push(...existingPages);
          processedPages += existingPages.length;
          continue;
        }
        
        const fileReader = new FileReader();
        const fileData = await new Promise((resolve, reject) => {
          fileReader.onload = () => resolve(fileReader.result);
          fileReader.onerror = reject;
          fileReader.readAsArrayBuffer(file);
        });
        
        try {
          const typedArray = new Uint8Array(fileData);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          const filePages = [];
          
          // Calculate starting order based on already processed pages
          const startingOrder = processedPages + 1;
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({
              canvasContext: context,
              viewport
            }).promise;
            
            const pageObj = {
              src: canvas.toDataURL("image/png"),
              originalPage: i,
              newOrder: startingOrder + i - 1,
              totalPages: pdf.numPages,
              fileName: file.name.replace(/\.pdf$/, ""),
              fileId: fileId,
              file: file,
              fileOrder: file.order || 0,
              width: viewport.width,
              height: viewport.height,
            };
            
            filePages.push(pageObj);
            newPages.push(pageObj);
            processedPages++;
            
            setConversionProgress({
              current: processedPages,
              total: totalPages,
            });
            
            // Update state periodically to show progress
            if (processedPages % 5 === 0 || processedPages === totalPages) {
              setPages((prevPages) => {
                const existingPages = prevPages.filter(
                  (pg) => !newPages.some((newPg) => newPg.fileId === pg.fileId && newPg.originalPage === pg.originalPage)
                );
                return [...existingPages, ...newPages];
              });
            }
          }
        } catch (err) {
          setError(`Error processing PDF ${file.name}: ${err.message}`);
        }
      }
      
      // Final update with all pages
      setPages((prevPages) => {
        const existingPages = prevPages.filter(
          (pg) => !newPages.some((newPg) => newPg.fileId === pg.fileId && newPg.originalPage === pg.originalPage)
        );
        const allPages = [...existingPages, ...newPages];
        
        // Initialize history if needed
        if (historyIndex === -1 && allPages.length > 0) {
          setReorderHistory([allPages]);
          setHistoryIndex(0);
        }
        
        return allPages;
      });
    } catch (err) {
      setError(`Error extracting PDF pages: ${err.message}`);
    } finally {
      setLoading(false);
      setProcessingAction("");
    }
  };

  // Drag and drop for page reordering
  const handleDragStart = (e, page) => {
    e.stopPropagation();
    setDraggedPage(page);
    e.dataTransfer.setData("text/plain", "page-reordering");
    e.dataTransfer.effectAllowed = "move";
  };

  const handlePageDrop = (e, targetPage) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedPage || draggedPage === targetPage) {
      setDraggedPage(null);
      return;
    }
    
    const updatedPages = [...pages];
    const sourceIndex = updatedPages.findIndex(
      (p) => p.fileId === draggedPage.fileId && p.originalPage === draggedPage.originalPage
    );
    const targetIndex = updatedPages.findIndex(
      (p) => p.fileId === targetPage.fileId && p.originalPage === targetPage.originalPage
    );
    
    const [movedPage] = updatedPages.splice(sourceIndex, 1);
    updatedPages.splice(targetIndex, 0, movedPage);
    
    // Update order numbers
    updatedPages.forEach((page, index) => {
      page.newOrder = index + 1;
    });
    
    setPages(updatedPages);
    setDraggedPage(null);
    
    // Update history
    const newHistory = reorderHistory.slice(0, historyIndex + 1);
    newHistory.push(updatedPages);
    setReorderHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };





  // Reset page order - preserving file order
  const resetOrder = () => {
    if (pages.length === 0) return;
    
    // Group pages by fileId
    const pagesByFile = {};
    pages.forEach(page => {
      if (!pagesByFile[page.fileId]) {
        pagesByFile[page.fileId] = [];
      }
      pagesByFile[page.fileId].push(page);
    });
    
    // Sort files by their original order
    const sortedFileIds = Object.keys(pagesByFile).sort((a, b) => {
      const fileA = pagesByFile[a][0].file;
      const fileB = pagesByFile[b][0].file;
      return (fileA.order || 0) - (fileB.order || 0);
    });
    
    // Reset pages in original file and page order
    let newOrder = 1;
    const resetPages = [];
    
    for (const fileId of sortedFileIds) {
      const filePages = pagesByFile[fileId];
      // Sort pages within each file by original page number
      filePages.sort((a, b) => a.originalPage - b.originalPage);
      
      filePages.forEach(page => {
        page.newOrder = newOrder++;
        resetPages.push(page);
      });
    }
    
    setPages([...resetPages]);
    
    // Update history
    const newHistory = reorderHistory.slice(0, historyIndex + 1);
    newHistory.push(resetPages);
    setReorderHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle output filename change
  const handleFileNameChange = (e) => {
    setOutputFileName(e.target.value);
  };

  // Create reordered PDF
  const createReorderedPDF = async () => {
    if (pages.length === 0) {
      setError("No pages available to create PDF");
      return;
    }
    
    // Ensure we have a filename
    let fileName = outputFileName.trim();
    if (!fileName) {
      fileName = files.length === 1 
        ? `${files[0].name.replace(/\.pdf$/i, "")}-reordered.pdf` 
        : "reordered-document.pdf";
    }
    
    // Add .pdf extension if not present
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      fileName += '.pdf';
    }
    
    setLoading(true);
    setProcessingAction("creating");
    
    try {
      const pdfDoc = await PDFDocument.create();
      
      // Copy pages in the current order (sorted by newOrder)
      for (const page of [...pages].sort((a, b) => a.newOrder - b.newOrder)) {
        const fileReader = new FileReader();
        const fileData = await new Promise((resolve, reject) => {
          fileReader.onload = () => resolve(fileReader.result);
          fileReader.onerror = reject;
          fileReader.readAsArrayBuffer(page.file);
        });
        
        const srcPdf = await PDFDocument.load(fileData);
        const [copiedPage] = await pdfDoc.copyPages(srcPdf, [page.originalPage - 1]);
        pdfDoc.addPage(copiedPage);
      }
      
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      
      saveAs(pdfBlob, fileName);
      showSuccessMessage(`Reordered PDF "${fileName}" created successfully!`);
    } catch (err) {
      setError(`Error creating reordered PDF: ${err.message}`);
    } finally {
      setLoading(false);
      setProcessingAction("");
    }
  };

  // Download pages as ZIP


  const isDarkMode = theme === "dark";

  return (
    <div
      className={`min-h-screen mt-10 flex flex-col items-center justify-center px-4 py-8 transition-colors ${
        isDarkMode ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
      onDragEnter={handleDragEnter}
    >
      <div
        className={`max-w-3xl w-full p-6 rounded-2xl shadow-xl transition-all ${
          isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
        }`}
      >
        <h2 className="text-3xl font-bold mb-2 text-center">PDF Page Reordering Tool</h2>
        <p
          className={`text-center mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          Reorder your PDF pages and create a new document
        </p>

        {error && (
          <div className="text-red-500 text-center mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="text-green-500 text-center mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center gap-2">
            <CheckCircleIcon className="h-5 w-5" />
            {success}
          </div>
        )}
        
        {files.length === 0 ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            } ${isDraggingFile ? "bg-blue-50 dark:bg-blue-900/20 border-blue-400" : ""}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleFileDrop}
          >
            <div className="flex flex-col items-center text-center">
              <DocumentPlusIcon
                className={`w-16 h-16 mb-4 ${
                  isDarkMode ? "text-blue-400" : "text-blue-500"
                }`}
              />
              <h3 className="text-xl font-medium mb-2">Upload your PDF files</h3>
              <p
                className={`mb-6 max-w-md ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Select or drag&drop PDF files here to reorder their pages
              </p>
              <FileUploader onChange={handleFileChange} hasFiles={false} />
              <div
                className={`w-full max-w-sm mt-8 pt-6 border-t ${
                  isDarkMode
                    ? "border-gray-700 text-gray-400"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span>• Process files locally</span>
                  <span>• Easy page reordering</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`${isDraggingFile ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-400 rounded-lg p-4" : ""}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleFileDrop}
            >
              <FileUploader
                onChange={handleFileChange}
                hasFiles={files.length > 0}
              />
            </div>

            <div className="mt-4 text-center">
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {files.length} {files.length === 1 ? "file" : "files"} selected
                • Total size: {formatBytes(totalSize)}
              </p>
            </div>

            <div
              className={`mt-6 p-4 rounded-lg ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-50"
              }`}
            >
              <h3 className="text-lg font-semibold mb-3">Selected PDFs:</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {/* Sort files based on their order property to maintain upload sequence */}
                {[...files]
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((file, index) => {
                    const fileURL = URL.createObjectURL(file);
                    const fileId = getFileId(file);
                    const filePages = pages.filter((page) => page.fileId === fileId);
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between shadow-sm rounded-lg px-4 py-3 ${
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                            : "bg-white hover:bg-gray-100 text-gray-800"
                        } transition-colors border border-transparent`}
                      >
                        <div className="flex items-center min-w-0 overflow-hidden">
                          <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                          <a
                            href={fileURL}
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
                          {filePages.length > 0 && (
                            <span className="text-xs ml-2 bg-blue-100 dark:bg-blue-900 flex-wrap text-center text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                              {filePages.length} pages
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFile(file)}
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
              
              {files.length > 1 && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={clearAllFiles}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <XCircleIcon className="h-4 w-4" />
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {loading && (
              <div className="mt-6 text-center py-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                <p
                  className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {processingAction === "extracting" && "Extracting PDF pages..."}
                  {processingAction === "creating" && "Creating reordered PDF..."}
                  {processingAction === "zipping" && "Creating ZIP archive..."}
                  {!processingAction && "Processing..."}
                </p>
                
                {conversionProgress.total > 0 && processingAction === "extracting" && (
                  <div className="mt-4 max-w-md mx-auto">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span
                            className={`text-xs font-semibold inline-block ${
                              isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                          >
                            Progress: {Math.round((conversionProgress.current / conversionProgress.total) * 100)}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-semibold inline-block ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {conversionProgress.current}/{conversionProgress.total} pages
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                        <div
                          style={{
                            width: `${(conversionProgress.current / conversionProgress.total) * 100}%`,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {pages.length > 0 && (
          <div className="mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
              <h3 className="text-xl font-semibold">PDF Pages:</h3>
              
              {/* Output filename input field */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="flex-1">
                  <label 
                    htmlFor="outputFileName" 
                    className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Output Filename:
                  </label>
                  <input
                    type="text"
                    id="outputFileName"
                    ref={outputFileNameRef}
                    value={outputFileName}
                    onChange={handleFileNameChange}
                    className={`block w-full rounded-md px-3 py-2 text-sm border ${
                      isDarkMode 
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 outline-none" 
                        : "bg-white border-gray-300 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    }`}
                    placeholder="reordered-document.pdf"
                  />
                </div>
                
                <div className="flex sm:flex-col justify-end gap-2 mt-auto">
                  <button
                    onClick={createReorderedPDF}
                    disabled={loading || pages.length === 0}
                    className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg text-white shadow-sm ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } transition-colors`}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span>Download PDF</span>
                  </button>

                </div>
              </div>
            </div>
            
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={resetOrder}
                disabled={loading || pages.length === 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                  loading
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span>Reset Order</span>
              </button>
              

            </div>
            
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              Drag and drop to reorder pages. Each thumbnail shows page number and source file.
            </p>
            
            {pages.length > 0 && (
              <div 
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto p-2"
                onDragOver={handleDragOver}
              >
                {[...pages]
                  .sort((a, b) => a.newOrder - b.newOrder)
                  .map((page, index) => {
                    const isBeingDragged = draggedPage && 
                      draggedPage.fileId === page.fileId && 
                      draggedPage.originalPage === page.originalPage;
                    
                    return (
                      <div
                        key={`${page.fileId}-${page.originalPage}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, page)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handlePageDrop(e, page)}
                        className={`relative flex flex-col items-center border rounded-lg overflow-hidden transition-all ${
                          isBeingDragged
                            ? "opacity-50"
                            : draggedPage
                              ? "hover:outline-2 hover:outline-blue-500"
                              : ""
                        } ${
                          isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="w-full aspect-[99/100] flex items-center justify-center bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <img
                            src={page.src}
                            alt={`Page ${page.originalPage} of ${page.fileName}`}
                            className="max-w-full max-h-full object-contain"
                            style={{
                              maxHeight: "175px",
                            }}
                          />
                        </div>
                        
                        <div
                          className={`w-full p-2 text-xs text-center font-medium flex flex-col items-center justify-center ${
                            isDarkMode ? "bg-gray-800" : "bg-white"
                          }`}
                        >
                          <span className="flex items-center justify-center">
                            <ArrowsUpDownIcon className="h-3.5 w-3.5 text-blue-500 mr-1" />
                            <span className="text-base font-bold text-blue-500">{page.newOrder}</span>
                          </span>
                          <div
                            className={`truncate max-w-full ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                            title={page.fileName}
                          >
                            {page.fileName}
                          </div>
                          <div
                            className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            Pg {page.originalPage}/{page.totalPages}
                          </div>
                        </div>
                        
                        {draggedPage && !isBeingDragged && (
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-blue-500/10 z-10"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handlePageDrop(e, page)}
                          >
                            <div
                              className="absolute top-0 bottom-0 left-0 w-1/2 bg-blue-500/10"
                              data-position="before"
                            ></div>
                            <div
                              className="absolute top-0 bottom-0 right-0 w-1/2 bg-blue-500/10"
                              data-position="after"
                            ></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>
      
      {isDraggingFile && !draggedPage && (
        <div
          className="fixed inset-0 bg-blue-500/10 flex items-center justify-center z-50 pointer-events-none"
          onDragOver={handleDragOver}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl flex flex-col items-center">
            <DocumentPlusIcon className="h-16 w-16 text-blue-500 mb-3" />
            <h3 className="text-xl font-bold">Drop PDF Files Here</h3>
          </div>
        </div>
      )}

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Your files are processed locally in your browser. No uploads to any server.
      </div>
    </div>
  );
}