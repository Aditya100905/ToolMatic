import { useTheme } from "../ThemeProvider";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { Sun, Moon, Menu, X } from "lucide-react"; // Icons for theme & mobile menu
import toolmatic from './../assets/toolmatic[1].png'

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); // Get current route path

    // Function to check if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed top-0 w-full z-50 shadow-md ${theme === "dark" ? "bg-[#1a1a1a] text-white" : "bg-white text-black"} transition-all duration-300`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo - Navigates to Home */}
                <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-wide">
    <img src={toolmatic} alt="ToolMatic Logo" className="w-[40px] h-[40px]" />
    <span>ToolMatic</span>
</Link>


                {/* Desktop Navigation */}
                <ul className="hidden md:flex space-x-6 text-lg">
                    {[
                        { name: "Home", path: "/" },
                        { name: "Utilities", path: "/utilities" },
                        { name: "About", path: "/about" },
                        { name: "Contact", path: "/contact" },
                    ].map(({ name, path }) => (
                        <li key={name}>
                            <Link
                                to={path}
                                className={`relative transition-all ${isActive(path) ? "text-blue-500 font-semibold" : "hover:text-blue-500"}
                                    after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] 
                                    ${isActive(path) ? "after:bg-blue-500" : "after:bg-transparent"} after:transition-all after:duration-300`}
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Theme Toggle & Mobile Menu Button */}
                <div className="flex items-center space-x-4">
                    {/* Theme Toggle Button */}
                    <button onClick={toggleTheme} className="p-2 rounded-lg transition-all">
                        {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className={`md:hidden py-4 transition-all ${theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"} text-center`}>
                    <ul className="space-y-4 text-lg">
                        {[
                            { name: "Home", path: "/" },
                            { name: "Utilities", path: "/utilities" },
                            { name: "About", path: "/about" },
                            { name: "Contact", path: "/contact" },
                        ].map(({ name, path }) => (
                            <li key={name}>
                                <Link
                                    to={path}
                                    className={`block transition-all ${isActive(path) ? "text-blue-500 font-semibold underline" : "hover:text-blue-500"}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
