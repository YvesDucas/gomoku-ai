# Gomoku AI — 五目並べ AI

A browser-based Gomoku (five-in-a-row) game with an AI opponent powered by minimax search and alpha-beta pruning. Zero dependencies, no build step.

**Live demo:** https://sen.ltd/portfolio/gomoku-ai/

## Features

- **15×15 board** with canvas rendering (wooden board, gradient stones)
- **Player vs AI** — play as black or white
- **3 difficulty levels**
  - Easy: greedy random moves near existing stones
  - Medium: minimax depth 2
  - Hard: minimax depth 4 with alpha-beta pruning
- **Win detection** — horizontal, vertical, both diagonals
- **Undo** — rewind the last 2 moves (yours + AI's)
- **Move history** panel with algebraic notation
- **AI thinking indicator** with async rendering
- **Japanese / English UI** toggle
- **Dark / light theme**
- **Mobile-friendly** — touch support on canvas

## Getting Started

No installation required. Open `index.html` in any modern browser, or start a local server:

```sh
npm run serve   # python3 -m http.server 8080
```

Then visit http://localhost:8080.

## Running Tests

```sh
npm test
```

Tests use Node.js built-in `node:test` (Node 20+). No test runner installation needed.

## How the AI Works

### Board evaluation

The evaluation function scans every row, column, and diagonal for consecutive stones and scores each pattern:

| Pattern | Score |
|---------|-------|
| Five in a row | 100 000 (win) |
| Open four | 10 000 |
| Closed four | 1 000 |
| Open three | 1 000 |
| Closed three | 100 |
| Open two | 100 |

The final score is `ownScore - opponentScore × 1.1` (slightly defensive).

### Minimax with alpha-beta pruning

The AI only considers candidate moves **within radius 2 of any existing stone**, which keeps the branching factor small enough for depth-4 search to run in well under a second.

Move ordering (trying high-scoring moves first) further improves alpha-beta cutoffs, making the effective search roughly equivalent to depth 6–8 without ordering.

## Project Structure

```
gomoku-ai/
├── index.html          Entry point
├── style.css           Responsive layout, dark/light themes
├── src/
│   ├── main.js         DOM, Canvas rendering, event handling
│   ├── gomoku.js       Board logic (immutable), win detection
│   ├── ai.js           Minimax + alpha-beta pruning
│   └── i18n.js         Japanese / English translations
├── tests/
│   ├── gomoku.test.js  Core logic tests
│   └── ai.test.js      AI tests
└── assets/             Screenshots and media
```

## License

MIT © 2026 SEN LLC (SEN 合同会社)
