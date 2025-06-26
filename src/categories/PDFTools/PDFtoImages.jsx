import { useState, useEffect, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { saveAs } from "file-saver";
import JSZip from "jszip";
// Add PDF-lib for custom PDF creation
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
  ScissorsIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "../../ThemeProvider";

// Set worker source with matching version
// FIXED: Ensure API version matches Worker version (using 3.4.120)
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

// Helper function to generate unique IDs
const generateUniqueId = () => Math.random().toString(36).substring(2, 15);

export default function PDFToImage() {
  const { theme } = useTheme();
  const [files, setFiles] = useState([]);
  const [fileIds, setFileIds] = useState({}); // Store file IDs separately
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState({}); // Track selected images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [totalSize, setTotalSize] = useState(0);
  const [conversionProgress, setConversionProgress] = useState({
    current: 0,
    total: 0,
  });
  const [processingAction, setProcessingAction] = useState(""); // Track current action

  // Format bytes to readable format
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Memoize file processing function
  const processFiles = useCallback(
    (uploadedFiles) => {
      const pdfFiles = uploadedFiles.filter(
        (file) => file.type === "application/pdf"
      );

      if (pdfFiles.length !== uploadedFiles.length) {
        setError("Only PDF files are allowed!");
      }

      if (pdfFiles.length > 0) {
        // Generate IDs for each file and store them separately
        const newFileIds = { ...fileIds };
        pdfFiles.forEach((file) => {
          if (!newFileIds[file.name]) {
            newFileIds[file.name] = generateUniqueId();
          }
        });
        setFileIds(newFileIds);

        // Add the files as they are (without modifying them)
        setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
        setError("");
      }
    },
    [fileIds]
  );

  useEffect(() => {
    if (files.length > 0) {
      convertPDFToImages();
    }

    // Calculate total size of files
    const size = files.reduce((total, file) => total + file.size, 0);
    setTotalSize(size);
  }, [files]);

  // Initialize selected images when new images are added
  useEffect(() => {
    const newSelectedImages = { ...selectedImages };
    images.forEach((img) => {
      const imageKey = `${img.fileId}-${img.page}`;
      if (newSelectedImages[imageKey] === undefined) {
        newSelectedImages[imageKey] = true; // Default to selected
      }
    });
    setSelectedImages(newSelectedImages);
  }, [images]);

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
    setFiles((prevFiles) =>
      prevFiles.filter((file) => getFileId(file) !== idToRemove)
    );
    setImages((prevImages) =>
      prevImages.filter((img) => img.fileId !== idToRemove)
    );

    // Clean up selectedImages for this file
    const newSelectedImages = { ...selectedImages };
    Object.keys(newSelectedImages).forEach((key) => {
      if (key.startsWith(`${idToRemove}-`)) {
        delete newSelectedImages[key];
      }
    });
    setSelectedImages(newSelectedImages);
  };

  const clearAllFiles = () => {
    setFiles([]);
    setImages([]);
    setFileIds({});
    setSelectedImages({});
    setError("");
    setSuccess("");
    setConversionProgress({ current: 0, total: 0 });
  };

  const showSuccessMessage = (message) => {
    setSuccess(message || "Download completed successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const toggleImageSelection = (fileId, page) => {
    const imageKey = `${fileId}-${page}`;
    setSelectedImages((prev) => ({
      ...prev,
      [imageKey]: !prev[imageKey],
    }));
  };

  const toggleAllImagesInFile = (fileId, selectAll) => {
    const newSelectedImages = { ...selectedImages };
    images.forEach((img) => {
      if (img.fileId === fileId) {
        const imageKey = `${img.fileId}-${img.page}`;
        newSelectedImages[imageKey] = selectAll;
      }
    });
    setSelectedImages(newSelectedImages);
  };

  const isImageSelected = (fileId, page) => {
    const imageKey = `${fileId}-${page}`;
    return selectedImages[imageKey] !== false; // Default to true if undefined
  };

  const getSelectedImagesCount = (fileId) => {
    return images
      .filter((img) => img.fileId === fileId)
      .filter((img) => isImageSelected(img.fileId, img.page)).length;
  };

  const areAllImagesSelected = (fileId) => {
    const fileImages = images.filter((img) => img.fileId === fileId);
    return fileImages.every((img) => isImageSelected(img.fileId, img.page));
  };

  const convertPDFToImages = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setProcessingAction("converting");
    setError("");

    // Calculate total pages to process
    let totalPages = 0;
    let processedPages = 0;

    try {
      // First, count total pages across all PDFs
      for (const file of files) {
        const fileId = getFileId(file);

        // Skip files that have already been processed
        if (images.some((img) => img.fileId === fileId)) {
          const processedFile = images.find((img) => img.fileId === fileId);
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

        try {
          // FIXED: Added error handling for the getDocument operation
          const typedArray = new Uint8Array(fileData);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          totalPages += pdf.numPages;
        } catch (err) {
          console.error(`Error counting pages in ${file.name}:`, err);
          setError(`Error processing PDF ${file.name}: ${err.message}`);
          // Continue with other files despite this error
        }
      }

      setConversionProgress({ current: 0, total: totalPages });

      // Now process each PDF
      const newImages = [];
      for (const file of files) {
        const fileId = getFileId(file);

        // Skip files that have already been processed
        if (images.some((img) => img.fileId === fileId)) {
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
            setConversionProgress({
              current: processedPages,
              total: totalPages,
            });

            // Update images every few pages to show progress
            if (processedPages % 5 === 0 || processedPages === totalPages) {
              setImages((prevImages) => {
                const existingImages = prevImages.filter(
                  (img) =>
                    !newImages.some(
                      (newImg) =>
                        newImg.fileId === img.fileId && newImg.page === img.page
                    )
                );
                return [...existingImages, ...newImages];
              });
            }
          }
        } catch (err) {
          console.error(`Error processing ${file.name}:`, err);
          setError(`Error processing PDF ${file.name}: ${err.message}`);
          // Continue processing other files despite this error
        }
      }

      // Final update with all images
      setImages((prevImages) => {
        const existingImages = prevImages.filter(
          (img) =>
            !newImages.some(
              (newImg) =>
                newImg.fileId === img.fileId && newImg.page === img.page
            )
        );
        return [...existingImages, ...newImages];
      });
    } catch (err) {
      console.error("Error in PDF conversion:", err);
      setError(`Error converting PDFs: ${err.message}`);
    } finally {
      setLoading(false);
      setProcessingAction("");
    }
  };

  const downloadAllImages = () => {
    setLoading(true);
    setProcessingAction("downloading");

    try {
      const selectedImagesArray = images.filter((img) =>
        isImageSelected(img.fileId, img.page)
      );

      if (selectedImagesArray.length === 0) {
        setError("No images selected for download.");
        return;
      }

      // Use setTimeout to allow UI to update before starting downloads
      setTimeout(() => {
        selectedImagesArray.forEach((img) =>
          saveAs(img.src, `${img.fileName} pg ${img.page}.png`)
        );
        showSuccessMessage("All selected images downloaded!");
        setLoading(false);
        setProcessingAction("");
      }, 100);
    } catch (err) {
      setError(`Error downloading images: ${err.message}`);
      setLoading(false);
      setProcessingAction("");
    }
  };

  const downloadAsZip = async () => {
    setLoading(true);
    setProcessingAction("zipping");
    try {
      const selectedImagesArray = images.filter((img) =>
        isImageSelected(img.fileId, img.page)
      );

      if (selectedImagesArray.length === 0) {
        setError("No images selected for ZIP download.");
        setLoading(false);
        setProcessingAction("");
        return;
      }

      const zip = new JSZip();
      const folder = zip.folder("PDF Images");

      // Group images by file
      const fileGroups = {};
      selectedImagesArray.forEach((img) => {
        if (!fileGroups[img.fileName]) {
          fileGroups[img.fileName] = [];
        }
        fileGroups[img.fileName].push(img);
      });

      // Create subdirectories for each file
      Object.entries(fileGroups).forEach(([fileName, fileImages]) => {
        const fileFolder = folder.folder(fileName);
        fileImages.forEach((img) => {
          fileFolder.file(
            `Page ${img.page.toString().padStart(3, "0")}.png`,
            img.src.split(",")[1],
            { base64: true }
          );
        });
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "PDF Images.zip");
      showSuccessMessage("ZIP file created successfully!");
    } catch (err) {
      setError(`Error creating ZIP: ${err.message}`);
    } finally {
      setLoading(false);
      setProcessingAction("");
    }
  };

  // Create a new PDF with only selected pages
  const downloadCustomPDF = async (file) => {
    setLoading(true);
    setProcessingAction("customizing");
    try {
      const fileId = getFileId(file);
      const fileImages = images.filter((img) => img.fileId === fileId);
      const selectedPages = fileImages
        .filter((img) => isImageSelected(img.fileId, img.page))
        .map((img) => img.page)
        .sort((a, b) => a - b); // Sort pages in ascending order

      if (selectedPages.length === 0) {
        setError("No pages selected for this PDF");
        setLoading(false);
        setProcessingAction("");
        return;
      }

      // Read the original PDF file
      const fileReader = new FileReader();
      const arrayBuffer = await new Promise((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(file);
      });

      // Load source PDF document
      const srcPdf = await PDFDocument.load(arrayBuffer);
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // Copy selected pages from source to new document
      for (const pageNum of selectedPages) {
        // PDF pages are 0-indexed in pdf-lib, but 1-indexed in our UI
        const [copiedPage] = await pdfDoc.copyPages(srcPdf, [pageNum - 1]);
        pdfDoc.addPage(copiedPage);
      }

      // Save the new PDF with selected pages
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      // Generate filename with selected pages info
      const baseName = file.name.replace(/\.pdf$/i, "");
      let newFileName;

      if (selectedPages.length <= 3) {
        // For few pages, list them: "document-p1-p3-p5.pdf"
        newFileName = `${baseName}-p${selectedPages.join("-p")}.pdf`;
      } else {
        // For many pages, show count: "document-5pages.pdf"
        newFileName = `${baseName}-${selectedPages.length}pages.pdf`;
      }

      saveAs(pdfBlob, newFileName);
      showSuccessMessage("Custom PDF with selected pages created!");
    } catch (err) {
      setError(`Error creating custom PDF: ${err.message}`);
    } finally {
      setLoading(false);
      setProcessingAction("");
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
        <h2 className="text-3xl font-bold mb-2 text-center">
          Convert PDF to Images
        </h2>
        <p
          className={`text-center mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Transform your PDF pages into high-quality PNG images
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

              <h3 className="text-xl font-medium mb-2">
                Upload your PDF files
              </h3>

              <p
                className={`mb-6 max-w-md ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Select or drag & drop PDF files here to convert them into PNG
                images
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
                  <span>• High-quality images</span>
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
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {files.length} {files.length === 1 ? "file" : "files"} selected
                • Total size: {formatBytes(totalSize)}
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
                  const fileId = getFileId(file);
                  const fileImages = images.filter(
                    (img) => img.fileId === fileId
                  );
                  const selectedCount = getSelectedImagesCount(fileId);

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

                        {fileImages.length > 0 && (
                          <span className="text-xs ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                            {selectedCount}/{fileImages.length} pages selected
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

            {/* Conversion Progress */}
            {loading && (
              <div className="mt-6 text-center py-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {processingAction === "converting" &&
                    "Converting PDFs to images..."}
                  {processingAction === "zipping" && "Creating ZIP archive..."}
                  {processingAction === "customizing" &&
                    "Creating custom PDF with selected pages..."}
                  {processingAction === "downloading" &&
                    "Preparing download..."}
                  {!processingAction && "Processing..."}
                </p>

                {conversionProgress.total > 0 &&
                  processingAction === "converting" && (
                    <div className="mt-4 max-w-md mx-auto">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span
                              className={`text-xs font-semibold inline-block ${
                                isDarkMode ? "text-blue-400" : "text-blue-600"
                              }`}
                            >
                              Progress:{" "}
                              {Math.round(
                                (conversionProgress.current /
                                  conversionProgress.total) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-xs font-semibold inline-block ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {conversionProgress.current}/
                              {conversionProgress.total} pages
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                          <div
                            style={{
                              width: `${
                                (conversionProgress.current /
                                  conversionProgress.total) *
                                100
                              }%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          ></div>
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
                      Download Selected
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
                  const fileImages = images.filter(
                    (img) => img.fileId === fileId
                  );
                  if (fileImages.length === 0) return null;

                  const selectedCount = getSelectedImagesCount(fileId);
                  const areAllSelected = areAllImagesSelected(fileId);

                  return (
                    <div
                      key={fileIndex}
                      className={`mt-6 pt-4 ${
                        fileIndex > 0
                          ? "border-t border-gray-200 dark:border-gray-700"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-semibold flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-500" />
                          {file.name}
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({selectedCount}/{fileImages.length} selected)
                          </span>
                        </h4>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              toggleAllImagesInFile(fileId, !areAllSelected)
                            }
                            className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                              areAllSelected
                                ? "bg-red-200 text-red-800 hover:bg-red-300 hover:scale-105 transition-transform dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
                                : "bg-green-200 text-green-800 hover:bg-green-300 hover:scale-105 transition-transform dark:bg-green-800 dark:text-green-200 dark:hover:bg-green-700"
                            }`}
                          >
                            {areAllSelected ? (
                              <>
                                <XMarkIcon className="h-3 w-3" />
                                Deselect All
                              </>
                            ) : (
                              <>
                                <CheckCircleIcon className="h-3 w-3" />
                                Select All
                              </>
                            )}
                          </button>

                          {selectedCount > 0 &&
                            selectedCount < fileImages.length && (
                              <button
                                onClick={() => downloadCustomPDF(file)}
                                disabled={loading}
                                className={`text-xs px-3 py-1 rounded flex items-center gap-1 transition 
                                ${
                                  loading
                                    ? "bg-indigo-400 dark:bg-indigo-600 cursor-not-allowed opacity-70"
                                    : "bg-indigo-500 hover:bg-indigo-400 shadow-sm hover:shadow"
                                } text-white`}
                              >
                                <ScissorsIcon className="h-3 w-3" />
                                Create Custom PDF
                              </button>
                            )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {fileImages.map((image, imgIndex) => (
                          <div
                            key={`${fileId}-${image.page}`}
                            className={`relative group overflow-hidden rounded-lg border-2 transition-all ${
                              isImageSelected(fileId, image.page)
                                ? "border-blue-500 shadow-md"
                                : isDarkMode
                                ? "border-gray-700"
                                : "border-gray-200"
                            }`}
                          >
                            <div
                              className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                                isImageSelected(fileId, image.page)
                                  ? "opacity-0"
                                  : "bg-gray-900 bg-opacity-40 opacity-100"
                              } group-hover:opacity-100 z-10`}
                            >
                              <button
                                onClick={() =>
                                  toggleImageSelection(fileId, image.page)
                                }
                                className={`p-2 rounded-full transition ${
                                  isImageSelected(fileId, image.page)
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-green-500 hover:bg-green-600"
                                } shadow-md`}
                              >
                                {isImageSelected(fileId, image.page) ? (
                                  <XMarkIcon className="h-6 w-6 text-white" />
                                ) : (
                                  <CheckCircleIcon className="h-6 w-6 text-white" />
                                )}
                              </button>
                            </div>

                            <img
                              src={image.src}
                              alt={`Page ${image.page} of ${file.name}`}
                              className={`w-full object-contain transition-all ${
                                !isImageSelected(fileId, image.page) &&
                                "opacity-50"
                              }`}
                            />

                            <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-70 text-white text-center text-xs py-1">
                              Page {image.page} of {image.totalPages}
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

      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          All processing is done locally in your browser. Your files are not
          uploaded to any server.
        </p>
        <p className="mt-1">
          &copy; {new Date().getFullYear()} PDF to Image Converter
        </p>
      </footer>
    </div>
  );
}
