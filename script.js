"use strict";

// ---- variable declarations (theory: variables + timing) ----
const startBtn = document.getElementById("startBtn");
const reactBtn = document.getElementById("reactBtn");
const badge = document.getElementById("badge");
const hint = document.getElementById("hint");
const roundLabel = document.getElementById("roundLabel");
const playerTimeEl = document.getElementById("playerTime");
const botTimeEl = document.getElementById("botTime");
const winnerEl = document.getElementById("winner");
const historyEl = document.getElementById("history");
const playerWinEl = document.getElementById("playerWin");
const botWinEl = document.getElementById("botWin");
const drawCountEl = document.getElementById("drawCount");

let round = 0;
let goTime = 0;          // Date.now() marker captured when GO appears
let ready = false;       // condition guard: true only while signal is GO
let roundRunning = false;
let wins = 0, losses = 0, ties = 0;
let timerId = null;

const TOTAL_ROUNDS = 5;
const ROUND_RESULTS = [];

// random delay helpers (theory: random delay 1.5s - 4s)
function randomDelay() {
  return 1500 + Math.floor(Math.random() * 2500);
}
function botReaction() {
  return Math.floor(Math.random() * 480) + 120; // 120–600 ms
}

// ---- event listeners (theory: events) ----
startBtn.addEventListener("click", startRound);
reactBtn.addEventListener("click", handleReaction);

function setState(label, cls, msg) {
  roundLabel.textContent = "ROUND " + round;
  badge.textContent = label;
  badge.className = "badge " + cls;
  hint.textContent = msg;
}

function startRound() {
  if (round >= TOTAL_ROUNDS || roundRunning) return;

  roundRunning = true;
  ready = false;
  startBtn.disabled = true;
  reactBtn.disabled = false; // enabled so an early click = false start

  round++;
  setState("WAIT...", "wait", "注视屏幕，GO 出现后立即点击");

  const wait = randomDelay(); // setTimeout: start signal after random wait
  timerId = setTimeout(() => {
    goTime = Date.now();      // Date.now(): capture GO instant
    ready = true;
    reactBtn.disabled = false;
    setState("GO!", "go", "点击 CLICK ON GO!");
  }, wait);
}

function handleReaction() {
  clearTimeout(timerId);

  if (!ready) {
    // false start: clicked before GO
    finalize(0, 0, "FALSE");
    setState("FALSE START!", "false", "太早了！按 START 重玩本轮");
    return;
  }

  const player = Date.now() - goTime;   // Date.now(): reaction time in ms
  const bot = botReaction();

  hint.textContent = "反应正常，计算中…";
  finalize(player, bot, "OK");
}

function finalize(player, bot, kind) {
  roundRunning = false;
  reactBtn.disabled = true;
  startBtn.disabled = true;

  if (kind === "FALSE") {
    playerTimeEl.textContent = "犯规";
    botTimeEl.textContent = "--.-- ms";
    winnerEl.textContent = "FALSE START — 本轮作废";
    winnerEl.className = "winner lose";
  } else {
    playerTimeEl.textContent = player.toFixed(2) + " ms";
    botTimeEl.textContent = bot.toFixed(2) + " ms";
    showComparison(player, bot);
  }

  startBtn.disabled = false;
  nextRoundLabel();
}

function showComparison(player, bot) {
  let res, cls;
  if (player < bot) { res = "PLAYER 胜"; cls = "win"; wins++; }
  else if (bot < player) { res = "BOT 胜"; cls = "lose"; losses++; }
  else { res = "平局"; cls = "tie"; ties++; }

  unionRound(res);
  winnerEl.textContent = player.toFixed(2) + " ms vs " + bot.toFixed(2) + " ms → " + res;
  winnerEl.className = "winner " + cls;
}

function nextRoundLabel() {
  if (round >= TOTAL_ROUNDS) {
    setState("GAME OVER", "idle", "最终比分 — 按下方重开");
    startBtn.textContent = "PLAY AGAIN";
    startBtn.onclick = resetGame;
  } else {
    startBtn.textContent = "NEXT ROUND";
  }
}

function unionRound(outcome) {
  const code = outcome.includes("PLAYER") ? "W" : outcome.includes("BOT") ? "L" : "T";
  ROUND_RESULTS.push(code);
  const dot = document.createElement("span");
  dot.className = "dot " + (code === "W" ? "win" : code === "L" ? "lose" : "tie");
  dot.textContent = code;
  historyEl.appendChild(dot);
  playerWinEl.textContent = wins;
  botWinEl.textContent = losses;
  drawCountEl.textContent = ties;
}

function resetGame() {
  round = 0; wins = 0; losses = 0; ties = 0;
  ROUND_RESULTS.length = 0;
  historyEl.innerHTML = "";
  playerWinEl.textContent = "0";
  botWinEl.textContent = "0";
  drawCountEl.textContent = "0";
  playerTimeEl.textContent = "--.-- ms";
  botTimeEl.textContent = "--.-- ms";
  winnerEl.textContent = "ROUND READY";
  winnerEl.className = "winner";
  reactBtn.disabled = true;
  startBtn.textContent = "START / 开始";
  startBtn.onclick = null;
  roundLabel.textContent = "ROUND 1";
  badge.className = "badge idle";
  badge.textContent = "WAITING";
  hint.textContent = "按下 START 等待 GO";
}

resetGame();