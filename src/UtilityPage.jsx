import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "./App"; // Import the SearchContext
import Navbar from "./components/Navbar"; // Import the Navbar component
import { utilities, utilityRoutes } from "./routes.js"; // Import utilities and utilityRoutes

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
    "PDF Tools": (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path>
        <polyline points="14 2 14 7 19 7"></polyline>
        <path d="M2 15h10"></path>
        <path d="M9 18l3-3-3-3"></path>
      </svg>
    ),
    "Advanced Mathematics": (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    ),
    "General Utilities": (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
    ),
    Design: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
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

const UtilityPage = ({ theme, customUtilities, customUtilityRoutes }) => {
  // Use provided props first, then imported utilities/routes, then window.appRoutes as fallback
  const availableUtilities = customUtilities || utilities || (window.appRoutes ? window.appRoutes.utilities : {});
  const availableUtilityRoutes = customUtilityRoutes || utilityRoutes || (window.appRoutes ? window.appRoutes.utilityRoutes : {});
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);  // Get search term from context
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);  // Local state to sync with context
  const [recentlyViewed, setRecentlyViewed] = useState(
    JSON.parse(localStorage.getItem("recentlyViewed")) || []
  );
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
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

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
    const updatedRecent = [utility, ...recentlyViewed.filter(item => item !== utility)].slice(0, 5);
    setRecentlyViewed(updatedRecent);
    localStorage.setItem("recentlyViewed", JSON.stringify(updatedRecent));
    
    // Navigate to the utility
    navigate(availableUtilityRoutes[utility]);
  };

  // Handle search updates from navbar
  const handleSearchUpdate = (term) => {
    setLocalSearchTerm(term);
  };

  // Filter utilities based on search term
  const getFilteredUtilities = () => {
    if (!localSearchTerm) {
      return availableUtilities; // Return all categories and utilities
    }
    
    // Filter utilities across all categories
    const filtered = {};
    
    Object.keys(availableUtilities).forEach(category => {
      const matchingUtilities = availableUtilities[category].filter(utility => 
        utility.toLowerCase().includes(localSearchTerm.toLowerCase())
      );
      
      if (matchingUtilities.length > 0) {
        filtered[category] = matchingUtilities;
      }
    });
    
    return filtered;
  };

  const filteredUtilities = getFilteredUtilities();

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
    <div className="relative min-h-screen">
      {/* Integrate Navbar but hide its search functionality */}
      <Navbar onSearch={handleSearchUpdate} />

      {/* Sidebar - openable on all screen sizes */}
      <aside
        ref={sidebarRef}
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed z-20 w-72 h-screen pt-16 ${
          theme === "dark" ? "bg-[#1a1a1a] border-r border-gray-800" : "bg-white border-r border-gray-200"
        } shadow-xl transition-all duration-300 transform top-0 left-0 overflow-y-auto`}
      >
        <div className="p-6 pt-8">          
          {/* Recently viewed section */}
          {recentlyViewed.length > 0 && (
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
            {Object.keys(availableUtilities).map((category) => (
              <li
                key={category}
                onClick={() => {
                  // Scroll to category section
                  document.getElementById(`category-${category.replace(/\s+/g, '-').toLowerCase()}`).scrollIntoView({
                    behavior: 'smooth'
                  });
                  
                  // Close sidebar on mobile
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`px-3 md:px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 flex items-center gap-2 md:gap-3 ${
                  theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                <span className="opacity-80">
                  <CategoryIcon category={category} />
                </span>
                <div className="font-medium text-sm md:text-base">{category}</div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main content - all utilities on single page */}
      <main className={`transition-all duration-300 pt-16 ${sidebarOpen ? 'md:pl-72' : ''}`}>
        <div className="container mx-auto p-4 pt-8">
          {/* Display search results or all categories */}
          {localSearchTerm && (
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold">
                Search results for: <span className="text-blue-500">{localSearchTerm}</span>
              </h2>
            </div>
          )}

          {Object.keys(filteredUtilities).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-60">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <h3 className="text-xl font-medium mb-2">No utilities found</h3>
              <p className="text-center opacity-70 max-w-md">
                We couldn't find any utilities matching "{localSearchTerm}". Try a different search term or browse our categories.
              </p>
            </div>
          ) : (
            Object.keys(filteredUtilities).map((category) => (
              <div 
                key={category} 
                id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                className="mb-16"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold relative inline-flex items-center">
                    <span className="opacity-80 mr-3">
                      <CategoryIcon category={category} />
                    </span>
                    {category}
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 opacity-30 rounded-full transform translate-y-2"></span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredUtilities[category].map((utility) => (
                    <div
                      key={utility}
                      onClick={() => handleUtilitySelect(utility)}
                      className={`p-5 rounded-xl cursor-pointer group transition-all duration-300 h-full flex flex-col justify-between border ${
                        theme === "dark"
                          ? "bg-[#1a1a1a] hover:bg-[#242424] border-gray-800 hover:border-gray-700 hover:shadow-lg"
                          : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div>
                        <h3 className="text-lg font-medium mb-2">{utility}</h3>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          {/* This would be an actual description in a real application */}
                          {`A utility for working with ${utility.toLowerCase()}`}
                        </p>
                      </div>
                      <div className={`mt-4 flex justify-end ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                        <ArrowRightIcon />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Mobile sidebar toggle button - moved to bottom right */}
      <button
        onClick={toggleSidebar}
        className={`fixed z-30 bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none ${
          theme === "dark"
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-white hover:bg-gray-100 text-gray-800"
        }`}
      >
        {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default UtilityPage;