// import { useState, useEffect } from 'react';
// import { Copy, X, Check, Search, Download, Info, Grid as GridIcon, Layout, Columns, Maximize, Rows, Pause, Play, Save } from 'lucide-react';

// const styleSheet = `
// .grid-preview {
//   transition: all 0.3s ease;
// }

// .grid-preview:hover {
//   transform: translateY(-5px);
//   box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
// }

// .grid-item {
//   transition: all 0.2s ease;
// }

// .grid-item:hover {
//   transform: scale(1.05);
// }

// .category-pill {
//   transition: all 0.2s ease;
// }

// .category-pill:hover {
//   filter: brightness(1.1);
// }

// .scrollbar-custom::-webkit-scrollbar {
//   width: 8px;
//   height: 8px;
// }

// .scrollbar-custom::-webkit-scrollbar-track {
//   background: transparent;
// }

// .scrollbar-custom::-webkit-scrollbar-thumb {
//   background-color: rgba(155, 155, 155, 0.5);
//   border-radius: 20px;
// }

// .code-container {
//   position: relative;
// }

// .code-copy-btn {
//   position: absolute;
//   top: 8px;
//   right: 8px;
//   opacity: 0;
//   transition: opacity 0.2s ease;
// }

// .code-container:hover .code-copy-btn {
//   opacity: 1;
// }

// .grid-container {
//   display: grid;
//   height: 100%;
//   width: 100%;
//   gap: 4px;
// }

// /* Grid Layouts */
// .simple-columns-2 {
//   grid-template-columns: 1fr 1fr;
// }

// .simple-columns-3 {
//   grid-template-columns: 1fr 1fr 1fr;
// }

// .simple-columns-4 {
//   grid-template-columns: 1fr 1fr 1fr 1fr;
// }

// .responsive-grid {
//   grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
// }

// .holy-grail {
//   grid-template-areas: 
//     "header header header"
//     "sidebar main aside"
//     "footer footer footer";
//   grid-template-columns: 1fr 3fr 1fr;
//   grid-template-rows: auto 1fr auto;
// }

// .dashboard {
//   grid-template-areas:
//     "header header header header"
//     "sidebar main main main"
//     "sidebar stats stats stats"
//     "footer footer footer footer";
//   grid-template-columns: 1fr 1fr 1fr 1fr;
//   grid-template-rows: auto 1fr 1fr auto;
// }

// .masonry-sim {
//   grid-template-columns: repeat(3, 1fr);
//   grid-template-rows: repeat(4, auto);
//   grid-auto-flow: dense;
// }

// .card-layout {
//   grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
//   grid-auto-rows: minmax(150px, auto);
//   grid-gap: 16px;
// }

// .magazine {
//   grid-template-areas:
//     "title title title"
//     "image content sidebar"
//     "footer footer footer";
//   grid-template-columns: 1fr 2fr 1fr;
//   grid-template-rows: auto 1fr auto;
// }

// .asymmetric {
//   grid-template-columns: repeat(4, 1fr);
//   grid-template-rows: repeat(3, 1fr);
// }

// .mosaic {
//   grid-template-columns: repeat(4, 1fr);
//   grid-template-rows: repeat(4, 1fr);
// }

// .portfolio {
//   grid-template-columns: repeat(3, 1fr);
//   grid-auto-rows: minmax(150px, auto);
// }

// .app-layout {
//   grid-template-areas:
//     "nav nav nav"
//     "sidebar content tools"
//     "footer footer footer";
//   grid-template-columns: 1fr 3fr 1fr;
//   grid-template-rows: auto 1fr auto;
// }

// .photo-gallery {
//   grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
//   grid-auto-rows: 150px;
//   grid-auto-flow: dense;
// }

// .blog-layout {
//   grid-template-columns: 3fr 1fr;
//   grid-template-areas:
//     "header header"
//     "main sidebar"
//     "footer footer";
//   grid-template-rows: auto 1fr auto;
// }

// .commerce-product {
//   grid-template-columns: 1fr 1fr;
//   grid-template-areas:
//     "image details"
//     "tabs tabs"
//     "related related";
//   grid-template-rows: auto auto auto;
// }

// .landing-page {
//   grid-template-columns: repeat(12, 1fr);
//   grid-template-rows: auto auto auto auto auto;
// }

// .content-sidebar {
//   grid-template-columns: 2fr 1fr;
//   grid-template-areas:
//     "header header"
//     "content sidebar"
//     "footer footer";
//   grid-template-rows: auto 1fr auto;
// }

// .sidebar-content {
//   grid-template-columns: 1fr 2fr;
//   grid-template-areas:
//     "header header"
//     "sidebar content"
//     "footer footer";
//   grid-template-rows: auto 1fr auto;
// }

// .equal-height-columns {
//   grid-template-columns: repeat(3, 1fr);
//   grid-auto-rows: 1fr;
// }
// `;

// const CategoryPill = ({ label, active, onClick, theme, icon }) => (
//   <button
//     onClick={onClick}
//     className={`category-pill px-3 py-1.5 text-sm font-medium rounded-full transition-all flex items-center gap-1.5
//       ${active 
//         ? theme === 'dark' 
//           ? 'bg-blue-600 text-white' 
//           : 'bg-blue-500 text-white' 
//         : theme === 'dark' 
//           ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
//           : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
//     {icon && icon}
//     {label}
//   </button>
// );

// const CodeDisplay = ({ code, theme, language = 'css', onCopy, showLineNumbers = true }) => {
//   return (
//     <div className="code-container relative rounded-lg overflow-hidden">
//       <pre className={`p-4 overflow-auto max-h-72 text-sm scrollbar-custom font-mono
//         ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
//         {showLineNumbers ? (
//           <code className="relative">
//             {code.split('\n').map((line, i) => (
//               <div key={i} className="table-row">
//                 <span className={`table-cell pr-4 text-right select-none opacity-50 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
//                   {i + 1}
//                 </span>
//                 <span className="table-cell">{line}</span>
//               </div>
//             ))}
//           </code>
//         ) : (
//           <code>{code}</code>
//         )}
//       </pre>
//       <button
//         onClick={onCopy}
//         className="code-copy-btn absolute top-2 right-2 p-1.5 rounded-md 
//           text-gray-400 hover:text-gray-100
//           transition-colors duration-200
//           bg-opacity-80 bg-gray-800 hover:bg-gray-700"
//         title="Copy to clipboard"
//         aria-label="Copy code to clipboard">
//         <Copy size={16} />
//       </button>
//     </div>
//   );
// };

// const gridCategories = {
//   'simple-columns-2': 'basic',
//   'simple-columns-3': 'basic',
//   'simple-columns-4': 'basic',
//   'responsive-grid': 'responsive',
//   'holy-grail': 'page layout',
//   'dashboard': 'application',
//   'masonry-sim': 'gallery',
//   'card-layout': 'components',
//   'magazine': 'page layout',
//   'asymmetric': 'gallery',
//   'mosaic': 'gallery',
//   'portfolio': 'gallery',
//   'app-layout': 'application',
//   'photo-gallery': 'gallery',
//   'blog-layout': 'page layout',
//   'commerce-product': 'page layout',
//   'landing-page': 'page layout',
//   'content-sidebar': 'page layout',
//   'sidebar-content': 'page layout',
//   'equal-height-columns': 'components'
// };

// const gridDisplayNames = {
//   'simple-columns-2': 'Two Columns',
//   'simple-columns-3': 'Three Columns',
//   'simple-columns-4': 'Four Columns',
//   'responsive-grid': 'Responsive Grid',
//   'holy-grail': 'Holy Grail Layout',
//   'dashboard': 'Dashboard Layout',
//   'masonry-sim': 'Masonry-like Grid',
//   'card-layout': 'Card Grid',
//   'magazine': 'Magazine Layout',
//   'asymmetric': 'Asymmetric Grid',
//   'mosaic': 'Mosaic Grid',
//   'portfolio': 'Portfolio Grid',
//   'app-layout': 'App Interface',
//   'photo-gallery': 'Photo Gallery',
//   'blog-layout': 'Blog Layout',
//   'commerce-product': 'Product Page',
//   'landing-page': 'Landing Page',
//   'content-sidebar': 'Content with Sidebar',
//   'sidebar-content': 'Sidebar with Content',
//   'equal-height-columns': 'Equal Height Columns'
// };

