# Translation Key Management Guide

This document explains how to maintain translation keys in the Karwi Dash project.

## Overview

The Karwi Dash project uses `next-intl` for internationalization with English and Arabic translations. Translation keys are stored in JSON files:
- English: `src/messages/en.json`
- Arabic: `src/messages/ar.json`

## Key Management Scripts

The project includes several scripts to help manage translation keys:

### 1. Extract Used Keys
```bash
node src/scripts/extract-used-keys.js
```
This script scans the codebase to identify all translation keys that are actually used in the application.

### 2. Extract Defined Keys
```bash
node src/scripts/extract-defined-keys.js
```
This script extracts all translation keys that are defined in the message files.

### 3. Compare Keys
```bash
node src/scripts/compare-keys.js
```
This script compares the used keys with the defined keys to identify:
- Missing keys (used in code but not defined in translation files)
- Potentially unused keys (defined in translation files but not used in code)

### 4. Add Missing Keys
```bash
node src/scripts/add-missing-keys.js
```
This script automatically adds missing keys to the translation files with placeholder values.

## Common Issues and Solutions

### 1. Mismatched Keys
If you see a mismatch between used and defined keys:
1. Run the comparison script to identify the issues
2. Add missing keys using the add-missing-keys script
3. Manually review and update placeholder values with appropriate translations

### 2. JSON Syntax Errors
If you encounter JSON syntax errors:
1. Validate the JSON files using `node -e "JSON.parse(fs.readFileSync('src/messages/en.json'))"`
2. Fix any syntax issues (missing commas, extra braces, etc.)
3. Ensure the files have a valid JSON structure

### 3. False Positive Missing Keys
Some keys may be reported as missing when they're actually used:
1. Keys that are constructed dynamically in code
2. Keys that are used in template literals
3. Keys that are used in complex expressions

## Best Practices

### 1. Naming Conventions
- Use descriptive, hierarchical key names (e.g., `admin.users.table.name`)
- Follow the existing structure in the translation files
- Use camelCase for key names

### 2. Key Organization
- Group related keys under common namespaces
- Maintain consistency with existing key structures
- Avoid deeply nested keys (more than 4-5 levels)

### 3. Regular Maintenance
- Run the key comparison script regularly to catch issues early
- Update translation files when adding new features
- Remove unused keys periodically to keep files clean

### 4. Testing
- Always validate JSON syntax after making changes
- Test the application in both languages to ensure translations appear correctly
- Verify that all UI elements have appropriate translations

## Adding New Translations

1. Identify where the new text appears in the code
2. Add the appropriate `useTranslations` hook or `getTranslations` function
3. Use the `t()` function to display the translated text
4. Add the new key to both English and Arabic translation files
5. Provide appropriate translations for both languages

## Removing Unused Translations

1. Run the comparison script to identify potentially unused keys
2. Verify that the keys are truly unused (some may be used dynamically)
3. Remove the keys from both translation files
4. Validate that the application still works correctly