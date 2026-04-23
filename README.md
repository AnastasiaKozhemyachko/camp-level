# Camp Level

Angular app for leveling a camper with two devices.

## Modes

- **Sender** (`#/sender`) → Real device sensor, streams to Firestore (requires internet)
- **Receiver** (`#/`) → Displays live camper leveling visualization from Firestore (requires internet)
- **Offline** (`#/offline`) → Both sections on one screen, real sensor + receiver visualization, local synchronization (no internet needed)
- **Manual** (`#/manual`) → Both sections on one screen, mock sliders + receiver visualization (local synchronization, for testing)

## Features

- Real-time device tilt detection (pitch/roll via Device Orientation API)
- Visual camper representation with 4 wheels
- Color-coded severity: 🟢 green (level) / 🟡 orange (slight tilt) / 🔴 red (significant tilt)
- Priority-ordered instructions showing which wheels to lift first with exact angles
- Works **offline** (local broadcast service)
- Mock sensor mode for **testing** without a real device

## How It Works

1. **Sender** (one device): Place phone inside camper, tap "Start sensor" → streams pitch/roll to Firestore
2. **Receiver** (second device): Displays visual leveler, updates in real time
3. **Offline mode**: Real sensor panel + receiver visualizer on one screen, no internet required
4. **Manual mode**: Mock sliders panel + receiver visualizer on one screen

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm start
   ```

3. Open the app:

   - **`http://localhost:4200/#/offline`** — Test locally with real sensor (no internet)
   - `http://localhost:4200/#/manual` — Test with mock sliders
   - `http://localhost:4200/#/sender` — Sender mode (requires internet for Firestore sync)
   - `http://localhost:4200/#/` — Receiver mode (requires internet for Firestore)

## Build

Production build:

```bash
npm run build
```

GitHub Pages build:

```bash
npm run build:gh-pages
```

## Architecture

```
src/app/
  shared/services/
    local-broadcast.service.ts  ← In-memory broadcast for offline mode
    level.service.ts             ← Firestore sync
    orientation.service.ts       ← Device orientation API
  pages/
    sender/                      ← Production: real sensor + Firestore
    receiver/                    ← Production: Firestore listener
    offline/                     ← Offline mode: real sensor + local broadcast
    debug/                       ← Manual mode implementation (mock sensor + local broadcast)

`#/debug` remains as a legacy alias and redirects to `#/manual`.
```

## Stack

- Angular 21 (standalone components, signals, router)
- Firebase Firestore (real-time sync when internet available)
- Device Orientation API (pitch/roll readings)
- RxJS (reactive data flow, local broadcast)
- SCSS (component-level styling)

