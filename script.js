"use strict";

/* L11 — Dice Strategy Duel
   代码颜色 / colour legend: GREEN = comments & explanations, GOLD/CYAN/WHITE = executable code
   THEORY: HTML page pieces · CSS look · JavaScript game brain · DOM live page it can change */

// ---- STEP 1: DOM refs (the page pieces the player sees) ----
const statusEl = document.getElementById("status");
const turnBanner = document.getElementById("turnBanner");
const dieEl = document.getElementById("die");
const pipEls = dieEl.querySelectorAll("i");
const playerScoreBox = document.getElementById("playerScoreBox");
const botScoreBox = document.getElementById("botScoreBox");
const turnScoreBox = document.getElementById("turnScoreBox");
const targetBox = document.getElementById("targetBox");
const lastRollBox = document.getElementById("lastRollBox");
const rollsBox = document.getElementById("rollsBox");
const rollBtn = document.getElementById("rollBtn");
const holdBtn = document.getElementById("holdBtn");
const startBtn = document.getElementById("startBtn");
const diffBtn = document.getElementById("diffBtn");
const rescueBtn = document.getElementById("rescueBtn");
const resetBtn = document.getElementById("resetBtn");
const nameInput = document.getElementById("nameInput");
const classInput = document.getElementById("classInput");
const overlay = document.getElementById("resultOverlay");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultDetail = document.getElementById("resultDetail");
const resultReset = document.getElementById("resultReset");

// ---- STEP 1: game-state variables (变量 stores the changing game state) ----
const TARGET = 30;            // STEP 4: first to 30 wins
const BOT_DELAY = 700;        // ms the bot "thinks" between rolls (tests slow it down)

const BOT_RULES = {           // LEVEL UP: Easy / Hard bot thresholds
  easy: { holdAt: 10, smart: false },
  hard: { holdAt: 15, smart: true },
};