// const gridSnippets = {
//   'simple-columns-2': `.grid-container {
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 16px;
// }`,
//   'simple-columns-3': `.grid-container {
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr;
//   gap: 16px;
// }`,
//   'simple-columns-4': `.grid-container {
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr 1fr;
//   gap: 16px;
// }`,
//   'responsive-grid': `.grid-container {
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//   gap: 16px;
// }`,
//   'holy-grail': `.grid-container {
//   display: grid;
//   grid-template-areas: 
//     "header header header"
//     "sidebar main aside"
//     "footer footer footer";
//   grid-template-columns: 1fr 3fr 1fr;
//   grid-template-rows: auto 1fr auto;
//   gap: 16px;
//   min-height: 100vh;
// }

// .header { grid-area: header; }
// .sidebar { grid-area: sidebar; }
// .main { grid-area: main; }
// .aside { grid-area: aside; }
// .footer { grid-area: footer; }`,
//   'dashboard': `.grid-container {
//   display: grid;
//   grid-template-areas:
//     "header header header header"
//     "sidebar main main main"
//     "sidebar stats stats stats"
//     "footer footer footer footer";
//   grid-template-columns: 1fr 1fr 1fr 1fr;
//   grid-template-rows: auto 1fr 1fr auto;
//   gap: 16px;
//   height: 100vh;
// }

// .header { grid-area: header; }
// .sidebar { grid-area: sidebar; }
// .main { grid-area: main; }
// .stats { grid-area: stats; }
// .footer { grid-area: footer; }`,
//   'masonry-sim': `.grid-container {
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   grid-auto-rows: 100px;
//   gap: 16px;
//   grid-auto-flow: dense;
// }

// .wide {
//   grid-column: span 2;
// }

// .tall {
//   grid-row: span 2;
// }

// .big {
//   grid-column: span 2;
//   grid-row: span 2;
// }`,
//   'card-layout': `.grid-container {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//   grid-auto-rows: minmax(200px, auto);
//   gap: 16px;
// }`,
//   'magazine': `.grid-container {
//   display: grid;
//   grid-template-areas:
//     "title title title"
//     "image content sidebar"
//     "footer footer footer";
//   grid-template-columns: 1fr 2fr 1fr;
//   grid-template-rows: auto 1fr auto;
//   gap: 16px;
// }

// .title { grid-area: title; }
// .image { grid-area: image; }
// .content { grid-area: content; }
// .sidebar { grid-area: sidebar; }
// .footer { grid-area: footer; }`,
//   'asymmetric': `.grid-container {
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   grid-template-rows: repeat(3, 100px);
//   gap: 16px;
// }

// .feature {
//   grid-column: span 2;
//   grid-row: span 2;
// }

// .wide {
//   grid-column: span 2;
// }

// .tall {
//   grid-row: span 2;
// }`,
//   'mosaic': `.grid-container {
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   grid-template-rows: repeat(4, 100px);
//   gap: 8px;
// }

// .feature {
//   grid-column: 1 / 3;
//   grid-row: 1 / 3;
// }

// .wide-1 {
//   grid-column: 3 / 5;
// }

// .wide-2 {
//   grid-column: 1 / 3;
// }

// .tall-1 {
//   grid-column: 3;
//   grid-row: 2 / 4;
// }

// .big {
//   grid-column: 1 / 3;
//   grid-row: 3 / 5;
// }`,
//   'portfolio': `.grid-container {
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   grid-auto-rows: minmax(200px, auto);
//   gap: 16px;
// }

// .wide {
//   grid-column: span 2;
// }

// .tall {
//   grid-row: span 2;
// }`,
//   'app-layout': `.grid-container {
//   display: grid;
//   grid-template-areas:
//     "nav nav nav"
//     "sidebar content tools"
//     "footer footer footer";
//   grid-template-columns: 1fr 3fr 1fr;
//   grid-template-rows: auto 1fr auto;
//   gap: 16px;
//   height: 100vh;
// }

// .nav { grid-area: nav; }
// .sidebar { grid-area: sidebar; }
// .content { grid-area: content; }
// .tools { grid-area: tools; }
// .footer { grid-area: footer; }`,
//   'photo-gallery': `.grid-container {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
//   grid-auto-rows: 200px;
//   gap: 8px;
//   grid-auto-flow: dense;
// }

// .wide {
//   grid-column: span 2;
// }

// .tall {
//   grid-row: span 2;
// }

// .big {
//   grid-column: span 2;
//   grid-row: span 2;
// }`,
//   'blog-layout': `.grid-container {
//   display: grid;
//   grid-template-columns: 3fr 1fr;
//   grid-template-areas:
//     "header header"
//     "main sidebar"
//     "footer footer";
//   grid-template-rows: auto 1fr auto;
//   gap: 16px;
//   min-height: 100vh;
// }

// .header { grid-area: header; }
// .main { grid-area: main; }
// .sidebar { grid-area: sidebar; }
// .footer { grid-area: footer; }`,
//   'commerce-product': `.grid-container {
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   grid-template-areas:
//     "image details"
//     "tabs tabs"
//     "related related";
//   grid-template-rows: auto auto auto;
//   gap: 24px;
// }

// .product-image { grid-area: image; }
// .product-details { grid-area: details; }
// .product-tabs { grid-area: tabs; }
// .related-products { 
//   grid-area: related;
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 16px;
// }`,
//   'landing-page': `.grid-container {
//   display: grid;
//   grid-template-columns: repeat(12, 1fr);
//   grid-auto-rows: minmax(100px, auto);
//   gap: 16px;
// }

// .hero {
//   grid-column: 1 / -1;
//   grid-row: 1;
// }

// .features {
//   grid-column: 1 / -1;
//   grid-row: 2;
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 16px;
// }

// .testimonial {
//   grid-column: 2 / 12;
//   grid-row: 3;
// }

// .cta {
//   grid-column: 3 / 11;
//   grid-row: 4;
// }

// .footer {
//   grid-column: 1 / -1;
//   grid-row: 5;
// }`,
//   'content-sidebar': `.grid-container {
//   display: grid;
//   grid-template-columns: 2fr 1fr;
//   grid-template-areas:
//     "header header"
//     "content sidebar"
//     "footer footer";
//   grid-template-rows: auto 1fr auto;
//   gap: 16px;
//   min-height: 100vh;
// }

// .header { grid-area: header; }
// .content { grid-area: content; }
// .sidebar { grid-area: sidebar; }
// .footer { grid-area: footer; }`,
//   'sidebar-content': `.grid-container {
//   display: grid;
//   grid-template-columns: 1fr 2fr;
//   grid-template-areas:
//     "header header"
//     "sidebar content"
//     "footer footer";
//   grid-template-rows: auto 1fr auto;
//   gap: 16px;
//   min-height: 100vh;
// }

// .header { grid-area: header; }
// .sidebar { grid-area: sidebar; }
// .content { grid-area: content; }
// .footer { grid-area: footer; }`,
//   'equal-height-columns': `.grid-container {
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   grid-auto-rows: 1fr;
//   gap: 16px;
// }

// /* The items will have equal height regardless of content */`
// };

