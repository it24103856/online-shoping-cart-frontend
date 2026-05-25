import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { BiPlus } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import ViewOrderInfo from "../../components/viewOrderInfo";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleStatusUpdated = (updatedOrder) => {
    if (!updatedOrder?._id) return;
    setOrders((prev) =>
      prev.map((order) => (order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order))
    );
  };

  const getStatusBadgeClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-emerald-100 text-emerald-700";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  useEffect(() => {
    // LocalStorage එකේ token එක තියෙනවා නම් ඒකත් යවන්න (Security එකට හොඳයි)
    const token = localStorage.getItem("token");
    
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/orders/all", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        const data = response?.data;
        const normalizedOrders = Array.isArray(data)
          ? data
          : Array.isArray(data?.orders)
            ? data.orders
            : [];
        setOrders(normalizedOrders);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load orders");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Management</h1>
          <p className="text-gray-600">Review and manage customer orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-6 text-gray-600">Loading orders...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-gray-800 to-gray-700 text-white">
                      <th className="px-6 py-4 text-left text-sm font-medium">Order Id</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Customer Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Customer Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Total (LKR)</th>
                      <th className="px-6 py-4 text-left text-sm font-medium">Items Count</th>
                        <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {orders.map((item, index) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-all duration-200">
                        {/* Schema එකේ තියෙන්නේ orderID (capital ID) */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{item.orderID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadgeClasses(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        {/* Schema එකේ තියෙන්නේ total මිස totalAmount නෙවෙයි */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                          {(item.total || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.items?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <ViewOrderInfo order={item} onStatusUpdated={handleStatusUpdated} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {orders.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-500 italic">No orders found in the database.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}