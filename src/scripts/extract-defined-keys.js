const fs = require("fs");
const path = require("path");

// Function to recursively extract all keys from a JSON object
function extractKeys(obj, prefix = "") {
  const keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively extract keys from nested objects
      keys.push(...extractKeys(value, fullKey));
    } else {
      // This is a leaf node, so add the full key
      keys.push(fullKey);
    }
  }

  return keys;
}

// Main function
function extractDefinedKeys() {
  // Load both translation files
  const enMessagesPath = path.join(__dirname, "..", "messages", "en.json");
  const arMessagesPath = path.join(__dirname, "..", "messages", "ar.json");

  const enMessages = JSON.parse(fs.readFileSync(enMessagesPath, "utf8"));
  const arMessages = JSON.parse(fs.readFileSync(arMessagesPath, "utf8"));

  // Extract keys from both files
  const enKeys = extractKeys(enMessages);
  const arKeys = extractKeys(arMessages);

  // Find differences between the two files
  const onlyInEn = enKeys.filter((key) => !arKeys.includes(key));
  const onlyInAr = arKeys.filter((key) => !enKeys.includes(key));

  return {
    en: enKeys.sort(),
    ar: arKeys.sort(),
    onlyInEn: onlyInEn.sort(),
    onlyInAr: onlyInAr.sort(),
  };
}

// Run the extraction
const definedKeys = extractDefinedKeys();
console.log("Defined translation keys:");
console.log("English keys:", definedKeys.en.length);
console.log("Arabic keys:", definedKeys.ar.length);
console.log("Keys only in English:", definedKeys.onlyInEn);
console.log("Keys only in Arabic:", definedKeys.onlyInAr);

// Save to files
const outputPathEn = path.join(__dirname, "defined-keys-en.json");
const outputPathAr = path.join(__dirname, "defined-keys-ar.json");
const outputPathDiff = path.join(__dirname, "defined-keys-diff.json");

fs.writeFileSync(outputPathEn, JSON.stringify(definedKeys.en, null, 2));
fs.writeFileSync(outputPathAr, JSON.stringify(definedKeys.ar, null, 2));
fs.writeFileSync(
  outputPathDiff,
  JSON.stringify(
    {
      onlyInEn: definedKeys.onlyInEn,
      onlyInAr: definedKeys.onlyInAr,
    },
    null,
    2,
  ),
);

console.log(`\nKeys saved to:`);
console.log(`- ${outputPathEn}`);
console.log(`- ${outputPathAr}`);
console.log(`- ${outputPathDiff}`);
