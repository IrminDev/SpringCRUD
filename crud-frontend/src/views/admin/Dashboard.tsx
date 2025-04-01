import React, { useState, useEffect } from "react";
import { FiUsers, FiBook, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import User from "../../model/User";
import listService from "../../services/list.service";
import ErrorResponse from "../../model/response/ErrorResponse";
import ListUserResponse from "../../model/response/user/ListUserResponse";

interface DashboardProps {
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode }) => {
  const [usersCount, setUsersCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token: string = localStorage.getItem("token") || '';
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: ListUserResponse = await listService.listUser(token);
        setUsersCount(response.users.content.length);
        
        // Get last 5 users for recent users display
        const sortedUsers = [...response.users.content].sort((a, b) => b.id - a.id);
        setRecentUsers(sortedUsers.slice(0, 5));
      } catch (error) {
        const err = error as ErrorResponse;
        setError(err.message);
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [token]);

  return (
    <div>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Admin Dashboard
        </h1>
        <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Welcome back! Manage your book recommendation platform.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className={`rounded-xl p-6 ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${
                darkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>Total Users</p>
              <h3 className={`text-2xl font-bold mt-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {loading ? "Loading..." : usersCount}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${
              darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'
            }`}>
              <FiUsers className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-6 ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${
                darkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>Book Catalog</p>
              <h3 className={`text-2xl font-bold mt-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Coming Soon
              </h3>
            </div>
            <div className={`p-3 rounded-full ${
              darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
            }`}>
              <FiBook className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-6 ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${
                darkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>Admin Access</p>
              <h3 className={`text-2xl font-bold mt-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Full Access
              </h3>
            </div>
            <div className={`p-3 rounded-full ${
              darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}>
              <FiUser className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`p-6 mb-6 rounded-xl ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <h2 className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/users" className={`p-4 rounded-lg flex items-center transition-all ${
            darkMode 
              ? 'bg-slate-700 hover:bg-slate-600' 
              : 'bg-indigo-50 hover:bg-indigo-100'
          }`}>
            <FiUsers className="h-6 w-6 mr-3 text-indigo-500" />
            <div>
              <span className={`font-medium block ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Manage Users</span>
              <span className={`text-xs ${
                darkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>View, edit or delete user accounts</span>
            </div>
          </Link>
          <Link to="/admin/books" className={`p-4 rounded-lg flex items-center transition-all ${
            darkMode 
              ? 'bg-slate-700 hover:bg-slate-600' 
              : 'bg-indigo-50 hover:bg-indigo-100'
          }`}>
            <FiBook className="h-6 w-6 mr-3 text-purple-500" />
            <div>
              <span className={`font-medium block ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Book Catalog</span>
              <span className={`text-xs ${
                darkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>Coming soon</span>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Recent Users */}
      <div className={`rounded-xl overflow-hidden ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className={`px-6 py-4 border-b ${
          darkMode ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>Recent Users</h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className={`text-center py-4 ${
              darkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              Loading users...
            </div>
          ) : error ? (
            <div className={`text-center py-4 text-red-500`}>
              {error}
            </div>
          ) : recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      ID
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Name
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Email
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  darkMode ? 'divide-slate-700' : 'divide-gray-200'
                }`}>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-slate-300' : 'text-gray-900'
                      }`}>
                        {user.id}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-slate-300' : 'text-gray-900'
                      }`}>
                        {user.name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-slate-300' : 'text-gray-900'
                      }`}>
                        {user.email}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-slate-300' : 'text-gray-900'
                      }`}>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ADMIN' 
                            ? (darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800') 
                            : (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`text-center py-4 ${
              darkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              No users found.
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Link 
              to="/admin/users" 
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                darkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              View All Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;