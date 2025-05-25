// src/cronJobs/cronScheduler.js
const cron = require('node-cron');
const fetchDealsJob = require('./fetchDealsJob');
const dealExpiryJob = require('./dealExpiryJob');

// Run every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('[CRON] Scheduled fetchDealsJob triggered...');
  await fetchDealsJob();
});

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('[CRON] Scheduled dealExpiryJob triggered...');
  await dealExpiryJob();
});
