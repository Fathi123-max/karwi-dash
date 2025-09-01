# Operating Hours Feature - Detailed Logic Explanation

## Overview

This document provides a detailed explanation of the logic behind the Operating Hours feature implementation. It covers the core algorithms, data flow, state management, and business rules that govern how the feature works.

## Core Concepts

### Time Slot Representation

Each day of the week is represented as a TimeSlot object with the following properties:

- `id`: Unique identifier (UUID from database or generated default ID)
- `branch_id`: Reference to the branch this time slot belongs to
- `day_of_week`: Integer representing the day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
- `open_time`: String in "HH:MM" format representing opening time
- `close_time`: String in "HH:MM" format representing closing time
- `is_closed`: Boolean indicating if the branch is closed on this day

### Default Time Slots

When a branch has no operating hours defined in the database, the system generates default time slots:

- Weekdays (Monday-Friday): 9:00 AM - 5:00 PM
- Weekends (Saturday-Sunday): Closed all day

## Data Flow Logic

### 1. Loading Time Slots

#### Step 1: Fetch from Supabase

```javascript
// Fetch existing hours from database
const { data, error } = await supabase.from("branch_hours").select("*").eq("branch_id", branchId);
```

#### Step 2: Process Database Results

The system processes the database results to ensure all 7 days are represented:

```javascript
getHoursForBranch: (branchId: string) => {
  // Get existing hours from store
  const branchHours = get().hours.filter((h) => h.branch_id === branchId);

  // Ensure all 7 days are present
  const days = Array.from({ length: 7 }, (_, i) => i);
  return days.map((day) => {
    // Look for existing hour record
    const existing = branchHours.find((h) => h.day_of_week === day);
    if (existing) {
      return existing; // Return existing record
    }

    // Create default record if none exists
    return {
      id: `default-${branchId}-${day}`,
      branch_id: branchId,
      day_of_week: day,
      open_time: "09:00",
      close_time: "17:00",
      is_closed: day === 0 || day === 6, // Sunday and Saturday closed by default
    };
  });
}
```

#### Step 3: Transform for UI

The database records are transformed into a format suitable for the UI components:

```javascript
// Transform to UI format
const slots = hours.map((h) => ({
  id: h.id,
  dayOfWeek: h.day_of_week,
  openTime: h.open_time,
  closeTime: h.close_time,
  isClosed: h.is_closed,
}));
```

### 2. Handling User Changes

#### Time Changes

When a user modifies the open or close time for a day:

```javascript
const handleTimeChange = (dayIndex: number, field: "openTime" | "closeTime", value: string) => {
  // Update the specific time slot
  const updatedSlots = timeSlots.map((slot) =>
    slot.dayOfWeek === dayIndex
      ? {
          ...slot,
          [field]: value, // Update the specific field (openTime or closeTime)
        }
      : slot,
  );

  // Update state and mark as having unsaved changes
  setTimeSlots(updatedSlots);
  setHasUnsavedChanges(true);
};
```

#### Closed Status Changes

When a user marks a day as closed:

```javascript
const handleClosedChange = (dayIndex: number, checked: boolean) => {
  setTimeSlots((prev) =>
    prev.map((slot) =>
      slot.dayOfWeek === dayIndex
        ? {
            ...slot,
            isClosed: checked,
            // Reset times when closing, set defaults when opening
            openTime: checked ? null : (slot.openTime ?? "09:00"),
            closeTime: checked ? null : (slot.closeTime ?? "17:00"),
          }
        : slot,
    ),
  );
  setHasUnsavedChanges(true);
};
```

### 3. Saving Changes

#### Individual Time Slot Updates

Each time slot is saved individually to handle different scenarios:

```javascript
const handleSaveAll = async (): Promise<boolean> => {
  try {
    // Save each time slot
    const promises = timeSlots.map((slot) =>
      updateHours({
        id: slot.id,
        branch_id: branchId,
        day_of_week: slot.dayOfWeek,
        open_time: slot.isClosed ? null : slot.openTime,
        close_time: slot.isClosed ? null : slot.closeTime,
        is_closed: slot.isClosed,
      })
    );

    await Promise.all(promises);
    setHasUnsavedChanges(false);
    setSaveStatus("success");
    return true;
  } catch (error) {
    setSaveStatus("error");
    return false;
  }
};
```

#### Supabase Update Logic

The update logic handles both existing records and default records:

