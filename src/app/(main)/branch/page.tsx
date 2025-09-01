import { redirect } from "next/navigation";

export default function BranchHomePage() {
  // Redirect to the main branch dashboard as the default page
  redirect("/branch/dashboard");
}
