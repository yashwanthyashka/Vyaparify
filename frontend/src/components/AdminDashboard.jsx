import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  Users, Package, AlertTriangle, Trash2,
  Search, ArrowUpDown, DollarSign, UserCheck,
  ShoppingBag, Ban, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAds: 0,
    totalValue: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (user?.isAdmin) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, adsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/ads', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUsers(usersRes.data);
      setAds(adsRes.data);

      // Calculate stats
      const totalValue = adsRes.data.reduce((sum, ad) => sum + ad.price, 0);
      const activeUsers = usersRes.data.filter(u => u.isActive).length;

      setStats({
        totalUsers: usersRes.data.length,
        totalAds: adsRes.data.length,
        totalValue,
        activeUsers
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/ads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Failed to delete ad:', err);
    }
  };

  const handleBanUser = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/users/${id}/ban`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Failed to ban user:', err);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAds = ads.filter(ad =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user?.isAdmin) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center text-red-500">
        <AlertTriangle className="h-6 w-6 mr-2" /> Access Denied
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 relative">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-600/5 to-teal-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-teal-600/5 to-emerald-600/5 rounded-full blur-3xl" />
      </div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <button
          onClick={fetchData}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600
                   text-white px-4 py-2 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30
                   transition-all duration-300"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200">
          <div className="flex items-center">
            <Users className="h-10 w-10 text-emerald-500" />
            <div className="ml-4">
              <p className="text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200">
          <div className="flex items-center">
            <ShoppingBag className="h-10 w-10 text-teal-500" />
            <div className="ml-4">
              <p className="text-gray-400">Total Ads</p>
              <p className="text-2xl font-bold text-white">{stats.totalAds}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-emerald-400" />
            <div className="ml-4">
              <p className="text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-white">₹{stats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        {/* <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200">
          <div className="flex items-center">
            <UserCheck className="h-10 w-10 text-teal-400" />
            <div className="ml-4">
              <p className="text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Users className="h-5 w-5 mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
              activeTab === 'ads'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Package className="h-5 w-5 mr-2" />
            Ads
          </button>
        </div>
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-600 focus:border-emerald-500/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg overflow-hidden border border-emerald-500/20">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-gray-900/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      User Info
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-emerald-500/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Users className="h-10 w-10 text-emerald-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{u.name}</div>
                          <div className="text-sm text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleBanUser(u._id)}
                          className="text-teal-500 hover:text-teal-400 transition-colors"
                          title="Ban User"
                        >
                          <Ban className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-rose-500 hover:text-rose-400 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ads Table */}
      {activeTab === 'ads' && (
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg overflow-hidden border border-emerald-500/20">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-gray-900/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Ad Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Posted Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredAds.map((ad) => (
                  <tr key={ad._id} className="hover:bg-emerald-500/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={ad.images[0]}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{ad.title}</div>
                          <div className="text-sm text-gray-400">{ad.user?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">₹{ad.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{ad.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/product/${ad._id}`}
                          className="text-emerald-500 hover:text-emerald-400 transition-colors"
                          title="View Ad"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteAd(ad._id)}
                          className="text-rose-500 hover:text-rose-400 transition-colors"
                          title="Delete Ad"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
