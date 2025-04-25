import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "./App"; // Import the SearchContext
import Navbar from "./components/Navbar"; // Import the Navbar component
import { utilities, utilityRoutes, utilityDescriptions } from "./routes.js"; // Corrected import

// Enhanced SVG Icons with animation properties
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-300 hover:scale-110"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-300 hover:scale-110"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// New icons for utility cards
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-300 group-hover:translate-x-1"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

// New Clock Icon for recently viewed
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// New Category Icon
const CategoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

// Search Icon
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mb-4 opacity-60"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const UtilityPage = ({ theme, customUtilities, customUtilityRoutes }) => {
  // Use provided props first, then imported utilities/routes, then window.appRoutes as fallback
  const availableUtilities =
    customUtilities ||
    utilities ||
    (window.appRoutes ? window.appRoutes.utilities : {});
  const availableUtilityRoutes =
    customUtilityRoutes ||
    utilityRoutes ||
    (window.appRoutes ? window.appRoutes.utilityRoutes : {});

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useContext(SearchContext); // Get search term from context
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm); // Local state to sync with context
  const [recentlyViewed, setRecentlyViewed] = useState(
    JSON.parse(localStorage.getItem("recentlyViewed")) || []
  );
  const [activeCategory, setActiveCategory] = useState("");
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  // Keep local search term in sync with context
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Add touch event listeners for drag-to-open sidebar
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      isDragging.current = touchStartX.current < 30; // Only start dragging if touch begins near left edge
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      touchEndX.current = e.touches[0].clientX;
      const distance = touchEndX.current - touchStartX.current;

      // If dragged more than 50px to the right, open sidebar
      if (distance > 50 && !sidebarOpen) {
        setSidebarOpen(true);
        isDragging.current = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    // Click outside to close sidebar
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    // Set initial active category based on scroll position
    updateActiveCategory();

    // Add scroll event listener to update active category
    window.addEventListener("scroll", updateActiveCategory);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", updateActiveCategory);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Update active category based on scroll position
  const updateActiveCategory = () => {
    const categories = Object.keys(availableUtilities);
    const scrollPosition = window.scrollY + 100; // Offset for navbar

    for (let i = categories.length - 1; i >= 0; i--) {
      const category = categories[i];
      const categoryId = `category-${category.replace(/\s+/g, "-").toLowerCase()}`;
      const element = document.getElementById(categoryId);

      if (element && element.offsetTop <= scrollPosition) {
        setActiveCategory(category);
        break;
      }
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleUtilitySelect = (utility) => {
    // Check if route exists
    if (!availableUtilityRoutes[utility]) {
      console.error(`No route found for utility: ${utility}`);
      return;
    }

    // Add to recently viewed
    const updatedRecent = [
      utility,
      ...recentlyViewed.filter((item) => item !== utility),
    ].slice(0, 5);
    setRecentlyViewed(updatedRecent);
    localStorage.setItem("recentlyViewed", JSON.stringify(updatedRecent));

    // Navigate to the utility
    navigate(availableUtilityRoutes[utility]);
  };

  // Handle search updates from navbar
  const handleSearchUpdate = (term) => {
    setLocalSearchTerm(term);
    setSearchTerm(term); // Update the context as well
  };

  // Filter utilities based on search term
  const getFilteredUtilities = () => {
    if (!localSearchTerm) {
      return availableUtilities; // Return all categories and utilities
    }

    // Filter utilities across all categories
    const filtered = {};

    Object.keys(availableUtilities).forEach((category) => {
      const matchingUtilities = availableUtilities[category].filter((utility) =>
        utility.toLowerCase().includes(localSearchTerm.toLowerCase())
      );

      if (matchingUtilities.length > 0) {
        filtered[category] = matchingUtilities;
      }
    });

    return filtered;
  };

  const filteredUtilities = getFilteredUtilities();

  // Scroll to category with offset for navbar
  const scrollToCategory = (categoryId, categoryName) => {
    const element = document.getElementById(categoryId);
    if (element) {
      // Add offset for the navbar (adjust the 80 value based on your navbar height)
      const navbarOffset = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveCategory(categoryName);
    }

    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // If no utilities data is available
  if (!availableUtilities || Object.keys(availableUtilities).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-5">
          <h2 className="text-2xl font-bold mb-4">Unable to load utilities</h2>
          <p>Please check your configuration and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-transparent via-transparent to-blue-50/10">
      {/* Navbar */}
      <Navbar onSearch={handleSearchUpdate} />

      {/* Sidebar - openable on all screen sizes */}
      <aside
        ref={sidebarRef}
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed z-20 w-72 h-screen pt-16 ${
          theme === "dark"
            ? "bg-[#1a1a1a] border-r border-gray-800"
            : "bg-white border-r border-gray-200"
        } shadow-xl transition-all duration-300 transform top-0 left-0 overflow-y-auto`}
      >
        <div className="p-6 pt-8">
          {/* Sidebar header with subtle animation */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Navigation</h2>
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-full transition-all duration-200 ${
                theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
              }`}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Recently viewed section */}
          {recentlyViewed.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <ClockIcon />
                <h3 className="text-sm uppercase tracking-wider opacity-70">
                  Recently Used
                </h3>
              </div>
              <div className="space-y-2 pl-2">
                {recentlyViewed.map((utility) => (
                  <div
                    key={`recent-${utility}`}
                    onClick={() => handleUtilitySelect(utility)}
                    className={`px-3 py-2 cursor-pointer rounded-md text-sm transition-all duration-200 flex items-center gap-2 ${
                      theme === "dark"
                        ? "hover:bg-gray-800 hover:text-blue-400"
                        : "hover:bg-gray-100 hover:text-blue-600"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {utility}
                  </div>
                ))}
              </div>
              <div className="h-px my-6 bg-gray-700 opacity-30"></div>
            </div>
          )}

          {/* Categories */}
          <div className="flex items-center gap-2 mb-4">
            <CategoryIcon />
            <h2 className="text-lg font-bold">Categories</h2>
          </div>
          <ul className="space-y-1 pl-2">
            {Object.keys(availableUtilities).map((category) => {
              const categoryId = `category-${category.replace(/\s+/g, "-").toLowerCase()}`;
              const isActive = activeCategory === category;
              return (
                <li
                  key={category}
                  onClick={() => scrollToCategory(categoryId, category)}
                  className={`px-3 py-2.5 cursor-pointer rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? theme === "dark"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-blue-100 text-blue-700"
                      : theme === "dark"
                        ? "hover:bg-gray-800 hover:text-blue-400"
                        : "hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-blue-500" : "bg-gray-400"}`}
                  ></span>
                  <div className="font-medium text-sm">{category}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main content - all utilities on single page */}
      <main
        className={`transition-all duration-300 ${sidebarOpen ? "sm:pl-72" : ""}`}
      >
        {/* Add proper spacing to account for fixed navbar */}
        <div className="container mx-auto p-4 pt-24 pb-16">
          {/* Display search results or all categories */}
          {localSearchTerm && (
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h2 className="text-lg font-medium">
                  Search results for:{" "}
                  <span className="text-blue-600 font-semibold">
                    {localSearchTerm}
                  </span>
                </h2>
              </div>
            </div>
          )}

          {Object.keys(filteredUtilities).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-b from-transparent to-gray-50 rounded-2xl shadow-sm border border-gray-100 p-8">
              <SearchIcon />
              <h3 className="text-xl font-medium mb-2">No utilities found</h3>
              <p className="text-center opacity-70 max-w-md">
                We couldn't find any utilities matching "{localSearchTerm}". Try
                a different search term or browse our categories.
              </p>
              <button
                onClick={() => handleSearchUpdate("")}
                className={`mt-6 px-4 py-2 rounded-lg font-medium ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                } transition-all duration-200`}
              >
                Clear Search
              </button>
            </div>
          ) : (
            Object.keys(filteredUtilities).map((category) => {
              const categoryId = `category-${category.replace(/\s+/g, "-").toLowerCase()}`;

              return (
                <div
                  key={category}
                  id={categoryId}
                  className="mb-16 scroll-mt-24 animate-fadeIn"
                >
                  {/* Category Title */}
                  <div className="mb-8 mx-auto w-full">
                    <h2 className="text-2xl md:text-3xl font-bold relative inline-block pb-2 transform -translate-x-1/2 left-1/2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:rounded-full">
                      {category}
                      <span className="ml-3 inline-flex items-center justify-center bg-blue-100 text-blue-800 text-sm font-medium rounded-full h-6 px-3">
                        {filteredUtilities[category].length}
                      </span>
                    </h2>
                  </div>

                  {/* Utilities Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUtilities[category].map((utility) => (
                      <div
                        key={utility}
                        onClick={() => handleUtilitySelect(utility)}
                        className={`relative overflow-hidden rounded-xl cursor-pointer group transition-all duration-300
                          ${
                            theme === "dark"
                              ? "bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700"
                              : "bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-white"
                          }
                          shadow-md hover:shadow-lg border
                          ${
                            theme === "dark"
                              ? "border-gray-700 hover:border-blue-900"
                              : "border-gray-200 hover:border-blue-200"
                          }
                          transform hover:-translate-y-1`}
                      >
                        {/* Hover Ripple */}
                        <div className="absolute inset-0 w-full h-full bg-blue-500/10 scale-0 rounded-full group-hover:scale-150 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>

                        {/* Card Content */}
                        <div className="p-6 h-full flex flex-col justify-between z-10 relative">
                          <div>
                            {/* Title */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <h3
                                className={`text-lg font-semibold transition-colors duration-200 ${
                                  theme === "dark"
                                    ? "text-gray-100 group-hover:text-blue-300"
                                    : "text-gray-800 group-hover:text-blue-600"
                                }`}
                              >
                                {utility}
                              </h3>
                            </div>
                            {/* Description */}
                            <p
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {utilityDescriptions[utility] ||
                                "No description available."}
                            </p>
                          </div>

                          {/* Icon */}
                          <div
                            className={`mt-5 flex justify-end items-center ${
                              theme === "dark"
                                ? "text-blue-400"
                                : "text-blue-600"
                            }`}
                          >
                            <div
                              className={`p-2 rounded-full transition-all duration-300 ${
                                theme === "dark"
                                  ? "bg-blue-900/30 group-hover:bg-blue-800/50"
                                  : "bg-blue-100 group-hover:bg-blue-200"
                              }`}
                            >
                              <ArrowRightIcon />
                            </div>
                          </div>
                        </div>

                        {/* Background Glow */}
                        <div
                          className={`absolute -bottom-2 -right-2 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${
                            theme === "dark" ? "bg-blue-500" : "bg-blue-300"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Mobile sidebar toggle button - floating with pulse animation */}
      <button
        onClick={toggleSidebar}
        className={`fixed z-30 bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none ${
          theme === "dark"
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        } animate-pulse-subtle`}
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur z-10 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

// Add necessary CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulseSubtle {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
  
  .animate-pulse-subtle {
    animation: pulseSubtle 2s infinite;
  }
`;
document.head.appendChild(style);

export default UtilityPage;
