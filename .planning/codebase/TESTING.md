# Testing

Test structure and execution for `gomoku-ai`.

## Framework

- **Framework**: `Node.js` native test runner (`node:test`).
- **Assertion Library**: `Node.js` native `node:assert`.

## Test Structure

- Located in the `tests/` directory.
- Filename pattern: `*.test.js`.
- Current tests cover:
  - Game engine logic (`gomoku.js`): Board creation, stone placement, win detection, board full detection.
  - AI logic (`ai.js`): Pattern scoring and move selection.

## Running Tests

Execution command:
```bash
node --test tests/*.test.js
```
(Alias: `npm test`)

---
*Last updated: 2026-04-17*
