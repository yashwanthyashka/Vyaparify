import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Tag, Truck, ShieldCheck, TrendingUp, MapPin, Clock } from 'lucide-react';
import API from '../api';
import SearchFilters from '../components/SearchFilters';

export default function Home() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    location: '',
    sort: 'newest'
  });

  const categories = [
    { name: 'Electronics', icon: Package },
    { name: 'Fashion', icon: (props) => <svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8C3.5 8 7.5 10 12 10C16.5 10 20.5 8 20.5 8M12 10V21M4.5 2C4.5 2 4.5 6.5 8 6.5C11.5 6.5 11.5 2 11.5 2M12.5 2C12.5 2 12.5 6.5 16 6.5C19.5 6.5 19.5 2 19.5 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { name: 'Books', icon: Tag },
    { name: 'Sports', icon: TrendingUp },
    { name: 'Vehicles', icon: Truck },
    { name: 'Furniture', icon: (props) => <svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 10V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V10M20 10V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V10M20 10H4M8 14V17M16 14V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { name: 'Toys', icon: (props) => <svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4v4m0 0a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 0V4m0 16v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { name: 'Jewelry', icon: (props) => <svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { name: 'Phones', icon: (props) => <svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { name: 'Cameras', icon: (props) => <svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M12 13a2 2 0 100-4 2 2 0 000 4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { name: 'Computers', icon: (props) => <svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { name: 'Gaming', icon: (props) => <svg {...props} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 9H14V7.5C14 7.22386 13.7761 7 13.5 7H10.5C10.2239 7 10 7.22386 10 7.5V9H9.5C9.22386 9 9 9.22386 9 9.5V12.5C9 12.7761 9.22386 13 9.5 13H10V14.5C10 14.7761 10.2239 15 10.5 15H13.5C13.7761 15 14 14.7761 14 14.5V13H14.5C14.7761 13 15 12.7761 15 12.5V9.5C15 9.22386 14.7761 9 14.5 9Z M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
  ];

  // Function to fetch ads with filters
  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/api/ads', {
        params: {
          sort: 'newest'
        }
      });
      setAds(response.data);
    } catch (err) {
      setError('Failed to fetch ads. Please try again later.');
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-500">
        {error}
      </div>
    );
  }

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAds();
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-[85vh] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
          </div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center">
          <div className="space-y-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 animate-fade-in">
              <span className="px-2 py-1 text-xs font-semibold bg-emerald-500 text-white rounded-full">New</span>
              <span className="ml-2 text-sm text-emerald-200">Join our marketplace today!</span>
            </div>

            {/* Main Heading */}
            <h1 className="max-w-4xl mx-auto space-y-4">
              <span className="pb-4 block text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 leading-tight">
                Discover Amazing Deals on Quality Products
              </span>
              <span className="block text-xl md:text-2xl text-gray-300 font-light">
                Join our thriving community of <span className="text-emerald-400 font-medium">10,000+</span> users finding incredible bargains every day
              </span>
            </h1>

            {/* Search Section */}
            <div className="w-full max-w-3xl mx-auto mt-12">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full h-16 pl-12 pr-36 bg-white/10 backdrop-blur-xl text-white rounded-2xl
                           border border-white/20 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500
                           placeholder-gray-400 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 rounded-xl
                           bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600
                           transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20
                           text-white font-medium flex items-center space-x-2"
                >
                  <span>Search</span>
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {/* Popular Searches */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <span className="text-sm text-gray-400">Popular:</span>
                {['Laptops', 'Phones', 'Cameras', 'Books'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-4 py-2 text-sm bg-white/5 hover:bg-emerald-500/10 rounded-full
                             border border-white/10 hover:border-emerald-500/20 transition-all duration-300"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-6 bg-gray-800 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Browse Categories
              </h2>
            </div>
            <Link to="/categories" className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex items-center">
              View all
              <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Horizontal scrollable row */}
          <div className="relative">
            {/* Left shadow gradient for scroll indication */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-800 to-transparent z-10 pointer-events-none"></div>

            {/* Right shadow gradient for scroll indication */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-800 to-transparent z-10 pointer-events-none"></div>

            {/* Scrollable container */}
            <div className="flex overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {categories.map(({ name, icon: Icon }) => (
                <Link
                  key={name}
                  to={`/category/${name.toLowerCase()}`}
                  className="group flex-shrink-0 flex flex-col items-center p-2 mx-1 bg-gray-800 rounded-lg border border-gray-700
                           hover:border-emerald-500/30 hover:bg-gray-700 transition-all duration-200 w-20"
                >
                  <div className="p-1.5 rounded-full bg-gray-700 group-hover:bg-emerald-500/10 mb-1.5 transition-colors">
                    <Icon className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xs font-medium text-center truncate w-full group-hover:text-emerald-400 transition-colors">{name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-gray-400">{ads.length} amazing deals available</p>
            </div>
            <SearchFilters onFilterChange={handleFilterChange} initialFilters={filters} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ads.map((ad) => (
              <div key={ad._id} className="group relative">
                <Link
                  to={`/product/${ad._id}`}
                  className="block h-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700
                           hover:border-emerald-500/30 transition-all duration-200"
                >
                  {/* Image container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-700">
                    <img
                      src={ad.images[0]}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Condition badge */}
                    {ad.condition && (
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center px-2 py-1 bg-emerald-500/90 text-white text-xs font-medium rounded">
                          {ad.condition}
                        </span>
                      </div>
                    )}

                    {/* Price tag */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900/90 to-transparent p-3 pt-6">
                      <p className="text-lg font-bold text-white">
                        ₹{ad.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    {/* Title */}
                    <h3 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                      {ad.title}
                    </h3>

                    {/* Info row */}
                    <div className="flex items-center justify-between mt-2 text-gray-400 text-xs">
                      {/* Location */}
                      {ad.location && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-emerald-500/70" />
                          <span className="truncate max-w-[100px]">{ad.location}</span>
                        </div>
                      )}

                      {/* Posted date */}
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-emerald-500/70" />
                        <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4 justify-center">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Secure Trading</h3>
              <p className="text-gray-400">Safe and secure transactions</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 justify-center">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
              <Tag className="h-8 w-8 text-teal-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Best Prices</h3>
              <p className="text-gray-400">Quality items at great prices</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 justify-center">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
              <MapPin className="h-8 w-8 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Local Sellers</h3>
              <p className="text-gray-400">Find sellers near you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









