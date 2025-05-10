import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart } from 'lucide-react';
import useWishlistStore from '../store/wishlistStore';

export default function Wishlist() {
  const { items, removeItem } = useWishlistStore();

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
          <span className="text-gray-400">({items.length} items)</span>
        </div>

        {items.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <Heart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Your wishlist is empty</p>
            <Link
              to="/"
              className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white 
                       px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} 
                   className="bg-gray-800 rounded-xl overflow-hidden group">
                <Link to={`/product/${item._id}`} className="block relative">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:opacity-75 
                             transition-opacity"
                  />
                </Link>
                <div className="p-4">
                  <Link 
                    to={`/product/${item._id}`}
                    className="text-xl font-bold text-white hover:text-emerald-400 
                             transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="text-emerald-400 font-bold mt-2">
                    Rs.{item.price.toLocaleString()}
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

