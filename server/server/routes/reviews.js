// backend/routes/reviews.js
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth'); // Assuming you want review deletion to be authenticated
const { authorizeRole } = require('../middleware/auth'); // You might not need this here if authenticateToken sets role

// POST /api/reviews - Create a new review
router.post('/', authenticateToken, async (req, res) => {
    const { destinationId, rating, content } = req.body;
    const userId = req.user.id; // User ID from authenticated token

    if (!destinationId || !rating || !content) {
        return res.status(400).json({ message: 'Destination ID, rating, and content are required.' });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
    }

    try {
        const destinationExists = await prisma.destination.findUnique({
            where: { id: destinationId },
        });

        if (!destinationExists) {
            return res.status(404).json({ message: 'Destination not found.' });
        }

        // Optional: Check if user already reviewed this destination
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: userId,
                destinationId: destinationId,
            },
        });

        if (existingReview) {
            return res.status(409).json({ message: 'You have already submitted a review for this destination. Please edit your existing review.' });
        }

        const review = await prisma.review.create({
            data: {
                destinationId: destinationId,
                userId: userId,
                rating: rating,
                content: content,
            },
        });
        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// GET /api/reviews - Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        // role: true // You might want to include role here
                    },
                },
                destination: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        country: true, // Assuming country is also selected
                    },
                },
            },
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// GET /api/reviews/:id - Get a single review by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const review = await prisma.review.findUnique({
            where: { id: id },
            include: {
                user: {
                    select: { id: true, username: true, email: true },
                },
                destination: {
                    select: { id: true, name: true, city: true, country: true },
                },
            },
        });
        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }
        res.status(200).json(review);
    } catch (error) {
        console.error('Error fetching single review:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// PUT /api/reviews/:id - Update an existing review
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { rating, content } = req.body;
    const userId = req.user.id; // User ID from authenticated token

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
    }
    if (!content) {
        return res.status(400).json({ message: 'Content is required.' });
    }

    try {
        const existingReview = await prisma.review.findUnique({
            where: { id: id },
        });

        if (!existingReview) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // Only allow the owner of the review or an admin to update it
        if (existingReview.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this review.' });
        }

        const updatedReview = await prisma.review.update({
            where: { id: id },
            data: { rating, content },
        });
        res.status(200).json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// DELETE /api/reviews/:id - Delete a review
// This route requires authentication and ensures only the owner or an admin can delete.
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // User ID from authenticated token
    const userRole = req.user.role; // User role from authenticated token

    try {
        const review = await prisma.review.findUnique({
            where: { id: id },
            select: { userId: true }, // Only need the userId to check ownership
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // Check if the authenticated user is the owner of the review or an admin
        if (review.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this review.' }); // THIS WAS THE MISSING PART
        }

        await prisma.review.delete({
            where: { id: id },
        });

        res.status(204).send(); // 204 No Content typically sent for successful DELETE
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Failed to delete review.' });
    }
});

module.exports = router;