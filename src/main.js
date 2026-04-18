/**
 * main.js — DOM, Canvas rendering, event handling
 */

import {
  BOARD_SIZE, EMPTY, BLACK, WHITE,
  createBoard, placeStone, isValidMove, checkWin, getWinLine, isFull,
} from './gomoku.js';
import { getAIMove } from './ai.js';
import { t } from './i18n.js';
import { audioManager } from './audio.js';

// ── State ─────────────────────────────────────────────────────────────────────
let board = createBoard();
let currentPlayer = BLACK;
let playerColor = BLACK;       // human is black by default
let difficulty = 'hard';
let gameOver = false;
let lang = 'fr';
let dark = false;
let moveHistory = [];          // [{row, col, player}]
let winLine = null;
let aiBusy = false;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const canvas   = document.getElementById('board-canvas');
const ctx      = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const histEl   = document.getElementById('history-list');
const thinkEl  = document.getElementById('thinking');
const langBtn  = document.getElementById('btn-lang');
const themeBtn = document.getElementById('btn-theme');
const newBtn   = document.getElementById('btn-new');
const undoBtn  = document.getElementById('btn-undo');
const audioBtn = document.getElementById('btn-audio');
const diffSel  = document.getElementById('sel-difficulty');
const colorSel = document.getElementById('sel-color');

// ── Canvas geometry ───────────────────────────────────────────────────────────
const PADDING   = 32;
let CELL_SIZE;
let CANVAS_SIZE;

function resize() {
  const container = canvas.parentElement;
  const maxW = Math.min(container.clientWidth - 40, window.innerHeight * 0.8, 900);
  CANVAS_SIZE = maxW;
  CELL_SIZE   = (CANVAS_SIZE - PADDING * 2) / (BOARD_SIZE - 1);
  canvas.width  = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  draw();
}

function colToX(c) { return PADDING + c * CELL_SIZE; }
function rowToY(r) { return PADDING + r * CELL_SIZE; }
function xyToCell(x, y) {
  const col = Math.round((x - PADDING) / CELL_SIZE);
  const row = Math.round((y - PADDING) / CELL_SIZE);
  return [row, col];
}

// ── Draw ──────────────────────────────────────────────────────────────────────
const BOARD_COLOR_LIGHT = 'hsl(210, 20%, 98%)';
const BOARD_COLOR_DARK  = 'hsl(210, 15%, 15%)';
const LINE_COLOR_LIGHT  = 'hsla(210, 15%, 0%, 0.15)';
const LINE_COLOR_DARK   = 'hsla(210, 15%, 100%, 0.15)';
const DOT_COLOR         = 'hsl(174, 60%, 50%)'; // Use accent for star points

function draw() {
  const boardBg = dark ? BOARD_COLOR_DARK : BOARD_COLOR_LIGHT;
  const lineCol = dark ? LINE_COLOR_DARK  : LINE_COLOR_LIGHT;

  // Background
  ctx.fillStyle = boardBg;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Grid
  ctx.strokeStyle = lineCol;
  ctx.lineWidth   = 1;
  for (let i = 0; i < BOARD_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(colToX(0), rowToY(i));
    ctx.lineTo(colToX(BOARD_SIZE - 1), rowToY(i));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(colToX(i), rowToY(0));
    ctx.lineTo(colToX(i), rowToY(BOARD_SIZE - 1));
    ctx.stroke();
  }

  // Star points (standard 5-point pattern for 15×15)
  const stars = [3, 7, 11];
  for (const r of stars) {
    for (const c of stars) {
      ctx.beginPath();
      ctx.arc(colToX(c), rowToY(r), CELL_SIZE * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = DOT_COLOR;
      ctx.fill();
    }
  }

  // Stones
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== EMPTY) {
        drawStone(r, c, board[r][c]);
      }
    }
  }

  // Win line highlight - Glowing Teal Trace
  if (winLine) {
    ctx.save();
    ctx.strokeStyle = DOT_COLOR;
    ctx.lineWidth   = CELL_SIZE * 0.2;
    ctx.lineCap     = 'round';
    ctx.shadowBlur  = 15;
    ctx.shadowColor = DOT_COLOR;
    
    ctx.beginPath();
    ctx.moveTo(colToX(winLine[0][1]), rowToY(winLine[0][0]));
    for (let i = 1; i < winLine.length; i++) {
      ctx.lineTo(colToX(winLine[i][1]), rowToY(winLine[i][0]));
    }
    ctx.stroke();
    ctx.restore();
  }

  // Last move marker - Soft Zen Breath
  if (moveHistory.length > 0) {
    const last = moveHistory[moveHistory.length - 1];
    const x = colToX(last.col), y = rowToY(last.row);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, CELL_SIZE * 0.2, 0, Math.PI * 2);
    ctx.shadowBlur = 10;
    ctx.shadowColor = DOT_COLOR;
    ctx.strokeStyle = DOT_COLOR;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}

