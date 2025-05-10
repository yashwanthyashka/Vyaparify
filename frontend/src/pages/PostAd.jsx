import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X, Camera, DollarSign, MapPin, Tag, Info } from 'lucide-react';
import axios from 'axios';

export default function PostAd() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'Electronics', 'Books', 'Sports', 'Vehicles', 'Fashion',
    'Home & Garden', 'Toys & Games', 'Phones & Tablets',
    'Computers', 'Musical Instruments'
  ];

  const conditions = ['new', 'like-new', 'good', 'fair', 'poor'];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = [...e.dataTransfer.files].slice(0, 4 - images.length);
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await uploadImage(file);
      }
    }
  }, [images]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      setImages(prev => [...prev, res.data.url]);
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Failed to upload image. Please try again.');
    }
  };

  const handleImageUpload = async (e) => {
    const files = [...e.target.files].slice(0, 4 - images.length);
    for (const file of files) {
      await uploadImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!title || !price || !category || !condition || !description || !location) {
        throw new Error('Please fill in all fields');
      }

      if (images.length === 0) {
        throw new Error('Please upload at least one image');
      }

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('You must be logged in to post an ad');
      }

      const adData = {
        title,
        price: Number(price),
        category,
        condition,
        description,
        location,
        images,
        userId,
      };

      const response = await axios.post('http://localhost:5000/api/ads/post', adData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.message) {
        navigate('/profile');
      }
    } catch (error) {
      setError(error.message || 'Error posting the ad');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-8 ">
          <h1 className="text-3xl font-bold text-white mb-2">Post Your Ad</h1>
          <p className="text-gray-400 mb-8">Fill in the details to list your item for sale</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
              <p className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Product Images <span className="text-gray-500">(Up to 4 images)</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-4 transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                 transition-opacity rounded-lg flex items-center justify-center"
                      >
                        <X className="h-8 w-8 text-white" />
                      </button>
                    </div>
                  ))}
                  {images.length < 4 && (
                    <label className="border-2 border-gray-600 rounded-lg aspect-square 
                                    flex flex-col items-center justify-center cursor-pointer 
                                    hover:border-blue-500 hover:bg-blue-500/10 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        multiple
                        className="hidden"
                      />
                      <Camera className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-400">Add Photos</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What are you selling?"
                    className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-700 border-gray-600 
                             text-white placeholder-gray-400 focus:border-blue-500 
                             focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                  Price (Rs.)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-700 border-gray-600 
                             text-white placeholder-gray-400 focus:border-blue-500 
                             focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 border-gray-600 text-white 
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2 pl-2"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="condition" className="block text-sm font-medium text-gray-300">
                  Condition
                </label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 border-gray-600 text-white 
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-2 pl-2"
                  required
                >
                  <option value="">Select condition</option>
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond.charAt(0).toUpperCase() + cond.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item in detail..."
                className="w-full rounded-lg bg-gray-700 border-gray-600 text-white 
                         placeholder-gray-400 focus:border-blue-500 focus:ring-1 
                         focus:ring-blue-500 pl-3 pt-2"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where is your item located?"
                  className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-700 border-gray-600 
                           text-white placeholder-gray-400 focus:border-blue-500 
                           focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 
                         rounded-lg flex items-center space-x-2 transition-colors
                         ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <Upload className="h-5 w-5" />
                <span>{isSubmitting ? 'Posting...' : 'Post Ad'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
