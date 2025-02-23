import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import User from "../model/User";
import listService from "../services/list.service";
import ErrorResponse from "../model/response/ErrorResponse";
import deleteService from "../services/delete.service";
import DeleteResponse from "../model/response/DeleteResponse";
import ListUserResponse from "../model/response/ListUserResponse";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const token: string = localStorage.getItem("token") || '';
  console.log(token);

  useEffect(() => {
    const user: User = JSON.parse(localStorage.getItem("user") || "{ id: 0, name: '', email: '' }");
    if (user.id === 0) {
      navigate("/");
    } else {
      if (user.role !== "ADMIN") {
        navigate("/home");
      }
    }

    listService.listUser(token).then((users: ListUserResponse) => {
      setUsers(users.users);
      console.log(users.message);
    }).catch((error: ErrorResponse) => {
      console.log(error.message);
    });
  }, []);

  const deleteUser = (id: number) => {
    deleteService.deleteUser(id, token).then((response: DeleteResponse) => {
      console.log(response.message);
      setUsers(users.filter(user => user.id !== id));
    }).catch((error: ErrorResponse) => {
      console.log(error.message);
    });
  };

  const editUser = (id: number) => {
    navigate(`./edit/${id}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h2>
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="text-center">
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2 space-x-2">
                  <button 
                    onClick={() => editUser(user.id)} 
                    className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteUser(user.id)} 
                    className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
