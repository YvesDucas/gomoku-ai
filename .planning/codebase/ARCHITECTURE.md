# Architecture

System design and architectural patterns for `gomoku-ai`.

## Architectural Pattern: MVC-ish

The project follows a clean separation of concerns, although not strictly enforced by a framework:

- **Model**: `src/gomoku.js`
  - Defines the board state and game rules.
  - Implements immutable state transitions (e.g., `placeStone` returns a new board).
  - Handles win detection and move validation.
- **View**: `src/main.js` (Canvas) + `style.css`
  - `main.js` contains the canvas rendering logic (`draw()`, `drawStone()`).
  - Handles the visual state of the board and UI updates (status text, history list).
- **Controller**: `src/main.js` (Event Handling)
  - Orchestrates interactions between the user, the game engine (`gomoku.js`), and the AI bot (`ai.js`).
  - Manages the global game loop and turn-taking.
- **Service**: `src/ai.js`
  - Pure logic for move calculation using Minimax and Alpha-Beta pruning.
  - Encapsulates difficulty levels and heuristic evaluation.

## Data Flow

1. **User Interaction**: User clicks the canvas.
2. **Validation**: `main.js` calls `isValidMove` in `gomoku.js`.
3. **Update**: `main.js` calls `placeStone`, gets a new board, and updates its local `board` reference.
4. **Rendering**: `main.js` calls `draw()`.
5. **AI Turn**: If it's the AI's turn, `main.js` calls `getAIMove` in `ai.js` (within a `setTimeout` to prevent UI blocking).
6. **Repeat**: Steps 3-5 repeat until `checkWin` or `isFull` returns true.

## Key Abstractions

- **Board**: A 2D array of integers (`EMPTY`, `BLACK`, `WHITE`).
- **Move**: A simple `[row, col]` coordinate pair.
- **History**: An array of move objects `[{row, col, player}]` used for Undo and replay.

---
*Last updated: 2026-04-17*
