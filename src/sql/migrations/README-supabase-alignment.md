# Database Migration Instructions

## Schema Alignment Migration

This migration aligns the local schema with the Supabase database schema without removing any existing data.

### Files

- `20250829_align_schema_with_supabase.sql` - Aligns schema definitions
- `20250829_migrate_branch_admins_data.sql` - Migrates data from branch_admins table

### How to Run

1. Connect to your Supabase database
2. Run the migrations in order:

   ```sql
   -- First run the alignment migration
   -- Copy and paste the contents of 20250829_align_schema_with_supabase.sql here

   -- Then run the data migration
   -- Copy and paste the contents of 20250829_migrate_branch_admins_data.sql here
   ```

### What the Migrations Do

1. **Alignment Migration**:
   - Adds `admin_id` column to `branches` table with foreign key constraint
   - Updates the `role` column constraint in `admins` table to match Supabase format
   - Preserves all existing data

2. **Data Migration**:
   - Updates the `role` column in `admins` table for existing branch admins
   - Links branches to their admins in the `branches.admin_id` column
   - Removes the deprecated `branch_admins` table

### After Migration

After running the migrations, you can:

1. Use the unified role-based admin authentication system
2. Remove the old branch_admins table references from your code
3. Continue using the existing data without any loss
