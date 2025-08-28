# 2-Week Operating Hours Feature

## Overview
The 2-week operating hours feature allows administrators to set specific hours for each day in the next 2 weeks (14 days total). This provides flexibility for branches that need to have different hours for upcoming dates rather than just a repeating weekly schedule.

## How It Works

### Priority System
1. **Date-Specific Hours** - Highest priority (e.g., "Monday, June 3, 2024: 8AM-6PM")
2. **Regular Weekly Hours** - Default fallback (e.g., "All Mondays: 9AM-5PM")

When determining hours for a specific date, the system first checks for date-specific hours. If none are found, it falls back to the regular weekly hours.

### UI Components

#### BranchTimeSlotsForTwoWeeks
This component displays and manages the operating hours for the next 14 days. Each day can be configured independently with:
- Open time
- Close time
- Closed status

#### BranchTimeSlots
The regular component for managing weekly repeating hours (Sunday-Saturday).

## Implementation Details

### Database Schema
The `branch_hours` table was extended with a `specific_date` column:
- `NULL` for regular weekly hours
- Date value (YYYY-MM-DD) for date-specific hours

### Store Logic
The `useBranchHoursStore` was enhanced with:
- `fetchHoursForBranchForNextTwoWeeks` - Fetches both regular and date-specific hours
- `getHoursForBranchForNextTwoWeeks` - Returns hours for the next 14 days
- Enhanced `updateHours` - Handles both regular and date-specific hours

### Branch Edit Dialog
The branch edit form includes tabs for:
1. Basic Info
2. Location
3. Regular Hours
4. Next 2 Weeks

## Usage Instructions

### Setting Hours for Next 2 Weeks
1. Navigate to the Branches page
2. Click "Edit" on a branch
3. Click on the "Next 2 Weeks" tab
4. Configure hours for each day in the next 2 weeks:
   - Toggle "Closed" checkbox to mark a day as closed
   - Set open/close times using the time pickers
5. Click "Save Hours" to apply changes

### Important Notes
- Date-specific hours override regular weekly hours
- Changes are saved automatically when clicking "Save Hours"
- The date range updates dynamically based on the current date
- Sunday and Saturday are marked as closed by default for new branches

## Technical Considerations

### Performance
- Database queries are optimized with indexes on `specific_date`
- Only necessary hours are fetched (current date + 14 days)
- Client-side caching reduces redundant requests

### Edge Cases Handled
- New branches with no existing hours
- Overlapping regular and date-specific hours
- Unique constraint violations in the database
- Default hours for days with no configuration