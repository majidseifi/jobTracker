// Validation utilities for application data

const VALID_STATUSES = [
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "accepted",
  "withdrawn",
];
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
  if (data.platform !== undefined && data.platform !== null) {
    if (typeof data.platform !== "string" || data.platform.length > 100) {
      errors.push("Platform must be a string with max 100 characters");
    }
  }

  // Validate link
  if (data.link !== undefined && data.link !== null && data.link !== "") {
    if (!validateUrl(data.link)) {
      errors.push("Link must be a valid URL");
    }
  }

  // Validate date
  if (data.date !== undefined && data.date !== null && data.date !== "") {
    if (!validateDate(data.date)) {
      errors.push("Date must be a valid ISO date string");
    }
  }

  // Validate rating
  if (data.rating !== undefined && data.rating !== null) {
    if (
      typeof data.rating !== "number" ||
      data.rating < 0 ||
      data.rating > 100
    ) {
      errors.push("Rating must be a number between 0 and 100");
    }
  }

  // Validate resumeVersion
  if (data.resumeVersion !== undefined && data.resumeVersion !== null) {
    if (
      typeof data.resumeVersion !== "string" ||
      data.resumeVersion.length > 50
    ) {
      errors.push("Resume version must be a string with max 50 characters");
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
      errors.push("Applied date must be a valid ISO date string");
    }
  }

  // Validate notes
  if (data.notes !== undefined && data.notes !== null) {
    if (typeof data.notes !== "string" || data.notes.length > 5000) {
      errors.push("Notes must be a string with max 5000 characters");
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
  VALID_INTERVIEW_TYPES,
};
