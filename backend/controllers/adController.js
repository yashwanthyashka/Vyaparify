const Ad = require('../models/Ad');

const postAd = async (req, res) => {
  try {
    const { title, price, category, condition, description, location, images } = req.body;
    const userId = req.user.id; // comes from authenticate middleware

    const newAd = new Ad({
      title,
      price,
      category,
      condition,
      description,
      location,
      images,
      user: userId
    });

    await newAd.save();
    res.status(201).json({ message: 'Ad posted successfully', ad: newAd });
  } catch (error) {
    res.status(500).json({ message: 'Failed to post ad', error: error.message });
  }
};

module.exports = { postAd };