// const gridUsageExamples = {
//   'simple-columns-2': `<div class="grid-container">
//   <div class="grid-item">Column 1</div>
//   <div class="grid-item">Column 2</div>
// </div>`,
//   'simple-columns-3': `<div class="grid-container">
//   <div class="grid-item">Column 1</div>
//   <div class="grid-item">Column 2</div>
//   <div class="grid-item">Column 3</div>
// </div>`,
//   'simple-columns-4': `<div class="grid-container">
//   <div class="grid-item">Column 1</div>
//   <div class="grid-item">Column 2</div>
//   <div class="grid-item">Column 3</div>
//   <div class="grid-item">Column 4</div>
// </div>`,
//   'responsive-grid': `<div class="grid-container">
//   <div class="grid-item">Item 1</div>
//   <div class="grid-item">Item 2</div>
//   <div class="grid-item">Item 3</div>
//   <div class="grid-item">Item 4</div>
//   <!-- Add more items as needed -->
// </div>`,
//   'holy-grail': `<div class="grid-container">
//   <header class="header">Header</header>
//   <aside class="sidebar">Sidebar</aside>
//   <main class="main">Main Content</main>
//   <aside class="aside">Aside</aside>
//   <footer class="footer">Footer</footer>
// </div>`,
//   'dashboard': `<div class="grid-container">
//   <header class="header">Dashboard Header</header>
//   <aside class="sidebar">Navigation</aside>
//   <main class="main">Main Content</main>
//   <section class="stats">Statistics</section>
//   <footer class="footer">Footer</footer>
// </div>`,
//   'masonry-sim': `<div class="grid-container">
//   <div class="grid-item">Item 1</div>
//   <div class="grid-item wide">Item 2 (Wide)</div>
//   <div class="grid-item tall">Item 3 (Tall)</div>
//   <div class="grid-item">Item 4</div>
//   <div class="grid-item big">Item 5 (Big)</div>
//   <div class="grid-item">Item 6</div>
//   <!-- Add more items as needed -->
// </div>`,
//   'card-layout': `<div class="grid-container">
//   <div class="card">Card 1</div>
//   <div class="card">Card 2</div>
//   <div class="card">Card 3</div>
//   <div class="card">Card 4</div>
//   <!-- Add more cards as needed -->
// </div>`,
//   'magazine': `<div class="grid-container">
//   <header class="title">Article Title</header>
//   <div class="image">Featured Image</div>
//   <article class="content">Main Content</article>
//   <aside class="sidebar">Related Articles</aside>
//   <footer class="footer">Article Footer</footer>
// </div>`,
//   'asymmetric': `<div class="grid-container">
//   <div class="grid-item feature">Featured Item</div>
//   <div class="grid-item">Item 2</div>
//   <div class="grid-item">Item 3</div>
//   <div class="grid-item wide">Item 4 (Wide)</div>
//   <div class="grid-item tall">Item 5 (Tall)</div>
//   <div class="grid-item">Item 6</div>
//   <!-- Add more items as needed -->
// </div>`,
//   'mosaic': `<div class="grid-container">
//   <div class="grid-item feature">Feature</div>
//   <div class="grid-item wide-1">Wide 1</div>
//   <div class="grid-item wide-2">Wide 2</div>
//   <div class="grid-item tall-1">Tall 1</div>
//   <div class="grid-item">Item 5</div>
//   <div class="grid-item big">Big Item</div>
//   <div class="grid-item">Item 7</div>
//   <div class="grid-item">Item 8</div>
// </div>`,
//   'portfolio': `<div class="grid-container">
//   <div class="project wide">Project 1 (Wide)</div>
//   <div class="project">Project 2</div>
//   <div class="project tall">Project 3 (Tall)</div>
//   <div class="project">Project 4</div>
//   <div class="project">Project 5</div>
//   <div class="project wide">Project 6 (Wide)</div>
//   <!-- Add more projects as needed -->
// </div>`,
//   'app-layout': `<div class="grid-container">
//   <nav class="nav">Navigation Bar</nav>
//   <aside class="sidebar">App Sidebar</aside>
//   <main class="content">Main Content Area</main>
//   <div class="tools">Tools Panel</div>
//   <footer class="footer">App Footer</footer>
// </div>`,
//   'photo-gallery': `<div class="grid-container">
//   <div class="photo wide">Photo 1 (Wide)</div>
//   <div class="photo">Photo 2</div>
//   <div class="photo tall">Photo 3 (Tall)</div>
//   <div class="photo">Photo 4</div>
//   <div class="photo big">Photo 5 (Big)</div>
//   <div class="photo">Photo 6</div>
//   <!-- Add more photos as needed -->
// </div>`,
//   'blog-layout': `<div class="grid-container">
//   <header class="header">Blog Header</header>
//   <main class="main">Blog Posts</main>
//   <aside class="sidebar">Blog Sidebar</aside>
//   <footer class="footer">Blog Footer</footer>
// </div>`,
//   'commerce-product': `<div class="grid-container">
//   <div class="product-image">Product Images</div>
//   <div class="product-details">Product Details</div>
//   <div class="product-tabs">Product Tabs</div>
//   <div class="related-products">
//     <div class="related-item">Related 1</div>
//     <div class="related-item">Related 2</div>
//     <div class="related-item">Related 3</div>
//     <div class="related-item">Related 4</div>
//   </div>
// </div>`,
//   'landing-page': `<div class="grid-container">
//   <section class="hero">Hero Section</section>
//   <section class="features">
//     <div class="feature">Feature 1</div>
//     <div class="feature">Feature 2</div>
//     <div class="feature">Feature 3</div>
//   </section>
//   <section class="testimonial">Testimonial</section>
//   <section class="cta">Call to Action</section>
//   <footer class="footer">Footer</footer>
// </div>`,
//   'content-sidebar': `<div class="grid-container">
//   <header class="header">Header</header>
//   <main class="content">Main Content</main>
//   <aside class="sidebar">Sidebar</aside>
//   <footer class="footer">Footer</footer>
// </div>`,
//   'sidebar-content': `<div class="grid-container">
//   <header class="header">Header</header>
//   <aside class="sidebar">Sidebar</aside>
//   <main class="content">Main Content</main>
//   <footer class="footer">Footer</footer>
// </div>`,
//   'equal-height-columns': `<div class="grid-container">
//   <div class="column">Column 1 with minimal content</div>
//   <div class="column">Column 2 with more content that might wrap to multiple lines</div>
//   <div class="column">Column 3 with moderate content</div>
// </div>`
// };

// const GridCard = ({ gridLayout, theme, isSelected, onSelect, isFavorite, onToggleFavorite }) => {
//   const category = gridCategories[gridLayout];
//   const displayName = gridDisplayNames[gridLayout];

//   const getCategoryColor = () => {
//     switch (category) {
//       case 'basic':
//         return 'border-blue-500';
//       case 'responsive':
//         return 'border-purple-500';
//       case 'page layout':
//         return 'border-green-500';
//       case 'components':
//         return 'border-yellow-500';
//       case 'gallery':
//         return 'border-orange-500';
//       case 'application':
//         return 'border-pink-500';
//       default:
//         return 'border-gray-300';
//     }
//   };

