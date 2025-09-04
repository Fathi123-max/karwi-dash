import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/**
 * Calculate the average rating for a branch based on all reviews of bookings at that branch
 * @param branchId - The ID of the branch to calculate ratings for
 * @returns The average rating (0-5) or null if no reviews exist
 */
export async function calculateBranchRating(branchId: string): Promise<number | null> {
  // Fetch all bookings for this branch
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("id")
    .eq("branch_id", branchId);

  if (bookingsError) {
    console.error("Error fetching bookings for branch:", bookingsError);
    return null;
  }

  // If no bookings, no reviews possible
  if (bookings.length === 0) {
    return null;
  }

  // Get booking IDs
  const bookingIds = bookings.map(booking => booking.id);

  // Fetch all reviews for these bookings
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("rating")
    .in("booking_id", bookingIds);

  if (reviewsError) {
    console.error("Error fetching reviews for branch:", reviewsError);
    return null;
  }

  // If no reviews, return null
  if (reviews.length === 0) {
    return null;
  }

  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  return Number(averageRating.toFixed(2));
}

/**
 * Update the rating for a specific branch
 * @param branchId - The ID of the branch to update
 * @returns True if successful, false otherwise
 */
export async function updateBranchRating(branchId: string): Promise<boolean> {
  try {
    const newRating = await calculateBranchRating(branchId);
    
    // Update the branch with the new rating (null if no reviews)
    const { error } = await supabase
      .from("branches")
      .update({ ratings: newRating })
      .eq("id", branchId);

    if (error) {
      console.error("Error updating branch rating:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating branch rating:", error);
    return false;
  }
}

/**
 * Update ratings for all branches
 * @returns True if successful, false otherwise
 */
export async function updateAllBranchRatings(): Promise<boolean> {
  try {
    // Get all branches
    const { data: branches, error: branchesError } = await supabase
      .from("branches")
      .select("id");

    if (branchesError) {
      console.error("Error fetching branches:", branchesError);
      return false;
    }

    // Update rating for each branch
    const results = await Promise.all(
      branches.map(branch => updateBranchRating(branch.id))
    );

    // Check if all updates were successful
    return results.every(result => result);
  } catch (error) {
    console.error("Error updating all branch ratings:", error);
    return false;
  }
}