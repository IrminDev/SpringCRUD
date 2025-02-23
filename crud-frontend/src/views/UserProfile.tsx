import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import User from "../model/User";
import listService from "../services/list.service";
import UserResponse from "../model/response/UserResponse";
import ErrorResponse from "../model/response/ErrorResponse";

export default function UserProfile() {
  const userLogged: User = JSON.parse(localStorage.getItem("user") || '{id: 0, name: "", email: "", role: ""}');
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if(userLogged.id === 0) {
      navigate("/");
    } else {
      if(userLogged.role !== "USER") {
        navigate("/admin");
      }
    }

    listService.getUser(userLogged.id, token).then((response: UserResponse) => {
      setUser(response.user);
    }).catch((error: ErrorResponse) => {
      console.log(error.message);
    });
  }, [userLogged]);

  if (!user) return <p className="text-center mt-10">User not found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">User Profile</h2>
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-700">{user.name}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