//   const renderPreview = () => {
//     // Custom preview for each grid layout
//     switch (gridLayout) {
//       case 'simple-columns-2':
//         return (
//           <div className="grid grid-cols-2 gap-1 h-full">
//             {[...Array(2)].map((_, i) => (
//               <div key={i} className={`grid-item rounded ${theme === 'dark' ? 'bg-blue-800' : 'bg-blue-200'} flex items-center justify-center`}>
//                 <div className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>{i + 1}</div>
//               </div>
//             ))}
//           </div>
//         );
//       case 'simple-columns-3':
//         return (
//           <div className="grid grid-cols-3 gap-1 h-full">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className={`grid-item rounded ${theme === 'dark' ? 'bg-blue-800' : 'bg-blue-200'} flex items-center justify-center`}>
//                 <div className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>{i + 1}</div>
//               </div>
//             ))}
//           </div>
//         );
//       case 'simple-columns-4':
//         return (
//           <div className="grid grid-cols-4 gap-1 h-full">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className={`grid-item rounded ${theme === 'dark' ? 'bg-blue-800' : 'bg-blue-200'} flex items-center justify-center`}>
//                 <div className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>{i + 1}</div>
//               </div>
//             ))}
//           </div>
//         );
//       case 'responsive-grid':
//         return (
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 h-full">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className={`grid-item rounded ${theme === 'dark' ? 'bg-purple-800' : 'bg-purple-200'} flex items-center justify-center`}>
//                 <div className={`text-xs ${theme === 'dark' ? 'text-purple-200' : 'text-purple-800'}`}>{i + 1}</div>
//               </div>
//             ))}
//           </div>
//         );
//       case 'holy-grail':
//         return (
//           <div className="grid grid-areas-holygrail h-full gap-1">
//             <div className={`rounded ${theme === 'dark' ? 'bg-green-800' : 'bg-green-300'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>Header</div>
//             </div>
//             <div className={`rounded ${theme === 'dark' ? 'bg-green-800' : 'bg-green-300'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>Sidebar</div>
//             </div>
//             <div className={`rounded ${theme === 'dark' ? 'bg-green-700' : 'bg-green-200'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-green-100' : 'text-green-800'}`}>Main</div>
//             </div>
//             <div className={`rounded ${theme === 'dark' ? 'bg-green-800' : 'bg-green-300'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>Aside</div>
//             </div>
//             <div className={`rounded ${theme === 'dark' ? 'bg-green-800' : 'bg-green-300'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>Footer</div>
//             </div>
//           </div>
//         );
//       case 'dashboard':
//         return (
//           <div className="grid grid-areas-dashboard h-full gap-1">
//             <div className={`rounded ${theme === 'dark' ? 'bg-pink-800' : 'bg-pink-300'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-pink-200' : 'text-pink-800'}`}>Header</div>
//             </div>
//             <div className={`rounded ${theme === 'dark' ? 'bg-pink-800' : 'bg-pink-200'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-pink-200' : 'text-pink-800'}`}>Sidebar</div>
//             </div>
//             <div className={`rounded ${theme === 'dark' ? 'bg-pink-700' : 'bg-pink-100'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-pink-100' : 'text-pink-800'}`}>Main</div>
//             </div>
//             <div className={`rounded ${theme === 'dark' ? 'bg-pink-800' : 'bg-pink-200'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-pink-200' : 'text-pink-800'}`}>Stats</div>
//             </div>
//             <div className={`rounded ${theme === 'dark' ? 'bg-pink-800' : 'bg-pink-300'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-pink-200' : 'text-pink-800'}`}>Footer</div>
//             </div>
//           </div>
//         );
//       case 'masonry-sim':
//         return (
//           <div className="grid grid-cols-3 gap-1 h-full grid-flow-dense">
//             <div className={`grid-item rounded ${theme === 'dark' ? 'bg-orange-800' : 'bg-orange-200'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-orange-200' : 'text-orange-800'}`}>1</div>
//             </div>
//             <div className={`grid-item rounded col-span-2 ${theme === 'dark' ? 'bg-orange-700' : 'bg-orange-300'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-orange-200' : 'text-orange-800'}`}>2</div>
//             </div>
//             <div className={`grid-item rounded row-span-2 ${theme === 'dark' ? 'bg-orange-700' : 'bg-orange-300'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-orange-200' : 'text-orange-800'}`}>3</div>
//             </div>
//             <div className={`grid-item rounded ${theme === 'dark' ? 'bg-orange-800' : 'bg-orange-200'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-orange-200' : 'text-orange-800'}`}>4</div>
//             </div>
//             <div className={`grid-item rounded col-span-2 row-span-2 ${theme === 'dark' ? 'bg-orange-600' : 'bg-orange-400'} flex items-center justify-center`}>
//               <div className={`text-xs ${theme === 'dark' ? 'text-orange-200' : 'text-orange-800'}`}>5</div>
//             </div>
//           </div>
//         );
//       // Add cases for the remaining grid layouts in a similar pattern
//       default:
//         return (
//           <div className={`h-full rounded flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
//             <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Preview</div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div
//       onClick={onSelect}
//       className={`grid-preview cursor-pointer rounded-lg overflow-hidden ${isSelected 
//         ? theme === 'dark'
//           ? 'ring-2 ring-blue-500 bg-gray-800'
//           : 'ring-2 ring-blue-500 bg-blue-50'
//         : theme === 'dark'
//           ? 'bg-gray-800 hover:bg-gray-750'
//           : 'bg-white hover:bg-gray-50'
//       } border ${getCategoryColor()} ${theme === 'dark' ? 'border-opacity-50' : ''}`}
//     >
//       <div className="p-3">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
//             {displayName}
//           </h3>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onToggleFavorite();
//             }}
//             className={`text-sm ${isFavorite 
//               ? theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500' 
//               : theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
//             aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
//           >
//             {isFavorite ? "★" : "☆"}
//           </button>
//         </div>
//         <div className={`text-xs mb-2 inline-block px-2 py-0.5 rounded ${
//           theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
//         }`}>
//           {category}
//         </div>
//         <div className="h-24 mb-2">
//           {renderPreview()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function GridLibrary() {
//   const [theme, setTheme] = useState('light');
//   const [selectedLayout, setSelectedLayout] = useState('simple-columns-3');
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [favorites, setFavorites] = useState([]);
//   const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
//   const [copiedSnippet, setCopiedSnippet] = useState(false);
//   const [copiedUsage, setCopiedUsage] = useState(false);
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
//   const [previewMode, setPreviewMode] = useState('static'); // 'static' or 'interactive'
  
//   // Insert stylesheet
//   useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = styleSheet;
//     document.head.appendChild(style);
    
//     // Check if user prefers dark theme
//     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       setTheme('dark');
//     }
    
//     // Load favorites from local storage if available
//     const savedFavorites = localStorage.getItem('gridFavorites');
//     if (savedFavorites) {
//       setFavorites(JSON.parse(savedFavorites));
//     }
    
//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);
  
//   // Save favorites to local storage when they change
//   useEffect(() => {
//     localStorage.setItem('gridFavorites', JSON.stringify(favorites));
//   }, [favorites]);
  
//   // Copy code to clipboard
//   const copyToClipboard = (text, setCopied) => {
//     navigator.clipboard.writeText(text)
//       .then(() => {
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       })
//       .catch(err => {
//         console.error('Failed to copy text: ', err);
//       });
//   };
  
//   // Toggle favorite status
//   const toggleFavorite = (layout) => {
//     if (favorites.includes(layout)) {
//       setFavorites(favorites.filter(fav => fav !== layout));
//     } else {
//       setFavorites([...favorites, layout]);
//     }
//   };
  
//   // Filter grid layouts based on search query and active filter
//   const filteredLayouts = Object.keys(gridCategories).filter(layout => {
//     const matchesSearch = layout.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                           gridDisplayNames[layout].toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           gridCategories[layout].toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesCategory = activeFilter === 'all' || gridCategories[layout] === activeFilter;
    
//     const matchesFavorites = !showFavoritesOnly || favorites.includes(layout);
    
//     return matchesSearch && matchesCategory && matchesFavorites;
//   });

//   return (
//     <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className={`text-2xl font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//             <GridIcon className="h-6 w-6" /> CSS Grid Layout Library
//           </h1>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//               className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
//               aria-label="Toggle theme"
//             >
//               {theme === 'dark' ? '☀️' : '🌙'}
//             </button>
//             <a
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 // Show info modal here
//                 alert('CSS Grid Layout Library\nA collection of reusable grid layouts for your web projects.\nBuild with React and Tailwind CSS.');
//               }}
//               className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
//               aria-label="Information"
//             >
//               <Info size={18} />
//             </a>
//           </div>
//         </div>
        
//         <div className="mb-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className={`relative flex-grow ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search size={18} className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search layouts..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   theme === 'dark' 
//                     ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
//                     : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
//                 }`}
//               />
//             </div>
            
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`p-2 rounded ${
//                   viewMode === 'grid'
//                     ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
//                     : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
//                 }`}
//                 aria-label="Grid view"
//               >
//                 <GridIcon size={18} />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`p-2 rounded ${
//                   viewMode === 'list'
//                     ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
//                     : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
//                 }`}
//                 aria-label="List view"
//               >
//                 <Layout size={18} />
//               </button>
//             </div>
//           </div>
          
