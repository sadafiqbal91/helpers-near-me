import jwt from 'jsonwebtoken';

// Yeh function check karega ke request ke andar valid ticket (token) hai ya nahi
const protect = (req, res, next) => {
    let token;

    // 1. Check karein ke headers mein authorization bearer token maujood hai ya nahi
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // "Bearer <token>" string se sirf token extract karna
            token = req.headers.authorization.split(' ')[1];

            // 2. Token ko apni secret key se verify karao
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Agar sahi hai, toh agle function tak jane do (next())
            req.user = decoded; // Hum decoded data (jaise role: admin) req mein save kar lete hain
            next();
        } catch (error) {
            console.error("Token verification failed:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // Agar token hai hi nahi
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };
