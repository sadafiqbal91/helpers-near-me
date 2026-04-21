import express from 'express';
import Worker from '../models/Worker.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/workers - Fetch all workers or filter by category
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        
        // If category is provided and isn't 'all', filter by it
        if (category && category !== 'all') {
            query.category = category;
        }

        const workers = await Worker.find(query).sort({ createdAt: -1 });
        res.json(workers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not fetch workers' });
    }
});

// POST /api/workers - Admin adds a new worker (Protected Route)
router.post('/', protect, async (req, res) => {
    try {
        const { name, category, experience, rating, status, skills, image } = req.body;
        
        const worker = new Worker({
            name,
            category,
            experience,
            rating,
            status,
            skills,
            image
        });

        const createdWorker = await worker.save();
        res.status(201).json(createdWorker);
    } catch (error) {
        res.status(400).json({ message: 'Error adding worker', error: error.message });
    }
});

// POST /api/workers/seed - Quick endpoint to insert dummy data
router.post('/seed', async (req, res) => {
    try {
        await Worker.deleteMany(); // Clear existing

        const dummyWorkers = [
            { name: "Ali Khan", category: "Domestic Workers", experience: "5 Years", rating: 4.5, skills: ["Cleaning", "Cooking"], image: "https://i.pravatar.cc/150?img=11" },
            { name: "Ahmed Raza", category: "Office Helpers", experience: "3 Years", rating: 4.2, skills: ["Filing", "Tea making"], image: "https://i.pravatar.cc/150?img=12" },
            { name: "Sana Tariq", category: "Healthcare Workers", experience: "8 Years", rating: 4.8, skills: ["Patient Care", "Nursing"], image: "https://i.pravatar.cc/150?img=5" },
            { name: "Ayesha Bibi", category: "Domestic Workers", experience: "10 Years", rating: 4.9, skills: ["Cleaning", "Laundry"], image: "https://i.pravatar.cc/150?img=9" },
            { name: "Usman Ali", category: "Permanent Drivers", experience: "12 Years", rating: 4.7, skills: ["Safe Driving", "Navigation"], image: "https://i.pravatar.cc/150?img=15" },
            { name: "Zara Sheikh", category: "Store Helpers", experience: "2 Years", rating: 4.0, skills: ["Inventory", "Customer Service"], image: "https://i.pravatar.cc/150?img=10" },
            { name: "Bilal Hussain", category: "Factory Workers", experience: "6 Years", rating: 4.3, skills: ["Machine Operator", "Loading"], image: "https://i.pravatar.cc/150?img=3" },
            { name: "Hina Javed", category: "Office Helpers", experience: "4 Years", rating: 4.6, skills: ["Reception", "Data Entry"], image: "https://i.pravatar.cc/150?img=1" }
        ];

        const inserted = await Worker.insertMany(dummyWorkers);
        res.json({ message: 'Database Seeded Successfully', count: inserted.length });
    } catch (error) {
        res.status(500).json({ message: 'Error seeding database', error: error.message });
    }
});

export default router;
