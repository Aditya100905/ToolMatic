# ToolMatic - All-in-One Utility Web App

A comprehensive React-based utility web application that consolidates a wide range of tools—from PDF utilities and text tools to mathematical solvers and web developer tools—all in one place. Built with `react-router-dom` for routing and includes light/dark theming, toast notifications, and a responsive layout.

## 🌐 Live Preview

> www.demo.toolmatic.com

## 🛠️ Features

### 📁 General Utilities

- Text Cleaner
- Text Comparison
- QR Code Generator
- URL Shortener
- Currency Converter
- Password Generator

### 📄 PDF Tools

- Merge PDF
- Split PDF
- Compress PDF
- Convert PDF to Images
- Convert Images to PDF
- Reorder PDF Pages

### 📊 Maths Tools

- Matrix Solver
- Complex Number Calculator
- Graph Plotter
- Scientific Calculator
- Statistics & Probability Tool

### 🎨 Design Tools

- CSS Animations Viewer
- CSS Grid Templates
- CSS Gradient Generator
- Typewriter Effect Generator

### 💻 Developer Tools

- Markdown to HTML Converter
- JSON Formatter
- JSON/CSV/XML Converter

### 📋 Other Pages

- Home
- About
- Contact
- 404 Not Found Page

## 🚀 Tech Stack

- **React** (with hooks and context API)
- **React Router DOM** for routing
- **React Toastify** for toast notifications
- **Tailwind CSS / CSS utility classes** for theming
- **Modular Component Architecture**

## 🧩 Folder Structure

```
src/
├── App.jsx
├── routes.js
├── components/
│   └── Navbar.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   └── NotFound.jsx
├── categories/
│   ├── general/
│   ├── PDFTools/
│   ├── Maths/
│   ├── Design/
│   └── developer/
└── ThemeProvider.jsx
```

## 🧠 Contexts Used

- `SearchContext` – For managing global search functionality
- `ThemeHistoryContext` – For tracking theme transitions
- `ScrollContext` – To manage scroll behavior on navigation

## ✅ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aditya100905/ToolMatic.git
   cd toolmatic
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
