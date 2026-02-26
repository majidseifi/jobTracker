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
  POSTING_URL: "D",
  EASY_APPLY: "E",
  LINK: "F",
  DATE: "G",
  RATING: "H",
  RESUME_VERSION: "I",
  COMPANY_NAME: "J",
  JOB_DESCRIPTION: "K",
  COVER_LETTER: "L",
  REACH_OUT_MSG: "M",
  SALARY: "N",
  CITY: "O",
  EXPIRED: "P",
  REMOTE: "Q",
  STATUS: "R",
  APPLIED_DATE: "S",
  NOTES: "T",
  INTERVIEWS: "U",
  CREATED_AT: "V",
  UPDATED_AT: "W",
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
    id: String(row[columnToIndex(COLUMNS.ID)] || "") || `row_${rowNumber}`,
    title: row[columnToIndex(COLUMNS.TITLE)] || "",
    platform: row[columnToIndex(COLUMNS.PLATFORM)] || "",
    postingUrl: row[columnToIndex(COLUMNS.POSTING_URL)] || "",
    easyApply:
      row[columnToIndex(COLUMNS.EASY_APPLY)] === "TRUE" ||
      row[columnToIndex(COLUMNS.EASY_APPLY)] === true,
    link: row[columnToIndex(COLUMNS.LINK)] || "",
    date: row[columnToIndex(COLUMNS.DATE)] || "",
    rating: parseInt(row[columnToIndex(COLUMNS.RATING)]) || 0,
    resumeVersion: row[columnToIndex(COLUMNS.RESUME_VERSION)] || "",
    companyName: row[columnToIndex(COLUMNS.COMPANY_NAME)] || "",
    jobDescription: row[columnToIndex(COLUMNS.JOB_DESCRIPTION)] || "",
    coverLetter: row[columnToIndex(COLUMNS.COVER_LETTER)] || "",
    reachOutMessage: row[columnToIndex(COLUMNS.REACH_OUT_MSG)] || "",
    salary: row[columnToIndex(COLUMNS.SALARY)] || "",
    city: row[columnToIndex(COLUMNS.CITY)] || "",
    expired:
      row[columnToIndex(COLUMNS.EXPIRED)] === "TRUE" ||
      row[columnToIndex(COLUMNS.EXPIRED)] === true,
    remote:
      row[columnToIndex(COLUMNS.REMOTE)] === "TRUE" ||
      row[columnToIndex(COLUMNS.REMOTE)] === true,
    status: row[columnToIndex(COLUMNS.STATUS)] || "To-Do",
    appliedDate: row[columnToIndex(COLUMNS.APPLIED_DATE)] || "",
    notes: row[columnToIndex(COLUMNS.NOTES)] || "",
    interviews: interviews,
    createdAt:
      row[columnToIndex(COLUMNS.CREATED_AT)] || new Date().toISOString(),
    updatedAt:
      row[columnToIndex(COLUMNS.UPDATED_AT)] || new Date().toISOString(),
    _rowNumber: rowNumber, // Store row number for updates
  };
}

// Helper: Convert application object to row data array
// Uses native JS types (boolean, number) so Google Sheets stores them properly
// (preserves checkboxes, number formats, date formats with USER_ENTERED)
function applicationToRow(app) {
  const row = new Array(23).fill(""); // Create array with 23 empty cells (A-W)

  row[columnToIndex(COLUMNS.ID)] = app.id ? Number(app.id) : "";
  row[columnToIndex(COLUMNS.TITLE)] = app.title || "";
  row[columnToIndex(COLUMNS.PLATFORM)] = app.platform || "";
  row[columnToIndex(COLUMNS.POSTING_URL)] = app.postingUrl || "";
  row[columnToIndex(COLUMNS.EASY_APPLY)] = !!app.easyApply;
  row[columnToIndex(COLUMNS.LINK)] = app.link || "";
  row[columnToIndex(COLUMNS.DATE)] = app.date || "";
  row[columnToIndex(COLUMNS.RATING)] = Number(app.rating) || 0;
  row[columnToIndex(COLUMNS.RESUME_VERSION)] = app.resumeVersion || "";
  row[columnToIndex(COLUMNS.COMPANY_NAME)] = app.companyName || "";
  row[columnToIndex(COLUMNS.JOB_DESCRIPTION)] = app.jobDescription || "";
  row[columnToIndex(COLUMNS.COVER_LETTER)] = app.coverLetter || "";
  row[columnToIndex(COLUMNS.REACH_OUT_MSG)] = app.reachOutMessage || "";
  row[columnToIndex(COLUMNS.SALARY)] = app.salary || "";
  row[columnToIndex(COLUMNS.CITY)] = app.city || "";
  row[columnToIndex(COLUMNS.EXPIRED)] = !!app.expired;
  row[columnToIndex(COLUMNS.REMOTE)] = !!app.remote;
  row[columnToIndex(COLUMNS.STATUS)] = app.status || "To-Do";
  row[columnToIndex(COLUMNS.APPLIED_DATE)] = app.appliedDate || "";
  row[columnToIndex(COLUMNS.NOTES)] = app.notes || "";
  row[columnToIndex(COLUMNS.INTERVIEWS)] = JSON.stringify(app.interviews || []);
  row[columnToIndex(COLUMNS.CREATED_AT)] =
    app.createdAt || new Date().toISOString();
  row[columnToIndex(COLUMNS.UPDATED_AT)] =
    app.updatedAt || new Date().toISOString();

  return row;
}

