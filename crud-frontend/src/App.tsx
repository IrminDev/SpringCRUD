import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/index/Header';
import Footer from './components/index/Footer';
import Home from './components/index/Home';
import SearchResults from './views/SearchResults';
import BookDetail from './views/BookDetail';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './views/admin/Dashboard';
import UserManagement from './views/admin/UserManagement';
import EditUser from './views/admin/EditUser';
import SignIn from './views/auth/SignIn';
import SignUp from './views/auth/SignUp';
import UserProfile from './views/UserProfile';

// Wrapper for public routes with Header and Footer
const PublicLayout = ({ darkMode, toggleTheme, children }: { darkMode: boolean, toggleTheme: () => void, children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 dark:bg-slate-900">
      <Header darkMode={darkMode} toggleTheme={toggleTheme} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
};

// Protected route for regular users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  // Initialize dark mode based on system preference or saved preference
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  
  // Toggle dark mode function
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
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            <PublicLayout darkMode={darkMode} toggleTheme={toggleTheme}>
              <Home darkMode={darkMode} />
            </PublicLayout>
          } 
        />
        <Route 
          path="/search" 
          element={
            <PublicLayout darkMode={darkMode} toggleTheme={toggleTheme}>
              <SearchResults darkMode={darkMode} />
            </PublicLayout>
          } 
        />
        <Route 
          path="/book/:id" 
          element={
            <PublicLayout darkMode={darkMode} toggleTheme={toggleTheme}>
              <BookDetail darkMode={darkMode} />
            </PublicLayout>
          } 
        />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        
        {/* Protected user route */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <PublicLayout darkMode={darkMode} toggleTheme={toggleTheme}>
                <UserProfile darkMode={darkMode} />
              </PublicLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes - uses the AdminLayout directly */}
        <Route 
          path="/admin" 
          element={<AdminLayout darkMode={darkMode} toggleTheme={toggleTheme} />}
        >
          <Route index element={<Dashboard darkMode={darkMode} />} />
          <Route path="users" element={<UserManagement darkMode={darkMode} />} />
          <Route path="users/edit/:id" element={<EditUser darkMode={darkMode} />} />
          {/* Add more admin routes as needed */}
        </Route>
        
        {/* Catch-all route for 404 */}
        <Route 
          path="*" 
          element={
            <PublicLayout darkMode={darkMode} toggleTheme={toggleTheme}>
              <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-center">
                  <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    404 - Page Not Found
                  </h1>
                  <p className={`mb-6 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    The page you're looking for doesn't exist.
                  </p>
                  <a 
                    href="/" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            </PublicLayout>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;