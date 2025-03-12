import { useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../ThemeProvider";
import { FaSun, FaMoon } from "react-icons/fa";

export default function MarkdownFormatter() {
    const { theme, toggleTheme } = useTheme();
    const [inputMarkdown, setInputMarkdown] = useState("");
    const [formattedMarkdown, setFormattedMarkdown] = useState("");
    const [fileName, setFileName] = useState("formatted.md");

    // Function to format Markdown properly
    const handleFormat = () => {
        try {
            const cleanedMarkdown = inputMarkdown
                .split("\n")
                .map(line => line.trimEnd()) // Remove trailing spaces
                .filter((line, index, arr) => !(line === "" && arr[index - 1] === "")) // Remove multiple blank lines
                .join("\n")
                .trim();

            setFormattedMarkdown(cleanedMarkdown);
        } catch {
            alert("Invalid Markdown.");
        }
    };

    // Function to copy formatted Markdown
    const handleCopy = () => {
        navigator.clipboard.writeText(formattedMarkdown);
        alert("Copied to clipboard!");
    };

    // Function to download formatted Markdown
    const handleDownload = () => {
        const blob = new Blob([formattedMarkdown], { type: "text/markdown" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName.endsWith(".md") ? fileName : `${fileName}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <button onClick={toggleTheme} className="mb-3 px-3 py-2 rounded-full bg-gray-600 text-white flex items-center gap-2">
                {theme === "dark" ? <FaSun /> : <FaMoon />} Toggle Theme
            </button>

            <input
                type="text"
                className="w-full p-2 mb-2 rounded-lg text-black"
                placeholder="File name (e.g., formatted.md)"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
            />

            <textarea
                className="w-full p-3 rounded-lg mb-2 h-40 text-black"
                placeholder="Enter your Markdown here..."
                value={inputMarkdown}
                onChange={(e) => setInputMarkdown(e.target.value)}
            />

            <button className="bg-yellow-500 px-4 py-2 rounded mr-2" onClick={handleFormat}>
                Format
            </button>

            {formattedMarkdown && (
                <>
                    <div className="flex gap-2 mt-3">
                        <button className="bg-blue-500 px-4 py-2 rounded text-white" onClick={handleCopy}>
                            Copy
                        </button>
                        <button className="bg-green-500 px-4 py-2 rounded text-white" onClick={handleDownload}>
                            Download
                        </button>
                    </div>

                    <h2 className="mt-5 text-lg font-bold">Formatted Markdown:</h2>
                    <SyntaxHighlighter language="markdown" style={theme === "dark" ? materialOceanic : prism} className="mt-3">
                        {formattedMarkdown}
                    </SyntaxHighlighter>

                    <h2 className="mt-5 text-lg font-bold">Live Preview:</h2>
                    <div
                        className="p-4 mt-3 border rounded-lg bg-gray-100 text-black"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(formattedMarkdown)) }}
                    ></div>
                </>
            )}
        </div>
    );
}
