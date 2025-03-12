import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import FileUploader from "./FileUploader";
import { XCircleIcon } from "@heroicons/react/24/solid";

export default function CompressPDF() {
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");
  const [compressionLevel, setCompressionLevel] = useState(50);

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
      setFilename(droppedFiles[0].name.replace(/\.pdf$/, ""));
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
  };

  const compressPDFs = async () => {
    if (files.length === 0) {
      alert("Select at least one PDF to compress!");
      return;
    }

    const compressedPdf = await PDFDocument.create();
    for (const file of files) {
      const fileBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBytes);
      pdf.setCreator("Compressed by CompressPDF");
      
      for (const pageIndex of pdf.getPageIndices()) {
        const [copiedPage] = await compressedPdf.copyPages(pdf, [pageIndex]);
        const { width, height } = copiedPage.getSize();
        copiedPage.scale(compressionLevel / 100);
        copiedPage.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
        compressedPdf.addPage(copiedPage);
      }
    }

    const compressedPdfBytes = await compressedPdf.save();
    const blob = new Blob([compressedPdfBytes], { type: "application/pdf" });
    const finalFilename = filename.trim()
      ? filename.endsWith(".pdf")
        ? filename
        : `${filename}.pdf`
      : `${files[0].name.replace(/\.pdf$/, "")}_compressed.pdf`;
    saveAs(blob, finalFilename);
  };

  return (
    <div 
      className="max-w-xl mx-auto mt-8 p-6 rounded-2xl shadow-xl bg-white"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Compress PDFs</h2>
      <FileUploader onChange={handleFileChange} hasFiles={files.length > 0} />

      {files.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-gray-100">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Selected PDFs:</h3>
          <div className="flex flex-wrap gap-3">
            {files.map((file, index) => {
              const fileURL = URL.createObjectURL(file);
              return (
                <div key={index} className="relative flex items-center bg-white shadow-md rounded-lg px-4 py-2 text-gray-800 text-sm font-medium">
                  <a href={fileURL} target="_blank" rel="noopener noreferrer" className="mr-2 hover:underline">
                    {file.name}
                  </a>
                  <button onClick={() => removeFile(index)} className="cursor-pointer text-red-500 hover:text-red-700">
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">Save As (Optional):</label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename (or default is first file name)"
            className="w-full text-black px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">Compression Level:</label>
          <select
            value={compressionLevel}
            onChange={(e) => setCompressionLevel(Number(e.target.value))}
            className="w-full text-black px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={100}>100% (No Compression)</option>
            <option value={75}>75% Compression</option>
            <option value={50}>50% Compression</option>
            <option value={25}>25% Compression</option>
          </select>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={compressPDFs}
            className="px-6 py-3 rounded-lg font-medium cursor-pointer bg-blue-500 text-white hover:bg-blue-400 transition"
          >
            Compress PDFs
          </button>
          <button
            onClick={clearAllFiles}
            className="px-6 py-3 rounded-lg font-medium cursor-pointer bg-red-500 text-white hover:bg-red-400 transition"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}