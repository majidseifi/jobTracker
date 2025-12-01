const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const {
  validateApplication,
  validateInterview,
} = require("../utils/validation");

// Get /api/applications - Get all applications
router.get("/", async (req, res, next) => {
  const { status, companyName, title } = req.query;
  try {
    let applications = await db.getAllApplications();
    if (status) {
      applications = applications.filter((app) => app.status === status);
    }
    if (companyName) {
      applications = applications.filter((app) => {
        const name = app.companyName?.toLowerCase() || "";
        const query = companyName?.toLowerCase() || "";
        return name.includes(query);
      });
    }
    if (title) {
      applications = applications.filter((app) => {
        const position = app.title?.toLowerCase() || "";
        const query = title?.toLowerCase() || "";
        return position.includes(query);
      });
    }
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error.message);
    console.error("Stack trace:", error.stack);
    next(error);
  }
});
module.exports = router;
