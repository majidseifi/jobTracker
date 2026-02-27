const express = require("express");
const router = express.Router();
const db = require("../utils/db");

// GET /api/stats - Get analytics
router.get("/", async (req, res, next) => {
  try {
    const applications = await db.getAllApplications();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Total jobs (exclude "Already Applied" — those pre-date the tracker)
    const totalJobs = applications.filter(
      (app) => app.status !== "Already Applied"
    ).length;

    // Not relevant count
    const notRelevantCount = applications.filter(
      (app) => app.status === "Not Relevant"
    ).length;

    // Qualified jobs (total - not relevant)
    const qualifiedJobs = totalJobs - notRelevantCount;

    // Statuses that imply the user applied (via this tracker)
    const APPLIED_STATUSES = ["Applied", "Ghosted", "Interviewed", "Rejected"];

    // Total applied
    const totalApplied = applications.filter(
      (app) => APPLIED_STATUSES.includes(app.status)
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

    // Ghosted count: explicitly marked "Ghosted" OR auto-detected
    // (status "Applied", appliedDate > 30 days ago, no interviews)
    const explicitlyGhosted = applications.filter(
      (app) => app.status === "Ghosted"
    ).length;
    const autoGhosted = applications.filter((app) => {
      if (app.status !== "Applied") return false;
      if (!app.appliedDate) return false;
      const appliedDate = new Date(app.appliedDate);
      const daysSinceApplied = Math.floor(
        (now - appliedDate) / (1000 * 60 * 60 * 24)
      );
      const hasInterviews =
        app.interviews && Array.isArray(app.interviews) && app.interviews.length > 0;
      return daysSinceApplied > 30 && !hasInterviews;
    }).length;
    const ghostedCount = explicitlyGhosted + autoGhosted;

    // Ghost rate
    const ghostRate =
      totalApplied > 0 ? (ghostedCount / totalApplied) * 100 : 0;

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

    // Applications by date applied (everyone who applied)
    const appliedApplications = applications.filter(
      (app) => APPLIED_STATUSES.includes(app.status) && app.appliedDate
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

    // Interview rate (interviewed / total applied * 100)
    const interviewed = byStatus["Interviewed"] || 0;
    const interviewRate =
      totalApplied > 0 ? (interviewed / totalApplied) * 100 : 0;

    // Response rate (redefined): any response (interviewed + rejected) / applied
    const rejected = byStatus["Rejected"] || 0;
    const responseRate =
      totalApplied > 0
        ? ((interviewed + rejected) / totalApplied) * 100
        : 0;

    // Active streak: consecutive days with applications counting backward from today
    let activeStreak = 0;
    if (sortedAppliedDates.length > 0) {
      const appliedDateSet = new Set(sortedAppliedDates);
      const checkDate = new Date(now);
      while (true) {
        const dateStr = checkDate.toISOString().split("T")[0];
        if (appliedDateSet.has(dateStr)) {
          activeStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

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

    // Rating vs Outcome: breakdown per rating 0-10
    const ratingOutcome = [];
    for (let r = 0; r <= 10; r++) {
      const appsAtRating = applications.filter(
        (app) => Math.round(Number(app.rating)) === r
      );
      ratingOutcome.push({
        rating: r,
        total: appsAtRating.length,
        applied: appsAtRating.filter(
          (a) => a.status === "Applied" || a.status === "Already Applied"
        ).length,
        interviewed: appsAtRating.filter((a) => a.status === "Interviewed")
          .length,
        rejected: appsAtRating.filter((a) => a.status === "Rejected").length,
        ghosted: appsAtRating.filter(
          (a) => a.status === "Ghosted"
        ).length,
      });
    }

    // Weekly progress: last 5 weeks (Mon-Sun)
    const weeklyProgress = [];
    for (let w = 4; w >= 0; w--) {
      const weekEnd = new Date(now);
      // Go back w weeks, find the Sunday
      weekEnd.setDate(weekEnd.getDate() - w * 7);
      // Find start of that week (Monday)
      const dayOfWeek = weekEnd.getDay(); // 0=Sun, 1=Mon, ...
      const weekStart = new Date(weekEnd);
      weekStart.setDate(
        weekEnd.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
      );
      const weekEndDate = new Date(weekStart);
      weekEndDate.setDate(weekStart.getDate() + 6);

      const startStr = weekStart.toISOString().split("T")[0];
      const endStr = weekEndDate.toISOString().split("T")[0];

      const count = appliedApplications.filter((app) => {
        return app.appliedDate >= startStr && app.appliedDate <= endStr;
      }).length;

      const label = `${weekStart.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })}`;

      weeklyProgress.push({
        label,
        count,
        weekStart: startStr,
        weekEnd: endStr,
      });
    }

    // Build response
    const stats = {
      summary: {
        totalJobs,
        qualifiedJobs,
        totalApplied,
        remainingToApply,
        totalEasyApply,
        averageAppliedPerDay: parseFloat(averageAppliedPerDay.toFixed(2)),
        jobsToApplyDaily: Math.ceil(jobsToApplyDaily),
        ghostedCount,
        ghostRate: parseFloat(ghostRate.toFixed(1)),
        interviewRate: parseFloat(interviewRate.toFixed(1)),
        activeStreak,
        dateRangePublished: {
          min: minPublishedDate,
          max: maxPublishedDate,
        },
      },
      byStatus,
      byPlatform,
      responseRate: parseFloat(responseRate.toFixed(1)),
      averageDaysToInterview: parseFloat(averageDaysToInterview.toFixed(1)),
      ratingOutcome,
      weeklyProgress,
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
