import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiBookOpen, FiEdit, FiHeart, FiBookmark, FiBook, FiList, FiLogOut } from "react-icons/fi";
import User from "../model/User";
import listService from "../services/list.service";
import UserResponse from "../model/response/user/UserResponse";
import ErrorResponse from "../model/response/ErrorResponse";

interface UserProfileProps {
  darkMode: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ darkMode }) => {
  const userLogged: User = JSON.parse(localStorage.getItem("user") || '{id: 0, name: "", email: "", role: ""}');
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock data for user statistics
  const [stats] = useState({
    booksRead: 12,
    booksInProgress: 3,
    wishlist: 24,
    reviews: 8
  });

  useEffect(() => {
    if(userLogged.id === 0) {
      navigate("/");
      return;
    } else if(userLogged.role !== "USER") {
      navigate("/admin");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response: UserResponse = await listService.getUser(userLogged.id, token);
        setUser(response.user);
      } catch (error) {
        const err = error as ErrorResponse;
        setError(err.message);
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
          darkMode ? 'border-indigo-400' : 'border-indigo-600'
        }`}></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${
        darkMode ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className={`p-8 rounded-xl shadow-md max-w-md w-full text-center ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <FiUser className={`mx-auto h-12 w-12 mb-4 ${
            darkMode ? 'text-red-400' : 'text-red-500'
          }`} />
          <h2 className={`text-2xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>User Not Found</h2>
          <p className={`mb-6 ${
            darkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>{error || "We couldn't find your profile information."}</p>
          <button 
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-b from-slate-900 to-slate-800' 
        : 'bg-gradient-to-b from-indigo-50 to-white'
    }`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {darkMode ? (
          <>
            <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 opacity-20 blur-3xl"></div>
            <div className="absolute left-1/3 bottom-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-purple-800 to-indigo-700 opacity-20 blur-3xl"></div>
          </>
        ) : (
          <>
            <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-20 blur-3xl"></div>
            <div className="absolute left-1/3 bottom-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-indigo-300 to-pink-300 opacity-20 blur-3xl"></div>
          </>
        )}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Welcome, {user.name}
            </span>
          </h1>
          <p className={`text-lg ${
            darkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Manage your reading journey and discover new favorites
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`rounded-xl shadow-lg overflow-hidden ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}
          >
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className={`w-24 h-24 rounded-full mb-4 flex items-center justify-center ${
                  darkMode ? 'bg-indigo-900' : 'bg-indigo-100'
                }`}>
                  <FiUser className={`h-12 w-12 ${
                    darkMode ? 'text-indigo-300' : 'text-indigo-600'
                  }`} />
                </div>
                <h2 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>{user.name}</h2>
                <div className="flex items-center mt-1">
                  <FiMail className={`h-4 w-4 mr-2 ${
                    darkMode ? 'text-slate-400' : 'text-gray-500'
                  }`} />
                  <p className={`${
                    darkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}>{user.email}</p>
                </div>
              </div>

              <div className={`border-t pt-6 ${
                darkMode ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <h3 className={`text-lg font-medium mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Reading Stats</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      darkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`}>{stats.booksRead}</div>
                    <div className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>Books Read</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      darkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`}>{stats.booksInProgress}</div>
                    <div className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      darkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`}>{stats.wishlist}</div>
                    <div className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>Wishlist</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      darkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`}>{stats.reviews}</div>
                    <div className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>Reviews</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={handleLogout} 
                  className={`w-full flex items-center justify-center px-4 py-2 border rounded-md ${
                    darkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600' 
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                  }`}
                >
                  <FiLogOut className="mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>

          {/* Reading Activity and Bookshelves */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`col-span-1 lg:col-span-2 rounded-xl shadow-lg overflow-hidden ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}
          >
            <div className={`px-6 py-4 border-b ${
              darkMode ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                My Bookshelves
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: <FiBookOpen className="h-5 w-5" />, title: "Currently Reading", count: stats.booksInProgress },
                  { icon: <FiBook className="h-5 w-5" />, title: "Completed Books", count: stats.booksRead },
                  { icon: <FiBookmark className="h-5 w-5" />, title: "Want to Read", count: stats.wishlist },
                  { icon: <FiList className="h-5 w-5" />, title: "My Reviews", count: stats.reviews }
                ].map((shelf, index) => (
                  <div 
                    key={index}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
                      darkMode 
                        ? 'bg-slate-700 hover:bg-slate-600' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => navigate(`/shelf/${shelf.title.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    <div className={`p-3 rounded-full mr-4 ${
                      darkMode ? 'bg-slate-600' : 'bg-indigo-100'
                    }`}>
                      <span className={darkMode ? 'text-indigo-300' : 'text-indigo-600'}>
                        {shelf.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{shelf.title}</h4>
                      <p className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>{shelf.count} books</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <h3 className={`text-lg font-medium mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Recent Activity</h3>
                
                <div className={`rounded-lg ${
                  darkMode ? 'bg-slate-700' : 'bg-gray-50'
                }`}>
                  {[
                    { action: "Finished reading", book: "The Silent Patient", date: "2 days ago", icon: <FiBook /> },
                    { action: "Added to wishlist", book: "Atomic Habits", date: "1 week ago", icon: <FiHeart /> },
                    { action: "Posted a review", book: "The Midnight Library", date: "2 weeks ago", icon: <FiEdit /> }
                  ].map((activity, index) => (
                    <div 
                      key={index}
                      className={`flex items-start p-4 ${
                        index !== 2 ? (darkMode ? 'border-b border-slate-600' : 'border-b border-gray-200') : ''
                      }`}
                    >
                      <div className={`p-2 rounded-full mr-4 ${
                        darkMode ? 'bg-slate-600' : 'bg-indigo-100'
                      }`}>
                        <span className={darkMode ? 'text-indigo-300' : 'text-indigo-600'}>
                          {activity.icon}
                        </span>
                      </div>
                      <div>
                        <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                          {activity.action} <span className="font-medium">"{activity.book}"</span>
                        </p>
                        <p className={`text-sm ${
                          darkMode ? 'text-slate-400' : 'text-gray-500'
                        }`}>{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => navigate("/search")}
                  className={`inline-flex items-center px-4 py-2 rounded-md ${
                    darkMode 
                      ? 'bg-indigo-700 hover:bg-indigo-800 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <FiBook className="mr-2" />
                  Discover New Books
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;