const jwt = require("jsonwebtoken");

const getSecret = () => process.env.JWT_SECRET || process.env.ADMIN_PASSWORD;

function authMiddleware(req, res, next) {
  // Skip auth for login, health, and webhook endpoints
  if (
    req.path === "/auth/login" ||
    req.path === "/auth/verify" ||
    req.path === "/health" ||
    req.path === "/applications/webhook"
  ) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    jwt.verify(authHeader.split(" ")[1], getSecret());
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
