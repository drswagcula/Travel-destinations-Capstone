const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('Authentication: No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Authentication: Token verification failed', err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    console.log('Authentication: Token verified. req.user set to:', req.user); 
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  console.log('Authorization: Entering authorizeAdmin middleware');
  console.log('Authorization: req.user:', req.user); 
  console.log('Authorization: req.user.role:', req.user ? req.user.role : 'User object is null/undefined'); 

  if (!req.user || req.user.role !== 'ADMIN') {
    console.log('Authorization: Access denied - role is not ADMIN or user object missing.');
    return res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }
  console.log('Authorization: Access granted for ADMIN.');
  next();
};

module.exports = { authenticateToken, authorizeAdmin };