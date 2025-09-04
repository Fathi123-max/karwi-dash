-- Test script for branch rating functionality

-- 1. Create a test branch
INSERT INTO branches (id, name, franchise_id, ratings) 
VALUES ('test-branch-id', 'Test Branch', 'test-franchise-id', NULL);

-- 2. Create a test user
INSERT INTO users (id, name) 
VALUES ('test-user-id', 'Test User');

-- 3. Create a test car
INSERT INTO cars (id, user_id, make, model) 
VALUES ('test-car-id', 'test-user-id', 'Toyota', 'Camry');

-- 4. Create a test booking
INSERT INTO bookings (id, user_id, car_id, branch_id, service_id) 
VALUES ('test-booking-id', 'test-user-id', 'test-car-id', 'test-branch-id', 'test-service-id');

-- 5. Add a review (this should trigger the rating calculation)
INSERT INTO reviews (id, user_id, booking_id, rating, comment) 
VALUES ('test-review-id', 'test-user-id', 'test-booking-id', 5, 'Great service!');

-- 6. Check the branch rating
SELECT id, name, ratings FROM branches WHERE id = 'test-branch-id';

-- 7. Add another review with a different rating
INSERT INTO reviews (id, user_id, booking_id, rating, comment) 
VALUES ('test-review-id-2', 'test-user-id', 'test-booking-id', 4, 'Good service');

-- 8. Check the updated branch rating (should be 4.5)
SELECT id, name, ratings FROM branches WHERE id = 'test-branch-id';

-- 9. Clean up test data
DELETE FROM reviews WHERE id IN ('test-review-id', 'test-review-id-2');
DELETE FROM bookings WHERE id = 'test-booking-id';
DELETE FROM cars WHERE id = 'test-car-id';
DELETE FROM users WHERE id = 'test-user-id';
DELETE FROM branches WHERE id = 'test-branch-id';