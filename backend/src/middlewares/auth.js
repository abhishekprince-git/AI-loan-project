export function auth(req, _res, next) {
  req.auth = { userId: req.header('x-user-id') || null };
  next();
}