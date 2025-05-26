const connectDB = require('../src/config/db');
const fetchDealsJob = require('../src/cronJobs/fetchDealsJob');
const dealExpiryJob = require('../src/cronJobs/dealExpiryJob');

(async () => {
  try {
    await connectDB(); // Connect to MongoDB

    console.log("Running fetchDealsJob...");
    await fetchDealsJob();

    console.log("Running dealExpiryJob...");
    await dealExpiryJob();

    process.exit(0); // Exit after execution
  } catch (err) {
    console.error("Error running cron jobs manually:", err);
    process.exit(1);
  }
})();
