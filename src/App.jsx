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
import TextCaseConverter from "./Text/TextCaseConverter";
import WordCounter from "./Text/WordCounter";
import TextCleaning from "./Text/TextCleaning";

import { useTheme } from "./ThemeProvider"; // Import theme context
import { useState } from "react";
import HTMLFormatter from "./Formatter/HTMLFormatter";
import CSSFormatter from "./Formatter/CSSFormatter";
import JSFormatter from "./Formatter/JSFormatter";
import JSONFormatter from "./Formatter/JSONFormatter";
import MergePDF from "./PDFTools/MergePDF";
import PDFtoImages from "./PDFTools/PDFtoImages";
import SplitPDF from "./PDFTools/SplitPDF";
import MatrixSolver from "./Maths/MatrixSolver";
import GraphPlotter from "./Maths/GraphPlotter";
import EquationSolver from "./Maths/EquationSolver";
import BaseConverter from "./DSD/BaseConverter.jsx";
import BitwiseOperators from "./DSD/BitwiseOperators.jsx";
import BinaryGrayBCDConverter from "./DSD/BinaryGrayBCDConverter.jsx";
import Complement from "./DSD/Complement.jsx";
// import Length from "./converters/LengthConverter"
import LengthConverter from "./converters/LengthConverter.jsx";
import MassConverter from "./converters/MassConverter.jsx";
import TemperatureConverter from "./converters/TemperatureConverter.jsx";
import VolumeConverter from "./converters/VolumeConverter.jsx";
import DensityConverter from "./converters/DensityConverter.jsx";
import AreaConverter from "./converters/AreaConverter.jsx";
import SpeedConverter from "./converters/SpeedConverter.jsx";
import EnergyConverter from "./converters/EnergyConverter.jsx";
import TimeConverter from "./converters/TimeConverter.jsx";
import PowerConverter from "./converters/PowerConverter.jsx";
import FrequencyConverter from "./converters/FrequencyConverter.jsx";

import BgRemover from "./Images/BGRemover.jsx";


import ScientificCalculator from "./Maths/ScientificCalculator.jsx";


// routing at utilities page......

import Formatter from "./pages/Utilities/Formatter";
import PDF from "./pages/Utilities/PDF";
import Text from "./pages/Utilities/Text";
import Maths from "./pages/Utilities/Maths";
import BaseAndBitwiseOperator from "./pages/Utilities/BaseAndBitwiseOperator";
import Converters from "./pages/Utilities/Converters.jsx";



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

  "PDF Tools": ["Merge PDFs", "Split PDFs", "PDF to Images"],

  "Text": ["Word Counter", "Case Converter", "Text Cleaner"],

 "Advanced Mathematics": ["Scientific Calculator", "Matrix Calculator", "Graph Plotter", ],

  "Bases & Bitwise Operators": ["Base Converter", "Bitwise Operators", "Complement", "Binary, Gray, BCD Converter"],
  
  "Unit Converters": ["Length Converter", "Mass Converter", "Temperature Converter","Time Converter","Frequency Converter", "Area Converter", "Volume Converter", "Density Converter", "Energy Converter","Power Converter", "Speed Converter"],

  "Images": ["BG Remover"]
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
  "PDF to Images": "/pdf-tools/pdf-to-images",
  "Word Counter": "/text/word-counter",
  "Case Converter": "/text/case-converter",
  "Text Cleaner": "/text/text-cleaning",
  "Matrix Calculator": "/math/matrix-calculator",
  "Graph Plotter": "/math/graph-plotter",
  "Equation Solver": "/math/equation-solver",
  "Scientific Calculator": "/math/scientific-calculator",
  "Base Converter": "/bases-and-bitwise/base-converter",
  "Bitwise Operators": "/bases-and-bitwise/bitwise-operators",
  "Binary, Gray, BCD Converter": "/bases-and-bitwise/binary-gray-bcd",
  "Complement": "/bases-and-bitwise/complement",
  "Length Converter": "/converters/length-converter",
  "Mass Converter": "/converters/mass-converter",
  "Temperature Converter": "/converters/temperature-converter",
  "Area Converter": "/converters/area-converter",
  "Volume Converter": "/converters/volume-converter",
  "Density Converter": "/converters/density-converter",
  "Time Converter": "/converters/time-converter",
  "Energy Converter": "/converters/energy-converter",
  "Speed Converter": "/converters/speed-converter",
  "Power Converter": "/converters/power-converter",
  "Frequency Converter": "/converters/frequency-converter",
  "BG Remover": "/images/bg-remover"
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
          <Route path="/text" element={<Text />} />
          <Route path="/pdf-tools" element={<PDF />} />
          <Route path="/math" element={<Maths />} />
          <Route path="/bases-and-bitwise" element={<BaseAndBitwiseOperator />} />
          <Route path="/converters" element={<Converters />} />



          {/* Formatter Routes - Pass theme prop to each formatter */}
          <Route path="/formatters/html" element={<HTMLFormatter theme={theme} />} />
          <Route path="/formatters/css" element={<CSSFormatter theme={theme} />}/>
          <Route path="/formatters/js" element={<JSFormatter theme={theme} />}/>
          <Route path="/formatters/json" element={<JSONFormatter theme={theme} />}/>



          {/* PDF Tools Routes - Pass theme prop to each PDF tool */}
          <Route path="/pdf-tools/merge" element={<MergePDF theme={theme} />} />
          <Route path="/pdf-tools/split" element={<SplitPDF theme={theme} />} />
          <Route path="/pdf-tools/pdf-to-images" element={<PDFtoImages theme={theme} />}/>



          {/* Text Utilities */}
          <Route path="/text/case-converter" element={<TextCaseConverter theme={theme} />}/>
          <Route path="/text/word-counter" element={<WordCounter />} />
          <Route path="/text/text-cleaning" element={<TextCleaning theme={theme} />} />



          {/* Math Utilities */}

