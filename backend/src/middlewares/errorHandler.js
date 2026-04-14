export function errorHandler(error, _req, res, _next) {
  const statusCode = Number(error?.statusCode || error?.status || 500);
  const message = error?.message || 'Internal server error';

  res.status(statusCode).json({
    error: message
  });
}