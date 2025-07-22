# ✅ Step 1: Fork the original repo on GitHub manually
# 👉 Visit: https://github.com/arhamkhnz/next-shadcn-admin-dashboard and click "Fork"

# ✅ Step 2: Clone your fork locally
git clone https://github.com/<your-username>/next-shadcn-admin-dashboard.git
cd next-shadcn-admin-dashboard

# ✅ Step 3: Add the original repository as upstream (to sync future updates)
git remote add upstream https://github.com/arhamkhnz/next-shadcn-admin-dashboard.git

# ✅ Step 4: Create a separate branch for each dashboard module

# 🔵 Admin Dashboard
git checkout -b feat/dashboard-admin

# 🔵 Franchise Dashboard
git checkout -b feat/dashboard-franchise

# ✅ Step 5: Organize your codebase by feature folders
# Use this structure under /app:
# └── app
#     └── (dashboards)
#         ├── admin/
#         └── franchise/

# ✅ Step 6: Start development in each branch
# For example:
cd app/(dashboards)/admin
# Create layout, routes, pages, components, etc.

# ✅ Step 7: Push changes regularly to your fork
git add .
git commit -m "feat: implement admin dashboard layout"
git push origin feat/dashboard-admin

# ✅ Step 8: To sync with new updates from the original repo
git checkout main
git fetch upstream
git rebase upstream/main   # or git merge upstream/main
git push origin main

# Then update your feature branches
git checkout feat/dashboard-admin
git merge main
# Repeat for franchise and checkout branches

# ✅ Step 9: Setup project tooling
# 📌 Add project-wide tooling at root level:
# - Prettier and ESLint for formatting/linting
# - GitHub Actions for CI/CD
# - Add `curser setting file ` for dev consistency

# ✅ Step 10: Track changes properly
touch CHANGELOG.md

# Example changelog format:
# ## [0.1.0] - 2025-07-22
# - Created separate branches for admin/franchise/checkout dashboards
# - Added initial layout for admin dashboard
# - Synced with upstream updates

# ✅ Step 11: Use Semantic Versioning for releases
# Suggested version format: MAJOR.MINOR.PATCH
# - Start with 0.1.0 for first custom dashboard version
# - Increment PATCH for fixes, MINOR for features, MAJOR for breaking changes

# ✅ Step 12: Run and test dashboards locally
npm install
npm run dev
