const fs = require("fs").promises;
const path = require("path");

const DB_DIR = path.join(__dirname, "../db");
const APPLICATIONS_FILE = path.join(DB_DIR, "applications.json");
const SETTINGS_FILE = path.join(DB_DIR, "settings.json");

// Ensure database directory exists
async function ensureDbDir() {
  try {
    await fs.access(DB_DIR);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
  }
}

// Read data from JSON file
async function readDB(filename) {
  try {
    await ensureDbDir();
    const data = await fs.readFile(filename, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // File doesn't exist, return empty array/object
      return filename.includes("applications") ? [] : {};
    }
    throw error;
  }
}

// Write data to JSON file
async function writeDB(filename, data) {
  try {
    await ensureDbDir();
    await fs.writeFile(filename, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to database:", error);
    throw error;
  }
}

// Application-specific database operations
async function getAllApplications() {
  return await readDB(APPLICATIONS_FILE);
}

async function getApplicationById(id) {
  const applications = await getAllApplications();
  return applications.find((app) => app.id === id);
}

async function saveApplications(applications) {
  await writeDB(APPLICATIONS_FILE, applications);
}

async function createApplication(applicationData) {
  const applications = await getAllApplications();
  const newApp = {
    id: Date.now().toString(),
    ...applicationData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    interviews: applicationData.interviews || [],
  };
  applications.push(newApp);
  await saveApplications(applications);
  return newApp;
}

async function updateApplication(id, updates) {
  const applications = await getAllApplications();
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) {
    return null;
  }

  applications[index] = {
    ...applications[index],
    ...updates,
    id: applications[index].id, // Preserve original ID
    createdAt: applications[index].createdAt, // Preserve creation date
    updatedAt: new Date().toISOString(),
  };

  await saveApplications(applications);
  return applications[index];
}

async function deleteApplication(id) {
  const applications = await getAllApplications();
  const filteredApps = applications.filter((app) => app.id !== id);

  if (filteredApps.length === applications.length) {
    return false; // No application was deleted
  }

  await saveApplications(filteredApps);
  return true;
}

// Settings operations
async function getSettings() {
  return await readDB(SETTINGS_FILE);
}

async function updateSettings(settings) {
  await writeDB(SETTINGS_FILE, settings);
}

module.exports = {
  APPLICATIONS_FILE,
  SETTINGS_FILE,
  getAllApplications,
  getApplicationById,
  saveApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getSettings,
  updateSettings,
};
