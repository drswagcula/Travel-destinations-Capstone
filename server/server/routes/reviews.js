const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, async (req, res) => {
  
  const { destinationId, rating, content } = req.body;
  const userId = req.user.userId;

  
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

module.exports = router;