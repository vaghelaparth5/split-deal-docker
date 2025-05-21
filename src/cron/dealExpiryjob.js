const cron = require('node-cron');
const Deal = require('../models/Deal');

const expireDealsJob = cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const result = await Deal.updateMany(
      { deadline: { $lt: now }, is_active: true },
      { is_active: false }
    );
    console.log(`[CRON]  Expired ${result.modifiedCount} deals`);
  } catch (error) {
    console.error("[CRON]  Error during deal expiry:", error.message);
  }
});

module.exports = expireDealsJob;
