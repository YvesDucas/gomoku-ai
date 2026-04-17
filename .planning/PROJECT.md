# Zen Gomoku

A premium, aesthetic Gomoku (五目並べ) experience built on a high-performance engine and advanced AI.

## What is this?
Zen Gomoku is an evolution of the `gomoku-ai` project. It aims to provide a serene, premium board game experience that balances "Zen" aesthetics with competitive AI play.

**Core Value**: Providing a distraction-free, beautiful environment for Gomoku enthusiasts.

## Context
- **Base Codebase**: [gomoku-ai](https://github.com/YvesDucas/gomoku-ai) (Native ESM, Canvas-based engine).
- **Target Audience**: Players looking for a high-quality, lightweight web-based Gomoku app.
- **Key Constraint**: Maintain the zero-dependency, native web architecture where possible, while achieving "wow" factor visuals.

## Requirements

### Validated
- ✓ Core Gomoku rules (standard 15x15) — *existing*
- ✓ Interactive Canvas board — *existing*
- ✓ Undo/Redo functionality — *existing*
- ✓ Basic Minimax AI with difficulty settings — *existing*
- ✓ I18n support (JA/EN) — *existing*

### Active
- [ ] **Premium "Zen" Aesthetic**: Implement a high-end visual design with Minimalist Zen Digital / Glassmorphism styling.
- [ ] **KataGomo Integration**: (Proposed) Integrate the state-of-the-art KataGomo engine for professional-level play and analysis.
- [ ] **French Localization**: Remove Japanese and relocate all UI strings to French as the primary language.
- [ ] **Audio & Music**: Implement a serene soundscape with high-quality audio feedback for stone placement and atmospheric background music.

### Out of Scope
- [ ] Multiplayer (Local only for now).
- [ ] Account management / Leaderboards.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **Keep Native ESM** | Maintain simplicity and fast loading without build complexity. | — Active |
| **Canvas for Board** | Best for performance and flexibility in rendering premium stone effects. | — Active |

## Evolution
This document evolves at phase transitions and milestone boundaries.

**After each phase transition**:
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

---
*Last updated: 2026-04-17 after initialization*
