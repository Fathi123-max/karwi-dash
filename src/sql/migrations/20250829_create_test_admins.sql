-- Create test admin users for each role type
-- These are for testing purposes only

-- Insert a general admin
INSERT INTO public.admins (name, email, role) 
VALUES ('General Admin', 'general@test.com', 'general');

-- Insert a franchise admin
INSERT INTO public.admins (name, email, role) 
VALUES ('Franchise Admin', 'franchise@test.com', 'franchise');

-- Insert a branch admin
INSERT INTO public.admins (name, email, role) 
VALUES ('Branch Admin', 'branch@test.com', 'branch');

-- Note: These admins don't have auth.users entries, so they won't be able to log in yet
-- To fully test login functionality, you would need to create actual auth users with matching emails
-- and then ensure their IDs match the admin records