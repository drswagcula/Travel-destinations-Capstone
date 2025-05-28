const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; 


const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email, and password.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

   
    res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username: newUser.username, email: newUser.email } });

  } catch (error) {
   
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }
    e
    next(error);
  }
});


router.post('/login', async (req, res, next) => {
  try {
    const { identifier, password } = req.body; 

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please provide username/email and password.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email } });

  } catch (error) {
    next(error);
  }
});

module.exports = router;