const STONE_RADIUS_RATIO = 0.45;

function drawStone(row, col, player) {
  const x = colToX(col), y = rowToY(row);
  const r = CELL_SIZE * STONE_RADIUS_RATIO;

  ctx.save();
  
  // Ambient Shadow
  ctx.shadowColor   = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur    = r * 0.5;
  ctx.shadowOffsetX = r * 0.1;
  ctx.shadowOffsetY = r * 0.2;

  // Main Stone Body (Gradient)
  const offset = r * 0.3;
  const grad = ctx.createRadialGradient(x - offset, y - offset, r * 0.1, x, y, r);
  
  if (player === BLACK) {
    grad.addColorStop(0, '#444');   // Highlight center
    grad.addColorStop(0.4, '#111'); // Main body
    grad.addColorStop(1, '#000');   // Edge
  } else {
    grad.addColorStop(0, '#fff');   // Highlight center
    grad.addColorStop(0.5, '#eee'); // Main body
    grad.addColorStop(1, '#bbb');   // Edge
  }

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Subtle Texture / Grain Overlay
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = player === BLACK ? '#fff' : '#000';
  for(let i=0; i<30; i++) {
    const rx = (Math.random() - 0.5) * r * 1.5;
    const ry = (Math.random() - 0.5) * r * 1.5;
    if (Math.sqrt(rx*rx + ry*ry) < r) {
      ctx.fillRect(x + rx, y + ry, 1, 1);
    }
  }
  ctx.globalAlpha = 1.0;

  // Specular Highlight (The "Shell" shine)
  if (player === WHITE) {
    ctx.beginPath();
    ctx.arc(x - r * 0.4, y - r * 0.4, r * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();
  }

  ctx.restore();
}

// ── UI text ───────────────────────────────────────────────────────────────────
function updateUI() {
  document.title            = t(lang, 'title');
  document.getElementById('app-title').textContent = t(lang, 'title');
  newBtn.textContent        = t(lang, 'newGame');
  undoBtn.textContent       = t(lang, 'undo');
  langBtn.textContent       = t(lang, 'langToggle');
  themeBtn.textContent      = dark ? t(lang, 'themeLight') : t(lang, 'themeDark');
  document.getElementById('label-difficulty').textContent = t(lang, 'difficulty');
  document.getElementById('label-color').textContent      = t(lang, 'playerColor');
  diffSel.options[0].text  = t(lang, 'easy');
  diffSel.options[1].text  = t(lang, 'medium');
  diffSel.options[2].text  = t(lang, 'hard');
  colorSel.options[0].text = t(lang, 'black');
  colorSel.options[1].text = t(lang, 'white');
  document.getElementById('history-title').textContent = t(lang, 'history');
  updateAudioIcon();
  updateStatus();
  renderHistory();
}

function updateAudioIcon() {
  audioBtn.textContent = audioManager.muted ? '🔇' : '🔊';
}

function updateStatus() {
  if (gameOver) return;
  if (aiBusy) {
    statusEl.textContent = t(lang, 'thinking');
  } else if (currentPlayer === playerColor) {
    statusEl.textContent = t(lang, 'yourTurn');
  } else {
    statusEl.textContent = t(lang, 'aiTurn');
  }
}

function showResult(winner) {
  if (winner === null) {
    statusEl.textContent = t(lang, 'draw');
  } else if (winner === BLACK) {
    statusEl.textContent = t(lang, 'blackWins');
  } else {
    statusEl.textContent = t(lang, 'whiteWins');
  }
}

function playOutcomeSound(winner) {
  if (winner === null) return; // Silent for draw? Or different sound?
  if (winner === playerColor) {
    audioManager.playSfx('win');
  } else {
    audioManager.playSfx('loss');
  }
}

function renderHistory() {
  histEl.innerHTML = '';
  moveHistory.forEach((mv, i) => {
    const li = document.createElement('li');
    const label = mv.player === BLACK ? '●' : '○';
    const colLetter = String.fromCharCode(65 + mv.col);
    li.textContent = `${t(lang, 'moveN', i + 1)} ${label} ${colLetter}${mv.row + 1}`;
    histEl.appendChild(li);
  });
  histEl.scrollTop = histEl.scrollHeight;
}

// ── Game logic ────────────────────────────────────────────────────────────────
function newGame() {
  board         = createBoard();
  currentPlayer = BLACK;
  gameOver      = false;
  winLine       = null;
  moveHistory   = [];
  aiBusy        = false;
  thinkEl.hidden = true;
  audioManager.resumeAmbient();
  audioManager.playSfx('ui');
  draw();
  updateUI();

  // If human is white, AI (black) goes first
  if (playerColor === WHITE) {
    doAIMove();
  }
}

function makeMove(row, col) {
  if (gameOver || aiBusy) return;
  if (!isValidMove(board, row, col)) {
    audioManager.playSfx('invalid');
    return;
  }
  if (currentPlayer !== playerColor) return;

  applyMove(row, col, currentPlayer);

  if (checkGameEnd(row, col, currentPlayer)) return;
  currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
  updateStatus();
  doAIMove();
}

function applyMove(row, col, player) {
  board = placeStone(board, row, col, player);
  moveHistory.push({ row, col, player });
  audioManager.playSfx('stone');
  draw();
  renderHistory();
}

function checkGameEnd(row, col, player) {
  if (checkWin(board, row, col, player)) {
    winLine  = getWinLine(board, row, col, player);
    gameOver = true;
    draw();
    showResult(player);
    playOutcomeSound(player);
    return true;
  }
  if (isFull(board)) {
    gameOver = true;
    showResult(null);
    return true;
  }
  return false;
}

function doAIMove() {
  const aiColor = playerColor === BLACK ? WHITE : BLACK;
  if (currentPlayer !== aiColor || gameOver) return;

  aiBusy = true;
  thinkEl.hidden = false;
  updateStatus();

  // Yield to paint before heavy computation
  setTimeout(() => {
    const [r, c] = getAIMove(board, aiColor, difficulty);
    applyMove(r, c, aiColor);
    aiBusy = false;
    thinkEl.hidden = true;

    if (!checkGameEnd(r, c, aiColor)) {
      currentPlayer = playerColor;
      updateStatus();
    }
  }, 20);
}

function undo() {
  if (gameOver && winLine) {
    // Allow undo even after game over to replay
    gameOver = false;
    winLine  = null;
    audioManager.resumeAmbient();
  }
  if (moveHistory.length === 0) return;

  audioManager.playSfx('undo');

  // Remove last two moves (player + AI), or one if AI hasn't moved yet
  const toRemove = moveHistory.length >= 2 ? 2 : 1;
  for (let i = 0; i < toRemove; i++) {
    if (moveHistory.length === 0) break;
    moveHistory.pop();
  }

  // Rebuild board from history
  board = createBoard();
  for (const mv of moveHistory) {
    board = placeStone(board, mv.row, mv.col, mv.player);
  }
  currentPlayer = playerColor;
  aiBusy = false;
  thinkEl.hidden = true;
  draw();
  renderHistory();
  updateStatus();
}

// ── Events ────────────────────────────────────────────────────────────────────
function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return [(clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY];
}

canvas.addEventListener('click', e => {
  const [x, y] = getCanvasPos(e);
  const [row, col] = xyToCell(x, y);
  makeMove(row, col);
});

canvas.addEventListener('touchend', e => {
  e.preventDefault();
  const [x, y] = getCanvasPos(e);
  const [row, col] = xyToCell(x, y);
  makeMove(row, col);
}, { passive: false });

newBtn.addEventListener('click',   newGame);
undoBtn.addEventListener('click',  undo);

diffSel.addEventListener('change', e => {
  difficulty = e.target.value;
  audioManager.playSfx('ui');
});

colorSel.addEventListener('change', e => {
  playerColor = e.target.value === 'white' ? WHITE : BLACK;
  audioManager.playSfx('ui');
  newGame();
});

langBtn.addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  audioManager.playSfx('ui');
  updateUI();
});

themeBtn.addEventListener('click', () => {
  dark = !dark;
  document.body.classList.toggle('dark', dark);
  audioManager.playSfx('ui');
  draw();
  themeBtn.textContent = dark ? t(lang, 'themeLight') : t(lang, 'themeDark');
});

audioBtn.addEventListener('click', () => {
  audioManager.toggleMute();
  updateAudioIcon();
});

// Audio Unlock on first interaction
const unlockAudio = () => {
  audioManager.unlock();
  window.removeEventListener('click',    unlockAudio);
  window.removeEventListener('keydown',  unlockAudio);
  window.removeEventListener('touchstart', unlockAudio);
};
window.addEventListener('click',    unlockAudio);
window.addEventListener('keydown',  unlockAudio);
window.addEventListener('touchstart', unlockAudio);

window.addEventListener('resize', resize);

// ── Init ──────────────────────────────────────────────────────────────────────
resize();
newGame();
