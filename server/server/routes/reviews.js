const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');

// POST /api/reviews - Create a new review
router.post('/', authenticateToken, async (req, res) => {
  const { destinationId, rating, content } = req.body;
  const userId = req.user.id; // From authenticateToken middleware

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
          },
        },
        destination: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
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

// NEW ROUTE: DELETE /api/reviews/:id - Delete a specific review
router.delete('/:id', authenticateToken, async (req, res) => {
    const reviewId = parseInt(req.params.id); // Ensure ID is an integer
    const userId = req.user.id; // User ID from the authenticated token

    // Input validation for reviewId
    if (isNaN(reviewId)) {
        return res.status(400).json({ message: 'Invalid review ID provided.' });
    }

    try {
        // Find the review to verify ownership
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
        });

        // Check if the review exists
        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // Check if the authenticated user is the owner of the review
        if (review.userId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this review.' });
        }

        // If all checks pass, delete the review
        await prisma.review.delete({
            where: { id: reviewId },
        });

        // Send a 204 No Content status for successful deletion
        res.status(204).send();

    } catch (error) {
        console.error('Error deleting review:', error);
        // Generic 500 error, or more specific if you can parse error types
        res.status(500).json({ message: 'Failed to delete review due to an internal server error.' });
    }
});

module.exports = router;