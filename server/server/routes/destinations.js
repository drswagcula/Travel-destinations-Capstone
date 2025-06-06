const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { authenticateToken, authorizeAdmin } = require('../middleware/auth'); 


router.get('/', async (req, res) => {
    try {
        const { search } = req.query; 
        let destinations;
        if (search) {
            
            destinations = await prisma.destination.findMany({
                where: {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } }, 
                        { description: { contains: search, mode: 'insensitive' } }, 
                        { city: { contains: search, mode: 'insensitive' } },
                        { country: { contains: search, mode: 'insensitive' } },
                    ],
                },
            });
        } else {
            
            destinations = await prisma.destination.findMany();
        }

        res.json(destinations);
    } catch (error) {
        console.error('Error fetching destinations (all or search):', error);
        res.status(500).json({ error: 'Failed to fetch destinations.' }); 
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
        
        if (error.code === 'P2023') {
            return res.status(400).json({ error: 'Invalid destination ID format (must be a UUID).' });
        }
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.post(
    '/',
    authenticateToken,  
    authorizeAdmin,     
    async (req, res) => { 
        const { name, description, main_image_url, city, country } = req.body; 
        try {
            const newDestination = await prisma.destination.create({
                data: {
                    name,
                    description,
                    main_image_url, 
                    city,
                    country
                }
            });
            res.status(201).json(newDestination);
        } catch (error) {
            console.error('Error creating destination:', error);
            
            if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
                return res.status(409).json({ error: 'A destination with this name already exists.' });
            }
            res.status(500).json({ error: 'Failed to create destination.' });
        }
    }
);


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
        console.error('Error updating destination by ID:', error);
       
        if (error.code === 'P2025') { 
            return res.status(404).json({ message: 'Destination not found for update.' });
        }
       
        if (error.code === 'P2023') {
            return res.status(400).json({ error: 'Invalid destination ID format (must be a UUID).' });
        }
        
        if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
            return res.status(409).json({ error: 'Another destination with this name already exists.' });
        }
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.destination.delete({
            where: { id: id },
        });
        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting destination:', error);
        
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Destination not found.' });
        }
        
        if (error.code === 'P2023') {
            return res.status(400).json({ error: 'Invalid destination ID format (must be a UUID).' });
        }
        res.status(500).json({ error: 'Failed to delete destination.' });
    }
});


module.exports = router;