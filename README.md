# WholePath Pet

GitHub-ready static build of the WholePath Pet MVP.

## Included

- `index.html` — current WholePath Pet front end, member login, pet profiles, avatars, and free travel planner.
- `vercel.json` — keeps the Wix authentication callback working at `/auth/callback`.

## Publish with GitHub + Vercel

1. In GitHub, create a new empty repository named `wholepath-pet`.
2. Upload `index.html`, `vercel.json`, and this `README.md` to the repository root and commit them to `main`.
3. In Vercel, open the existing **wholepath-pet** project.
4. In Project Settings > Git, connect the new GitHub repository.
5. Set the production branch to `main`.
6. Deploy. Because this is a static project, no build command is required.

## Important

The Wix Headless OAuth callback expected by the current app is:

`https://wholepath-pet.vercel.app/auth/callback`

Do not remove the rewrite in `vercel.json` unless the authentication flow is changed.

## Current free-member direction

The current build is intended to support:

- Member login/account separation
- Free pet profiles
- Manual vaccine records
- Pet avatar selection
- Free domestic/international travel planner
- Destination-specific requirement guidance
- Pet-profile readiness checks with pass/warning/information states
- Expert trip-review request flow

Photo upload has intentionally been removed for now until dedicated media storage is added.
