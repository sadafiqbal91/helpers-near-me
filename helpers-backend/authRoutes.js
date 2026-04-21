import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/auth/login - Token generate karne wala raasta
router.post('/login', (req, res) => {
    // 1. Frontend se aane wala username aur password nikalo
    const { username, password } = req.body;

    // .env file se credentials match karo
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {

        // 3. Agar sahi ho, to ek Virtual ID Card (JWT Token) banao
        const token = jwt.sign(
            { role: 'admin' },
            process.env.JWT_SECRET, // Yeh humari digital signature hai
            { expiresIn: '24h' } // Token 24 ghantay baad expire ho jayega
        );

        // 4. Token khushi khushi frontend ko wapas bhej do
        return res.json({ success: true, token });
    }

    // 5. Agar details ghalat hon, to Error de do
    res.status(401).json({ success: false, message: 'Invalid username or password' });
});

export default router;
