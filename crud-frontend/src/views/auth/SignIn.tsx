import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, User, Book } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import loginService from "../../services/login.service";
import LoginResponse from "../../model/response/auth/LoginResponse";
import ErrorResponse from "../../model/response/ErrorResponse";

export default function LoginForm() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Check for dark mode on component mount
  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDarkMode);
  }, []);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    loginService.login(formData).then((response: LoginResponse) => {
      const user = response.user;
      const token = response.token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      if(user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }).catch((error: ErrorResponse) => {
      setError("Invalid email or password. Please try again.");
    }).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-b from-slate-800 to-slate-900' 
        : 'bg-gradient-to-b from-indigo-50 to-white'
    }`}>
      <div className="absolute inset-0 overflow-hidden">
        {darkMode ? (
          <>
            <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 opacity-20 blur-3xl"></div>
            <div className="absolute right-1/3 bottom-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-purple-700 to-indigo-700 opacity-20 blur-3xl"></div>
          </>
        ) : (
          <>
            <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-indigo-300 to-purple-300 opacity-20 blur-3xl"></div>
            <div className="absolute right-1/3 bottom-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-pink-300 to-indigo-300 opacity-20 blur-3xl"></div>
          </>
        )}
      </div>

      <div className="w-full max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`p-8 rounded-2xl shadow-xl transition-colors duration-500 ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-3">
              <Book className="h-10 w-10 text-indigo-500" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Welcome Back
            </h2>
            <p className={`mt-2 transition-colors duration-500 ${
              darkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              Sign in to continue your reading journey
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className={`text-sm font-medium block transition-colors duration-500 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className={`w-full px-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label htmlFor="password" className={`text-sm font-medium block transition-colors duration-500 ${
                  darkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <a href="#" className="text-sm text-indigo-500 hover:text-indigo-400">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className={`w-full px-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm transition-colors duration-500 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className={`mt-8 text-center transition-colors duration-500 ${
            darkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            Don't have an account?{" "}
            <Link to="/sign-up" className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>

        <div className="text-center mt-6 text-sm">
          <Link to="/" className={`text-indigo-500 hover:text-indigo-400 flex items-center justify-center transition-colors duration-500 ${
            darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}