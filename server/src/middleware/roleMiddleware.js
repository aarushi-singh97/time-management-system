function authorizeRoles(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ message: 'You do not have permission to perform this action.' });
    }

    next();
  };
}

module.exports = authorizeRoles;
