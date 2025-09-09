# Branch Rating Implementation

## Overview

This implementation adds automatic branch rating calculation based on customer reviews. The system automatically calculates and updates branch ratings whenever a review is added, modified, or deleted.

## Components Created

### 1. Rating Utilities (`src/lib/rating-utils.ts`)

- `calculateBranchRating(branchId: string)`: Calculates the average rating for a branch based on all reviews of bookings at that branch
- `updateBranchRating(branchId: string)`: Updates a specific branch's rating in the database
- `updateAllBranchRatings()`: Updates ratings for all branches

### 2. Database Triggers (`src/sql/migrations/20250903_add_branch_rating_calculation.sql`)

- Function `update_branch_rating()`: Calculates and updates branch ratings
- Triggers on the `reviews` table:
  - `update_branch_rating_insert`: Fires when a review is inserted
  - `update_branch_rating_update`: Fires when a review is updated
  - `update_branch_rating_delete`: Fires when a review is deleted

### 3. Updated Branch Store (`src/stores/admin-dashboard/branch-store.ts`)

- Modified `fetchBranches()` to calculate ratings if not already set in the database
- Updated `addBranch()` and `updateBranch()` to handle ratings properly

### 4. Branch Form

- The branch form already included a rating field, so no changes were needed

## How It Works

1. When a customer submits a review for a booking, the database triggers automatically calculate the new average rating for the branch associated with that booking
2. The branch's `ratings` column is updated with the new average
3. When the admin dashboard fetches branches, it displays the current ratings
4. If for any reason a branch's rating is null, the system calculates it on-the-fly

## Testing Instructions

1. Apply the database migration:
   ```sql
   psql -d your_database -f src/sql/migrations/20250903_add_branch_rating_calculation.sql
   ```
2. Create some test branches
3. Create bookings for those branches
4. Add reviews for those bookings
5. Verify that branch ratings are automatically calculated and updated
6. Check that the ratings display correctly in the admin dashboard

## Edge Cases Handled

- Branches with no bookings or reviews show as "Not rated"
- Rating calculations handle decimal precision properly (rounded to 2 decimal places)
- System gracefully handles cases where ratings might be null in the database
