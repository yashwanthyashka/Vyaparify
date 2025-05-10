import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  Shield,
  HelpCircle,
  FileText,
  AlertCircle,
  Settings,
  Sparkles
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="relative z-10 p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 
                              shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 
                              transition-all duration-300">
                  <Store className="h-6 w-6 text-white transform group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                              blur-lg rounded-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-emerald-400 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 
                               bg-clip-text text-transparent tracking-wide">
                  VYAPARIFY
                </span>
                <span className="text-xs text-gray-400 tracking-wider font-medium">
                  MARKETPLACE
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm">
              Your trusted marketplace for quality used products. Connect, trade, and discover amazing deals.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/category/electronics" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/category/vehicles" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link to="/category/property" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Property
                </Link>
              </li>
              <li>
                <Link to="/category/furniture" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Furniture
                </Link>
              </li>
              <li>
                <Link to="/category/fashion" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-2 text-emerald-500" />
                <span>weavers colony, bengaluru, karnataka</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-2 text-emerald-500" />
                <span>+91 984486711</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-2 text-emerald-500" />
                <span>support@vyaparify.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} Vyaparify. All rights reserved.
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-400 text-sm flex items-center">
                Made with <Heart className="h-4 w-4 text-emerald-500 mx-1" /> by Vyaparify Team
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}