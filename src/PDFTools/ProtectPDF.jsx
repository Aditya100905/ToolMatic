// import { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import { saveAs } from "file-saver";
// import FileUploader from "./FileUploader";
// import { XCircleIcon } from "@heroicons/react/24/solid";
// import { useTheme } from "../ThemeProvider";

// export default function ProtectPDF() {
//   const { theme } = useTheme(); // Get theme state
//   const [file, setFile] = useState(null);
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   const clearFile = () => {
//     setFile(null);
//     setPassword("");
//     setError("");
//   };

//   const protectPDF = async () => {
//     if (!file || !password) {
//       setError("Please select a PDF and enter a password.");
//       return;
//     }

//     try {
//       const fileBytes = await file.arrayBuffer();
//       const pdfDoc = await PDFDocument.load(fileBytes);

//       // Encrypt PDF with user-provided password
//       pdfDoc.encrypt({
//         ownerPassword: password,
//         userPassword: password,
//         permissions: { printing: "none", copying: false, modifying: false },
//       });

//       const encryptedPdfBytes = await pdfDoc.save();
//       const blob = new Blob([encryptedPdfBytes], { type: "application/pdf" });

//       const filename = file.name.replace(/\.pdf$/, "") + "-protected.pdf";
//       saveAs(blob, filename);
//     } catch (error) {
//       setError("Failed to protect PDF. Please try again.");
//     }
//   };

//   return (
//     <div
//       className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors ${
//         theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
//       }`}
//     >
//       <div
//         className={`max-w-xl w-full p-6 rounded-2xl shadow-xl ${
//           theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"
//         }`}
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-center">
//           Password Protect PDF
//         </h2>

//         {error && <div className="text-red-500 text-center mb-4">{error}</div>}

//         {/* File Upload Button */}
//         <FileUploader onChange={handleFileChange} hasFiles={!!file} />

//         {/* Selected PDF Display */}
//         {file && (
//           <div
//             className={`mt-6 p-3 rounded-lg ${
//               theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100"
//             }`}
//           >
//             <h3 className="text-lg font-medium mb-2">Selected PDF:</h3>
//             <div
//               className={`flex items-center shadow-md rounded-lg px-4 py-2 ${
//                 theme === "dark"
//                   ? "bg-gray-800 text-gray-300"
//                   : "bg-white text-black"
//               }`}
//             >
//               <span className="mr-2">{file.name}</span>
//               <button onClick={clearFile} className="text-red-500">
//                 <XCircleIcon className="cursor-pointer h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Password Input */}
//         {file && (
//           <div className="mt-4">
//             <label className="block font-medium mb-2">Set Password:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter a strong password"
//               className={`w-full px-3 py-2 rounded-lg border ${
//                 theme === "dark"
//                   ? "border-gray-600 dark:bg-gray-700 text-white"
//                   : "border-gray-300 bg-white text-black"
//               } focus:outline-none focus:ring-2 focus:ring-blue-400`}
//             />
//           </div>
//         )}

//         {/* Protect & Clear Buttons */}
//         {file && (
//           <div className="mt-6 flex gap-4">
//             <button
//               onClick={protectPDF}
//               className="px-6 py-3 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-400 transition"
//             >
//               Protect PDF
//             </button>
//             <button
//               onClick={clearFile}
//               className="px-6 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-400 transition"
//             >
//               Clear
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { saveAs } from "file-saver";
import FileUploader from "./FileUploader";
import { XCircleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useTheme } from "../ThemeProvider";

export default function ProtectPDF() {
  const { theme } = useTheme(); // Get theme state
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [filename, setFilename] = useState("");
  const [error, setError] = useState("");
  const API_KEY = import.meta.env.VITE_PROTECT_API;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFilename(selectedFile.name.replace(/\.pdf$/, "-protected"));
      setError("");
    } else {
      setError("Invalid file type! Please select a PDF.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setFilename(droppedFile.name.replace(/\.pdf$/, "-protected"));
      setError("");
    } else {
      setError("Invalid file type! Please select a PDF.");
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilename("");
    setPassword("");
    setError("");
  };

  const protectPDF = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    if (!password) {
      setError("Enter a password to protect the PDF.");
      return;
    }
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      const response = await fetch("https://api.ilovepdf.com/v1/pdf/protect", {
        method: "POST",
        headers: { "Authorization": `Bearer ${API_KEY}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to protect the PDF.");
      }

      const blob = await response.blob();
      saveAs(blob, `${filename}.pdf`);
    } catch (error) {
      setError("Error protecting PDF. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className={`max-w-xl w-full p-6 rounded-2xl shadow-xl ${theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"}`}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Protect PDF</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* File Upload Button */}
        <FileUploader onChange={handleFileChange} hasFiles={!!file} />

        {/* Uploaded PDF Display */}
        {file && (
          <div className={`mt-6 p-3 rounded-lg ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100"}`}>
            <h3 className="text-lg font-medium mb-2">Selected PDF:</h3>
            <div className="flex items-center shadow-md rounded-lg px-4 py-2 bg-gray-800 text-gray-300">
              <span className="mr-2">{file.name}</span>
              <button onClick={clearFile} className="text-red-500">
                <XCircleIcon className="cursor-pointer h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Password Input */}
        {file && (
          <div className="mt-4 relative">
            <label className="block font-medium mb-2">Set Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === "dark" ? "border-gray-600 dark:bg-gray-700 text-white" : "border-gray-300 bg-white text-black"
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}

        {/* Optional Filename Input */}
        {file && (
          <div className="mt-4">
            <label className="block font-medium mb-2">Save As (Optional):</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === "dark" ? "border-gray-600 dark:bg-gray-700 text-white" : "border-gray-300 bg-white text-black"
              } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
          </div>
        )}

        {/* Protect & Clear Buttons */}
        {file && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={protectPDF}
              className="px-6 py-3 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-400 transition"
            >
              Protect PDF
            </button>
            <button
              onClick={clearFile}
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