//           <div className="flex flex-wrap gap-2 mb-4">
//             <CategoryPill
//               label="All"
//               active={activeFilter === 'all'}
//               onClick={() => setActiveFilter('all')}
//               theme={theme}
//             />
//             <CategoryPill
//               label="Basic"
//               active={activeFilter === 'basic'}
//               onClick={() => setActiveFilter('basic')}
//               theme={theme}
//             />
//             <CategoryPill
//               label="Responsive"
//               active={activeFilter === 'responsive'}
//               onClick={() => setActiveFilter('responsive')}
//               theme={theme}
//             />
//             <CategoryPill
//               label="Page Layout"
//               active={activeFilter === 'page layout'}
//               onClick={() => setActiveFilter('page layout')}
//               theme={theme}
//             />
//             <CategoryPill
//               label="Components"
//               active={activeFilter === 'components'}
//               onClick={() => setActiveFilter('components')}
//               theme={theme}
//             />
//             <CategoryPill
//               label="Gallery"
//               active={activeFilter === 'gallery'}
//               onClick={() => setActiveFilter('gallery')}
//               theme={theme}
//             />
//             <CategoryPill
//               label="Application"
//               active={activeFilter === 'application'}
//               onClick={() => setActiveFilter('application')}
//               theme={theme}
//             />
//           </div>
          
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="favorites-toggle"
//                 checked={showFavoritesOnly}
//                 onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
//                 className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
//               />
//               <label htmlFor="favorites-toggle" className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
//                 Show favorites only
//               </label>
//             </div>
            
//             <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//               Showing {filteredLayouts.length} layouts
//             </p>
//           </div>
//         </div>
        
//         <div className="grid gap-6">
//           <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
//             {filteredLayouts.length > 0 ? (
//               filteredLayouts.map(layout => (
//                 <GridCard
//                   key={layout}
//                   gridLayout={layout}
//                   theme={theme}
//                   isSelected={selectedLayout === layout}
//                   onSelect={() => setSelectedLayout(layout)}
//                   isFavorite={favorites.includes(layout)}
//                   onToggleFavorite={() => toggleFavorite(layout)}
//                 />
//               ))
//             ) : (
//               <div className={`col-span-full flex flex-col items-center justify-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                 <Search size={48} className="mb-4 opacity-50" />
//                 <p className="text-lg font-medium">No layouts found</p>
//                 <p className="text-sm">Try adjusting your search or filters</p>
//               </div>
//             )}
//           </div>
          
//           {selectedLayout && (
//             <div className={`mt-8 p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//                   {gridDisplayNames[selectedLayout]}
//                 </h2>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => toggleFavorite(selectedLayout)}
//                     className={`p-2 rounded ${
//                       favorites.includes(selectedLayout)
//                         ? 'text-yellow-400'
//                         : theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
//                     }`}
//                     aria-label={favorites.includes(selectedLayout) ? "Remove from favorites" : "Add to favorites"}
//                   >
//                     {favorites.includes(selectedLayout) ? "★" : "☆"}
//                   </button>
//                   <button
//                     onClick={() => {
//                       // Download CSS snippet
//                       const element = document.createElement('a');
//                       const file = new Blob([gridSnippets[selectedLayout]], {type: 'text/css'});
//                       element.href = URL.createObjectURL(file);
//                       element.download = `${selectedLayout}.css`;
//                       document.body.appendChild(element);
//                       element.click();
//                       document.body.removeChild(element);
//                     }}
//                     className={`p-2 rounded ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}
//                     aria-label="Download CSS"
//                   >
//                     <Download size={18} />
//                   </button>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className={`text-lg font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
//                     CSS Snippet
//                   </h3>
//                   <CodeDisplay
//                     code={gridSnippets[selectedLayout]}
//                     theme={theme}
//                     onCopy={() => copyToClipboard(gridSnippets[selectedLayout], setCopiedSnippet)}
//                   />
//                   {copiedSnippet && (
//                     <div className={`mt-2 text-sm flex items-center gap-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
//                       <Check size={16} /> Copied to clipboard!
//                     </div>
//                   )}
//                 </div>
                
//                 <div>
//                   <h3 className={`text-lg font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
//                     HTML Structure
//                   </h3>
//                   <CodeDisplay
//                     code={gridUsageExamples[selectedLayout]}
//                     theme={theme}
//                     language="html"
//                     onCopy={() => copyToClipboard(gridUsageExamples[selectedLayout], setCopiedUsage)}
//                   />
//                   {copiedUsage && (
//                     <div className={`mt-2 text-sm flex items-center gap-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
//                       <Check size={16} /> Copied to clipboard!
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               <div className="mt-6">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
//                     Preview
//                   </h3>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => setPreviewMode(previewMode === 'static' ? 'interactive' : 'static')}
//                       className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
//                         theme === 'dark' 
//                           ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
//                           : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                       }`}
//                       aria-label={previewMode === 'static' ? "Switch to interactive mode" : "Switch to static mode"}
//                     >
//                       {previewMode === 'static' ? <Play size={14} /> : <Pause size={14} />}
//                       {previewMode === 'static' ? 'Interactive' : 'Static'}
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className={`border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-gray-700 bg-gray-850' : 'border-gray-300 bg-gray-50'}`}>
//                   <div className="aspect-video p-4">
//                     {/* Preview content would go here */}
//                     <div className={`h-full ${selectedLayout}`}>
//                       {/* Dynamic content based on the selected layout */}
//                       {/* This would need custom implementation for each layout */}
//                       <div className="flex items-center justify-center h-full text-center">
//                         <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
//                           Preview for {gridDisplayNames[selectedLayout]}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { Copy, X, Check, Search, Download, Info, Grid as GridIcon, Layout, Columns, Maximize, Rows, Save } from 'lucide-react';

// Utility function for copying to clipboard
const copyToClipboard = (text) => {
  return navigator.clipboard.writeText(text);
};

// Grid categories data
const gridCategories = {
  'simple-columns-2': 'basic',
  'simple-columns-3': 'basic',
  'simple-columns-4': 'basic',
  'responsive-grid': 'responsive',
  'holy-grail': 'page layout',
  'dashboard': 'application',
  'masonry-sim': 'gallery',
  'card-layout': 'components',
  'magazine': 'page layout',
  'asymmetric': 'gallery',
  'mosaic': 'gallery',
  'portfolio': 'gallery',
  'app-layout': 'application',
  'photo-gallery': 'gallery',
  'blog-layout': 'page layout',
  'commerce-product': 'page layout',
  'landing-page': 'page layout',
  'content-sidebar': 'page layout',
  'sidebar-content': 'page layout',
  'equal-height-columns': 'components'
};

// Grid display names
const gridDisplayNames = {
  'simple-columns-2': 'Two Columns',
  'simple-columns-3': 'Three Columns',
  'simple-columns-4': 'Four Columns',
  'responsive-grid': 'Responsive Grid',
  'holy-grail': 'Holy Grail Layout',
  'dashboard': 'Dashboard Layout',
  'masonry-sim': 'Masonry-like Grid',
  'card-layout': 'Card Grid',
  'magazine': 'Magazine Layout',
  'asymmetric': 'Asymmetric Grid',
  'mosaic': 'Mosaic Grid',
  'portfolio': 'Portfolio Grid',
  'app-layout': 'App Interface',
  'photo-gallery': 'Photo Gallery',
  'blog-layout': 'Blog Layout',
  'commerce-product': 'Product Page',
  'landing-page': 'Landing Page',
  'content-sidebar': 'Content with Sidebar',
  'sidebar-content': 'Sidebar with Content',
  'equal-height-columns': 'Equal Height Columns'
};

