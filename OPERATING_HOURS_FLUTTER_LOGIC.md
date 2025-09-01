# Operating Hours Feature - Flutter Implementation Logic

## Overview

This document provides a detailed explanation of the logic behind the Operating Hours feature implementation specifically for Flutter mobile applications. It covers the core algorithms, data flow, state management, and business rules that govern how the feature works in a mobile environment.

## Core Concepts

### Time Slot Representation

Each day of the week is represented as a TimeSlot object with the following properties:

- `id`: Unique identifier (UUID from database or generated default ID)
- `branchId`: Reference to the branch this time slot belongs to
- `dayOfWeek`: Integer representing the day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
- `openTime`: String in "HH:MM" format representing opening time
- `closeTime`: String in "HH:MM" format representing closing time
- `isClosed`: Boolean indicating if the branch is closed on this day

### Default Time Slots

When a branch has no operating hours defined in the database, the system generates default time slots:

- Weekdays (Monday-Friday): 9:00 AM - 5:00 PM
- Weekends (Saturday-Sunday): Closed all day

## Data Flow Logic

### 1. Loading Time Slots

#### Step 1: Fetch from Supabase

```dart
// Fetch existing hours from database
final response = await supabase
    .from('branch_hours')
    .select('*')
    .eq('branch_id', branchId);
```

#### Step 2: Process Database Results

The system processes the database results to ensure all 7 days are represented:

```dart
Future<List<TimeSlot>> loadHours(String branchId) async {
  try {
    // Fetch from Supabase
    final response = await supabase
        .from('branch_hours')
        .select('*')
        .eq('branch_id', branchId);

    if (response.error != null) {
      throw Exception(response.error!.message);
    }

    // Convert to TimeSlot objects
    final List<TimeSlot> branchHours = response.data!
        .map((json) => TimeSlot.fromJson(json))
        .toList();

    // Ensure all 7 days are present
    final days = List.generate(7, (index) => index);
    final List<TimeSlot> completeHours = days.map((day) {
      // Look for existing hour record
      final existing = branchHours.firstWhere(
        (hour) => hour.dayOfWeek == day,
        orElse: () => TimeSlot(
          id: 'default-$branchId-$day',
          branchId: branchId,
          dayOfWeek: day,
          openTime: '09:00',
          closeTime: '17:00',
          isClosed: day == 0 || day == 6, // Sunday and Saturday closed by default
        ),
      );
      return existing;
    }).toList();

    return completeHours;
  } catch (e) {
    // Handle error
    rethrow;
  }
}
```

#### Step 3: Transform for UI

The database records are transformed into a format suitable for the UI widgets:

```dart
// In the widget build method
@override
Widget build(BuildContext context) {
  return Consumer<OperatingHoursProvider>(
    builder: (context, provider, child) {
      return ListView.builder(
        itemCount: provider.timeSlots.length,
        itemBuilder: (context, index) {
          final slot = provider.timeSlots[index];
          return TimeSlotWidget(
            timeSlot: slot,
            onTimeSlotChanged: provider.updateTimeSlot,
          );
        },
      );
    },
  );
}
```

### 2. Handling User Changes

#### Time Changes

When a user modifies the open or close time for a day:

```dart
void handleTimeChange(TimeSlot slot, String field, String value) {
  // Create updated time slot
  final updatedSlot = slot.copyWith(
    openTime: field == 'openTime' ? value : slot.openTime,
    closeTime: field == 'closeTime' ? value : slot.closeTime,
  );

  // Update provider state and mark as having unsaved changes
  provider.updateTimeSlot(updatedSlot);
}
```

#### Closed Status Changes

When a user marks a day as closed:

```dart
void handleClosedChange(TimeSlot slot, bool isClosed) {
  // Create updated time slot
  final updatedSlot = slot.copyWith(
    isClosed: isClosed,
    // Reset times when closing, set defaults when opening
    openTime: isClosed ? null : (slot.openTime ?? '09:00'),
    closeTime: isClosed ? null : (slot.closeTime ?? '17:00'),
  );

  // Update provider state and mark as having unsaved changes
  provider.updateTimeSlot(updatedSlot);
}
```

### 3. Saving Changes

#### Individual Time Slot Updates

Each time slot is saved individually to handle different scenarios:

```dart
Future<bool> saveAllHours() async {
  _isSaving = true;
  _saveStatus = null;
  notifyListeners();

  try {
    // Save each time slot
    for (final slot in _timeSlots) {
      if (slot.id.startsWith('default-')) {
        // This is a new time slot, create it
        await _createHour(slot);
      } else {
        // This is an existing time slot, update it
        await _updateHour(slot);
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
```

#### Supabase Update Logic

The update logic handles both existing records and default records:

```dart
Future<TimeSlot> _updateHour(TimeSlot timeSlot) async {
  try {
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
  } catch (e) {
    // Handle error
    rethrow;
  }
}

Future<TimeSlot> _createHour(TimeSlot timeSlot) async {
  try {
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
  } catch (e) {
    // Handle error
    rethrow;
  }
}
```

