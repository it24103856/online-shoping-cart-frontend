import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Star, MessageSquare, User } from "lucide-react";

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newReview, setNewReview] = useState({
    productId: "",
    rating: 5,
    title: "",
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/reviews`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReviews(response.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.title || !newReview.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reviews`,
        newReview,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Review submitted successfully!");
      setNewReview({ productId: "", rating: 5, title: "", comment: "" });
      fetchReviews();
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2">
        <MessageSquare size={32} />
        Customer Reviews
      </h1>

      {/* Write a Review Form */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="font-bold text-xl text-slate-900 mb-6">Write a Review</h2>
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-900 mb-2">Product ID</label>
              <input
                type="text"
                value={newReview.productId}
                onChange={(e) => setNewReview({ ...newReview, productId: e.target.value })}
                placeholder="Enter product ID"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-900 mb-2">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              >
                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                <option value={3}>⭐⭐⭐ 3 Stars</option>
                <option value={2}>⭐⭐ 2 Stars</option>
                <option value={1}>⭐ 1 Star</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-900 mb-2">Review Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              placeholder="e.g., Great product, highly recommended!"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-900 mb-2">Review Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience with this product..."
              rows="5"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="font-bold text-xl text-slate-900 mb-4">Customer Reviews</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No reviews yet</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.reviewer?.[0] || "U"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{review.reviewer || "Anonymous"}</p>
                    <p className="text-slate-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">{renderStars(review.rating)}</div>
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-2">{review.title}</h3>
              <p className="text-slate-700">{review.comment}</p>

              <div className="mt-4 flex gap-4 text-sm text-slate-500">
                <button className="hover:text-blue-600 transition-all">👍 Helpful</button>
                <button className="hover:text-blue-600 transition-all">👎 Not Helpful</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
