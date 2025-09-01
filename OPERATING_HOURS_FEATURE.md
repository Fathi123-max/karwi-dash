# Operating Hours Feature Documentation

## Overview

This document describes the Operating Hours feature implementation that allows branch managers to set and manage daily operating hours for their branches. This feature is implemented using Supabase as the backend and will be available in both the web admin dashboard and a mobile Flutter application.

## Feature Requirements

### Core Functionality

1. **View Operating Hours**: Display current operating hours for all 7 days of the week
2. **Edit Operating Hours**: Modify opening and closing times for each day
3. **Mark Days as Closed**: Ability to mark specific days as closed
4. **Save Changes**: Persist changes to the Supabase database
5. **Default Values**: Provide sensible defaults for new branches

### Data Structure

The feature uses the `branch_hours` table in Supabase with the following structure:

```sql
CREATE TABLE public.branch_hours (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES branches(id),
  day_of_week integer NOT NULL, -- 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  open_time time without time zone,
  close_time time without time zone,
  is_closed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT branch_hours_pkey PRIMARY KEY (id),
  CONSTRAINT branch_hours_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES branches(id)
);
```

### Unique Constraint

To prevent duplicate entries for the same branch and day:

```sql
ALTER TABLE public.branch_hours
ADD CONSTRAINT unique_branch_day UNIQUE (branch_id, day_of_week);
```

## Supabase Integration

### Database Queries

#### Fetch Operating Hours for a Branch

```javascript
const { data, error } = await supabase.from("branch_hours").select("*").eq("branch_id", branchId);
```

#### Insert New Operating Hours

```javascript
const { data, error } = await supabase.from("branch_hours").insert([
  {
    branch_id: branchId,
    day_of_week: dayOfWeek,
    open_time: openTime,
    close_time: closeTime,
    is_closed: isClosed,
  },
]);
```

#### Update Existing Operating Hours

```javascript
const { data, error } = await supabase
  .from("branch_hours")
  .update({
    open_time: openTime,
    close_time: closeTime,
    is_closed: isClosed,
  })
  .eq("id", hourId);
```

#### Handle Unique Constraint Violations

```javascript
if (error && error.code === "23505") {
  // Unique constraint violation - try updating instead
  const { data: updateData, error: updateError } = await supabase
    .from("branch_hours")
    .update({
      open_time: openTime,
      close_time: closeTime,
      is_closed: isClosed,
    })
    .eq("branch_id", branchId)
    .eq("day_of_week", dayOfWeek);
}
```

## Web Implementation Details

### Component Structure

The feature is implemented using the following React components:

1. **BranchTimeSlots**: Main component for displaying and editing time slots
2. **BranchTimeSlotsForm**: Form component for batch editing time slots

### State Management

The component uses React state hooks and Zustand store to manage:

- `timeSlots`: Array of time slot objects
- `hasUnsavedChanges`: Boolean flag for tracking modifications
- `isSaving`: Loading state during save operations
- `saveStatus`: Success/error status of save operations

### Data Flow

1. **Loading**: Fetch existing hours from Supabase database
2. **Display**: Render time slots with current values
3. **Editing**: Update local state when users make changes
4. **Saving**: Send updated data to Supabase
5. **Feedback**: Show success/error messages

## Mobile Flutter Implementation

### Key Components

#### 1. OperatingHoursScreen

Main screen for viewing and editing operating hours

```dart
class OperatingHoursScreen extends StatefulWidget {
  final String branchId;

  const OperatingHoursScreen({Key? key, required this.branchId}) : super(key: key);

  @override
  _OperatingHoursScreenState createState() => _OperatingHoursScreenState();
}
```

#### 2. TimeSlotWidget

Widget for displaying and editing a single day's hours

```dart
class TimeSlotWidget extends StatefulWidget {
  final TimeSlot timeSlot;
  final Function(TimeSlot) onTimeSlotChanged;

  const TimeSlotWidget({
    Key? key,
    required this.timeSlot,
    required this.onTimeSlotChanged,
  }) : super(key: key);

  @override
  _TimeSlotWidgetState createState() => _TimeSlotWidgetState();
}
```

### Data Models

#### TimeSlot Model

