const fs = require('fs');
const path = require('path');

// Function to load JSON file
function loadJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Function to save JSON file
function saveJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

// Function to set a nested property in an object
function setNestedProperty(obj, keyPath, value) {
  const keys = keyPath.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
}

// Function to get all missing keys
function getMissingKeys() {
  const reportPath = path.join(__dirname, 'translation-report.json');
  const report = loadJsonFile(reportPath);
  return {
    english: report.missingKeys.english,
    arabic: report.missingKeys.arabic
  };
}

// Function to add missing keys to a translation file
function addMissingKeysToFile(filePath, missingKeys, isArabic = false) {
  const translations = loadJsonFile(filePath);
  
  console.log(`Adding ${missingKeys.length} missing keys to ${path.basename(filePath)}...`);
  
  for (const key of missingKeys) {
    // Skip if key already exists
    if (hasNestedProperty(translations, key)) {
      continue;
    }
    
    // Add the key with a placeholder value
    const placeholder = isArabic ? `[MISSING_AR] ${key}` : `[MISSING] ${key}`;
    setNestedProperty(translations, key, placeholder);
    console.log(`  Added: ${key}`);
  }
  
  saveJsonFile(filePath, translations);
  console.log(`Updated ${filePath}`);
}

// Function to check if a nested property exists in an object
function hasNestedProperty(obj, keyPath) {
  const keys = keyPath.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (!current || !Object.prototype.hasOwnProperty.call(current, key)) {
      return false;
    }
    current = current[key];
  }
  
  return true;
}

// Main function
function addMissingKeys() {
  const missingKeys = getMissingKeys();
  
  const enFilePath = path.join(__dirname, '..', 'messages', 'en.json');
  const arFilePath = path.join(__dirname, '..', 'messages', 'ar.json');
  
  console.log(`Found ${missingKeys.english.length} missing keys in English translation`);
  console.log(`Found ${missingKeys.arabic.length} missing keys in Arabic translation`);
  
  // Add missing keys to English file
  if (missingKeys.english.length > 0) {
    addMissingKeysToFile(enFilePath, missingKeys.english, false);
  }
  
  // Add missing keys to Arabic file
  if (missingKeys.arabic.length > 0) {
    addMissingKeysToFile(arFilePath, missingKeys.arabic, true);
  }
  
  console.log('\n✅ Successfully added missing keys to translation files!');
  console.log('Please review and update the placeholder values with appropriate translations.');
}

// Run the function
addMissingKeys();