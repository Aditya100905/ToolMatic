import { useState, useEffect, useCallback } from "react";
import { saveAs } from "file-saver";
import { pdf, Text } from "@react-pdf/renderer";
import { Document, Page, Image, StyleSheet } from "@react-pdf/renderer";
import FileUploader from "./FileUploader";
import {
  XCircleIcon,
  PhotoIcon,
  DocumentPlusIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  CheckCircleIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";
import { useTheme } from "../ThemeProvider";
import { GripIcon } from "lucide-react";

if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = {
    from: (arr) => new Uint8Array(arr),
    isBuffer: (obj) => obj instanceof Uint8Array,
  };
}

// Helper function to generate unique IDs
const generateUniqueId = () => Math.random().toString(36).substring(2, 15);

// Create styles for PDF document
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 12,
    color: "grey",
  },
});

export default function ImageToPDF() {
  const { theme } = useTheme();
  const [files, setFiles] = useState([]);
  const [fileIds, setFileIds] = useState({});
  const [imageObjects, setImageObjects] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [conversionProgress, setConversionProgress] = useState({
    current: 0,
    total: 0,
  });
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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
      const supportedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
        "image/tiff",
        "image/svg+xml",
      ];

      const imageFiles = uploadedFiles.filter((file) =>
        supportedImageTypes.includes(file.type)
      );

      if (imageFiles.length !== uploadedFiles.length) {
        setError("Only image files are allowed!");
      }

      if (imageFiles.length > 0) {
        // Generate IDs for each file and store them separately
        const newFileIds = { ...fileIds };
        const newSelectedImages = { ...selectedImages };

        imageFiles.forEach((file) => {
          if (!newFileIds[file.name]) {
            const id = generateUniqueId();
            newFileIds[file.name] = id;
            // Default all new images to selected
            newSelectedImages[id] = true;
          }
        });

        setFileIds(newFileIds);
        setSelectedImages(newSelectedImages);

        // Add the files
        setFiles((prevFiles) => [...prevFiles, ...imageFiles]);
        setError("");
      }
    },
    [fileIds, selectedImages]
  );

  useEffect(() => {
    if (files.length > 0) {
      loadImagePreviews();
    }

    // Calculate total size of files
    const size = files.reduce((total, file) => total + file.size, 0);
    setTotalSize(size);
  }, [files]);

  // Clear PDF preview when images are reordered
  useEffect(() => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  }, [imageObjects]);

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
    setImageObjects((prevImages) =>
      prevImages.filter((img) => img.fileId !== idToRemove)
    );

    // Also clean up from selectedImages
    const newSelectedImages = { ...selectedImages };
    delete newSelectedImages[idToRemove];
    setSelectedImages(newSelectedImages);
  };

  const toggleImageSelection = (fileId) => {
    setSelectedImages((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));

    // Clear PDF preview when selection changes
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  const clearAllFiles = () => {
    setFiles([]);
    setImageObjects([]);
    setFileIds({});
    setSelectedImages({});
    setError("");
    setSuccess(false);
    setPdfPreviewUrl(null);
    setConversionProgress({ current: 0, total: 0 });
  };

  const showSuccessMessage = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const loadImagePreviews = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setError("");
    setConversionProgress({ current: 0, total: files.length });

    try {
      const newImages = [];
      let processedFiles = 0;

      for (const file of files) {
        const fileId = getFileId(file);

        // Skip files that have already been processed
        if (imageObjects.some((img) => img.fileId === fileId)) {
          processedFiles++;
          setConversionProgress({
            current: processedFiles,
            total: files.length,
          });
          continue;
        }

        try {
          const imageUrl = URL.createObjectURL(file);

          newImages.push({
            src: imageUrl,
            fileName: file.name,
            fileId: fileId,
            file: file,
          });

          // Make sure new images are selected by default
          if (selectedImages[fileId] === undefined) {
            setSelectedImages((prev) => ({
              ...prev,
              [fileId]: true,
            }));
          }

          // Update progress
          processedFiles++;
          setConversionProgress({
            current: processedFiles,
            total: files.length,
          });

          // Update images periodically to show progress
          if (processedFiles % 5 === 0 || processedFiles === files.length) {
            setImageObjects((prevImages) => {
              const existingImages = prevImages.filter(
                (img) =>
                  !newImages.some((newImg) => newImg.fileId === img.fileId)
              );
              return [...existingImages, ...newImages];
            });
          }
        } catch (err) {
          setError(`Error processing image ${file.name}: ${err.message}`);
        }
      }

      // Final update with all images
      setImageObjects((prevImages) => {
        const existingImages = prevImages.filter(
          (img) => !newImages.some((newImg) => newImg.fileId === img.fileId)
        );
        return [...existingImages, ...newImages];
      });
    } catch (err) {
      setError(`Error processing images: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    // Only use selected images
    const selectedImagesArr = imageObjects.filter(
      (img) => selectedImages[img.fileId]
    );

    if (selectedImagesArr.length === 0) {
      setError("Please select at least one image to convert to PDF");
      return;
    }

    setLoading(true);
    try {
      // Create PDF Document
      const MyDocument = () => (
        <Document>
          {selectedImagesArr.map((img, index) => (
            <Page key={index} size="A4" style={styles.page}>
              <Image src={img.src} style={styles.image} />
              <Text style={styles.pageNumber}>Page {index + 1}</Text>
            </Page>
          ))}
        </Document>
      );

      // Generate PDF blob
      const pdfBlob = await pdf(<MyDocument />).toBlob();

      // Create URL for preview
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
      const previewUrl = URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(previewUrl);

      showSuccessMessage();
    } catch (err) {
      setError(`Error generating PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!pdfPreviewUrl) {
      await generatePDF();
    }

    try {
      saveAs(pdfPreviewUrl, "Images_to_PDF.pdf");
      showSuccessMessage();
    } catch (err) {
      setError(`Error downloading PDF: ${err.message}`);
    }
  };

  // Image reordering functions
  const moveImage = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    const updatedImageObjects = [...imageObjects];
    const [movedItem] = updatedImageObjects.splice(fromIndex, 1);
    updatedImageObjects.splice(toIndex, 0, movedItem);

    setImageObjects(updatedImageObjects);

    // Clear PDF preview when order changes
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  const handleDragStart = (index) => {
    setDraggingIndex(index);
    setIsDragging(true);
  };

  const handleDragEnter = (index) => {
    if (draggingIndex === null) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (
      draggingIndex !== null &&
      dragOverIndex !== null &&
      draggingIndex !== dragOverIndex
    ) {
      moveImage(draggingIndex, dragOverIndex);
    }
    setDraggingIndex(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const moveImageUp = (index) => {
    if (index > 0) {
      moveImage(index, index - 1);
    }
  };

  const moveImageDown = (index) => {
    if (index < imageObjects.length - 1) {
      moveImage(index, index + 1);
    }
  };

  const isDarkMode = theme === "dark";

  // Get count of selected images
  const selectedCount = Object.values(selectedImages).filter(Boolean).length;

  return (
    <div
      className={`min-h-screen mt-10 flex flex-col items-center justify-center px-4 py-8 transition-colors ${
        isDarkMode ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div
        className={`max-w-4xl w-full p-6 rounded-2xl shadow-xl transition-all ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <h2 className="text-3xl font-bold mb-2 text-center">
          Convert Images to PDF
        </h2>
        <p
          className={`text-center mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          Combine multiple images into a single PDF document
        </p>

        {error && (
          <div className="text-red-500 text-center mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-500 text-center mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            PDF successfully generated!
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
                Upload your image files
              </h3>

              <p
                className={`mb-6 max-w-md ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Select or drag & drop image files here to combine them into a
                PDF
              </p>

              <FileUploader
                onChange={handleFileChange}
                hasFiles={false}
                accept="image/*"
              />

              <div
                className={`w-full max-w-sm mt-8 pt-6 border-t ${
                  isDarkMode
                    ? "border-gray-700 text-gray-400"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span>• Process files locally</span>
                  <span>• Supports multiple formats</span>
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
              accept="image/*"
            />

            {/* File Stats */}
            <div className="mt-4 text-center">
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {files.length} {files.length === 1 ? "image" : "images"}{" "}
                selected •{selectedCount} of {files.length} included • Total
                size: {formatBytes(totalSize)}
              </p>
            </div>

            {/* Uploaded Images List */}
            <div
              className={`mt-6 p-4 rounded-lg ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-50"
              }`}
            >
              <h3 className="text-lg font-semibold mb-3">Selected Images:</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {files.map((file, index) => {
                  const fileId = getFileId(file);
                  const fileURL = URL.createObjectURL(file);
                  const isSelected = selectedImages[fileId] !== false;

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between shadow-sm rounded-lg px-4 py-3 ${
                        isDarkMode
                          ? `${isSelected ? "bg-gray-700" : "bg-gray-800"} hover:bg-gray-600 text-gray-200`
                          : `${isSelected ? "bg-white" : "bg-gray-100"} hover:bg-gray-100 text-gray-800`
                      } transition-colors border ${isSelected ? "border-blue-500/30" : "border-transparent"}`}
                    >
                      <div className="flex items-center min-w-0 overflow-hidden">
                        {/* Checkbox for image selection */}
                        <button
                          onClick={() => toggleImageSelection(fileId)}
                          className={`mr-2 p-1 rounded-md ${
                            isSelected
                              ? "text-blue-500 bg-blue-100 dark:bg-blue-900/30"
                              : "text-gray-400 bg-gray-100 dark:bg-gray-700"
                          }`}
                          title={
                            isSelected
                              ? "Uncheck to exclude"
                              : "Check to include"
                          }
                        >
                          {isSelected ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <XCircleIcon className="h-5 w-5" />
                          )}
                        </button>

                        <PhotoIcon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                        <a
                          href={fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`truncate hover:text-blue-500 ${!isSelected && "opacity-60"}`}
                          title={file.name}
                        >
                          {file.name}
                        </a>
                        <span
                          className={`text-xs text-gray-500 ml-2 hidden sm:inline ${!isSelected && "opacity-60"}`}
                        >
                          {formatBytes(file.size)}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFile(file)}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"
                        title="Remove file"
                      >
                        <TrashIcon className="h-5 w-5" />
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

            {/* Reorder Instructions */}
            {imageObjects.length > 1 && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
                } border ${isDarkMode ? "border-blue-800" : "border-blue-100"}`}
              >
                <p
                  className={`text-sm ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}
                >
                  <GripIcon className="h-4 w-4 inline-block mr-1" />
                  You can reorder images by dragging them or using the up/down
                  arrows to arrange pages in your PDF.
                </p>
              </div>
            )}

            {/* Processing Progress */}
            {loading && (
              <div className="mt-6 text-center py-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                <p
                  className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {pdfPreviewUrl ? "Generating PDF..." : "Processing images..."}
                </p>

                {conversionProgress.total > 0 && !pdfPreviewUrl && (
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
                            className={`text-xs font-semibold inline-block ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {conversionProgress.current}/
                            {conversionProgress.total} images
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

            {/* Image Previews and Actions */}
            {imageObjects.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Image Previews:</h3>

                  <div className="flex gap-2">
                    <button
                      onClick={generatePDF}
                      disabled={loading || selectedCount === 0}
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${
                        loading || selectedCount === 0
                          ? "bg-blue-400 dark:bg-blue-600 cursor-not-allowed opacity-70"
                          : "bg-blue-500 hover:bg-blue-400 shadow-sm hover:shadow"
                      } text-white transition-all`}
                    >
                      <DocumentIcon className="h-4 w-4" />
                      Generate PDF
                    </button>

                    <button
                      onClick={downloadPDF}
                      disabled={loading || selectedCount === 0}
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${
                        loading || selectedCount === 0
                          ? "bg-green-400 dark:bg-green-600 cursor-not-allowed opacity-70"
                          : "bg-green-500 hover:bg-green-400 shadow-sm hover:shadow"
                      } text-white transition-all`}
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Download PDF
                    </button>
                  </div>
                </div>

                {/* Display images with drag and drop reordering */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageObjects.map((image, index) => {
                    const isSelected = selectedImages[image.fileId] !== false;
                    // Calculate the actual page number based on selected images
                    const pageNumber = imageObjects.filter(
                      (img) =>
                        selectedImages[img.fileId] !== false &&
                        imageObjects.indexOf(img) <= index
                    ).length;

                    const isDraggedOver = dragOverIndex === index;
                    const isDraggingThis = draggingIndex === index;

                    return (
                      <div
                        key={`${image.fileId}`}
                        className={`relative group rounded-lg overflow-hidden shadow-md ${
                          isDraggedOver
                            ? "border-2 border-blue-500 transform scale-105"
                            : ""
                        } ${isDraggingThis ? "opacity-50" : ""}
  ${!isSelected ? "opacity-50" : ""} 
  ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}
  transition-all duration-200`}
                        draggable={isSelected}
                        onDragStart={(e) => {
                          // Only allow drag from the container, not from the image itself
                          if (e.target.tagName === "IMG") {
                            e.preventDefault();
                            return false;
                          }
                          isSelected && handleDragStart(index);
                        }}
                        onDragOver={handleDragOver}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => {
                          e.preventDefault(); // Prevent default to avoid browser opening the file
                          handleDragEnd();
                        }}
                      >
                        {/* Reorder controls */}
                        {isSelected && imageObjects.length > 1 && (
                          <div className="absolute top-2 left-2 z-10 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => moveImageUp(index)}
                              disabled={index === 0}
                              className={`p-1 ${index === 0 ? "text-gray-400" : "text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30"} rounded-t-lg`}
                              title="Move up"
                            >
                              <ArrowUpIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => moveImageDown(index)}
                              disabled={index === imageObjects.length - 1}
                              className={`p-1 ${index === imageObjects.length - 1 ? "text-gray-400" : "text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30"} rounded-b-lg`}
                              title="Move down"
                            >
                              <ArrowDownIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        {/* Drag handle */}
                        {isSelected && (
                          <div className="absolute top-2 right-10 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1.5 mx-1 rounded-full cursor-grab active:cursor-grabbing bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-blue-500"
                              title="Drag to reorder"
                            >
                              <GripIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        {/* Selection toggle overlay */}
                        <div className="absolute top-2 right-2 z-10">
                          <button
                            onClick={() => toggleImageSelection(image.fileId)}
                            className={`p-1.5 rounded-full ${
                              isSelected
                                ? "bg-blue-500 text-white"
                                : "bg-gray-500/50 text-gray-200"
                            }`}
                            title={
                              isSelected
                                ? "Uncheck to exclude"
                                : "Check to include"
                            }
                          >
                            {isSelected ? (
                              <CheckCircleIcon className="h-5 w-5" />
                            ) : (
                              <XCircleIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center">
                          <img
                            src={image.src}
                            alt={image.fileName}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            draggable={false} // Prevent default image drag
                            onDragStart={(e) => e.preventDefault()} // Extra safety
                          />
                        </div>

                        {/* Improved overlay with file info and page number */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 p-2 ${
                            isDarkMode ? "bg-gray-900/80" : "bg-white/80"
                          } backdrop-blur-sm`}
                        >
                          <div className="flex flex-col">
                            <span
                              className="text-xs truncate max-w-full"
                              title={image.fileName}
                            >
                              {image.fileName}
                            </span>

                            {isSelected && (
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-500">
                                  {formatBytes(image.file.size)}
                                </span>
                                <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-lg font-medium">
                                  Page {pageNumber}
                                </span>
                              </div>
                            )}

                            {!isSelected && (
                              <span className="text-xs italic text-red-500 mt-1">
                                Not included
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PDF Preview (if available) */}
                {pdfPreviewUrl && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">PDF Preview:</h3>
                    <div
                      className={`border rounded-lg overflow-hidden ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
                    >
                      <iframe
                        src={pdfPreviewUrl}
                        className="w-full h-96"
                        title="PDF Preview"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Your files are processed locally in your browser. No uploads to any
        server.
      </div>

      {/* Drag and drop overlay - shows when dragging images */}
      {isDragging && (
        <div className="fixed inset-0 bg-blue-500/10 pointer-events-none z-50 flex items-center justify-center">
          <div
            className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
          >
            <p className="text-blue-500 font-medium flex items-center">
              <GripIcon className="h-5 w-5 mr-2" />
              Release to reorder image
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