// Grid CSS snippets
const gridSnippets = {
  'simple-columns-2': `.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}`,
  'simple-columns-3': `.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}`,
  'simple-columns-4': `.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
}`,
  'responsive-grid': `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}`,
  'holy-grail': `.grid-container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }`,
  'dashboard': `.grid-container {
  display: grid;
  grid-template-areas:
    "header header header header"
    "sidebar main main main"
    "sidebar stats stats stats"
    "footer footer footer footer";
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 1fr 1fr auto;
  gap: 16px;
  height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.stats { grid-area: stats; }
.footer { grid-area: footer; }`,
  'masonry-sim': `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 100px;
  gap: 16px;
  grid-auto-flow: dense;
}

.wide { grid-column: span 2; }
.tall { grid-row: span 2; }
.big { grid-column: span 2; grid-row: span 2; }`,
  'card-layout': `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: minmax(200px, auto);
  gap: 16px;
}`,
  'magazine': `.grid-container {
  display: grid;
  grid-template-areas:
    "title title title"
    "image content sidebar"
    "footer footer footer";
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
}

.title { grid-area: title; }
.image { grid-area: image; }
.content { grid-area: content; }
.sidebar { grid-area: sidebar; }
.footer { grid-area: footer; }`,
  'asymmetric': `.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 100px);
  gap: 16px;
}

.feature { grid-column: span 2; grid-row: span 2; }
.wide { grid-column: span 2; }
.tall { grid-row: span 2; }`,
  'mosaic': `.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 100px);
  gap: 8px;
}

.feature { grid-column: 1 / 3; grid-row: 1 / 3; }
.wide-1 { grid-column: 3 / 5; }
.wide-2 { grid-column: 1 / 3; }
.tall-1 { grid-column: 3; grid-row: 2 / 4; }
.big { grid-column: 1 / 3; grid-row: 3 / 5; }`,
  'portfolio': `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(200px, auto);
  gap: 16px;
}

.wide { grid-column: span 2; }
.tall { grid-row: span 2; }`,
  'app-layout': `.grid-container {
  display: grid;
  grid-template-areas:
    "nav nav nav"
    "sidebar content tools"
    "footer footer footer";
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  height: 100vh;
}

.nav { grid-area: nav; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.tools { grid-area: tools; }
.footer { grid-area: footer; }`,
  'photo-gallery': `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  gap: 8px;
  grid-auto-flow: dense;
}

.wide { grid-column: span 2; }
.tall { grid-row: span 2; }
.big { grid-column: span 2; grid-row: span 2; }`,
  'blog-layout': `.grid-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-areas:
    "header header"
    "main sidebar"
    "footer footer";
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  min-height: 100vh;
}

.header { grid-area: header; }
.main { grid-area: main; }
.sidebar { grid-area: sidebar; }
.footer { grid-area: footer; }`,
  'commerce-product': `.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "image details"
    "tabs tabs"
    "related related";
  grid-template-rows: auto auto auto;
  gap: 24px;
}

.product-image { grid-area: image; }
.product-details { grid-area: details; }
.product-tabs { grid-area: tabs; }
.related-products {
  grid-area: related;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}`,
  'landing-page': `.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 16px;
}

.hero { grid-column: 1 / -1; grid-row: 1; }
.features {
  grid-column: 1 / -1;
  grid-row: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.testimonial { grid-column: 2 / 12; grid-row: 3; }
.cta { grid-column: 3 / 11; grid-row: 4; }
.footer { grid-column: 1 / -1; grid-row: 5; }`,
  'content-sidebar': `.grid-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas:
    "header header"
    "content sidebar"
    "footer footer";
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  min-height: 100vh;
}

.header { grid-area: header; }
.content { grid-area: content; }
.sidebar { grid-area: sidebar; }
.footer { grid-area: footer; }`,
  'sidebar-content': `.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }`,
  'equal-height-columns': `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 16px;
}`
};

// Grid HTML usage examples
const gridUsageExamples = {
  'simple-columns-2': `<div class="grid-container">
  <div class="grid-item">Column 1</div>
  <div class="grid-item">Column 2</div>
</div>`,
  'simple-columns-3': `<div class="grid-container">
  <div class="grid-item">Column 1</div>
  <div class="grid-item">Column 2</div>
  <div class="grid-item">Column 3</div>
</div>`,
  'simple-columns-4': `<div class="grid-container">
  <div class="grid-item">Column 1</div>
  <div class="grid-item">Column 2</div>
  <div class="grid-item">Column 3</div>
  <div class="grid-item">Column 4</div>
</div>`,
  'responsive-grid': `<div class="grid-container">
  <div class="grid-item">Item 1</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
  <div class="grid-item">Item 4</div>
  <!-- Add more items as needed -->
</div>`,
  'holy-grail': `<div class="grid-container">
  <header class="header">Header</header>
  <aside class="sidebar">Sidebar</aside>
  <main class="main">Main Content</main>
  <aside class="aside">Aside</aside>
  <footer class="footer">Footer</footer>
</div>`,
  'dashboard': `<div class="grid-container">
  <header class="header">Dashboard Header</header>
  <aside class="sidebar">Navigation</aside>
  <main class="main">Main Content</main>
  <section class="stats">Statistics</section>
  <footer class="footer">Footer</footer>
</div>`,
  'masonry-sim': `<div class="grid-container">
  <div class="grid-item">Item 1</div>
  <div class="grid-item wide">Item 2 (Wide)</div>
  <div class="grid-item tall">Item 3 (Tall)</div>
  <div class="grid-item">Item 4</div>
  <div class="grid-item big">Item 5 (Big)</div>
  <div class="grid-item">Item 6</div>
  <!-- Add more items as needed -->
</div>`,
  'card-layout': `<div class="grid-container">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <!-- Add more cards as needed -->
</div>`,
  'magazine': `<div class="grid-container">
  <header class="title">Article Title</header>
  <div class="image">Featured Image</div>
  <article class="content">Main Content</article>
  <aside class="sidebar">Related Articles</aside>
  <footer class="footer">Article Footer</footer>
</div>`,
  'asymmetric': `<div class="grid-container">
  <div class="grid-item feature">Featured Item</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
  <div class="grid-item wide">Item 4 (Wide)</div>
  <div class="grid-item tall">Item 5 (Tall)</div>
  <div class="grid-item">Item 6</div>
  <!-- Add more items as needed -->
</div>`,
  'mosaic': `<div class="grid-container">
  <div class="grid-item feature">Feature</div>
  <div class="grid-item wide-1">Wide 1</div>
  <div class="grid-item wide-2">Wide 2</div>
  <div class="grid-item tall-1">Tall 1</div>
  <div class="grid-item">Item 5</div>
  <div class="grid-item big">Big Item</div>
  <div class="grid-item">Item 7</div>
  <div class="grid-item">Item 8</div>
</div>`,
  'portfolio': `<div class="grid-container">
  <div class="project wide">Project 1 (Wide)</div>
  <div class="project">Project 2</div>
  <div class="project tall">Project 3 (Tall)</div>
  <div class="project">Project 4</div>
  <div class="project">Project 5</div>
  <div class="project wide">Project 6 (Wide)</div>
  <!-- Add more projects as needed -->
</div>`,
  'app-layout': `<div class="grid-container">
  <nav class="nav">Navigation Bar</nav>
  <aside class="sidebar">App Sidebar</aside>
  <main class="content">Main Content Area</main>
  <div class="tools">Tools Panel</div>
  <footer class="footer">App Footer</footer>
</div>`,
  'photo-gallery': `<div class="grid-container">
  <div class="photo wide">Photo 1 (Wide)</div>
  <div class="photo">Photo 2</div>
  <div class="photo tall">Photo 3 (Tall)</div>
  <div class="photo">Photo 4</div>
  <div class="photo big">Photo 5 (Big)</div>
  <div class="photo">Photo 6</div>
  <!-- Add more photos as needed -->
</div>`,
  'blog-layout': `<div class="grid-container">
  <header class="header">Blog Header</header>
  <main class="main">Blog Posts</main>
  <aside class="sidebar">Blog Sidebar</aside>
  <footer class="footer">Blog Footer</footer>
</div>`,
  'commerce-product': `<div class="grid-container">
  <div class="product-image">Product Images</div>
  <div class="product-details">Product Details</div>
  <div class="product-tabs">Product Tabs</div>
  <div class="related-products">
    <div class="related-item">Related 1</div>
    <div class="related-item">Related 2</div>
    <div class="related-item">Related 3</div>
    <div class="related-item">Related 4</div>
  </div>
</div>`,
  'landing-page': `<div class="grid-container">
  <section class="hero">Hero Section</section>
  <section class="features">
    <div class="feature">Feature 1</div>
    <div class="feature">Feature 2</div>
    <div class="feature">Feature 3</div>
  </section>
  <section class="testimonial">Testimonial</section>
  <section class="cta">Call to Action</section>
  <footer class="footer">Footer</footer>
</div>`,
  'content-sidebar': `<div class="grid-container">
  <header class="header">Header</header>
  <main class="content">Main Content</main>
  <aside class="sidebar">Sidebar</aside>
  <footer class="footer">Footer</footer>
</div>`,
  'sidebar-content': `<div class="grid-container">
  <header class="header">Header</header>
  <aside class="sidebar">Sidebar</aside>
  <main class="content">Main Content</main>
  <footer class="footer">Footer</footer>
</div>`,
  'equal-height-columns': `<div class="grid-container">
  <div class="column">Column 1 with minimal content</div>
  <div class="column">Column 2 with more content that might wrap to multiple lines</div>
  <div class="column">Column 3 with moderate content</div>
</div>`
};