```javascript
updateHours: async (updatedHour) => {
  // Check if this is a default hour (not in DB yet)
  if (updatedHour.id.startsWith("default-")) {
    // Try to insert new record
    const { data, error } = await supabase
      .from("branch_hours")
      .insert([
        /* hour data */
      ])
      .select();

    if (error) {
      // Handle unique constraint violation
      if (error.code === "23505") {
        // Try updating existing record instead
        const { data: updateData, error: updateError } = await supabase
          .from("branch_hours")
          .update({
            open_time: updatedHour.open_time,
            close_time: updatedHour.close_time,
            is_closed: updatedHour.is_closed,
          })
          .eq("branch_id", updatedHour.branch_id)
          .eq("day_of_week", updatedHour.day_of_week)
          .select();
      }
    } else {
      // Successfully inserted new record
      // Update store with new data
    }
  } else {
    // Update existing record in database
    const { data, error } = await supabase
      .from("branch_hours")
      .update({
        open_time: updatedHour.open_time,
        close_time: updatedHour.close_time,
        is_closed: updatedHour.is_closed,
      })
      .eq("id", updatedHour.id)
      .select();

    // Update store with updated data
  }
};
```

## State Management Logic

### hasUnsavedChanges Flag

The `hasUnsavedChanges` flag is managed through the following logic:

1. **Initialization**: Set to `false` when time slots are loaded
2. **Modification**: Set to `true` when any time slot is modified
3. **Saving**: Set to `false` after successful save
4. **Reset**: Set to `false` when loading new data

```javascript
// When loading data
setHasUnsavedChanges(false);

// When modifying data
setHasUnsavedChanges(true);

// When saving data successfully
setHasUnsavedChanges(false);
```

### Save Button Visibility

The save button is shown based on two conditions:

1. `hasUnsavedChanges` is `true`
2. Either `showSaveButton` prop is `true` OR we're using the dedicated save button

```javascript
// Show save button when there are unsaved changes
{
  hasUnsavedChanges && <Button onClick={() => handleSaveAll()}>Save Hours</Button>;
}
```

## Business Rules

### Default Values Logic

Default values are applied based on the day of the week:

- Sunday (0) and Saturday (6): `is_closed = true`
- Monday-Friday (1-5): `open_time = "09:00"`, `close_time = "17:00"`

### Time Validation

The system enforces the following validation rules:

- Open time must be before close time (when not closed)
- Time values must be in "HH:MM" format
- Closed days have null open/close times

### Conflict Resolution

When a unique constraint violation occurs:

1. Detect the error code (23505)
2. Fall back to update operation using branch_id and day_of_week
3. Update the local store with the result

## Error Handling Logic

### Network Errors

Network errors are handled by:

1. Displaying user-friendly error messages
2. Preserving unsaved changes
3. Providing retry mechanisms

```javascript
catch (error) {
  console.error("Error saving time slots:", error);
  setSaveStatus("error");
  // Keep hasUnsavedChanges as true to allow retry
  return false;
}
```

### Validation Errors

Validation errors are handled by:

1. Checking data format before sending to Supabase
2. Displaying specific error messages
3. Preventing invalid data from being saved

### Constraint Violations

Unique constraint violations are handled by:

1. Detecting the specific error code
2. Automatically falling back to update operation
3. Updating the local state with the result

## Performance Optimizations

### Batch Operations

Multiple time slot updates are performed as batch operations:

```javascript
// Create promises for all updates
const promises = timeSlots.map((slot) => updateHours(slot));

// Execute all updates concurrently
await Promise.all(promises);
```

### Efficient State Updates

State updates are optimized to minimize re-renders:

- Using functional updates for complex state changes
- Batching related state updates
- Using memoization for expensive calculations

### Caching

The system implements caching to reduce database queries:

- Storing fetched hours in the Zustand store
- Reusing existing data when possible
- Only fetching when necessary

## Edge Cases Handling

### New Branches

For new branches without any database records:

1. Generate default time slots with special IDs
2. Mark as having no unsaved changes initially
3. Allow creation of actual records when first saved

### Partial Data

When only some days have database records:

1. Load existing records
2. Generate defaults for missing days
3. Allow independent modification of each day

### Concurrent Modifications

When multiple users modify the same branch:

1. Last-write-wins semantics
2. Potential for conflict detection in future enhancements

## Mobile Implementation Considerations

### Platform Differences

The mobile implementation follows the same logic but with platform-specific considerations:

1. **UI Components**: Flutter widgets instead of React components
2. **State Management**: Provider pattern instead of React hooks and Zustand
3. **Networking**: Supabase Dart SDK instead of JavaScript client
4. **Navigation**: Flutter navigation instead of React Router

### Data Synchronization

Mobile implementation includes additional considerations:

1. Offline support with local caching
2. Conflict resolution for offline edits
3. Background sync when connectivity is restored

## Testing Logic

### Unit Tests

Unit tests cover:

1. Time slot transformation functions
2. Default value generation
3. State management functions
4. Validation logic

### Integration Tests

Integration tests cover:

1. Supabase database operations
2. Unique constraint handling
3. Error recovery scenarios
4. End-to-end user flows

### UI Tests

UI tests cover:

1. Component rendering
2. User interaction flows
3. State transitions
4. Error message display

This detailed logic explanation provides a comprehensive understanding of how the Operating Hours feature works, from data loading and user interaction to saving changes and error handling.
