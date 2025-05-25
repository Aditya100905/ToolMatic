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
import TextCleaning from "./categories/general/TextCleaning.jsx";
import TextComparison from "./categories/general/TextComparison.jsx";
import QrGenerator from "./categories/general/QrGenerator.jsx";
import UrlShortner from "./categories/general/UrlShortner.jsx";
import CurrencyConverter from "./categories/general/CurrencyConverter.jsx";
import PasswordGenerator from "./categories/general/PasswordGenerator.jsx";

// PDF Tools
import MergePDF from "./categories/PDFTools/MergePDF.jsx";
import PDFtoImages from "./categories/PDFTools/PDFtoImages.jsx";
import SplitPDF from "./categories/PDFTools/SplitPDF.jsx";
import CompressPDF from "./categories/PDFTools/CompressPDF.jsx";
import ImageToPDF from "./categories/PDFTools/ImageToPDF.jsx";
import PDFReordering from "./categories/PDFTools/PDFreOrder.jsx";

// Maths Tools
import MatrixSolver from "./categories/Maths/MatrixSolver.jsx";
import GraphPlotter from "./categories/Maths/GraphPlotter.jsx";
import ScientificCalculator from "./categories/Maths/ScientificCalculator.jsx";
import ComplexNumberCalculator from "./categories/Maths/ComplexNumberCalculator.jsx";
import StatisticsProbabilityTool from "./categories/Maths/StatisticsProbabilityTool.jsx";

// Design Tools
import CssAnimations from "./categories/Design/CssAnimations.jsx";
import CssGrids from "./categories/Design/CssGrids.jsx";
import CssGradients from "./categories/Design/CssGradients.jsx";
import TypeWriter from "./categories/Design/TypeWriter.jsx";

// Dev Tools
import MarkdownHtmlConverter from "./categories/developer/MarkdownHtmlConverter.jsx";
import JSONFormatter from "./categories/developer/JSONFormatter.jsx";
import JsonCsvXml from "./categories/developer/JsonCsvXml.jsx";
import UtilityPage from "./pages/UtilityPage.jsx";
import { utilities, utilityRoutes } from "./routes.js";

// Contexts
export const SearchContext = createContext();
export const ThemeHistoryContext = createContext();
// New context for scroll position management
export const ScrollContext = createContext();

window.appRoutes = { utilities, utilityRoutes };

// Enhanced ScrollToTop component with page-specific behavior
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll position on route change
    window.scrollTo(0, 0);

    // Store current path in sessionStorage
    sessionStorage.setItem("lastPath", pathname);
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
  // For tracking whether we're coming back from a utility page
  const [isReturningFromUtility, setIsReturningFromUtility] = useState(false);

  useEffect(() => {
    window.appRoutes = { utilities, utilityRoutes };
  }, []);

  useEffect(() => {
    setPreviousTheme(theme);
  }, [theme]);

  // Reset scroll when hitting back button
  useEffect(() => {
    const handlePopState = () => {
      // Small delay to ensure the DOM has updated before scrolling
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, searchFocused, setSearchFocused }}
    >
      <ThemeHistoryContext.Provider value={{ previousTheme }}>
        <ScrollContext.Provider
          value={{ isReturningFromUtility, setIsReturningFromUtility }}
        >
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
                <Route
                  path="/utilities/json-csv-converter"
                  element={<JsonCsvXml theme={theme} />}
                />
                <Route
                  path="/utilities/password-generator"
                  element={<PasswordGenerator theme={theme} />}
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

                {/* Dev Tools */}

                <Route
                  path="/utilities/markdown-html-converter"
                  element={<MarkdownHtmlConverter theme={theme} />}
                />
              </Route>

              {/* Fallback for unmatched routes */}
              <Route path="*" element={<NotFound theme={theme} />} />
            </Routes>
          </Router>
        </ScrollContext.Provider>
      </ThemeHistoryContext.Provider>
    </SearchContext.Provider>
  );
};

export default App;
