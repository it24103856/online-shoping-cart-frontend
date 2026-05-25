import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ViewOrderInfo({ order, onStatusUpdated }) {
  const [open, setOpen] = useState(false);
  const [payment, setPayment] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [statusValue, setStatusValue] = useState("pending");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (order?.status) {
      setStatusValue(String(order.status).toLowerCase());
    }
  }, [order?.status, open]);

  async function updateStatus() {
    if (!order?.orderID) {
      toast.error("Order ID not available");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login required");
      return;
    }

    try {
      setUpdatingStatus(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${order.orderID}/status`,
        { status: statusValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedOrder = response?.data?.order;
      toast.success(response?.data?.message || "Order status updated");
      if (updatedOrder && onStatusUpdated) {
        onStatusUpdated(updatedOrder);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    if (!order?.orderID) {
      setPayment(null);
      setPaymentError("Order ID not available");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setPayment(null);
      setPaymentError("Login required to view payment details");
      return;
    }

    setPaymentLoading(true);
    setPaymentError("");

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/payments/order/${order.orderID}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setPayment(response?.data?.payment || null);
      })
      .catch((error) => {
        setPayment(null);
        if (error?.response?.status === 404) {
          setPaymentError("No payment recorded for this order yet");
        } else {
          setPaymentError(error?.response?.data?.message || "Unable to load payment details");
        }
      })
      .finally(() => {
        setPaymentLoading(false);
      });
  }, [open, order?.orderID]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
      >
        View
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-3 text-sm text-gray-700 max-h-[70vh] overflow-y-auto">
              <p><span className="font-semibold">Order ID:</span> {order?.orderID || "-"}</p>
              <p><span className="font-semibold">Customer:</span> {order?.name || "-"}</p>
              <p><span className="font-semibold">Email:</span> {order?.email || "-"}</p>
              <p><span className="font-semibold">Phone:</span> {order?.phone || "-"}</p>
              <p><span className="font-semibold">Address:</span> {order?.address || "-"}</p>
              <p><span className="font-semibold">Status:</span> {order?.status || "-"}</p>
              <p><span className="font-semibold">Total:</span> LKR. {(order?.total || 0).toFixed(2)}</p>

              <div className="rounded border border-gray-200 p-3">
                <p className="font-semibold mb-2">Update Order Status</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <select
                    value={statusValue}
                    onChange={(e) => setStatusValue(e.target.value)}
                    className="h-10 rounded border border-gray-300 px-3 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={updateStatus}
                    disabled={updatingStatus}
                    className="h-10 rounded bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingStatus ? "Updating..." : "Save Status"}
                  </button>
                </div>
              </div>

              <div className="rounded border border-blue-200 bg-blue-50 p-3 space-y-1">
                <p className="font-semibold text-blue-900">Payment Details</p>
                {paymentLoading && <p className="text-blue-800">Loading payment details...</p>}
                {!paymentLoading && paymentError && <p className="text-red-600">{paymentError}</p>}
                {!paymentLoading && !paymentError && payment && (
                  <>
                    <p><span className="font-semibold">Method:</span> {payment.paymentMethod || "-"}</p>
                    <p><span className="font-semibold">Status:</span> {payment.status || "-"}</p>
                    <p><span className="font-semibold">Amount:</span> LKR. {(payment.amount || 0).toFixed(2)}</p>
                    <p><span className="font-semibold">Reference:</span> {payment.referenceNumber || "-"}</p>
                    <p><span className="font-semibold">Bank:</span> {payment.bankName || "-"}</p>
                    <p><span className="font-semibold">Date:</span> {payment.transactionDate ? new Date(payment.transactionDate).toLocaleString() : "-"}</p>
                    {(
                      payment.paymentMethod === "Bank Transfer" ||
                      payment.paymentMethod === "Online Transfer"
                    ) && payment.receiptImage && (
                      <div className="mt-3">
                        <p className="font-semibold mb-2">Transfer Receipt</p>
                        <a
                          href={payment.receiptImage}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block"
                        >
                          <img
                            src={payment.receiptImage}
                            alt="Bank transfer receipt"
                            className="w-full max-w-sm rounded-md border border-blue-200 hover:opacity-90 transition-opacity"
                          />
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div>
                <p className="font-semibold mb-2">Items</p>
                <div className="space-y-2">
                  {(order?.items || []).map((item, index) => (
                    <div
                      key={`${item?.productId || item?.name || "item"}-${index}`}
                      className="rounded border border-gray-200 p-3"
                    >
                      <p><span className="font-semibold">Name:</span> {item?.name || "-"}</p>
                      <p><span className="font-semibold">Qty:</span> {item?.quantity || 0}</p>
                      <p><span className="font-semibold">Price:</span> LKR. {(item?.price || 0).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
