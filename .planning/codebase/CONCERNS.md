# Concerns

Technical debt, known issues, and potential risks in the `gomoku-ai` codebase.

## Performance

- **Minimax Complexity**: The current AI implementation uses a search depth of 4 for "hard" difficulty. While it prunes with Alpha-Beta, the evaluation function is relatively expensive (scanning the whole board for patterns). Larger board sizes or deeper searches may block the UI thread.
- **UI Blocking**: The AI runs on the main thread inside a `setTimeout`. For very heavy computations, this could still lead to periodic UI stutter or unresponsiveness.

## Reliability

- **Missing Defensive Checks**: Minimal input validation on parameters for functions in `ai.js` and `gomoku.js`.
- **Game Rules**: Standard Gomoku often has "Renju" rules (to balance First Player Advantage, like restricted moves for Black). This implementation appears to be standard freestyle Gomoku, which is heavily biased toward the first player (Black).

## Design & CX

- **Japanese Default**: The application defaults to Japanese (`lang="ja"`). While correct for its original context, it might need to be configurable for a global audience (Zen Gomoku).
- **Responsive Canvas**: The canvas resizing logic is robust but uses a parent container's width. Might need fine-tuning for mobile devices with very small screens.
- **Aesthetics**: The current design is functional and clean, but could be made much more "Zen" (premium) per the goals of this project.

## Maintenance

- **No Bundler**: While simplicity is a virtue, the lack of a bundler makes it harder to manage larger sets of assets or CSS frameworks if needed in the future.
- **Manual Serving**: Relying on `python3 http.server` is okay for dev but not a production-ready setup.

---
*Last updated: 2026-04-17*
