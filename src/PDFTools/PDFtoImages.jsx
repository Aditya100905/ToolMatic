import { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import FileUploader from "./FileUploader";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../ThemeProvider";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

export default function PDFToImage() {
  const { theme } = useTheme();
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (files.length > 0) {
      convertPDFToImages();
    }
  }, [files]);

  const handleFileChange = (event) => {
    const uploadedFiles = [...event.target.files];
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImages((prevImages) =>
      prevImages.filter((img) => img.fileIndex !== index)
    );
  };

  const convertPDFToImages = async () => {
    if (files.length === 0) return;

    const newImages = [];
    for (const [fileIndex, file] of files.entries()) {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = async function () {
        const typedArray = new Uint8Array(fileReader.result);
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
            fileIndex,
          });

          setImages([...newImages]);
        }
      };
    }
  };

  return (
    <div
      className={`mt-15 min-h-screen flex items-center justify-center px-4 py-8 transition-colors ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`max-w-3xl w-full p-6 rounded-2xl shadow-xl ${
          theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Convert PDF to Images
        </h2>

        <FileUploader onChange={handleFileChange} hasFiles={files.length > 0} />

        {files.length > 0 && (
          <div
            className={`mt-10 p-3 rounded-lg ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100"}`}
          >
            <h3 className="text-lg font-medium mb-2">Selected PDFs:</h3>
            <div className="flex items-center gap-3 flex-wrap">
              {files.map((file, index) => {
                const fileURL = URL.createObjectURL(file);

                return (
                  <div
                    key={index}
                    className={`flex items-center shadow-md rounded-lg px-4 py-2 ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-black"}`}
                  >
                    <a
                      href={fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-2 underline hover:text-blue-500"
                    >
                      {file.name}
                    </a>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500"
                    >
                      <XCircleIcon className="cursor-pointer h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-medium mb-2">Converted Images:</h3>

            {files.map((file, fileIndex) => (
              <div key={fileIndex} className="mt-10 border-t pt-6">
                <h4 className="text-md font-semibold mb-3">{file.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images
                    .filter((img) => img.fileIndex === fileIndex)
                    .map((image, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden shadow-md bg-gray-200"
                      >
                        <div className="w-full min-w-[200px] aspect-[3/4]">
                          <img
                            src={image.src}
                            alt={`PDF Page ${image.page}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Page Number with Hover Effect (No Overlapping) */}
                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                          Page {image.page} / {image.totalPages}
                        </div>

                        {/* Download Button */}
                        <button
                          onClick={() =>
                            saveAs(
                              image.src,
                              `${image.fileName} pg ${image.page}.png`
                            )
                          }
                          className="absolute bottom-2 right-2 px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-400 transition"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            <div className="mt-10 flex gap-4">
              <button
                onClick={() =>
                  images.forEach((img) =>
                    saveAs(img.src, `${img.fileName} pg ${img.page}.png`)
                  )
                }
                className="px-6 py-3 rounded-lg font-medium bg-green-500 text-white hover:bg-green-400 transition"
              >
                Download All
              </button>
              <button
                onClick={async () => {
                  const zip = new JSZip();
                  const folder = zip.folder("PDF Images");
                  images.forEach((img) => {
                    folder.file(
                      `${img.fileName} pg ${img.page}.png`,
                      img.src.split(",")[1],
                      { base64: true }
                    );
                  });
                  const zipBlob = await zip.generateAsync({ type: "blob" });
                  saveAs(zipBlob, "PDF Images.zip");
                }}
                className="px-6 py-3 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-400 transition"
              >
                Download as ZIP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
