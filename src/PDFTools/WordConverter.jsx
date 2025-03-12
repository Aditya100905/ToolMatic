import { useState } from "react";
import { renderAsync } from "docx-preview";
import html2pdf from "html2pdf.js";
import { saveAs } from "file-saver";

export default function WordToPDF() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".docx")) {
      setFile(selectedFile);
      setFileName(selectedFile.name.replace(/\.docx$/, ""));
      renderDocx(selectedFile);
    } else {
      alert("Please upload a valid DOCX file.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".docx")) {
      setFile(droppedFile);
      setFileName(droppedFile.name.replace(/\.docx$/, ""));
      renderDocx(droppedFile);
    } else {
      alert("Please upload a valid DOCX file.");
    }
  };

  const renderDocx = async (docxFile) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const container = document.createElement("div");
      await renderAsync(arrayBuffer, container);
      setPreviewHtml(container.innerHTML);
    };
    reader.readAsArrayBuffer(docxFile);
  };

  const convertToPDF = () => {
    if (!file) {
      alert("Please upload a DOCX file first.");
      return;
    }
    const content = document.getElementById("docx-preview");
    html2pdf()
      .set({ filename: fileName ? `${fileName}.pdf` : "converted.pdf" })
      .from(content)
      .save();
  };

  return (
    <div
      className="max-w-2xl mx-auto mt-8 p-6 rounded-2xl shadow-xl bg-white"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Word to PDF Converter</h2>

      {/* File Upload */}
      <input type="file" accept=".docx" onChange={handleFileChange} className="mb-4" />

      {/* Drag & Drop Area */}
      <div
        className="border-dashed border-2 border-gray-400 p-6 text-center text-gray-600 rounded-lg cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        Drag and drop your DOCX file here
      </div>

      {/* Preview Section */}
      {previewHtml && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Preview:</h3>
          <div id="docx-preview" className="overflow-auto max-h-96 p-2 border rounded-lg" dangerouslySetInnerHTML={{ __html: previewHtml }}></div>
        </div>
      )}

      {/* Filename Input */}
      {file && (
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">Save As:</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {/* Convert & Clear Buttons */}
      {file && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={convertToPDF}
            className="px-6 py-3 rounded-lg font-medium bg-green-500 text-white hover:bg-green-400 transition"
          >
            Convert to PDF
          </button>
          <button
            onClick={() => {
              setFile(null);
              setPreviewHtml("");
              setFileName("");
            }}
            className="px-6 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-400 transition"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
