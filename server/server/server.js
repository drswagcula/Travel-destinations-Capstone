const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const authRoutes = require('./routes/auth');
const destinationsRoutes = require('./routes/destinations');
const reviewsRoutes = require('./routes/reviews');
const reportsRoutes = require('./routes/reports');


const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/destinations/:destinationId/reviews', reviewsRoutes);
app.use('/api/reviews', reviewsRoutes); 

app.get('/', (req, res) => {
    res.send('Welcome to the Travel Destinations API!');
});


app.use((err, req, res, next) => {
    console.error(err.stack);

  
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    
    res.status(statusCode).json({
        error: err.message || 'An unexpected error occurred. Please try again later.'
    });
});


if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}


module.exports = app;