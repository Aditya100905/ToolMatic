import { useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeProvider"; // Import theme context

const text = [
  { name: "Word Counter", path: "/text/word-counter" },
  { name: "Text Case Converter", path: "/text/case-converter" },
  { name: "Text Clean Up", path: "/text/text-cleaning" },
];

const Text = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mt-16 p-6">
      <h2 className="text-2xl font-bold mb-4">Text Utilities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {text.map((text) => (
          <div
            key={text.name}
            className={`p-6 rounded-lg shadow-md cursor-pointer transition-all ${
              theme === "dark"
                ? "bg-[#222] hover:bg-[#333] text-white"
                : "bg-white hover:bg-gray-200 text-black"
            }`}
            onClick={() => navigate(text.path)}
          >
            <h3 className="text-xl font-semibold">{text.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Text;
