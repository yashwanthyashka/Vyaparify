import React, { useState, useEffect } from 'react';
import { X, Filter, ChevronDown, Check, DollarSign, MapPin, Tag } from 'lucide-react';

const SearchFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    condition: initialFilters.condition || '',
    location: initialFilters.location || '',
    sort: initialFilters.sort || 'newest',
  });

  // Categories list
  const categories = [
    'Electronics', 'Furniture', 'Fashion', 'Books', 'Sports',
    'Vehicles', 'Home & Garden', 'Collectibles'
  ];

  // Condition options
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
  ];

  // Update parent component when filters change
  useEffect(() => {
    // Debounce filter changes to prevent too many API calls
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: '',
      sort: 'newest',
    });
  };

  // Count active filters (excluding sort)
  const activeFilterCount = Object.entries(filters)
    .filter(([key, value]) => key !== 'sort' && value !== '')
    .length;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700 hover:border-emerald-500/20 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center px-3 py-2 rounded-lg transition-colors ${activeFilterCount > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-white'}`}
        >
          <Filter className="h-5 w-5 mr-2" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <label htmlFor="sort" className="text-gray-400 text-sm mr-2">
              Sort by:
            </label>
            <div className="relative inline-block">
              <select
                id="sort"
                name="sort"
                value={filters.sort}
                onChange={handleChange}
                className="bg-gray-700 text-white rounded pl-3 pr-8 py-1.5 text-sm appearance-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-gray-400 hover:text-emerald-400 text-sm flex items-center transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="flex items-center text-gray-400 text-sm mb-1">
              <Tag className="h-3 w-3 mr-1 text-emerald-500" />
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="flex items-center text-gray-400 text-sm mb-1">
              <DollarSign className="h-3 w-3 mr-1 text-emerald-500" />
              Price Range
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                />
              </div>
              <span className="text-gray-400">-</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label htmlFor="condition" className="flex items-center text-gray-400 text-sm mb-1">
              <Check className="h-3 w-3 mr-1 text-emerald-500" />
              Condition
            </label>
            <div className="relative">
              <select
                id="condition"
                name="condition"
                value={filters.condition}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 appearance-none"
              >
                <option value="">Any Condition</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="flex items-center text-gray-400 text-sm mb-1">
              <MapPin className="h-3 w-3 mr-1 text-emerald-500" />
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter city or area"
              value={filters.location}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
