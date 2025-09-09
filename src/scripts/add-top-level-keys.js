const fs = require("fs");
const path = require("path");

// Function to load JSON file
function loadJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Function to save JSON file
function saveJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

// Function to add top-level keys
function addTopLevelKeys() {
  const enFilePath = path.join(__dirname, "..", "messages", "en.json");
  const arFilePath = path.join(__dirname, "..", "messages", "ar.json");

  const enTranslations = loadJsonFile(enFilePath);
  const arTranslations = loadJsonFile(arFilePath);

  // Add top-level branch key to English file
  if (!enTranslations.hasOwnProperty("branch")) {
    enTranslations.branch = "Branch";
    console.log("Added top-level branch key to English file");
  }

  // Add top-level services key to English file
  if (!enTranslations.hasOwnProperty("services")) {
    enTranslations.services = "Services";
    console.log("Added top-level services key to English file");
  }

  // Add top-level branch key to Arabic file (if needed)
  // Note: We already have a branch section, but we need a top-level key
  if (!arTranslations.hasOwnProperty("branch")) {
    arTranslations.branch = "الفرع";
    console.log("Added top-level branch key to Arabic file");
  }

  // Add top-level services key to Arabic file
  if (!arTranslations.hasOwnProperty("services")) {
    arTranslations.services = "الخدمات";
    console.log("Added top-level services key to Arabic file");
  }

  // Save updated files
  saveJsonFile(enFilePath, enTranslations);
  saveJsonFile(arFilePath, arTranslations);

  console.log("✅ Successfully added top-level keys to translation files!");
}

// Run the function
addTopLevelKeys();
