# WholePath Pet Wix Rebuild - Implementation Map

## Customer journey now represented in code
1. Visitor clicks **Create Free Profile** on Home.
2. Wix native member signup/login opens.
3. Authenticated member is routed to Onboarding if no WholePath MemberProfile exists.
4. Onboarding captures name, location, and phone and creates a member-owned `MemberProfiles` item.
5. Member is sent to **Create first pet**.
6. Pet is inserted into `Pets` with:
   - Wix CMS `_owner` = current Wix member (automatic)
   - `memberProfile` = explicit reference to the member's WholePath profile
7. Dashboard queries only the current member's MemberProfile and its Pets.
8. Vaccines are manually entered under each pet.
9. Find Care and Travel Planner remain available to Free members.
10. Paid buttons route Free members to Membership and unlock only after an active WholePath Pricing Plan order is detected.

## What is real in Phase 1
- Account identity
- Cross-device member login
- Member profile data
- Member-owned pet records
- Member-owned vaccine records
- Provider directory queries
- Free travel guidance
- Subscription-state detection

## What comes next
### Phase 2
- Documents collection + upload
- Reminder generation from records
- Preferred provider saving
- Personalized paid travel checklist/timeline

### Phase 3
- Vet record sharing
- Care Team links
- Live sitter/facility completion events
- Triggered email/text/push notifications
