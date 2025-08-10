import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart, Share2, ChevronLeft } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8000/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        const found = data.find((p) => (p._id || p.id) === id);
        if (!found) throw new Error("Product not found");
        setProduct(found);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 mt-[100px] py-8 max-w-6xl text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 inline-block">
          <h2 className="text-xl font-bold text-red-700">Error Loading Product</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-400/50 text-yellow-400"
            : "fill-gray-300 text-gray-300"
        }`}
      />
    ));

  return (
    <div className="container mx-auto px-4 mt-[100px] py-8 max-w-6xl">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="ml-1">Back to Products</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border">
            <img
              src={product.images?.[selectedImageIndex] || "/placeholder-image.png"}
              alt={product.title || "Product Image"}
              className="w-full h-full object-contain transition-all duration-300"
              onError={(e) => e.target.src = "/placeholder-image.png"}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
            {product.images?.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-square w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  selectedImageIndex === index
                    ? "border-blue-600 ring-2 ring-blue-600/20"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  src={imageUrl || "/placeholder-image.png"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "/placeholder-image.png"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
            {product.category}
          </span>
          
          <h1 className="text-3xl py-6 text-blue-800 lg:text-4xl font-bold">{product.title}</h1>
          
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-500">
              {product.rating.toFixed(1)} • {product.reviews?.length || 0} reviews
            </span>
          </div>
          
          <div className="text-3xl font-bold text-green-700">₹{product.price}</div>
          
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {product.tags?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
            <button 
              onClick={toggleWishlist}
              className={`p-3 rounded-lg transition ${
                isWishlisted 
                  ? "bg-red-50 border-red-300 text-red-600" 
                  : "border border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
              }`}
            >
              <Heart 
                className={`w-5 h-5 ${isWishlisted ? "fill-red-600" : ""}`} 
              />
            </button>
            <button className="p-3 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Reviews Section */}
      <div className="space-y-6 mt-16">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-600">Customer Reviews</h2>
          {product.reviews?.length > 0 && (
            <div className="flex items-center">
              <div className="flex mr-2">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)} out of 5
              </span>
            </div>
          )}
        </div>

        {product.reviews?.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((comment, index) => (
              <div key={index} className="border rounded-xl p-6 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12" />
                  <div>
                    <h4 className="font-semibold">Customer {index + 1}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(product.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <div className="text-gray-400 mb-2">No reviews yet</div>
            <p className="text-gray-500 max-w-md mx-auto">
              Be the first to share your thoughts about this product!
            </p>
          </div>
        )}

        {/* Review CTA */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
}
