const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.set("io", io);

// Import Routes
const authRoutes = require("./routes/authRoutes");
const dealRoutes = require('./routes/dealRoutes');
const groupRoutes = require('./routes/groupRoutes');
const groupMemberRoutes = require('./routes/groupMemberRoutes');
const userRoutes = require('./routes/userRoutes');

// Enhanced MongoDB connection function
const connectDB = async () => {
  try {
    // Use different connection strings based on environment
    const mongoURI = process.env.DOCKER_ENV === 'local'
      ? 'mongodb://mongodb:27017/project-splitdeal'  // Docker internal network address
      : process.env.MONGODB_URI;                     // Atlas URI from .env

    console.log(`Connecting to MongoDB at: ${mongoURI.replace(/:([^:@]+?)@/, ':*****@')}`);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log('MongoDB connected successfully');

    // Start scheduled cron jobs
    require('./cronJobs/cronScheduler');

    // Manually trigger fetchDealsJob to test it immediately
    const fetchDealsJob = require('./cronJobs/fetchDealsJob');
    console.log('👟 Manually triggering fetchDealsJob to test...');
    await fetchDealsJob();

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Set Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: [
        "'self'",
        "data:",
      ],
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
app.get("/api/student", (req, res) => {
  console.log("/api/student running");
  res.json({
    name: "Parth Vaghela",
    studentId: "225139485"
  });
});

// Serve index.html from public folder
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Socket.IO connection (optional logging)
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start the server with error handling for port conflicts
const PORT = process.env.PORT || 3001; // Changed default to 3001 to avoid common conflicts

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying alternative port...`);
    const altPort = PORT + 1;
    server.listen(altPort, () => {
      console.log(`Server running on alternative port ${altPort}`);
    });
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});