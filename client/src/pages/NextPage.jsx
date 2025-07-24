import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  Heart,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Zap,
} from "lucide-react";

const NextPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const recommendation = state?.recommendation;
  const products = state?.products || [];
  const query = state?.query;

  if (!recommendation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p>No AI recommendation found.</p>
        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header with back button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1">Back to search</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* AI Recommendation Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">AI Recommended Product</h2>
              {query && (
                <p className="text-gray-600">
                  Based on your search: <span className="font-medium text-blue-600">"{query}"</span>
                </p>
              )}
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              AI-Powered Selection
            </div>
          </div>

          {/* Recommendation Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative bg-gray-50 p-8 flex items-center justify-center">
                <img
                  src={recommendation.images?.[0]}
                  alt={recommendation.title}
                  title={recommendation.title}
                  className="rounded-xl max-h-[350px] object-contain transition-transform duration-500 hover:scale-105"
                />
                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
              </div>

              {/* Details Section */}
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{recommendation.title}</h3>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(recommendation.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-600">{recommendation.rating}</span>
                      </div>
                      <span className="text-gray-500">|</span>
                      <span className="ml-4 text-green-600 font-medium">
                        {recommendation.sentiment_score}% Positive
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Best Match
                  </div>
                </div>

                <div className="my-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <BadgeCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">AI Recommendation</h4>
                      <p className="text-gray-700">{recommendation.reasoning}</p>
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-gray-900">₹{recommendation.price}</span>
                    {recommendation.originalPrice && (
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        ₹{recommendation.originalPrice}
                      </span>
                    )}
                    {recommendation.discount && (
                      <span className="ml-2 text-green-600 font-medium">
                        {recommendation.discount}% off
                      </span>
                    )}
                  </div>
                  <p className="text-green-600 font-medium mt-1">Inclusive of all taxes</p>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-700">{recommendation.sentiment_score}% Positive</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">{recommendation.sold} Sold</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-gray-700">Free Delivery</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheck className="w-5 h-5 text-amber-500 mr-2" />
                    <span className="text-gray-700">1 Year Warranty</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {products.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
              <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer bg-white border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden"
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.title}
                      title={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-xs text-blue-600 uppercase font-medium">
                        {product.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
                        {product.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-800">₹{product.price}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                    <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium py-2 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextPage;