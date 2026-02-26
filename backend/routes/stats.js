const express = require("express");
const router = express.Router();
const db = require("../utils/db");

// GET /api/stats - Get analytics
router.get("/", async (req, res, next) => {
  try {
    const applications = await db.getAllApplications();

    // Total jobs in database
    const totalJobs = applications.length;

    // Total applied (status = "Applied" or "Already Applied")
    const totalApplied = applications.filter(
      (app) => app.status === "Applied" || app.status === "Already Applied"
    ).length;

    // Remaining to apply (status = "To-Do")
    const remainingToApply = applications.filter(
      (app) => app.status === "To-Do"
    ).length;

    // Total easy apply
    const totalEasyApply = applications.filter(
      (app) => app.easyApply === true
    ).length;

    // Count by status
    const byStatus = applications.reduce((acc, app) => {
      const status = app.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Count by platform
    const byPlatform = applications.reduce((acc, app) => {
      const platform = app.platform || "Unknown";
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});

    // Date range (published dates)
    const publishedDates = applications
      .map((app) => app.date)
      .filter((date) => date);

    const minPublishedDate =
      publishedDates.length > 0
        ? publishedDates.reduce((min, date) => (date < min ? date : min))
        : null;

    const maxPublishedDate =
      publishedDates.length > 0
        ? publishedDates.reduce((max, date) => (date > max ? date : max))
        : null;

    // Jobs by date published (with cumulative)
    const jobsByDatePublished = {};
    applications.forEach((app) => {
      if (app.date) {
        jobsByDatePublished[app.date] =
          (jobsByDatePublished[app.date] || 0) + 1;
      }
    });

    // Sort by date and add cumulative
    const sortedPublishedDates = Object.keys(jobsByDatePublished).sort();
    const jobsByDatePublishedArray = [];
    let cumulativePublished = 0;
    sortedPublishedDates.forEach((date) => {
      const count = jobsByDatePublished[date];
      cumulativePublished += count;
      jobsByDatePublishedArray.push({
        date,
        count,
        cumulative: cumulativePublished,
      });
    });

    // Applications by date applied (for "Applied" or "Already Applied" status)
    const appliedApplications = applications.filter(
      (app) => (app.status === "Applied" || app.status === "Already Applied") && app.appliedDate
    );

    const applicationsByDateApplied = {};
    appliedApplications.forEach((app) => {
      if (app.appliedDate) {
        applicationsByDateApplied[app.appliedDate] =
          (applicationsByDateApplied[app.appliedDate] || 0) + 1;
      }
    });

    // Sort by date and add cumulative
    const sortedAppliedDates = Object.keys(applicationsByDateApplied).sort();
    const applicationsByDateAppliedArray = [];
    let cumulativeApplied = 0;
    sortedAppliedDates.forEach((date) => {
      const count = applicationsByDateApplied[date];
      cumulativeApplied += count;
      applicationsByDateAppliedArray.push({
        date,
        count,
        cumulative: cumulativeApplied,
      });
    });

    // Calculate average applied per day
    let averageAppliedPerDay = 0;
    if (sortedAppliedDates.length > 1) {
      const firstDate = new Date(sortedAppliedDates[0]);
      const lastDate = new Date(
        sortedAppliedDates[sortedAppliedDates.length - 1]
      );
      const daysDiff = Math.ceil(
        (lastDate - firstDate) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff > 0) {
        averageAppliedPerDay = totalApplied / daysDiff;
      }
    }

    // Jobs to apply daily (7-day target)
    const jobsToApplyDaily = remainingToApply > 0 ? remainingToApply / 7 : 0;

    // Calculate response rate (interviewed / total applied * 100)
    const interviewed = byStatus["Interviewed"] || 0;
    const responseRate =
      totalApplied > 0 ? (interviewed / totalApplied) * 100 : 0;

    // Calculate average days to first interview
    const appsWithInterviews = applications.filter(
      (app) => app.interviews && app.interviews.length > 0 && app.appliedDate
    );

    let totalDaysToInterview = 0;
    let countWithInterviews = 0;

    appsWithInterviews.forEach((app) => {
      const appliedDate = new Date(app.appliedDate);
      const firstInterviewDate = new Date(app.interviews[0].date);
      const daysDiff = Math.ceil(
        (firstInterviewDate - appliedDate) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff >= 0) {
        totalDaysToInterview += daysDiff;
        countWithInterviews++;
      }
    });

    const averageDaysToInterview =
      countWithInterviews > 0 ? totalDaysToInterview / countWithInterviews : 0;

    // Build response
    const stats = {
      summary: {
        totalJobs,
        totalApplied,
        remainingToApply,
        totalEasyApply,
        averageAppliedPerDay: parseFloat(averageAppliedPerDay.toFixed(2)),
        jobsToApplyDaily: Math.ceil(jobsToApplyDaily),
        dateRangePublished: {
          min: minPublishedDate,
          max: maxPublishedDate,
        },
      },
      byStatus,
      byPlatform,
      responseRate: parseFloat(responseRate.toFixed(2)),
      averageDaysToInterview: parseFloat(averageDaysToInterview.toFixed(1)),
      jobsByDatePublished: jobsByDatePublishedArray,
      applicationsByDateApplied: applicationsByDateAppliedArray,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error calculating stats:", error.message);
    next(error);
  }
});

module.exports = router;
