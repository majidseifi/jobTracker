const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const getSecret = () => process.env.JWT_SECRET || process.env.ADMIN_PASSWORD;

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: "Server auth not configured" });
  }

  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ role: "admin" }, getSecret(), { expiresIn: "24h" });
  res.json({ token });
});

// GET /api/auth/verify
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false });
  }

  try {
    jwt.verify(authHeader.split(" ")[1], getSecret());
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
