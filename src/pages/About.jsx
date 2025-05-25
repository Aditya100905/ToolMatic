import { useTheme } from "../ThemeProvider";
import { motion } from "framer-motion";

const About = () => {
  const { theme } = useTheme();
  const navbarHeight = 72;

  return (
    <div
      className={`min-h-[calc(100vh-${navbarHeight}px)] py-20 px-6 md:px-10 mt-10 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0d0d0d] text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About <span className="text-primary">ToolMatic</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl leading-relaxed text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          ToolMatic combines the concepts of "tool" and "automatic" to provide a
          comprehensive suite of utilities designed to address technical
          challenges with precision and efficiency.
        </motion.p>

        <motion.p
          className="mt-6 text-base md:text-lg max-w-2xl mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Our platform offers a collection of professional-grade tools
          specifically engineered for software developers, technical
          professionals, and academic researchers. We provide essential
          utilities including <strong>Code Formatting</strong>,{" "}
          <strong>PDF Document Processing</strong>, and{" "}
          <strong>Unit Conversion Systems</strong>, all accessible through a
          sophisticated, streamlined interface.
        </motion.p>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Our Value Proposition
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-lg border border-opacity-20 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-xl font-medium mb-2">
                Performance Optimized
              </h3>
              <p className="text-base">
                Engineered for exceptional processing speed and computational
                efficiency
              </p>
            </div>

            <div className="p-6 rounded-lg border border-opacity-20 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="text-xl font-medium mb-2">Refined Interface</h3>
              <p className="text-base">
                Meticulously designed for professional clarity and operational
                intuitiveness
              </p>
            </div>

            <div className="p-6 rounded-lg border border-opacity-20 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">🌙</div>
              <h3 className="text-xl font-medium mb-2">Visual Adaptation</h3>
              <p className="text-base">
                Customizable display themes engineered for optimal viewing in
                any environment
              </p>
            </div>

            <div className="p-6 rounded-lg border border-opacity-20 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">📌</div>
              <h3 className="text-xl font-medium mb-2">Open Access</h3>
              <p className="text-base">
                Complimentary utilization with no advertisements, functional
                limitations, or financial requirements
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
