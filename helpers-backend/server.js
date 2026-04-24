import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import config and routes
import connectDB from './config/db.js';
import workerRoutes from './routes/workerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

import authRoutes from './authRoutes.js';

// Load env variables (if you run this from the root directory or inside backend)
dotenv.config({ path: '../.env' }); 
// fallback if running strictly inside backend directory
if (!process.env.MONGO_URI) {
    dotenv.config();
}

const app = express();

// Middleware
app.use(cors({
    origin: ['https://sadafiqbal91.github.io', 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Allows parsing JSON bodies in requests

// Frontend files serve karna (root folder se)
app.use(express.static('../'));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes); // Auth routes add kardiya
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);

// Base route for testing
app.get('/', (req, res) => {
    res.send('Helpers Near Me API is running...');
});

const PORT = process.env.PORT || 5000;

// Sirf local pc pe chalane ke liye (Vercel automatically handle karta hai)
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

export default app;
