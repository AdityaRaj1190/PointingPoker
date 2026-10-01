# Pointer Poker

A real-time planning poker tool for scrum teams — create a room, share the
link, and estimate stories together with live vote updates. Similar in spirit
to pointingpoker.com.

Client-only React + Vite app. Real-time sync between teammates is powered by
Firebase Realtime Database (free tier is plenty for typical team usage).

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Firebase project at https://console.firebase.google.com/:
   - Add a Web App to the project.
   - Enable **Realtime Database** (Build → Realtime Database → Create
     Database). Start in test mode, then tighten rules (see below).
   - Copy the web app config values.

3. Copy `.env.example` to `.env` and fill in your Firebase config:

   ```bash
   cp .env.example .env
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

## Realtime Database rules

The default "test mode" rules expire after 30 days. A reasonable permanent
rule set for this app (no auth, rooms are only as private as their 6-char
code):

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

## Commands

```bash
npm install
npm run dev      # start dev server (Vite)
npm run build    # production build to dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

## How it works

- `src/lib/firebase.js` — initializes the Firebase app/Realtime Database from
  `VITE_FIREBASE_*` env vars.
- `src/lib/room.js` — room CRUD: create, join (with `onDisconnect` cleanup so
  a closed tab removes that participant), cast vote, reveal, reset round.
- `src/lib/identity.js` — a per-browser participant id (localStorage) and
  room-code generator.
- `src/pages/Home.jsx` — create or join a room by code.
- `src/pages/Room.jsx` — the voting board: deck of cards, live participant
  list, reveal/average, new round.

Data model in Realtime Database:

```
rooms/{roomId}
  topic: string
  revealed: boolean
  participants/{participantId}
    name: string
    vote: string | null
```
