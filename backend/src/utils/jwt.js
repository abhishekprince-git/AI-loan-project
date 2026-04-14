export function signJwtPlaceholder(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function verifyJwtPlaceholder(token) {
  try {
    return JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
  } catch (_error) {
    return null;
  }
}