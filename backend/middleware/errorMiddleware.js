const notFound = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    message: err.message || "Server error"
  });
};

module.exports = {
  notFound,
  errorHandler
};