import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiUser, FiSearch, FiAlertCircle } from 'react-icons/fi';
import User from '../../model/User';
import listService from '../../services/list.service';
import deleteService from '../../services/delete.service';
import ListUserResponse from '../../model/response/user/ListUserResponse';
import ErrorResponse from '../../model/response/ErrorResponse';

interface UserManagementProps {
  darkMode: boolean;
}

const UserManagement: React.FC<UserManagementProps> = ({ darkMode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const token: string = localStorage.getItem("token") || '';
  
  useEffect(() => {
    fetchUsers();
  }, [token]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          user => 
            user.name.toLowerCase().includes(lowercasedSearch) ||
            user.email.toLowerCase().includes(lowercasedSearch) ||
            (user.role && user.role.toLowerCase().includes(lowercasedSearch))
        )
      );
    }
  }, [searchTerm, users]);
  
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ListUserResponse = await listService.listUser(token);
      setUsers(response.users.content);
      setFilteredUsers(response.users.content);
    } catch (error) {
      const err = error as ErrorResponse;
      setError(err.message);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId: number) => {
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      await deleteService.deleteUser(userId, token);
      setUsers(users.filter(user => user.id !== userId));
      setDeleteConfirm(null);
      setSuccessMessage("User deleted successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      const err = error as ErrorResponse;
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          User Management
        </h1>
        <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          View, edit and manage user accounts
        </p>
      </div>
      
      {/* Search and actions bar */}
      <div className={`p-4 rounded-xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className={`h-5 w-5 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
          </div>
          <input
            type="text"
            className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              darkMode 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                : 'border-gray-300 placeholder-gray-400'
            }`}
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="text-right">
          <span className={`text-sm ${
            darkMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            Total Users: {users.length}
          </span>
        </div>
      </div>
      
      {/* Status messages */}
      {successMessage && (
        <div className={`p-4 mb-6 rounded-md flex items-center ${
          darkMode ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'
        }`}>
          <FiAlertCircle className="h-5 w-5 mr-3" />
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className={`p-4 mb-6 rounded-md flex items-center ${
          darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'
        }`}>
          <FiAlertCircle className="h-5 w-5 mr-3" />
          {error}
        </div>
      )}
      
      {/* Users table */}
      <div className={`rounded-xl overflow-hidden shadow ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="overflow-x-auto">
          {loading ? (
            <div className={`text-center py-12 ${
              darkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              Loading users...
            </div>
          ) : filteredUsers.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`${
                darkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
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
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                darkMode ? 'divide-slate-700' : 'divide-gray-200'
              }`}>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={`${
                    deleteConfirm === user.id ? (darkMode ? 'bg-red-900/20' : 'bg-red-50') : ''
                  }`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      darkMode ? 'text-slate-300' : 'text-gray-900'
                    }`}>
                      {user.id}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm flex items-center ${
                      darkMode ? 'text-slate-300' : 'text-gray-900'
                    }`}>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                        darkMode ? 'bg-slate-700' : 'bg-gray-100'
                      }`}>
                        <FiUser className="h-4 w-4 text-indigo-500" />
                      </span>
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
                        {user.role || 'USER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {deleteConfirm === user.id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleteLoading}
                            className={`text-white px-3 py-1 rounded-md text-xs ${
                              deleteLoading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-800'
                            }`}
                          >
                            {deleteLoading ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className={`px-3 py-1 rounded-md text-xs ${
                              darkMode
                                ? 'bg-slate-700 text-white hover:bg-slate-600'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            to={`/admin/users/edit/${user.id}`}
                            className={`p-1.5 rounded-md ${
                              darkMode
                                ? 'text-indigo-400 hover:bg-slate-700'
                                : 'text-indigo-600 hover:bg-gray-100'
                            }`}
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(user.id)}
                            className={`p-1.5 rounded-md ${
                              darkMode
                                ? 'text-red-400 hover:bg-slate-700'
                                : 'text-red-600 hover:bg-gray-100'
                            }`}
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {deleteConfirm === user.id && deleteError && (
                        <p className="text-red-500 text-xs mt-1">{deleteError}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={`text-center py-12 ${
              darkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              <FiUser className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No users found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;