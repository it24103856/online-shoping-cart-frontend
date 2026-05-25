import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Landmark, CheckCircle, UploadCloud } from "lucide-react";
import { emptyCart } from "../utils/cart";
import { uploadFile } from "../utils/uploadFile";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentData = location.state || {};
  const orderId = paymentData.orderId;
  const subTotal = Number(paymentData.subTotal || 0);
  const discount = Number(paymentData.discount || 0);
  const finalTotal = Number(paymentData.finalTotal || subTotal - discount || 0);

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [transferInfo, setTransferInfo] = useState({
    bankName: "",
    referenceNumber: "",
    transactionDate: "",
    remark: "online-cart",
    receiptFile: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const transferAccountDetails = {
    accountName: "Abeykoon KN",
    bank: "BOC",
    accountNumber: "92269156",
    remark: "online-cart",
  };

  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    setTransferInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0] || null;
    setTransferInfo((prev) => ({ ...prev, receiptFile: file }));
  };

  const handlePayment = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (!orderId) {
      toast.error("Missing order information. Please place the order again.");
      navigate("/checkout");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to continue payment.");
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    try {
      const isTransferMethod = paymentMethod === "online" || paymentMethod === "bank";

      let receiptImage = null;
      if (isTransferMethod) {
        if (
          !transferInfo.bankName ||
          !transferInfo.referenceNumber ||
          !transferInfo.transactionDate ||
          !transferInfo.receiptFile
        ) {
          toast.error("Please fill all transfer details and upload receipt.");
          setIsProcessing(false);
          return;
        }

        receiptImage = await uploadFile(transferInfo.receiptFile);
      }

      const mappedMethod = paymentMethod === "bank"
        ? "Bank Transfer"
        : paymentMethod === "cash"
          ? "Cash on Delivery"
          : "Online Transfer";

      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/payments/create",
        {
          orderID: orderId,
          paymentMethod: mappedMethod,
          amount: finalTotal,
          referenceNumber: isTransferMethod ? transferInfo.referenceNumber : "",
          bankName: isTransferMethod ? transferInfo.bankName : "",
          transactionDate: isTransferMethod ? transferInfo.transactionDate : "",
          receiptImage,
          remark: isTransferMethod ? transferInfo.remark : "cash-on-delivery",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Payment successful!");
      emptyCart();
      navigate("/my-payments");
      
      // Reset form
      setTransferInfo({
        bankName: "",
        referenceNumber: "",
        transactionDate: "",
        remark: "online-cart",
        receiptFile: null,
      });
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error("This order is already paid or payment is pending.");
      } else {
        toast.error(error?.response?.data?.message || "Payment failed. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2">
        <Landmark size={32} />
        Payment
      </h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Order Summary */}
        <div className="mb-8 pb-8 border-b border-slate-200">
          <h2 className="font-bold text-lg text-slate-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>LKR. {subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>LKR. {discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span>{orderId || "-"}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-slate-900 mt-4">
              <span>Total Amount:</span>
              <span className="text-blue-600">LKR. {finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h2 className="font-bold text-lg text-slate-900 mb-4">Select Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-all" style={{borderColor: paymentMethod === "online" ? "#0096CE" : ""}}>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <span className="font-semibold">Online Transfer</span>
            </label>
            <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-all" style={{borderColor: paymentMethod === "bank" ? "#0096CE" : ""}}>
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <span className="font-semibold">Bank Transfer</span>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-all" style={{borderColor: paymentMethod === "cash" ? "#0096CE" : ""}}>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <span className="font-semibold">Cash on Delivery</span>
            </label>
          </div>
        </div>

        {(paymentMethod === "online" || paymentMethod === "bank") && (
          <div className="mb-6 p-4 rounded-lg border border-sky-200 bg-sky-50">
            <h3 className="font-bold text-sky-900 mb-2">Transfer To</h3>
            <p className="text-sky-800 text-sm"><span className="font-semibold">Name:</span> {transferAccountDetails.accountName}</p>
            <p className="text-sky-800 text-sm"><span className="font-semibold">Bank:</span> {transferAccountDetails.bank}</p>
            <p className="text-sky-800 text-sm"><span className="font-semibold">Account Number:</span> {transferAccountDetails.accountNumber}</p>
            <p className="text-sky-800 text-sm"><span className="font-semibold">Remark:</span> {transferAccountDetails.remark}</p>
          </div>
        )}

        <form onSubmit={handlePayment} className="space-y-6">
          {(paymentMethod === "online" || paymentMethod === "bank") && (
            <>
              <div>
                <label className="block font-semibold text-slate-900 mb-2">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  placeholder="Enter your bank name"
                  value={transferInfo.bankName}
                  onChange={handleTransferChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-2">Reference ID</label>
                <input
                  type="text"
                  name="referenceNumber"
                  placeholder="Transaction reference id"
                  value={transferInfo.referenceNumber}
                  onChange={handleTransferChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-2">Transfer Date</label>
                <input
                  type="date"
                  name="transactionDate"
                  value={transferInfo.transactionDate}
                  onChange={handleTransferChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-2">Remark</label>
                <input
                  type="text"
                  name="remark"
                  value={transferInfo.remark}
                  onChange={handleTransferChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-2">Upload Receipt</label>
                <label className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-all">
                  <UploadCloud size={18} />
                  <span>{transferInfo.receiptFile ? transferInfo.receiptFile.name : "Choose receipt image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptChange}
                    className="hidden"
                  />
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                Pay LKR. {finalTotal.toFixed(2)}
              </>
            )}
          </button>
        </form>

        {/* Security Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-blue-600 shrink-0 mt-1" size={20} />
          <p className="text-sm text-blue-900">
            Your payment is secure and encrypted. We use industry-standard SSL technology to protect your information.
          </p>
        </div>
      </div>
    </div>
  );
}
