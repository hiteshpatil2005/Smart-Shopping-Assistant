<<<<<<< HEAD
import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ShoppingCart, Star, TrendingUp, Users, CheckCircle, Heart, ArrowRight } from "lucide-react"

const NextPage = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const recommendation = state?.recommendation
  const products = state?.products || []
  const query = state?.query

  if (!recommendation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p>No AI recommendation found.</p>
        <button
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AI Recommendation Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">AI Recommended Product</h2>
        {query && (
          <p className="text-blue-600 mb-6">
            Showing results for: <span className="font-medium">"{query}"</span>
          </p>
        )}

        <div className="bg-white border p-6 rounded-xl shadow-lg mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <img
              src={recommendation.images?.[0]}
              alt={recommendation.title}
              title={recommendation.title}
              className="rounded-xl max-h-[300px] object-contain"
            />
            <div>
              <h3 className="text-2xl font-bold mb-2">{recommendation.title}</h3>
              <p className="text-gray-700 mb-4">{recommendation.reasoning}</p>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-blue-500" />
                <span>{recommendation.sentiment_score}% Positive Reviews</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-green-600" />
                <span>{recommendation.sold} Sold</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="text-yellow-500 fill-yellow-500" />
                <span>{recommendation.rating}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {products.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden"
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.title}
                      title={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <span className="text-xs text-blue-600 uppercase">{product.category}</span>
                      <h3 className="font-semibold text-blue-900 text-lg">{product.title}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-800">₹{product.price}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    <button className="w-full bg-yellow-500 hover:bg-blue-900 text-blue-900 hover:text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
=======
import React from 'react'

const NextPage = () => {
  return (
    <div>
      i m Next page
>>>>>>> a6761be5bedc50def202ba6b7976c3d1d70ac9f1
    </div>
  )
}

export default NextPage
