# Easy Breezy Todos

A lightweight, calming to-do app with due dates, priorities, drag-drop ordering, theme toggle, and installable app support.

## Features
- Add, edit, complete, and delete tasks.
- Click task content to edit quickly.
- Save and cancel while editing.
- Drag and drop reorder (in **All** filter).
- Optional due date and priority (Low/Medium/High).
- Filters: All, Active, Completed.
- Animated progress indicator.
- Empty state message for first-time use.
- Light/Dark mode toggle.
- Install button for PWA support.
- Tasks and theme are persisted in local storage.

## Run locally
1. Start a static server in this folder:
   ```bash
   python3 -m http.server 4173
   ```
2. Open `http://localhost:4173`.

## Capacitor Android setup
This repo is prepared for Capacitor with:
- `www/` web assets (app entry for native builds)
- `capacitor.config.json` configured with `webDir: "www"`
- mobile-friendly meta tags + Android WebView optimizations
- icon/splash placeholders in `resources/`

Typical commands after installing Capacitor in your project:
```bash
npx cap add android
npx cap sync android
npx cap open android
```

## Deploy to Vercel
`vercel.json` is configured for SPA-style routes while still serving static assets directly.
