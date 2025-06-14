console.log('--- THIS IS THE LIVE SERVER.JS FILE ---');
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const apiRoutes = require('./api');
const app = express();




app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());
app.use('/api', apiRoutes); 


app.get('/', (req, res) => {
    res.send('Welcome to the Travel Destinations API!');
});
app.post('/test-body', (req, res) => {
    console.log('Test body received:', req.body.testValue);
    if (req.body && req.body.testValue) {
        res.status(200).json({ message: 'Body received successfully!', receivedValue: req.body.testValue });
    } else {
        res.status(400).json({ error: 'Body is empty or missing testValue.', receivedBody: req.body });
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode && res.statusCode < 400 ? 500 : res.statusCode;
    res.status(statusCode).json({
        error: err.message || 'An unexpected error occurred.'
    });
});

if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}
module.exports = app;












