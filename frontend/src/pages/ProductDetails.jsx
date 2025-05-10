import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin,
  Star,
  Calendar,
  Share2,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  X,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  DollarSign,
  Truck
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showCustomTemplateForm, setShowCustomTemplateForm] = useState(false);
  const [customTemplateText, setCustomTemplateText] = useState('');
  const { user } = useAuthStore();
  const { items: wishlistItems, addItem, removeItem } = useWishlistStore();
  const isInWishlist = wishlistItems.some(item => item._id === id);

  // Default quick reply templates
  const defaultTemplates = [
    {
      id: 1,
      text: "Hi, is this item still available?",
      icon: <MessageSquare className="h-4 w-4" />,
      isDefault: true
    },
    {
      id: 2,
      text: "Can you share more details about the condition?",
      icon: <Star className="h-4 w-4" />,
      isDefault: true
    },
    {
      id: 3,
      text: "Would you consider a lower price?",
      icon: <DollarSign className="h-4 w-4" />,
      isDefault: true
    },
    {
      id: 4,
      text: "Is pickup available? When can I collect it?",
      icon: <Clock className="h-4 w-4" />,
      isDefault: true
    },
    {
      id: 5,
      text: "Do you offer delivery options?",
      icon: <Truck className="h-4 w-4" />,
      isDefault: true
    }
  ];

  // Get custom templates from localStorage
  const [customTemplates, setCustomTemplates] = useState(() => {
    const savedTemplates = localStorage.getItem('customQuickReplies');
    if (savedTemplates) {
      try {
        // Parse saved templates and add the icon React element
        return JSON.parse(savedTemplates).map(template => ({
          ...template,
          icon: <MessageSquare className="h-4 w-4" />
        }));
      } catch (error) {
        console.error('Error parsing saved templates:', error);
        return [];
      }
    }
    return [];
  });

  // Combine default and custom templates
  const quickReplyTemplates = [...defaultTemplates, ...customTemplates];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/ads/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [id]);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      removeItem(id);
    } else {
      addItem(product);
    }
  };

  // Handle selecting a quick reply template
  const handleSelectQuickReply = (templateText) => {
    // If there's already text in the message box, append the template
    if (messageText.trim()) {
      setMessageText((prevText) => `${prevText}\n\n${templateText}`);
    } else {
      setMessageText(templateText);
    }
    setShowQuickReplies(false); // Hide the templates after selection
  };

  // Handle adding a custom template
  const handleAddCustomTemplate = (e) => {
    e.preventDefault();

    if (!customTemplateText.trim()) return;

    // Create new template
    const newTemplate = {
      id: Date.now(), // Use timestamp as unique ID
      text: customTemplateText,
      icon: <MessageSquare className="h-4 w-4" />,
      isDefault: false
    };

    // Add to custom templates
    const updatedTemplates = [...customTemplates, newTemplate];
    setCustomTemplates(updatedTemplates);

    // Save to localStorage (without React elements)
    const templatesForStorage = updatedTemplates.map(({ icon, ...rest }) => rest);
    localStorage.setItem('customQuickReplies', JSON.stringify(templatesForStorage));

    // Reset form
    setCustomTemplateText('');
    setShowCustomTemplateForm(false);
  };

  // Handle removing a custom template
  const handleRemoveCustomTemplate = (templateId) => {
    const updatedTemplates = customTemplates.filter(template => template.id !== templateId);
    setCustomTemplates(updatedTemplates);

    // Save to localStorage (without React elements)
    const templatesForStorage = updatedTemplates.map(({ icon, ...rest }) => rest);
    localStorage.setItem('customQuickReplies', JSON.stringify(templatesForStorage));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!user) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }

    if (!messageText.trim()) {
      return; // Don't send empty messages
    }

    try {
      setIsSending(true);

      // Send message to the API
      await axios.post('http://localhost:5000/api/messages', {
        receiverId: sellerId,
        adId: id,
        content: messageText
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Show success message and reset form
      setMessageText('');
      setShowSuccess(true);
      setShowQuickReplies(false); // Hide quick replies after sending

      // Hide success message after 3 seconds and close modal
      setTimeout(() => {
        setShowSuccess(false);
        setShowSellerModal(false);
      }, 3000);

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Add this check for seller
  const sellerName = product.user?.name || 'Anonymous';
  const sellerJoinDate = product.user?.createdAt
    ? new Date(product.user.createdAt).toLocaleDateString()
    : 'Unknown';
  const sellerId = product.user?._id || '';

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-emerald-400">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-emerald-400">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-500 truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-[500px] object-cover rounded-2xl"
              />

              {/* Navigation arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75
                         p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75
                         p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-6 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative rounded-lg overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{product.title}</h1>
              <div className="flex items-center space-x-4 text-gray-400 mb-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1 text-emerald-500" />
                  {product.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1 text-emerald-500" />
                  {new Date(product.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 text-yellow-500" />
                  {product.condition}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-emerald-500">Rs.{product.price.toLocaleString()}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleWishlist}
                    className={`p-3 rounded-full transition-colors ${
                      isInWishlist
                        ? 'bg-rose-500/20 text-rose-500'
                        : 'bg-gray-800 text-gray-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className="h-6 w-6" fill={isInWishlist ? "currentColor" : "none"} />
                  </button>
                  <button className="p-3 rounded-full bg-gray-800 text-gray-400 hover:text-emerald-500 transition-colors">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-800 py-6">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {sellerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-medium">{sellerName}</h3>
                  <p className="text-gray-400 text-sm">Member since {sellerJoinDate}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowSellerModal(true)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium
                         py-4 px-6 rounded-xl flex items-center justify-center space-x-2
                         transition-colors duration-200"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Contact Seller</span>
              </button>
            </div>

            {/* Safety Tips */}
            <div className="bg-gray-800/30 rounded-xl p-4 mt-6">
              <div className="flex items-center space-x-2 text-emerald-500 mb-2">
                <Shield className="h-5 w-5" />
                <h3 className="font-medium">Safety Tips</h3>
              </div>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Meet in a safe public place</li>
                <li>• Don't pay in advance</li>
                <li>• Inspect the item before buying</li>
                <li>• Report suspicious behavior</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Details Modal */}
      {showSellerModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={() => setShowSellerModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Seller Information</h2>

            <div className="space-y-6">
              {/* Seller avatar and name */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {sellerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">{sellerName}</h3>
                  <p className="text-gray-400">Member since {sellerJoinDate}</p>
                </div>
              </div>

              {/* Contact details */}
              <div className="space-y-4 bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-emerald-400" />
                  <span className="text-gray-200">{product.user?.email || 'Email not available'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-emerald-400" />
                  <span className="text-gray-200">+91 9844XXXXXX</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                  <span className="text-gray-200">{product.location}</span>
                </div>
              </div>

              {/* Message form */}
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="message" className="block text-gray-300 text-sm font-medium">
                      Your Message
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowQuickReplies(!showQuickReplies)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>{showQuickReplies ? 'Hide templates' : 'Quick replies'}</span>
                    </button>
                  </div>

                  {/* Quick reply templates */}
                  {showQuickReplies && (
                    <div className="mb-3 space-y-3 bg-gray-700/50 p-3 rounded-lg animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-400">Select a template:</p>
                        <button
                          type="button"
                          onClick={() => setShowCustomTemplateForm(!showCustomTemplateForm)}
                          className="text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          {showCustomTemplateForm ? 'Cancel' : '+ Add custom'}
                        </button>
                      </div>

                      {/* Custom template form */}
                      {showCustomTemplateForm && (
                        <form onSubmit={handleAddCustomTemplate} className="space-y-2 border-b border-gray-600 pb-3">
                          <textarea
                            value={customTemplateText}
                            onChange={(e) => setCustomTemplateText(e.target.value)}
                            placeholder="Type your custom template..."
                            className="w-full bg-gray-700 text-white text-sm rounded-lg py-2 px-3
                                     focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                            rows="2"
                            required
                          />
                          <button
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm
                                     py-1.5 px-3 rounded-lg transition-colors"
                          >
                            Save Template
                          </button>
                        </form>
                      )}

                      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                        {quickReplyTemplates.map((template) => (
                          <div
                            key={template.id}
                            className="flex items-center group"
                          >
                            <button
                              type="button"
                              onClick={() => handleSelectQuickReply(template.text)}
                              className="flex-1 flex items-center space-x-2 text-left text-sm bg-gray-700 hover:bg-gray-600
                                       text-gray-200 p-2 rounded-lg transition-colors group"
                            >
                              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30">
                                {template.icon}
                              </span>
                              <span className="line-clamp-1">{template.text}</span>
                            </button>

                            {/* Delete button for custom templates */}
                            {!template.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCustomTemplate(template.id)}
                                className="ml-1 p-1 text-gray-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove template"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <textarea
                    id="message"
                    rows="3"
                    placeholder="Hi, I'm interested in your product..."
                    className="w-full bg-gray-700 text-white rounded-lg py-2 px-3
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    required
                  />
                </div>

                {/* Success message */}
                {showSuccess && (
                  <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-lg animate-fadeIn">
                    Message sent successfully!
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className={`w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium
                           py-3 px-4 rounded-lg text-center transition-colors duration-200
                           flex items-center justify-center space-x-2
                           ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>

                {!user && (
                  <p className="text-sm text-gray-400 text-center mt-2">
                    You need to <Link to="/login" className="text-emerald-400 hover:underline">login</Link> to send messages
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





