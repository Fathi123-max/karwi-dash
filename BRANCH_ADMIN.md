# Branch Admin Role Implementation

This document describes the implementation of the Branch Admin role in the Karwi Dashboard system.

## Overview

The Branch Admin role is a new authentication role that provides branch-level access to the system. Branch admins can only view and manage data related to their specific branch, providing a more granular level of access control than the existing Admin and Franchise Admin roles.

## Database Structure

### New Table: `branch_admins`

A new table has been added to the database schema to support the Branch Admin role:

```sql
CREATE TABLE public.branch_admins (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT branch_admins_pkey PRIMARY KEY (id),
  CONSTRAINT branch_admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT branch_admins_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id)
);
```

This table links users to specific branches, allowing them to act as administrators for those branches.

## Authentication Flow

1. **Login**: Branch admins log in through a dedicated login page at `/branch/login`
2. **Verification**: The system checks if the user exists in the `branch_admins` table
3. **Authorization**: If verified, the user is granted access to the branch admin dashboard
4. **Data Scoping**: All data displayed to the branch admin is automatically scoped to their assigned branch

## Key Features

### 1. Role-Based Access Control

- Branch admins can only access data related to their specific branch
- Data is automatically filtered based on the branch ID associated with the admin

### 2. Dedicated Dashboard

- Custom dashboard with branch-specific metrics and KPIs
- Access to branch-level reports and analytics

### 3. Branch Management

- View and manage bookings for their branch
- Manage services offered at their branch
- View and manage washers assigned to their branch

## Implementation Details

### Server Actions

New server actions have been created to support branch admin functionality:

1. `getCurrentBranchAdminBranchId()`: Returns the branch ID for the currently logged-in branch admin
2. `branchAdminLogin()`: Handles authentication for branch admins
3. `branchAdminLogout()`: Handles logout for branch admins

### Middleware Updates

The authentication middleware has been updated to recognize and handle branch admin users:

- New routes have been added for branch admin functionality
- Access control logic has been extended to support the new role
- Redirects have been updated to properly route branch admins to their dashboard

### UI Components

New UI components have been created for the branch admin dashboard:

- Dedicated layout with sidebar navigation
- Branch-specific dashboard with metrics and KPIs
- Data tables for bookings, services, and washers
- Reports and analytics views

## Routes

The following routes have been added for branch admin functionality:

- `/branch/login` - Branch admin login page
- `/branch` - Branch admin dashboard (redirects to `/branch/dashboard`)
- `/branch/dashboard` - Main dashboard view
- `/branch/bookings` - Bookings management
- `/branch/services` - Services management
- `/branch/washers` - Washers management
- `/branch/vehicles` - Vehicle management
- `/branch/equipment` - Equipment management
- `/branch/reports` - Reports and analytics

## Security Considerations

1. **Data Isolation**: All data queries are automatically scoped to the branch admin's assigned branch
2. **Authentication**: Branch admins must be explicitly added to the `branch_admins` table
3. **Authorization**: Middleware ensures branch admins can only access their designated routes
4. **Session Management**: Proper session handling with secure logout functionality

## Future Enhancements

Planned improvements for the branch admin role include:

1. **Advanced Reporting**: More detailed analytics and reporting capabilities
2. **Inventory Management**: Tracking of supplies and equipment at the branch level
3. **Staff Scheduling**: Tools for managing washer schedules
4. **Customer Management**: View and manage customers who frequent the branch