// ============================================
// IN-MEMORY CACHE
// ============================================
let _cache = null;       // Array of application objects (with _rowNumber)
let _cacheReady = false;
let _cachePromise = null; // Dedup concurrent warm-ups
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes — auto-refresh from sheet
let _cacheTime = 0;

/**
 * Fetch from Google Sheets and populate cache.
 * Returns the cached array.
 */
async function _fetchAndCache() {
  const sheets = await getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A2:W`,
  });
  const rows = response.data.values || [];
  const applications = rows
    .map((row, index) => rowToApplication(row, index + 2))
    .filter((app) => app !== null && app.id);

  _cache = applications;
  _cacheReady = true;
  _cacheTime = Date.now();
  _cachePromise = null;
  console.log(`Cache loaded: ${applications.length} applications`);
  return _cache;
}

/**
 * Ensure cache is populated. Deduplicates concurrent calls.
 */
async function _ensureCache() {
  if (_cacheReady && Date.now() - _cacheTime < CACHE_TTL) {
    return _cache;
  }
  if (_cachePromise) return _cachePromise;
  _cachePromise = _fetchAndCache();
  return _cachePromise;
}

/**
 * Force-refresh cache from sheet (call after external changes like n8n webhook).
 */
async function refreshCache() {
  _cacheReady = false;
  return _ensureCache();
}

/** Helper: strip _rowNumber for API responses */
function _stripInternal(app) {
  const { _rowNumber, ...rest } = app;
  return rest;
}

// ============================================
// PUBLIC API (all reads come from cache)
// ============================================

async function getAllApplications() {
  const apps = await _ensureCache();
  return apps.map(_stripInternal);
}

async function getApplicationById(id) {
  const apps = await _ensureCache();
  const app = apps.find((a) => a.id === id);
  return app ? _stripInternal(app) : null;
}

async function createApplication(applicationData) {
  try {
    const sheets = await getGoogleSheetsClient();
    const id = Date.now().toString();
    const newApp = {
      ...applicationData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      interviews: applicationData.interviews || [],
    };
    const row = applicationToRow(newApp);

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:W`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [row] },
    });

    // Determine the row number that was written
    const updatedRange = result.data.updates?.updatedRange || "";
    const match = updatedRange.match(/!A(\d+):/);
    const rowNumber = match ? parseInt(match[1]) : null;

    // Update cache in-place
    if (_cacheReady && rowNumber) {
      _cache.push({ ...newApp, _rowNumber: rowNumber });
    } else {
      // Fallback: refresh cache
      _cacheReady = false;
    }

    return newApp;
  } catch (error) {
    console.error("Error creating application:", error.message);
    throw new Error("Failed to create application in Google Sheets");
  }
}

async function updateApplication(id, updates) {
  try {
    const sheets = await getGoogleSheetsClient();
    const apps = await _ensureCache();
    const existingApp = apps.find((app) => app.id === id);
    if (!existingApp) return null;

    const updatedApp = {
      ...existingApp,
      ...updates,
      id: existingApp.id,
      createdAt: existingApp.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const row = applicationToRow(updatedApp);

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${existingApp._rowNumber}:W${existingApp._rowNumber}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [row] },
    });

    // Update cache in-place
    if (_cacheReady) {
      const idx = _cache.findIndex((a) => a.id === id);
      if (idx !== -1) {
        _cache[idx] = { ...updatedApp, _rowNumber: existingApp._rowNumber };
      }
    }

    return _stripInternal(updatedApp);
  } catch (error) {
    console.error("Error updating application:", error.message);
    throw new Error("Failed to update application in Google Sheets");
  }
}

