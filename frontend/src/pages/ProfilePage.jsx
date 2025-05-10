import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  User,
  Mail,
  Calendar,
  Package,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  ShoppingBag,
  Heart,
  Star,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to fetch profile.');
      }
    };

    fetchProfile();
  }, []);

  const handleDeleteAd = async (adId) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/ads/${adId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error deleting ad:', err);
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 max-w-3xl mx-auto">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const { user, ads } = profile;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-teal-600/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-emerald-500/20">
          <div className="h-48 bg-gradient-to-r from-emerald-500 to-teal-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800/50" />

            {/* Relative Banner */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-600/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm font-medium border border-white/20 shadow-lg">
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-300" />
                    Trusted Seller
                  </span>
                </div>
                <div className="bg-teal-600/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm font-medium border border-white/20 shadow-lg">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-white" />
                    Member for {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30))} months
                  </span>
                </div>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm font-medium border border-white/20 shadow-lg">
                <span className="flex items-center">
                  <Package className="h-4 w-4 mr-1 text-emerald-400" />
                  {ads.length} Active Listings
                </span>
              </div>
            </div>
          </div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="absolute -top-8 bg-gray-900/50 backdrop-blur-xl rounded-full p-2 border-4 border-emerald-500 shadow-xl shadow-emerald-500/20">
                  <User className="h-20 w-20 text-emerald-400" />
                </div>
                <div className="ml-32 pt-4">
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-400">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-emerald-400" />
                      {user.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-emerald-400" />
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-emerald-400" />
                      Bengaluru, India
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <Link
                  to="/settings"
                  className="inline-flex items-center px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20
                           text-emerald-400 rounded-lg border border-emerald-500/20 transition-all duration-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/20
                        hover:border-emerald-500/40 transition-all duration-200">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-emerald-400" />
              <div className="ml-4">
                <p className="text-gray-400">Total Ads</p>
                <p className="text-2xl font-bold text-white">{ads.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/20
                        hover:border-emerald-500/40 transition-all duration-200">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-emerald-400" />
              <div className="ml-4">
                <p className="text-gray-400">Favorites</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/20
                        hover:border-emerald-500/40 transition-all duration-200">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-emerald-400" />
              <div className="ml-4">
                <p className="text-gray-400">Rating</p>
                <p className="text-2xl font-bold text-white">4.8</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/20
                        hover:border-emerald-500/40 transition-all duration-200">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-emerald-400" />
              <div className="ml-4">
                <p className="text-gray-400">Reviews</p>
                <p className="text-2xl font-bold text-white">156</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ads Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Package className="h-6 w-6 mr-2 text-emerald-400" />
              Your Ads
            </h2>
            <Link
              to="/post"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600
                       text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-emerald-500/20
                       hover:shadow-emerald-500/40 transition-all duration-200"
            >
              Post New Ad
            </Link>
          </div>

          {ads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <div key={ad._id}
                     className="group bg-gray-800/50 backdrop-blur-xl rounded-xl overflow-hidden
                              border border-emerald-500/20 hover:border-emerald-500/40
                              transition-all duration-200">
                  <div className="relative">
                    <img
                      src={ad.images[0]}
                      alt={ad.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-lg text-sm">
                      Featured
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {ad.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{ad.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold text-lg">₹{ad.price}</span>
                      <div className="flex space-x-2">
                        <Link
                          to={`/product/${ad._id}`}
                          className="p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/edit/${ad._id}`}
                          className="p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteAd(ad._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-12 text-center border border-emerald-500/20">
              <Package className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-6">You haven't posted any ads yet.</p>
              <Link
                to="/post"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500
                         hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium
                         shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-200"
              >
                <Package className="h-5 w-5 mr-2" />
                Post Your First Ad
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


