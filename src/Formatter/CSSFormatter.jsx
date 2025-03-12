import { useState, useRef, useEffect } from "react";
import { css as beautifyCSS } from "js-beautify";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../ThemeProvider";
import { detectFileType } from "../fileTypeDetector";
import { FaSun, FaMoon } from "react-icons/fa";
import { toast } from "react-toastify";

export default function CSSFormatter() {
    const { theme, toggleTheme } = useTheme();
    const [inputCSS, setInputCSS] = useState("");
    const [outputCSS, setOutputCSS] = useState("");
    const [fileName, setFileName] = useState("formatted.css");
    const [warning, setWarning] = useState({ show: false, type: "" });
    const downloadLink = useRef(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) toggleTheme(savedTheme);
    }, []);

    const handleBeautify = () => {
        try {
            setOutputCSS(
                beautifyCSS(inputCSS, { indent_size: 4, preserve_newlines: true, max_preserve_newlines: 1 }).trim()
            );
        } catch {
            toast.error("Invalid CSS code.");
        }
    };

    const handleCodeChange = (e) => {
        const newInput = e.target.value;
        const detected = detectFileType(newInput);
        setInputCSS(newInput);
        setWarning({ show: detected !== "CSS", type: detected });
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(outputCSS);
            toast.success("Copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy!");
        }
    };

    const handleDownload = () => {
        const blob = new Blob([outputCSS], { type: "text/css" });
        const url = URL.createObjectURL(blob);
        downloadLink.current.href = url;
        downloadLink.current.download = fileName.endsWith(".css") ? fileName : `${fileName}.css`;
        downloadLink.current.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`p-6 mt-20 rounded-xl ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>



            {/* File Name Input */}
            <input
                type="text"
                className={`w-full p-2 mb-2 rounded-lg border focus:ring-2 ${
                    theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"
                }`}
                placeholder="File name (e.g., formatted.css)"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
            />

            {/* Code Input */}
            <textarea
                className={`w-full p-3 rounded-lg mb-2 h-40 border focus:ring-2 ${
                    theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"
                }`}
                placeholder="Enter your CSS here..."
                value={inputCSS}
                onChange={handleCodeChange}
            />

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button className="bg-yellow-500 font-bold cursor-pointer px-4 py-2 rounded focus:ring-2" onClick={handleBeautify}>
                    Format
                </button>
                {outputCSS && (
                    <>
                        <button className="bg-blue-500 px-4 py-2 rounded text-white focus:ring-2" onClick={handleCopy}>
                            Copy
                        </button>
                        <button className="bg-green-500 px-4 py-2 rounded text-white focus:ring-2" onClick={handleDownload}>
                            Download
                        </button>
                    </>
                )}
            </div>

            {/* Download Link (Hidden) */}
            <a ref={downloadLink} style={{ display: "none" }} />

            {/* Syntax Highlighting */}
            {outputCSS && (
                <SyntaxHighlighter language="css" style={theme === "dark" ? materialOceanic : prism} className="mt-3">
                    {outputCSS}
                </SyntaxHighlighter>
            )}
        </div>
    );
}
