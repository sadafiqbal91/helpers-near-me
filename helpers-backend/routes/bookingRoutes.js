import express from 'express';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/authMiddleware.js'; // Security guard lana hai yahan

const router = express.Router();

// GET /api/bookings - Admin fetches all booking requests
router.get('/', protect, async (req, res) => { // Get sabko nai dikhana chahiye, sirf admin dekhega
    try {
        const bookings = await Booking.find().sort({ requested_at: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not fetch bookings' });
    }
});

// POST /api/bookings - User submits a new booking request
router.post('/', async (req, res) => {
    try {
        const { category, client_name, client_phone, client_location, client_message } = req.body;

        const booking = new Booking({
            category,
            client_name,
            client_phone,
            client_location,
            client_message
        });

        const createdBooking = await booking.save();
        res.status(201).json({ success: true, data: createdBooking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
// PUT /api/bookings/:id/status - Update booking status
router.put('/:id/status', protect, async (req, res) => {
    try {
        const bookingId = req.params.id; // Yeh link se 'id' lega
        const newStatus = req.body.status; // Frontend batayega ke naya status kia rakhna hai

        // HINT 1: Database mein update karne ke liye Mongo ka findByIdAndUpdate function use kiye
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId, 
            { status: newStatus }, 
            { new: true }
        );

        // HINT 2: Check karein ke booking mili ya nahi. 
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // HINT 3: Agar mil gayi aur update ho gai, to JSON mein bhej dein
        res.json(updatedBooking);

    } catch (error) {
        // Yeh humara safety net hai
        res.status(500).json({ message: 'Error updating status' });
    }
});

export default router;
