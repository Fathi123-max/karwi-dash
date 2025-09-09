const fs = require("fs");
const path = require("path");

// Function to recursively get all .tsx files
function getAllTSXFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllTSXFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      files.push(fullPath);
    }
  }
  return files;
}

// Function to extract translation keys from a file
function extractKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const keys = new Set();

  // Match useTranslations calls to get namespaces
  const namespaceMatches = [...content.matchAll(/useTranslations\s*\(\s*["'](.*?)["']\s*\)/g)];

  // Match t() calls with string literals
  const tMatches = [...content.matchAll(/[^a-zA-Z0-9_]t\s*\(\s*["']([^"']+)["']\s*\)/g)];

  for (const match of tMatches) {
    const key = match[1];

    // Skip invalid keys (special characters, paths, etc.)
    if (key === "*" || key === "," || key.startsWith("./") || key.startsWith("/")) {
      continue;
    }

    // Skip keys that look like partial template literals
    if (key.includes('", {') || key.includes('"}') || key.includes("{") || key.includes("}")) {
      continue;
    }

    if (namespaceMatches.length > 0) {
      // Handle namespaced keys
      for (const namespaceMatch of namespaceMatches) {
        const namespace = namespaceMatch[1];
        if (namespace === "") {
          // Empty namespace
          keys.add(key);
        } else if (!key.includes(".")) {
          // Simple key relative to namespace
          keys.add(`${namespace}.${key}`);
        } else {
          // Full path key
          keys.add(key);
        }
      }
    } else {
      // No namespace, use key as-is
      keys.add(key);
    }
  }

  return Array.from(keys);
}

// Main function
function extractAllKeys() {
  const srcDir = path.join(__dirname, "..");
  const tsxFiles = getAllTSXFiles(srcDir);

  const allKeys = new Set();

  console.log(`Analyzing ${tsxFiles.length} .tsx files...\n`);

  for (const file of tsxFiles) {
    try {
      const keys = extractKeysFromFile(file);
      keys.forEach((key) => allKeys.add(key));
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  return Array.from(allKeys).sort();
}

// Run the extraction
const usedKeys = extractAllKeys();
console.log(`\nTotal unique keys found: ${usedKeys.length}`);

// Also save to a file
const outputPath = path.join(__dirname, "used-keys.json");
fs.writeFileSync(outputPath, JSON.stringify(usedKeys, null, 2));
console.log(`\nKeys saved to ${outputPath}`);
