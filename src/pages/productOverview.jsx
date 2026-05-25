import { Navigate, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Star, MessageSquare, Loader } from "lucide-react";
import { addToCart, getCart } from "../utils/cart.js";

export default function ProductOverview() {
    const navigate=useNavigate();
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState("loading");
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (params.productID) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/${params.productID}`)
                .then((response) => {
                    if (response.data && response.data.name) {
                        setProduct(response.data);
                        const images = response.data.image || [];
                        setSelectedImage(images[0] || "https://placehold.jp/500x500.png");
                        setStatus("success");
                    } else {
                        setStatus("error");
                    }
                })
                .catch((error) => {
                    console.error("API Error:", error);
                    setStatus("error");
                });
        }
    }, [params.productID]);

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-white font-sans">
            {status === "loading" && <Loader />}

            {status === "error" && (
                <div className="w-full h-screen flex justify-center items-center text-red-500 font-semibold text-2xl">
                    Product not found
                </div>
            )}

            {status === "success" && product && (
                <div className="w-full max-w-[1400px] flex flex-col md:flex-row p-6 md:p-16 gap-16">
                    
                    {/* --- Left Side: Image Gallery --- */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        {/* Main Image - Frame එක සම්පූර්ණයෙන්ම පිරිසිදු කර ඇත */}
                        <div className="w-full h-[550px] flex justify-center items-center overflow-hidden">
                            <img 
                                src={selectedImage} 
                                className="max-w-full max-h-full object-contain transition-all duration-500 ease-in-out hover:scale-105" 
                                alt={product.name}
                                onError={(e) => e.target.src = "https://placehold.jp/500x500.png"}
                            />
                        </div>

                        {/* Thumbnails Row */}
                        <div className="flex flex-wrap gap-4 justify-center mt-8">
                            {product.image && Array.isArray(product.image) && product.image.map((img, index) => (
                                <div 
                                    key={index}
                                    onMouseEnter={() => setSelectedImage(img)}
                                    className={`w-20 h-20 rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 ${
                                        selectedImage === img ? "border-blue-600 scale-110 shadow-md" : "border-gray-100 hover:border-gray-300"
                                    }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="thumb" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Right Side: Product Details --- */}
                    <div className="w-full md:w-1/2 flex flex-col justify-start">
                        {/* Title & Brand */}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            {product.name}
                        </h1>
                        

                        <div className="mt-4">
                             <span className="text-gray-500 font-semibold uppercase tracking-widest text-sm">
                                {product.category}
                             </span>
                        </div>
                        {/* alt name*/  }
                        <p className="text-gray-500 text-sm mt-2">
                            {product.altName}
                        </p>

                        {/* Description */}
                        <p className="text-gray-600 text-lg mt-6 leading-relaxed max-w-lg">
                            {product.description}
                        </p>

                        {/* Price Section */}
                        <div className="mt-8 flex flex-col">
                            {Number(product.labeledPrice) > Number(product.price) && (
                                <span className="text-gray-400 line-through text-xl">
                                    LKR. {Number(product.labeledPrice).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </span>
                            )}
                            <div className="flex items-center gap-6">
                                <span className="text-gray-900 font-extrabold text-5xl">
                                    LKR. {Number(product.price).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </span>
                                {product.stock > 0 ? 
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold uppercase">In Stock</span> :
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold uppercase">Out of Stock</span>
                                }
                            </div>
                        </div>

                        {/* --- Buttons Section: Add to Cart & Buy Now --- */}
                        <div className="flex flex-row gap-4 mt-12">
                            {/* Add to Cart Button */}
                            <button 
                            onClick={()=>
                            {
                                addToCart(product,1);
                                toast.success(`${product.name} added to cart!`);
                            }
                            }
                            
                            className="flex-1 bg-[#1e1e1e] text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-900 transition-colors shadow-lg active:scale-95 uppercase">
                                Add To Cart
                            </button>
                            
                            {/* Buy Now Button */}
                            <button 
                            onClick={()=>{
                                navigate("/checkout", { state: [{
                                    productID:product.productId,
                                    name:product.name,
                                    price:product.price,
                                    labeledPrice:product.labeledPrice,
                                    image:product.image[0],
                                    quantity:1
                                }]})
                            }}
                            
                            className="flex-1 bg-white text-black border-2 border-black py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-500 transition-colors active:scale-95 uppercase">
                                Buy Now
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-10 border-t border-gray-100 pt-6">
                            <p className="text-sm text-gray-500">
                                <strong>Brand:</strong> {product.brand}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}