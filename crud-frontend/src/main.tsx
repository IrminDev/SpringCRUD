import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUpForm from './views/auth/SignUp'
import AdminDashboard from './views/Dashboard'
import EditUserForm from './views/EditUser'
import UserProfile from './views/UserProfile'
import SignInForm from './views/auth/SignIn'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/edit/:id" element={<EditUserForm />} />
            <Route path="/home" element={<UserProfile />} />
            <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
    </BrowserRouter>
)
