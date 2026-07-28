function errorHandler(error, request, response, next) {
  console.error(error);

  if (error.code === 'ER_DUP_ENTRY') {
    return response.status(409).json({ message: 'An account with this email already exists.' });
  }

  response.status(500).json({ message: 'Something went wrong on the server.' });
}

module.exports = errorHandler;
