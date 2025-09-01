## -- Schema updates for role-based admin authentication

-- 1. Added role column to admins table with constraint (general, franchise, branch)
-- 2. Added admin_id column to branches table with foreign key to auth.users
-- 3. Added admin_id column to franchises table with foreign key to auth.users
-- 4. Removed branch_admins table as it's no longer needed
--
-- These changes were implemented in the following migrations:
-- - 20250829_add_admin_role_column.sql
-- - 20250829_add_admin_id_columns.sql
-- - 20250829_drop_branch_admins_table.sql
