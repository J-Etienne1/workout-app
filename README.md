# Workout

Personal mobile-first 2-day workout tracker. Saturday upper / Wednesday lower, with editable weights and reps that persist between sessions.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:5173. To preview on your phone over wifi:

```sh
npm run dev -- --host
```

…then visit `http://<your-laptop-ip>:5173/workout-app/` from your phone (same network).

## Deploy to GitHub Pages

1. Create a new public GitHub repo named **`workout-app`** (the name matters — it has to match `base` in `vite.config.js`).
2. Push this directory to `main`:
   ```sh
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/workout-app.git
   git push -u origin main
   ```
3. In the GitHub repo: **Settings → Pages → Source: GitHub Actions**.
4. The first push triggers `.github/workflows/deploy.yml`. After ~1 min, your app is live at:
   `https://<your-username>.github.io/workout-app/`
5. Bookmark that URL on your phone.

> If you use a different repo name, update `base: "/<repo-name>/"` in [vite.config.js](vite.config.js).

## Editing your plan

All exercises live in [src/data/workouts.js](src/data/workouts.js). Adjust sets, rep targets, default weights, or notes there. Reference images are in [public/images/](public/images/).

## How state works

Your weight / current-reps edits are saved in your browser's `localStorage` under the key `workout-app:state`. Data lives on your phone only — it does not sync between devices. To reset a single exercise to the original spreadsheet defaults, tap **Reset to defaults** on its card.

## Program reference

Tap the **ⓘ** icon top-right for tempo / rest / progression notes from the original plan.

- **Tempo:** 2s down, 1s up
- **Rest:** 60–75s between sets
- **Progression:** double progression — hit the top of the rep range with good form across all sets, then add weight and drop back to the bottom of the range
- **Deload:** every 6–8 weeks, halve the volume for one week
