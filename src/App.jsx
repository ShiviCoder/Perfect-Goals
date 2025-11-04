import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import Registration from "./pages/admin/Registration.jsx";
import AdminDashboard from '../src/pages/admin/AdminDashboard.jsx'
import Home from "./pages/user/Home.jsx";
import ChangePassword from "./pages/user/ChangePassword.jsx";

export default function App() {
  return (
    <Routes>
      < Route path="/" element={<Home />} />
      < Route path="/login" element={<Login />} />
      < Route path="/user-dashboard" element={<UserDashboard />} />
      < Route path="/admin-dashboard" element={<AdminDashboard />} />
      < Route path="/registration" element={<Registration />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Routes>
  );
}