const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Deal = require('../src/models/Deal'); // Adjust if path differs

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    const expiredDeal = new Deal({
  title: "Expired Script Deal",
  description: "Should be deactivated by cron job",
  deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  is_active: true,
  price: 100,
  original_price: 200,
  location: "Script Shop",
  max_participants: 5,
  creator: new mongoose.Types.ObjectId(), //  fixed
  participants: [],
  category: "test",
  image_url: "https://example.com/deal.jpg"
});



    await expiredDeal.save();
    console.log("Inserted expired deal for cron test");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    mongoose.disconnect();
  });
