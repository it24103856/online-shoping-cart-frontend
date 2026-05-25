import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { MdOutlineRateReview } from "react-icons/md";
import { MdOutlineListAlt } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { MdSupportAgent } from "react-icons/md";
import { MdHome } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { LuBoxes } from "react-icons/lu";
import { useState, useEffect} from "react";
import axios from "axios";
import Loader from "../components/Loader";

import AdminAddProductsPage from "./admin/adminProductAddPage";
import AdminProductsPage from "./admin/adminProductPage";
import AdminUpdateProductsPage from "./admin/adminProductUpdatePage";
import AdminUserPage from "./admin/adminUserpage";
import AdminDashboard from "./admin/adminDashboard";
import AdminOrdersPage from "./admin/adminOrderPage";
import AdminFeedbackPage from "./admin/adminFeedbackPage";

export default function AdminPage(){
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        // Shield: No token → redirect to login
        if (!token) {
            navigate("/login");
            return;
        }

        // Fetch user details from backend
        axios.get(import.meta.env.VITE_BACKEND_URL + "/users/", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            // Shield: Check if user is admin
            if (response.data.role === "admin") {
                setUser(response.data);
                setIsLoading(false);
            } else {
                // NOT an admin → redirect to home
                navigate("/");
            }
        })
        .catch((err) => {
            console.error("Auth error:", err);
            // Invalid token or error → redirect to login
            localStorage.removeItem("token");
            navigate("/login");
        });
    }, [navigate]);

    // Show loader while checking authentication
    if (isLoading) {
        return <Loader />;
    }

    // Only render admin UI if authenticated and authorized
    return(
        <div className="w-full h-full flex">
            
            <>
            <div className="bg-blue-950 h-full" style={{ width: 300 }}>
            <div className="w-full flex items-center text-primary" style={{ height: 100 }}>
                <img src="/logo.png" alt="logo" className="h-full "/>
                <h1 className="text-2xl">Admin page</h1>
            </div>
            <div className="w-full text-white tesxt-2xl flex flex-col" style={{ height: 400 }}>
                <Link to="/" className="text-yellow-400 hover:text-yellow-300 p-2 text-xl flex items-center gap-2"><MdHome />Home</Link>
                <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 p-2 text-xl flex items-center gap-2"><MdDashboard />Dashboard</Link>
                <Link to="/admin/product" className="text-yellow-400 hover:text-yellow-300 p-2 text-xl flex items-center gap-2"><LuBoxes />Products</Link>
                <Link to="/admin/users" className="text-yellow-400 hover:text-yellow-300 p-2 text-xl flex items-center gap-2"><FaUsers />Users</Link>
                <Link to="/admin/orders" className="text-yellow-400 hover:text-yellow-300 p-2 text-xl flex items-center gap-2"><MdOutlineListAlt />Orders</Link>
                <Link to="/admin/feedback" className="text-yellow-400 hover:text-yellow-300 p-2 text-xl flex items-center gap-2"><MdOutlineRateReview />Feedback</Link>
             </div>

            </div>
            <div className="h-full max-h-full overflow-y-scroll rounded-4xl border-blue-950" style={{ width: "calc(100% - 300px)", borderWidth: 10 }}>
                <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="product" element={<AdminProductsPage />} />
                    <Route path="add-product" element={<AdminAddProductsPage />} />
                    <Route path="update-product/:id" element={<AdminUpdateProductsPage />} />
                    <Route path="users" element={<AdminUserPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="feedback" element={<AdminFeedbackPage />} />
                    <Route path="*" element={<AdminDashboard />} />
                    
                </Routes>
            </div>
            </>

        </div>
    )
}