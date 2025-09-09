const fs = require("fs");
const path = require("path");

// Function to fix JSON files by adding top-level keys
function fixJsonFiles() {
  const enFilePath = path.join(__dirname, "..", "messages", "en.json");
  const arFilePath = path.join(__dirname, "..", "messages", "ar.json");

  // Read and parse English file
  const enContent = fs.readFileSync(enFilePath, "utf8");
  const enJson = JSON.parse(enContent);

  // Add top-level keys if they don't exist
  if (!enJson.hasOwnProperty("branch")) {
    enJson.branch = "Branch";
  }

  if (!enJson.hasOwnProperty("services")) {
    enJson.services = "Services";
  }

  // Write back to file
  fs.writeFileSync(enFilePath, JSON.stringify(enJson, null, 2) + "\n");
  console.log("Fixed English JSON file");

  // Read and parse Arabic file
  const arContent = fs.readFileSync(arFilePath, "utf8");
  const arJson = JSON.parse(arContent);

  // Add top-level keys if they don't exist
  if (!arJson.hasOwnProperty("branch")) {
    arJson.branch = "الفرع";
  }

  if (!arJson.hasOwnProperty("services")) {
    arJson.services = "الخدمات";
  }

  // Write back to file
  fs.writeFileSync(arFilePath, JSON.stringify(arJson, null, 2) + "\n");
  console.log("Fixed Arabic JSON file");

  console.log("✅ Successfully fixed JSON files!");
}

// Run the function
fixJsonFiles();
