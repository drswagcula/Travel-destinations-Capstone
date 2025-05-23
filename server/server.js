require('dotenv').config(); 
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json()); 


app.use('/api', require('./server/api')); 


app.get('/', (req, res) => {
    res.send('Welcome to the Destination Review API!');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err 
    });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});