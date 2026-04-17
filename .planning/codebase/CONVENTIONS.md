# Conventions

Coding standards and patterns used in the `gomoku-ai` codebase.

## Code Style

- **Language**: Modern JavaScript (ES6+).
- **Modules**: Native ES Modules (`import`/`export`). No transpiler (Babel) or bundler (Webpack/Vite) used.
- **Indentation**: 2 spaces.
- **Semicolons**: Mandatory.
- **Quotes**: Single quotes preferred for strings.

## Patterns

- **Immutability**: Board state transitions are performed by creating a copy of the board array. This simplifies Undo logic and prevents side effects.
- **Pure Logic**: `gomoku.js` and `ai.js` contain pure functions where possible, making them highly testable.
- **Event Handling**: DOM event listeners are centralized in `main.js`.
- **Internationalization**: Strings are managed via an object in `i18n.js` and accessed via a `t(lang, key)` helper function.

## Error Handling

- Minimal error handling in the current version. Relies on `isValidMove` checks before applying changes.

---
*Last updated: 2026-04-17*
