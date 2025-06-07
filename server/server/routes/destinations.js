const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { authenticateToken, authorizeAdmin } = require('../middleware/auth'); 

router.get('/', async (req, res) => {
  const destinations = await prisma.destination.findMany();
  res.json(destinations);
});


router.get('/search', async (req, res, next) => {
    try {
        const { q } = req.query; 

        if (!q) {
            
            return res.status(400).json({ error: 'Search query (q) parameter is required.' });
        }

        const destinations = await prisma.destination.findMany({
            where: {
                
                OR: [
                    { name: { contains: q, mode: 'insensitive' } }, 
                    { city: { contains: q, mode: 'insensitive' } }, 
                    { country: { contains: q, mode: 'insensitive' } }, 
                    { description: { contains: q, mode: 'insensitive' } }, 
                ],
            },
        });
        res.status(200).json(destinations);
    } catch (error) {
        console.error('Error fetching search results:', error);
        next(error); 
    }
});


router.get('/:id', async (req, res) => { 
  const { id } = req.params; 
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: id },
    });
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found.' });
    }
    res.json(destination);
  } catch (error) {
    console.error('Error fetching destination by ID:', error);
    // Specific error handling for P2023 (invalid UUID format)
    if (error.code === 'P2023') {
        return res.status(400).json({ 
            error: 'Invalid ID format provided.', 
            details: error.meta.message 
        });
    }
    res.status(500).json({ message: 'Internal server error.' });
  }
});


router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params; 
  const { name, description, city, country, main_image_url } = req.body; 

  try {
    const updatedDestination = await prisma.destination.update({
      where: { id: id },
      data: {
        name,
        description,
        city,
        country,
        main_image_url 
      },
    });
    res.json(updatedDestination); 
  } catch (error) {
    
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Destination not found for update.' });
    }
    console.error('Error updating destination by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post(
  '/',
  authenticateToken,  
  authorizeAdmin,     
  async (req, res) => { 
    try {
        const destination = await prisma.destination.create({
            data: req.body
        });
        res.status(201).json(destination);
    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
            return res.status(409).json({ error: 'A destination with this name already exists.' });
        }
        console.error('Error creating destination:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

router.post('/:id/reviews', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { rating, comment } = req.body; 

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Authentication required to post a review.' });
        }
        const userId = req.user.id; 

        if (!rating || !comment) {
            return res.status(400).json({ error: 'Rating and comment are required.' });
        }

        const parsedRating = parseInt(rating, 10);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
        }

        const destinationExists = await prisma.destination.findUnique({
            where: { id: id }
        });
        if (!destinationExists) {
            return res.status(404).json({ error: 'Destination not found.' });
        }

        const newReview = await prisma.review.create({
            data: {
                rating: parsedRating,
                content: comment,
                destinationId: id, 
                userId: userId,     
            },
            include: { 
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });

        res.status(201).json(newReview); 
    } catch (error) {
        if (error.code === 'P2002') {
            console.warn('Duplicate review attempt detected:', {
                userId: req.user?.id,
                destinationId: req.params.id,
                error: error.message
            });
            return res.status(409).json({
                error: 'You have already submitted a review for this destination.',
                code: 'DUPLICATE_REVIEW'
            });
        }

        console.error('Error adding review to destination:', {
            error: error.message,
            stack: error.stack,
            destinationId: req.params.id,
            userId: req.user?.id
        });
        next(error); 
    }
});

router.get('/:id/reviews', async (req, res, next) => {
    try {
        const { id } = req.params; 

        const destinationExists = await prisma.destination.findUnique({
            where: { id: id }
        });
        if (!destinationExists) {
            return res.status(404).json({ error: 'Destination not found.' });
        }

        const reviews = await prisma.review.findMany({
            where: { destinationId: id },
            include: { 
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc' 
            }
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews for destination:', {
            error: error.message,
            stack: error.stack,
            destinationId: req.params.id
        });
        next(error);
    }
});

module.exports = router;