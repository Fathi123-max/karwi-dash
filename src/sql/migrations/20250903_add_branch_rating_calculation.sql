-- Function to calculate and update branch rating based on reviews
CREATE OR REPLACE FUNCTION update_branch_rating()
RETURNS TRIGGER AS $$
DECLARE
  branch_id UUID;
  avg_rating NUMERIC;
BEGIN
  -- Get the branch_id from the booking associated with the review
  SELECT branch_id INTO branch_id
  FROM bookings
  WHERE id = COALESCE(NEW.booking_id, OLD.booking_id);
  
  -- If no branch_id found, return
  IF branch_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Calculate the average rating for all reviews of bookings at this branch
  SELECT ROUND(AVG(r.rating), 2) INTO avg_rating
  FROM reviews r
  JOIN bookings b ON r.booking_id = b.id
  WHERE b.branch_id = branch_id;
  
  -- Update the branch rating (set to NULL if no reviews)
  UPDATE branches
  SET ratings = avg_rating
  WHERE id = branch_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update branch rating when a review is inserted
DROP TRIGGER IF EXISTS update_branch_rating_insert ON reviews;
CREATE TRIGGER update_branch_rating_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_branch_rating();

-- Trigger to update branch rating when a review is updated
DROP TRIGGER IF EXISTS update_branch_rating_update ON reviews;
CREATE TRIGGER update_branch_rating_update
AFTER UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_branch_rating();

-- Trigger to update branch rating when a review is deleted
DROP TRIGGER IF EXISTS update_branch_rating_delete ON reviews;
CREATE TRIGGER update_branch_rating_delete
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_branch_rating();