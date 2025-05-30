const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { authenticateToken, authorizeAdmin } = require('../middleware/auth'); 

router.get('/', async (req, res) => {
  const destinations = await prisma.destination.findMany();
  res.json(destinations);
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
    res.status(500).json({ message: 'Internal server error.' });
  }
});


router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params; 
  const { name, description, city, country, image_url } = req.body; 

  try {
    const updatedDestination = await prisma.destination.update({
      where: { id: id },
      data: {
        name,
        description,
        city,
        country,
        image_url 
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
    const destination = await prisma.destination.create({
      data: req.body
    });
    res.status(201).json(destination);
  }
);

module.exports = router;