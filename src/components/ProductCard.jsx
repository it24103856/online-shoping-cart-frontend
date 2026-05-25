import React from "react";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/products/${product.productId || product._id}`);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    toast.success("Added to wishlist!");
    // TODO: Implement wishlist functionality
  };

  return (
    <div onClick={handleViewDetails} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
        <img
          src={product.image || "https://via.placeholder.com/200?text=Product"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-bold text-slate-900 text-sm line-clamp-2">
          {product.name}
        </h3>
        <p className="text-slate-500 text-xs mt-1 line-clamp-1">
          {product.category}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="font-bold text-slate-900 text-lg">
            LKR {product.price?.toFixed(2) || "0.00"}
          </span>
          {product.originalPrice && (
            <span className="text-slate-400 line-through text-sm">
              LKR {product.originalPrice?.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-yellow-400">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-slate-500 text-xs">({product.rating}/5)</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
          >
            View Details
          </button>
          <button
            onClick={handleAddToWishlist}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all duration-300 active:scale-95"
          >
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
