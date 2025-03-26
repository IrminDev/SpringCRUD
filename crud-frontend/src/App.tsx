import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/index/Header';
import Home from './components/index/Home';
import Footer from './components/index/Footer';
import SearchResults from './views/SearchResults';
import BookDetail from './views/BookDetail';
import SignIn from './views/auth/SignIn';
import SignUp from './views/auth/SignUp';

const App: React.FC = () => {
  // Initialize dark mode based on system preference or saved preference
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  
  // Toggle dark mode function to pass to Header component
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  // Update HTML class and localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col transition-colors duration-500 dark:bg-slate-900">
        <Header darkMode={darkMode} toggleTheme={toggleTheme} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/search" element={<SearchResults darkMode={darkMode} />} />
            <Route path="/book/:id" element={<BookDetail darkMode={darkMode} />} />
          </Routes>
        </main>
        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
};

export default App;