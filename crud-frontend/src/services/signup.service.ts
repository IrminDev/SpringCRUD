import axios from 'axios';
import SignUpResponse from '../model/response/SignUpResponse';
import SignUpRequest from '../model/request/SignUpRequest';

const API_URL = import.meta.env.VITE_API_URL;

async function signUp(signUpRequest: SignUpRequest): Promise<SignUpResponse>{
    const response = await axios.post(`${API_URL}register`, signUpRequest);
    return response.data;
}

export default {
    signUp
};