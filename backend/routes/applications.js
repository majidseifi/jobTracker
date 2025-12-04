const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const {
  validateApplication,
  validateInterview,
  VALID_STATUSES,
} = require("../utils/validation");

// Get /api/applications - Get all applications
router.get("/", async (req, res, next) => {
  const { status, companyName, title } = req.query;
  try {
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: {
          message: `Invalid status filter. Valid statuses are: ${VALID_STATUSES.join(
            ", "
          )}`,
          status: 400,
        },
      });
    }
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

// Get /api/applications/:id - Get single application by ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const application = await db.getApplicationById(id);
    if (!application) {
      return res.status(404).json({
        error: {
          message: `Application with id ${id} not found`,
          status: 404,
        },
      });
    }
    res.json(application);
  } catch (error) {
    console.error(`Error fetching application with id ${id}:`, error.message);
    console.error("Stack trace:", error.stack);
    next(error);
  }
});

// Post /api/applications - Create a new application
router.post("/", async (req, res, next) => {
  const applicationData = req.body;
  try {
    const validation = validateApplication(applicationData);
    if (!validation.isValid) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: validation.errors,
          status: 400,
        },
      });
    }
    const newApplication = await db.createApplication(applicationData);
    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Error creating application:", error.message);
    console.error("Stack trace:", error.stack);
    next(error);
  }
});

// Put /api/applications/:id - Update an existing application
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const applicationData = req.body;
  try {
    const validation = validateApplication(applicationData, true);
    if (!validation.isValid) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: validation.errors,
          status: 400,
        },
      });
    }
    const updatedApplication = await db.updateApplication(id, applicationData);
    if (!updatedApplication) {
      return res.status(404).json({
        error: {
          message: `Application with id ${id} not found`,
          status: 404,
        },
      });
    }
    res.json(updatedApplication);
  } catch (error) {
    console.error(`Error updating application with id ${id}:`, error.message);
    console.error("Stack trace:", error.stack);
    next(error);
  }
});

// Delete /api/applications/:id - Delete an application
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await db.deleteApplication(id);
    if (!deleted) {
      return res.status(404).json({
        error: {
          message: `Application with id ${id} not found`,
          status: 404,
        },
      });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting application with id ${id}:`, error.message);
    console.error("Stack trace:", error.stack);
    next(error);
  }
});

// Patch /api/applications/:id/status - Update application status
router.patch("/:id/status", async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: {
          message: `Invalid status. Valid statuses are: ${VALID_STATUSES.join(
            ", "
          )}`,
          status: 400,
        },
      });
    }
    const updatedApplication = await db.updateApplication(id, { status });
    if (!updatedApplication) {
      return res.status(404).json({
        error: {
          message: `Application with id ${id} not found`,
          status: 404,
        },
      });
    }
    res.json(updatedApplication);
  } catch (error) {
    console.error(
      `Error updating status for application with id ${id}:`,
      error.message
    );
    console.error("Stack trace:", error.stack);
    next(error);
  }
});

// Post /api/applications/:id/interviews - Add an interview to an application
router.post("/:id/interviews", async (req, res, next) => {
  const { id } = req.params;
  const interviewData = req.body;
  try {
    const validation = validateInterview(interviewData);
    if (!validation.isValid) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: validation.errors,
          status: 400,
        },
      });
    }
    const application = await db.getApplicationById(id);
    if (!application) {
      return res.status(404).json({
        error: {
          message: `Application with id ${id} not found`,
          status: 404,
        },
      });
    }
    application.interviews.push(interviewData);
    const updatedApplication = await db.updateApplication(id, application);
    res.status(201).json(updatedApplication);
  } catch (error) {
    console.error(
      `Error adding interview to application with id ${id}:`,
      error.message
    );
    console.error("Stack trace:", error.stack);
    next(error);
  }
});
module.exports = router;
