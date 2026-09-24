"use strict";

// ---- constants (theory: arrays + strings) ----
const PROMPTS = [
  "The quick brown fox jumps over the lazy dog near the river bank today.",
  "Speed and accuracy both matter when you race against the coding bot.",
  "Practice typing every day and your words per minute will keep rising.",
  "Stay calm, keep your eyes on the prompt, and press one key at a time.",
];

// ---- DOM refs ----
const statusEl = document.getElementById("status");
const promptEl = document.getElementById("prompt");
const inputEl = document.getElementById("typeInput");
const startBtn = document.getElementById("startBtn");
const finishBtn = document.getElementById("finishBtn");
const resetBtn = document.getElementById("resetBtn");
const wpmBox = document.getElementById("wpmBox");
const timeBox = document.getElementById("timeBox");
const accBox = document.getElementById("accBox");
const botBox = document.getElementById("botBox");
const overlay = document.getElementById("resultOverlay");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultDetail = document.getElementById("resultDetail");
const resultReset = document.getElementById("resultReset");

// ---- game state ----
const state = {
  prompt: "",      // target sentence the player must type
  typed: "",       // what the player has typed so far
  started: false,  // timer starts on first keystroke
  startTime: 0,
  over: false,
  botWpm: 0,       // bot speed rolled at race start
  lastPrompt: -1,  // avoid repeating the same prompt twice in a row
  wpm: 0,
  accuracy: 0,
};

let timerId = null;

// ---- helpers (theory: string comparison + calculations) ----
function pickPrompt() {
  let i = Math.floor(Math.random() * PROMPTS.length);
  if (PROMPTS.length > 1 && i === state.lastPrompt) i = (i + 1) % PROMPTS.length;
  state.lastPrompt = i;
  return PROMPTS[i];
}

function rollBotWpm() {
  return 35 + Math.floor(Math.random() * 40); // 35 - 74
}

function countCorrect(typed, prompt) {
  let n = 0;
  const max = Math.min(typed.length, prompt.length);
  for (let i = 0; i < max; i++) if (typed[i] === prompt[i]) n++;
  return n;
}

function calcWpm(correctChars, elapsedMs) {
  const ms = Math.max(elapsedMs, 500); // guard against instant submits
  const minutes = ms / 60000;
  return Math.round((correctChars / 5) / minutes);
}

function calcAccuracy(correctChars, promptLength) {
  if (promptLength === 0) return 0;
  return Math.round((correctChars / promptLength) * 100);
}

// ---- rendering ----
function renderPrompt() {
  let html = "";
  for (let i = 0; i < state.prompt.length; i++) {
    let cls = "ch";
    if (i < state.typed.length) cls += state.typed[i] === state.prompt[i] ? " ok" : " bad";
    else if (i === state.typed.length && !state.over) cls += " cursor";
    const ch = state.prompt[i] === " " ? "&nbsp;" : escapeHtml(state.prompt[i]);
    html += '<span class="' + cls + '">' + ch + "</span>";
  }
  promptEl.innerHTML = html;
}

function escapeHtml(ch) {
  if (ch === "&") return "&amp;";
  if (ch === "<") return "&lt;";
  if (ch === ">") return "&gt;";
  return ch;
}

function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.className = "status " + (cls || "idle");
}

function showResult(icon, title, detail, cls) {
  resultIcon.textContent = icon;
  resultTitle.textContent = title;
  resultTitle.className = "result-title " + cls;
  resultDetail.innerHTML = detail;
  overlay.classList.remove("hidden");
}

// ---- timer ----
function startTimer() {
  state.started = true;
  state.startTime = Date.now();
  timerId = setInterval(() => {
    const elapsed = (Date.now() - state.startTime) / 1000;
    timeBox.textContent = elapsed.toFixed(1);
  }, 100);
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function elapsedMs() {
  return Date.now() - state.startTime;
}

// ---- input event (theory: runs while the player types) ----
function handleInput() {
  if (state.over) return;
  state.typed = inputEl.value;
  // timer starts on the first keystroke
  if (!state.started && state.typed.length > 0) startTimer();
  renderPrompt();
  // string comparison: exact match stops the timer
  if (state.started && state.typed === state.prompt) finishRace();
}

function submitInput() {
  if (state.over) return;
  if (!state.started) {
    setStatus("PRESS START — 先按开始按钮", "error");
    return;
  }
  if (state.typed.length === 0) {
    setStatus("EMPTY INPUT! — 输入框是空的，照着提示打字", "error");
    return;
  }
  if (state.typed.length < state.prompt.length) {
    const left = state.prompt.length - state.typed.length;
    setStatus("KEEP GOING! — 还差 " + left + " 个字符", "error");
    return;
  }
  finishRace(); // full length but maybe wrong chars → score with accuracy
}

// ---- finish (theory: calculate score, compare with bot) ----
function finishRace() {
  if (state.over) return;
  state.over = true;
  stopTimer();

  const correct = countCorrect(state.typed, state.prompt);
  state.wpm = calcWpm(correct, elapsedMs());
  state.accuracy = calcAccuracy(correct, state.prompt.length);

  inputEl.disabled = true;
  wpmBox.textContent = state.wpm;
  accBox.textContent = state.accuracy + "%";
  timeBox.textContent = (elapsedMs() / 1000).toFixed(1);
  setStatus("RACE OVER — " + state.wpm + " WPM · " + state.accuracy + "% 准确率", "done");

  const botTime = ((state.prompt.length / 5) / state.botWpm) * 60;
  const detail =
    "Your speed: <b>" + state.wpm + " WPM</b> · Accuracy: <b>" + state.accuracy + "%</b><br>" +
    "Bot speed: <b>" + state.botWpm + " WPM</b> (≈ " + botTime.toFixed(1) + "s)";

  if (state.wpm > state.botWpm) showResult("🏆", "YOU WIN!", detail, "win");
  else if (state.wpm < state.botWpm) showResult("🤖", "BOT WINS!", detail, "lose");
  else showResult("🤝", "TIE GAME!", detail, "tie");
}

// ---- controls ----
function startRace() {
  state.prompt = pickPrompt();
  state.typed = "";
  state.started = false;
  state.startTime = 0;
  state.over = false;
  state.botWpm = rollBotWpm();
  state.wpm = 0;
  state.accuracy = 0;

  stopTimer();
  overlay.classList.add("hidden");
  inputEl.value = "";
  inputEl.disabled = false;
  wpmBox.textContent = "0";
  timeBox.textContent = "0.0";
  accBox.textContent = "--";
  botBox.textContent = state.botWpm;
  renderPrompt();
  setStatus("TYPE NOW! — 第一个字母按下后开始计时", "ready");
  inputEl.focus();
}

function resetGame() {
  startRace();
}

startBtn.addEventListener("click", startRace);
finishBtn.addEventListener("click", submitInput);
resetBtn.addEventListener("click", resetGame);
resultReset.addEventListener("click", resetGame);
inputEl.addEventListener("input", handleInput);

// ---- initial view ----
state.prompt = PROMPTS[0];
renderPrompt();
setStatus("PRESS START — 按开始后照着提示打字", "idle");
