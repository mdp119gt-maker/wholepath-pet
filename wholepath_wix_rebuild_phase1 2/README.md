# WholePath Pet - Wix Rebuild Phase 1

This is the first production-oriented Wix/Velo rebuild of the WholePath Pet MVP.

## Phase 1 product

### WholePath Free
- Real Wix member signup/login
- Member onboarding/profile
- Create and edit pet profiles
- Manually enter vaccine records
- Find care providers
- Filter for USDA-accredited veterinarians
- Basic domestic + international travel guidance

### WholePath Membership (UI/gating prepared)
- $7.99/month or $79/year
- Document uploads
- Automatic reminders
- Preferred-provider saving
- Vet record sharing
- Care Team/live sitter updates
- Personalized travel checklist/timeline

Paid features are intentionally gated but not fully implemented in Phase 1.

## Required Wix apps/features
1. Wix Members Area
2. Wix CMS
3. Wix Pricing Plans
4. Dev Mode / Velo

## Required pages
- Home
- Onboarding
- Member Dashboard
- Pet Profile
- Find Care
- Travel Planner
- Membership

## Member signup flow
The Home page `Create Free Profile` button opens Wix's native member login/signup experience. After authentication:
- if the member has a `MemberProfiles` CMS item -> Dashboard
- if not -> Onboarding

Onboarding captures the user's basic WholePath profile, then takes them directly to create their first pet.

## CMS permissions
For `MemberProfiles`, `Pets`, `Vaccines`, `TravelPlans`, and future paid member data:
- Read: Site member author
- Create: Site member
- Update: Site member author
- Delete: Site member author (or Admin if you want support-controlled deletion)

For `Providers`:
- Read: Anyone
- Create/Update/Delete: Admin only

Wix automatically assigns an item owner when a logged-in member creates an item. WholePath also stores an explicit `memberProfile` reference on Pets for a second layer of relationship clarity.

## Important testing note
Wix Members and Pricing Plans are not fully functional in Preview. Publish to a temporary Wix URL before testing signup/login and paid-plan state.

## Setup order
1. Add Wix Members Area.
2. Add Wix CMS.
3. Create the collections in `cms-collections.md` using the exact IDs.
4. Apply collection permissions.
5. Build page elements using `ELEMENT_IDS.md`.
6. Paste each page's code from `velo/pages/` into the matching Wix page.
7. Paste backend web modules from `velo/backend/`.
8. Add Pricing Plans and create:
   - WholePath Membership Monthly - $7.99/month
   - WholePath Membership Annual - $79/year
9. Publish and test the full signup -> onboarding -> pet flow.
