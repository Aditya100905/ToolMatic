import { useTheme } from "../ThemeProvider";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X, ChevronRight } from "lucide-react";
import toolmatic from './../assets/toolmatic[1].png';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Function to check if a link is active
    const isActive = (path) => location.pathname === path;
    
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
            if (isOpen && !e.target.closest('nav')) {
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

    const isDark = theme === "dark";
    
    return (
        <nav className={`fixed top-0 w-full z-50 ${
            scrolled ? "shadow-lg" : "shadow-md"
        } ${
            isDark 
                ? `bg-[#1a1a1a] ${scrolled ? "bg-opacity-95" : "bg-opacity-90"} text-white` 
                : `bg-white ${scrolled ? "bg-opacity-95" : "bg-opacity-90"} text-black`
        } backdrop-blur-sm transition-all duration-300`}>
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                {/* Logo - Navigates to Home */}
                <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-wide hover:opacity-90 transition-opacity duration-300">
                    <img 
                        src={toolmatic} 
                        alt="ToolMatic Logo" 
                        className="w-[40px] h-[40px]" 
                    />
                    <span>ToolMatic</span>
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex space-x-8 text-lg">
                    {[
                        { name: "Home", path: "/" },
                        { name: "Utilities", path: "/utilities" },
                        { name: "About", path: "/about" },
                        { name: "Contact", path: "/contact" },
                    ].map(({ name, path }) => (
                        <li key={name}>
                            <Link
                                to={path}
                                className={`relative px-3 py-2 transition-all duration-300 rounded-md ${
                                    isActive(path) 
                                        ? "text-blue-500 font-semibold" 
                                        : `hover:text-blue-500 ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`
                                } after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[3px] after:bg-blue-500
                                ${isActive(path) ? "after:w-full" : ""} hover:after:w-full
                                after:transition-all after:duration-300`}
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Theme Toggle & Mobile Menu Button */}
                <div className="flex items-center space-x-4">
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
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Enhanced Mobile Menu */}
            <div 
                className={`md:hidden overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 border-t border-b" : "max-h-0"
                } ${isDark 
                    ? "bg-[#222222] border-gray-800" 
                    : "bg-gray-50 border-gray-200"
                }`}
            >
                <div className="py-4 px-6">
                    {/* Menu Title */}
                    <div className={`mb-4 pb-2 ${isDark ? "border-gray-700" : "border-gray-200"} border-b text-center`}>
                        <span className="text-lg font-medium">Menu</span>
                    </div>
                    
                    {/* Navigation Links */}
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
                </div>
            </div>
        </nav>
    );
};

export default Navbar;