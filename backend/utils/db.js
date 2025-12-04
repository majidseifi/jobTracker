const {
  getGoogleSheetsClient,
  SPREADSHEET_ID,
  SHEET_NAME,
} = require("../config/googleSheets");

/**
 * Column mapping between Google Sheets and our application schema
 * This matches the n8n workflow columns + our additional fields
 */

const COLUMNS = {
  ID: "A",
  TITLE: "B",
  PLATFORM: "C",
  LINK: "D",
  DATE: "E",
  RATING: "F",
  RESUME_VERSION: "G",
  COMPANY_NAME: "H",
  JOB_DESCRIPTION: "I",
  COVER_LETTER: "J",
  SALARY: "K",
  CITY: "L",
  EXPIRED: "M",
  REMOTE: "N",
  STATUS: "O",
  APPLIED_DATE: "P",
  NOTES: "Q",
  INTERVIEWS: "R",
  CREATED_AT: "S",
  UPDATED_AT: "T",
};

// Helper: Convert column letter to index (A=0, B=1, etc.)
function columnToIndex(column) {
  return column.charCodeAt(0) - 65;
}

// Helper: Convert row data array to application object
function rowToApplication(row, rowNumber) {
  if (!row || row.length === 0) return null;

  // Parse interviews JSON if it exists
  let interviews = [];
  try {
    if (row[columnToIndex(COLUMNS.INTERVIEWS)]) {
      interviews = JSON.parse(row[columnToIndex(COLUMNS.INTERVIEWS)]);
    }
  } catch (e) {
    interviews = [];
  }

  return {
    id: row[columnToIndex(COLUMNS.ID)] || `row_${rowNumber}`,
    title: row[columnToIndex(COLUMNS.TITLE)] || "",
    platform: row[columnToIndex(COLUMNS.PLATFORM)] || "",
    date: row[columnToIndex(COLUMNS.DATE)] || "",
    companyName: row[columnToIndex(COLUMNS.COMPANY_NAME)] || "",
    city: row[columnToIndex(COLUMNS.CITY)] || "",
    expired:
      row[columnToIndex(COLUMNS.EXPIRED)] === "TRUE" ||
      row[columnToIndex(COLUMNS.EXPIRED)] === true,
    remote:
      row[columnToIndex(COLUMNS.REMOTE)] === "TRUE" ||
      row[columnToIndex(COLUMNS.REMOTE)] === true,
    link: row[columnToIndex(COLUMNS.LINK)] || "",
    rating: parseInt(row[columnToIndex(COLUMNS.RATING)]) || 0,
    coverLetter: row[columnToIndex(COLUMNS.COVER_LETTER)] || "",
    salary: row[columnToIndex(COLUMNS.SALARY)] || "",
    jobDescription: row[columnToIndex(COLUMNS.JOB_DESCRIPTION)] || "",
    resumeVersion: row[columnToIndex(COLUMNS.RESUME_VERSION)] || "",
    status: row[columnToIndex(COLUMNS.STATUS)] || "applied",
    appliedDate: row[columnToIndex(COLUMNS.APPLIED_DATE)] || "",
    notes: row[columnToIndex(COLUMNS.NOTES)] || "",
    createdAt:
      row[columnToIndex(COLUMNS.CREATED_AT)] || new Date().toISOString(),
    updatedAt:
      row[columnToIndex(COLUMNS.UPDATED_AT)] || new Date().toISOString(),
    interviews: interviews,
    _rowNumber: rowNumber, // Store row number for updates
  };
}

