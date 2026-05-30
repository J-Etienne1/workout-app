# Workout

Personal mobile-first 2-day workout tracker — **Day 1** (upper) and **Day 2** (lower), which you can train on whatever days of the week suit you. Editable weights and reps persist between sessions.

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

## Install as an app (PWA)

The app is a Progressive Web App, so you can install it to your phone's home
screen and launch it full-screen — its own icon, no browser address bar, and it
keeps working offline at the gym.

**Install (Android / Chrome):** open the GitHub Pages URL, then **⋮ menu → Add to
Home screen / Install app**. (Chrome may also show an install prompt on its own.)

**Install (iOS / Safari):** open the URL, then **Share → Add to Home Screen**.

> Install only works over HTTPS, so use the deployed GitHub Pages URL — a
> `npm run dev --host` server over your local network is plain HTTP and won't
> offer it. To test locally, `npm run build && npm run preview` and open the
> `localhost` URL (localhost counts as secure).

### How it works

- [public/manifest.webmanifest](public/manifest.webmanifest) declares the app
  name, theme colours, and icons.
- [public/sw.js](public/sw.js) is the service worker: **network-first** for the
  page (so a new deploy is picked up whenever you're online) and **cache-first**
  for assets/images (so it loads instantly and works offline). It's registered
  in production only, from [src/main.jsx](src/main.jsx).
- If you ever need to force every device to drop its old cache, bump `VERSION`
  in [public/sw.js](public/sw.js).

### Icons

The PNG icons (`public/icon-*.png`) are generated with a zero-dependency script.
Re-run it after tweaking the design in the script:

```sh
node scripts/generate-icons.mjs
```

## Editing your plan

All exercises live in [src/data/workouts.js](src/data/workouts.js). Adjust sets, rep targets, default weights, or notes there. Reference images are in [public/images/](public/images/).

## Using the app

- **Weights & reps** — adjust with the +/− buttons on each card. Changes save automatically and persist between sessions.
- **Set tracking** — tap the numbered dots to mark sets done; completing a set starts the rest timer. Set progress is kept through the day (across reloads, tab switches, and app relaunches) and clears automatically the next day, so each workout starts fresh.
- **Rest timer** — appears when you complete a set. Pick **60 / 75 / 90s** and your choice is remembered for the following sets; reset or skip from the timer bar.
- **Reset** — **Reset to defaults** on a card restores that exercise's original weight and reps and clears its sets.

### Where data is stored

Everything is saved in your browser's `localStorage` under the key `workout-app:state`. Data lives on your phone only — it does not sync between devices, and clearing your browser data (or switching to a new phone) will wipe it.

## Tests

### Unit tests (Vitest)

Unit tests run on [Vitest](https://vitest.dev) with Testing Library (jsdom).

```sh
npm test         # run the suite once (used by CI)
npm run test:watch   # re-run automatically as you edit
```

Tests live next to the code they cover (`*.test.js` / `*.test.jsx`). They focus
on the parts with real logic:

- [src/hooks/useRestTimer.test.js](src/hooks/useRestTimer.test.js) — countdown,
  skip/reset, and rest presets (uses fake timers, so it's deterministic).
- [src/hooks/useWorkoutState.test.js](src/hooks/useWorkoutState.test.js) — that
  saved weights survive a storage-format change, and that set progress persists
  within a day but resets on a new day.
- [src/components/WeightEditor.test.jsx](src/components/WeightEditor.test.jsx) /
  [RepsEditor.test.jsx](src/components/RepsEditor.test.jsx) — the increment math,
  zero-clamping, and rounding.

CI runs the same `npm test` on every pull request, and the GitHub Pages deploy
won't publish unless the tests pass — see [.github/workflows/](.github/workflows/).

### End-to-end tests (Cypress)

[Cypress](https://www.cypress.io) drives a real browser through the main user
journeys — switching days, editing a weight and reloading, completing a set to
start the rest timer, resetting to defaults, and opening the info panel. The
spec is in [cypress/e2e/workout.cy.js](cypress/e2e/workout.cy.js).

```sh
npm run e2e        # headless: boots the dev server, runs the suite, exits
npm run cy:open    # interactive: opens the Cypress app (dev server must be running)
```

`npm run e2e` uses [`start-server-and-test`](https://github.com/bahmutov/start-server-and-test)
to launch the dev server on a fixed port (`5173`, via `start:e2e`) and point
Cypress at `http://localhost:5173/workout-app/` — the base path matters, so keep
it in sync with `base` in [vite.config.js](vite.config.js) if you ever change it.
For the interactive runner, start the server yourself (`npm run dev`) first.

## Program reference

Tap the **ⓘ** icon top-right for tempo / rest / progression notes from the original plan.

- **Tempo:** 2s down, 1s up
- **Rest:** 60–75s between sets
- **Progression:** double progression — hit the top of the rep range with good form across all sets, then add weight and drop back to the bottom of the range
- **Deload:** every 6–8 weeks, halve the volume for one week
