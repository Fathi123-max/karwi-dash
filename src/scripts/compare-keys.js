const fs = require("fs");
const path = require("path");

// Load the extracted keys
const usedKeysPath = path.join(__dirname, "used-keys.json");
const definedKeysEnPath = path.join(__dirname, "defined-keys-en.json");
const definedKeysArPath = path.join(__dirname, "defined-keys-ar.json");

// Check if required files exist
if (!fs.existsSync(usedKeysPath) || !fs.existsSync(definedKeysEnPath) || !fs.existsSync(definedKeysArPath)) {
  console.log("Missing required files. Please run the extraction scripts first:");
  console.log("1. node extract-used-keys.js");
  console.log("2. node extract-defined-keys.js");
  process.exit(1);
}

const usedKeys = JSON.parse(fs.readFileSync(usedKeysPath, "utf8"));
const definedKeysEn = JSON.parse(fs.readFileSync(definedKeysEnPath, "utf8"));
const definedKeysAr = JSON.parse(fs.readFileSync(definedKeysArPath, "utf8"));

// Find missing keys (used in code but not defined in translation files)
const missingInEn = usedKeys.filter((key) => !definedKeysEn.includes(key));
const missingInAr = usedKeys.filter((key) => !definedKeysAr.includes(key));

// Find unused keys (defined in translation files but not used in code)
const unusedInEn = definedKeysEn.filter((key) => !usedKeys.includes(key));
const unusedInAr = definedKeysAr.filter((key) => !usedKeys.includes(key));

// Prepare report
const report = {
  summary: {
    usedKeys: usedKeys.length,
    definedKeysEn: definedKeysEn.length,
    definedKeysAr: definedKeysAr.length,
  },
  missingKeys: {
    english: missingInEn,
    arabic: missingInAr,
  },
  unusedKeys: {
    english: unusedInEn,
    arabic: unusedInAr,
  },
};

// Display report
console.log("Translation Keys Analysis Report");
console.log("================================");
console.log(`Keys used in code: ${report.summary.usedKeys}`);
console.log(`Keys defined in English: ${report.summary.definedKeysEn}`);
console.log(`Keys defined in Arabic: ${report.summary.definedKeysAr}`);
console.log("");

if (missingInEn.length > 0) {
  console.log("Missing keys in English translation:");
  missingInEn.forEach((key) => console.log(`  - ${key}`));
  console.log("");
}

if (missingInAr.length > 0) {
  console.log("Missing keys in Arabic translation:");
  missingInAr.forEach((key) => console.log(`  - ${key}`));
  console.log("");
}

if (unusedInEn.length > 0 || unusedInAr.length > 0) {
  console.log("Potentially unused keys:");
  if (unusedInEn.length > 0) {
    console.log("  English:");
    unusedInEn.forEach((key) => console.log(`    - ${key}`));
  }
  if (unusedInAr.length > 0) {
    console.log("  Arabic:");
    unusedInAr.forEach((key) => console.log(`    - ${key}`));
  }
  console.log("(Note: These keys are defined but may not be detected by the script)");
}

// Save detailed report
const reportPath = path.join(__dirname, "translation-report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\nDetailed report saved to ${reportPath}`);

// Exit with error code if there are missing keys
if (missingInEn.length > 0 || missingInAr.length > 0) {
  console.log("\n❌ Issues found: There are missing translation keys!");
  process.exit(1);
} else {
  console.log("\n✅ All good: No missing translation keys found!");
  process.exit(0);
}
