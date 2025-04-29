import React, { useState, useEffect, useRef } from "react";
import {
  Clipboard,
  ArrowDownUp,
  Code,
  FileText,
  FileJson,
  X,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Table,
  FileCode,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import * as YAML from 'yaml';
import _ from 'lodash';

export default function DataFormatConverter({ theme = "dark" }) {
  // State management
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceFormat, setSourceFormat] = useState("json");
  const [targetFormat, setTargetFormat] = useState("csv");
  const [copied, setCopied] = useState(false);
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
  const [advancedOptions, setAdvancedOptions] = useState({
    showPanel: false,
    csvDelimiter: ",",
    csvQuoteStrings: true,
    csvIncludeHeaders: true,
    jsonIndent: 2,
    yamlIndent: 2,
    xmlIndent: 2,
    prettyPrint: true,
  });

  // Available formats configuration
  const formats = [
    { id: "json", name: "JSON", icon: <FileJson size={16} /> },
    { id: "csv", name: "CSV", icon: <Table size={16} /> },
    { id: "yaml", name: "YAML", icon: <FileCode size={16} /> },
    { id: "xml", name: "XML", icon: <Code size={16} /> },
    { id: "toml", name: "TOML", icon: <FileText size={16} /> },
  ];

  // References
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  // Theme color configuration
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

  // Apply theme colors to document
  useEffect(() => {
    document.body.style.backgroundColor = getColors()[theme].background;
    document.body.style.color = getColors()[theme].text;
  }, [theme]);

  // Screen size detection
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
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Notification handler
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Auto-convert after user input stops
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputText.trim()) {
        convertData();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [inputText, sourceFormat, targetFormat, advancedOptions]);

  // IMPROVED PARSING FUNCTIONS

  // Data parsing functions
  const parseInput = (input, format) => {
    try {
      switch (format) {
        case "json":
          return parseJSON(input);
        case "yaml":
          return parseYAML(input);
        case "csv":
          return parseCSV(input);
        case "xml":
          return parseXML(input);
        case "toml":
          return parseTOML(input);
        default:
          throw new Error(`Unsupported input format: ${format}`);
      }
    } catch (error) {
      throw new Error(`Error parsing ${format.toUpperCase()}: ${error.message}`);
    }
  };

  // JSON parsing with better error handling
  const parseJSON = (input) => {
    try {
      return JSON.parse(input);
    } catch (error) {
      // Provide more helpful error messages
      const match = error.message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        const context = getErrorContext(input, position);
        throw new Error(`JSON syntax error near: ${context}`);
      }
      throw error;
    }
  };

  // YAML parsing with better error handling
  const parseYAML = (input) => {
    try {
      return YAML.parse(input);
    } catch (error) {
      throw new Error(`YAML syntax error: ${error.message}`);
    }
  };

  // Enhanced CSV parser with support for quoted fields
  const parseCSV = (input) => {
    const delimiter = advancedOptions.csvDelimiter;
    const lines = input.trim().split("\n");
    const result = [];
    
    if (lines.length === 0) return result;
    
    // Parse headers from first line
    const headers = parseCSVLine(lines[0], delimiter);
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCSVLine(line, delimiter);
      const obj = {};
      
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        // Try to convert to appropriate types
        if (value.toLowerCase() === 'true') {
          value = true;
        } else if (value.toLowerCase() === 'false') {
          value = false;
        } else if (!isNaN(value) && value.trim() !== '') {
          // Only convert to number if it's a pure number
          const num = Number(value);
          if (String(num) === value.trim()) {
            value = num;
          }
        }
        
        obj[header] = value;
      });
      
      result.push(obj);
    }
    
    return result;
  };

  // Helper function to parse a CSV line with proper handling of quotes
  const parseCSVLine = (line, delimiter) => {
    const results = [];
    let field = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"' && !inQuotes) {
        // Start of quoted field
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        // Check for escaped quotes
        if (nextChar === '"') {
          field += '"';
          i++; // Skip the next quote
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else if (char === delimiter && !inQuotes) {
        // Field delimiter - save field and reset
        results.push(field);
        field = "";
      } else {
        field += char;
      }
    }
    
    // Add the last field
    results.push(field);
    
    return results;
  };

  // Improved XML parser
  const parseXML = (input) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(input, "text/xml");
    const parserError = xmlDoc.querySelector('parsererror');
    
    if (parserError) {
      throw new Error("Invalid XML: " + parserError.textContent);
    }
    
    function xmlToObj(node) {
      // Handle text node
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue.trim();
        return text || undefined;
      }
      
      // Handle element node
      if (node.nodeType === Node.ELEMENT_NODE) {
        const obj = {};
        
        // Process attributes
        if (node.attributes.length > 0) {
          obj["@attributes"] = {};
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            obj["@attributes"][attr.nodeName] = attr.nodeValue;
          }
        }
        
        // Process child nodes
        const childNodes = Array.from(node.childNodes).filter(n => 
          n.nodeType === Node.ELEMENT_NODE || 
          (n.nodeType === Node.TEXT_NODE && n.nodeValue.trim())
        );
        
        // Check if we only have text content
        if (childNodes.length === 1 && childNodes[0].nodeType === Node.TEXT_NODE) {
          const textValue = childNodes[0].nodeValue.trim();
          
          // Try to convert text to appropriate types
          if (textValue === "true") {
            return Object.keys(obj).length > 0 ? { ...obj, "#text": true } : true;
          } else if (textValue === "false") {
            return Object.keys(obj).length > 0 ? { ...obj, "#text": false } : false;
          } else if (!isNaN(textValue) && textValue !== "") {
            const num = Number(textValue);
            return Object.keys(obj).length > 0 ? { ...obj, "#text": num } : num;
          } else {
            return Object.keys(obj).length > 0 ? { ...obj, "#text": textValue } : textValue;
          }
        }
        
        // Process child elements
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          
          if (child.nodeType === Node.ELEMENT_NODE) {
            const childName = child.nodeName;
            const childData = xmlToObj(child);
            
            if (obj[childName]) {
              if (!Array.isArray(obj[childName])) {
                obj[childName] = [obj[childName]];
              }
              obj[childName].push(childData);
            } else {
              obj[childName] = childData;
            }
          } else if (child.nodeType === Node.TEXT_NODE) {
            const text = child.nodeValue.trim();
            if (text && Object.keys(obj).length === 0) {
              return text;
            } else if (text) {
              obj["#text"] = text;
            }
          }
        }
        
        return obj;
      }
      
      return null;
    }
    
    const rootElement = xmlDoc.documentElement;
    const result = {};
    result[rootElement.nodeName] = xmlToObj(rootElement);
    return result;
  };

  // Comprehensive TOML parser with better type support
  const parseTOML = (input) => {
    const lines = input.split('\n');
    const result = {};
    let currentSection = result;
    let currentSectionPath = [];
    
    const parseValue = (valueStr) => {
      valueStr = valueStr.trim();
      
      // Handle arrays
      if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
        try {
          // Replace single quotes with double quotes for JSON compatibility
          const jsonArrayStr = valueStr.replace(/'/g, '"');
          return JSON.parse(jsonArrayStr);
        } catch (e) {
          // Handle multi-line arrays manually
          if (valueStr.includes('\n')) {
            const items = [];
            const arrayContent = valueStr.slice(1, -1).trim();
            let item = '';
            let inString = false;
            let stringDelimiter = '';
            
            for (let i = 0; i < arrayContent.length; i++) {
              const char = arrayContent[i];
              
              if ((char === '"' || char === "'") && (i === 0 || arrayContent[i-1] !== '\\')) {
                if (!inString) {
                  inString = true;
                  stringDelimiter = char;
                } else if (stringDelimiter === char) {
                  inString = false;
                }
              } else if (char === ',' && !inString) {
                items.push(parseValue(item));
                item = '';
              } else {
                item += char;
              }
            }
            
            if (item.trim()) {
              items.push(parseValue(item));
            }
            
            return items;
          }
          return valueStr; // Return as string if parsing fails
        }
      }
      
      // Handle strings
      if ((valueStr.startsWith('"') && valueStr.endsWith('"')) || 
          (valueStr.startsWith("'") && valueStr.endsWith("'"))) {
        return valueStr.slice(1, -1);
      }
      
      // Handle booleans
      if (valueStr === 'true') return true;
      if (valueStr === 'false') return false;
      
      // Handle dates
      if (/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}:\d{2})?/.test(valueStr)) {
        return new Date(valueStr);
      }
      
      // Handle numbers
      if (!isNaN(valueStr) && valueStr.trim() !== '') {
        if (valueStr.includes('.')) {
          return parseFloat(valueStr);
        }
        return parseInt(valueStr, 10);
      }
      
      // Return as string for anything else
      return valueStr;
    };
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Skip empty lines and comments
      if (!line || line.startsWith('#')) continue;
      
      // Handle multiline strings
      if ((line.includes('"""') || line.includes("'''")) && 
          !line.endsWith('"""') && !line.endsWith("'''")) {
        const delimiter = line.includes('"""') ? '"""' : "'''";
        let valueStart = line.indexOf(delimiter) + delimiter.length;
        let value = line.substring(valueStart);
        let j = i + 1;
        
        while (j < lines.length && !lines[j].includes(delimiter)) {
          value += '\n' + lines[j];
          j++;
        }
        
        if (j < lines.length) {
          value += '\n' + lines[j].substring(0, lines[j].indexOf(delimiter));
          line = line.substring(0, line.indexOf(delimiter) + delimiter.length) + 
                value + delimiter;
          i = j;
        }
      }
      
      // Handle section headers
      if (line.startsWith('[') && line.endsWith(']')) {
        const sectionName = line.slice(1, -1).trim();
        currentSectionPath = sectionName.split('.');
        
        let tmpObj = result;
        for (let i = 0; i < currentSectionPath.length; i++) {
          const pathPart = currentSectionPath[i];
          if (!tmpObj[pathPart]) tmpObj[pathPart] = {};
          tmpObj = tmpObj[pathPart];
        }
        
        currentSection = tmpObj;
        continue;
      }
      
      // Handle key-value pairs
      const equalPos = line.indexOf('=');
      if (equalPos !== -1) {
        const key = line.slice(0, equalPos).trim();
        let value = line.slice(equalPos + 1).trim();
        
        currentSection[key] = parseValue(value);
      }
    }
    
    return result;
  };

  // IMPROVED FORMATTING FUNCTIONS

  // Data formatting functions
  const formatOutput = (data, format) => {
    try {
      switch (format) {
        case "json":
          return formatJSON(data);
        case "yaml":
          return formatYAML(data);
        case "csv":
          return formatCSV(data);
        case "xml":
          return formatXML(data);
        case "toml":
          return formatTOML(data);
        default:
          throw new Error(`Unsupported output format: ${format}`);
      }
    } catch (error) {
      throw new Error(`Error generating ${format.toUpperCase()}: ${error.message}`);
    }
  };

  // JSON formatting with proper error handling
  const formatJSON = (data) => {
    try {
      return JSON.stringify(
        data, 
        null, 
        advancedOptions.prettyPrint ? advancedOptions.jsonIndent : 0
      );
    } catch (error) {
      throw new Error(`Cannot convert to JSON: ${error.message}`);
    }
  };

  // YAML formatting with proper options
  const formatYAML = (data) => {
    try {
      return YAML.stringify(data, {
        indent: advancedOptions.prettyPrint ? advancedOptions.yamlIndent : 0,
      });
    } catch (error) {
      throw new Error(`Cannot convert to YAML: ${error.message}`);
    }
  };

  // Enhanced CSV formatter with improved handling of arrays and objects
  const formatCSV = (data) => {
    if (!data) return "";
    
    // Normalize data to an array of objects
    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0) return "";
    
    const delimiter = advancedOptions.csvDelimiter;
    const quoteStrings = advancedOptions.csvQuoteStrings;
    const includeHeaders = advancedOptions.csvIncludeHeaders;
    
    // Function to flatten nested objects into dot notation
    const flattenObject = (obj, prefix = '') => {
      return Object.keys(obj).reduce((acc, key) => {
        const pre = prefix.length ? `${prefix}.` : '';
        if (
          typeof obj[key] === 'object' && 
          obj[key] !== null && 
          !Array.isArray(obj[key]) &&
          !(obj[key] instanceof Date)
        ) {
          Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
        } else {
          acc[`${pre}${key}`] = obj[key];
        }
        return acc;
      }, {});
    };
    
    // Flatten all objects and collect unique headers
    const flattenedData = dataArray.map(item => flattenObject(item));
    const headers = [];
    flattenedData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (!headers.includes(key)) {
          headers.push(key);
        }
      });
    });
    
    // Format a value for CSV output
    const formatValue = (value) => {
      if (value === null || value === undefined) {
        return '';
      }
      
      if (Array.isArray(value)) {
        // Join arrays with ; to avoid confusion with the CSV delimiter
        value = value.join(';');
      }
      
      if (value instanceof Date) {
        value = value.toISOString();
      }
      
      const stringValue = String(value);
      
      // Quote strings if option is enabled or if they contain special characters
      if (quoteStrings && typeof value === 'string' || 
          stringValue.includes(delimiter) || 
          stringValue.includes('\n') || 
          stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    };
    
    let csv = '';
    
    // Add headers
    if (includeHeaders && headers.length > 0) {
      csv += headers.map(header => 
        quoteStrings ? `"${header.replace(/"/g, '""')}"` : header
      ).join(delimiter) + '\n';
    }
    
    // Add data rows
    flattenedData.forEach(item => {
      const row = headers.map(header => formatValue(item[header]));
      csv += row.join(delimiter) + '\n';
    });
    
    return csv;
  };

  // Improved XML formatter with proper nesting and attribute support
  const formatXML = (data) => {
    const indent = advancedOptions.prettyPrint ? ' '.repeat(advancedOptions.xmlIndent) : '';
    
    function objectToXml(obj, nodeName, level = 0) {
      if (obj === null || obj === undefined) {
        return `${indent.repeat(level)}<${nodeName}/>${advancedOptions.prettyPrint ? '\n' : ''}`;
      }
      
      const currentIndent = indent.repeat(level);
      const nl = advancedOptions.prettyPrint ? '\n' : '';
      
      // Special handling for primitive values
      if (typeof obj !== 'object' || obj instanceof Date) {
        let value = obj instanceof Date ? obj.toISOString() : String(obj);
        // Escape XML special characters
        value = value
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
        return `${currentIndent}<${nodeName}>${value}</${nodeName}>${nl}`;
      }
      
      let xml = `${currentIndent}<${nodeName}`;
      
      // Handle attributes (properties that start with @)
      const attributes = {};
      const children = {};
      let textContent = null;
      
      for (const key in obj) {
        if (key === '@attributes' && typeof obj[key] === 'object') {
          Object.assign(attributes, obj[key]);
        } else if (key === '#text') {
          textContent = obj[key];
        } else {
          children[key] = obj[key];
        }
      }
      
      // Add attributes
      for (const attr in attributes) {
        let attrValue = attributes[attr];
        if (attrValue !== null && attrValue !== undefined) {
          // Escape attribute values
          attrValue = String(attrValue)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
          xml += ` ${attr}="${attrValue}"`;
        }
      }
      
      const hasChildren = Object.keys(children).length > 0;
      const hasTextContent = textContent !== null && textContent !== undefined;
      
      // Handle empty elements
      if (!hasChildren && !hasTextContent) {
        return `${xml}/>${nl}`;
      }
      
      xml += '>';
      
      // Add text content if present
      if (hasTextContent) {
        let value = String(textContent)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
        xml += value;
      } else if (hasChildren) {
        xml += nl;
      }
      
      // Add child elements
      for (const childName in children) {
        const child = children[childName];
        
        if (Array.isArray(child)) {
          // Handle array of items
          child.forEach(item => {
            xml += objectToXml(item, childName, level + 1);
          });
        } else {
          // Handle single item
          xml += objectToXml(child, childName, level + 1);
        }
      }
      
      // Close the element
      if (hasChildren) {
        xml += currentIndent;
      }
      xml += `</${nodeName}>${nl}`;
      
      return xml;
    }
    
    // Handle the root element(s)
    let xml = `<?xml version="1.0" encoding="UTF-8"?>${advancedOptions.prettyPrint ? '\n' : ''}`;
    
    if (Array.isArray(data)) {
      // Wrap arrays in a root element
      xml += `<root>${advancedOptions.prettyPrint ? '\n' : ''}`;
      data.forEach((item, index) => {
        xml += objectToXml(item, "item", 1);
      });
      xml += `</root>`;
    } else {
      // Use the first key as root element name
      const rootKeys = Object.keys(data);
      if (rootKeys.length === 0) {
        xml += '<root/>';
      } else {
        const rootName = rootKeys[0];
        xml += objectToXml(data[rootName], rootName);
      }
    }
    
    return xml;
  };

  // Enhanced TOML formatter with better handling of complex types
  const formatTOML = (data) => {
    if (!data) return "";
    
    let toml = "";
    const lineBreak = "\n";
    
    function formatValue(value) {
      if (value === null || value === undefined) {
        return "";
      }
      
      if (typeof value === "string") {
        // Check if the string needs basic or multi-line formatting
        if (value.includes("\n") || value.includes("\"")) {
          return `'''${value}'''`;
        }
        return `"${value}"`;
      }
      
      if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
      }
      
      if (value instanceof Date) {
        return value.toISOString();
      }
      
      if (Array.isArray(value)) {
        // Handle arrays of primitives
        const arrayValues = value.map(item => {
          if (typeof item === "string") {
            return `"${item.replace(/"/g, '\\"')}"`;
          }
          return formatValue(item);
        });
        return `[${arrayValues.join(", ")}]`;
      }
      
      // Object values will be handled separately
      return null;
    }
    
    function writeSection(data, path = []) {
      const simpleProps = {};
      const tableSections = {};
      const arrayOfTables = {};
      
      // First pass: separate simple values from tables
      for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined) {
          continue;
        }
        
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && !(value[0] instanceof Date)) {
          // This is an array of tables
          arrayOfTables[key] = value;
        } else if (typeof value === "object" && !(value instanceof Date) && !Array.isArray(value)) {
          // This is a table section
          tableSections[key] = value;
        } else {
          // This is a simple key-value pair
          simpleProps[key] = value;
        }
      }
      
      // Write simple key-value pairs
      for (const [key, value] of Object.entries(simpleProps)) {
        const formattedValue = formatValue(value);
        if (formattedValue !== null) {
          toml += `${key} = ${formattedValue}${lineBreak}`;
        }
      }
      
      // Add spacing if we have both simple props and tables
      if (Object.keys(simpleProps).length > 0 && 
          (Object.keys(tableSections).length > 0 || Object.keys(arrayOfTables).length > 0)) {
        toml += lineBreak;
      }
      
      // Write table sections
      for (const [key, value] of Object.entries(tableSections)) {
        const newPath = [...path, key];
        toml += `[${newPath.join(".")}]${lineBreak}`;
        writeSection(value, newPath);
        toml += lineBreak;
      }
      
      // Write arrays of tables
      for (const [key, tables] of Object.entries(arrayOfTables)) {
        tables.forEach(table => {
          const newPath = [...path, key];
          toml += `[[${newPath.join(".")}]]${lineBreak}`;
          writeSection(table, []);  // Don't pass path as we're already in the right context
          toml += lineBreak;
        });
      }
    }
    
    writeSection(data);
    return toml.trim();
  };

  // Helper function to provide context around errors
  const getErrorContext = (text, position, contextSize = 20) => {
    const start = Math.max(0, position - contextSize);
    const end = Math.min(text.length, position + contextSize);
    return `...${text.substring(start, position)}►${text.substring(position, end)}...`;
  };

  // Main conversion function
  const convertData = () => {
    if (!inputText.trim()) {
      setOutputText("");
      setConversionStatus({ success: true, message: "" });
      return;
    }
    
    try {
      const parsedData = parseInput(inputText, sourceFormat);
      const result = formatOutput(parsedData, targetFormat);
      
      setOutputText(result);
      setConversionStatus({
        success: true,
        message: `Successfully converted ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}`,
      });
    } catch (error) {
      setOutputText("");
      setConversionStatus({
        success: false,
        message: error.message,
      });
      showNotification(error.message, "error");
    }
  };

  // Handler for format selection
  const handleFormatChange = (e, isSource) => {
    const format = e.target.value;
    if (isSource) {
      setSourceFormat(format);
    } else {
      setTargetFormat(format);
    }
  };

  // Handler for copying output to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showNotification("Copied to clipboard!");
  };

  // Handler for swapping input and output
  // Handler for swapping input and output
  const swapFormats = () => {
    // Only swap if we have output text
    if (outputText) {
      setInputText(outputText);
      setOutputText("");
      const tempFormat = sourceFormat;
      setSourceFormat(targetFormat);
      setTargetFormat(tempFormat);
    } else {
      // Just swap the formats
      const tempFormat = sourceFormat;
      setSourceFormat(targetFormat);
      setTargetFormat(tempFormat);
    }
  };

  // Handler for file uploads
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Automatically detect format from file extension
    const extension = file.name.split('.').pop().toLowerCase();
    let format = sourceFormat;
    
    if (['json', 'csv', 'xml', 'yaml', 'yml', 'toml'].includes(extension)) {
      if (extension === 'yml') {
        format = 'yaml';
      } else {
        format = extension;
      }
      setSourceFormat(format);
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setInputText(event.target.result);
    };
    reader.readAsText(file);
  };

  // Handler for downloading output as a file
  const downloadOutput = () => {
    if (!outputText) return;
    
    const extensions = {
      json: 'json',
      csv: 'csv',
      yaml: 'yaml',
      xml: 'xml',
      toml: 'toml'
    };
    
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${extensions[targetFormat]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`Downloaded as converted.${extensions[targetFormat]}`);
  };

  // Reset both input and output
  const resetAll = () => {
    setInputText("");
    setOutputText("");
    setConversionStatus({ success: true, message: "" });
  };

  // Handle advanced options toggle
  const toggleAdvancedOptions = () => {
    setAdvancedOptions({
      ...advancedOptions,
      showPanel: !advancedOptions.showPanel
    });
  };

  // Custom styled components
  const Panel = ({ children, className = "" }) => (
    <div
      className={`rounded-lg p-4 ${className}`}
      style={{
        backgroundColor: getColors()[theme].surface,
        borderColor: getColors()[theme].border,
        borderWidth: "1px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      }}
    >
      {children}
    </div>
  );

  const Button = ({
    children,
    onClick,
    className = "",
    variant = "primary",
    size = "md",
    icon = null,
  }) => {
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-2 text-base",
    };

    const variantClasses = {
      primary: `bg-${getColors()[theme].primary} text-white`,
      secondary: `bg-${getColors()[theme].surface2} text-${
        getColors()[theme].text
      } border border-${getColors()[theme].border}`,
      ghost: `text-${getColors()[theme].text} hover:bg-${
        getColors()[theme].surface2
      }`,
    };

    return (
      <button
        onClick={onClick}
        className={`rounded-md flex items-center justify-center transition-colors ${
          sizeClasses[size]
        } ${variantClasses[variant]} ${className}`}
        style={{
          backgroundColor:
            variant === "primary"
              ? getColors()[theme].primary
              : variant === "secondary"
              ? getColors()[theme].surface2
              : "transparent",
          color:
            variant === "primary"
              ? "#fff"
              : getColors()[theme].text,
          borderColor:
            variant === "secondary" ? getColors()[theme].border : "transparent",
        }}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  };

  const Select = ({ value, onChange, options, className = "" }) => (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={onChange}
        className={`appearance-none rounded-md px-3 py-2 pr-8 ${className}`}
        style={{
          backgroundColor: getColors()[theme].surface2,
          color: getColors()[theme].text,
          borderColor: getColors()[theme].border,
          borderWidth: "1px",
        }}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
        style={{ color: getColors()[theme].textSecondary }}
      >
        <ChevronDown size={16} />
      </div>
    </div>
  );

  const Textarea = ({
    value,
    onChange,
    placeholder,
    className = "",
    disabled = false,
    inputRef,
  }) => (
    <textarea
      ref={inputRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full rounded-md p-3 ${className}`}
      style={{
        backgroundColor: getColors()[theme].surface2,
        color: getColors()[theme].text,
        borderColor: getColors()[theme].border,
        borderWidth: "1px",
        minHeight: "200px",
        resize: "vertical",
      }}
    />
  );

  const NotificationComponent = ({ type, message }) => {
    const icons = {
      success: <CheckCircle size={18} />,
      error: <AlertCircle size={18} />,
      info: <Info size={18} />,
    };

    const colors = {
      success: getColors()[theme].success,
      error: getColors()[theme].error,
      info: getColors()[theme].info,
    };

    return (
      <div
        className="fixed top-4 right-4 flex items-center rounded-md px-4 py-3 shadow-lg"
        style={{
          backgroundColor: getColors()[theme].surface,
          borderLeft: `4px solid ${colors[type]}`,
          zIndex: 1000,
        }}
      >
        <span style={{ color: colors[type] }} className="mr-2">
          {icons[type]}
        </span>
        <span style={{ color: getColors()[theme].text }}>{message}</span>
      </div>
    );
  };

  return (
    <div className="container mt-18 mx-auto p-4 max-w-5xl">
      <h1
        className="mb-6 text-2xl font-bold text-center"
        style={{ color: getColors()[theme].text }}
      >
        Data Format Converter
      </h1>

      {/* Format selection controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Select
            value={sourceFormat}
            onChange={(e) => handleFormatChange(e, true)}
            options={formats}
            className="flex-shrink-0"
          />
          <Button
            onClick={swapFormats}
            variant="ghost"
            className="rounded-full"
            icon={<ArrowDownUp size={16} />}
          />
          <Select
            value={targetFormat}
            onChange={(e) => handleFormatChange(e, false)}
            options={formats}
            className="flex-shrink-0"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleAdvancedOptions}
            variant="secondary"
            icon={<Settings size={16} />}
          >
            Options {advancedOptions.showPanel ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          <Button onClick={resetAll} variant="secondary" icon={<RefreshCw size={16} />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Advanced options panel */}
      {advancedOptions.showPanel && (
        <Panel className="mb-6">
          <h3 className="mb-4 font-semibold" style={{ color: getColors()[theme].text }}>
            Advanced Options
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium" style={{ color: getColors()[theme].textSecondary }}>
                CSV Options
              </h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="mr-2 flex-shrink-0" style={{ color: getColors()[theme].text }}>
                    Delimiter:
                  </label>
                  <input
                    type="text"
                    value={advancedOptions.csvDelimiter}
                    onChange={(e) =>
                      setAdvancedOptions({
                        ...advancedOptions,
                        csvDelimiter: e.target.value || ",",
                      })
                    }
                    maxLength={1}
                    className="w-12 rounded px-2 py-1"
                    style={{
                      backgroundColor: getColors()[theme].surface2,
                      color: getColors()[theme].text,
                      borderColor: getColors()[theme].border,
                      borderWidth: "1px",
                    }}
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center" style={{ color: getColors()[theme].text }}>
                    <input
                      type="checkbox"
                      checked={advancedOptions.csvQuoteStrings}
                      onChange={(e) =>
                        setAdvancedOptions({
                          ...advancedOptions,
                          csvQuoteStrings: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Quote strings
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center" style={{ color: getColors()[theme].text }}>
                    <input
                      type="checkbox"
                      checked={advancedOptions.csvIncludeHeaders}
                      onChange={(e) =>
                        setAdvancedOptions({
                          ...advancedOptions,
                          csvIncludeHeaders: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Include headers
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium" style={{ color: getColors()[theme].textSecondary }}>
                Formatting Options
              </h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="flex items-center" style={{ color: getColors()[theme].text }}>
                    <input
                      type="checkbox"
                      checked={advancedOptions.prettyPrint}
                      onChange={(e) =>
                        setAdvancedOptions({
                          ...advancedOptions,
                          prettyPrint: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Pretty print
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="mr-2" style={{ color: getColors()[theme].text }}>
                    Indent size:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={advancedOptions.jsonIndent}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 2;
                      setAdvancedOptions({
                        ...advancedOptions,
                        jsonIndent: value,
                        yamlIndent: value,
                        xmlIndent: value,
                      });
                    }}
                    className="w-12 rounded px-2 py-1"
                    style={{
                      backgroundColor: getColors()[theme].surface2,
                      color: getColors()[theme].text,
                      borderColor: getColors()[theme].border,
                      borderWidth: "1px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* Input/Output panels */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Input panel */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: getColors()[theme].text }}>
              Input ({sourceFormat.toUpperCase()})
            </h2>
            <div className="flex space-x-2">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                className="hidden"
                accept=".json,.csv,.xml,.yaml,.yml,.toml"
              />
              <label htmlFor="file-upload">
                <Button variant="secondary" size="sm" icon={<Upload size={14} />}>
                  Upload
                </Button>
              </label>
            </div>
          </div>
          <Panel>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Paste your ${sourceFormat.toUpperCase()} data here...`}
              inputRef={inputRef}
            />
          </Panel>
        </div>

        {/* Output panel */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: getColors()[theme].text }}>
              Output ({targetFormat.toUpperCase()})
            </h2>
            <div className="flex space-x-2">
              <Button
                onClick={copyToClipboard}
                variant="secondary"
                size="sm"
                icon={copied ? <CheckCircle size={14} /> : <Clipboard size={14} />}
                disabled={!outputText}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                onClick={downloadOutput}
                variant="secondary"
                size="sm"
                icon={<Download size={14} />}
                disabled={!outputText}
              >
                Download
              </Button>
            </div>
          </div>
          <Panel>
            <Textarea
              value={outputText}
              onChange={() => {}}
              placeholder={`Converted ${targetFormat.toUpperCase()} will appear here...`}
              disabled={true}
              inputRef={outputRef}
            />
          </Panel>
        </div>
      </div>

      {/* Status message */}
      {conversionStatus.message && (
        <div
          className="mt-4 rounded-md p-3"
          style={{
            backgroundColor: conversionStatus.success
              ? getColors()[theme].success + "20"
              : getColors()[theme].error + "20",
            borderLeft: `4px solid ${
              conversionStatus.success
                ? getColors()[theme].success
                : getColors()[theme].error
            }`,
          }}
        >
          <div className="flex items-center">
            <span className="mr-2">
              {conversionStatus.success ? (
                <CheckCircle
                  size={16}
                  style={{ color: getColors()[theme].success }}
                />
              ) : (
                <AlertCircle
                  size={16}
                  style={{ color: getColors()[theme].error }}
                />
              )}
            </span>
            <span
              style={{
                color: conversionStatus.success
                  ? getColors()[theme].success
                  : getColors()[theme].error,
              }}
            >
              {conversionStatus.message}
            </span>
          </div>
        </div>
      )}

      {/* Notification component */}
      {notification.show && (
        <NotificationComponent
          type={notification.type}
          message={notification.message}
        />
      )}
    </div>
  );
}