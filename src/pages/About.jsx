import { useTheme } from "../ThemeProvider";

const About = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen mt-10 py-16 px-6 ${theme === "dark" ? "bg-[#121212] text-white" : "bg-gray-100 text-black"}`}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">About ToolMatic</h1>
        <p className="text-lg leading-relaxed">
          A blend of “tool” and “automatic,” suggesting a seamless, efficient
          experience for users to access a wide variety of utilities, enabling
          them to solve problems effortlessly. 
          <p>ToolMatic is a collection of
          essential tools designed for developers, engineers, and students. Our
          mission is to provide a seamless experience for formatting,
          converting, and analyzing data with minimal effort. Whether you need a
          **Code Formatter, PDF Tools, or Unit Converters**, we've got you
          covered!
          </p>
        </p>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Why Choose Us?</h2>
          <ul className="mt-3 space-y-2 text-lg">
            <li>🚀 **Fast & Efficient** - Optimized for quick processing</li>
            <li>🎨 **User-Friendly UI** - Simple and modern interface</li>
            <li>
              🌙 **Dark & Light Mode** - Adaptive themes for better
              accessibility
            </li>
            <li>📌 **100% Free** - No hidden costs, completely open to use</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
