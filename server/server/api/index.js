const router = require('express').Router();
const express = require('express'); 

const prisma = require('../utils/prismaClient'); 

const { authenticateToken } = require('../middleware/auth'); 

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


const authRoutes = require('../routes/auth');
const destinationsRoutes = require('../routes/destinations'); 
const reviewRoutes = require('../routes/reviews');
const reportRoutes = require('../routes/reports');
const userRoutes = require('../routes/users');

router.use('/destinations', destinationsRoutes);
router.use('/auth', authRoutes);

router.use(authenticateToken); 


router.use(async (req, res, next) => {
    try {
        if (!req.user?.id) {
             console.warn('User ID not found on request after authenticateToken. This middleware might be running on a public route, or authenticateToken passed a request without a user ID.');
             return next();
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
            }
        });

        if (!user) {
            console.warn(`Authenticated user not found in DB for token ID: ${req.user.id}`);
            return res.status(401).json({
                error: 'Invalid user credentials',
                code: 'INVALID_USER'
            });
        }

        req.dbUser = user;
        next();
    } catch (error) {
        console.error('User verification error in API router middleware:', {
            error: error.message,
            userId: req.user?.id,
            path: req.path
        });
        next(error);
    }
});


router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/reports', reportRoutes);

router.use((req, res, next) => {
    res.status(404).json({
        error: 'API Endpoint not found',
        path: req.path,
        method: req.method
    });
});

router.use((error, req, res, next) => {
    const status = error.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    console.error('API Error caught by central handler:', {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        userId: req.user?.id
    });

    res.status(status).json({
        error: isProduction ? 'Internal server error' : error.message,
        ...(!isProduction && { details: error.stack }),
        ...(error.code && { code: error.code })
    });
});

module.exports = router;