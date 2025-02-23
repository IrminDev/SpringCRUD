import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import loginService from "./services/login.service";
import LoginResponse from "./model/response/LoginResponse";
import ErrorResponse from "./model/response/ErrorResponse";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    
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
      setError("An error occurred during login");
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-white"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 pl-10 border rounded-md"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 pl-10 border rounded-md"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md">
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account? <Link to={'/signup'} className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
