const express = require('express');
const router = express.Router();
const prisma = require('../utils/prismaClient'); 


router.get('/', async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany();
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching all destinations:', error);
    res.status(500).send('Server Error');
  }
});


router.get('/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;

    const destination = await prisma.destination.findUnique({
      where: {
        id: destinationId, 
      },
    });

    if (!destination) {
      
      return res.status(404).json({ error: 'Destination not found.' });
    }

    
    res.status(200).json(destination);
  } catch (error) {
    console.error(`Error fetching destination with ID ${req.params.destinationId}:`, error);
    
    res.status(500).send('Server Error');
  }
});

module.exports = router;