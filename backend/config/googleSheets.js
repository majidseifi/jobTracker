const { google } = require("googleapis");
const path = require("path");

// Your google sheet details
const SPREADSHEET_ID = "your-google-sheet-id-here";
const SHEET_NAME = "Jobs";

// Path to your service account credentials file
const CREDENTIALS_PATH = path.join(
  __dirname,
  "service-account-credentials.json"
);

/**
 * Authenticate and get Google Sheets client
 * This uses a service account (not OAuth2)
 */
async function getGoogleSheetsClient() {
  try {
    // Create auth client from service account key file
    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Get authenticated client
    const authClient = await auth.getClient();

    // Create sheets API instance
    const sheets = google.sheets({ version: "v4", auth: authClient });

    return sheets;
  } catch (error) {
    console.error("Error creating Google Sheets client:", error);
    throw new error("Failed to authenticate Google Sheets client API");
  }
}

module.exports = {
  getGoogleSheetsClient,
  SPREADSHEET_ID,
  SHEET_NAME,
};
