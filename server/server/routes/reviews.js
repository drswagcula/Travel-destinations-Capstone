const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRole } = require('../middleware/permissions'); 


router.get('/destination/:destinationId', async (req, res, next) => {
    try {
        const { destinationId } = req.params;
        const reviews = await prisma.review.findMany({
            where: { destinationId },
            include: {
                user: {
                    select: { id: true, username: true, email: true } 
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});


router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const { destinationId, rating, content } = req.body;
        const userId = req.user.id; 

        if (!destinationId || !rating || !content) {
            return res.status(400).send('Destination ID, rating, and content are required.');
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send('Rating must be between 1 and 5.');
        }

        const existingReview = await prisma.review.findUnique({
            where: {
                userId_destinationId: { 
                    userId,
                    destinationId
                }
            }
        });

        if (existingReview) {
            return res.status(409).send('You have already reviewed this destination.');
        }

        const newReview = await prisma.review.create({
            data: {
                userId,
                destinationId,
                rating,
                content
            }
        });
        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});


router.put('/:id', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, content } = req.body;
        const requestingUserId = req.user.id;
        const requestingUserRole = req.user.role;

        const review = await prisma.review.findUnique({ where: { id } });
        if (!review) {
            return res.status(404).send('Review not found.');
        }

        
        if (review.userId !== requestingUserId && requestingUserRole !== 'admin') {
            return res.status(403).send('You are not authorized to update this review.');
        }

        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).send('Rating must be between 1 and 5.');
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: { rating, content }
        });
        res.json(updatedReview);
    } catch (error) {
        next(error);
    }
});


router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const requestingUserId = req.user.id;
        const requestingUserRole = req.user.role;

        const review = await prisma.review.findUnique({ where: { id } });
        if (!review) {
            return res.status(404).send('Review not found.');
        }

        
        if (review.userId !== requestingUserId && requestingUserRole !== 'admin') {
            return res.status(403).send('You are not authorized to delete this review.');
        }

        await prisma.review.delete({
            where: { id }
        });
        res.status(204).send(); 
    } catch (error) {
        next(error);
    }
});

module.exports = router;