const { google } = require("googleapis");
const path = require("path");

// Your google sheet details
// IMPORTANT: Update this with your own Google Sheets ID before running
// You can also use environment variables: process.env.SPREADSHEET_ID
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "your-google-sheet-id-here";
const SHEET_NAME = "Jobs";

// Path to your service account credentials file
const CREDENTIALS_PATH = path.join(__dirname, "../credentials/google-sheets-credentials.json");

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
    throw new Error("Failed to authenticate Google Sheets client API");
  }
}

module.exports = {
  getGoogleSheetsClient,
  SPREADSHEET_ID,
  SHEET_NAME,
};
