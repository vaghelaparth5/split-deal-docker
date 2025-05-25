const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require("./routes/authRoutes");
const dealRoutes = require('./routes/dealRoutes');
const groupRoutes = require('./routes/groupRoutes');
const groupMemberRoutes = require('./routes/groupMemberRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Placeholder for socket (set in index.js)
app.set("io", null);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
    if (path.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
  }
}));

// CSP Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://embed.tawk.to"],
      connectSrc: ["'self'", "https://api.tawk.to"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      frameSrc: ["https://embed.tawk.to"]
    }
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/deal", dealRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/groupMember", groupMemberRoutes);
app.use("/api/user", userRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
