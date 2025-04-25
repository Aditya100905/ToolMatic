import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { utilities } from '../routes.js';
import { Layers, FileText, Type, Percent, Palette, Settings2Icon, Lock, DollarSign, Moon, Folder } from 'lucide-react';

const Home = ({ theme }) => {
  const [mostPopular, setMostPopular] = useState([]);
  const [heroVisible, setHeroVisible] = useState(false);
  
  // Simulate fetching popular tools
  useEffect(() => {
    const popular = [
      { name: "JSON Formatter", path: "/general/json-formatter", category: "Formatters" },
      { name: "PDF Merge", path: "/pdf-tools/merge", category: "PDF Tools" },
      { name: "Text Cleaner", path: "/general/text-cleaner", category: "Text" },
      { name: "QR Generator", path: "/general/qr-generator", category: "General" },
      { name: "Matrix Calculator", path: "/math/matrix-calculator", category: "Math" },
      { name: "CSS Gradients", path: "/design/gradients", category: "Design" },
    ];
    
    setMostPopular(popular);
    
    // Animate hero section entrance
    setTimeout(() => {
      setHeroVisible(true);
    }, 100);
  }, []);
  
  // Get category showcase items
  const getCategoryShowcase = () => {
    const showcase = {};
    
    Object.keys(utilities).forEach(category => {
      const categoryUtils = [...utilities[category]];
      const selected = [];
      
      for (let i = 0; i < Math.min(3, categoryUtils.length); i++) {
        const randomIndex = Math.floor(Math.random() * categoryUtils.length);
        selected.push(categoryUtils[randomIndex]);
        categoryUtils.splice(randomIndex, 1);
      }
      
      showcase[category] = selected;
    });
    
    return showcase;
  };
  
  const showcaseItems = getCategoryShowcase();
  
  // Icons for tools and categories
  const getIcon = (name) => {
    switch(name) {
      case "JSON Formatter":
      case "PDF Merge":
      case "PDF Tools": return <FileText size={20} />;
      case "Text Cleaner":
      case "Text": return <Type size={20} />;
      case "Math":
      case "Matrix Calculator": return <Percent size={20} />;
      case "Design":
      case "CSS Gradients": return <Palette size={20} />;
      case "General":
      case "QR Generator": return <Settings2Icon size={20} />;
      default: return <Folder size={20} />;
    }
  };

  return (
    <div className="min-h-screen mt-10">
      {/* Hero Section with floating elements */}
      <section className={`py-16 px-4 transition-opacity duration-700 overflow-hidden relative ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto max-w-6xl">
          <div className={`rounded-2xl shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800/70 backdrop-blur' : 'bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur'}`}>
            <div className="py-16 px-8 md:px-12 flex flex-col md:flex-row items-center relative">
              {/* Floating circles background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-20 left-10 w-32 h-32 rounded-full ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-200/30'} blur-xl`}></div>
                <div className={`absolute bottom-10 right-20 w-40 h-40 rounded-full ${theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-200/30'} blur-xl`}></div>
                <div className={`absolute top-40 right-40 w-24 h-24 rounded-full ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-200/30'} blur-xl`}></div>
              </div>

              <div className="md:w-1/2 mb-12 md:mb-0 z-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">ToolMatic</span>
                  <br/>
                  <span className="text-3xl md:text-4xl">Your Ultimate Utility Hub</span>
                </h1>
                <p className="text-base md:text-lg opacity-80 mb-8 max-w-md">
                  Access dozens of powerful online tools to boost your productivity. From PDF manipulation to data formatting, all in one place.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/utilities" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 transform transition hover:-translate-y-1">
                    Explore Tools
                  </Link>
                  <Link to="/about" className={`px-8 py-3 rounded-lg font-medium transition transform hover:-translate-y-1 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg shadow-gray-900/30' : 'bg-white hover:bg-gray-100 text-gray-800 shadow-lg shadow-gray-200/50'}`}>
                    Learn More
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2 flex justify-center relative z-10">
                {/* SVG Illustration replacing the code window */}
                <svg className="w-full max-w-md" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
                  {/* Background */}
                  <rect x="50" y="50" width="400" height="300" rx="20" ry="20" fill={theme === 'dark' ? '#374151' : '#f9fafb'} stroke={theme === 'dark' ? '#4B5563' : '#e5e7eb'} strokeWidth="2" />
                  
                  {/* Tools Icons */}
                  <g className="tools-group">
                    {/* PDF Tools */}
                    <circle cx="150" cy="110" r="40" fill={theme === 'dark' ? '#1E3A8A' : '#DBEAFE'} />
                    <rect x="135" y="95" width="30" height="40" rx="3" fill={theme === 'dark' ? '#60A5FA' : '#2563EB'} />
                    <text x="150" y="165" textAnchor="middle" fill={theme === 'dark' ? '#E5E7EB' : '#1F2937'} fontSize="14" fontWeight="bold">PDF Tools</text>
                    
                    {/* Text Operations */}
                    <circle cx="250" cy="110" r="40" fill={theme === 'dark' ? '#065F46' : '#D1FAE5'} />
                    <text x="250" y="105" textAnchor="middle" fill={theme === 'dark' ? '#34D399' : '#047857'} fontSize="24" fontWeight="bold">T</text>
                    <text x="250" y="165" textAnchor="middle" fill={theme === 'dark' ? '#E5E7EB' : '#1F2937'} fontSize="14" fontWeight="bold">Text Operations</text>
                    
                    {/* Math Calculators */}
                    <circle cx="350" cy="110" r="40" fill={theme === 'dark' ? '#7E1F86' : '#F3E8FF'} />
                    <text x="350" y="115" textAnchor="middle" fill={theme === 'dark' ? '#D8B4FE' : '#7E22CE'} fontSize="20" fontWeight="bold">&Sigma;</text>
                    <text x="350" y="165" textAnchor="middle" fill={theme === 'dark' ? '#E5E7EB' : '#1F2937'} fontSize="14" fontWeight="bold">Math Calculators</text>
                    
                    {/* Design Helpers */}
                    <circle cx="150" cy="250" r="40" fill={theme === 'dark' ? '#9D174D' : '#FCE7F3'} />
                    <rect x="135" y="235" width="30" height="30" rx="3" fill={theme === 'dark' ? '#F472B6' : '#DB2777'} />
                    <text x="150" y="305" textAnchor="middle" fill={theme === 'dark' ? '#E5E7EB' : '#1F2937'} fontSize="14" fontWeight="bold">Design Helpers</text>
                    
                    {/* Data Formatters */}
                    <circle cx="250" cy="250" r="40" fill={theme === 'dark' ? '#78350F' : '#FEF3C7'} />
                    <path d="M235,250 L265,250 M235,240 L265,240 M235,260 L265,260" stroke={theme === 'dark' ? '#FBBF24' : '#D97706'} strokeWidth="4" strokeLinecap="round" />
                    <text x="250" y="305" textAnchor="middle" fill={theme === 'dark' ? '#E5E7EB' : '#1F2937'} fontSize="14" fontWeight="bold">Data Formatters</text>
                    
                    {/* Center ToolMatic logo */}
                    <circle cx="350" cy="250" r="40" fill={theme === 'dark' ? '#1E40AF' : '#DBEAFE'} />
                    <path d="M335,250 C335,242 342,235 350,235 C358,235 365,242 365,250 C365,258 358,265 350,265 C342,265 335,258 335,250 Z" stroke={theme === 'dark' ? '#3B82F6' : '#1D4ED8'} strokeWidth="4" fill="none" />
                    <text x="350" y="255" textAnchor="middle" fill={theme === 'dark' ? '#BFDBFE' : '#1E40AF'} fontSize="20" fontWeight="bold">TM</text>
                    <text x="350" y="305" textAnchor="middle" fill={theme === 'dark' ? '#E5E7EB' : '#1F2937'} fontSize="14" fontWeight="bold">ToolMatic</text>
                  </g>
                  
                  {/* Connecting lines */}
                  <g stroke={theme === 'dark' ? '#6B7280' : '#9CA3AF'} strokeWidth="2" strokeDasharray="5,5">
                    <line x1="150" y1="150" x2="250" y2="210" />
                    <line x1="250" y1="150" x2="250" y2="210" />
                    <line x1="350" y1="150" x2="250" y2="210" />
                    <line x1="150" y1="250" x2="150" y2="210" />
                    <line x1="250" y1="250" x2="350" y2="210" />
                    <line x1="350" y1="250" x2="350" y2="210" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Tools Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <span className={`mr-3 p-1 rounded ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <Layers size={24} className={theme === 'dark' ? 'text-blue-300' : 'text-blue-600'} />
            </span>
            Popular Tools
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostPopular.map((tool) => (
              <Link 
                key={tool.name} 
                to={tool.path}
                className={`p-5 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700 shadow-gray-900/50' 
                    : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-gray-200/50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg mr-4 ${
                    theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {getIcon(tool.name)}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{tool.name}</h3>
                    <p className="text-sm opacity-70">{tool.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <span className={`mr-3 p-1 rounded ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'}`}>
              <Layers size={24} className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'} />
            </span>
            Why Choose ToolMatic?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "All-in-One Solution",
                description: "Access dozens of tools without switching between websites",
                icon: <Layers size={24} />
              },
              {
                title: "Privacy Focused",
                description: "All processing happens in your browser - your data never leaves your device",
                icon: <Lock size={24} />
              },
              {
                title: "Free to Use",
                description: "All tools are completely free with no hidden costs or subscriptions",
                icon: <DollarSign size={24} />
              },
              {
                title: "Dark Mode",
                description: "Easy on the eyes with both light and dark themes available",
                icon: <Moon size={24} />
              }
            ].map((feature) => (
              <div 
                key={feature.title}
                className={`p-6 rounded-xl shadow-md ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-100'
                }`}
              >
                <div className={`p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 ${
                  theme === 'dark' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-base opacity-70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      
      {/* CTA Section */}
      <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-600 to-indigo-600'} text-white mt-8 rounded-t-3xl`}>
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to boost your productivity?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start using our comprehensive set of tools today and experience the difference in your workflow.
          </p>
          <Link 
            to="/utilities" 
            className="px-8 py-4 bg-white text-indigo-600 hover:bg-blue-50 rounded-xl inline-flex items-center font-medium shadow-xl shadow-blue-500/20 transform transition hover:-translate-y-1"
          >
            Get Started Now
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;