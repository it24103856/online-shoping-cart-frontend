import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";

export default function OrderPage() {
  const [cartItems, setCartItems] = useState([
    {
      _id: "1",
      name: "Organic Tomatoes",
      price: 5.99,
      quantity: 2,
      image: "https://via.placeholder.com/100?text=Tomatoes",
    },
    {
      _id: "2",
      name: "Fresh Milk",
      price: 3.49,
      quantity: 1,
      image: "https://via.placeholder.com/100?text=Milk",
    },
  ]);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  });

  const handleQuantityChange = (id, change) => {
    setCartItems(
      cartItems
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
    toast.success("Item removed from cart");
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city) {
      toast.error("Please fill in all shipping details");
      return;
    }
    toast.success("Proceeding to payment...");
    // Add checkout logic here
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2">
        <ShoppingBag size={32} />
        Review Your Order
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-bold text-xl text-slate-900 mb-4">Cart Items</h2>

            {cartItems.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 items-center border-b border-slate-200 pb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      <p className="text-slate-500">LKR {item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="p-1 hover:bg-slate-200 rounded transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, 1)}
                        className="p-1 hover:bg-slate-200 rounded transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <p className="font-bold text-slate-900 w-20">
                      LKR {(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="font-bold text-xl text-slate-900 mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={shippingInfo.name}
                onChange={handleShippingChange}
                className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={shippingInfo.phone}
                onChange={handleShippingChange}
                className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                className="col-span-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={shippingInfo.zipCode}
                onChange={handleShippingChange}
                className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="font-bold text-xl text-slate-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>LKR {calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span>LKR 5.99</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax:</span>
                <span>LKR {(calculateTotal() * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">LKR {(parseFloat(calculateTotal()) + 5.99 + parseFloat(calculateTotal()) * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
