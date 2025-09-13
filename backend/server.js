import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5175";

// --- Middleware ---

// CORS Configuration
const corsOptions = {
  origin: FRONTEND_URL, // Whitelist your frontend's origin
  methods: "GET,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Allow cookies and authorization headers
};
app.use(cors({
  origin: corsOptions.origin,
  methods: corsOptions.methods,
  credentials: corsOptions.credentials,

}));

// Body and cookie parsers
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(cookieParser()); // To parse cookies

// --- MongoDB Connection ---
if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => console.error('❌ Initial DB Connection Error:', err));

// Monitor DB connection events
mongoose.connection.on('error', err => {
  console.error(`❌ MongoDB connection error after initial connect: ${err}`);
});
mongoose.connection.on('disconnected', () => {
  console.log('ℹ️ MongoDB disconnected.');
});

// --- Routes ---
app.use('/api/users', userRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'active', message: 'API is healthy and running' });
});

// --- Error Handling Middleware (should be last) ---
app.use((err, req, res, next) => {
  console.error('💥 An unhandled error occurred:', err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message: message,
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});