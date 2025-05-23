const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient'); 
const { authenticateToken } = require('../middleware/auth');


router.post('/register', async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).send('User with this email already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                username: username || email.split('@')[0], 
                role: 'user' 
            },
            select: { id: true, email: true, username: true, role: true, createdAt: true }
        });

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});


router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).send('Invalid credentials.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials.');
        }

        
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.json({ token, user: { id: user.id, email: user.email, username: user.username, role: user.role } });
    } catch (error) {
        next(error);
    }
});


router.get('/profile', authenticateToken, async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, username: true, role: true, createdAt: true }
        });

        if (!user) {
            return res.status(404).send('User not found.');
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
});

module.exports = router;