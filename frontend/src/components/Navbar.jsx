import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User as UserIcon, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  ChevronDown,
  Store,
  Sparkles,
  Heart,
  Trash2
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const wishlistItems = useWishlistStore((state) => state.items);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300  ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg ' : 'bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-90 transition-all group"
          >
            <div className="relative">
              {/* Main logo icon with gradient background */}
              <div className="relative z-10 p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 
                            shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 
                            transition-all duration-300">
                <Store className="h-7 w-7 text-white transform group-hover:scale-110 transition-transform" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                            blur-lg rounded-xl opacity-75 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-emerald-400 animate-pulse" />
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

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-gray-800/50 text-white rounded-lg py-2 pl-4 pr-10 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 
                           border border-gray-700/50 focus:border-emerald-500
                           transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/post"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 
                           hover:to-teal-600 px-4 py-2 rounded-lg font-medium
                           transition-all duration-300 flex items-center space-x-2
                           shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                >
                  <span>SELL NOW</span>
                </Link>

                {/* Notifications with new styling */}
                <button className="relative text-white hover:text-emerald-400 transition-colors">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs 
                                 rounded-full h-4 w-4 flex items-center justify-center
                                 border border-gray-900">
                    7
                  </span>
                </button>

                {/* Wishlist with new styling */}
                <div className="relative">
                  <button 
                    onClick={() => setShowWishlist(!showWishlist)}
                    className="relative text-white hover:text-emerald-400 transition-colors"
                  >
                    <Heart className="h-6 w-6" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs 
                                     rounded-full h-4 w-4 flex items-center justify-center
                                     border border-gray-900">
                        {wishlistItems.length}
                      </span>
                    )}
                  </button>

                  {/* Wishlist Dropdown */}
                  {showWishlist && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-sm 
                                  rounded-lg shadow-lg border border-emerald-500/20 py-2 
                                  animate-fadeIn z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <h3 className="text-white font-medium">Wishlist ({wishlistItems.length})</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {wishlistItems.length === 0 ? (
                          <div className="px-4 py-4 text-gray-400 text-center">
                            Your wishlist is empty
                          </div>
                        ) : (
                          wishlistItems.map((item) => (
                            <div key={item._id} 
                                 className="px-4 py-2 hover:bg-gray-700/50 flex items-center gap-3">
                              <img 
                                src={item.images[0]} 
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <Link 
                                  to={`/product/${item._id}`}
                                  className="text-white hover:text-emerald-400 text-sm font-medium 
                                           truncate block"
                                  onClick={() => setShowWishlist(false)}
                                >
                                  {item.title}
                                </Link>
                                <p className="text-emerald-400 text-sm">Rs.{item.price}</p>
                              </div>
                              <button
                                onClick={() => useWishlistStore.getState().removeItem(item._id)}
                                className="text-gray-400 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                      {wishlistItems.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-700">
                          <Link
                            to="/wishlist"
                            className="block text-center text-emerald-400 hover:text-emerald-300 
                                     text-sm font-medium"
                            onClick={() => setShowWishlist(false)}
                          >
                            View All Wishlist Items
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Dropdown with updated colors */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors"
                  >
                    <UserIcon className="h-6 w-6" />
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 
                      ${isProfileDropdownOpen ? 'transform rotate-180' : ''}`} 
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-lg 
                                  shadow-lg border border-emerald-500/20 py-1 animate-fadeIn">
                      <Link
                        to="/profile"
                        className="text-white block px-4 py-2 text-sm hover:bg-emerald-500/10 transition-colors"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/my-ads"
                        className="text-white block px-4 py-2 text-sm hover:bg-emerald-500/10 transition-colors"
                      >
                        My Ads
                      </Link>
                      {user.isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-rose-400 
                                 hover:bg-rose-500/10 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-emerald-400 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 
                           hover:to-teal-600 px-4 py-2 rounded-lg font-medium
                           transition-all duration-300 shadow-lg shadow-emerald-500/20 
                           hover:shadow-emerald-500/30"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 animate-slideDown">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-gray-700 text-white rounded-lg py-2 pl-4 pr-10 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
          <div className="px-4 py-3 space-y-3">
            {user ? (
              <>
                <Link
                  to="/post"
                  className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg 
                           font-medium text-center transition-colors"
                >
                  Post Ad
                </Link>
                <Link
                  to="/profile"
                  className="block hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  to="/my-ads"
                  className="block hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  My Ads
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="block text-yellow-500 hover:bg-gray-700 px-4 py-2 
                             rounded-lg transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left text-red-500 hover:bg-gray-700 
                           px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className=" block hover:bg-gray-700 px-4 py-2 rounded-lg 
                           transition-colors text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 
                           rounded-lg font-medium text-center transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}





