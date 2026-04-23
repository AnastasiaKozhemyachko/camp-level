# Camp Level

Web app for leveling a camper.

An iPhone sends tilt data (pitch & roll) via Firebase, and an Android device displays which wheel to raise.

## How it works

1. Open `index.html#sender` on the iPhone — it reads device orientation and writes pitch/roll to Firestore.
2. Open `index.html` on the Android — it listens for updates and shows which wheel needs to be raised.

## Setup

1. Host `index.html` (e.g. Firebase Hosting, GitHub Pages, or any static server).
2. Open `<your-url>#sender` on the phone placed inside the camper.
3. Open `<your-url>` on the second device to see the result.

## Tech

- Vanilla JS (no build step)
- Firebase Firestore (realtime sync)
- Device Orientation API
