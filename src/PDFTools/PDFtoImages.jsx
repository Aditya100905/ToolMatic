import { useState, useEffect, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import FileUploader from "./FileUploader";
import { 
  XCircleIcon, 
  DocumentTextIcon, 
  DocumentPlusIcon, 
  ArrowDownTrayIcon, 
  ArchiveBoxIcon 
} from "@heroicons/react/24/solid";
import { useTheme } from "../ThemeProvider";

// Set worker source once
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

// Helper function to generate unique IDs
const generateUniqueId = () => Math.random().toString(36).substring(2, 15);

export default function PDFToImage() {
  const { theme } = useTheme();
  const [files, setFiles] = useState([]);
  const [fileIds, setFileIds] = useState({}); // Store file IDs separately
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [conversionProgress, setConversionProgress] = useState({ current: 0, total: 0 });

  // Format bytes to readable format
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Memoize file processing function
  const processFiles = useCallback((uploadedFiles) => {
    const pdfFiles = uploadedFiles.filter(file => file.type === "application/pdf");
    
    if (pdfFiles.length !== uploadedFiles.length) {
      setError("Only PDF files are allowed!");
    }
    
    if (pdfFiles.length > 0) {
      // Generate IDs for each file and store them separately
      const newFileIds = { ...fileIds };
      pdfFiles.forEach(file => {
        if (!newFileIds[file.name]) {
          newFileIds[file.name] = generateUniqueId();
        }
      });
      setFileIds(newFileIds);
      
      // Add the files as they are (without modifying them)
      setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
      setError("");
    }
  }, [fileIds]);

  useEffect(() => {
    if (files.length > 0) {
      convertPDFToImages();
    }
    
    // Calculate total size of files
    const size = files.reduce((total, file) => total + file.size, 0);
    setTotalSize(size);
  }, [files]);

  const handleFileChange = (event) => {
    const uploadedFiles = [...event.target.files];
    processFiles(uploadedFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = [...event.dataTransfer.files];
    processFiles(droppedFiles);
  };

  const getFileId = (file) => {
    return fileIds[file.name] || file.name; // Fallback to filename if no ID
  };

  const removeFile = (fileToRemove) => {
    const idToRemove = getFileId(fileToRemove);
    setFiles(prevFiles => prevFiles.filter(file => getFileId(file) !== idToRemove));
    setImages(prevImages => prevImages.filter(img => img.fileId !== idToRemove));
  };

  const clearAllFiles = () => {
    setFiles([]);
    setImages([]);
    setFileIds({});
    setError("");
    setSuccess(false);
    setConversionProgress({ current: 0, total: 0 });
  };

  const showSuccessMessage = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const convertPDFToImages = async () => {
    if (files.length === 0) return;
    
    setLoading(true);
    setError("");

    // Calculate total pages to process
    let totalPages = 0;
    let processedPages = 0;

    try {
      // First, count total pages across all PDFs
      for (const file of files) {
        const fileId = getFileId(file);
        
        // Skip files that have already been processed
        if (images.some(img => img.fileId === fileId)) {
          const processedFile = images.find(img => img.fileId === fileId);
          if (processedFile) {
            totalPages += processedFile.totalPages;
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
      
      // Now process each PDF
      const newImages = [];
      for (const file of files) {
        const fileId = getFileId(file);
        
        // Skip files that have already been processed
        if (images.some(img => img.fileId === fileId)) {
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

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport }).promise;

            newImages.push({
              src: canvas.toDataURL("image/png"),
              page: i,
              totalPages: pdf.numPages,
              fileName: file.name.replace(/\.pdf$/, ""),
              fileId: fileId,
            });

            // Update progress
            processedPages++;
            setConversionProgress({ current: processedPages, total: totalPages });
            
            // Update images every few pages to show progress
            if (processedPages % 5 === 0 || processedPages === totalPages) {
              setImages(prevImages => {
                const existingImages = prevImages.filter(img => 
                  !newImages.some(newImg => 
                    newImg.fileId === img.fileId && newImg.page === img.page
                  )
                );
                return [...existingImages, ...newImages];
              });
            }
          }
        } catch (err) {
          setError(`Error processing PDF ${file.name}: ${err.message}`);
        }
      }

      // Final update with all images
      setImages(prevImages => {
        const existingImages = prevImages.filter(img => 
          !newImages.some(newImg => 
            newImg.fileId === img.fileId && newImg.page === img.page
          )
        );
        return [...existingImages, ...newImages];
      });
    } catch (err) {
      setError(`Error converting PDFs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadAllImages = () => {
    images.forEach((img) => saveAs(img.src, `${img.fileName} pg ${img.page}.png`));
    showSuccessMessage();
  };

  const downloadAsZip = async () => {
    setLoading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("PDF Images");
      
      // Group images by file
      const fileGroups = {};
      images.forEach(img => {
        if (!fileGroups[img.fileName]) {
          fileGroups[img.fileName] = [];
        }
        fileGroups[img.fileName].push(img);
      });
      
      // Create subdirectories for each file
      Object.entries(fileGroups).forEach(([fileName, fileImages]) => {
        const fileFolder = folder.folder(fileName);
        fileImages.forEach(img => {
          fileFolder.file(
            `Page ${img.page.toString().padStart(3, '0')}.png`,
            img.src.split(",")[1],
            { base64: true }
          );
        });
      });
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "PDF Images.zip");
      showSuccessMessage();
    } catch (err) {
      setError(`Error creating ZIP: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isDarkMode = theme === "dark";
  
  return (
    <div
      className={`min-h-screen mt-10 flex flex-col items-center justify-center px-4 py-8 transition-colors ${
        isDarkMode ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div
        className={`max-w-3xl w-full p-6 rounded-2xl shadow-xl transition-all ${
          isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
        }`}
      >
        <h2 className="text-3xl font-bold mb-2 text-center">Convert PDF to Images</h2>
        <p className={`text-center mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Transform your PDF pages into high-quality PNG images
        </p>

        {error && (
          <div className="text-red-500 text-center mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-center mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            Images successfully downloaded!
          </div>
        )}

        {files.length === 0 ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-8 ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center text-center">
              <DocumentPlusIcon 
                className={`w-16 h-16 mb-4 ${
                  isDarkMode ? "text-blue-400" : "text-blue-500"
                }`} 
              />
              
              <h3 className="text-xl font-medium mb-2">Upload your PDF files</h3>
              
              <p className={`mb-6 max-w-md ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Select or drag & drop PDF files here to convert them into PNG images
              </p>
              
              <FileUploader onChange={handleFileChange} hasFiles={false} />
              
              <div className={`w-full max-w-sm mt-8 pt-6 border-t ${
                isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"
              }`}>
                <div className="flex items-center justify-between text-sm">
                  <span>• Process files locally</span>
                  <span>• High-quality images</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* File Upload Button when files exist */}
            <FileUploader onChange={handleFileChange} hasFiles={files.length > 0} />

            {/* File Stats */}
            <div className="mt-4 text-center">
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {files.length} {files.length === 1 ? 'file' : 'files'} selected • Total size: {formatBytes(totalSize)}
              </p>
            </div>

            {/* Uploaded PDFs List */}
            <div
              className={`mt-6 p-4 rounded-lg ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-50"
              }`}
            >
              <h3 className="text-lg font-semibold mb-3">Selected PDFs:</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {files.map((file, index) => {
                  const fileURL = URL.createObjectURL(file);
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
                      </div>
                      
                      <button 
                        onClick={() => removeFile(file)} 
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"
                        title="Remove file"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {files.length > 0 && (
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

            {/* Conversion Progress */}
            {loading && (
              <div className="mt-6 text-center py-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Converting PDFs to images...
                </p>
                
                {conversionProgress.total > 0 && (
                  <div className="mt-4 max-w-md mx-auto">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className={`text-xs font-semibold inline-block ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}>
                            Progress: {Math.round((conversionProgress.current / conversionProgress.total) * 100)}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold inline-block ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {conversionProgress.current}/{conversionProgress.total} pages
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                        <div style={{ width: `${(conversionProgress.current / conversionProgress.total) * 100}%` }} 
                             className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500">
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Converted Images Display */}
            {images.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Converted Images:</h3>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={downloadAllImages}
                      disabled={loading}
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${
                        loading
                          ? "bg-green-400 dark:bg-green-600 cursor-not-allowed opacity-70"
                          : "bg-green-500 hover:bg-green-400 shadow-sm hover:shadow"
                      } text-white transition-all`}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Download All
                    </button>
                    
                    <button
                      onClick={downloadAsZip}
                      disabled={loading}
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${
                        loading
                          ? "bg-purple-400 dark:bg-purple-600 cursor-not-allowed opacity-70"
                          : "bg-purple-500 hover:bg-purple-400 shadow-sm hover:shadow"
                      } text-white transition-all`}
                    >
                      <ArchiveBoxIcon className="h-4 w-4" />
                      Download as ZIP
                    </button>
                  </div>
                </div>

                {/* Display files that have images */}
                {files.map((file, fileIndex) => {
                  const fileId = getFileId(file);
                  const fileImages = images.filter((img) => img.fileId === fileId);
                  if (fileImages.length === 0) return null;
                  
                  return (
                    <div key={fileIndex} className={`mt-6 pt-4 ${fileIndex > 0 ? 'border-t border-gray-200 dark:border-gray-700' : ''}`}>
                      <h4 className="text-md font-semibold mb-3 flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-500" />
                        {file.name}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({fileImages.length} pages)
                        </span>
                      </h4>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {fileImages.map((image, index) => (
                          <div
                            key={`${image.fileId}-${image.page}`}
                            className={`relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all ${
                              isDarkMode ? "bg-gray-800" : "bg-gray-100"
                            }`}
                          >
                            <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center">
                              <img
                                src={image.src}
                                alt={`PDF Page ${image.page}`}
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            </div>

                            {/* Overlay with page info */}
                            <div className={`absolute bottom-0 left-0 right-0 px-3 py-2 ${
                              isDarkMode ? "bg-gray-900/80" : "bg-white/80"
                            } flex items-center justify-between backdrop-blur-sm`}>
                              <span className="text-xs font-medium">
                                Page {image.page}/{image.totalPages}
                              </span>
                              <button
                                onClick={() =>
                                  saveAs(
                                    image.src,
                                    `${image.fileName} pg ${image.page}.png`
                                  )
                                }
                                className="text-xs px-2 py-1 bg-green-500 hover:bg-green-400 text-white rounded flex items-center gap-1 transition-colors"
                              >
                                <ArrowDownTrayIcon className="h-3 w-3" />
                                Save
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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