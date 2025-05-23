const router = require('express').Router({ mergeParams: true }); 
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRole } = require('../middleware/permissions');



router.get('/', async (req, res, next) => { 
    try {
        const { destinationId } = req.params; arams

        if (!destinationId) { 
            return res.status(400).send('Destination ID is required.');
        }

        const reviews = await prisma.review.findMany({
            where: { destinationId },
            include: {
                user: {
                    select: { id: true, username: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(reviews); 0
    } catch (error) {
        console.error('Error fetching reviews for destination:', error);
        next(error); 
    }
});


router.get('/:reviewId', async (req, res, next) => { 
    try {
        const { destinationId, reviewId } = req.params; 
        const review = await prisma.review.findFirst({ 
            where: {
                id: reviewId,
                destinationId: destinationId
            },
            include: {
                user: {
                    select: { id: true, username: true, email: true }
                }
            }
        });

        if (!review) {
            return res.status(404).send('Review not found for this destination.');
        }
        res.status(200).json(review);
    } catch (error) {
        console.error('Error fetching single review:', error);
        next(error);
    }
});



router.post('/', authenticateToken, async (req, res, next) => { 
    try {
        const { rating, content } = req.body; 
        const { destinationId } = req.params; 
        const userId = req.user.id; 

        if (!userId) { 
            return res.status(401).send('Authentication required.');
        }
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
        console.error('Error creating review:', error);
        next(error);
    }
});

router.get('/me', authenticateToken, async (req, res, next) => { 
    try {
        const userId = req.user.id; 
        if (!userId) { 
            return res.status(401).send('Authentication required.');
        }

        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                destination: {
                    select: { id: true, name: true, main_image_url: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
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

        
        if (rating !== undefined) { 
            if (rating < 1 || rating > 5) {
                return res.status(400).send('Rating must be between 1 and 5.');
            }
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: { rating, content } 
        });
        res.status(200).json(updatedReview); 
    } catch (error) {
        
        if (error.code === 'P2025') {
            return res.status(404).send('Review not found for update.');
        }
        console.error('Error updating review:', error);
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
        if (error.code === 'P2025') {
            return res.status(404).send('Review not found for deletion.');
        }
        console.error('Error deleting review:', error);
        next(error);
    }
});

module.exports = router;