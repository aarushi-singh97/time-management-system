const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
const { findUserById } = require('../models/userModel');

async function authenticateUser(request, response, next) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authentication token is required.' });
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    const user = await findUserById(decodedToken.userId);

    if (!user || !user.is_active) {
      return response.status(401).json({ message: 'User account is not available.' });
    }

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}

module.exports = authenticateUser;
