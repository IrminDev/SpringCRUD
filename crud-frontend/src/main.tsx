import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUpForm from './views/SignUp'
import AdminDashboard from './views/Dashboard'
import EditUserForm from './views/EditUser'
import UserProfile from './views/UserProfile'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/edit/:id" element={<EditUserForm />} />
            <Route path="/home" element={<UserProfile />} />
            <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
    </BrowserRouter>
)
