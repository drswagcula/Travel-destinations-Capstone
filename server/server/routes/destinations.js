// server/routes/destinations.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// IMPORT YOUR AUTHENTICATION MIDDLEWARE HERE
const { authenticateToken, authorizeAdmin } = require('../middleware/auth'); // <--- THIS IS CRUCIAL
// Get ALL destinations (for your main destinations page) - Assuming this is public
router.get('/', async (req, res, next) => { // Added 'next' for error handling consistency
  try {
    const destinations = await prisma.destination.findMany({
      include: {
        country: true // Include the related country data
      }
    });
    if (destinations.length === 0) {
      return res.status(404).json({ message: 'No destinations found in the database.' });
    }
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching all destinations:', error);
    // Use `next(error)` to pass to a central error handler if you have one
    // or keep the res.status(500) if you want to handle it locally
    res.status(500).json({
      message: 'An error occurred while fetching all destinations.',
      error: error.message,
      path: req.path,
      method: req.method,
      userId: req.user ? req.user.id : undefined // req.user might be undefined if no auth middleware runs
    });
  }
});
// Search destinations by query (existing route) - Assuming this is public
router.get('/search', async (req, res, next) => { // Added 'next' for error handling consistency
  try {
    const { q } = req.query; // Get the search query from the URL parameter 'q'
    if (!q) {
      return res.status(400).json({ error: 'Search query (q) parameter is required.' });
    }
    // Since you confirmed 'postgresql' and were having issues with `contains`
    // despite it being supported, I'm providing the robust raw SQL (ILIKE) solution.
    // If you manage to make the native `contains` work, you can switch back.
    const searchTerm = `%${q}%`;
    const destinations = await prisma.$queryRaw`
        SELECT
            d.id,
            d.name,
            d.description,
            d.main_image_url,
            d.city,
            d."created_at",
            d."countryId",
            c.name AS country_name,
            c.code AS country_code
        FROM "destinations" AS d
        JOIN "countries" AS c ON d."countryId" = c.id
        WHERE
            d.name ILIKE ${searchTerm} OR
            d.city ILIKE ${searchTerm} OR
            c.name ILIKE ${searchTerm} OR
            c.code ILIKE ${searchTerm} OR
            d.description ILIKE ${searchTerm};
    `;
    if (destinations.length === 0) {
      return res.status(404).json({ message: 'No destinations found matching your query.' });
    }
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching search results (Prisma/DB issue likely):', error);
    res.status(500).json({
      message: 'An error occurred while fetching search results.',
      error: error.message,
      path: req.path,
      method: req.method,
      userId: req.user ? req.user.id : undefined
    });
  }
});
// GET destination by ID (Public - no middleware, but if destination details page
// needs auth, you'd add authenticateToken here)
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: id },
      include: { // Include related data if your detail page needs it
        country: true,
        reviews: {
          include: {
            user: {
              select: { id: true, username: true, email: true }
            }
          }
        }
      }
    });
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found.' });
    }
    res.json(destination);
  } catch (error) {
    console.error('Error fetching destination by ID:', error);
    if (error.code === 'P2023') { // Prisma error code for invalid UUID/ID format
      return res.status(400).json({
        error: 'Invalid ID format provided.',
        details: error.meta.message
      });
    }
    // If you have a central error handler, use next(error)
    res.status(500).json({
        message: 'An error occurred while fetching destination details.',
        error: error.message,
        path: req.path,
        method: req.method,
        userId: req.user ? req.user.id : undefined
    });
  }
});
// PUT update destination (Protected - requires authentication and admin role)
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { name, description, city, countryId, main_image_url } = req.body;
  try {
    if (countryId) {
      const countryExists = await prisma.country.findUnique({
        where: { id: countryId }
      });
      if (!countryExists) {
        return res.status(400).json({ error: 'Provided countryId does not exist.' });
      }
    }
    const updatedDestination = await prisma.destination.update({
      where: { id: id },
      data: {
        name,
        description,
        city,
        country: countryId ? { connect: { id: countryId } } : undefined,
        main_image_url
      },
    });
    res.json(updatedDestination);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Destination not found for update.' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid country ID provided.' });
    }
    console.error('Error updating destination by ID:', error);
    next(error); // Pass to central error handler
  }
});
// POST create destination (Protected - requires authentication and admin role)
router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  async (req, res, next) => {
    try {
        const { name, description, city, countryId, main_image_url } = req.body;
        if (!countryId) {
            return res.status(400).json({ error: 'countryId is required to create a destination.' });
        }
        const countryExists = await prisma.country.findUnique({
            where: { id: countryId }
        });
        if (!countryExists) {
            return res.status(400).json({ error: 'Provided countryId does not exist.' });
        }
        const destination = await prisma.destination.create({
            data: {
                name,
                description,
                city,
                country: { connect: { id: countryId } },
                main_image_url
            }
        });
        res.status(201).json(destination);
    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
            return res.status(409).json({ error: 'A destination with this name already exists.' });
        }
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Invalid country ID provided, it might not exist.' });
        }
        console.error('Error creating destination:', error);
        next(error);
    }
  }
);
// POST add review to destination (Protected - requires authentication)
router.post('/:id/reviews', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, content } = req.body;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Authentication required to post a review.' });
        }
        const userId = req.user.id;
        if (!rating || !content) {
            return res.status(400).json({ error: 'Rating and content are required.' });
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
                content: content,
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
// GET reviews for a destination (Public - no middleware)
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