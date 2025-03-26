import { useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeProvider"; // Import theme context

const Converting = [
  { name: "Length Unit Converter", path: "/converters/length-converter" },
  { name: "Mass Unit Converter", path: "/converters/mass-converter" },
  { name: "Temperature Unit Converter", path: "/converters/temperature-converter" },
  { name: "Time Unit Converter", path: "/converters/time-converter" },
  { name: "Frequency Unit Converter", path: "/converters/frequency-converter" },
  { name: "Area Unit Converter", path: "/converters/area-converter" },
  { name: "Volume Unit Converter", path: "/converters/volume-converter" },
  { name: "Density Unit Converter", path: "/converters/density-converter" },
  { name: "Energy Unit Converter", path: "/converters/energy-converter" },
  { name: "Power Unit Converter", path: "/converters/power-converter" },
  { name: "Speed Unit Converter", path: "/converters/speed-converter" },
];

const Converters = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mt-16 p-6">
      <h2 className="text-2xl font-bold mb-4">Unit Converter</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Converting.map((converted) => (
          <div
            key={converted.name}
            className={`p-6 rounded-lg shadow-md cursor-pointer transition-all ${
              theme === "dark"
                ? "bg-[#222] hover:bg-[#333] text-white"
                : "bg-white hover:bg-gray-200 text-black"
            }`}
            onClick={() => navigate(converted.path)}
          >
            <h3 className="text-xl font-semibold">{converted.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Converters;
