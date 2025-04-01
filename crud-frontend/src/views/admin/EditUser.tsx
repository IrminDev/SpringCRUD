import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiSave, FiX } from "react-icons/fi";
import User from "../../model/User";
import UserResponse from "../../model/response/user/UserResponse";
import ErrorResponse from "../../model/response/ErrorResponse";
import listService from "../../services/list.service";
import updateService from "../../services/update.service";
import UpdateResponse from "../../model/response/user/UpdateResponse";

interface EditUserProps {
  darkMode: boolean;
}

const EditUser: React.FC<EditUserProps> = ({ darkMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const token: string = localStorage.getItem("token") || "";

  useEffect(() => {
    const userLogged: User = JSON.parse(localStorage.getItem("user") || "{ id: 0, name: '', email: '' }");
    if (userLogged.id === 0) {
      navigate("/sign-in");
      return;
    } else if (userLogged.role !== "ADMIN") {
      navigate("/");
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response: UserResponse = await listService.getUser(Number(id), token);
        setUser(response.user);
      } catch (error) {
        const err = error as ErrorResponse;
        setError(err.message || "Failed to load user data");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setSaving(true);
      setError(null);
      const response: UpdateResponse = await updateService.updateUser(Number(id), user, token);
      setSuccess(response.message || "User updated successfully");
      setTimeout(() => {
        navigate("/admin/users");
      }, 1500);
    } catch (error) {
      const err = error as ErrorResponse;
      setError(err.message || "Failed to update user");
      console.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-16">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
          darkMode ? 'border-indigo-400' : 'border-indigo-600'
        }`}></div>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className={`p-6 rounded-lg ${
        darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-800'
      }`}>
        <h3 className="text-lg font-medium">User not found</h3>
        <p className="mt-2">The user you're trying to edit doesn't exist or you don't have permission to access it.</p>
        <Link 
          to="/admin/users"
          className={`mt-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
            darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50 border border-gray-300'
          }`}
        >
          <FiArrowLeft className="mr-2" /> Back to User Management
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Edit User
        </h1>
        <Link 
          to="/admin/users"
          className={`inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
            darkMode 
              ? 'bg-slate-800 hover:bg-slate-700 text-white'
              : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
          }`}
        >
          <FiArrowLeft className="mr-2 -ml-1" />
          Back to Users
        </Link>
      </div>

      {error && (
        <div className={`mb-6 p-4 rounded-md ${
          darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-800'
        }`}>
          {error}
        </div>
      )}

      {success && (
        <div className={`mb-6 p-4 rounded-md ${
          darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-800'
        }`}>
          {success}
        </div>
      )}

      <div className={`rounded-xl shadow-sm overflow-hidden ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className={`px-6 py-4 border-b ${
          darkMode ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-medium ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            User Information
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={user?.name || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={user?.email || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'border-gray-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div>
              <label htmlFor="role" className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Role
              </label>
              <div className={`px-3 py-2 rounded-md ${
                darkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user?.role === 'ADMIN' 
                    ? (darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800') 
                    : (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                }`}>
                  {user?.role || "USER"}
                </span>
                <span className={`text-xs ml-2 ${
                  darkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  (Role cannot be changed)
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="id" className={`block text-sm font-medium mb-1 ${
                darkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                User ID
              </label>
              <div className={`px-3 py-2 rounded-md ${
                darkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                {user?.id || ""}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                darkMode 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <FiX className="mr-2 -ml-1" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                saving 
                  ? 'bg-indigo-400 cursor-not-allowed text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 -ml-1"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2 -ml-1" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;