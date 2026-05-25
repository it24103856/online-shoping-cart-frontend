import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Star, MessageSquare } from "lucide-react";

export default function FeedbackPage() {
  const [loading, setLoading] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    category: "website",
    rating: 5,
    feedback: "",
  });

  const categories = ["website", "services", "cake", "acessories", "All"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newFeedback.feedback) {
      toast.error("Please provide your feedback comment");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/feedbacks/create`,
        newFeedback,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Feedback submitted successfully!");
      setNewFeedback({ category: "website", rating: 5, feedback: "" });
    } catch (error) {
      console.error("Failed to submit feedback", error);
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <MessageSquare className="w-8 h-8 text-blue-600" />
        Submit Your Feedback
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Category
            </label>
            <select
              value={newFeedback.category}
              onChange={(e) =>
                setNewFeedback({ ...newFeedback, category: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer capitalize"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= newFeedback.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              value={newFeedback.feedback}
              onChange={(e) =>
                setNewFeedback({ ...newFeedback, feedback: e.target.value })
              }
              placeholder="Tell us what you think about our website or services..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-32 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:bg-blue-400"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}