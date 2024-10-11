const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY; // Use environment variable for the secret key

// Middleware to authenticate user
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Middleware to authorize roles
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];

    if (!userRoles.some(role => allowedRoles.includes(role))) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };