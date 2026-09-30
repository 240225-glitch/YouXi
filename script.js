"use strict";

/* L10 — Math Blaster Boss
   代码颜色 / colour legend: GREEN = comments & explanations, CYAN/BLUE/PURPLE/WHITE = executable code
   THEORY: HTML page pieces · CSS look · JavaScript game brain · DOM live page it can change */

// ---- STEP 1: DOM refs (the page pieces the player sees) ----
const statusEl = document.getElementById("status");
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const fireBtn = document.getElementById("fireBtn");
const startBtn = document.getElementById("startBtn");
const modeBtn = document.getElementById("modeBtn");
const rescueBtn = document.getElementById("rescueBtn");
const resetBtn = document.getElementById("resetBtn");
const timeBox = document.getElementById("timeBox");
const streakBox = document.getElementById("streakBox");
const hitsBox = document.getElementById("hitsBox");
const modeBox = document.getElementById("modeBox");
const bossHpBox = document.getElementById("bossHpBox");
const playerHpBox = document.getElementById("playerHpBox");
const bossBar = document.getElementById("bossBar");
const playerBar = document.getElementById("playerBar");
const bossPanel = document.querySelector(".hpwrap.boss");
const playerPanel = document.querySelector(".hpwrap.player");
const nameInput = document.getElementById("nameInput");
const classInput = document.getElementById("classInput");
const overlay = document.getElementById("resultOverlay");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultDetail = document.getElementById("resultDetail");
const resultReset = document.getElementById("resultReset");

// ---- STEP 1: game-state variables (health variable theory) ----
const MAX_HP = 100;
const ROUND_TIME = 30;          // STEP 4: 30-second timer
const RESCUE_FIXES = [          // RESCUE MODE: fixed questions first, then random
  { a: 3, op: "+", b: 4 },
  { a: 9, op: "-", b: 5 },
  { a: 6, op: "+", b: 7 },
  { a: 12, op: "-", b: 8 },
  { a: 5, op: "+", b: 5 },
];

const state = {
  bossHp: MAX_HP,
  playerHp: MAX_HP,
  streak: 0,
  bestStreak: 0,
  hits: 0,
  misses: 0,
  timeLeft: ROUND_TIME,
  running: false,
  over: false,
  question: null,
  rescue: false,      // rescue toggle: fixed list first, random after
  rescueIndex: 0,
  bossMode: false,    // LEVEL UP: multiplication as Boss Mode
};

let timerId = null;

// ---- STEP 2: function that creates each new question ----
function makeQuestion() {
  if (state.rescue && state.rescueIndex < RESCUE_FIXES.length) {
    const q = RESCUE_FIXES[state.rescueIndex++];
    return { a: q.a, op: q.op, b: q.b, answer: q.op === "+" ? q.a + q.b : q.a - q.b };
  }
  if (state.bossMode) {
    // LEVEL UP: multiplication / mixed Boss Mode
    const a = 2 + Math.floor(Math.random() * 11);   // 2 - 12
    const b = 2 + Math.floor(Math.random() * 11);
    const hard = Math.random() < 0.3;
      if (hard) {                                     // bonus: a x b + c
        const c = 1 + Math.floor(Math.random() * 9);
        return { a: a, op: "x+" + c, b: b, answer: a * b + c };
      }
    return { a: a, op: "x", b: b, answer: a * b };
  }
  // STEP 2: random addition / subtraction
  const a = 1 + Math.floor(Math.random() * 20);
  const b = 1 + Math.floor(Math.random() * 20);
  if (Math.random() < 0.5) return { a: a, op: "+", b: b, answer: a + b };
  const hi = Math.max(a, b), lo = Math.min(a, b);
  return { a: hi, op: "-", b: lo, answer: hi - lo };
}

function questionText(q) {
  if (q.op === "x") return q.a + " \u00d7 " + q.b + " = ?";
  if (q.op.startsWith("x+")) return q.a + " \u00d7 " + q.b + " + " + q.op.slice(2) + " = ?";
  return q.a + " " + q.op + " " + q.b + " = ?";
}

