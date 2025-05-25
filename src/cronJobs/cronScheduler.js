// src/cronJobs/cronScheduler.js
const cron = require('node-cron');
const dealExpiryJob = require('./dealExpiryJob');
const fetchDealsJob = require('./fetchDealsJob');

// 🕛 Runs every minute (for testing) – disable later
cron.schedule('* * * * *', async () => {
  console.log(`[CRON TEST] Running dealExpiryJob...`);
  await dealExpiryJob();
});

// ⏰ Runs every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log(`[CRON] Running scheduled fetchDealsJob...`);
  await fetchDealsJob();
});
