import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import User from "../model/User";
import UserResponse from "../model/response/UserResponse";
import ErrorResponse from "../model/response/ErrorResponse";
import listService from "../services/list.service";
import updateService from "../services/update.service";
import UpdateResponse from "../model/response/UpdateResponse";

export default function EditUserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const token: string = localStorage.getItem("token") || "";

  useEffect(() => {
    const userLogged: User = JSON.parse(localStorage.getItem("user") || "{ id: 0, name: '', email: '' }");
    if (userLogged.id === 0) {
      navigate("/");
    } else {
      if (userLogged.role !== "ADMIN") {
        navigate("/home");
      }
    }

    listService.getUser(Number(id), token).then((user: UserResponse) => {
      setUser(user.user);
    }).catch((error: ErrorResponse) => {
      console.log(error.message);
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if(user) {
      updateService.updateUser(Number(id), user, token).then((response: UpdateResponse) => {
        console.log(response.message);
        navigate("/home");
      }).catch((error: ErrorResponse) => {
        console.log(error.message);
      });
    }
  };

  if (!user) return <p className="text-center mt-10">User not found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Save Changes
          </button>
        </form>
        <button 
          onClick={() => navigate("/home")} 
          className="mt-4 w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
