# 2-Week Operating Hours Implementation - Updated

This document describes the implementation of the 2-week operating hours feature for branch scheduling.

## Overview

The system now supports setting different operating hours for each day in the next 2 weeks (14 days total). This allows branches to have specific hours for upcoming dates rather than just a repeating weekly schedule.

## Database Changes

### Migration Script

The following migration was applied to the `branch_hours` table:

```sql
-- Add the specific_date column to branch_hours table
ALTER TABLE public.branch_hours 
ADD COLUMN specific_date DATE NULL;

-- Create index for performance on date queries
CREATE INDEX idx_branch_hours_date ON branch_hours(branch_id, specific_date);

-- Update the unique constraint to include specific_date
-- First drop the existing constraint
ALTER TABLE public.branch_hours 
DROP CONSTRAINT IF EXISTS branch_hours_branch_id_day_of_week_key;

-- Add the new constraint with specific_date
-- This allows multiple entries for the same day if they have different dates
-- NULL values in specific_date are treated as the default/regular schedule
ALTER TABLE public.branch_hours 
ADD CONSTRAINT unique_branch_day_date UNIQUE (branch_id, day_of_week, specific_date);
```

### Column Details

- `specific_date`: Optional DATE field that, when populated, indicates the hours apply to that specific date
- When `specific_date` is NULL, the row represents the default weekly schedule
- The unique constraint ensures only one entry per branch/day/date combination

## TypeScript Types

The `BranchHours` type was updated to include the new field:

```typescript
export type BranchHours = {
  id: string;
  branch_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  open_time: string | null; // "HH:MM"
  close_time: string | null; // "HH:MM"
  is_closed: boolean;
  specific_date?: string | null; // Date-specific hours (YYYY-MM-DD format)
};
```

## Store Logic

### New Functions

The `useBranchHoursStore` was updated with new functions:

1. `fetchHoursForBranchForNextTwoWeeks(branchId: string)`: Fetches hours for the next 14 days
2. `getHoursForBranchAndDate(branchId: string, date: Date)`: Gets hours for a specific date
3. `getHoursForBranchForNextTwoWeeks(branchId: string)`: Returns hours for the next 14 days

### Updated Functions

1. `updateHours`: Now handles both default hours and date-specific hours
2. `getHoursForBranch`: Enhanced to prioritize date-specific hours when available

## Date Utilities

New utility functions were added in `src/lib/date-utils.ts`:

1. `getNextTwoWeeksRange()`: Returns the start and end dates for the next 2 weeks
2. `isDateInNextTwoWeeks(date: Date)`: Checks if a date falls within the next 2 weeks
3. `getDateForDayOfWeek(dayOfWeek: number, weekOffset: number)`: Gets the date for a specific day of the week
4. `formatDate(date: Date)`: Formats a date as YYYY-MM-DD string

## UI Components

### BranchTimeSlotsForTwoWeeks

A new component `BranchTimeSlotsForTwoWeeks` was created to handle the 2-week view:

- Displays 14 days of operating hours
- Shows date information for each day
- Allows setting different hours for each specific date

### Updated BranchTimeSlots

The existing `BranchTimeSlots` component was updated to:

- Support a `mode` prop ("default" or "next-two-weeks")
- Handle both weekly default hours and date-specific hours
- Maintain backward compatibility

### Branch Edit Dialog

The branch edit dialog was updated to include both regular weekly hours and next 2 weeks hours in separate tabs:

1. **Regular Hours Tab**: Shows the default 7-day schedule
2. **Next 2 Weeks Tab**: Shows the specific schedule for the next 14 days
3. **Each tab can be edited independently**
4. **Date-specific hours take precedence over default hours**
5. **Both sets of hours are saved when the form is submitted**

## Logic Flow

### Fetching Hours for a Specific Date

1. First check for a row with `specific_date` matching the target date
2. If not found, fall back to the default hours (where `specific_date` is NULL)
3. If no default hours exist, create default values

### Setting Hours for Next 2 Weeks

1. For each day in the next 2 weeks:
   - Create or update a row with `specific_date` set to that day
   - Preserve existing default hours for backward compatibility

### Admin Experience

1. Admins can view and edit the default weekly schedule
2. Admins can view and edit the specific schedule for the next 2 weeks
3. Date-specific hours take precedence over default hours
4. The UI clearly indicates which dates are being edited
5. Both regular and 2-week schedules can be managed in the branch edit dialog

## Migration Considerations

- Existing data remains unchanged (default hours with `specific_date` = NULL)
- No data migration is required for existing records
- New date-specific hours are created as needed
- Performance is optimized with the new index on `branch_id` and `specific_date`

## Testing

The implementation has been tested for:

1. Backward compatibility with existing default hours
2. Creation and updating of date-specific hours
3. Proper fallback to default hours when date-specific hours don't exist
4. UI functionality for both default and date-specific views
5. Edge cases like week boundaries and holidays
6. Integration with the branch edit dialog

## Recent Fixes

### Fixed Condition in updateHours Function

The condition in the `updateHours` function was incorrectly checking `!updatedHour.specific_date` which prevented date-specific hours from being properly inserted. This has been fixed to properly handle both default hours and date-specific hours.

## Future Enhancements

Potential improvements that could be made:

1. Bulk editing for entire weeks
2. Copying hours from one week to another
3. Visual indicators for holidays or special dates
4. Export/import functionality for schedules