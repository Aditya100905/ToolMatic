import { Link } from "react-router-dom";

const Formatter = () => {
    return (
        <div className="p-6 min-h-screen bg-gray-100 text-black">
            <h2 className="text-2xl font-bold mb-4">Code Formatters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link to="/formatter/html" className="p-4 bg-white shadow-md rounded-lg hover:bg-gray-200">
                    HTML Formatter
                </Link>
                <Link to="/formatter/css" className="p-4 bg-white shadow-md rounded-lg hover:bg-gray-200">
                    CSS Formatter
                </Link>
                <Link to="/formatter/js" className="p-4 bg-white shadow-md rounded-lg hover:bg-gray-200">
                    JavaScript Formatter
                </Link>
                <Link to="/formatter/ts" className="p-4 bg-white shadow-md rounded-lg hover:bg-gray-200">
                    TypeScript Formatter
                </Link>
                <Link to="/formatter/json" className="p-4 bg-white shadow-md rounded-lg hover:bg-gray-200">
                    JSON Formatter
                </Link>
            </div>
        </div>
    );
};

export default Formatter;
