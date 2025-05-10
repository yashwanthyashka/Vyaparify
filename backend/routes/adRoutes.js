const express = require('express');
const { postAd } = require('../controllers/adController');
const authenticate = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin'); // Import isAdmin middleware

const router = express.Router();

// Route to post an ad
router.post('/post', authenticate, postAd);

// Route to get all ads with filtering  
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      condition, 
      location,
      sort = 'newest' 
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Search in title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Filter by condition
    if (condition) {
      filter.condition = condition;
    }
    
    // Filter by location
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    // Determine sort order
    let sortOption = {};
    switch (sort) {
      case 'price_low':
        sortOption = { price: 1 };
        break;
      case 'price_high':
        sortOption = { price: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
    }

    const ads = await require('../models/Ad')
      .find(filter)
      .sort(sortOption)
      .populate('user', 'name email');
      
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ads', error: error.message });
  }
});

// Route to get a single ad by ID
router.get('/:id', async (req, res) => {
  try {
    const ad = await require('../models/Ad').findById(req.params.id).populate('user', 'name email');
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ad', error: error.message });
  }
});

// DELETE route to delete an ad by ID (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const ad = await require('../models/Ad').findByIdAndDelete(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.status(200).json({ message: 'Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ad', error: error.message });
  }
});

// // Backend: Fetch ads by category
// app.get('/api/ads', async (req, res) => {
//   const { category } = req.query; // Get the category from the query string

//   try {
//     const query = category ? { category: category.toLowerCase() } : {};
//     const ads = await Ad.find(query); // Assuming Ad is your MongoDB model
//     res.json(ads);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching ads' });
//   }
// });



module.exports = router;