```dart
class TimeSlot {
  final String id;
  final String branchId;
  final int dayOfWeek;
  final String? openTime;
  final String? closeTime;
  final bool isClosed;

  TimeSlot({
    required this.id,
    required this.branchId,
    required this.dayOfWeek,
    this.openTime,
    this.closeTime,
    required this.isClosed,
  });

  // Copy with method for updating
  TimeSlot copyWith({
    String? id,
    String? branchId,
    int? dayOfWeek,
    String? openTime,
    String? closeTime,
    bool? isClosed,
  }) {
    return TimeSlot(
      id: id ?? this.id,
      branchId: branchId ?? this.branchId,
      dayOfWeek: dayOfWeek ?? this.dayOfWeek,
      openTime: openTime ?? this.openTime,
      closeTime: closeTime ?? this.closeTime,
      isClosed: isClosed ?? this.isClosed,
    );
  }
}
```

### Supabase Integration in Flutter

#### Supabase Service

```dart
class SupabaseService {
  late SupabaseClient supabase;

  SupabaseService() {
    supabase = SupabaseClient(
      'YOUR_SUPABASE_URL',
      'YOUR_SUPABASE_ANON_KEY',
    );
  }

  // Get hours for a branch
  Future<List<TimeSlot>> getHours(String branchId) async {
    final response = await supabase
        .from('branch_hours')
        .select('*')
        .eq('branch_id', branchId);

    if (response.error != null) {
      throw Exception(response.error!.message);
    }

    return response.data!.map((json) => TimeSlot.fromJson(json)).toList();
  }

  // Update a time slot
  Future<TimeSlot> updateHour(TimeSlot timeSlot) async {
    final response = await supabase
        .from('branch_hours')
        .update({
          'open_time': timeSlot.openTime,
          'close_time': timeSlot.closeTime,
          'is_closed': timeSlot.isClosed,
        })
        .eq('id', timeSlot.id)
        .select();

    if (response.error != null) {
      // Handle unique constraint violation
      if (response.error!.code == '23505') {
        // Try updating based on branch_id and day_of_week
        final updateResponse = await supabase
            .from('branch_hours')
            .update({
              'open_time': timeSlot.openTime,
              'close_time': timeSlot.closeTime,
              'is_closed': timeSlot.isClosed,
            })
            .eq('branch_id', timeSlot.branchId)
            .eq('day_of_week', timeSlot.dayOfWeek)
            .select();

        if (updateResponse.error != null) {
          throw Exception(updateResponse.error!.message);
        }

        return TimeSlot.fromJson(updateResponse.data!.first);
      }
      throw Exception(response.error!.message);
    }

    return TimeSlot.fromJson(response.data!.first);
  }

  // Create a new time slot
  Future<TimeSlot> createHour(TimeSlot timeSlot) async {
    final response = await supabase.from('branch_hours').insert([
      {
        'branch_id': timeSlot.branchId,
        'day_of_week': timeSlot.dayOfWeek,
        'open_time': timeSlot.openTime,
        'close_time': timeSlot.closeTime,
        'is_closed': timeSlot.isClosed,
      }
    ]).select();

    if (response.error != null) {
      throw Exception(response.error!.message);
    }

    return TimeSlot.fromJson(response.data!.first);
  }
}
```

### State Management (Provider Pattern)

#### OperatingHoursProvider

```dart
class OperatingHoursProvider with ChangeNotifier {
  final SupabaseService _supabaseService = SupabaseService();
  List<TimeSlot> _timeSlots = [];
  bool _hasUnsavedChanges = false;
  bool _isSaving = false;
  String? _saveStatus;

  List<TimeSlot> get timeSlots => _timeSlots;
  bool get hasUnsavedChanges => _hasUnsavedChanges;
  bool get isSaving => _isSaving;
  String? get saveStatus => _saveStatus;

  // Load hours for a branch
  Future<void> loadHours(String branchId) async {
    try {
      _timeSlots = await _supabaseService.getHours(branchId);
      _hasUnsavedChanges = false;
      notifyListeners();
    } catch (e) {
      // Handle error
    }
  }

  // Update a time slot
  void updateTimeSlot(TimeSlot updatedSlot) {
    final index = _timeSlots.indexWhere((slot) => slot.id == updatedSlot.id);
    if (index != -1) {
      _timeSlots[index] = updatedSlot;
      _hasUnsavedChanges = true;
      notifyListeners();
    }
  }

  // Save all changes
  Future<bool> saveHours() async {
    _isSaving = true;
    _saveStatus = null;
    notifyListeners();

    try {
      for (var slot in _timeSlots) {
        // Check if it's a new slot (default ID)
        if (slot.id.startsWith('default-')) {
          await _supabaseService.createHour(slot);
        } else {
          await _supabaseService.updateHour(slot);
        }
      }

      _hasUnsavedChanges = false;
      _saveStatus = 'success';
      notifyListeners();

      // Reset success status after 3 seconds
      Future.delayed(Duration(seconds: 3), () {
        _saveStatus = null;
        notifyListeners();
      });

      return true;
    } catch (e) {
      _saveStatus = 'error';
      notifyListeners();
      return false;
    } finally {
      _isSaving = false;
      notifyListeners();
    }
  }
}
```

