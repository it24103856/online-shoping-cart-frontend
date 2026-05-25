// Icons
import { BiPlus } from "react-icons/bi";

// Router link
import { Link } from "react-router-dom";

// HTTP client
import axios from "axios";

// React hooks
import { useEffect, useState, Fragment } from "react";

import { useNavigate } from "react-router-dom";

// Toast notifications
import toast from "react-hot-toast";

// Headless UI modal + animation helpers [web:13][web:16]
import { Dialog, Transition } from "@headlessui/react";

export default function AdminProductsPage() {
  // Stores product list from backend
  const [products, setProducts] = useState([]);

  // Controls showing "Loading products..." until API finishes
  const [loading, setLoading] = useState(true);

  // Controls whether the delete-confirm modal is open
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Stores which product user is trying to delete (to show in modal)
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Controls disabling buttons while delete API is running
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  // Load products once when page opens
  useEffect(() => {
    axios
      // GET all products from backend
      .get(import.meta.env.VITE_BACKEND_URL + "/products/all")
      .then((response) => {
        // Save products in state (renders table)
        setProducts(response.data);
      })
      .catch(() => {
        // Show toast if request fails
        toast.error("Failed to load products");
      })
      .finally(() => {
        // Stop loading state in both success/fail
        setLoading(false);
      });
  }, []); // [] = run only once on first render

  // Open modal and remember which product was clicked
  const openDeleteConfirm = (product) => {
    setSelectedProduct(product); // set the product we will delete if confirmed
    setIsConfirmOpen(true); // show modal
  };

  // Close modal (but don't allow closing during delete request)
  const closeDeleteConfirm = () => {
    if (deleting) return; // block closing while request is running
    setIsConfirmOpen(false); // hide modal
    setSelectedProduct(null); // clear selected product
  };

  // Runs ONLY when user clicks "Yes, delete" in modal
  const confirmDelete = async () => {
    // Safety check: if no product selected, do nothing
    if (!selectedProduct) return;

    // Get token (used for protected delete route)
    const token = localStorage.getItem("token");

    // Start deleting state (disable buttons + show "Deleting...")
    setDeleting(true);

    try {
      // Call backend delete endpoint for this product ID
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/products/" + selectedProduct.productId,
        {
          // Send token as Bearer in Authorization header
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Success toast
      toast.success("Product deleted");

      // Update UI immediately by removing deleted product from state
      setProducts((prev) =>
        prev.filter((p) => p.productId !== selectedProduct.productId)
      );

      // Close modal after deleting
      closeDeleteConfirm();
    } catch (e) {
      // Error toast if delete fails
      toast.error("Delete failed");
    } finally {
      // Stop deleting state even if request fails
      setDeleting(false);
    }
  };

  return (
    // Page background wrapper
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-10">
      {/* Main width container */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Product Management
          </h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Loading state */}
          {loading && (
            <div className="p-6 text-gray-600">Loading products...</div>
          )}

          {/* Table after loading */}
          {!loading && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Product ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Labeled Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Availability
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {/* Render each product row */}
                    {products.map((item) => (
                      <tr
                        key={item.productId} // stable key for React list rendering
                        className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-300 ease-in-out transform hover:scale-[1.01]"
                      >
                        {/* Image */}
                        <td className="px-6 py-4">
                          <div className="relative group">
                            <img
                              src={item.image?.[0]} // first image URL
                              alt={item.name} // image alt text
                              className="w-16 h-16 object-cover rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300 ring-2 ring-gray-100"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                          </div>
                        </td>

                        {/* Product ID */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                            {item.productID}
                          </span>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">
                            {item.name}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4 max-w-xs">
                          <p
                            className="text-sm text-gray-600 line-clamp-2"
                            title={item.description} // show full on hover
                          >
                            {item.description}
                          </p>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-green-600">
                            LKR {Number(item.price || 0).toFixed(2)}
                          </span>
                        </td>

                        {/* Labeled Price */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500 line-through">
                            LKR {Number(item.labeledPrice || 0).toFixed(2)}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                        </td>

                        {/* Brand */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">
                            {item.brand}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm ${
                              item.stock > 20
                                ? "bg-green-100 text-green-800"
                                : item.stock > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.stock}
                          </span>
                        </td>

                      {/* Availability column එක මේ විදිහට update කරන්න */}
<td className="px-6 py-4">
  <span
    className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold shadow-sm ${
      item.stock > 0
        ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
        : "bg-gradient-to-r from-red-400 to-red-500 text-white"
    }`}
  >
    {item.stock > 0 ? "✓ Available" : "✗ Out of Stock"}
  </span>
</td>

                        
                        {/* Actions */}
                       <td className="px-4 py-3 text-sm"> 
                        <div className="inline-flex items-center gap-2 opacity-80">
                         {/* ✅ Edit Button - FIXED */}
                           {/*  <Link
                           to={`/admin/update-product/${item.productId}`}  // ✅ Dynamic product ID
                           className="w-[110px] bg-blue-600 text-white flex justify-center items-center p-2 rounded-lg hover:bg-blue-500 transition-colors duration-300"
                           state={item}
                              >
                             Edit
                              </Link> */}
                              <button
                              onClick={()=>{
                                navigate(`/admin/update-product/${item.productId}`,{state:item})
                              }}
                              className="w-[110px] bg-blue-600 text-white flex justify-center items-center p-2 rounded-lg hover:bg-blue-500 transition-colors duration-300"
                              >
                                Edit
                              </button>

                                  {/* ✅ Delete Button (unchanged) */}
                                       <button
                                      onClick={() => openDeleteConfirm(item)}
                                    className="w-[110px] bg-red-600 text-white justify-center items-center p-2 rounded-lg cursor-pointer hover:bg-red-500 transition-colors duration-300"
                               >
                                   Delete
                                    </button>
                                      </div>
                                  </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty state */}
              {products.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                    <BiPlus className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Products Yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Get started by adding your first product
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal (centered + separated well) */}
      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog
          open={isConfirmOpen} // controls visibility
          onClose={closeDeleteConfirm} // runs when clicking outside / ESC
          className="relative z-50" // keep modal above other content
        >
          {/* Backdrop behind modal (separate from the panel) [web:13] */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-gray-900/55 backdrop-blur-sm"
              aria-hidden="true" // backdrop is decorative for screen readers
            />
          </Transition.Child>

          {/* Fullscreen container to center the modal panel [web:13] */}
          <div className="fixed inset-0 grid place-items-center p-4">
            {/* Animated panel */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2 scale-[0.98]"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-2 scale-[0.98]"
            >
              <Dialog.Panel className="w-full max-w-lg rounded-3xl bg-white shadow-2xl ring-1 ring-black/10">
                {/* Small top gradient strip */}
                <div className="h-2 w-full rounded-t-3xl bg-gradient-to-r from-red-500 via-rose-500 to-orange-400" />

                {/* Panel content padding */}
                <div className="p-6 sm:p-7">
                  {/* Header row */}
                  <div className="flex items-start gap-4">
                    {/* Warning icon container */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100">
                      {/* Inline SVG icon (no extra library needed) */}
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v4m0 4h.01M10.29 3.86l-7.4 12.83A2 2 0 004.62 20h14.76a2 2 0 001.73-3.31l-7.4-12.83a2 2 0 00-3.42 0z"
                        />
                      </svg>
                    </div>

                    {/* Title + subtitle */}
                    <div className="min-w-0 flex-1">
                      <Dialog.Title className="text-xl font-bold text-gray-900">
                        Confirm delete
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-gray-600">
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  {/* Selected product card */}
                  {selectedProduct && (
                    <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedProduct.image?.[0]}
                          alt={selectedProduct.name}
                          className="h-14 w-14 rounded-xl object-cover ring-1 ring-gray-200 bg-white"
                        />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-gray-900">
                            {selectedProduct.name}
                          </div>
                          <div className="mt-0.5 text-xs text-gray-500 font-mono">
                            ID: {selectedProduct.productId}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      onClick={closeDeleteConfirm} // close modal without deleting
                      disabled={deleting} // disabled while API running
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
                    >
                      No, keep it
                    </button>

                    <button
                      onClick={confirmDelete} // actually deletes
                      disabled={deleting} // disabled while API running
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-100 hover:shadow-red-200 transition disabled:opacity-60"
                    >
                      {deleting ? "Deleting..." : "Yes, delete"}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Floating Add button */}
      <Link
        to="/admin/add-product" // route to add product page
        className="fixed bottom-8 right-8 w-16 h-16 flex items-center justify-center rounded-full
               bg-gradient-to-r from-accent via-accent to-accent/90 text-white shadow-2xl
               hover:shadow-accent/50 hover:scale-110 transition-all duration-300 transform
               ring-4 ring-white group"
      >
        <BiPlus className="text-4xl group-hover:rotate-90 transition-transform duration-300" />
      </Link>
    </div>
  );
}
