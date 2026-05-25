import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Package, Truck, CheckCircle } from "lucide-react";

export default function MyOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentStatusByOrder, setPaymentStatusByOrder] = useState({});

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/orders/myorders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const myOrders = Array.isArray(response.data) ? response.data : [];
      setOrders(myOrders);

      const paymentsRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/payments/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payments = paymentsRes?.data?.payments || [];
      const paymentMap = {};

      payments.forEach((payment) => {
        const orderDoc = payment?.orderID;
        const businessOrderId = orderDoc?.orderID;
        const mongoOrderId = orderDoc?._id;

        if (businessOrderId) {
          paymentMap[businessOrderId] = payment.status;
        }
        if (mongoOrderId) {
          paymentMap[mongoOrderId] = payment.status;
        }
      });

      setPaymentStatusByOrder(paymentMap);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Package className="text-yellow-500" size={20} />;
      case "shipped":
        return <Truck className="text-blue-500" size={20} />;
      case "delivered":
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No orders yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">Order #{order._id?.slice(-8)}</h3>
                  <p className="text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="font-semibold text-slate-700">{order.status || "Pending"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-slate-500">Items</p>
                  <p className="font-bold text-slate-900">{order.items?.length || 0}</p>
                </div>
                <div>
                  <p className="text-slate-500">Total</p>
                  <p className="font-bold text-slate-900">LKR. {(order.total || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Payment</p>
                  <p className="font-bold text-green-600">
                    {paymentStatusByOrder[order.orderID] || paymentStatusByOrder[order._id] || "Pending"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Delivery</p>
                  <p className="font-bold text-slate-900">{order.deliveryStatus || "In Progress"}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(order)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p><span className="font-semibold">Order ID:</span> {selectedOrder?.orderID || selectedOrder?._id || "-"}</p>
                <p><span className="font-semibold">Date:</span> {selectedOrder?.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "-"}</p>
                <p><span className="font-semibold">Status:</span> {selectedOrder?.status || "Pending"}</p>
                <p><span className="font-semibold">Total:</span> LKR. {(selectedOrder?.total || 0).toFixed(2)}</p>
                <p><span className="font-semibold">Name:</span> {selectedOrder?.name || "-"}</p>
                <p><span className="font-semibold">Phone:</span> {selectedOrder?.phone || "-"}</p>
                <p className="md:col-span-2"><span className="font-semibold">Address:</span> {selectedOrder?.address || "-"}</p>
              </div>

              <div>
                <p className="font-semibold mb-3">Ordered Items</p>
                <div className="space-y-3">
                  {(selectedOrder?.items || []).map((item, index) => (
                    <div
                      key={`${item?.productId || item?.name || "item"}-${index}`}
                      className="flex gap-3 rounded-lg border border-gray-200 p-3"
                    >
                      <img
                        src={item?.image || "https://via.placeholder.com/96?text=No+Image"}
                        alt={item?.name || "Product image"}
                        className="h-24 w-24 rounded-md object-cover border border-gray-200 bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/96?text=No+Image";
                        }}
                      />

                      <div className="text-sm text-gray-700">
                        <p><span className="font-semibold">Name:</span> {item?.name || "-"}</p>
                        <p><span className="font-semibold">Qty:</span> {item?.quantity || 0}</p>
                        <p><span className="font-semibold">Price:</span> LKR. {(item?.price || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
