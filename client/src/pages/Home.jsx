import { useState, useEffect } from "react"
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  Sparkles,
  Star,
  ArrowRight,
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Book,
  Gamepad2,
  Car,
  Zap,
  ChevronDown,
} from "lucide-react"
import axios from 'axios'

const categories = [
  { name: "Electronics", icon: Smartphone },
  { name: "Fashion", icon: Shirt },
  { name: "Home", icon: Home },
  { name: "Sports", icon: Dumbbell },
  { name: "Books", icon: Book },
  { name: "Beauty", icon: Sparkles },
  { name: "Toys", icon: Gamepad2 },
  { name: "Automotive", icon: Car },
]



export default function EcommerceLanding() {
  const [isAISearch, setIsAISearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [products, setproduct] = useState([])


  const getBadge = (sold, rating) => {
    if (sold > 30000) return "Best Seller"
    if (rating >= 4.5) return "Top Rated"
    if (sold < 5000) return "Limited"
    return null
  }

  const getBadgeStyle = (badge) => {
  switch (badge) {
    case "Best Seller":
      return "bg-green-100 text-green-800"
    case "Top Rated":
      return "bg-blue-100 text-blue-800"
    case "Limited":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}



  const fetchProduct = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/products") // notice: /api/products
      const allProducts = response.data

      // Random shuffle and select 50
      const random50 = allProducts.sort(() => Math.random() - 0.5).slice(0, 50)
      setproduct(random50)

      console.log("Fetched products:", random50)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }


  useEffect(() => {
    fetchProduct();
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navy Header */}


      {/* Redesigned Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-yellow-500/5 to-transparent rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-full px-6 py-3 mb-8">
              <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-yellow-300 font-semibold">AI-Powered Shopping Experience</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find What You
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500 animate-pulse">
                Love to Buy
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover millions of products with our intelligent search. Let AI help you find exactly what you're
              looking for, or explore trending items curated just for you.
            </p>
          </div>

          {/* Enhanced Search Section */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6">
              {/* Main Search Bar */}
              <div className="flex-1 w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
                    {isAISearch ? (
                      <div className="relative">
                        <Sparkles className="h-7 w-7 text-yellow-500 animate-spin" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                      </div>
                    ) : (
                      <Search className="h-7 w-7 text-blue-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder={
                      isAISearch ? "✨ Ask me anything about products..." : "🔍 Search millions of products..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-20 pr-6 py-8 text-xl bg-white/95 backdrop-blur-sm border-2 border-white/20 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 focus:outline-none rounded-3xl shadow-2xl placeholder:text-gray-500 text-blue-900 font-medium"
                  />
                </div>
              </div>

              {/* AI Toggle */}
              <div className="flex flex-col items-center space-y-3">
                <button
                  onClick={() => setIsAISearch(!isAISearch)}
                  className={`relative w-20 h-10 rounded-full transition-all duration-500 transform hover:scale-110 focus:outline-none shadow-xl ${isAISearch ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gray-400"
                    }`}
                >
                  <div
                    className={`absolute top-1 w-8 h-8 rounded-full shadow-lg transition-all duration-500 transform flex items-center justify-center ${isAISearch ? "translate-x-10 bg-white" : "translate-x-1 bg-white"
                      }`}
                  >
                    <Sparkles className={`w-4 h-4 ${isAISearch ? "text-green-500 animate-spin" : "text-gray-400"}`} />
                  </div>
                </button>
                <span
                  className={`text-sm font-bold transition-all duration-300 ${isAISearch ? "text-green-400" : "text-blue-200"}`}
                >
                  AI Search
                </span>
              </div>
            </div>

            {/* AI Suggestions */}
            {isAISearch && (
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                {[
                  "Best gaming laptops under $1500",
                  "Sustainable fashion brands",
                  "Smart home essentials",
                  "Fitness equipment for beginners",
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 cursor-pointer transition-all duration-300 px-6 py-3 text-sm font-medium shadow-lg hover:shadow-xl rounded-2xl"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Redesigned Categories Section with Navy & Yellow Theme */}
      <div className="py-20  relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, yellow 2px, transparent 2px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-6 py-3 mb-6">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-yellow-300 font-semibold text-sm uppercase tracking-wider">Categories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
              Shop by
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
                {" "}
                Category
              </span>
            </h2>
            <p className="text-blue-200 text-xl max-w-2xl mx-auto">
              Explore our carefully curated product categories designed to help you find exactly what you need
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              const isSelected = selectedCategory === category.name

              return (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => setSelectedCategory(isSelected ? "" : category.name)}
                >
                  <div className="relative">
                    {/* Glow Effect */}
                    <div
                      className={`absolute -inset-2 rounded-3xl blur-xl transition-all duration-500 ${isSelected
                        ? "bg-yellow-400/30 scale-110"
                        : "bg-yellow-400/0 group-hover:bg-yellow-400/20 group-hover:scale-105"
                        }`}
                    ></div>

                    {/* Main Card */}
                    <div
                      className={`relative w-full h-32 rounded-2xl transition-all duration-500 transform ${isSelected
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-500 scale-110 shadow-2xl shadow-yellow-500/25"
                        : "bg-gradient-to-br from-blue-800 to-blue-700 group-hover:from-yellow-500/20 group-hover:to-yellow-400/20 group-hover:scale-105 shadow-xl"
                        } border-2 ${isSelected ? "border-yellow-300" : "border-blue-600 group-hover:border-yellow-400/50"
                        }`}
                    >
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        </div>
                      )}

                      {/* Icon Container */}
                      <div className="flex flex-col items-center justify-center h-full space-y-2 p-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isSelected
                            ? "bg-blue-900/90 shadow-lg"
                            : "bg-yellow-500/10 group-hover:bg-yellow-500/20 group-hover:shadow-lg"
                            }`}
                        >
                          <IconComponent
                            className={`w-6 h-6 transition-all duration-300 ${isSelected ? "text-yellow-400" : "text-yellow-400 group-hover:text-yellow-300"
                              }`}
                          />
                        </div>

                        {/* Category Name */}
                        <span
                          className={`text-xs font-bold text-center leading-tight transition-all duration-300 ${isSelected ? "text-blue-900" : "text-white group-hover:text-yellow-200"
                            }`}
                        >
                          {category.name.split(" ").map((word, i) => (
                            <div key={i}>{word}</div>
                          ))}
                        </span>
                      </div>

                      {/* Hover Shine Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected Category Display */}
          {selectedCategory && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-yellow-500/30 shadow-2xl">
                <span className="text-white font-semibold text-lg">Browsing:</span>
                <div className="flex items-center space-x-2 bg-yellow-500 px-4 py-2 rounded-xl">
                  <span className="font-bold text-blue-900">{selectedCategory}</span>
                </div>
                <button
                  onClick={() => setSelectedCategory("")}
                  className="text-yellow-300 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Section - No UI Library */}
      <div className="py-16 bg-amber-50">
        <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Featured Products</h2>
            <p className="text-blue-900/70 text-lg">Discover our most popular items</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border border-gray-200 bg-white hover:border-yellow-500/30 hover:-translate-y-2 rounded-lg overflow-hidden"
              >
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {getBadge(product.sold, product.rating) && (
                    <span
                      className={`absolute top-3 left-3 ${getBadgeStyle(getBadge(product.sold, product.rating))} font-medium text-xs px-2 py-1 shadow-sm animate-pulse rounded-full`}
                    >
                      {getBadge(product.sold, product.rating)}
                    </span>
                  )}

                  <button className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 p-2 flex items-center justify-center">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <span className="bg-yellow-500/10 text-blue-900 text-xs font-medium border border-yellow-500/20 px-2 py-1 rounded-full inline-block">
                      {product.category}
                    </span>
                    <h3 className="font-semibold text-blue-900 group-hover:text-yellow-500 transition-colors text-lg">
                      {product.title}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 transition-colors duration-200 ${i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews?.length || 0})</span>
                    </div>
                  </div>
                  {/* Enhanced Dynamic Button */}
                  <button className="w-full bg-yellow-500 hover:bg-blue-900 text-blue-900 hover:text-white font-bold py-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl group/btn overflow-hidden relative">
                    <span className="relative z-10 flex items-center justify-center">
                      Add to Cart
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-blue-900 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

