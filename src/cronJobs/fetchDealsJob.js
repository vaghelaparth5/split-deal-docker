const axios = require('axios');
const Deal = require('../models/Deal'); 
const fetchDealsJob = async () => {
  try {
    console.log(`[CRON]  Starting fetchDealsJob...`);

    const res = await axios.get('https://dummyjson.com/products?limit=5');
    const products = res.data.products;

    const newDeals = products.map(p => ({
      title: p.title,
      description: p.description,
      price: p.price,
      original_price: p.price / (1 - p.discountPercentage / 100), // reverse-calculate original
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      is_active: true,
      storeName: p.brand,
      storeLocation: "Online",
      max_participants: p.stock,
      creator: new mongoose.Types.ObjectId(), // dummy ID or your admin user
      participants: [],
      category: p.category,
      image_url: p.thumbnail
    }));

    const result = await Deal.insertMany(newDeals);
    console.log(` Inserted ${result.length} new deals into MongoDB`);
  } catch (err) {
    console.error(`[CRON ] Failed to fetch/write deals:`, err.message);
  }
};

module.exports = fetchDealsJob;

