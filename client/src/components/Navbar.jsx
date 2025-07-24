import React from 'react'
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

const Navbar = () => {
  return (
    <div>
       <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-2xl border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Enhanced Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <ShoppingCart className="w-7 h-7 text-blue-900" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ShopSphere</h1>
                <p className="text-yellow-300 text-sm font-medium">Your Shopping Universe</p>
              </div>
            </div>

            {/* Enhanced Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <a
                  href="#"
                  className="text-white hover:text-yellow-300 font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </a>
                <a href="#" className="text-white hover:text-yellow-300 font-medium transition-colors duration-200">
                  Deals
                </a>
                <a href="#" className="text-white hover:text-yellow-300 font-medium transition-colors duration-200">
                  New Arrivals
                </a>
              </div>
            </div>

            {/* Enhanced Navigation Icons */}
            <div className="flex items-center space-x-3">
              <button className="text-white hover:bg-yellow-500/20 hover:text-yellow-300 transition-all duration-300 rounded-xl h-10 w-10 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </button>
              <button className="text-white hover:bg-yellow-500/20 hover:text-yellow-300 transition-all duration-300 rounded-xl h-10 w-10 flex items-center justify-center">
                <User className="w-5 h-5" />
              </button>
              <button className="text-white hover:bg-yellow-500/20 hover:text-yellow-300 transition-all duration-300 rounded-xl h-10 w-10 flex items-center justify-center relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full text-xs text-blue-900 flex items-center justify-center font-bold animate-bounce">
                  3
                </span>
              </button>
              <button className="md:hidden text-white hover:bg-yellow-500/20 hover:text-yellow-300 transition-all duration-300 rounded-xl h-10 w-10 flex items-center justify-center">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
