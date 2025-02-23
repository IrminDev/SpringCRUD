import axios from 'axios';
import ListUserResponse from '../model/response/ListUserResponse';
import UserResponse from '../model/response/UserResponse';
import ErrorResponse from '../model/response/ErrorResponse';

const API_URL = import.meta.env.VITE_API_URL;

async function listUser(token: string): Promise<ListUserResponse> {
    try {
        const response = await axios.get(`${API_URL}all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        } else {
            throw {
                message: 'An error occurred while fetching user list'
            } as ErrorResponse;
        }
    }
}

async function getUser(id: number, token: string): Promise<UserResponse> {
    try {
        const response = await axios.get(`${API_URL}${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data;
        } else {
            throw {
                message: 'An error occurred while fetching user'
            } as ErrorResponse;
        }
    }
}

export default {
    listUser,
    getUser
}
