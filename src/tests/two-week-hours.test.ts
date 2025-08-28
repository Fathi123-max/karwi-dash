// // Test file to verify 2-week operating hours functionality

// import { useBranchHoursStore } from "@/stores/admin-dashboard/branch-hours-store";
// import { formatDate, getNextTwoWeeksRange } from "@/lib/date-utils";

// // Test function to demonstrate usage
// async function testTwoWeekFunctionality() {
//   const {
//     fetchHoursForBranchForNextTwoWeeks,
//     getHoursForBranchForNextTwoWeeks,
//     getHoursForBranchAndDate,
//     updateHours
//   } = useBranchHoursStore();

//   // Example branch ID (replace with actual branch ID)
//   const branchId = "example-branch-id";

//   // 1. Fetch hours for the next 2 weeks
//   await fetchHoursForBranchForNextTwoWeeks(branchId);

//   // 2. Get hours for the next 2 weeks
//   const twoWeekHours = getHoursForBranchForNextTwoWeeks(branchId);
//   console.log("Hours for next 2 weeks:", twoWeekHours);

//   // 3. Get hours for a specific date
//   const today = new Date();
//   const specificHours = await getHoursForBranchAndDate(branchId, today);
//   console.log("Hours for today:", specificHours);

//   // 4. Update hours for a specific date
//   if (specificHours && specificHours.id) {
//     await updateHours({
//       ...specificHours,
//       open_time: "08:00",
//       close_time: "18:00",
//       is_closed: false
//     });
//     console.log("Updated hours for today");
//   }

//   // 5. Test date utilities
//   const { startDate, endDate } = getNextTwoWeeksRange();
//   console.log("Next 2 weeks range:", formatDate(startDate), "to", formatDate(endDate));
// }

// // Export for testing
// export { testTwoWeekFunctionality };
