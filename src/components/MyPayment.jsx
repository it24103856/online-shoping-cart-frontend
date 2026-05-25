import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";

export default function MyPayment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyPayments();
  }, []);

  const fetchMyPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/payments/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPayments(response?.data?.payments || []);
    } catch (error) {
      toast.error("Failed to fetch payments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
      case "completed":
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "pending":
        return <Clock className="text-yellow-500" size={20} />;
      case "rejected":
      case "failed":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <CreditCard size={20} />;
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
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Payments</h1>

      {payments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <CreditCard size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No payment history</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left font-bold text-slate-900">Date</th>
                <th className="px-6 py-4 text-left font-bold text-slate-900">Order ID</th>
                <th className="px-6 py-4 text-left font-bold text-slate-900">Amount</th>
                <th className="px-6 py-4 text-left font-bold text-slate-900">Method</th>
                <th className="px-6 py-4 text-left font-bold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-all"
                >
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    #{payment.orderID?.orderID || payment.orderID?._id?.slice(-8) || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    LKR. {(payment.amount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {payment.paymentMethod || "Card"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className="text-sm font-semibold text-slate-700">
                        {payment.status || "Pending"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
