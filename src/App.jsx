import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Utilities from "./pages/Utilities";
import Contact from "./pages/Contact";
import About from "./pages/About";
import TextCaseConverter from "./Text/TextCaseConverter";
import WordCounter from "./Text/WordCounter";
import TextCleaning from "./Text/TextCleaning";
import { useTheme } from "./ThemeProvider";
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
import QrGenerator from "./general/QrGenerator.jsx";
import ScientificCalculator from "./Maths/ScientificCalculator.jsx";

import Formatter from "./pages/Utilities/Formatter";
import PDF from "./pages/Utilities/PDF";
import Text from "./pages/Utilities/Text";
import Maths from "./pages/Utilities/Maths";
import BaseAndBitwiseOperator from "./pages/Utilities/BaseAndBitwiseOperator";
import Converters from "./pages/Utilities/Converters.jsx";

// Import the utilities config and route mappings
import { utilities, utilityRoutes } from "./routes.js";

// Enhanced SVG Icons with animation properties
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 rotate-90">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// New icons for utility cards
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const CategoryIcon = ({ category }) => {
  // Simple icon mapping based on category name
  const iconMap = {
    Formatters: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
        <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
        <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
    Text: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    Math: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    ),
    "PDF Tools": (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path>
        <polyline points="14 2 14 7 19 7"></polyline>
        <path d="M2 15h10"></path>
        <path d="M9 18l3-3-3-3"></path>
      </svg>
    ),
    Converters: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"></polyline>
        <polyline points="23 20 23 14 17 14"></polyline>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
      </svg>
    ),
    Images: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    ),
    "Bases and Bitwise": (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    ),
  };

  // Default icon if category doesn't match
  const defaultIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );

  return iconMap[category] || defaultIcon;
};

