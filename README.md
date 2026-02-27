# Easy Breezy Todos

A lightweight, calming to-do app with optional due dates, priorities, dark/light mode, and installable mobile app support (PWA).

## Features
- Add, edit, complete, and delete tasks.
- Optional due date and priority (Low/Medium/High).
- Filters: All, Active, Completed.
- Progress indicator (e.g. `3/10 completed`).
- Empty state message for first-time use.
- Light/Dark mode toggle with a simple icon.
- Tasks and theme are persisted in local storage.
- Installable mobile app (PWA) support.

## Run locally
1. Start a static server in this folder:
   ```bash
   python3 -m http.server 4173
   ```
2. Open `http://localhost:4173`.

## Deploy to Vercel
`vercel.json` is configured for SPA-style routes while still serving static assets directly.


## Install on mobile
- Open the deployed app in Chrome/Edge/Safari mobile browser.
- Use **Add to Home Screen** / **Install App** to install it like a mobile app.
