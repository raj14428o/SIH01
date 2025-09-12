import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true,               // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());           // Use cookie parser

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('DB Connection Error:', err));

// Routes
app.use('/api/users', userRoutes);

// Root
app.get('/', (req, res) => {
  res.json({ status: 'active', message: 'API running' });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));