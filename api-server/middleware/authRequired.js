export function authRequired(req, res, next) {
  if (!req.session?.userId) return res.status(401).json({ error: 'Authentication failed' });
  next();
}
