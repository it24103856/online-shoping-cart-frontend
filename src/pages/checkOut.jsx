import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsChevronUp } from 'react-icons/bs';
import { MdDelete, MdLocalShipping, MdPayment } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateCartQuantity } from '../utils/cart';
import toast from 'react-hot-toast';
import { isValidPhone, normalizePhone } from '../utils/validation';

export default function CheckOutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Try to get cart from location.state first, then fall back to localStorage
    const initialCart = Array.isArray(location.state) ? location.state : getCart();
    
    const [cart, setCart] = useState(initialCart);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const currentSubTotal = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);

    useEffect(() => {
        // If cart is empty after checking both sources, redirect
        if (cart.length === 0 && getCart().length === 0) {
            toast.error("Your cart is empty!");
            navigate("/products");
        }
    }, []);

    async function submitOrder() {
        // 1. Validation
        if (!name || !address || !phone) {
            toast.error("Please fill in all details (Name, Address, Phone).", {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        if (!isValidPhone(phone)) {
            toast.error("Please enter a valid phone number (10-15 digits)", {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please log in to place an order.");
            navigate("/login");
            return;
        }

        const orderItems = cart.map(item => ({
            productID: item.productID || item.productId || item._id,
            quantity: Number(item.quantity) || 1,
            name: item.name,
            price: Number(item.price),
            image: item.image
        }));

        const invalidItem = orderItems.find((item) => !item.productID);
        if (invalidItem) {
            toast.error("Some cart items are invalid. Please remove and add them again.");
            return;
        }

        const loadingToast = toast.loading('Processing your order...');

        // 2. API Call to save order in Backend
        axios.post(import.meta.env.VITE_BACKEND_URL + "/orders/create", {
            name: name,
            email: JSON.parse(localStorage.getItem("user") || "{}").email,
            address: address,
            phone: normalizePhone(phone),
            items: orderItems,
            total: currentSubTotal
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            toast.dismiss(loadingToast);
            
            // Calculate final pricing for payment
            const subTotal = currentSubTotal;
            const discount = 0; // If you have a coupon system, calculate it here
            const finalTotal = subTotal - discount;

            toast.success(`Order placed successfully! Redirecting to payment...`, {
                duration: 2000,
                icon: '💳',
            });

            // 3. Navigate to Payment Page with data
            // We pass data via 'state' so PaymentPage can access it
            setTimeout(() => {
                const resolvedOrderId =
                    response?.data?.orderId ||
                    response?.data?.order?.orderID ||
                    response?.data?.order?.orderId ||
                    response?.data?._id;

                navigate("/payment", {
                    state: {
                        orderId: resolvedOrderId,
                        subTotal: subTotal,
                        discount: discount,
                        finalTotal: finalTotal,
                        customerName: name
                    }
                });
            }, 1500);

        }).catch(error => {
            toast.dismiss(loadingToast);
            console.error("Error Detail:", error.response?.data);
            toast.error(error.response?.data?.message || "Internal Server Error");
        });
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Final Step</h1>
                <p className="text-gray-500 mt-2 font-medium">Complete your details to finish the purchase.</p>
            </div>

            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-lg italic">Your cart is currently empty</p>
                    <button onClick={() => navigate("/products")} className="mt-4 bg-black text-white px-6 py-2 rounded-full font-bold">Start Shopping</button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-10 items-start justify-center max-w-6xl w-full">
                    
                    {/* Item List Section */}
                    <div className="flex flex-col gap-4 w-full lg:w-3/5">
                        <h2 className="text-xl font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <MdLocalShipping className="text-blue-500" /> Order Summary
                        </h2>
                        {cart.map((item, index) => (
                            <div key={`${item.productID || item.name}-${index}`} className='w-full h-[140px] rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100 hover:border-gray-300 transition-all flex justify-between'>
                                <img src={item.image} className='h-full aspect-square object-cover' alt={item.name} />
                                <div className='flex flex-col justify-center pl-6 flex-1'>
                                    <h1 className='text-lg font-bold text-gray-800 leading-tight'>
                                        {item.name.length > 30 ? item.name.slice(0, 30) + "..." : item.name}
                                    </h1>
                                    <p className='text-xs text-gray-400 font-bold mt-1 uppercase'>{item.productID}</p>
                                    <h2 className='text-xl font-black text-gray-900 mt-2'>LKR. {item.price.toFixed(2)}</h2>
                                </div>
                                <div className='flex items-center gap-6 pr-6'>
                                <div className='flex flex-col items-center bg-gray-50 p-2 rounded-xl border border-gray-100'>
                                        <BsChevronUp onClick={() => {
                                            updateCartQuantity(item.productID, item.quantity + 1);
                                            setCart(getCart());
                                        }} className='cursor-pointer text-gray-400 hover:text-black transition-colors' />
                                        <span className='font-black text-lg text-gray-800 py-1'>{item.quantity}</span>
                                        <BsChevronUp onClick={() => {
                                            if (item.quantity > 1) {
                                                updateCartQuantity(item.productID, item.quantity - 1);
                                                setCart(getCart());
                                            } else {
                                                toast.error("Quantity cannot be less than 1");
                                            }
                                        }} className='rotate-180 cursor-pointer text-gray-400 hover:text-black transition-colors' />
                                    </div>
                                    <div className="flex flex-col items-end min-w-[120px]">
                                        <span className='font-bold text-gray-900 text-lg'>LKR. {(item.price * item.quantity).toFixed(2)}</span>
                                        <MdDelete onClick={() => {
                                            removeFromCart(item.productID);
                                            setCart(getCart());
                                            toast.error("Item removed from cart");
                                        }} className='text-red-400 cursor-pointer text-2xl mt-2 hover:text-red-600 transition-colors' />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Delivery Form Section */}
                    <div className='w-full lg:w-2/5 bg-white p-8 rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-50 flex flex-col gap-6 sticky top-8'>
                        <h2 className="text-2xl font-black text-gray-900">Delivery Details</h2>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all font-medium text-gray-800' placeholder="Enter your name" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className='p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all font-medium text-gray-800' placeholder="07x xxxxxxx" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
                                <textarea value={address} onChange={(e) => setAddress(e.target.value)} className='p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all h-28 resize-none font-medium text-gray-800' placeholder="Your delivery address"></textarea>
                            </div>
                        </div>

                        <div className="mt-4 pt-6 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <div className='flex flex-col'>
                                    <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Total Payable</span>
                                    <span className='text-3xl font-black text-gray-900'>LKR. {currentSubTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={submitOrder} className='w-full py-5 rounded-2xl bg-black text-white font-black text-xl hover:shadow-xl hover:translate-y-[-2px] transition-all active:scale-[0.98] flex items-center justify-center gap-3'>
                                <MdPayment className="text-2xl" /> PLACE ORDER
                            </button>
                            <p className="text-center text-[10px] text-gray-400 mt-6 font-medium">Fast delivery within 3-5 working days.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}