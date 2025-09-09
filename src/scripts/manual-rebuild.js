const fs = require('fs');
const path = require('path');

// Function to manually parse and rebuild JSON files
function manualRebuildJsonFiles() {
  const enFilePath = path.join(__dirname, '..', 'messages', 'en.json');
  const arFilePath = path.join(__dirname, '..', 'messages', 'ar.json');
  
  try {
    // Read lines
    const enLines = fs.readFileSync(enFilePath, 'utf8').split('\n');
    const arLines = fs.readFileSync(arFilePath, 'utf8').split('\n');
    
    // Process English file
    let validEnLines = [];
    let braceCount = 0;
    let inString = false;
    let escaped = false;
    
    for (let i = 0; i < enLines.length; i++) {
      const line = enLines[i];
      
      // Check if we've reached the corrupted part
      if (line.trim() === '{' && i > 100) {
        // Stop processing if we see an unexpected opening brace
        break;
      }
      
      validEnLines.push(line);
      
      // Simple brace counting to ensure we have a valid structure
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"' && !escaped) {
          inString = !inString;
        } else if (char === '\\\\' && inString) {
          escaped = true;
          continue;
        } else if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            // If we've closed all braces, we're at the end
            if (braceCount === 0) {
              // Add our keys before the final closing brace
              validEnLines.splice(validEnLines.length - 1, 0, '  "branch": "Branch",');
              validEnLines.splice(validEnLines.length - 1, 0, '  "services": "Services"');
              break;
            }
          }
        }
        escaped = false;
      }
      
      if (braceCount === 0) {
        break;
      }
    }
    
    // Write the valid content back
    fs.writeFileSync(enFilePath, validEnLines.join('\n'));
    console.log('Manually rebuilt English JSON file');
    
    // Process Arabic file similarly
    let validArLines = [];
    braceCount = 0;
    inString = false;
    escaped = false;
    
    for (let i = 0; i < arLines.length; i++) {
      const line = arLines[i];
      
      // Check if we've reached the corrupted part
      if (line.trim() === '{' && i > 100) {
        // Stop processing if we see an unexpected opening brace
        break;
      }
      
      validArLines.push(line);
      
      // Simple brace counting to ensure we have a valid structure
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"' && !escaped) {
          inString = !inString;
        } else if (char === '\\\\' && inString) {
          escaped = true;
          continue;
        } else if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
            // If we've closed all braces, we're at the end
            if (braceCount === 0) {
              // Add our keys before the final closing brace
              validArLines.splice(validArLines.length - 1, 0, '  "branch": "الفرع",');
              validArLines.splice(validArLines.length - 1, 0, '  "services": "الخدمات"');
              break;
            }
          }
        }
        escaped = false;
      }
      
      if (braceCount === 0) {
        break;
      }
    }
    
    // Write the valid content back
    fs.writeFileSync(arFilePath, validArLines.join('\n'));
    console.log('Manually rebuilt Arabic JSON file');
    
    console.log('✅ Successfully manually rebuilt JSON files!');
  } catch (error) {
    console.error('Error manually rebuilding JSON files:', error.message);
    process.exit(1);
  }
}

// Run the function
manualRebuildJsonFiles();