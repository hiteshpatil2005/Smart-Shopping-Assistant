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

const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 border-t-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-blue-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-500">ShopSphere</h3>
                  <p className="text-white/70 text-sm">Your Shopping Universe</p>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Your trusted destination for quality products, competitive prices, and exceptional customer service.
              </p>
            </div>
            {[
              {
                title: "Quick Links",
                links: ["About Us", "Contact", "FAQ", "Shipping Info"],
              },
              {
                title: "Categories",
                links: ["Electronics", "Fashion", "Home & Garden", "Sports"],
              },
              {
                title: "Customer Service",
                links: ["Returns", "Track Order", "Size Guide", "Support"],
              },
            ].map((section, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold text-yellow-200">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-white/70 hover:text-yellow-500 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/60 text-sm">
              &copy; 2024 ShopSphere. All rights reserved. |
              <a href="#" className="text-yellow-500 hover:text-yellow-200 transition-colors ml-1 hover:underline">
                Privacy Policy
              </a>{" "}
              |
              <a href="#" className="text-yellow-500 hover:text-yellow-200 transition-colors ml-1 hover:underline">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
