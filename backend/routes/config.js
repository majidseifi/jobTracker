const express = require("express");
const router = express.Router();
const { getSpreadsheetId, setSpreadsheetId } = require("../config/googleSheets");
const db = require("../utils/db");

// GET /api/config — get current config
router.get("/", (req, res) => {
  res.json({
    spreadsheetId: getSpreadsheetId(),
  });
});

// PUT /api/config/spreadsheet-id — update spreadsheet ID and bust cache
router.put("/spreadsheet-id", async (req, res, next) => {
  const { spreadsheetId } = req.body;
  try {
    if (!spreadsheetId || typeof spreadsheetId !== "string" || !spreadsheetId.trim()) {
      return res.status(400).json({
        error: { message: "spreadsheetId is required", status: 400 },
      });
    }

    setSpreadsheetId(spreadsheetId.trim());

    // Try to refresh cache with the new sheet — best effort
    let refreshed = false;
    try {
      await db.refreshCache();
      refreshed = true;
    } catch (refreshErr) {
      console.error("Cache refresh failed after spreadsheet ID change:", refreshErr.message);
    }

    res.json({
      spreadsheetId: getSpreadsheetId(),
      message: refreshed
        ? "Spreadsheet ID updated and data refreshed"
        : "Spreadsheet ID saved. Could not fetch data — check that the sheet exists and is shared with the service account.",
      refreshed,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
