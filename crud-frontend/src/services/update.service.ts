import axios from 'axios';
import UpdateRequest from '../model/request/UpdateRequest';
import UpdateResponse from '../model/response/UpdateResponse';
import ErrorResponse from '../model/response/ErrorResponse';

const API_URL = import.meta.env.VITE_API_URL;

async function updateUser(id: number, updateRequest: UpdateRequest, token: string): Promise<UpdateResponse> {
    try {
        const response = await axios.put(`${API_URL}${id}`, updateRequest, {
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
                message: 'An error occurred while updating user'
            } as ErrorResponse;
        }
    }
}

export default{
    updateUser
}