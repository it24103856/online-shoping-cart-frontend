import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineProduct } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import uploadFile from "../../utils/mediaUpload";

export default function AdminUpdateProductsPage() {
  const loaction = useLocation();
  const [productID, setProductID] = useState(loaction.state?.productId || "");
  const [files, setFiles] = useState([]);
  const [name, setName] = useState(loaction.state?.name || "");
  const [altName, setAltName] = useState(loaction.state?.altName?.join(",") || "");
  const [description, setDescription] = useState(loaction.state?.description || "");
  const [price, setPrice] = useState(loaction.state?.price || "");
  const [labeledPrice, setLabeledPrice] = useState(loaction.state?.labeledPrice || "");
  const [brand, setBrand] = useState(loaction.state?.brand || "");
  const [category, setCategory] = useState(loaction.state?.category || "");
  const [isAvailable, setIsAvailable] = useState(loaction.state?.isAvailable || false);
  const [stock, setStock] = useState(loaction.state?.stock || 0);
  const navigate = useNavigate();
  if (!loaction.state) {
    window.location.href = "/admin/products";
  }

  async function updateProduct() {

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

    // Upload new images if provided, otherwise use existing ones
    let images = loaction.state?.image || [];
    if (files && files.length > 0) {
      const imagePromises = [];
      for (let i = 0; i < files.length; i++) {
        const promise = uploadFile(files[i]);
        imagePromises.push(promise);
      }
      images = await Promise.all(imagePromises).catch((err) => {
        console.log("Error uploading images:", err);
        toast.error("Error uploading images. Please try again.");
        return loaction.state?.image || [];
      });
    }

    try {
      const altNameInArray = altName ? altName.split(",").map(item => item.trim()).filter(item => item) : [];

      await axios.put(
        import.meta.env.VITE_BACKEND_URL + `/products/${productID}`,
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
      toast.success("Product updated successfully!");

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
     
      console.log("Error update product:", err);

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
            Upadate Product
          </h1>
          <p className="text-gray-600">Fill in the details to Update a product to your inventory</p>
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
                disabled
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
              <label className={labelClass}>Product Images</label>
              <input
                type="file"
                multiple={true}
                className={inputClass}
                placeholder="Select product images"
                onChange={(e) => setFiles(e.target.files)}
              />
              <p className="text-right text-xs text-gray-500 mt-1 italic">
                Leave empty to keep existing images, or select new images to replace
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
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Components">Components</option>
                  <option value="Gaming Keyboard">Gaming Keyboard</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Headphone">Headphone</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Mousepad">Mousepad</option>
                  <option value="USB">USB</option>
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
              onClick={updateProduct}
            >
              Upadate  Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
