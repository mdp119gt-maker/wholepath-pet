# WholePath Pet CMS Collections

## MemberProfiles
Member-owned. One item per Wix member.

| Field | Field ID | Type |
|---|---|---|
| Display Name | title | Text |
| First Name | firstName | Text |
| Last Name | lastName | Text |
| Email | email | Text |
| ZIP Code | zip | Text |
| State | state | Text |
| Phone | phone | Text |
| Onboarding Complete | onboardingComplete | Boolean |

## Pets
Member-owned.

| Field | Field ID | Type |
|---|---|---|
| Pet Name | title | Text |
| Member Profile | memberProfile | Reference -> MemberProfiles |
| Species | species | Text |
| Breed | breed | Text |
| Date of Birth | dateOfBirth | Date |
| Sex | sex | Text |
| Spayed / Neutered | altered | Boolean |
| Weight | weight | Number |
| Microchip Number | microchipNumber | Text |
| Microchip Date | microchipDate | Date |
| Photo | photo | Image |

## Vaccines
Member-owned.

| Field | Field ID | Type |
|---|---|---|
| Vaccine | title | Text |
| Pet | pet | Reference -> Pets |
| Date Given | dateGiven | Date |
| Expiration Date | expirationDate | Date |
| Manufacturer | manufacturer | Text |
| Serial / Lot | lotNumber | Text |
| Veterinarian | veterinarian | Text |
| Notes | notes | Text |

## Providers
Public read; admin write.

| Field | Field ID | Type |
|---|---|---|
| Provider Name | title | Text |
| Provider Type | providerType | Text |
| Address | address | Address |
| City | city | Text |
| State | state | Text |
| ZIP | zip | Text |
| Phone | phone | Text |
| Email | email | Text |
| Website | website | URL |
| USDA Accredited | usdaAccredited | Boolean |
| Services | services | Tags |
| Price Notes | priceNotes | Rich Text |
| Estimate Source | estimateSource | Text |
| Estimate Updated | estimateUpdated | Date |

## TravelPlans
Member-owned. Free plans store inputs/summary only; paid checklist/timeline fields are reserved for membership.

| Field | Field ID | Type |
|---|---|---|
| Title | title | Text |
| Pet | pet | Reference -> Pets |
| Travel Type | travelType | Text |
| Origin | origin | Text |
| Destination | destination | Text |
| Arrival Date | arrivalDate | Date |
| Free Summary | freeSummary | Rich Text |
| Paid Checklist JSON | checklistJson | Text |
| Paid Timeline JSON | timelineJson | Text |
