const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');



router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/:userId/reviews', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;

        
         if (req.user.id !== userId && req.user.role !== 'admin') {
             return res.status(403).json({ message: 'Forbidden: You can only view your own reviews.' });
         }

        const reviews = await prisma.review.findMany({
            where: {
                userId: userId,
            },
            include: {
                destination: { 
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        country: true,
                    },
                },
                user: { 
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc', 
            },
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});



module.exports = router;