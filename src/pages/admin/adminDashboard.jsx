import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        // Fetch dashboard stats
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          axios.get(`${backendUrl}/products/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/users/allusers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/orders/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/orders/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        let totalRevenue = 0;
        if (ordersRes.data && Array.isArray(ordersRes.data)) {
          totalRevenue = ordersRes.data.reduce(
            (sum, order) => sum + (order.totalAmount || 0),
            0
          );
        }

        setStats({
          totalProducts: productsRes.data?.length || 0,
          totalUsers: usersRes.data?.length || 0,
          totalOrders: ordersRes.data?.length || 0,
          totalRevenue: totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Total Products</h2>
          <p className="text-4xl font-bold">{stats.totalProducts}</p>
        </div>

        {/* Users Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
        </div>

        {/* Orders Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
          <p className="text-4xl font-bold">{stats.totalOrders}</p>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
          <p className="text-4xl font-bold">₹{stats.totalRevenue.toFixed(0)}</p>
        </div>
      </div>
    </div>
  );
}
