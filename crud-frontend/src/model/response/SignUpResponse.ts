import User from '../User';

interface SignUpResponse {
    user: User,
    token: string,
    message: string
}

export default SignUpResponse;