async function deleteApplication(id) {
  try {
    const sheets = await getGoogleSheetsClient();
    const apps = await _ensureCache();
    const app = apps.find((a) => a.id === id);
    if (!app) return false;

    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${app._rowNumber}:W${app._rowNumber}`,
    });

    // Update cache in-place
    if (_cacheReady) {
      _cache = _cache.filter((a) => a.id !== id);
    }

    return true;
  } catch (error) {
    console.error("Error deleting application:", error.message);
    throw new Error("Failed to delete application from Google Sheets");
  }
}

/**
 * Map from application field name to COLUMNS key + serializer
 */
const FIELD_TO_COLUMN = {
  status: { col: COLUMNS.STATUS, serialize: (v) => v || "" },
  notes: { col: COLUMNS.NOTES, serialize: (v) => v || "" },
  interviews: { col: COLUMNS.INTERVIEWS, serialize: (v) => JSON.stringify(v || []) },
  rating: { col: COLUMNS.RATING, serialize: (v) => Number(v) || 0 },
  remote: { col: COLUMNS.REMOTE, serialize: (v) => !!v },
  expired: { col: COLUMNS.EXPIRED, serialize: (v) => !!v },
  easyApply: { col: COLUMNS.EASY_APPLY, serialize: (v) => !!v },
  appliedDate: { col: COLUMNS.APPLIED_DATE, serialize: (v) => v || "" },
  salary: { col: COLUMNS.SALARY, serialize: (v) => v || "" },
  city: { col: COLUMNS.CITY, serialize: (v) => v || "" },
  title: { col: COLUMNS.TITLE, serialize: (v) => v || "" },
  companyName: { col: COLUMNS.COMPANY_NAME, serialize: (v) => v || "" },
  platform: { col: COLUMNS.PLATFORM, serialize: (v) => v || "" },
  link: { col: COLUMNS.LINK, serialize: (v) => v || "" },
  postingUrl: { col: COLUMNS.POSTING_URL, serialize: (v) => v || "" },
  date: { col: COLUMNS.DATE, serialize: (v) => v || "" },
  resumeVersion: { col: COLUMNS.RESUME_VERSION, serialize: (v) => v || "" },
  jobDescription: { col: COLUMNS.JOB_DESCRIPTION, serialize: (v) => v || "" },
  coverLetter: { col: COLUMNS.COVER_LETTER, serialize: (v) => v || "" },
  reachOutMessage: { col: COLUMNS.REACH_OUT_MSG, serialize: (v) => v || "" },
};

/**
 * Update only specific fields (cells) for an application — no full-row rewrite.
 * Also bumps updatedAt. Uses cache for row lookup (no Sheets read).
 */
async function updateFields(id, fields) {
  try {
    const sheets = await getGoogleSheetsClient();
    const apps = await _ensureCache();
    const existingApp = apps.find((app) => app.id === id);
    if (!existingApp) return null;

    const rowNum = existingApp._rowNumber;
    const data = [];

    for (const [key, value] of Object.entries(fields)) {
      const mapping = FIELD_TO_COLUMN[key];
      if (!mapping) continue;
      data.push({
        range: `${SHEET_NAME}!${mapping.col}${rowNum}`,
        values: [[mapping.serialize(value)]],
      });
    }

    const now = new Date().toISOString();
    data.push({
      range: `${SHEET_NAME}!${COLUMNS.UPDATED_AT}${rowNum}`,
      values: [[now]],
    });

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: { valueInputOption: "USER_ENTERED", data },
    });

    // Update cache in-place
    const updatedApp = { ...existingApp, ...fields, updatedAt: now };
    if (_cacheReady) {
      const idx = _cache.findIndex((a) => a.id === id);
      if (idx !== -1) {
        _cache[idx] = updatedApp;
      }
    }

    return _stripInternal(updatedApp);
  } catch (error) {
    console.error("Error updating fields:", error.message);
    throw new Error("Failed to update fields in Google Sheets");
  }
}

// Export all functions
module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  updateFields,
  deleteApplication,
  refreshCache,
};
