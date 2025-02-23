import User from "../User";

interface LoginResponse {
    user: User;
    token: string;
    message: string;
}

export default LoginResponse;