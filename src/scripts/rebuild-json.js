const fs = require('fs');
const path = require('path');

// Function to completely rebuild JSON files
function rebuildJsonFiles() {
  const enFilePath = path.join(__dirname, '..', 'messages', 'en.json');
  const arFilePath = path.join(__dirname, '..', 'messages', 'ar.json');
  
  try {
    // Read the content
    let enContent = fs.readFileSync(enFilePath, 'utf8');
    let arContent = fs.readFileSync(arFilePath, 'utf8');
    
    // Try to extract valid JSON by finding the first { and last }
    const firstBraceEn = enContent.indexOf('{');
    const lastBraceEn = enContent.lastIndexOf('}');
    
    if (firstBraceEn !== -1 && lastBraceEn !== -1 && lastBraceEn > firstBraceEn) {
      const validEnContent = enContent.substring(firstBraceEn, lastBraceEn + 1);
      const enJson = JSON.parse(validEnContent);
      
      // Add our keys
      enJson.branch = "Branch";
      enJson.services = "Services";
      
      // Write back
      fs.writeFileSync(enFilePath, JSON.stringify(enJson, null, 2) + '\n');
      console.log('Rebuilt English JSON file');
    } else {
      throw new Error('Could not find valid JSON structure in English file');
    }
    
    // Do the same for Arabic file
    const firstBraceAr = arContent.indexOf('{');
    const lastBraceAr = arContent.lastIndexOf('}');
    
    if (firstBraceAr !== -1 && lastBraceAr !== -1 && lastBraceAr > firstBraceAr) {
      const validArContent = arContent.substring(firstBraceAr, lastBraceAr + 1);
      const arJson = JSON.parse(validArContent);
      
      // Add our keys
      arJson.branch = "الفرع";
      arJson.services = "الخدمات";
      
      // Write back
      fs.writeFileSync(arFilePath, JSON.stringify(arJson, null, 2) + '\n');
      console.log('Rebuilt Arabic JSON file');
    } else {
      throw new Error('Could not find valid JSON structure in Arabic file');
    }
    
    console.log('✅ Successfully rebuilt JSON files!');
  } catch (error) {
    console.error('Error rebuilding JSON files:', error.message);
    process.exit(1);
  }
}

// Run the function
rebuildJsonFiles();