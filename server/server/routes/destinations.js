const express = require('express');
const router = express.Router();
const prisma = require('../utils/prismaClient'); 

router.get('/', async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany();
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;