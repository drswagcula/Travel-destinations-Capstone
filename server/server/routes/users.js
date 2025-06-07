const router = require('express').Router(); 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs'); 

const { authenticateToken, authorizeAdmin } = require('../middleware/auth');


router.get('/', authenticateToken, authorizeAdmin, async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        next(error); 
    }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const requestingUser = req.user; 

        if (requestingUser.role !== 'admin' && requestingUser.id !== id) {
            return res.status(403).json({ error: 'Forbidden: You can only view your own profile or must be an admin to view others.' });
        }

        const user = await prisma.user.findUnique({
            where: { id: id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        next(error);
    }
});


router.put('/:id', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const requestingUser = req.user;
        let { username, email, password, role } = req.body; 

        if (requestingUser.role !== 'admin' && requestingUser.id !== id) {
            return res.status(403).json({ error: 'Forbidden: You can only update your own profile or must be an admin to update others.' });
        }

        const updateData = {};

        if (username) {
            updateData.username = username;
        }
        if (email) {
            
            updateData.email = email;
        }
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        if (role && requestingUser.role === 'admin') {
            updateData.role = role;
        } else if (role && requestingUser.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Only administrators can change user roles.' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

        res.json(updatedUser);
    } catch (error) {
        if (error.code === 'P2025') { // Record not found
            return res.status(404).json({ message: 'User not found for update.' });
        }
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) { 
             return res.status(409).json({ error: 'This email is already in use by another user.' });
        }
        if (error.code === 'P2002' && error.meta?.target?.includes('username')) { 
             return res.status(409).json({ error: 'This username is already taken.' });
        }
        console.error('Error updating user:', error);
        next(error);
    }
});

router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: id }
        });
        res.status(204).send(); 
    } catch (error) {
        if (error.code === 'P2025') { 
            return res.status(404).json({ message: 'User not found for deletion.' });
        }
        console.error('Error deleting user:', error);
        next(error);
    }
});


router.get('/:userId/reviews', authenticateToken, async (req, res, next) => { 
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
        next(error); 
    }
});


module.exports = router;