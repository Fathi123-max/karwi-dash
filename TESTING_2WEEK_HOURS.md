# Testing 2-Week Operating Hours Functionality

This document explains how to test the 2-week operating hours functionality.

## Prerequisites

1. Make sure you've run the database migration
2. Ensure the application is running
3. Have access to a branch in the system

## Testing Steps

### 1. Test in Branch Edit Dialog

1. Navigate to the Admin Dashboard
2. Go to the Branches section
3. Click "Edit" on an existing branch
4. You should see four tabs:
   - Basic Info
   - Location
   - Regular Hours
   - Next 2 Weeks

### 2. Test Regular Weekly Hours

1. Click on the "Regular Hours" tab
   - Modify hours for different days
   - Save changes by clicking "Update Branch"
   - Verify changes are saved by refreshing the page

### 3. Test Next 2 Weeks Hours

1. Click on the "Next 2 Weeks" tab
   - Modify hours for specific dates
   - Save changes by clicking "Update Branch"
   - Verify changes are saved by refreshing the page

### 4. Test Priority Logic

1. Set different hours for the same day in:
   - Regular Weekly Hours (e.g., Monday: 9AM-5PM)
   - Next 2 Weeks Hours for a specific Monday (e.g., Monday: 8AM-6PM)
2. Check that the specific date hours take precedence

### 5. Test Date Utilities

1. Verify that the date range shown is correct (next 14 days)
2. Check that the dates displayed match the actual calendar dates

## Troubleshooting

### If "Hours for Next 2 Weeks" is not functional:

1. Check browser console for errors
2. Verify that the database migration was applied correctly
3. Check that the `specific_date` column exists in the `branch_hours` table
4. Ensure the unique constraint was updated correctly

### Common Issues:

1. **Constraint Violation**: If you get unique constraint errors, make sure the constraint was updated to include `specific_date`
2. **Date Not Saving**: Check that the `specific_date` field is being passed correctly in the update requests
3. **UI Not Loading**: Check that the fetch functions are correctly retrieving both default and date-specific hours

## Verification Checklist

- [ ] Database migration applied successfully
- [ ] `specific_date` column exists in `branch_hours` table
- [ ] Unique constraint updated to include `specific_date`
- [ ] Branch edit dialog shows both regular and 2-week hours
- [ ] Regular hours can be saved and retrieved
- [ ] Date-specific hours can be saved and retrieved
- [ ] Date-specific hours take precedence over regular hours
- [ ] UI displays correct date information
- [ ] No console errors when saving hours