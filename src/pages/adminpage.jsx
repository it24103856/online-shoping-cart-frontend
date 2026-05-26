import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { MdOutlineRateReview, MdOutlineListAlt, MdDashboard, MdOutlineCalendarMonth, MdSupportAgent, MdHome, MdMenu, MdClose } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { LuBoxes } from "react-icons/lu";
import { useState, useEffect } from "react";
import axios from "axios";

import AdminAddProductsPage from "./admin/adminProductAddPage";
import AdminProductsPage from "./admin/adminProductPage";
import AdminUpdateProductsPage from "./admin/adminProductUpdatePage";
import AdminUserPage from "./admin/adminUserpage";
import AdminDashboard from "./admin/adminDashboard";
import AdminOrdersPage from "./admin/adminOrderPage";
import AdminFeedbackPage from "./admin/adminFeedbackPage";

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        // Shield: No token -> redirect to login
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
                // NOT an admin -> redirect to home
                navigate("/");
            }
        })
        .catch((err) => {
            console.error("Auth error:", err);
            // Invalid token or error -> redirect to login
            localStorage.removeItem("token");
            navigate("/login");
        });
    }, [navigate]);

    // Show loader while checking authentication
    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    // Only render admin UI if authenticated and authorized
    return (
        <div className="w-full h-screen flex relative overflow-hidden bg-gray-100">
            
            {/* Mobile Header */}
            <div className="md:hidden absolute top-0 left-0 w-full h-16 bg-blue-950 flex items-center justify-between px-4 z-40 shadow-md">
                <div className="flex items-center gap-2 text-white">
                    <img src="/logo.jpg" alt="logo" className="w-10 h-10 object-contain rounded-full" />
                    <h1 className="text-xl font-semibold">Admin Panel</h1>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                  className="text-white text-3xl focus:outline-none"
                >
                    {isSidebarOpen ? <MdClose /> : <MdMenu />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Container */}
            <div 
              className={`fixed md:relative top-0 left-0 h-full bg-blue-950 z-40 transform transition-transform duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`} 
              style={{ width: "300px" }}
            >
                <div className="w-full flex items-center gap-3 text-primary mt-16 md:mt-0 px-4" style={{ height: 100 }}>
                    <img src="/logo.jpg" alt="logo" className="w-12 h-12 object-contain rounded-full border-2 border-white"/>
                    <h1 className="text-2xl text-white font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Kairo <span className="text-[#00AEEF]">Market</span>
                    </h1>
                </div>
                <div className="w-full text-white flex flex-col mt-4 px-2">
                    <Link to="/" className="text-yellow-400 hover:text-yellow-300 hover:bg-blue-900 rounded p-3 text-xl flex items-center gap-3 transition-colors"><MdHome size={24}/>Home</Link>
                    <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 hover:bg-blue-900 rounded p-3 text-xl flex items-center gap-3 transition-colors"><MdDashboard size={24}/>Dashboard</Link>
                    <Link to="/admin/product" className="text-yellow-400 hover:text-yellow-300 hover:bg-blue-900 rounded p-3 text-xl flex items-center gap-3 transition-colors"><LuBoxes size={24}/>Products</Link>
                    <Link to="/admin/users" className="text-yellow-400 hover:text-yellow-300 hover:bg-blue-900 rounded p-3 text-xl flex items-center gap-3 transition-colors"><FaUsers size={24}/>Users</Link>
                    <Link to="/admin/orders" className="text-yellow-400 hover:text-yellow-300 hover:bg-blue-900 rounded p-3 text-xl flex items-center gap-3 transition-colors"><MdOutlineListAlt size={24}/>Orders</Link>
                    <Link to="/admin/feedback" className="text-yellow-400 hover:text-yellow-300 hover:bg-blue-900 rounded p-3 text-xl flex items-center gap-3 transition-colors"><MdOutlineRateReview size={24}/>Feedback</Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 h-full w-full max-h-full overflow-y-auto bg-white rounded-none md:rounded-l-3xl border-t-0 md:border-t-8 md:border-l-8 md:border-b-8 border-blue-950 mt-16 md:mt-0 shadow-inner">
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

        </div>
    )
}
