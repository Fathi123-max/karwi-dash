-- Add the specific_date column to branch_hours table
ALTER TABLE public.branch_hours 
ADD COLUMN specific_date DATE NULL;

-- Create index for performance on date queries
CREATE INDEX idx_branch_hours_date ON branch_hours(branch_id, specific_date);

-- Update the unique constraint to include specific_date
-- First drop the existing constraint
ALTER TABLE public.branch_hours 
DROP CONSTRAINT IF EXISTS branch_hours_branch_id_day_of_week_key;

-- Add the new constraint with specific_date
-- This allows multiple entries for the same day if they have different dates
-- NULL values in specific_date are treated as the default/regular schedule
ALTER TABLE public.branch_hours 
ADD CONSTRAINT unique_branch_day_date UNIQUE (branch_id, day_of_week, specific_date);