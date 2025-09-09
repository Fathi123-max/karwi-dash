const fs = require("fs");
const path = require("path");

// Function to clean and fix JSON files
function cleanAndFixJsonFiles() {
  const enFilePath = path.join(__dirname, "..", "messages", "en.json");
  const arFilePath = path.join(__dirname, "..", "messages", "ar.json");

  try {
    // Read English file content
    let enContent = fs.readFileSync(enFilePath, "utf8");

    // Try to fix common issues
    // Remove any duplicate closing braces at the end
    enContent = enContent.replace(/\}\s*\}\s*$/g, "}");

    // Parse the JSON
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

    // Read Arabic file content
    let arContent = fs.readFileSync(arFilePath, "utf8");

    // Try to fix common issues
    // Remove any duplicate closing braces at the end
    arContent = arContent.replace(/\}\s*\}\s*$/g, "}");

    // Parse the JSON
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
  } catch (error) {
    console.error("Error fixing JSON files:", error.message);
    process.exit(1);
  }
}

// Run the function
cleanAndFixJsonFiles();
