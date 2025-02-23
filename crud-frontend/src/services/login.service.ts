import axios from "axios";
import LoginRequest from "../model/request/LoginRequest";
import LoginResponse from "../model/response/LoginResponse";
import ErrorResponse from "../model/response/ErrorResponse";

const API_URL = import.meta.env.VITE_API_URL;

async function login(loginRequest: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await axios.post(`${API_URL}login`, loginRequest);
    return response.data;
  } catch (error) {
    if(axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else{
      throw {
        message: "An error occurred while logging in"
      } as ErrorResponse;
    }
  }
}

export default { login };