// CategoryPill component
const CategoryPill = ({ label, active, onClick, theme, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all flex items-center gap-1.5 ${
        active
          ? theme === 'dark'
            ? 'bg-blue-600 text-white'
            : 'bg-blue-500 text-white'
          : theme === 'dark'
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {icon && icon}
      {label}
    </button>
  );
};

// CodeDisplay component
const CodeDisplay = ({ code, theme, language = 'css', onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
    if (onCopy) onCopy();
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      <pre
        className={`p-4 overflow-auto max-h-72 text-sm font-mono ${
          theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'
        }`}
      >
        <code className="relative">
          {code.split('\n').map((line, i) => (
            <div key={i} className="table-row">
              <span
                className={`table-cell pr-4 text-right select-none opacity-50 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {i + 1}
              </span>
              <span className="table-cell">{line}</span>
            </div>
          ))}
        </code>
      </pre>
      <button
        onClick={handleCopy}
        className={`absolute top-2 right-2 p-1.5 rounded-md transition-colors duration-200 bg-opacity-80 ${
          theme === 'dark'
            ? 'text-gray-400 hover:text-gray-100 bg-gray-800 hover:bg-gray-700'
            : 'text-gray-500 hover:text-gray-800 bg-gray-200 hover:bg-gray-300'
        }`}
        title="Copy to clipboard"
        aria-label="Copy code to clipboard"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
};

// GridPreview component to render interactive grid previews
const GridPreview = ({ layout, theme }) => {
  const getGridStyles = () => {
    switch (layout) {
      case 'simple-columns-2':
        return {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          height: '100%'
        };
      case 'simple-columns-3':
        return {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          height: '100%'
        };
      case 'simple-columns-4':
        return {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '8px',
          height: '100%'
        };
      case 'responsive-grid':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
          gap: '8px',
          height: '100%'
        };
      case 'holy-grail':
        return {
          display: 'grid',
          gridTemplateAreas: '"header header header" "sidebar main aside" "footer footer footer"',
          gridTemplateColumns: '1fr 3fr 1fr',
          gridTemplateRows: 'auto 1fr auto',
          gap: '8px',
          height: '100%'
        };
      case 'dashboard':
        return {
          display: 'grid',
          gridTemplateAreas: '"header header header header" "sidebar main main main" "sidebar stats stats stats" "footer footer footer footer"',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gridTemplateRows: 'auto 1fr 1fr auto',
          gap: '8px',
          height: '100%'
        };
      case 'masonry-sim':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: '30px',
          gap: '8px',
          gridAutoFlow: 'dense',
          height: '100%'
        };
      case 'mosaic':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 25%)',
          gap: '8px',
          height: '100%'
        };
      default:
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          height: '100%'
        };
    }
  };

// Continuation of the renderGridItems function in GridPreview component
const renderGridItems = () => {
    switch (layout) {
      case 'simple-columns-2':
        return [0, 1].map(i => (
          <div
            key={i}
            className={`rounded flex items-center justify-center ${
              theme === 'dark' ? 'bg-blue-800 text-blue-200' : 'bg-blue-200 text-blue-800'
            }`}
          >
            {i + 1}
          </div>
        ));
      case 'simple-columns-3':
        return [0, 1, 2].map(i => (
          <div
            key={i}
            className={`rounded flex items-center justify-center ${
              theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-200 text-green-800'
            }`}
          >
            {i + 1}
          </div>
        ));
      case 'simple-columns-4':
        return [0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`rounded flex items-center justify-center ${
              theme === 'dark' ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-200 text-yellow-800'
            }`}
          >
            {i + 1}
          </div>
        ));
      case 'responsive-grid':
        return [0, 1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`rounded flex items-center justify-center ${
              theme === 'dark' ? 'bg-purple-800 text-purple-200' : 'bg-purple-200 text-purple-800'
            }`}
          >
            {i + 1}
          </div>
        ));
      case 'holy-grail':
        return (
          <>
            <div
              style={{ gridArea: 'header' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-300 text-green-800'
              }`}
            >
              Header
            </div>
            <div
              style={{ gridArea: 'sidebar' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-300 text-green-800'
              }`}
            >
              Sidebar
            </div>
            <div
              style={{ gridArea: 'main' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-green-700 text-green-100' : 'bg-green-200 text-green-800'
              }`}
            >
              Main
            </div>
            <div
              style={{ gridArea: 'aside' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-300 text-green-800'
              }`}
            >
              Aside
            </div>
            <div
              style={{ gridArea: 'footer' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-300 text-green-800'
              }`}
            >
              Footer
            </div>
          </>
        );
      case 'dashboard':
        return (
          <>
            <div
              style={{ gridArea: 'header' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-pink-800 text-pink-200' : 'bg-pink-300 text-pink-800'
              }`}
            >
              Header
            </div>
            <div
              style={{ gridArea: 'sidebar' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-pink-800 text-pink-200' : 'bg-pink-200 text-pink-800'
              }`}
            >
              Sidebar
            </div>
            <div
              style={{ gridArea: 'main' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-pink-700 text-pink-100' : 'bg-pink-100 text-pink-800'
              }`}
            >
              Main
            </div>
            <div
              style={{ gridArea: 'stats' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-pink-800 text-pink-200' : 'bg-pink-200 text-pink-800'
              }`}
            >
              Stats
            </div>
            <div
              style={{ gridArea: 'footer' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-pink-800 text-pink-200' : 'bg-pink-300 text-pink-800'
              }`}
            >
              Footer
            </div>
          </>
        );
      case 'masonry-sim':
        return (
          <>
            <div
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-orange-800 text-orange-200' : 'bg-orange-200 text-orange-800'
              }`}
            >
              1
            </div>
            <div
              style={{ gridColumn: 'span 2' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-orange-700 text-orange-200' : 'bg-orange-300 text-orange-800'
              }`}
            >
              2 (wide)
            </div>
            <div
              style={{ gridRow: 'span 2' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-orange-700 text-orange-200' : 'bg-orange-300 text-orange-800'
              }`}
            >
              3 (tall)
            </div>
            <div
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-orange-800 text-orange-200' : 'bg-orange-200 text-orange-800'
              }`}
            >
              4
            </div>
            <div
              style={{ gridColumn: 'span 2', gridRow: 'span 2' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-orange-600 text-orange-100' : 'bg-orange-400 text-orange-900'
              }`}
            >
              5 (big)
            </div>
          </>
        );
      case 'mosaic':
        return (
          <>
            <div
              style={{ gridColumn: '1 / 3', gridRow: '1 / 3' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-teal-700 text-teal-100' : 'bg-teal-300 text-teal-800'
              }`}
            >
              Feature
            </div>
            <div
              style={{ gridColumn: '3 / 5' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-teal-800 text-teal-200' : 'bg-teal-200 text-teal-800'
              }`}
            >
              Wide 1
            </div>
            <div
              style={{ gridColumn: '1 / 3' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-teal-800 text-teal-200' : 'bg-teal-200 text-teal-800'
              }`}
            >
              Wide 2
            </div>
            <div
              style={{ gridColumn: '3', gridRow: '2 / 4' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-teal-800 text-teal-200' : 'bg-teal-200 text-teal-800'
              }`}
            >
              Tall 1
            </div>
            <div
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-teal-800 text-teal-200' : 'bg-teal-200 text-teal-800'
              }`}
            >
              Item 5
            </div>
            <div
              style={{ gridColumn: '1 / 3', gridRow: '3 / 5' }}
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-teal-700 text-teal-100' : 'bg-teal-300 text-teal-800'
              }`}
            >
              Big Item
            </div>
          </>
        );
      default:
        return (
          <>
            <div
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
              }`}
            >
              1
            </div>
            <div
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
              }`}
            >
              2
            </div>
            <div
              className={`rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
              }`}
            >
              3
            </div>
          </>
        );
    }
  };
  
    return (
      <div 
        className={`border rounded-lg p-2 h-40 ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'
        }`}
      >
        <div style={getGridStyles()}>
          {renderGridItems()}
        </div>
      </div>
    );
  };
  
  // GridCard component to display each grid layout option
  const GridCard = ({ id, theme, onSelect, isSelected }) => {
    return (
      <div 
        className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
          isSelected 
            ? theme === 'dark' 
              ? 'border-blue-500 shadow-blue-500/40 shadow-lg' 
              : 'border-blue-500 shadow-blue-500/40 shadow-lg'
            : theme === 'dark' 
              ? 'border-gray-700 hover:border-gray-600' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => onSelect(id)}
      >
        <div className="p-3">
          <GridPreview layout={id} theme={theme} />
          <div className="mt-2 flex justify-between items-center">
            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {gridDisplayNames[id]}
            </h3>
            <span 
              className={`text-xs px-2 py-0.5 rounded-full ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {gridCategories[id]}
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  // Tab component for switching between CSS, HTML and Preview
  const Tab = ({ active, label, onClick, theme, icon }) => {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg transition-colors ${
          active
            ? theme === 'dark'
              ? 'bg-gray-800 text-white border-b-2 border-blue-500'
              : 'bg-white text-blue-600 border-b-2 border-blue-500'
            : theme === 'dark'
            ? 'bg-gray-900 text-gray-400 hover:text-gray-200'
            : 'bg-gray-100 text-gray-600 hover:text-gray-800'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };
  
  // GridLibrary main component
  const GridLibrary = () => {
    const [theme, setTheme] = useState('light');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLayout, setSelectedLayout] = useState('simple-columns-2');
    const [activeTab, setActiveTab] = useState('preview');
    const [copySuccess, setCopySuccess] = useState({});
  
    useEffect(() => {
      // Check user preference for dark mode
      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDarkMode ? 'dark' : 'light');
  
      // Add listener for changes in color scheme preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => setTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handleChange);
  
      return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
  
    // Get unique categories
    const uniqueCategories = ['all', ...new Set(Object.values(gridCategories))];
  
    // Filter layouts based on search and category
    const filteredLayouts = Object.keys(gridCategories).filter((id) => {
      const matchesSearch = 
        gridDisplayNames[id].toLowerCase().includes(searchTerm.toLowerCase()) ||
        gridCategories[id].toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || gridCategories[id] === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  
    // Handle copy success
    const handleCopySuccess = (type) => {
      setCopySuccess({ ...copySuccess, [type]: true });
      setTimeout(() => {
        setCopySuccess({ ...copySuccess, [type]: false });
      }, 2000);
    };
  
    // Export layout code
    const handleExport = () => {
      const css = gridSnippets[selectedLayout];
      const html = gridUsageExamples[selectedLayout];
      
      // Create downloadable text file
      const content = `/* CSS */\n${css}\n\n<!-- HTML -->\n${html}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `grid-layout-${selectedLayout}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
  
    // Toggle theme
    const toggleTheme = () => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    };
  
    return (
      <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <GridIcon size={28} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                <span>CSS Grid Layout Library</span>
              </h1>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>
            </div>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Browse and copy common CSS grid layouts for your projects.
            </p>
          </header>
  
          {/* Search and filter section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                </div>
                <input
                  type="text"
                  placeholder="Search layouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
  
            {/* Category filters */}
            <div className="flex gap-2 flex-wrap">
              {uniqueCategories.map((category) => (
                <CategoryPill
                  key={category}
                  label={category.charAt(0).toUpperCase() + category.slice(1)}
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  theme={theme}
                />
              ))}
            </div>
          </div>
  
          {/* Grid layouts grid view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {filteredLayouts.map((id) => (
              <GridCard
                key={id}
                id={id}
                theme={theme}
                onSelect={setSelectedLayout}
                isSelected={selectedLayout === id}
              />
            ))}
          </div>
  
          {/* Selected layout section */}
          {selectedLayout && (
            <div className={`rounded-lg border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
            }`}>
              <div className="p-4 border-b flex justify-between items-center flex-wrap gap-2 ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
              }">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Layout size={20} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                    {gridDisplayNames[selectedLayout]}
                  </h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Category: {gridCategories[selectedLayout]}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExport}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Download size={16} />
                    Export
                  </button>
                  <button
                    onClick={() => {
                      copyToClipboard(gridSnippets[selectedLayout] + '\n\n' + gridUsageExamples[selectedLayout]);
                      handleCopySuccess('all');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md ${
                      theme === 'dark'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {copySuccess['all'] ? <Check size={16} /> : <Copy size={16} />}
                    Copy All
                  </button>
                </div>
              </div>
  
              {/* Tabs section */}
              <div className="flex border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}">
                <Tab
                  label="Preview"
                  active={activeTab === 'preview'}
                  onClick={() => setActiveTab('preview')}
                  theme={theme}
                  icon={<Maximize size={16} />}
                />
                <Tab
                  label="CSS"
                  active={activeTab === 'css'}
                  onClick={() => setActiveTab('css')}
                  theme={theme}
                  icon={<Columns size={16} />}
                />
                <Tab
                  label="HTML"
                  active={activeTab === 'html'}
                  onClick={() => setActiveTab('html')}
                  theme={theme}
                  icon={<Rows size={16} />}
                />
              </div>
  
              {/* Tab content */}
              <div className="p-4">
                {activeTab === 'preview' && (
                  <div className="h-64">
                    <GridPreview layout={selectedLayout} theme={theme} />
                  </div>
                )}
                {activeTab === 'css' && (
                  <CodeDisplay 
                    code={gridSnippets[selectedLayout]} 
                    language="css" 
                    theme={theme} 
                    onCopy={() => handleCopySuccess('css')}
                  />
                )}
                {activeTab === 'html' && (
                  <CodeDisplay 
                    code={gridUsageExamples[selectedLayout]} 
                    language="html" 
                    theme={theme}
                    onCopy={() => handleCopySuccess('html')}
                  />
                )}
              </div>
  
              {/* Info section */}
              <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                <div className="flex items-start gap-2">
                  <Info size={20} className={`mt-0.5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <h3 className="font-medium">Usage tips:</h3>
                    <ul className={`list-disc pl-5 mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedLayout === 'responsive-grid' && (
                        <>
                          <li>This grid automatically adjusts columns based on available space</li>
                          <li>Modify the 'minmax' value to control minimum column width</li>
                        </>
                      )}
                      {selectedLayout === 'holy-grail' && (
                        <>
                          <li>Classic layout pattern with header, footer, main content and two sidebars</li>
                          <li>Adjust the grid-template-columns ratio to change sidebar widths</li>
                        </>
                      )}
                      {selectedLayout === 'masonry-sim' && (
                        <>
                          <li>Use class combinations to create masonry-like layouts</li>
                          <li>Add 'wide', 'tall', and 'big' classes to items</li>
                          <li>For real masonry, consider a dedicated library</li>
                        </>
                      )}
                      {(selectedLayout === 'asymmetric' || selectedLayout === 'mosaic') && (
                        <>
                          <li>Create visual interest with varied item sizes</li>
                          <li>Combine with auto-placement for dynamic layouts</li>
                        </>
                      )}
                      {selectedLayout === 'equal-height-columns' && (
                        <>
                          <li>All columns maintain equal height regardless of content</li>
                          <li>Great for cards or sections that should align perfectly</li>
                        </>
                      )}
                      {!['responsive-grid', 'holy-grail', 'masonry-sim', 'asymmetric', 'mosaic', 'equal-height-columns'].includes(selectedLayout) && (
                        <>
                          <li>Copy both CSS and HTML to get started</li>
                          <li>Customize the grid properties to fit your design needs</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
  
          {/* Footer */}
          <footer className={`mt-12 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>CSS Grid Layout Library © 2025 • Built with React and Tailwind CSS</p>
          </footer>
        </div>
      </div>
    );
  };
  
  export default GridLibrary;