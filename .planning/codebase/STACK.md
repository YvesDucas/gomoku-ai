# Tech Stack

Analysis of the technology stack for the `gomoku-ai` codebase.

## Core Technologies

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Logic** | JavaScript (ESM) | ES2020+ | Native browser support for modules, no build step required. |
| **View** | HTML5 / Canvas | — | Low-latency board rendering and standard DOM controls. |
| **Styling** | Vanilla CSS | — | Simple layout, native CSS variables for theme support. |
| **Runtime** | Web Browser | Modern | Frontend-only application. |

## Dependencies

- **Development**:
  - `Node.js` (native test runner) for unit tests.
  - `Python 3` (standard library `http.server`) for local development serving.

## Project Configuration

- `package.json`: Minimal config, defines "type": "module".
- `LICENSE`: MIT License.

## Build & Deployment

- **Build Step**: None.
- **Serving**: `npm run serve` (Python-based).
- **Format**: Native ES Modules.

---
*Last updated: 2026-04-17*
