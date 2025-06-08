const router = require('express').Router();
const express = require('express');
const prisma = require('../utils/prismaClient'); // Assuming this provides a shared PrismaClient instance
const { authenticateToken } = require('../middleware/auth');

// Apply express.json and urlencoded globally or at the top of your main router
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// --- Public Routes (No Authentication Required) ---
const authRoutes = require('../routes/auth');
const destinationsRoutes = require('../routes/destinations');
const reviewRoutes = require('../routes/reviews'); // <-- NEW: Moved here!

router.use('/auth', authRoutes);
router.use('/destinations', destinationsRoutes);
router.use('/reviews', reviewRoutes); // <-- NEW: Now mounted before authenticateToken

// --- Middleware for Authenticated Routes ---
// Any route defined *after* this will first pass through `authenticateToken`
router.use(authenticateToken);

// Middleware to fetch full user details from DB AFTER token authentication
router.use(async (req, res, next) => {
    try {
        // If authenticateToken didn't set req.user (e.g., no token, or invalid token),
        // or if this middleware is run on a route that *should* be public but
        // `authenticateToken` is broadly applied, just pass it along.
        // The `authenticateToken` middleware should handle explicit 401s for protected routes.
        if (!req.user || !req.user.id) {
            // This console.warn is fine for debugging, but for production,
            // authenticateToken itself should explicitly send a 401 if a token
            // is expected and missing/invalid. Here, we'll enforce it too.
            console.warn('User ID not found on request after authenticateToken. This implies no token was provided for a protected route, or the token was invalid.');
            return res.status(401).json({ message: 'Authentication required. No valid user found for this protected route.' });
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
            // If a token was valid but the user doesn't exist in DB, treat as invalid credentials
            return res.status(401).json({
                error: 'Invalid user credentials',
                code: 'INVALID_USER_DB'
            });
        }
        req.dbUser = user; // Attach the full user object to the request
        next();
    } catch (error) {
        console.error('User verification error in API router middleware:', {
            error: error.message,
            userId: req.user?.id, // May be undefined
            path: req.path
        });
        // Pass the error to the central error handler
        next(error);
    }
});

// --- Protected Routes (These will use req.user and req.dbUser) ---
// Now, only routes for 'users' (like profile updates) and 'reports' will be protected
// by the global authenticateToken middleware in this api.js file.
// If you want to protect specific review actions (like POSTing a new review),
// you would add `authenticateToken` directly to that route in `server/routes/reviews.js`.
const reportRoutes = require('../routes/reports');
const userRoutes = require('../routes/users'); // Assuming some user routes are protected

router.use('/users', userRoutes);
router.use('/reports', reportRoutes);

// --- 404 Not Found Handler ---
// This middleware will only be reached if no other route has handled the request
router.use((req, res, next) => {
    res.status(404).json({
        error: 'API Endpoint not found',
        path: req.path,
        method: req.method
    });
});

// --- Central Error Handler ---
// This is the final error-handling middleware
router.use((error, req, res, next) => {
    const status = error.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';
    console.error('API Error caught by central handler:', {
        message: error.message,
        // Only include stack trace in development for security
        stack: isProduction ? undefined : error.stack,
        path: req.path,
        method: req.method,
        userId: req.user?.id // req.user might be undefined if `authenticateToken` didn't run or found no token
    });
    res.status(status).json({
        error: isProduction ? 'Internal server error' : error.message,
        ...(!isProduction && { details: error.stack }), // Attach full stack in dev
        ...(error.code && { code: error.code }) // Include Prisma error codes or custom codes
    });
});

module.exports = router;