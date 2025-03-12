export const detectFileType = (code) => {
    if (code.trim().startsWith("<")) return "HTML";
    if (code.includes("{") && code.includes("}"));
    if (code.includes(";") || code.includes("function")) return "JS/TS";
    if (code.includes(":") && !code.includes("function")) return "CSS";
    return "Unknown";
};
