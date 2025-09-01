/\*\*

- Plan for Adding Branch Admin Role
-
- 1.  Database Modifications:
- - Add a new table `branch_admins` to link users to specific branches
- - This table will have columns: id, user_id (references auth.users), branch_id (references branches)
-
- 2.  Authentication Updates:
- - Modify middleware to recognize branch admins
- - Add new login page for branch admins
- - Create new routes for branch admin dashboard
-
- 3.  Authorization Logic:
- - Create server actions to get current branch admin's branch ID
- - Update stores to filter data by branch for branch admins
-
- 4.  UI Components:
- - Create new branch admin dashboard layout
- - Develop components for branch-specific views
    \*/
