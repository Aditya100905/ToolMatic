import { useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeProvider"; // Import theme context

const Pdf_Utilities = [
  { name: "Merge PDFs", path: "/pdf-tools/merge" },
  { name: "Split PDF", path: "/pdf-tools/split" },
  { name: "PDFs to Images", path: "/pdf-tools/pdf-to-images" },
];

const PDF = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mt-16 p-6">
      <h2 className="text-2xl font-bold mb-4">PDF Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Pdf_Utilities.map((pdf_tools) => (
          <div
            key={pdf_tools.name}
            className={`p-6 rounded-lg shadow-md cursor-pointer transition-all ${
              theme === "dark"
                ? "bg-[#222] hover:bg-[#333] text-white"
                : "bg-white hover:bg-gray-200 text-black"
            }`}
            onClick={() => navigate(pdf_tools.path)}
          >
            <h3 className="text-xl font-semibold">{pdf_tools.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDF;
