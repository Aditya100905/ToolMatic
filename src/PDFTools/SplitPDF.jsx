import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import FileUploader from "./FileUploader";
import { XCircleIcon } from "@heroicons/react/24/solid";

export default function SplitPDF({ theme }) {
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState("");
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFilename(selectedFile.name.replace(/\.pdf$/, "-split"));
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setFilename(droppedFile.name.replace(/\.pdf$/, "-split"));
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPageRange("");
    setFilename("");
    setError("");
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

    const fileBytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(fileBytes);
    const newPdf = await PDFDocument.create();

    const pagesToExtract = new Set();
    pageRange.split(",").forEach((part) => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        if (start > end || start < 1 || end > pdf.getPageCount()) {
          setError("Invalid page range entered.");
          return;
        }
        for (let i = start; i <= end; i++) {
          pagesToExtract.add(i - 1);
        }
      } else {
        const pageNum = parseInt(part) - 1;
        if (pageNum >= 0 && pageNum < pdf.getPageCount()) {
          pagesToExtract.add(pageNum);
        } else {
          setError("Invalid page number entered.");
          return;
        }
      }
    });

    if (pagesToExtract.size === 0) {
      setError("No valid pages selected.");
      return;
    }

    for (const pageIndex of pagesToExtract) {
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
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors ${theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div
        className={`max-w-xl w-full p-6 rounded-2xl shadow-xl ${theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"}`}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Split PDF</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <FileUploader onChange={handleFileChange} hasFiles={!!file} />

        {file && (
          <div
            className={`mt-4 p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
          >
            <h3 className="text-lg font-medium mb-2">Selected PDF:</h3>
            <div
              className={`flex items-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} shadow-md rounded-lg px-4 py-2`}
            >
              <a
                href={URL.createObjectURL(file)}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-2 underline hover:text-blue-500"
                >

                {file.name}
              </a>
              <button
                onClick={clearSelection}
                className="text-red-500 hover:text-red-700"
              >
                <XCircleIcon className="cursor-pointer h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {file && (
          <div className="mt-4">
            <label className="block font-medium mb-2">
              Enter Pages (e.g., 1,3-5):
            </label>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="Enter page numbers"
              className={`w-full px-3 py-2 rounded-lg border ${theme === "dark" ? "border-gray-600 dark:bg-gray-700 text-white" : "border-gray-300 bg-white text-black"} focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
          </div>
        )}

        {file && (
          <div className="mt-4">
            <label className="block font-medium mb-2">
              Save As (Optional):
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename (or default is original name)"
              className={`w-full px-3 py-2 rounded-lg border ${theme === "dark" ? "border-gray-600 dark:bg-gray-700 text-white" : "border-gray-300 bg-white text-black"} focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
          </div>
        )}

        {file && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={splitPDF}
              className="px-6 py-3 rounded-lg font-medium bg-green-500 text-white hover:bg-green-400 transition"
            >
              Split PDF
            </button>
            <button
              onClick={clearSelection}
              className="px-6 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-400 transition"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
