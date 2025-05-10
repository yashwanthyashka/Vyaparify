import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MapPin, Tag } from 'lucide-react';
import axios from 'axios';
import SearchFilters from '../components/SearchFilters';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    location: '',
    sort: 'newest'
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/ads', {
          params: {
            search: query,
            category: filters.category,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            condition: filters.condition,
            location: filters.location,
            sort: filters.sort
          }
        });
        setAds(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-400">
            {loading ? 'Searching...' : `Found ${ads.length} results`}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-emerald-500/20 p-4 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-emerald-400" />
                Filters
              </h2>
              <SearchFilters onFilterChange={handleFilterChange} initialFilters={filters} />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
                {error}
              </div>
            ) : ads.length === 0 ? (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-emerald-500/20 p-8 text-center">
                <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                <p className="text-gray-400 mb-4">
                  We couldn't find any ads matching your search criteria.
                </p>
                <Link
                  to="/"
                  className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 
                           text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map((ad) => (
                  <Link
                    key={ad._id}
                    to={`/product/${ad._id}`}
                    className="group bg-gray-800/50 backdrop-blur-xl rounded-xl overflow-hidden border border-emerald-500/20
                             hover:border-emerald-500/40 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={ad.images[0]}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {ad.condition && (
                        <span className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white text-sm rounded-full">
                          {ad.condition}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {ad.title}
                      </h3>
                      <p className="text-emerald-400 font-bold mt-2">₹{ad.price.toLocaleString()}</p>
                      <div className="flex items-center mt-2 text-gray-400 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{ad.location}</span>
                      </div>
                      {ad.category && (
                        <div className="flex items-center mt-2 text-gray-400 text-sm">
                          <Tag className="h-4 w-4 mr-1" />
                          <span>{ad.category}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
