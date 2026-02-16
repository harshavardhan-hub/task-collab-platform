import jwt from 'jsonwebtoken';

// Verify JWT token and attach user to request
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // FIXED: Changed userId to id for consistency
      req.user = {
        id: decoded.userId,  // ← FIXED: Now using 'id' instead of 'userId'
        email: decoded.email,
      };
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

export default authenticateToken;
