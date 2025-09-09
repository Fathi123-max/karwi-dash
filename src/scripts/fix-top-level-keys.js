const fs = require("fs");
const path = require("path");

// Function to add top-level keys to JSON file
function addTopLevelKeys() {
  const enFilePath = path.join(__dirname, "..", "messages", "en.json");
  const arFilePath = path.join(__dirname, "..", "messages", "ar.json");

  // Read English file
  let enContent = fs.readFileSync(enFilePath, "utf8");

  // Remove the last closing brace and add our keys
  enContent = enContent.trim();
  if (enContent.endsWith("}")) {
    enContent = enContent.slice(0, -1); // Remove last closing brace
    enContent += ',\n  "branch": "Branch",\n  "services": "Services"\n}';
  }

  // Write back to file
  fs.writeFileSync(enFilePath, enContent);
  console.log("Added top-level keys to English file");

  // Read Arabic file
  let arContent = fs.readFileSync(arFilePath, "utf8");

  // Remove the last closing brace and add our keys
  arContent = arContent.trim();
  if (arContent.endsWith("}")) {
    arContent = arContent.slice(0, -1); // Remove last closing brace
    arContent += ',\n  "branch": "الفرع",\n  "services": "الخدمات"\n}';
  }

  // Write back to file
  fs.writeFileSync(arFilePath, arContent);
  console.log("Added top-level keys to Arabic file");

  console.log("✅ Successfully added top-level keys to translation files!");
}

// Run the function
addTopLevelKeys();
