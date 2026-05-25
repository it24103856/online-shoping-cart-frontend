import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineProduct } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../../utils/mediaUpload";

export default function  () {
  const [productID, setProductID] = useState("");
const [files,setFiles]= useState([]);
  const [name, setName] = useState("");
  const [altName, setAltName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [labeledPrice, setLabeledPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [stock, setStock] = useState(0);
  const navigate = useNavigate();

  async function addProduct() {
    
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    
    if (productID == "" || name == "" || description == "" || price == "" || brand == "" || category == "") {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Upload images if provided
    let images = [];
    if (files && files.length > 0) {
      const imagePromises = [];
      for(let i=0; i<files.length; i++){
        const promise = uploadFile(files[i]);
        imagePromises.push(promise);
      }
      images = await Promise.all(imagePromises).catch((err)=>{
        console.log("Error uploading images:", err);
        toast.error("Error uploading images. Please try again.");
        return [];
      });
      if (!images || images.length === 0) {
        toast.error("Failed to upload images. Please try again.");
        return;
      }
    } else {
      toast.error("Please select at least one image");
      return;
    }

    try {
      const altNameInArray = altName ? altName.split(",").map(item => item.trim()).filter(item => item) : [];
      
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/products/create",
        {
          productId: productID,
          name,
          altName: altNameInArray,
          description,
          price: parseFloat(price),
          labeledPrice: parseFloat(labeledPrice) || 0,
          image: images,
          brand,
          category,
          isAvailable,
          stock: parseInt(stock) || 0
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      // Success handling
      toast.success("Product added successfully!");
      
      // Reset form fields
      setProductID("");
      setName("");
      setAltName("");
      setDescription("");
      setPrice("");
      setLabeledPrice("");
      setFiles([]);
      setBrand("");
      setCategory("");
      setIsAvailable(false);
      setStock(0);
      
      // Navigate back to products page
      setTimeout(() => {
        navigate("/admin/product");
      }, 1500);
      
    } catch (err) {
      toast.error("Error adding product. Please try again.");
      console.log("Error adding product:", err);
      
      // Optional: Show specific error message from backend
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      }
    }
  }

  const inputClass =
    "w-full h-[50px] border-2 border-gray-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 hover:border-accent/50 shadow-sm";

  const labelClass = "text-sm font-semibold text-gray-700 mb-2 block";

  return (
    <div className="w-full min-h-screen flex justify-center p-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <AiOutlineProduct />
            Add New Product
          </h1>
          <p className="text-gray-600">Fill in the details to add a product to your inventory</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-accent to-accent/80 p-6">
            <h2 className="text-2xl font-bold text-white">Product Information</h2>
          </div>

          <div className="p-8 space-y-6">
            {/* Product ID */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label className={labelClass}>Product ID *</label>
              <input
                type="text"
                value={productID}
                className={inputClass}
                placeholder="Enter unique product ID"
                onChange={(e) => setProductID(e.target.value)}
              />
            </div>

            {/* Product Name */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label className={labelClass}>Product Name *</label>
              <input
                type="text"
                value={name}
                className={inputClass}
                placeholder="Enter product name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Alt Names */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label className={labelClass}>Alternative Names</label>
              <input
                type="text"
                value={altName}
                className={inputClass}
                placeholder="Comma-separated alternative names"
                onChange={(e) => setAltName(e.target.value)}
              />
              <p className="text-right text-xs text-gray-500 mt-1 italic">
                Separate multiple names with commas
              </p>
            </div>

            {/* Description */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label className={labelClass}>Product Description *</label>
              <textarea
                value={description}
                className="w-full min-h-[120px] border-2 border-gray-200 rounded-xl px-4 py-3 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 hover:border-accent/50 shadow-sm resize-none"
                placeholder="Detailed product description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Price Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className={labelClass}>Price (LKR) *</label>
                <input
                  type="number"
                  value={price}
                  className={inputClass}
                  placeholder="0.00"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className={labelClass}>Labeled Price (LKR)</label>
                <input
                  type="number"
                  value={labeledPrice}
                  className={inputClass}
                  placeholder="0.00"
                  onChange={(e) => setLabeledPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Image */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label className={labelClass}>Product Images *</label>
              <input
                type="file"
                multiple={true}
                className={inputClass}
                placeholder="Select product images"
                onChange={(e) => setFiles(e.target.files)}
              />
              <p className="text-right text-xs text-gray-500 mt-1 italic">
                Select one or multiple images
              </p>
            </div>

            {/* Brand & Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className={labelClass}>Brand *</label>
                <input
                  type="text"
                  value={brand}
                  className={inputClass}
                  placeholder="Enter brand name"
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className={labelClass}>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-[50px] border-2 border-gray-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 hover:border-accent/50 shadow-sm cursor-pointer"
                >
                  <option value="">Select category</option>
                  <option value="vegetables">vegetables</option>
                  <option value="fruits">fruits</option>
                  <option value="cakes">cakes</option>
                  <option value="biscuits">biscuits</option>
                  <option value="Frozen Foods">Frozen Foods</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Dairy Products">Dairy Products</option>
                  <option value="Spices & Condiments">Spices & Condiments</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Breads & Buns">Breads & Buns</option>
                  <option value="Cleaning Supplies">Cleaning Supplies</option>
                </select>
              </div>
            </div>

            {/* Stock & Availability Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className={labelClass}>Stock Quantity</label>
                <input
                  type="number"
                  value={stock}
                  className={inputClass}
                  placeholder="0"
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className={labelClass}>Availability Status</label>
                <select
                  value={isAvailable ? "yes" : "no"}
                  onChange={(e) => setIsAvailable(e.target.value === "yes")}
                  className="w-full h-[50px] border-2 border-gray-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 hover:border-accent/50 shadow-sm cursor-pointer"
                >
                  <option value="yes">Available</option>
                  <option value="no">Out of Stock</option>
                </select>
              </div>
            </div>

            <Link to="/admin/product" className="text-2xl text-gray-500 hover:underline inline-block">
              &larr; Back to Products
            </Link>

            {/* Submit Button */}
            <button
              className="w-full h-[56px] bg-gradient-to-r from-accent to-accent/90 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 transform mt-8"
              onClick={addProduct}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