{/* Advanced */}
          <Route path="/math/matrix-calculator" element={<MatrixSolver />} />
          <Route path="/math/graph-plotter" element={<GraphPlotter theme={theme} />}/>
          <Route path="/math/equation-solver" element={<EquationSolver theme={theme} />}/>
          <Route path="/math/scientific-calculator" element={<ScientificCalculator theme={theme} />}/>
          {/* <Route path="/math/calculator" element={<Calculator />} /> */}

{/* Basic */}



          {/* DSD Utilities */}
          <Route path="/bases-and-bitwise/base-converter" element={<BaseConverter theme={theme} />}/>
          <Route path="/bases-and-bitwise/bitwise-operators" element={<BitwiseOperators theme={theme} />}/>
          <Route path="/bases-and-bitwise/complement" element={<Complement theme={theme} />}/>
          <Route path="/bases-and-bitwise/binary-gray-bcd" element={<BinaryGrayBCDConverter theme={theme} />}/>



          {/* Converters Routes */}
          <Route path="/converters/length-converter" element={<LengthConverter theme={theme} />} />
          <Route path="/converters/mass-converter" element={<MassConverter theme={theme} />} />
          <Route path="/converters/temperature-converter" element={<TemperatureConverter theme={theme} />} />
          <Route path="/converters/area-converter" element={<AreaConverter theme={theme} />} />
          <Route path="/converters/volume-converter" element={<VolumeConverter theme={theme} />} />
          <Route path="/converters/density-converter" element={<DensityConverter theme={theme} />} />
          
          <Route path="/converters/time-converter" element={<TimeConverter theme={theme} />} />
          <Route path="/converters/frequency-converter" element={<FrequencyConverter theme={theme} />} />
          <Route path="/converters/energy-converter" element={<EnergyConverter theme={theme} />} />
          <Route path="/converters/power-converter" element={<PowerConverter theme={theme} />} />
          <Route path="/converters/speed-converter" element={<SpeedConverter theme={theme} />} />


          <Route path="/images/bg-remover" element={<BgRemover theme={theme} />} />

          {/* <Route path="/programming/regex-tester" element={<RegexTester />} />
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
