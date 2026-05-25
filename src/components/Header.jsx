import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import UserProfile from "./userProfile";
import { getCartItemCount } from "../utils/cart";


export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Initial cart load
    updateCartInfo();
    
    // Listen for cart updates
    window.addEventListener("cartUpdate", updateCartInfo);
    return () => window.removeEventListener("cartUpdate", updateCartInfo);
  }, []);

  const updateCartInfo = () => {
    setCartCount(getCartItemCount());
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Product" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/feedback", label: "Feedback" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-m border-b border-white/10 px-6 md:px-10 py-4 flex justify-between items-center transition-all duration-500">
      {/* Logo Section */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href="/"}>
        <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-contain" />
        <span className="text-white font-bold text-2xl tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
          Kairo <span className="text-[#00AEEF]">Market</span>
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex gap-8 text-white/90 font-medium text-sm">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="hover:text-[#00AEEF] transition-all duration-500 uppercase tracking-widest text-[11px] font-semibold"
          >
            {link.label}
          </Link>
        ))}
      </div>

       {/* User Profile & Cart */}
        {isLoggedIn ? (
          <div className="relative z-[105] flex items-center gap-4">
            {/* Cart Icon */}
            <button
              onClick={handleCartClick}
              className="relative text-white hover:text-[#00AEEF] transition-all duration-500 p-2"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            
            <UserProfile />
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-[#C8813A] hover:bg-[#A66A28] text-white px-7 py-2.5 rounded-full font-bold transition-all duration-500 shadow-lg shadow-[#C8813A]/20 uppercase text-[10px] tracking-widest"
          >
            Sign In
          </Link>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 md:hidden flex flex-col items-center gap-4 py-6 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/90 hover:text-[#00AEEF] transition-all duration-500 uppercase tracking-widest text-[11px] font-semibold"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}