## State Management Logic

### Provider Pattern Implementation

The Flutter implementation uses the Provider pattern for state management:

```dart
class OperatingHoursProvider with ChangeNotifier {
  final SupabaseService _supabaseService = SupabaseService();
  List<TimeSlot> _timeSlots = [];
  bool _hasUnsavedChanges = false;
  bool _isSaving = false;
  String? _saveStatus;

  // Getters
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
      rethrow;
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

### hasUnsavedChanges Flag

The `hasUnsavedChanges` flag is managed through the following logic:

1. **Initialization**: Set to `false` when time slots are loaded
2. **Modification**: Set to `true` when any time slot is modified
3. **Saving**: Set to `false` after successful save
4. **Reset**: Set to `false` when loading new data

```dart
// When loading data
_hasUnsavedChanges = false;
notifyListeners();

// When modifying data
_hasUnsavedChanges = true;
notifyListeners();

// When saving data successfully
_hasUnsavedChanges = false;
notifyListeners();
```

### Save Button Visibility

The save button is shown based on the `hasUnsavedChanges` state:

```dart
// In the widget build method
@override
Widget build(BuildContext context) {
  return Consumer<OperatingHoursProvider>(
    builder: (context, provider, child) {
      return Scaffold(
        appBar: AppBar(
          title: Text('Operating Hours'),
          actions: [
            if (provider.hasUnsavedChanges)
              IconButton(
                icon: Icon(Icons.save),
                onPressed: provider.isSaving ? null : () => _saveHours(context),
              ),
          ],
        ),
        body: // ... rest of the UI
      );
    },
  );
}
```

## Business Rules

### Default Values Logic

Default values are applied based on the day of the week:

- Sunday (0) and Saturday (6): `isClosed = true`
- Monday-Friday (1-5): `openTime = "09:00"`, `closeTime = "17:00"`

### Time Validation

The system enforces the following validation rules:

- Open time must be before close time (when not closed)
- Time values must be in "HH:MM" format
- Closed days have null open/close times

### Conflict Resolution

When a unique constraint violation occurs:

1. Detect the error code (23505)
2. Fall back to update operation using branchId and dayOfWeek
3. Update the local state with the result

## Error Handling Logic

### Network Errors

Network errors are handled by:

1. Displaying user-friendly error messages using SnackBar
2. Preserving unsaved changes
3. Providing retry mechanisms

```dart
Future<void> _saveHours(BuildContext context) async {
  final provider = Provider.of<OperatingHoursProvider>(context, listen: false);
  final success = await provider.saveHours();

  if (!success) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Failed to save operating hours. Please try again.'),
        backgroundColor: Colors.red,
      ),
    );
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Operating hours saved successfully!'),
        backgroundColor: Colors.green,
      ),
    );
  }
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

```dart
// Create futures for all updates
final futures = _timeSlots.map((slot) {
  if (slot.id.startsWith('default-')) {
    return _supabaseService.createHour(slot);
  } else {
    return _supabaseService.updateHour(slot);
  }
}).toList();

// Execute all updates concurrently
await Future.wait(futures);
```

### Efficient State Updates

State updates are optimized to minimize widget rebuilds:

- Using `notifyListeners()` only when necessary
- Batching related state updates
- Using `ValueNotifier` for simple state values

### Caching

The system implements caching to reduce database queries:

- Storing fetched hours in the provider state
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

## UI Component Logic

### TimeSlotWidget

The TimeSlotWidget handles the display and editing of a single day's hours:

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

class _TimeSlotWidgetState extends State<TimeSlotWidget> {
  late TimeSlot _timeSlot;

  @override
  void initState() {
    super.initState();
    _timeSlot = widget.timeSlot;
  }

