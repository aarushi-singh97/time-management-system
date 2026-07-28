function getHealthStatus(request, response) {
  response.status(200).json({
    message: 'Time Management System API is running.',
  });
}

module.exports = { getHealthStatus };