### UI Components

#### Time Picker

```dart
class TimePickerWidget extends StatefulWidget {
  final String? initialTime;
  final Function(String) onTimeChanged;

  const TimePickerWidget({
    Key? key,
    this.initialTime,
    required this.onTimeChanged,
  }) : super(key: key);

  @override
  _TimePickerWidgetState createState() => _TimePickerWidgetState();
}
```

#### Day Selector

```dart
class DaySelectorWidget extends StatelessWidget {
  final int dayOfWeek;
  final bool isClosed;
  final Function(bool) onClosedChanged;

  const DaySelectorWidget({
    Key? key,
    required this.dayOfWeek,
    required this.isClosed,
    required this.onClosedChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Implementation for day selection UI
  }
}
```

## Default Values

For new branches or missing days, the system provides default values:

- **Weekdays (Monday-Friday)**: Open 9:00 AM - 5:00 PM
- **Weekends (Saturday-Sunday)**: Closed all day

## Error Handling

### Common Error Scenarios

1. **Network Errors**: Display user-friendly error messages
2. **Validation Errors**: Validate time formats and logical constraints
3. **Conflict Errors**: Handle unique constraint violations
4. **Permission Errors**: Ensure proper authentication and authorization

### Error Recovery

- **Automatic Retry**: Retry failed operations with exponential backoff
- **Manual Retry**: Provide retry buttons for failed operations
- **Local Caching**: Cache changes locally in case of network failures

## Responsive Design Considerations

### Mobile-First Approach

- Touch-friendly time pickers
- Adequate spacing for touch targets
- Vertical layout for small screens
- Collapsible sections for better organization

### Tablet Optimization

- Side-by-side time pickers
- Grid layout for multiple days
- Enhanced visual hierarchy

## Accessibility Features

### Screen Reader Support

- Proper labeling of all interactive elements
- Semantic structure for content

### Keyboard Navigation

- Tab navigation through time slots
- Keyboard shortcuts for common actions
- Focus management for modal dialogs

## Performance Considerations

### Data Loading

- Efficient Supabase queries
- Proper indexing of database tables
- Caching of frequently accessed data

### Save Operations

- Batch updates for multiple changes
- Optimistic UI updates
- Progress indicators for long operations

## Testing Strategy

### Unit Tests

- Time slot validation logic
- Supabase query functions
- State management updates

### Integration Tests

- Supabase database operations
- Unique constraint handling
- Error scenario recovery

### UI Tests

- Component rendering
- User interaction flows
- Responsive behavior

## Security Considerations

### Authentication

- JWT token validation through Supabase Auth
- Row Level Security (RLS) policies
- Role-based access control

### Data Validation

- Input sanitization
- Database constraint enforcement
- Proper error message handling

### Audit Logging

- Change tracking through Supabase
- User activity logging
- Compliance reporting

## Future Enhancements

### Advanced Features

1. **Recurring Closures**: Holiday schedules and recurring closures
2. **Break Times**: Lunch breaks and other interruptions
3. **Multi-Shift Support**: Multiple opening periods per day
4. **Timezone Support**: Handle different timezones for global branches

### Analytics

1. **Usage Patterns**: Track peak hours and customer traffic
2. **Performance Metrics**: Monitor uptime and service levels
3. **Comparison Reports**: Compare hours across branches

This documentation provides a comprehensive guide for implementing the Operating Hours feature using Supabase as the backend in both the web admin dashboard and mobile Flutter application. The design ensures consistency across platforms while leveraging Supabase capabilities for optimal performance and security.
