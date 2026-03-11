function errorHandler(err, req, res, _next) {
  console.error('💥 Unhandled error:', err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
