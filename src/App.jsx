import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, createContext, useEffect } from "react";
import Navbar from "./components/Navbar";
import { useTheme } from "./ThemeProvider";
import Contact from "./pages/Contact";
import About from "./pages/About";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound.jsx";

// General Utilities
import TextCleaning from "./general/TextCleaning.jsx";
import TextComparison from "./general/TextComparison.jsx";
import JSONFormatter from "./general/JSONFormatter.jsx";
import QrGenerator from "./general/QrGenerator.jsx";
import UrlShortner from "./general/UrlShortner.jsx";
import CurrencyConverter from "./general/CurrencyConverter.jsx";

// PDF Tools
import MergePDF from "./PDFTools/MergePDF";
import PDFtoImages from "./PDFTools/PDFtoImages";
import SplitPDF from "./PDFTools/SplitPDF";
import CompressPDF from "./PDFTools/CompressPDF.jsx";
import ImageToPDF from "./PDFTools/ImageToPDF.jsx";
import PDFReordering from "./PDFTools/PDFreOrder.jsx";

// Maths Tools
import MatrixSolver from "./Maths/MatrixSolver";
import GraphPlotter from "./Maths/GraphPlotter";
import ScientificCalculator from "./Maths/ScientificCalculator.jsx";
import ComplexNumberCalculator from "./Maths/ComplexNumberCalculator.jsx";

// Design Tools
import CssAnimations from "./Design/CssAnimations.jsx";
import CssGrids from "./Design/CssGrids.jsx";
import CssGradients from "./Design/CssGradients.jsx";
import TypeWriter from "./Design/TypeWriter.jsx";

import UtilityPage from "./UtilityPage";
import { utilities, utilityRoutes } from "./routes.js";
import StatisticsProbabilityTool from "./Maths/StatisticsProbabilityTool.jsx";

// Contexts
export const SearchContext = createContext();
export const ThemeHistoryContext = createContext();

window.appRoutes = { utilities, utilityRoutes };

// ScrollToTop component that will scroll the window up on every navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Main layout: renders Navbar, Toasts, and matched child route
const MainLayout = ({ theme }) => (
  <div
    className={`${theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-black"} min-h-screen`}
  >
    <ScrollToTop />
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
    <Outlet />
  </div>
);

const App = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [previousTheme, setPreviousTheme] = useState(theme);

  useEffect(() => {
    window.appRoutes = { utilities, utilityRoutes };
  }, []);

  useEffect(() => {
    setPreviousTheme(theme);
  }, [theme]);

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, searchFocused, setSearchFocused }}
    >
      <ThemeHistoryContext.Provider value={{ previousTheme }}>
        <Router>
          <Routes>
            {/* All valid routes use MainLayout */}
            <Route element={<MainLayout theme={theme} />}>
              <Route path="/" element={<HomePage theme={theme} />} />
              <Route path="/about" element={<About theme={theme} />} />
              <Route path="/contact" element={<Contact theme={theme} />} />
              <Route
                path="/utilities"
                element={
                  <UtilityPage
                    theme={theme}
                    utilities={utilities}
                    utilityRoutes={utilityRoutes}
                  />
                }
              />

              {/* General Utilities */}
              <Route
                path="/utilities/json-formatter"
                element={<JSONFormatter theme={theme} />}
              />
              <Route
                path="/utilities/text-cleaner"
                element={<TextCleaning theme={theme} />}
              />
              <Route
                path="/utilities/text-compare"
                element={<TextComparison theme={theme} />}
              />
              <Route
                path="/utilities/qr-generator"
                element={<QrGenerator theme={theme} />}
              />
              <Route
                path="/utilities/url-shortner"
                element={<UrlShortner theme={theme} />}
              />
              <Route
                path="/utilities/currency-converter"
                element={<CurrencyConverter theme={theme} />}
              />

              {/* PDF Tools */}
              <Route
                path="/utilities/merge"
                element={<MergePDF theme={theme} />}
              />
              <Route
                path="/utilities/split"
                element={<SplitPDF theme={theme} />}
              />
              <Route
                path="/utilities/pdf-to-images"
                element={<PDFtoImages theme={theme} />}
              />
              <Route
                path="/utilities/images-to-pdf"
                element={<ImageToPDF theme={theme} />}
              />
              <Route
                path="/utilities/pdf-reorder"
                element={<PDFReordering theme={theme} />}
              />
              <Route
                path="/utilities/compress"
                element={<CompressPDF theme={theme} />}
              />

              {/* Maths Tools */}
              <Route
                path="/utilities/matrix-calculator"
                element={<MatrixSolver theme={theme} />}
              />
              <Route
                path="/utilities/complex-numbers-calculator"
                element={<ComplexNumberCalculator theme={theme} />}
              />
              <Route
                path="/utilities/graph-plotter"
                element={<GraphPlotter theme={theme} />}
              />
              <Route
                path="/utilities/scientific-calculator"
                element={<ScientificCalculator theme={theme} />}
              />
              <Route
                path="/utilities/stats-probability"
                element={<StatisticsProbabilityTool theme={theme} />}
              />

              {/* Design Tools */}
              <Route
                path="/utilities/animations"
                element={<CssAnimations theme={theme} />}
              />
              <Route
                path="/utilities/grids"
                element={<CssGrids theme={theme} />}
              />
              <Route
                path="/utilities/gradients"
                element={<CssGradients theme={theme} />}
              />
              <Route
                path="/utilities/typography"
                element={<TypeWriter theme={theme} />}
              />
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<NotFound theme={theme} />} />
          </Routes>
        </Router>
      </ThemeHistoryContext.Provider>
    </SearchContext.Provider>
  );
};

export default App;