function sumText(q) {
  if (q.op === "x") return q.a + " \u00d7 " + q.b;
  if (q.op.startsWith("x+")) return q.a + " \u00d7 " + q.b + " + " + q.op.slice(2);
  return q.a + " " + q.op + " " + q.b;
}

function nextQuestion() {
  state.question = makeQuestion();
  questionEl.textContent = questionText(state.question);
  questionEl.className = "question";
}

// ---- STEP 2: number parsing — typed text becomes a number ----
function parseAnswer(raw) {
  const cleaned = String(raw).trim().replace(/[^\d-]/g, "");
  if (cleaned === "" || cleaned === "-") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.className = "status " + (cls || "idle");
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---- rendering the DOM while the game runs ----
function renderHealth() {
  bossHpBox.textContent = Math.max(0, state.bossHp);
  playerHpBox.textContent = Math.max(0, state.playerHp);
  bossBar.style.width = Math.max(0, (state.bossHp / MAX_HP) * 100) + "%";
  playerBar.style.width = Math.max(0, (state.playerHp / MAX_HP) * 100) + "%";
  bossPanel.classList.toggle("low", state.bossHp <= 30);
  playerPanel.classList.toggle("low", state.playerHp <= 30);
}

function renderScore() {
  timeBox.textContent = state.timeLeft;
  streakBox.textContent = state.streak;
  hitsBox.textContent = state.hits;
  modeBox.textContent = state.bossMode ? "x BOSS" : "+ \u2212";
  timeBox.parentElement.classList.toggle("danger", state.running && state.timeLeft <= 5);
}

// ---- STEP 4: 30-second countdown ----
function tick() {
  state.timeLeft--;
  renderScore();
  if (state.timeLeft <= 0) endGame("timeout");
}

function startTimer() {
  stopTimer();
  timerId = setInterval(tick, 1000);
}

function stopTimer() {
  if (timerId !== null) { clearInterval(timerId); timerId = null; }
}

// ---- STEP 3 hooks (health changes are added in Build B) ----
function answerFeedback(correct) {
  questionEl.className = "question " + (correct ? "hit" : "miss");
}

// ---- submit: what the player sees after it runs ----
function submitAnswer() {
  if (!state.running || state.over) return;
  const typed = parseAnswer(answerInput.value);
  if (typed === null) {
    setStatus("TYPE A NUMBER — 请输入数字答案", "error");
    return;
  }
  const correct = typed === state.question.answer;
  answerFeedback(correct);
  if (correct) {
    // STEP 3: correct answers damage the boss (streak adds bonus damage)
    state.hits++;
    state.streak++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    const damage = 10 + Math.min(state.streak - 1, 10);
    state.bossHp -= damage;
    setStatus("HIT! -" + damage + " BOSS HP · " + sumText(state.question) + " = " + typed, "good");
    renderHealth();
    if (state.bossHp <= 0) {
      state.bossHp = 0;
      renderHealth();
      answerInput.value = "";
      endGame("boss");
      return;
    }
  } else {
    // STEP 3: wrong answers damage the player and break the streak
    state.misses++;
    state.streak = 0;
    state.playerHp -= 10;
    setStatus("MISS! -10 YOUR HP · answer was " + state.question.answer + " — 你答 " + typed, "error");
    renderHealth();
    if (state.playerHp <= 0) {
      state.playerHp = 0;
      renderHealth();
      answerInput.value = "";
      endGame("player");
      return;
    }
  }
  renderScore();
  answerInput.value = "";
  if (state.running && !state.over) nextQuestion();
}

// ---- controls ----
function startGame() {
  state.bossHp = MAX_HP;
  state.playerHp = MAX_HP;
  state.streak = 0;
  state.bestStreak = 0;
  state.hits = 0;
  state.misses = 0;
  state.timeLeft = ROUND_TIME;
  state.running = true;
  state.over = false;
  state.rescueIndex = state.rescue ? 0 : state.rescueIndex;

  overlay.classList.add("hidden");
  answerInput.value = "";
  answerInput.disabled = false;
  fireBtn.disabled = false;
  startBtn.disabled = true;
  renderHealth();
  renderScore();
  nextQuestion();
  startTimer();
  setStatus("FIRE! — 输入答案按 FIRE 或回车", "ready");
  answerInput.focus();
}

function resetGame() {
  stopTimer();
  state.running = false;
  state.over = false;
  state.timeLeft = ROUND_TIME;
  state.streak = 0;
  state.hits = 0;
  state.bossHp = MAX_HP;
  state.playerHp = MAX_HP;
  answerInput.value = "";
  answerInput.disabled = true;
  fireBtn.disabled = true;
  startBtn.disabled = false;
  overlay.classList.add("hidden");
  renderHealth();
  renderScore();
  questionEl.className = "question";
  questionEl.textContent = questionText(makeQuestion());
  setStatus("PRESS START — 按开始后答题轰 BOSS", "idle");
}

function toggleRescue() {
  state.rescue = !state.rescue;
  state.rescueIndex = 0;
  rescueBtn.classList.toggle("on", state.rescue);
  rescueBtn.textContent = state.rescue ? "RESCUE ON / 救援开" : "RESCUE / 救援";
  setStatus(state.rescue ? "RESCUE MODE — 先做 5 道固定题，再随机出题" : "RESCUE OFF — 随机出题", "idle");
}

function toggleBossMode() {
  state.bossMode = !state.bossMode;
  modeBtn.classList.toggle("on", state.bossMode);
  modeBtn.textContent = state.bossMode ? "BOSS MODE ON / 乘法" : "BOSS MODE / 乘法";
  renderScore();
  setStatus(state.bossMode ? "LEVEL UP: BOSS MODE — 乘法题 (含 a x b + c)" : "BACK TO + \u2212 MODE", "ready");
  if (state.running && !state.over) nextQuestion();
}

function endGame(reason) {
  if (state.over) return;
  state.over = true;
  state.running = false;
  stopTimer();
  answerInput.disabled = true;
  fireBtn.disabled = true;
  startBtn.disabled = false;

  const player = nameInput.value.trim() || "Player";
  const kl = classInput.value.trim();
  const detail =
    "Player: <b>" + escapeHtml(player) + "</b>" + (kl ? " (" + escapeHtml(kl) + ")" : "") + "<br>" +
    "Boss HP left: <b>" + Math.max(0, state.bossHp) + "</b> · Your HP: <b>" + Math.max(0, state.playerHp) + "</b><br>" +
    "Hits: <b>" + state.hits + "</b> · Best streak: <b>" + state.bestStreak + "</b>";

  if (state.bossHp <= 0) {
    setStatus("BOSS DEFEATED! — BOSS 被打倒", "good");
    showResult("\ud83c\udfc6", "BOSS DEFEATED!", detail, "win");
  } else if (reason === "timeout") {
    setStatus("TIME UP! — 30 秒到，BOSS 还剩 " + Math.max(0, state.bossHp) + " HP", "done");
    showResult("\ud83e\udd16", "TIME UP! BOSS WINS", detail, "lose");
  } else if (state.playerHp <= 0) {
    setStatus("YOU WERE DEFEATED — 玩家生命归零", "error");
    showResult("\ud83e\udd16", "BOSS WINS!", detail, "lose");
  }
}

function showResult(icon, title, detail, cls) {
  resultIcon.textContent = icon;
  resultTitle.textContent = title;
  resultTitle.className = "result-title " + cls;
  resultDetail.innerHTML = detail;
  overlay.classList.remove("hidden");
}

// ---- events (theory: what starts this code) ----
startBtn.addEventListener("click", startGame);
fireBtn.addEventListener("click", submitAnswer);
resetBtn.addEventListener("click", resetGame);
resultReset.addEventListener("click", resetGame);
modeBtn.addEventListener("click", toggleBossMode);
rescueBtn.addEventListener("click", toggleRescue);
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitAnswer();
});

// ---- initial view ----
state.question = makeQuestion();
questionEl.textContent = questionText(state.question);
renderHealth();
renderScore();
setStatus("PRESS START — 按开始后答题轰 BOSS", "idle");