  @override
  Widget build(BuildContext context) {
    final dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    final dayAbbreviations = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Day header
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                  child: Text(
                    dayAbbreviations[_timeSlot.dayOfWeek][0],
                    style: TextStyle(
                      color: Theme.of(context).primaryColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                SizedBox(width: 12),
                Text(
                  dayNames[_timeSlot.dayOfWeek],
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Spacer(),
                // Closed checkbox
                Row(
                  children: [
                    Text('Closed'),
                    Switch(
                      value: _timeSlot.isClosed,
                      onChanged: (value) {
                        setState(() {
                          _timeSlot = _timeSlot.copyWith(
                            isClosed: value,
                            openTime: value ? null : (_timeSlot.openTime ?? '09:00'),
                            closeTime: value ? null : (_timeSlot.closeTime ?? '17:00'),
                          );
                        });
                        widget.onTimeSlotChanged(_timeSlot);
                      },
                    ),
                  ],
                ),
              ],
            ),

            // Time pickers (only shown when not closed)
            if (!_timeSlot.isClosed)
              Padding(
                padding: const EdgeInsets.only(top: 16.0),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Open Time'),
                          SizedBox(height: 8),
                          TimePickerWidget(
                            initialTime: _timeSlot.openTime,
                            onTimeChanged: (time) {
                              setState(() {
                                _timeSlot = _timeSlot.copyWith(openTime: time);
                              });
                              widget.onTimeSlotChanged(_timeSlot);
                            },
                          ),
                        ],
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Close Time'),
                          SizedBox(height: 8),
                          TimePickerWidget(
                            initialTime: _timeSlot.closeTime,
                            onTimeChanged: (time) {
                              setState(() {
                                _timeSlot = _timeSlot.copyWith(closeTime: time);
                              });
                              widget.onTimeSlotChanged(_timeSlot);
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
```

### TimePickerWidget

The TimePickerWidget provides a mobile-friendly time selection interface:

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

class _TimePickerWidgetState extends State<TimePickerWidget> {
  late TimeOfDay _selectedTime;

  @override
  void initState() {
    super.initState();
    // Parse initial time or set default
    if (widget.initialTime != null) {
      final parts = widget.initialTime!.split(':');
      _selectedTime = TimeOfDay(
        hour: int.parse(parts[0]),
        minute: int.parse(parts[1]),
      );
    } else {
      _selectedTime = TimeOfDay(hour: 9, minute: 0);
    }
  }

  Future<void> _selectTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
    );

    if (picked != null && picked != _selectedTime) {
      setState(() {
        _selectedTime = picked;
      });

      // Format time as HH:MM
      final formattedTime =
          '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}';

      widget.onTimeChanged(formattedTime);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _selectTime,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '${_selectedTime.hour.toString().padLeft(2, '0')}:${_selectedTime.minute.toString().padLeft(2, '0')}',
              style: TextStyle(fontSize: 16),
            ),
            Icon(Icons.access_time),
          ],
        ),
      ),
    );
  }
}
```

## Offline Support Considerations

### Local Caching

For offline support, the app can cache time slots locally:

```dart
class OperatingHoursRepository {
  final SharedPreferences _prefs;

  OperatingHoursRepository(this._prefs);

  // Cache time slots locally
  Future<void> cacheTimeSlots(String branchId, List<TimeSlot> timeSlots) async {
    final jsonList = timeSlots.map((slot) => slot.toJson()).toList();
    final jsonString = jsonEncode(jsonList);
    await _prefs.setString('time_slots_$branchId', jsonString);
  }

  // Retrieve cached time slots
  Future<List<TimeSlot>?> getCachedTimeSlots(String branchId) async {
    final jsonString = _prefs.getString('time_slots_$branchId');
    if (jsonString != null) {
      final jsonList = jsonDecode(jsonString) as List;
      return jsonList.map((json) => TimeSlot.fromJson(json)).toList();
    }
    return null;
  }
}
```

### Sync Strategy

When connectivity is restored, sync cached changes:

```dart
Future<void> syncOfflineChanges() async {
  // Check for cached changes
  final cachedChanges = await _repository.getPendingChanges();

  if (cachedChanges != null && cachedChanges.isNotEmpty) {
    // Apply changes to Supabase
    for (final change in cachedChanges) {
      try {
        if (change.isNew) {
          await _supabaseService.createHour(change.timeSlot);
        } else {
          await _supabaseService.updateHour(change.timeSlot);
        }
        // Remove from pending changes
        await _repository.removePendingChange(change.id);
      } catch (e) {
        // Keep in pending changes for retry
        print('Failed to sync change: $e');
      }
    }
  }
}
```

## Testing Logic

### Unit Tests

Unit tests cover:

1. Time slot transformation functions
2. Default value generation
3. State management functions
4. Validation logic

```dart
void main() {
  group('OperatingHoursProvider', () {
    late OperatingHoursProvider provider;

    setUp(() {
      provider = OperatingHoursProvider();
    });

    test('initial state', () {
      expect(provider.timeSlots, isEmpty);
      expect(provider.hasUnsavedChanges, isFalse);
      expect(provider.isSaving, isFalse);
      expect(provider.saveStatus, isNull);
    });

    test('updateTimeSlot updates state', () {
      // Arrange
      final timeSlot = TimeSlot(
        id: '1',
        branchId: 'branch1',
        dayOfWeek: 1,
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: false,
      );
      provider._timeSlots = [timeSlot];

      // Act
      final updatedSlot = timeSlot.copyWith(openTime: '10:00');
      provider.updateTimeSlot(updatedSlot);

      // Assert
      expect(provider.hasUnsavedChanges, isTrue);
      expect(provider.timeSlots.first.openTime, '10:00');
    });
  });
}
```

### Integration Tests

Integration tests cover:

1. Supabase database operations
2. Unique constraint handling
3. Error recovery scenarios
4. End-to-end user flows

### Widget Tests

Widget tests cover:

1. Component rendering
2. User interaction flows
3. State transitions
4. Error message display

This detailed logic explanation provides a comprehensive understanding of how the Operating Hours feature works in Flutter, from data loading and user interaction to saving changes and error handling.
