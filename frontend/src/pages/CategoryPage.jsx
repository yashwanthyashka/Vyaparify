import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function CategoryPage() {
  const { categoryName } = useParams(); // Get the category name from URL
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAds = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/ads?category=${categoryName}`);
        setAds(response.data);
      } catch (error) {
        console.error('Error fetching ads for category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAds();
  }, [categoryName]); // Re-run when the category changes

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className=" text-3xl text-green-300 font-bold mb-6 mt-9">{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Ads</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <Link
              key={ad._id} // Assuming each ad has a unique _id
              to={`/product/${ad._id}`}
              className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition"
            >
              <img
                src={ad.images[0]} // Assuming `images` is an array of image URLs
                alt={ad.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-white text-xl font-semibold">{ad.title}</h3>
                <p className="text-blue-400 font-bold mt-2">Rs.{ad.price}</p>
                <span className="text-sm text-gray-400 mt-1 block">
                  Condition: {ad.condition}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
