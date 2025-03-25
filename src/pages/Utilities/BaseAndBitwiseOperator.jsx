import { useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeProvider"; // Import theme context

const BaseBitwise = [
  { name: "Base Converter", path: "/bases-and-bitwise/base-converter" },
  { name: "Bitwise Operators", path: "/bases-and-bitwise/bitwise-operators" },
  // { name: "JSON Formatter", path: "/formatters/json" },
];

const BaseAndBitwiseOperator = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mt-16 p-6">
      <h2 className="text-2xl font-bold mb-4">Bases & Bitwise Operations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BaseBitwise.map((Base_And_Bitwise_Operator) => (
          <div
            key={Base_And_Bitwise_Operator.name}
            className={`p-6 rounded-lg shadow-md cursor-pointer transition-all ${
              theme === "dark"
                ? "bg-[#222] hover:bg-[#333] text-white"
                : "bg-white hover:bg-gray-200 text-black"
            }`}
            onClick={() => navigate(Base_And_Bitwise_Operator.path)}
          >
            <h3 className="text-xl font-semibold">{Base_And_Bitwise_Operator.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseAndBitwiseOperator;
