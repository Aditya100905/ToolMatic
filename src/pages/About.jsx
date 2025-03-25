import { useTheme } from "../ThemeProvider";

const About = () => {
  const { theme } = useTheme();
  const navbarHeight = 72; // Adjust this value based on your actual navbar height

  return (
    <div
      className={`min-h-[calc(100vh-${navbarHeight}px)] py-16 mt-10 px-6 ${
        theme === "dark" ? "bg-[#000] text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">About ToolMatic</h1>
        <p className="text-lg leading-relaxed">
          A blend of “tool” and “automatic,” suggesting a seamless, efficient
          experience for users to access a wide variety of utilities, enabling
          them to solve problems effortlessly.
        </p>
        <p className="mt-4">
          ToolMatic is a collection of essential tools designed for developers, engineers, and students. Our
          mission is to provide a seamless experience for formatting,
          converting, and analyzing data with minimal effort. Whether you need a
          <strong> Code Formatter, PDF Tools, or Unit Converters</strong>, we've got you covered!
        </p>
        
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Why Choose Us?</h2>
          <ul className="mt-3 space-y-2 text-lg">
            <li>🚀 <strong>Fast & Efficient</strong> - Optimized for quick processing</li>
            <li>🎨 <strong>User-Friendly UI</strong> - Simple and modern interface</li>
            <li>🌙 <strong>Dark & Light Mode</strong> - Adaptive themes for better accessibility</li>
            <li>📌 <strong>100% Free</strong> - No hidden costs, completely open to use</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
