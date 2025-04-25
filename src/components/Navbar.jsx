import { useTheme } from "../ThemeProvider";
import { useState, useEffect, useContext, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X, ChevronRight, Search } from "lucide-react";
import toolmatic from './../assets/toolmatic[1].png';
import { SearchContext } from "../App";

const Navbar = ({ onSearch }) => {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Access search context
    const { searchTerm, setSearchTerm, searchFocused, setSearchFocused } = useContext(SearchContext);

    // Function to check if a link is active
    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };
    
    // Check if we should show search on current route - ONLY for utilities page
    const shouldShowSearch = () => {
        return location.pathname.startsWith("/utilities");
    };
    
    // Add scroll event listener to create a scrolled effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && !e.target.closest('.mobile-menu-container')) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Handle search submission
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        if (searchTerm.trim()) {
            // Only search in utilities page
            if (location.pathname.startsWith('/utilities')) {
                if (onSearch) {
                    onSearch(searchTerm);
                }
            } else {
                // Navigate to utilities if not already there
                navigate('/utilities');
                setTimeout(() => {
                    if (onSearch) {
                        onSearch(searchTerm);
                    }
                }, 100);
            }
        }
    };

    // Handle keyboard shortcut
    const handleKeyboardShortcut = useCallback((e) => {
        // Ctrl+K or Cmd+K to focus search - only when on utilities page
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            
            // If not on utilities page, navigate there
            if (!shouldShowSearch()) {
                navigate('/utilities');
                setTimeout(() => {
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) {
                        searchInput.focus();
                        setSearchFocused(true);
                    }
                }, 100);
            } else {
                // Already on utilities page, just focus the search
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.focus();
                    setSearchFocused(true);
                }
            }
        }
        
        // Escape to blur search
        if (e.key === 'Escape' && searchFocused) {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.blur();
                setSearchFocused(false);
            }
        }
    }, [navigate, searchFocused, setSearchFocused, shouldShowSearch]);

    // Add keyboard shortcut listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyboardShortcut);
        return () => {
            window.removeEventListener('keydown', handleKeyboardShortcut);
        };
    }, [handleKeyboardShortcut]);

    // Toggle search bar in mobile view
    const toggleSearchBar = () => {
        setShowSearchBar(!showSearchBar);
    };

    const isDark = theme === "dark";
    const isSearchVisible = shouldShowSearch();
    
    // Update search term and notify utility page component
    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        
        // Only pass search to utility component
        if (location.pathname.startsWith('/utilities') && onSearch) {
            onSearch(newSearchTerm);
        }
    };
    
    return (
        <nav className={`fixed top-0 w-full z-50 ${
            scrolled ? "shadow-lg" : "shadow-md"
        } ${
            isDark 
                ? `bg-[#1a1a1a] ${scrolled ? "bg-opacity-95" : "bg-opacity-90"} text-white` 
                : `bg-white ${scrolled ? "bg-opacity-95" : "bg-opacity-90"} text-black`
        } backdrop-blur-sm transition-all duration-300`}>
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3 text-2xl font-bold tracking-wide hover:opacity-90 transition-all duration-300 group">
                    <div className="relative overflow-hidden rounded-full p-1 group-hover:shadow-md transition-all duration-300">
                        <img 
                            src={toolmatic} 
                            alt="ToolMatic Logo" 
                            className="w-[40px] h-[40px] group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className={`absolute inset-0 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-400'} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    </div>
                    <span className="hidden sm:inline relative">
                        ToolMatic
                        <span className={`absolute -bottom-1 left-0 w-0 h-[2px] ${isDark ? 'bg-blue-400' : 'bg-blue-500'} group-hover:w-full transition-all duration-500`}></span>
                    </span>
                </Link>

                {/* Navigation Links - Always in the same position with consistent spacing */}
                <div className="hidden md:flex flex-grow justify-center">
                    <ul className="flex space-x-8 text-lg">
                        {[
                            { name: "Home", path: "/" },
                            { name: "Utilities", path: "/utilities" },
                            { name: "About", path: "/about" },
                            { name: "Contact", path: "/contact" },
                        ].map(({ name, path }) => (
                            <li key={name}>
                                <Link
                                    to={path}
                                    className={`relative px-3 py-2 transition-all duration-300 rounded-md group ${
                                        isActive(path) 
                                            ? `text-blue-500 font-semibold` 
                                            : `hover:text-blue-500 ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`
                                    }`}
                                >
                                    <span className="relative z-10">{name}</span>
                                    <span className={`absolute bottom-0 left-0 w-full h-[3px] rounded-full transform origin-left ${
                                        isActive(path) 
                                            ? `scale-x-100 ${isDark ? 'bg-blue-500' : 'bg-blue-500'}` 
                                            : `scale-x-0 ${isDark ? 'bg-blue-400' : 'bg-blue-500'} group-hover:scale-x-100`
                                    } transition-transform duration-300 ease-out`}></span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right side container - Search (utilities only) & theme toggle */}
                <div className="flex items-center space-x-4">
                    {/* Search Bar - Desktop (Only for utilities page) */}
                    {isSearchVisible && (
                        <div className="hidden md:block relative">
                            <form onSubmit={handleSearchSubmit} className="group">
                                <input
                                    id="search-input"
                                    type="text"
                                    placeholder="Search utilities... (Ctrl+K)"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    className={`w-60 py-2 px-4 pr-10 rounded-full border ${
                                        isDark 
                                            ? "bg-gray-800 border-gray-700 text-white focus:bg-gray-700" 
                                            : "bg-gray-100 border-gray-200 text-gray-800 focus:bg-white"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 group-hover:ring-1 group-hover:ring-blue-400 transition-all duration-300`}
                                />
                                <button 
                                    type="submit" 
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                                        isDark ? "hover:bg-gray-700 text-blue-400" : "hover:bg-gray-200 text-blue-500"
                                    } transition-colors duration-300`}
                                >
                                    <Search size={18} />
                                </button>
                                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                                    <kbd className={`px-2 py-1 text-xs rounded ${
                                        isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                                    }`}>
                                        Ctrl+K
                                    </kbd>
                                </div>
                            </form>
                        </div>
                    )}
                    
                    {/* Spacer to maintain consistent layout */}
                    <div className="ml-2 md:ml-6"></div>
                    
                    {/* Search Toggle - Mobile (Only for utilities page) */}
                    {isSearchVisible && (
                        <button 
                            onClick={toggleSearchBar} 
                            className={`md:hidden p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                isDark 
                                    ? "bg-gray-800 hover:bg-gray-700 hover:ring-2 hover:ring-gray-600" 
                                    : "bg-gray-100 hover:bg-gray-200 hover:ring-2 hover:ring-gray-300"
                            }`}
                            aria-label="Toggle search"
                        >
                            <Search size={20} className={isDark ? "text-blue-400" : "text-blue-500"} />
                        </button>
                    )}
                    
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={toggleTheme} 
                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                            isDark 
                                ? "bg-gray-800 hover:bg-gray-700 hover:ring-2 hover:ring-gray-600" 
                                : "bg-gray-100 hover:bg-gray-200 hover:ring-2 hover:ring-gray-300"
                        }`}
                        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                    >
                        {isDark ? (
                            <Sun size={20} className="text-yellow-300" />
                        ) : (
                            <Moon size={20} className="text-blue-500" />
                        )}
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className={`md:hidden p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                            isDark 
                                ? "bg-gray-800 hover:bg-gray-700 hover:ring-2 hover:ring-gray-600" 
                                : "bg-gray-100 hover:bg-gray-200 hover:ring-2 hover:ring-gray-300"
                        }`}
                        aria-label="Toggle mobile menu"
                    >
                        {isOpen ? <X size={20} className={isDark ? "text-red-400" : "text-red-500"} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar - Only for utilities page */}
            {isSearchVisible && (
                <div 
                    className={`md:hidden transition-all duration-300 ${
                        showSearchBar ? "py-3 border-t" : "max-h-0 py-0 overflow-hidden opacity-0"
                    } ${isDark 
                        ? "bg-[#222222] border-gray-800" 
                        : "bg-gray-50 border-gray-200"
                    }`}
                >
                    <div className="px-6">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                id="search-input-mobile"
                                type="text"
                                placeholder="Search utilities..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className={`w-full py-2 px-4 pr-10 rounded-full border ${
                                    isDark 
                                        ? "bg-gray-800 border-gray-700 text-white focus:bg-gray-700" 
                                        : "bg-gray-100 border-gray-200 text-gray-800 focus:bg-white"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                                autoFocus={showSearchBar}
                            />
                            <button 
                                type="submit" 
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                                    isDark ? "hover:bg-gray-700 text-blue-400" : "hover:bg-gray-200 text-blue-500"
                                }`}
                            >
                                <Search size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            <div 
                className={`mobile-menu-container md:hidden transition-all duration-300 ${
                    isOpen ? "max-h-[100vh] border-t border-b opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                } ${isDark 
                    ? "bg-[#222222] border-gray-800" 
                    : "bg-gray-50 border-gray-200"
                }`}
            >
                <div className="py-4 px-6">
                    {/* Menu Title */}
                    <div className={`mb-4 pb-2 ${isDark ? "border-gray-700" : "border-gray-200"} border-b text-center`}>
                        <span className="text-lg font-medium flex items-center justify-center">
                            <span className={isDark ? "text-blue-400" : "text-blue-500"}>Navigation</span>
                        </span>
                    </div>
                    
                    {/* Navigation Links - Same order as desktop */}
                    <ul className="space-y-2">
                        {[
                            { name: "Home", path: "/" },
                            { name: "Utilities", path: "/utilities" },
                            { name: "About", path: "/about" },
                            { name: "Contact", path: "/contact" },
                        ].map(({ name, path }) => (
                            <li key={name}>
                                <Link
                                    to={path}
                                    className={`flex items-center justify-between py-3 px-4 rounded-md transition-all duration-300 ${
                                        isActive(path) 
                                            ? `${isDark ? "bg-blue-900 bg-opacity-30" : "bg-blue-50"} text-blue-500 font-semibold` 
                                            : `hover:translate-x-1 ${
                                                isDark 
                                                    ? "hover:bg-gray-800 active:bg-gray-700" 
                                                    : "hover:bg-gray-100 active:bg-gray-200"
                                              } hover:text-blue-500`
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span>{name}</span>
                                    <ChevronRight size={16} className={`transition-transform ${isActive(path) ? "text-blue-500" : ""}`} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    
                    {/* Bottom Section */}
                    <div className={`mt-6 pt-4 ${isDark ? "border-gray-700" : "border-gray-200"} border-t flex justify-center`}>
                        <div className="text-sm text-center">
                            <span className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                Theme: {isDark ? "Dark Mode" : "Light Mode"}
                            </span>
                        </div>
                    </div>
                    
                    {/* Keyboard Shortcuts Info */}
                    {isSearchVisible && (
                        <div className="mt-4 text-center">
                            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                Press <kbd className={`px-1.5 py-0.5 rounded ${
                                    isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                                }`}>Ctrl+K</kbd> to search
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;