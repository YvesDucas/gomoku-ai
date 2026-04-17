/**
 * i18n.js — French / English translations
 */

export const translations = {
  fr: {
    title:          'Zen Gomoku',
    newGame:        'Nouvelle Partie',
    undo:           'Annuler',
    difficulty:     'Difficulté',
    easy:           'Débutant',
    medium:         'Intermédiaire',
    hard:           'Expert',
    playerColor:    'Jouer avec',
    black:          'Noir (1er)',
    white:          'Blanc (2e)',
    thinking:       'L\'IA réfléchit…',
    yourTurn:       'À vous de jouer',
    aiTurn:         'L\'IA réfléchit',
    blackWins:      'Les Noirs gagnent !',
    whiteWins:      'Les Blancs gagnent !',
    draw:           'Égalité',
    history:        'Historique',
    moveN:          (n) => `Coup ${n}`,
    langToggle:     'EN',
    themeToggle:    '🌙',
    themeDark:      '🌙',
    themeLight:     '☀️',
  },
  en: {
    title:          'Zen Gomoku',
    newGame:        'New Game',
    undo:           'Undo',
    difficulty:     'Difficulty',
    easy:           'Easy',
    medium:         'Medium',
    hard:           'Hard',
    playerColor:    'Play as',
    black:          'Black (first)',
    white:          'White (second)',
    thinking:       'AI thinking…',
    yourTurn:       'Your turn',
    aiTurn:         "AI's turn",
    blackWins:      'Black wins!',
    whiteWins:      'White wins!',
    draw:           'Draw',
    history:        'Move History',
    moveN:          (n) => `Move ${n}`,
    langToggle:     'FR',
    themeToggle:    '🌙',
    themeDark:      '🌙',
    themeLight:     '☀️',
  },
};

export function t(lang, key, ...args) {
  const v = translations[lang]?.[key] ?? translations.fr[key];
  if (typeof v === 'function') return v(...args);
  return v ?? key;
}
