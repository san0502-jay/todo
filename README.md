# Easy Breezy Todos

A lightweight to-do list app with a relaxed, pastel UI.

## Features
- Add, complete, and delete tasks.
- Filter tasks by all/open/done.
- Clear all completed tasks.
- Saves tasks in local storage.
- Light/Dark mode toggle with a subtle icon.
- Calm green/blue progress indicator.

## Preview

Here is a working preview of the app UI with sample tasks:

![Easy Breezy Todos preview](browser:/tmp/codex_browser_invocations/297a0b7a4f59a39e/artifacts/artifacts/preview-working-theme.png)

## Run locally
1. Start a static server in this folder:
   ```bash
   python3 -m http.server 4173
   ```
2. Open `http://localhost:4173`.

## Test checklist
- Add a task from the input and confirm it appears in the list.
- Check/uncheck a task and confirm visual state + count update.
- Switch filters (`All`, `Open`, `Done`) and confirm items are filtered.
- Delete a task with `×`.
- Click **Clear done** and confirm completed items are removed.
- Refresh the page and confirm tasks persist.

## Deploy to Vercel
This repo includes `vercel.json` with an SPA rewrite for route-like paths only (paths without file extensions), so direct links such as `/done` work while assets like `/app.js` and `/styles.css` are served normally.

### Option A: Vercel dashboard
1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, click **Add New → Project**.
3. Import the repo.
4. Framework preset: **Other**.
5. Build command: *(leave empty)*.
6. Output directory: *(leave empty / root)*.
7. Deploy.

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel
vercel --prod
```

After deployment, open your Vercel URL and run the same test checklist above.
