import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Utilities from "./pages/Utilities";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Formatter from "./pages/Formatter";
import TextCaseConverter from "./Text/TextCaseConverter";
import WordCounter from "./Text/WordCounter";

import { useTheme } from "./ThemeProvider"; // Import theme context
import { useState } from "react";
import HTMLFormatter from "./Formatter/HTMLFormatter";
import CSSFormatter from "./Formatter/CSSFormatter";
import JSFormatter from "./Formatter/JSFormatter";
import TSFormatter from "./Formatter/TSFormatter";
import JSONFormatter from "./Formatter/JSONFormatter";
import MergePDF from "./PDFTools/MergePDF";
import PDFtoImages from "./PDFTools/PDFtoImages";
import SplitPDF from "./PDFTools/SplitPDF";
import MatrixSolver from "./Maths/MatrixSolver";
import GraphPlotter from "./Maths/GraphPlotter";
import EquationSolver from "./Maths/EquationSolver";
// import CompressPDF from "./PDFTools/CompressPDF";
// import WordConverter from "./PDFTools/WordConverter";
// import CodeFormatter from "./Programming/CodeFormatter";
// import RegexTester from "./Programming/RegexTester";
// import Base64Encoder from "./Programming/Base64Encoder";
// import Calculator from "./Math/Calculator";
// import MatrixSolver from "./Math/MatrixSolver";
// import GraphPlotter from "./Math/GraphPlotter";
// import WordCounter from "./Text/WordCounter";
// import CaseConverter from "./Text/CaseConverter";
// import TextFormatter from "./Text/TextFormatter";
// import UnitConverter from "./Converters/UnitConverter";
// import CurrencyConverter from "./Converters/CurrencyConverter";
// import PDFConverter from "./Converters/PDFConverter";

const utilities = {
  "Code Formatter": [
    "HTML Formatter",
    "CSS Formatter",
    "JS Formatter",
    // "TS Formatter",
    "JSON Formatter",
  ],
  "PDF Tools": ["Merge PDFs", "Split PDFs", "PDF to Images"], // ✅ Added "PDF to Images
  "Text": ["Word Counter", "Case Converter"],

  "Programming": [
    // "Code Formatter", "Regex Tester", "Base64 Encoder"
  ],

  "Math": ["Matrix Multiplier", "Graph Plotter", "Equation Solver"],

  "Converters": [
    // "Unit Converter", "Currency Converter", "PDF Converter"
  ],
};

// Define route mappings for each utility
const utilityRoutes = {
  "HTML Formatter": "/formatters/html",
  "CSS Formatter": "/formatters/css",
  "JS Formatter": "/formatters/js",
  // "TS Formatter": "/formatters/ts",
  "JSON Formatter": "/formatters/json",
  "Merge PDFs": "/pdf-tools/merge",
  "Split PDFs": "/pdf-tools/split",
  "Compress PDFs": "/pdf-tools/compress",
  "Word to PDF": "/pdf-tools/word-converter",
  "PDF to Images": "/pdf-tools/pdf-to-images", // ✅ Added missing route  "Case Converter" : "/text/case-converter",
  "Word Counter": "/text/word-counter",
  "Case Converter": "/text/case-converter",
  "Matrix Multiplier": "/math/matrix-multiplier",
  "Graph Plotter": "/math/graph-plotter",
  "Equation Solver": "/math/equation-solver",
};

const MainContent = ({ theme }) => {
  const [selectedCategory, setSelectedCategory] = useState(
    // Check if a category is saved in localStorage
    localStorage.getItem("selectedCategory") || Object.keys(utilities)[0]
  );
  const navigate = useNavigate();

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Save the selected category to localStorage
    localStorage.setItem("selectedCategory", category);
  };

  return (
    <div className="container mx-auto mt-16 flex">
      {/* Sidebar for category selection */}
      <aside
        className={`w-64 p-5 h-screen shadow-lg ${theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"} transition-all`}
      >
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul className="space-y-3">
          {Object.keys(utilities).map((category) => (
            <li
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`p-2 cursor-pointer rounded-lg transition-all ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-400"
              }`}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content displaying utilities for the selected category */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">
          {selectedCategory} Utilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {utilities[selectedCategory].map((utility) => (
            <div
              key={utility}
              className={`p-6 rounded-lg shadow-md cursor-pointer transition-all ${
                theme === "dark"
                  ? "bg-[#222] hover:bg-[#333]"
                  : "bg-white hover:bg-gray-200"
              }`}
              onClick={() => navigate(utilityRoutes[utility])}
            >
              <h3 className="text-xl font-semibold">{utility}</h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// Main App component
const App = () => {
  const { theme } = useTheme(); // Get the current theme from context

  return (
    <Router>
      {/* Apply global background color and text color based on theme */}
      <div
        className={`${theme === "dark" ? "bg-[#000] text-white" : "bg-gray-100 text-black"} min-h-screen`}
      >
        <Navbar /> {/* Navbar component */}
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Pass theme prop to MainContent */}
          <Route path="/" element={<MainContent theme={theme} />} />
          <Route path="/utilities" element={<Utilities theme={theme} />} />
          <Route path="/about" element={<About theme={theme} />} />
          <Route path="/contact" element={<Contact theme={theme} />} />
          <Route path="/formatters" element={<Formatter />} />

          {/* Formatter Routes - Pass theme prop to each formatter */}
          <Route
            path="/formatters/html"
            element={<HTMLFormatter theme={theme} />}
          />
          <Route
            path="/formatters/css"
            element={<CSSFormatter theme={theme} />}
          />
          <Route
            path="/formatters/js"
            element={<JSFormatter theme={theme} />}
          />
          {/* <Route
            path="/formatters/ts"
            element={<TSFormatter theme={theme} />}
          /> */}
          <Route
            path="/formatters/json"
            element={<JSONFormatter theme={theme} />}
          />

          {/* PDF Tools Routes - Pass theme prop to each PDF tool */}
          <Route path="/pdf-tools/merge" element={<MergePDF theme={theme} />} />
          <Route path="/pdf-tools/split" element={<SplitPDF theme={theme} />} />

          <Route
            path="/pdf-tools/pdf-to-images"
            element={<PDFtoImages theme={theme} />}
          />

          {/* Text Utilities */}
          <Route
            path="/text/case-converter"
            element={<TextCaseConverter theme={theme} />}
          />
          <Route path="/text/word-counter" element={<WordCounter />} />
          {/* <Route path="/text/text-formatter" element={<TextFormatter />} /> */}

          {/* Math Utilities */}
          <Route path="/math/matrix-multiplier" element={<MatrixSolver />} />
          <Route path="/math/graph-plotter" element={<GraphPlotter theme={theme}/>} />
          <Route path="/math/equation-solver" element={<EquationSolver theme={theme}/>} />
          {/* <Route path="/math/calculator" element={<Calculator />} /> */}

          
          {/* Programming Routes */}
          {/* <Route path="/programming/code-formatter" element={<CodeFormatter />} />
          <Route path="/programming/regex-tester" element={<RegexTester />} />
          <Route path="/programming/base64-encoder" element={<Base64Encoder />} /> */}


          {/* Converter Utilities */}
          {/* <Route path="/converters/unit-converter" element={<UnitConverter />} />
          <Route path="/converters/currency-converter" element={<CurrencyConverter />} />
          <Route path="/converters/pdf-converter" element={<PDFConverter />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
