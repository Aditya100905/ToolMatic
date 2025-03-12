import { useTheme } from "../ThemeProvider";
import { Link } from "react-router-dom";

const categories = [
    { name: "Code Formatter", path: "/utilities/formatter", description: "Format JavaScript, TypeScript, HTML, CSS, and JSON code." },
    { name: "PDF Tools", path: "/utilities/pdf-tools", description: "Convert Word to PDF, merge PDFs, and more." },
    { name: "Text Utilities", path: "/utilities/text", description: "Format, convert, and manipulate text easily." },
    { name: "Code Utilities", path: "/utilities/code", description: "Beautify, minify, and format code snippets." },
    { name: "File Converters", path: "/utilities/converters", description: "Convert files between different formats." },
    { name: "Math Tools", path: "/utilities/math", description: "Calculate and solve engineering problems." },
    { name: "Drawing & Diagrams", path: "/utilities/drawing", description: "Create diagrams, flowcharts, and sketches." },
];

const Utilities = () => {
    const { theme } = useTheme(); // Get theme from context

    return (
        <div className={`min-h-screen pt-24 px-6 ${theme === "dark" ? "bg-[#121212] text-white" : "bg-gray-50 text-black"} transition-all`}>
            <h2 className="text-4xl font-bold text-center mb-12">Utility Categories</h2>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {categories.map((category, index) => (
                    <Link 
                        to={category.path} 
                        key={index} 
                        className={`p-6 rounded-xl shadow-lg transition-all transform hover:scale-105 ${
                            theme === "dark" ? "bg-[#1e1e1e] text-white" : "bg-white text-black"
                        } hover:shadow-xl`}
                    >
                        <h3 className="text-2xl font-semibold">{category.name}</h3>
                        <p className="text-sm opacity-75 mt-2">{category.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Utilities;
