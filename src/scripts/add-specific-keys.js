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

// Function to add specific missing keys
function addSpecificMissingKeys() {
  const enFilePath = path.join(__dirname, "..", "messages", "en.json");
  const arFilePath = path.join(__dirname, "..", "messages", "ar.json");

  const enTranslations = loadJsonFile(enFilePath);
  const arTranslations = loadJsonFile(arFilePath);

  // Add missing keys to English file
  if (!enTranslations.branch) {
    enTranslations.branch = "Branch";
    console.log("Added branch key to English file");
  }

  if (!enTranslations.services) {
    enTranslations.services = "Services";
    console.log("Added services key to English file");
  }

  // Add missing keys to Arabic file
  if (!arTranslations.services) {
    arTranslations.services = "الخدمات";
    console.log("Added services key to Arabic file");
  }

  // Save updated files
  saveJsonFile(enFilePath, enTranslations);
  saveJsonFile(arFilePath, arTranslations);

  console.log("✅ Successfully added missing keys to translation files!");
}

// Run the function
addSpecificMissingKeys();
