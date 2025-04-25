// import { useTheme } from "../ThemeProvider";
// import { Link } from "react-router-dom";

// const categories = [
//     { name: "Code Formatters", path: "/formatters", description: "Format JavaScript, HTML, CSS, and JSON code." },
//     { name: "PDF Tools", path: "/pdf-tools", description: "Merge PDFs, PDFs to Images and more." },
//     { name: "Text Utilities", path: "/text", description: "Word Counter, Text CleanUp and more" },
//     { name: "Math Tools", path: "/math", description: "Calculate and solve engineering problems." },
//     { name: "Bases & Bitwise Operators", path: "/bases-and-bitwise", description: "Deals in numbers among different bases and their operations" },
//     { name: "Unit Converters", path: "/converters", description: "Convert different units among themselves including local traditional units" },
//     { name: "General Utilities", path: "/general", description: "General Utilities like QR handeling and url shortner" },
//     { name: "Designs", path: "/design", description: "Deigning Utilities like animations, grid and all" },
// ];

// const Utilities = () => {
//     const { theme } = useTheme(); // Get theme from context

//     return (
//         <div className={`min-h-screen mb-5 pt-24 px-6 ${theme === "dark" ? "bg-[#121212] text-white" : "bg-gray-50 text-black"} transition-all`}>
//             <h2 className="text-4xl font-bold text-center mb-12">Utility Categories</h2>

//             {/* Categories Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//                 {categories.map((category, index) => (
//                     <Link 
//                         to={category.path} 
//                         key={index} 
//                         className={`p-6 rounded-xl shadow-lg transition-all transform hover:scale-105 ${
//                             theme === "dark" ? "bg-[#1e1e1e] text-white" : "bg-white text-black"
//                         } hover:shadow-xl`}
//                     >
//                         <h3 className="text-2xl font-semibold">{category.name}</h3>
//                         <p className="text-sm opacity-75 mt-2">{category.description}</p>
//                     </Link>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Utilities;


import React from 'react'

const Utilities = () => {
  return (
    <div>
      
    </div>
  )
}

export default Utilities
