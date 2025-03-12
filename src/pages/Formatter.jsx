import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeProvider"; // Import theme context

const formatters = [
  { name: "HTML Formatter", path: "/formatters/html" },
  { name: "CSS Formatter", path: "/formatters/css" },
  { name: "JS Formatter", path: "/formatters/js" },
  { name: "TS Formatter", path: "/formatters/ts" },
  // { name: "JSON Formatter", path: "/formatters/json" },
];

const Formatter = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mt-16 p-6">
      <h2 className="text-2xl font-bold mb-4">Code Formatters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formatters.map((formatter) => (
          <div
            key={formatter.name}
            className={`p-6 rounded-lg shadow-md cursor-pointer transition-all ${
              theme === "dark"
                ? "bg-[#222] hover:bg-[#333] text-white"
                : "bg-white hover:bg-gray-200 text-black"
            }`}
            onClick={() => navigate(formatter.path)}
          >
            <h3 className="text-xl font-semibold">{formatter.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Formatter;