const PIPS = {                // STEP 2: pip cells lit up for each face
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const state = {
  playerScore: 0,
  botScore: 0,
  turnScore: 0,        // risk pot: grows while you keep rolling
  rollsThisTurn: 0,
  lastRoll: 0,
  turn: "player",      // "player" | "bot"
  running: false,
  over: false,
  difficulty: "easy",
  rescue: false,       // RESCUE: player-only Pig, the bot sits out
  rolls: 0,
  holds: 0,
  busts: 0,
  biggestTurn: 0,
  playerWins: 0,
  botWins: 0,
};

let botTimer = null;
let botDelay = BOT_DELAY;     // let so the test runner can speed the bot up

// ---- STEP 2: first visible win — a random 1–6 ----
function rollDie() {
  return 1 + Math.floor(Math.random() * 6);
}

function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.className = "status " + (cls || "idle");
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function canAct() {
  return state.running && !state.over && state.turn === "player";
}

// ---- rendering the DOM while the game runs ----
function renderDie() {
  const face = state.lastRoll >= 1 && state.lastRoll <= 6 ? state.lastRoll : 5;
  const lit = PIPS[face] || [];
  pipEls.forEach((pip, i) => pip.classList.toggle("on", lit.includes(i)));
  dieEl.classList.toggle("bust", state.lastRoll === 1 && state.turnScore === 0);
}

function render() {
  playerScoreBox.textContent = state.playerScore;
  botScoreBox.textContent = state.botScore;
  turnScoreBox.textContent = state.turnScore;
  targetBox.textContent = TARGET;
  lastRollBox.textContent = state.lastRoll === 0 ? "–" : state.lastRoll;
  rollsBox.textContent = state.rollsThisTurn;

  const mine = state.turn === "player";
  turnBanner.textContent = state.over
    ? "GAME OVER / 本局结束"
    : mine ? "YOUR TURN / 你的回合" : "BOT TURN / 电脑回合";
  turnBanner.className = "turnbanner " + (mine ? "you" : "cpu");

  const free = state.running && !state.over;
  rollBtn.disabled = !(free && mine);
  holdBtn.disabled = !(free && mine && state.turnScore > 0);
  startBtn.disabled = state.running && !state.over;
  diffBtn.disabled = state.running && !mine;
  rescueBtn.disabled = state.running && !mine;

  turnScoreBox.parentElement.classList.toggle("hot", state.turnScore >= 8);
  turnScoreBox.parentElement.classList.toggle("win", state.playerScore >= TARGET - 4);
  renderDie();
}

// ---- STEP 3: the turn score is lost on a 1, then the turn passes ----
function afterBust() {
  setStatus("BUST! Rolled 1 — turn score lost · 掷到 1，本轮分清零", "error");
  passTurn();
}

function passTurn() {
  state.turnScore = 0;
  state.rollsThisTurn = 0;
  if (state.rescue) {                 // RESCUE: player-only practice, no bot turn
    state.turn = "player";
    render();
    setStatus("RESCUE — player only, keep rolling · 救援模式，继续掷骰", "ready");
    return;
  }
  state.turn = state.turn === "player" ? "bot" : "player";
  render();
  if (state.turn === "bot") {
    setStatus("BOT THINKING — 电脑回合", "bot");
    scheduleBotTurn();
  } else {
    setStatus("YOUR TURN — 按 ROLL 掷骰或 HOLD 保存", "ready");
  }
}

function rollDice() {
  if (!state.running || state.over) return false;
  const v = rollDie();
  state.lastRoll = v;
  state.rollsThisTurn++;
  state.rolls++;
  dieEl.classList.remove("rolling");
  void dieEl.offsetWidth;             // restart the CSS roll animation
  dieEl.classList.add("rolling");

  if (v === 1) {
    state.turnScore = 0;
    state.busts++;
    render();
    afterBust();
    return true;
  }
  state.turnScore += v;
  render();
  return true;
}

// ---- STEP 3: HOLD banks the turn score and passes the turn ----
function bankScore(who) {
  const gained = state.turnScore;
  if (who === "player") state.playerScore += gained;
  else state.botScore += gained;
  state.holds++;
  state.biggestTurn = Math.max(state.biggestTurn, gained);
  state.turnScore = 0;
  state.rollsThisTurn = 0;
  render();

  const total = who === "player" ? state.playerScore : state.botScore;
  if (total >= TARGET) {              // condition: first to target wins
    endGame(who);
    return;
  }
  passTurn();
}

function playerRoll() {
  if (!canAct()) return;
  rollDice();
}

function playerHold() {
  if (!canAct() || state.turnScore <= 0) return;
  setStatus("HOLD! +" + state.turnScore + " banked · 保存 " + state.turnScore + " 分", "good");
  bankScore("player");
}

// ---- STEP 4: bot strategy — a simple threshold rule ----
function botShouldHold() {
  const t = state.turnScore;
  const rules = BOT_RULES[state.difficulty];
  if (state.botScore + t >= TARGET) return true;      // take the win now
  if (rules.smart &&                                    // LEVEL UP: hard bot protects a lead
      state.playerScore >= TARGET - 5 &&
      state.botScore + t >= state.playerScore &&
      t >= rules.holdAt - 5) return true;
  return t >= rules.holdAt;
}

function scheduleBotTurn() {
  clearTimeout(botTimer);
  botTimer = setTimeout(botStep, botDelay);
}

function botStep() {
  if (!state.running || state.over || state.turn !== "bot" || state.rescue) return;
  if (botShouldHold()) {
    setStatus("BOT HOLDS — 电脑保存 " + state.turnScore + " 分", "bot");
    bankScore("bot");
    return;
  }
  setStatus("BOT ROLLS — 电脑掷骰", "bot");
  rollDice();
  if (state.running && !state.over && state.turn === "bot") scheduleBotTurn();
}

// ---- win / lose ----
function endGame(winner) {
  if (state.over) return;
  state.over = true;
  state.running = false;
  clearTimeout(botTimer);
  render();

  const player = nameInput.value.trim() || "Player";
  const kl = classInput.value.trim();
  if (winner === "player") state.playerWins++;
  else state.botWins++;

  const detail =
    "Player: <b>" + escapeHtml(player) + "</b>" + (kl ? " (" + escapeHtml(kl) + ")" : "") + "<br>" +
    "Final — YOU <b>" + state.playerScore + "</b> · BOT <b>" + state.botScore + "</b> (target " + TARGET + ")<br>" +
    "Rolls <b>" + state.rolls + "</b> · Holds <b>" + state.holds + "</b> · Busts <b>" + state.busts + "</b> · Best turn <b>" + state.biggestTurn + "</b><br>" +
    "Session — you <b>" + state.playerWins + "</b> · bot <b>" + state.botWins + "</b>";

  if (winner === "player") {
    setStatus("YOU WIN! First to " + TARGET + " — 你赢了", "good");
    showResult("\ud83c\udfc6", "YOU WIN! / 你赢了", detail, "win");
  } else {
    setStatus("BOT WINS — 电脑先到 " + TARGET + " 分", "error");
    showResult("\ud83e\udd16", "BOT WINS! / 电脑赢了", detail, "lose");
  }
}

function showResult(icon, title, detail, cls) {
  resultIcon.textContent = icon;
  resultTitle.textContent = title;
  resultTitle.className = "result-title " + cls;
  resultDetail.innerHTML = detail;
  overlay.classList.remove("hidden");
}

// ---- controls ----
function startGame() {
  clearTimeout(botTimer);
  state.playerScore = 0;
  state.botScore = 0;
  state.turnScore = 0;
  state.rollsThisTurn = 0;
  state.lastRoll = 0;
  state.turn = "player";
  state.running = true;
  state.over = false;
  state.rolls = 0;
  state.holds = 0;
  state.busts = 0;
  state.biggestTurn = 0;
  overlay.classList.add("hidden");
  render();
  setStatus("YOUR TURN — 按 ROLL 掷骰，风险自选", "ready");
}

function resetGame() {
  clearTimeout(botTimer);
  state.running = false;
  state.over = false;
  state.turn = "player";
  state.playerScore = 0;
  state.botScore = 0;
  state.turnScore = 0;
  state.rollsThisTurn = 0;
  state.lastRoll = 0;
  state.rolls = 0;
  state.holds = 0;
  state.busts = 0;
  state.biggestTurn = 0;
  overlay.classList.add("hidden");
  render();
  setStatus("PRESS START — 按开始后掷骰", "idle");
}

function toggleDifficulty() {
  state.difficulty = state.difficulty === "easy" ? "hard" : "easy";
  const hard = state.difficulty === "hard";
  diffBtn.classList.toggle("on", hard);
  diffBtn.textContent = hard ? "BOT: HARD / 困难" : "BOT: EASY / 简单";
  setStatus(hard
    ? "LEVEL UP — hard bot holds at 15 and chases the win · 困难：15 分保存并追分"
    : "easy bot holds at 10 · 简单：10 分保存", "ready");
  render();
}

function toggleRescue() {
  state.rescue = !state.rescue;
  rescueBtn.classList.toggle("on", state.rescue);
  rescueBtn.textContent = state.rescue ? "RESCUE ON / 救援开" : "RESCUE / 救援";
  clearTimeout(botTimer);
  if (state.rescue) {
    state.turn = "player";
    setStatus("RESCUE MODE — player-only Pig, no bot · 救援：先自己玩", "ready");
  } else {
    setStatus("RESCUE OFF — bot back in the duel · 电脑回归", "ready");
    if (state.running && !state.over && state.turn === "bot") scheduleBotTurn();
  }
  render();
}

// ---- events (theory: what starts this code) ----
startBtn.addEventListener("click", startGame);
rollBtn.addEventListener("click", playerRoll);
holdBtn.addEventListener("click", playerHold);
resetBtn.addEventListener("click", resetGame);
resultReset.addEventListener("click", resetGame);
diffBtn.addEventListener("click", toggleDifficulty);
rescueBtn.addEventListener("click", toggleRescue);
document.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") playerRoll();
  if (e.key === "h" || e.key === "H") playerHold();
});

// ---- initial view ----
targetBox.textContent = TARGET;
render();
setStatus("PRESS START — 按开始后掷骰", "idle");
