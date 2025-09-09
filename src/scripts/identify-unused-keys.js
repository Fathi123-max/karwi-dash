const fs = require("fs");
const path = require("path");

// Function to load JSON file
function loadJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Function to flatten a nested object into dot notation keys
function flattenObject(obj, prefix = "") {
  const flattened = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}

// Function to get all defined keys from translation files
function getDefinedKeys() {
  const enFilePath = path.join(__dirname, "..", "messages", "en.json");
  const arFilePath = path.join(__dirname, "..", "messages", "ar.json");

  const enTranslations = loadJsonFile(enFilePath);
  const arTranslations = loadJsonFile(arFilePath);

  const enKeys = flattenObject(enTranslations);
  const arKeys = flattenObject(arTranslations);

  return {
    en: Object.keys(enKeys),
    ar: Object.keys(arKeys),
  };
}

// Function to get used keys from our analysis
function getUsedKeys() {
  const usedKeysPath = path.join(__dirname, "used-keys.json");
  return JSON.parse(fs.readFileSync(usedKeysPath, "utf8"));
}

// Function to identify unused keys
function identifyUnusedKeys() {
  const definedKeys = getDefinedKeys();
  const usedKeys = getUsedKeys();

  const unusedEnKeys = definedKeys.en.filter((key) => !usedKeys.includes(key));
  const unusedArKeys = definedKeys.ar.filter((key) => !usedKeys.includes(key));

  return {
    english: unusedEnKeys,
    arabic: unusedArKeys,
  };
}

// Function to remove unused keys from translation files
function removeUnusedKeys() {
  const unusedKeys = identifyUnusedKeys();

  console.log(`Found ${unusedKeys.english.length} unused keys in English translation`);
  console.log(`Found ${unusedKeys.arabic.length} unused keys in Arabic translation`);

  // For now, we'll just report the unused keys
  // In a production environment, you might want to actually remove them
  console.log("\nUnused English keys:");
  unusedKeys.english.forEach((key) => console.log(`  - ${key}`));

  console.log("\nUnused Arabic keys:");
  unusedKeys.arabic.forEach((key) => console.log(`  - ${key}`));

  console.log(
    "\n💡 Note: This script only identifies unused keys. To actually remove them, you would need to implement the removal logic.",
  );
}

// Run the function
removeUnusedKeys();
