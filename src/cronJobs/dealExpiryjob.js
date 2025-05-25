const Deal = require('../models/Deal');

const dealExpiryJob = async () => {
  console.log(`[DEBUG] dealExpiryJob started...`);

  try {
    const now = new Date();
    const result = await Deal.updateMany(
      { deadline: { $lt: now }, is_active: true },
      { is_active: false }
    );
    console.log(`[CRON] Expired ${result.modifiedCount} deal(s) at ${now.toLocaleString()}`);
  } catch (error) {
    console.error("[CRON] Error during deal expiry:", error.message);
  }
};

module.exports = dealExpiryJob;
