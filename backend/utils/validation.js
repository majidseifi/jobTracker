// Validation utilities for application data

const VALID_PLATFORMS = [
  "Indeed",
  "LinkedIn",
  "ZipRecruiter",
  "Google",
  "Upwork",
  "Freelancer.com",
  "SimplyHired",
  "WellFound",
  "Company",
];

const VALID_STATUSES = [
  "Rejected",
  "To-Do",
  "Applied",
  "Already Applied",
  "Not Relevant",
  "Interviewed",
  "Ghosted",
];

const VALID_RESUME_VERSIONS = ["1", "2", "3", "4"];

const VALID_INTERVIEW_TYPES = [
  "Phone Screen",
  "Technical Screen",
  "Behavioral Interview",
  "System Design",
  "Take-home Assignment",
  "On-site Interview",
  "Final Round",
  "HR Round",
];

function validateEmail(email) {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUrl(url) {
  if (!url) return true; // URL is optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateDate(dateString) {
  if (!dateString) return false;
  // Check for YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  // Verify it's a valid date
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

function validateApplication(data, isUpdate = false) {
  const errors = [];

  // Required fields (only for creation, not updates)
  if (!isUpdate) {
    if (!data.companyName || data.companyName.trim().length === 0) {
      errors.push("Company name is required");
    }
    if (!data.title || data.title.trim().length === 0) {
      errors.push("Title is required");
    }
    if (!data.status) {
      errors.push("Status is required");
    }
    if (!data.appliedDate) {
      errors.push("Applied date is required");
    }
  }

  // Validate title
  if (data.title !== undefined) {
    if (typeof data.title !== "string" || data.title.length > 200) {
      errors.push("Title must be a string with max 200 characters");
    }
  }

  // Validate platform
  if (
    data.platform !== undefined &&
    data.platform !== null &&
    data.platform !== ""
  ) {
    if (!VALID_PLATFORMS.includes(data.platform)) {
      errors.push(`Platform must be one of: ${VALID_PLATFORMS.join(", ")}`);
    }
  }

  // Validate link
  if (data.link !== undefined && data.link !== null && data.link !== "") {
    if (!validateUrl(data.link)) {
      errors.push("Link must be a valid URL");
    }
  }

  // Validate date (job posting date)
  if (data.date !== undefined && data.date !== null && data.date !== "") {
    if (!validateDate(data.date)) {
      errors.push("Date must be in YYYY-MM-DD format (e.g., 2025-12-02)");
    }
  }

  // Validate rating
  if (data.rating !== undefined && data.rating !== null) {
    const ratingNum = Number(data.rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
      errors.push("Rating must be a number between 0 and 10");
    }
  }

  // Validate resumeVersion
  if (
    data.resumeVersion !== undefined &&
    data.resumeVersion !== null &&
    data.resumeVersion !== ""
  ) {
    const versionStr = String(data.resumeVersion);
    if (!VALID_RESUME_VERSIONS.includes(versionStr)) {
      errors.push(
        `Resume version must be one of: ${VALID_RESUME_VERSIONS.join(", ")}`
      );
    }
  }

  // Validate companyName
  if (data.companyName !== undefined) {
    if (typeof data.companyName !== "string" || data.companyName.length > 100) {
      errors.push("Company name must be a string with max 100 characters");
    }
  }

  // Validate jobDescription
  if (data.jobDescription !== undefined && data.jobDescription !== null) {
    if (
      typeof data.jobDescription !== "string" ||
      data.jobDescription.length > 10000
    ) {
      errors.push("Job description must be a string with max 10000 characters");
    }
  }

  // Validate coverLetter
  if (data.coverLetter !== undefined && data.coverLetter !== null) {
    if (
      typeof data.coverLetter !== "string" ||
      data.coverLetter.length > 10000
    ) {
      errors.push("Cover letter must be a string with max 10000 characters");
    }
  }

  // Validate salary
  if (data.salary !== undefined && data.salary !== null) {
    if (typeof data.salary !== "string" || data.salary.length > 100) {
      errors.push("Salary must be a string with max 100 characters");
    }
  }

  // Validate city
  if (data.city !== undefined && data.city !== null) {
    if (typeof data.city !== "string" || data.city.length > 100) {
      errors.push("City must be a string with max 100 characters");
    }
  }

  // Validate expired
  if (data.expired !== undefined && data.expired !== null) {
    if (typeof data.expired !== "boolean") {
      errors.push("Expired must be a boolean");
    }
  }

  // Validate remote
  if (data.remote !== undefined && data.remote !== null) {
    if (typeof data.remote !== "boolean") {
      errors.push("Remote must be a boolean");
    }
  }

  // Validate status
  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
    }
  }

  // Validate appliedDate
  if (data.appliedDate !== undefined) {
    if (!validateDate(data.appliedDate)) {
      errors.push(
        "Applied date must be in YYYY-MM-DD format (e.g., 2025-12-02)"
      );
    }
  }

  // Validate notes
  if (data.notes !== undefined && data.notes !== null) {
    if (typeof data.notes !== "string" || data.notes.length > 5000) {
      errors.push("Notes must be a string with max 5000 characters");
    }
  }

  // Validate easyApply
  if (data.easyApply !== undefined && data.easyApply !== null) {
    if (typeof data.easyApply !== "boolean") {
      errors.push("EasyApply must be a boolean");
    }
  }

  // Validate postingUrl
  if (data.postingUrl !== undefined && data.postingUrl !== null && data.postingUrl !== "") {
    if (!validateUrl(data.postingUrl)) {
      errors.push("Posting URL must be a valid URL");
    }
  }

  // Validate reachOutMessage
  if (data.reachOutMessage !== undefined && data.reachOutMessage !== null) {
    if (typeof data.reachOutMessage !== "string" || data.reachOutMessage.length > 10000) {
      errors.push("Reach out message must be a string with max 10000 characters");
    }
  }

  // Validate interviews array
  if (data.interviews !== undefined) {
    if (!Array.isArray(data.interviews)) {
      errors.push("Interviews must be an array");
    } else {
      data.interviews.forEach((interview, index) => {
        if (!interview.date || !validateDate(interview.date)) {
          errors.push(
            `Interview ${index + 1}: Date is required and must be valid`
          );
        }
        if (interview.type && !VALID_INTERVIEW_TYPES.includes(interview.type)) {
          errors.push(
            `Interview ${
              index + 1
            }: Type must be one of: ${VALID_INTERVIEW_TYPES.join(", ")}`
          );
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateInterview(data) {
  const errors = [];

  if (!data.date || !validateDate(data.date)) {
    errors.push(
      "Interview date is required and must be a valid ISO date string"
    );
  }

  if (data.type && !VALID_INTERVIEW_TYPES.includes(data.type)) {
    errors.push(
      `Interview type must be one of: ${VALID_INTERVIEW_TYPES.join(", ")}`
    );
  }

  if (data.notes !== undefined && typeof data.notes !== "string") {
    errors.push("Interview notes must be a string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateApplication,
  validateInterview,
  VALID_STATUSES,
  VALID_PLATFORMS,
  VALID_RESUME_VERSIONS,
  VALID_INTERVIEW_TYPES,
};
