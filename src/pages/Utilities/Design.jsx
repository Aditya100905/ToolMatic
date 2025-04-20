import { useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeProvider"; // Import theme context

const designing = [
  { name: "Animations Library", path: "/design/animations" },
];

const designs = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mt-16 p-6">
      <h2 className="text-2xl font-bold mb-4">Designing Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designing.map((designs) => (
          <div
            key={designs.name}
            className={`p-6 rounded-lg shadow-md cursor-pointer transition-all ${
              theme === "dark"
                ? "bg-[#222] hover:bg-[#333] text-white"
                : "bg-white hover:bg-gray-200 text-black"
            }`}
            onClick={() => navigate(designs.path)}
          >
            <h3 className="text-xl font-semibold">{designs.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default designs;
