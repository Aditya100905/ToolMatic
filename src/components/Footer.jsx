import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#1a1a1a] text-white py-8">
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo or Brand Name */}
                <div className="text-2xl font-bold tracking-wide">
                    Utility Hub
                </div>

                {/* Footer Links */}
                <ul className="space-x-6 flex text-lg">
                    {[{ name: "Home", path: "/" }, { name: "Utilities", path: "/utilities" }, { name: "About", path: "/about" }, { name: "Contact", path: "/contact" }].map(
                        ({ name, path }) => (
                            <li key={name}>
                                <Link
                                    to={path}
                                    className="hover:text-blue-500 transition-all"
                                >
                                    {name}
                                </Link>
                            </li>
                        )
                    )}
                </ul>

                {/* Social Icons or Contact Info */}
                <div className="flex space-x-6 text-xl">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                        GitHub
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                        LinkedIn
                    </a>
                    <a href="mailto:contact@utilityhub.com" className="hover:text-blue-500">
                        Email
                    </a>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="text-center text-sm mt-4">
                &copy; {new Date().getFullYear()} Utility Hub. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
