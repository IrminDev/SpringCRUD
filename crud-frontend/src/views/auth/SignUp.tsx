import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, User, Mail, Book } from "lucide-react";
import UserData from "../../model/User";
import signupService from "../../services/signup.service";
import { useNavigate, Link } from "react-router-dom";

export default function SignUpForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check for dark mode on component mount
  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDarkMode);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");

    signupService.signUp(formData)
      .then((response) => {
        const user: UserData = response.user;
        const token: string = response.token;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        if(user.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.log(error);
        setError("An error occurred during sign up");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-b from-slate-800 to-slate-900' 
        : 'bg-gradient-to-b from-indigo-50 to-white'
    }`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {darkMode ? (
          <>
            <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 opacity-20 blur-3xl"></div>
            <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-purple-800 to-indigo-700 opacity-20 blur-3xl"></div>
          </>
        ) : (
          <>
            <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-20 blur-3xl"></div>
            <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-indigo-300 to-pink-300 opacity-20 blur-3xl"></div>
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
              Join BookNexus
            </h2>
            <p className={`mt-2 transition-colors duration-500 ${
              darkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              Create an account to start your reading journey
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
              <label htmlFor="name" className={`text-sm font-medium block transition-colors duration-500 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className={`w-full px-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'border-gray-300 text-gray-900'
                  }`}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className={`text-sm font-medium block transition-colors duration-500 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
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
              <label htmlFor="password" className={`text-sm font-medium block transition-colors duration-500 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Password
              </label>
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
              <p className={`text-xs mt-1 transition-colors duration-500 ${
                darkMode ? 'text-slate-500' : 'text-gray-500'
              }`}>
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className={`ml-2 block text-sm transition-colors duration-500 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                I agree to the <a href="#" className="text-indigo-500 hover:text-indigo-400">Terms of Service</a> and <a href="#" className="text-indigo-500 hover:text-indigo-400">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <p className={`mt-8 text-center transition-colors duration-500 ${
            darkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            Already have an account?{" "}
            <Link to="/sign-in" className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>

        <div className="text-center mt-6 text-sm">
          <Link to="/" className={`flex items-center justify-center transition-colors duration-500 ${
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