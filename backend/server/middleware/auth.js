const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided'
      });
    }

    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format'
      });
    }

    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.adminId = decoded.id;
      next();
    } catch (tokenErr) {
      console.error('❌ Token verification failed:', tokenErr.message);
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired'
      });
    }
  } catch (err) {
    console.error('❌ Auth middleware error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};
