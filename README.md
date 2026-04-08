# The Bow Fighters

A **fast-paced multiplayer archery game** built with TypeScript and Colyseus. Players join a room and compete to land arrow shots on opponents in real time.

## About

The Bow Fighters was built to explore real-time multiplayer game architecture using Colyseus — a Node.js framework designed specifically for authoritative multiplayer servers. The server manages all game state; clients send inputs and receive state diffs, keeping the experience consistent across connections.

The project covers the full multiplayer loop: room management, player joining/leaving, input handling, state broadcasting, and collision resolution server-side.

## Features

- Real-time multiplayer with authoritative server
- Room-based matchmaking via Colyseus
- Server-side collision and hit detection
- TypeScript throughout (client and server)

## Tech

- **Language:** TypeScript
- **Server framework:** Colyseus
- **Runtime:** Node.js

## Running Locally

```bash
npm install
npm start
```

Open the client in a browser and connect to `localhost:2567`.

## License

MIT
