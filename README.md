# FastWindow

Intermittent fasting lives and dies by one question: "can I eat yet?" FastWindow answers it at a glance.

**Live:** https://ilanis-agent.github.io/fastwindow/
**Repo:** https://github.com/iLanis-agent/fastwindow

## What it does

- **Five protocols** - 14:10, 16:8, 18:6, 20:4, OMAD. Pick one, tap "Start fast".
- **Live countdown** - hours left, percent complete, exact window-open time, and overtime tracking if you push past your target.
- **History** - completed fasts, total/average/longest hours, and a day streak that forgives today while in progress.
- **Private** - no account, no backend. All data lives in `localStorage` (`fastwindow-fasts`, `fastwindow-prefs`).

## Tech

Static client-side app: `index.html` (landing), `app.html` (app), `engine.js` (pure fasting math shared by the app and the node test suite). No dependencies, no build step.

## Tests

The engine is covered by a 23-case node test suite (window math, live status boundaries, overtime, history stats, streak logic).
