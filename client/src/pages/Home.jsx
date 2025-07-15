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
  Loader2,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
} from "lucide-react"
import axios from 'axios'
import { useNavigate } from "react-router-dom";


const categories = [
  { name: "Home", icon: Home },
  { name: "Mobile", icon: Smartphone },
  { name: "Fashion", icon: Shirt },
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
  const [products, setProducts] = useState([])
  const [aiRecommendation, setAiRecommendation] = useState(null)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)

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

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/products")
      const allProducts = response.data
      const random50 = allProducts.sort(() => Math.random() - 0.5).slice(0, 50)
      setProducts(random50)
      setFilteredProducts(random50)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  // AI Recommendation Function
  const getAIRecommendation = async (query) => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await axios.post("http://localhost:8000/recommend", {
        query: query
      })
      setAiRecommendation(response.data)
    } catch (error) {
      console.error("Error getting AI recommendation:", error)
      setAiRecommendation(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Normal Search Function
  const performNormalSearch = (query) => {
    if (!query.trim()) {
      setFilteredProducts(products)
      return
    }

    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase()) ||
      product.category?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredProducts(filtered)
  }

  // Handle Search
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchPerformed(true);

    if (isAISearch) {
      setIsLoading(true);
      try {
        const response = await axios.post("http://localhost:8000/recommend", {
          query: searchQuery
        });

        const recommendationData = response.data;
        setAiRecommendation(recommendationData);

        // Navigate after data is set
        navigate("/next-page", {
          state: {
            recommendation: recommendationData,
            query: searchQuery
          }
        });
      } catch (error) {
        console.error("Error getting AI recommendation:", error);
        setAiRecommendation(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      performNormalSearch(searchQuery);
      setAiRecommendation(null);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Reset search when toggle changes
  const handleToggleChange = () => {
    setIsAISearch(!isAISearch)
    setAiRecommendation(null)
    setFilteredProducts(products)
    setSearchPerformed(false)
    setSearchQuery("")
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter products by category
  useEffect(() => {
    if (selectedCategory && !searchPerformed) {
      const categoryFiltered = products.filter(product =>
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
      setFilteredProducts(categoryFiltered)
    } else if (!selectedCategory && !searchPerformed) {
      setFilteredProducts(products)
    }
  }, [selectedCategory, products, searchPerformed])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-800 via-blue-800 to-blue-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-16 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-full px-6 py-3 mb-8">
              <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-yellow-300 font-semibold">AI-Powered Shopping Experience</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find What You
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500 animate-pulse">
                Love to Buy
              </span>
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover millions of products with our intelligent search. Let AI help you find exactly what you're
              looking for, or explore trending items curated just for you.
            </p>
          </div>

          {/* Enhanced Search Section */}
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6">
              {/* Main Search Bar */}
              <div className="flex-1 w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
                <div className="relative flex">
                  <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
                    {isLoading ? (
                      <Loader2 className="h-7 w-7 text-yellow-500 animate-spin" />
                    ) : isAISearch ? (
                      <div className="relative">
                        <Sparkles className="h-7 w-7 text-yellow-500" />
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
                    onKeyPress={handleKeyPress}
                    className="w-full pl-20 pr-32 py-6 text-xl bg-white/95 backdrop-blur-sm border-white/20 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 focus:outline-none rounded-4xl shadow-2xl placeholder:text-gray-500 text-blue-900 font-medium"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isLoading || !searchQuery.trim()}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-blue-900 font-bold rounded-4xl transition-all duration-300 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Search</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Toggle */}
              <div className="flex flex-col items-center space-y-3">
                <button
                  onClick={handleToggleChange}
                  className={`relative w-20 h-10 rounded-full transition-all duration-500 transform hover:scale-110 focus:outline-none shadow-xl ${isAISearch ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gray-400"
                    }`}
                >
                  <div
                    className={`absolute top-1 w-8 h-8 rounded-full shadow-lg transition-all duration-500 transform flex items-center justify-center ${isAISearch ? "translate-x-10 bg-white" : "translate-x-1 bg-white"
                      }`}
                  >
                    <Sparkles className={`w-4 h-4 ${isAISearch ? "text-green-500" : "text-gray-400"}`} />
                  </div>
                </button>
                <span
                  className={`text-sm font-bold transition-all duration-300 ${isAISearch ? "text-green-400" : "text-blue-200"
                    }`}
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
                    onClick={() => setSearchQuery(suggestion)}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 cursor-pointer transition-all duration-300 px-6 py-3 text-sm font-medium shadow-lg hover:shadow-xl rounded-2xl"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="pb-10 bg-gradient-to-br from-blue-800 to-blue-800 relative overflow-hidden">
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Shop by
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
                {" "}
                Category
              </span>
            </h2>
            <p className="text-blue-100 text-xl max-w-2xl mx-auto">
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
                  onClick={() => {
                    setSelectedCategory(isSelected ? "" : category.name)
                    setSearchPerformed(false)
                    setAiRecommendation(null)
                  }}
                >
                  <div className="relative">
                    <div
                      className={`absolute -inset-2 rounded-3xl blur-xl transition-all duration-500 ${isSelected
                        ? "bg-yellow-400/30 scale-110"
                        : "bg-yellow-400/0 group-hover:bg-yellow-400/20 group-hover:scale-105"
                        }`}
                    ></div>

                    <div
                      className={`relative w-full h-32 rounded-2xl transition-all duration-500 transform ${isSelected
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-500 scale-110 shadow-2xl shadow-yellow-500/25"
                        : "bg-gradient-to-br from-blue-800 to-blue-700 group-hover:from-yellow-500/20 group-hover:to-yellow-400/20 group-hover:scale-105 shadow-xl"
                        } border-2 ${isSelected ? "border-yellow-300" : "border-blue-600 group-hover:border-yellow-400/50"
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        </div>
                      )}

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

                        <span
                          className={`text-xs font-bold text-center leading-tight transition-all duration-300 ${isSelected ? "text-blue-900" : "text-white group-hover:text-yellow-200"
                            }`}
                        >
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* AI Recommendation Section */}
      {aiRecommendation && (
        <div className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-8 py-4 mb-8">
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider">AI Recommendation</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Perfect Match
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600"> Found</span>
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Our AI has analyzed your query and found the ideal product tailored to your needs
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">AI Recommended</h3>
                      <p className="text-emerald-100 font-medium">Personalized selection</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-white mb-2">${aiRecommendation.price}</div>
                    <div className="flex items-center space-x-2 justify-end">
                      <div className="flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1">
                        <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                        <span className="text-white font-semibold">{aiRecommendation.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Product Image */}
                  <div className="space-y-6">
                    {aiRecommendation.images?.[0] && (
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative bg-slate-50 rounded-2xl p-8 border border-slate-200">
                          <img
                            src={aiRecommendation.images[0]}
                            alt={aiRecommendation.title}
                            className="w-full h-80 object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                        {aiRecommendation.title}
                      </h4>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-100">
                          <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-xl font-bold text-blue-900">{aiRecommendation.sentiment_score}%</div>
                          <div className="text-xs text-blue-600 font-medium">Positive Reviews</div>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 text-center border border-emerald-100">
                          <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                          <div className="text-xl font-bold text-emerald-900">{aiRecommendation.sold.toLocaleString()}</div>
                          <div className="text-xs text-emerald-600 font-medium">Units Sold</div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 text-center border border-amber-100">
                          <Star className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                          <div className="text-xl font-bold text-amber-900">{aiRecommendation.rating}/5</div>
                          <div className="text-xs text-amber-600 font-medium">Rating</div>
                        </div>
                      </div>

                      {/* AI Reasoning */}
                      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
                        <h5 className="font-semibold text-slate-900 mb-3 flex items-center">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          Why This Product Matches Your Needs
                        </h5>
                        <p className="text-slate-700 leading-relaxed">{aiRecommendation.reasoning}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center group">
                        <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Add to Cart
                      </button>
                      <button className="flex-1 bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center group">
                        <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Save for Later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Products Section */}
      <div className="py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-1 sm:px-2 lg:px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              {searchPerformed && !isAISearch ? `Search Results for "${searchQuery}"` :
                selectedCategory ? `${selectedCategory} Products` : "All Products"}
            </h2>
            <p className="text-blue-700 text-lg">
              {filteredProducts.length > 0 ? `${filteredProducts.length} products found` : "No products found"}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
              {filteredProducts.map((product) => {
                const reviewCount = product.reviews?.length || product.reviewCount || 0;
                return (
                  <div key={product._id || product.id} className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border border-gray-200 bg-white hover:border-yellow-500/30 hover:-translate-y-2 rounded-lg overflow-hidden">
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <img
                        src={(product.images && product.images[0]) || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {getBadge(product.sold, product.rating) && (
                        <span
                          className={`absolute top-3 left-3 ${getBadgeStyle(getBadge(product.sold, product.rating))} font-medium text-xs px-2 py-1 shadow-sm rounded-full`}
                        >
                          {getBadge(product.sold, product.rating)}
                        </span>
                      )}
                      <button className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 p-2">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <span className="bg-yellow-500/10 text-blue-900 text-xs font-medium border border-yellow-500/20 px-2 py-1 rounded-full inline-block">
                          {product.category}
                        </span>
                        <h3 className="font-semibold text-blue-900 group-hover:text-yellow-500 transition-colors text-sm line-clamp-2">
                          {product.title}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-blue-900">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 transition-colors duration-200 ${i < Math.round(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      <button className="w-full bg-yellow-500 hover:bg-blue-900 text-blue-900 hover:text-white font-bold py-2 text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-lg group/btn overflow-hidden relative">
                        <span className="relative z-10 flex items-center justify-center">
                          Add to Cart
                          <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </span>
                        <div className="absolute inset-0 bg-blue-900 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : searchPerformed && !isAISearch ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
              <p className="text-gray-600 mb-8">Try adjusting your search terms or browse our categories</p>
              <button
                onClick={() => {
                  setSearchPerformed(false)
                  setSearchQuery("")
                  setFilteredProducts(products)
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-8 rounded-xl transition-all duration-300"
              >
                Clear Search
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}