// Helper: Convert application object to row data array
function applicationToRow(app) {
  const row = new Array(20).fill(""); // Create array with 20 empty cells

  row[columnToIndex(COLUMNS.TITLE)] = app.title || "";
  row[columnToIndex(COLUMNS.PLATFORM)] = app.platform || "";
  row[columnToIndex(COLUMNS.DATE)] = app.date || "";
  row[columnToIndex(COLUMNS.COMPANY_NAME)] = app.companyName || "";
  row[columnToIndex(COLUMNS.CITY)] = app.city || "";
  row[columnToIndex(COLUMNS.EXPIRED)] = app.expired ? "TRUE" : "FALSE";
  row[columnToIndex(COLUMNS.REMOTE)] = app.remote ? "TRUE" : "FALSE";
  row[columnToIndex(COLUMNS.LINK)] = app.link || "";
  row[columnToIndex(COLUMNS.RATING)] = app.rating || 0;
  row[columnToIndex(COLUMNS.COVER_LETTER)] = app.coverLetter || "";
  row[columnToIndex(COLUMNS.SALARY)] = app.salary || "";
  row[columnToIndex(COLUMNS.JOB_DESCRIPTION)] = app.jobDescription || "";
  row[columnToIndex(COLUMNS.RESUME_VERSION)] = app.resumeVersion || "";
  row[columnToIndex(COLUMNS.STATUS)] = app.status || "applied";
  row[columnToIndex(COLUMNS.APPLIED_DATE)] = app.appliedDate || "";
  row[columnToIndex(COLUMNS.NOTES)] = app.notes || "";
  row[columnToIndex(COLUMNS.ID)] = app.id || "";
  row[columnToIndex(COLUMNS.CREATED_AT)] =
    app.createdAt || new Date().toISOString();
  row[columnToIndex(COLUMNS.UPDATED_AT)] =
    app.updatedAt || new Date().toISOString();
  row[columnToIndex(COLUMNS.INTERVIEWS)] = JSON.stringify(app.interviews || []);

  return row;
}

/**
 * Get all applications from Google Sheets
 */
async function getAllApplications() {
  try {
    const sheets = await getGoogleSheetsClient();

    // Read all data from sheet (starting from row 2 to skip header)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:T`, // Rows 2 onwards, columns A to T
    });

    const rows = response.data.values || [];

    // Convert each row to application object
    // rowNumber starts at 2 because row 1 is headers
    const applications = rows
      .map((row, index) => rowToApplication(row, index + 2))
      .filter((app) => app !== null && app.id); // Filter out empty rows

    return applications;
  } catch (error) {
    console.error("Error reading from Google Sheets:", error.message);
    throw new Error("Failed to fetch applications from Google Sheets");
  }
}

/**
 * Get single application by ID
 */
async function getApplicationById(id) {
  const applications = await getAllApplications();
  return applications.find((app) => app.id === id);
}

/**
 * Create a new application in Google Sheets
 */
async function createApplication(applicationData) {
  try {
    const sheets = await getGoogleSheetsClient();

    // Generate unique ID
    const id = Date.now().toString();

    // Prepare the application object
    const newApp = {
      ...applicationData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      interviews: applicationData.interviews || [],
    };

    // Convert to row format
    const row = applicationToRow(newApp);

    // Append to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:T`,
      valueInputOption: "RAW",
      resource: {
        values: [row],
      },
    });

    return newApp;
  } catch (error) {
    console.error("Error creating application:", error.message);
    throw new Error("Failed to create application in Google Sheets");
  }
}

/**
 * Update an existing application
 */
async function updateApplication(id, updates) {
  try {
    const sheets = await getGoogleSheetsClient();

    // First, find the application to get its row number
    const applications = await getAllApplications();
    const existingApp = applications.find((app) => app.id === id);

    if (!existingApp) {
      return null; // Application not found
    }

    // Merge updates with existing data
    const updatedApp = {
      ...existingApp,
      ...updates,
      id: existingApp.id, // Preserve ID
      createdAt: existingApp.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    // Convert to row format
    const row = applicationToRow(updatedApp);

    // Update the specific row
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${existingApp._rowNumber}:T${existingApp._rowNumber}`,
      valueInputOption: "RAW",
      resource: {
        values: [row],
      },
    });

    // Remove internal _rowNumber before returning
    delete updatedApp._rowNumber;
    return updatedApp;
  } catch (error) {
    console.error("Error updating application:", error.message);
    throw new Error("Failed to update application in Google Sheets");
  }
}

/**
 * Delete an application from Google Sheets
 */
async function deleteApplication(id) {
  try {
    const sheets = await getGoogleSheetsClient();

    // Find the application to get its row number
    const applications = await getAllApplications();
    const app = applications.find((a) => a.id === id);

    if (!app) {
      return false; // Application not found
    }

    // Delete the row by clearing its contents
    // Note: This doesn't actually remove the row, just clears it
    // To truly delete, you'd need to use batchUpdate with DeleteDimensionRequest
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${app._rowNumber}:T${app._rowNumber}`,
    });

    return true;
  } catch (error) {
    console.error("Error deleting application:", error.message);
    throw new Error("Failed to delete application from Google Sheets");
  }
}

// Export all functions
module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
};
