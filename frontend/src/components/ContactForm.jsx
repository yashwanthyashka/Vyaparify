import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContactForm = ({ sellerId }) => {
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    if (sellerId) {
      const fetchSeller = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/users/${sellerId}`);
          setSeller(res.data);
        } catch (err) {
          console.error('Error fetching seller details:', err);
        }
      };

      fetchSeller();
    }
  }, [sellerId]);

  if (!seller) {
    return <div className="text-white text-center mt-10">Loading seller details...</div>;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-white mb-6">Seller Information</h2>
      <div className="bg-gray-800 p-6 rounded-lg">
        <p className="text-gray-300 text-lg"><strong>Name:</strong> {seller.name}</p>
        <p className="text-gray-300 text-lg"><strong>Email:</strong> {seller.email}</p>
      </div>
      <form>
        {/* Form implementation */}
      </form>
    </div>
  );
};

export default ContactForm;
