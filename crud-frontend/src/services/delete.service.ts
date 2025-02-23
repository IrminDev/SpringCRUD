import axios from "axios";
import DeleteResponse from "../model/response/DeleteResponse";
import ErrorResponse from "../model/response/ErrorResponse";
const API_URL = import.meta.env.VITE_API_URL;

async function deleteUser(id: number, token: string): Promise<DeleteResponse> {
  try {
    const response = await axios.delete(`${API_URL}${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw {
        message: "An error occurred while deleting user",
      } as ErrorResponse
    }
  }
}

export default {
    deleteUser,
}