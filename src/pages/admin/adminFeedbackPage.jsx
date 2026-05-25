import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [stats, setStats] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a83232', '#9d32a8'];

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            // Get all feedbacks
            const fbResponse = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/feedbacks/get-all?page=${page}&limit=10`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setFeedbacks(fbResponse.data.feedbacks);
            setTotalPages(fbResponse.data.totalPages);

            // Get stats
            const statsResponse = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/feedbacks/stats`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (statsResponse.data.success) {
                // Map category stats into Recharts format
                const chartData = statsResponse.data.stats.category.map(item => ({
                    name: item._id, // e.g., "website"
                    value: item.count
                }));
                setStats(chartData);
            }

        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            toast.error("Failed to load feedbacks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [page]);

    return (
        <div className="p-8 w-full h-full flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">User Feedback Management</h2>

            {/* Top row: Stats and Chart */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8 w-full h-80">
                
                {/* Pie Chart Section */}
                <div className="bg-white p-4 shadow-lg rounded-xl flex-1 flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-2">Feedback by Category</h3>
                    {stats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={stats} 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={80} 
                                    fill="#8884d8" 
                                    dataKey="value"
                                    label
                                >
                                    {stats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">No stats available</div>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white p-4 shadow-lg rounded-xl flex-1 overflow-auto">
                <h3 className="text-xl font-semibold mb-4">All Feedbacks</h3>
                
                {loading ? (
                    <div className="text-center p-4">Loading...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-100">
                                <th className="p-3 font-semibold">User</th>
                                <th className="p-3 font-semibold">Category</th>
                                <th className="p-3 font-semibold">Rating</th>
                                <th className="p-3 font-semibold">Feedback</th>
                                <th className="p-3 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.length > 0 ? (
                                feedbacks.map((fb) => (
                                    <tr key={fb._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">
                                            {fb.userID ? `${fb.userID.firstName} ${fb.userID.lastName}` : "Unknown"}
                                        </td>
                                        <td className="p-3 capitalize">{fb.category}</td>
                                        <td className="p-3">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                                                {fb.rating} / 5
                                            </span>
                                        </td>
                                        <td className="p-3">{fb.feedback}</td>
                                        <td className="p-3 text-sm text-gray-500">
                                            {new Date(fb.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">No feedbacks found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
                
                {/* Pagination */}
                <div className="mt-4 flex justify-between items-center">
                    <button 
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                    <button 
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages || totalPages === 0}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

        </div>
    );
}