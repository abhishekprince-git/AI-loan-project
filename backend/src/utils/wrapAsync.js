export function wrapAsync(fn) {
  return function wrappedAsync(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}