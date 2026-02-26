const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

// Runtime-configurable spreadsheet ID
// Priority: runtime override > env var > fallback
let _spreadsheetId = process.env.SPREADSHEET_ID || "";
const SHEET_NAME = "Jobs";

function getSpreadsheetId() {
  return _spreadsheetId;
}

function setSpreadsheetId(id) {
  _spreadsheetId = id;
}

// Path to local credentials file (dev mode)
const CREDENTIALS_PATH = path.join(
  __dirname,
  "../credentials/google-sheets-credentials.json"
);

/**
 * Authenticate and get Google Sheets client.
 * Supports two modes:
 *   1. Local dev: reads from credentials/google-sheets-credentials.json
 *   2. Docker/prod: reads from GOOGLE_CREDENTIALS env var (raw JSON string)
 */
async function getGoogleSheetsClient() {
  try {
    let auth;

    if (process.env.GOOGLE_CREDENTIALS) {
      // Production: credentials from env var (JSON string)
      const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    } else {
      // Dev: credentials from file
      auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    }

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });
    return sheets;
  } catch (error) {
    console.error("Error creating Google Sheets client:", error);
    throw new Error("Failed to authenticate Google Sheets client API");
  }
}

module.exports = {
  getGoogleSheetsClient,
  get SPREADSHEET_ID() {
    return getSpreadsheetId();
  },
  SHEET_NAME,
  getSpreadsheetId,
  setSpreadsheetId,
};
