import React, { useState, useEffect, useRef } from "react";
import {
  Clipboard,
  ArrowDownUp,
  Code,
  FileText,
  Eye,
  EyeOff,
  X,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import * as marked from "marked";
import TurndownService from "turndown";

export default function MarkdownHtmlConverter({ theme = "dark" }) {
  // Core states
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState("markdown-to-html");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [screenSize, setScreenSize] = useState("large");
  const [conversionStatus, setConversionStatus] = useState({
    success: true,
    message: "",
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // References
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  // Theme colors
  const getColors = () => ({
    dark: {
      background: "#121212",
      surface: "#1A1A1A",
      surface2: "#242424",
      border: "#333333",
      text: "#E0E0E0",
      textSecondary: "#A0A0A0",
      primary: "#6366F1",
      secondary: "#8B5CF6",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    light: {
      background: "#F5F7FA",
      surface: "#FFFFFF",
      surface2: "#F9FAFB",
      border: "#E5E7EB",
      text: "#111827",
      textSecondary: "#6B7280",
      primary: "#4F46E5",
      secondary: "#7C3AED",
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626",
      info: "#2563EB",
    },
  });

  // Apply theme to body
  useEffect(() => {
    document.body.style.backgroundColor = getColors()[theme].background;
    document.body.style.color = getColors()[theme].text;
  }, [theme]);

  // Screen size detection with more breakpoints for better responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setScreenSize("xs");
      } else if (window.innerWidth < 640) {
        setScreenSize("small");
      } else if (window.innerWidth < 768) {
        setScreenSize("medium");
      } else if (window.innerWidth < 1024) {
        setScreenSize("large");
      } else {
        setScreenSize("xl");
      }
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Improved notification system
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Turndown service setup
  const getTurndownService = () => {
    const tds = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      emDelimiter: "*",
      strongDelimiter: "**",
      bulletListMarker: "-",
    });

    // Add custom rules
    tds.addRule("strikethrough", {
      filter: ["del", "s", "strike"],
      replacement: (content) => `~~${content}~~`,
    });

    tds.addRule("taskListItems", {
      filter: function (node) {
        return (
          node.nodeName === "INPUT" &&
          node.type === "checkbox" &&
          node.parentNode.nodeName === "LI"
        );
      },
      replacement: function (content, node) {
        return node.checked ? "[x] " : "[ ] ";
      },
    });

    tds.addRule("tables", {
      filter: ["table"],
      replacement: function (content, node) {
        const rows = Array.from(node.rows);
        let markdownTable = "";

        if (rows.length > 0) {
          markdownTable +=
            "| " +
            Array.from(rows[0].cells)
              .map((cell) => cell.textContent.trim())
              .join(" | ") +
            " |\n";

          markdownTable +=
            "| " +
            Array.from(rows[0].cells)
              .map(() => "---")
              .join(" | ") +
            " |\n";

          for (let i = 1; i < rows.length; i++) {
            markdownTable +=
              "| " +
              Array.from(rows[i].cells)
                .map((cell) => cell.textContent.trim())
                .join(" | ") +
              " |\n";
          }
        }

        return markdownTable;
      },
    });

    return tds;
  };

  // Marked options setup
  const getMarkedOptions = () => {
    return {
      gfm: true,
      breaks: true,
      smartLists: true,
      smartypants: true,
      xhtml: true,
      sanitize: false,
    };
  };

  // Text conversion with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      convertText();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputText, mode]);

  // Conversion logic
  const convertText = () => {
    if (inputText.trim() === "") {
      setOutputText("");
      setConversionStatus({ success: true, message: "" });
      return;
    }

    try {
      if (mode === "markdown-to-html") {
        marked.setOptions(getMarkedOptions());
        setOutputText(marked.parse(inputText));
        setConversionStatus({ success: true, message: "" });
      } else {
        const turndownService = getTurndownService();
        setOutputText(turndownService.turndown(inputText));
        setConversionStatus({ success: true, message: "" });
      }
    } catch (error) {
      setOutputText("");
      setConversionStatus({
        success: false,
        message: `Error during conversion: ${error.message}`,
      });
      showNotification(`Error: ${error.message}`, "error");
    }
  };

  // Mode toggling
  const handleModeToggle = () => {
    setMode(
      mode === "markdown-to-html" ? "html-to-markdown" : "markdown-to-html"
    );
    setInputText(outputText);
    setOutputText(inputText);
    showNotification(
      `Switched to ${mode === "markdown-to-html" ? "HTML to Markdown" : "Markdown to HTML"} mode`
    );
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showNotification("Copied to clipboard!");
  };

  // Swap input and output
  const swapTexts = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    showNotification("Input and output swapped");
  };

  // Clear all text
  const clearText = () => {
    setInputText("");
    setOutputText("");
    showNotification("All text cleared", "info");
  };

  // Manual conversion button handler
  const handleManualConvert = () => {
    convertText();
    showNotification("Conversion completed");
  };

  // Download output as file
  const downloadOutput = () => {
    const extension = mode === "markdown-to-html" ? "html" : "md";
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("File downloaded");
  };

  // Upload file handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setInputText(event.target.result);
      showNotification(`File "${file.name}" loaded`, "success");
    };
    reader.readAsText(file);
  };


  // Get theme colors
  const c = getColors()[theme];

  // Determine if we should use single column layout
  const useSingleColumn = ["xs", "small", "medium"].includes(screenSize);

  // Dynamic text area height based on screen size
  const getTextAreaHeight = () => {
    if (screenSize === "xs") return "250px";
    if (screenSize === "small") return "280px";
    if (screenSize === "medium") return "320px";
    if (screenSize === "large") return "380px";
    return "400px";
  };

  // Dynamic font size based on screen size
  const getFontSize = () => {
    if (screenSize === "xs") return "0.8rem";
    if (screenSize === "small") return "0.85rem";
    return "0.875rem";
  };

  // Button size and padding based on screen size
  const getButtonPadding = () => {
    if (screenSize === "xs") return "0.3rem 0.6rem";
    if (screenSize === "small") return "0.375rem 0.75rem";
    return "0.5rem 1rem";
  };

  // Improved styles with better mobile spacing and button colors
  const styles = {
    container: {
      backgroundColor: c.background,
      color: c.text,
      minHeight: "100vh",
      padding: ["xs", "small"].includes(screenSize) ? "0.75rem" : "1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      transition: "background-color 0.3s, color 0.3s",
    },
    header: {
      textAlign: "center",
      marginBottom: ["xs", "small"].includes(screenSize) ? "1rem" : "2rem",
      width: "100%",
      maxWidth: "1200px",
    },
    title: {
      fontSize: ["xs"].includes(screenSize)
        ? "1.25rem"
        : ["small"].includes(screenSize)
          ? "1.5rem"
          : "2rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: c.text,
    },
    subtitle: {
      fontSize: ["xs", "small"].includes(screenSize) ? "0.875rem" : "1rem",
      color: c.textSecondary,
      marginBottom: ["xs", "small"].includes(screenSize) ? "1rem" : "1.5rem",
      padding: ["xs", "small", "medium"].includes(screenSize) ? "0 0.5rem" : 0,
    },
    mainContent: {
      width: "100%",
      maxWidth: "1200px",
      marginBottom: "2rem",
    },
    buttonBar: {
      display: "flex",
      flexWrap: "wrap",
      gap: ["xs", "small"].includes(screenSize) ? "0.75rem" : "1rem",
      marginBottom: "1.5rem",
      justifyContent: "space-between",
      flexDirection: ["xs", "small", "medium"].includes(screenSize)
        ? "column"
        : "row",
    },
    buttonGroup: {
      display: "flex",
      gap: screenSize === "xs" ? "0.375rem" : "0.5rem",
      flexWrap: "wrap",
      justifyContent: ["xs", "small", "medium"].includes(screenSize)
        ? "space-between"
        : "flex-start",
    },
    button: {
      display: "flex",
      alignItems: "center",
      gap: screenSize === "xs" ? "0.3rem" : "0.5rem",
      padding: getButtonPadding(),
      borderRadius: "0.375rem",
      fontWeight: "500",
      transition: "all 0.2s ease-in-out",
      border: "none",
      cursor: "pointer",
      fontSize: ["xs", "small"].includes(screenSize) ? "0.75rem" : "0.875rem",
      boxShadow:
        theme === "dark"
          ? "0 1px 3px rgba(0,0,0,0.3)"
          : "0 1px 3px rgba(0,0,0,0.1)",
    },
    primaryButton: {
      backgroundColor: c.primary,
      color: "white",
      "&:hover": {
        backgroundColor: theme === "dark" ? "#5253c2" : "#4338ca",
      },
    },
    secondaryButton: {
      backgroundColor:
        theme === "dark"
          ? "rgba(139, 92, 246, 0.15)"
          : "rgba(139, 92, 246, 0.1)",
      color: c.secondary,
      border: `1px solid ${theme === "dark" ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.2)"}`,
    },
    dangerButton: {
      backgroundColor:
        theme === "dark" ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
      color: c.error,
      border: `1px solid ${theme === "dark" ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)"}`,
    },
    infoButton: {
      backgroundColor:
        theme === "dark"
          ? "rgba(59, 130, 246, 0.15)"
          : "rgba(59, 130, 246, 0.1)",
      color: c.info,
      border: `1px solid ${theme === "dark" ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"}`,
    },
    successButton: {
      backgroundColor:
        theme === "dark"
          ? "rgba(16, 185, 129, 0.15)"
          : "rgba(16, 185, 129, 0.1)",
      color: c.success,
      border: `1px solid ${theme === "dark" ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.2)"}`,
    },
    panels: {
      display: "grid",
      gridTemplateColumns: useSingleColumn ? "1fr" : "1fr 1fr",
      gap: ["xs", "small"].includes(screenSize) ? "1rem" : "1.5rem",
      marginBottom: "1.5rem",
    },
    panel: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    panelHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: ["xs", "small", "medium"].includes(screenSize)
        ? "wrap"
        : "nowrap",
      gap: "0.75rem",
      marginBottom: "0.5rem", // Added explicit margin bottom
    },
    panelTitle: {
      fontSize: ["xs", "small"].includes(screenSize) ? "1rem" : "1.25rem",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    textarea: {
      width: "100%",
      height: getTextAreaHeight(),
      padding: ["xs", "small"].includes(screenSize) ? "0.75rem" : "1rem",
      borderRadius: "0.5rem",
      border: `1px solid ${c.border}`,
      backgroundColor: c.surface,
      color: c.text,
      fontSize: getFontSize(),
      fontFamily: "monospace",
      resize: "vertical",
      overflow: "auto",
      transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
    },
    outputDisplay: {
      width: "100%",
      height: getTextAreaHeight(),
      padding: ["xs", "small"].includes(screenSize) ? "0.75rem" : "1rem",
      borderRadius: "0.5rem",
      border: `1px solid ${c.border}`,
      backgroundColor: c.surface,
      color: c.text,
      fontSize: getFontSize(),
      fontFamily: "monospace",
      overflowY: "auto",
      whiteSpace: "pre-wrap",
      transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
    },
    previewPanel: {
      marginTop: "1.5rem",
      width: "100%",
    },
    previewContent: {
      padding: ["xs", "small"].includes(screenSize) ? "1rem" : "1.5rem",
      borderRadius: "0.5rem",
      border: `1px solid ${c.border}`,
      backgroundColor: c.surface,
      overflow: "auto",
      color: c.text,
      maxHeight: ["xs", "small"].includes(screenSize) ? "350px" : "500px",
      transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
      fontSize: screenSize === "xs" ? "0.875rem" : "1rem",
    },
    footer: {
      marginTop: "2rem",
      textAlign: "center",
      fontSize: "0.875rem",
      color: c.textSecondary,
      padding: "0 1rem",
    },
    errorMessage: {
      backgroundColor:
        theme === "dark" ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
      color: c.error,
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      border: `1px solid ${theme === "dark" ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)"}`,
    },
    statusIndicator: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.875rem",
      padding: "0.375rem 0.75rem",
      borderRadius: "1rem",
      backgroundColor: conversionStatus.success
        ? theme === "dark"
          ? "rgba(16, 185, 129, 0.15)"
          : "rgba(16, 185, 129, 0.1)"
        : theme === "dark"
          ? "rgba(239, 68, 68, 0.15)"
          : "rgba(239, 68, 68, 0.1)",
      color: conversionStatus.success ? c.success : c.error,
      transition: "background-color 0.3s, color 0.3s",
      border: `1px solid ${
        conversionStatus.success
          ? theme === "dark"
            ? "rgba(16, 185, 129, 0.3)"
            : "rgba(16, 185, 129, 0.2)"
          : theme === "dark"
            ? "rgba(239, 68, 68, 0.3)"
            : "rgba(239, 68, 68, 0.2)"
      }`,
      marginTop: "0.5rem", // Added margin for spacing
    },
    fileInput: {
      display: "none",
    },
    // Improved notification with better positioning and appearance
    notification: {
      position: "fixed",
      bottom: ["xs", "small"].includes(screenSize) ? "16px" : "24px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: ["xs"].includes(screenSize) ? "0.75rem 1rem" : "0.75rem 1.25rem",
      borderRadius: "0.75rem",
      backgroundColor:
        notification.type === "success"
          ? theme === "dark"
            ? "rgba(16, 185, 129, 0.95)"
            : "rgba(16, 185, 129, 0.95)"
          : notification.type === "error"
            ? theme === "dark"
              ? "rgba(239, 68, 68, 0.95)"
              : "rgba(239, 68, 68, 0.95)"
            : theme === "dark"
              ? "rgba(59, 130, 246, 0.95)"
              : "rgba(59, 130, 246, 0.95)",
      color: "white",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      zIndex: 1000,
      display: notification.show ? "flex" : "none",
      alignItems: "center",
      gap: "0.75rem",
      maxWidth: ["xs", "small"].includes(screenSize) ? "90%" : "400px",
      animation: "fadeInUp 0.3s ease-out forwards",
      opacity: 0,
      fontWeight: "500",
      fontSize: ["xs"].includes(screenSize) ? "0.875rem" : "0.95rem",
      backdropFilter: "blur(5px)",
    },
    "@keyframes fadeInUp": {
      "0%": {
        opacity: 0,
        transform: "translate(-50%, 20px)",
      },
      "100%": {
        opacity: 1,
        transform: "translate(-50%, 0)",
      },
    },
  };

  // Calculate icon sizes based on screen size
  const iconSize = ["xs", "small"].includes(screenSize) ? 16 : 18;

  // Function to get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={iconSize} />;
      case "error":
        return <AlertCircle size={iconSize} />;
      case "info":
        return <Info size={iconSize} />;
      default:
        return <Info size={iconSize} />;
    }
  };

  return (
    <div style={styles.container} className="mt-16">
      {notification.show && (
        <div
          style={{
            ...styles.notification,
            animation: notification.show
              ? "fadeInUp 0.3s ease-out forwards"
              : "none",
          }}
        >
          {getNotificationIcon(notification.type)}
          {notification.message}
        </div>
      )}

      <div style={styles.header}>
        <h1 style={styles.title}>
          {mode === "markdown-to-html"
            ? "Markdown to HTML Converter"
            : "HTML to Markdown Converter"}
        </h1>
      </div>

      <main style={styles.mainContent}>
        <div style={styles.buttonBar}>
          <div style={styles.buttonGroup}>
            <button
              onClick={handleModeToggle}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              <ArrowDownUp size={iconSize} />
              {screenSize === "xs"
                ? mode === "markdown-to-html"
                  ? "HTML→MD"
                  : "MD→HTML"
                : `Switch to ${mode === "markdown-to-html" ? "HTML → MD" : "MD → HTML"}`}
            </button>
            <button
              onClick={swapTexts}
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              <ArrowDownUp size={iconSize} />
              {screenSize === "xs" ? "Swap" : "Swap Input/Output"}
            </button>
            <button
              onClick={handleManualConvert}
              style={{ ...styles.button, ...styles.successButton }}
            >
              <RefreshCw size={iconSize} />
              Convert
            </button>
          </div>

          <div style={styles.buttonGroup}>
            <button
              onClick={clearText}
              style={{ ...styles.button, ...styles.dangerButton }}
            >
              <X size={iconSize} />
              {screenSize === "xs" ? "Clear" : "Clear All"}
            </button>
          </div>
        </div>

        {!conversionStatus.success && (
          <div style={styles.errorMessage}>
            <AlertCircle size={iconSize} />
            {conversionStatus.message}
          </div>
        )}

        {inputText && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={styles.statusIndicator}>
              {conversionStatus.success ? (
                <CheckCircle size={iconSize - 2} />
              ) : (
                <X size={iconSize - 2} />
              )}
              {conversionStatus.success
                ? "Conversion successful"
                : "Conversion failed"}
            </div>
          </div>
        )}

        <div style={styles.panels}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>
                {mode === "markdown-to-html" ? (
                  <>
                    <FileText size={iconSize} />
                    Markdown
                  </>
                ) : (
                  <>
                    <Code size={iconSize} />
                    HTML
                  </>
                )}
              </h2>
              <input
                type="file"
                id="fileInput"
                onChange={handleFileUpload}
                style={styles.fileInput}
                accept={mode === "markdown-to-html" ? ".md,.txt" : ".html,.txt"}
              />
              <label
                htmlFor="fileInput"
                style={{ ...styles.button, ...styles.infoButton }}
              >
                <Upload size={iconSize} />
                {screenSize === "xs" ? "Load" : "Upload"}
              </label>
            </div>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter ${mode === "html-to-markdown" ? "HTML" : "Markdown"} text`}
              style={styles.textarea}
              spellCheck="false"
            />
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>
                {mode === "markdown-to-html" ? (
                  <>
                    <Code size={iconSize} />
                    HTML
                  </>
                ) : (
                  <>
                    <FileText size={iconSize} />
                    Markdown
                  </>
                )}
              </h2>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={copyToClipboard}
                  style={{ ...styles.button, ...styles.successButton }}
                  disabled={!outputText}
                >
                  <Clipboard size={iconSize} />
                  {copied ? "Copied!" : screenSize === "xs" ? "Copy" : "Copy"}
                </button>
                <button
                  onClick={downloadOutput}
                  style={{ ...styles.button, ...styles.infoButton }}
                  disabled={!outputText}
                >
                  <Download size={iconSize} />
                  {screenSize === "xs" ? "Save" : "Download"}
                </button>
              </div>
            </div>
            <pre ref={outputRef} style={styles.outputDisplay}>
              {outputText}
            </pre>
          </div>
        </div>

        {mode === "markdown-to-html" && outputText && (
          <div style={styles.previewPanel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>
                <Eye size={iconSize} />
                HTML Preview
              </h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                {showPreview ? (
                  /* Continuing from where the document cut off... */
                  <>
                    <EyeOff size={iconSize} /> Hide Preview
                  </>
                ) : (
                  <>
                    <Eye size={iconSize} /> Show Preview
                  </>
                )}
              </button>
            </div>
            {showPreview && (
              <div
                style={styles.previewContent}
                dangerouslySetInnerHTML={{ __html: outputText }}
              />
            )}
          </div>
        )}
      </main>

    </div>
  );
}