const MainContent = ({ theme }) => {
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory") || Object.keys(utilities)[0]
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState(
    JSON.parse(localStorage.getItem("recentlyViewed")) || []
  );
  const navigate = useNavigate();

  // Handle window resize to manage sidebar state
  useEffect(() => {
    const handleResize = () => {
      // Only show sidebar by default on large screens
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    localStorage.setItem("selectedCategory", category);
    
    // Auto-close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleUtilitySelect = (utility) => {
    // Add to recently viewed
    const updatedRecent = [utility, ...recentlyViewed.filter(item => item !== utility)].slice(0, 5);
    setRecentlyViewed(updatedRecent);
    localStorage.setItem("recentlyViewed", JSON.stringify(updatedRecent));
    
    // Navigate to the utility
    navigate(utilityRoutes[utility]);
  };

  // Filter utilities based on search term
  const filteredUtilities = searchTerm 
    ? Object.keys(utilities).flatMap(category => 
        utilities[category].filter(utility => 
          utility.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : utilities[selectedCategory];

  return (
    <div className="relative min-h-screen pt-16">
      {/* Mobile toggle button - fixed in bottom corner with animation */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center w-14 h-14 transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-12"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Enhanced Sidebar with better spacing, transitions and search */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed z-20 w-72 h-screen pt-16 ${
          theme === "dark" ? "bg-[#1a1a1a] border-r border-gray-800" : "bg-white border-r border-gray-200"
        } shadow-xl transition-all duration-300 transform top-0 left-0 overflow-y-auto`}
      >
        <div className="p-6 pt-8">
          {/* Search bar */}
          <div className="mb-6">
            {/* <div className={`relative rounded-lg overflow-hidden ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}> */}
            <div className={`relative rounded-lg overflow-hidden ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              } md:block hidden`}>
                <input
                  type="text"
                  placeholder="Search utilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-2 pr-10 outline-none ${
                    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
            </div>
          </div>
          
          {/* Recently viewed section */}
          {recentlyViewed.length > 0 && !searchTerm && (
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wider mb-3 opacity-70">Recently Used</h3>
              <div className="space-y-2">
                {recentlyViewed.map((utility) => (
                  <div
                    key={`recent-${utility}`}
                    onClick={() => handleUtilitySelect(utility)}
                    className={`px-3 py-2 cursor-pointer rounded-md text-sm transition-all duration-200 flex items-center gap-2 ${
                      theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    {utility}
                  </div>
                ))}
              </div>
              <div className="h-px my-4 bg-gray-700 opacity-30"></div>
            </div>
          )}

          {/* Categories */}
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <ul className="space-y-2">
            {Object.keys(utilities).map((category) => (
              <li
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white shadow-md"
                    : theme === "dark" 
                      ? "hover:bg-gray-800" 
                      : "hover:bg-gray-100"
                }`}
              >
                <span className="opacity-80">
                  <CategoryIcon category={category} />
                </span>
                <div className="font-medium">{category}</div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Improved overlay with fade effect */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content with improved grid and card design */}
      <main className={`transition-all duration-300 ${
        sidebarOpen ? "md:pl-72" : "pl-0"
      }`}>
        <div className="container mx-auto p-4 pt-8 md:pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pl-4 md:pl-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
              {searchTerm ? (
                <span>Search: <span className="text-blue-500">"{searchTerm}"</span></span>
              ) : (
                <span><span className="text-blue-500">{selectedCategory}</span> Utilities</span>
              )}
            </h2>
            
            {/* Mobile search */}
            <div className="w-full md:w-auto md:max-w-xs">
              <div className={`relative rounded-lg overflow-hidden ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              } md:hidden`}>
                <input
                  type="text"
                  placeholder="Search utilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-2 pr-10 outline-none ${
                    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 pl-4 md:pl-0 pr-4">
            {filteredUtilities.length > 0 ? (
              filteredUtilities.map((utility) => (
                <div
                  key={utility}
                  className={`p-5 rounded-xl shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group ${
                    theme === "dark"
                      ? "bg-[#222] hover:bg-[#2a2a2a] border border-gray-800"
                      : "bg-white hover:bg-gray-50 border border-gray-100"
                  }`}
                  onClick={() => handleUtilitySelect(utility)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{utility}</h3>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRightIcon />
                    </span>
                  </div>
                  <div className={`w-full h-1 rounded-full mt-2 transition-all duration-200 transform origin-left md:group-hover:scale-x-105 group-hover:scale-x-102 ${
                    theme === "dark" ? "bg-blue-700" : "bg-blue-500"
                  } opacity-70`}></div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-40">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="opacity-70">Try searching for something else</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  const { theme } = useTheme();

  return (
    <Router>
      <div
        className={`${
          theme === "dark" ? "bg-[#000] text-white" : "bg-gray-100 text-black"
        } min-h-screen`}
      >
        <Navbar />
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme === "dark" ? "dark" : "light"}
        />
        <Routes>
          <Route path="/" element={<MainContent theme={theme} />} />
          <Route path="/utilities" element={<Utilities theme={theme} />} />
          <Route path="/about" element={<About theme={theme} />} />
          <Route path="/contact" element={<Contact theme={theme} />} />
          <Route path="/formatters" element={<Formatter />} />
          <Route path="/text" element={<Text />} />
          <Route path="/pdf-tools" element={<PDF />} />
          <Route path="/math" element={<Maths />} />
          <Route
            path="/bases-and-bitwise"
            element={<BaseAndBitwiseOperator />}
          />
          <Route path="/converters" element={<Converters />} />

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
          <Route
            path="/formatters/json"
            element={<JSONFormatter theme={theme} />}
          />

          <Route path="/pdf-tools/merge" element={<MergePDF theme={theme} />} />
          <Route path="/pdf-tools/split" element={<SplitPDF theme={theme} />} />
          <Route
            path="/pdf-tools/pdf-to-images"
            element={<PDFtoImages theme={theme} />}
          />

          <Route
            path="/text/case-converter"
            element={<TextCaseConverter theme={theme} />}
          />
          <Route path="/text/word-counter" element={<WordCounter />} />
          <Route
            path="/text/text-cleaning"
            element={<TextCleaning theme={theme} />}
          />

          <Route path="/math/matrix-calculator" element={<MatrixSolver />} />
          <Route
            path="/math/graph-plotter"
            element={<GraphPlotter theme={theme} />}
          />
          <Route
            path="/math/equation-solver"
            element={<EquationSolver theme={theme} />}
          />
          <Route
            path="/math/scientific-calculator"
            element={<ScientificCalculator theme={theme} />}
          />

          <Route
            path="/bases-and-bitwise/base-converter"
            element={<BaseConverter theme={theme} />}
          />
          <Route
            path="/bases-and-bitwise/bitwise-operators"
            element={<BitwiseOperators theme={theme} />}
          />
          <Route
            path="/bases-and-bitwise/complement"
            element={<Complement theme={theme} />}
          />
          <Route
            path="/bases-and-bitwise/binary-gray-bcd"
            element={<BinaryGrayBCDConverter theme={theme} />}
          />

          <Route
            path="/converters/length-converter"
            element={<LengthConverter theme={theme} />}
          />
          <Route
            path="/converters/mass-converter"
            element={<MassConverter theme={theme} />}
          />
          <Route
            path="/converters/temperature-converter"
            element={<TemperatureConverter theme={theme} />}
          />
          <Route
            path="/converters/area-converter"
            element={<AreaConverter theme={theme} />}
          />
          <Route
            path="/converters/volume-converter"
            element={<VolumeConverter theme={theme} />}
          />
          <Route
            path="/converters/density-converter"
            element={<DensityConverter theme={theme} />}
          />
          <Route
            path="/converters/time-converter"
            element={<TimeConverter theme={theme} />}
          />
          <Route
            path="/converters/frequency-converter"
            element={<FrequencyConverter theme={theme} />}
          />
          <Route
            path="/converters/energy-converter"
            element={<EnergyConverter theme={theme} />}
          />
          <Route
            path="/converters/power-converter"
            element={<PowerConverter theme={theme} />}
          />
          <Route
            path="/converters/speed-converter"
            element={<SpeedConverter theme={theme} />}
          />

          <Route
            path="/images/bg-remover"
            element={<BgRemover theme={theme} />}
          />
          <Route
            path="/general/qr-generator"
            element={<QrGenerator theme={theme} />}
          />
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;