import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeHistoryContext } from "../App";

export default function NotFound({ theme }) {
  const navigate = useNavigate();
  const { previousTheme } = useContext(ThemeHistoryContext);

  const currentTheme = previousTheme || theme;
  const isDarkMode = currentTheme === "dark";

  const baseButtonClasses =
    "px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-lg transform hover:scale-105";
  const primaryButtonClasses = isDarkMode
    ? "bg-blue-600 text-white hover:bg-blue-700"
    : "bg-blue-500 text-white hover:bg-blue-600";
  const secondaryButtonClasses = isDarkMode
    ? "bg-gray-700 text-white hover:bg-gray-800"
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-full ${
        isDarkMode ? "bg-black text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="w-full max-w-2xl px-4 py-16 text-center">
        <div
          className={`text-9xl font-bold mb-4 ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}
        >
          404
        </div>

        <h1 className="text-4xl font-extrabold mb-6">Page Not Found</h1>

        <p
          className={`text-xl mb-8 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or no longer exists.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/", { replace: true })} // <<< Important change here
            className={`${baseButtonClasses} ${primaryButtonClasses}`}
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/utilities", { replace: true })}
            className={`${baseButtonClasses} ${secondaryButtonClasses}`}
          >
            Explore Utilities
          </button>
        </div>
      </div>
    </div>
  );
}
