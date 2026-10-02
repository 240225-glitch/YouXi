"use strict";

/* L12 — Word Scramble Bot
   代码颜色 / colour legend: GREEN = comments & explanations, CYAN/BLUE/PURPLE/WHITE = executable code
   THEORY: HTML page pieces · CSS look · JavaScript game brain · DOM live page it can change */

// ---- STEP 1: DOM refs (the page pieces the player sees) ----
const statusEl = document.getElementById("status");
const roundBox = document.getElementById("roundBox");
const playerScoreBox = document.getElementById("playerScoreBox");
const botScoreBox = document.getElementById("botScoreBox");
const timeBox = document.getElementById("timeBox");
const timerBar = document.getElementById("timerBar");
const clueBox = document.getElementById("clueBox");
const scrambleBox = document.getElementById("scrambleBox");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const hintBtn = document.getElementById("hintBtn");
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

// ---- STEP 2: the word list (small list first, easy to grow) ----
const WORDS = [
  { word: "planet",  clue: "A world that travels around a star / 围绕恒星运行的天体" },
  { word: "keyboard", clue: "You press it to type / 你用它打字" },
  { word: "dragon",  clue: "A fire-breathing flying creature / 会喷火的飞行生物" },
  { word: "guitar",  clue: "Six strings you strum / 六根弦的乐器" },
  { word: "monkey",  clue: "A tail-loving banana eater / 爱吃香蕉的动物" },
  { word: "rocket",  clue: "It flies into space / 它飞向太空" },
  { word: "puzzle",  clue: "A problem you solve / 需要动脑筋解决的题目" },
  { word: "winter",  clue: "The coldest season / 最冷的季节" },
  { word: "bridge",  clue: "It crosses a river / 它横跨河流" },
  { word: "coffee",  clue: "A dark morning drink / 清晨的深色饮品" },
  { word: "garden",  clue: "Where flowers grow / 花儿生长的地方" },
  { word: "island",  clue: "Land with water all around / 四面环水的陆地" },
];

const RESCUE_WORD = { word: "scramble", clue: "RESCUE: this is the fixed warm-up word / 救援：固定的热身词" };

const WIN_SCORE = 5;        // STEP 4: first to 5 points wins the match
const HINT_COST = 3;        // LEVEL UP: the hint price
const BOT_SECONDS = { easy: 20, hard: 10 };   // STEP 4: bot pressure per difficulty
const TICK_MS = 100;

// ---- STEP 1: game-state variables (变量 stores the changing game state) ----
const state = {
  round: 0,
  playerScore: 0,
  botScore: 0,
  timeLeft: 0,          // seconds left before the bot wins the round
  timeMax: BOT_SECONDS.easy,
  answer: "",           // the real word
  scrambled: "",        // the jumbled letters on screen
  hintUsed: false,
  difficulty: "easy",
  rescue: false,        // RESCUE: one fixed word, no timer pressure
  running: false,
  over: false,
  solved: 0,
  wrongTries: 0,
  timeouts: 0,
  hints: 0,
  playerWins: 0,
  botWins: 0,
  lastRoundResult: "",
};

let tickTimer = null;

// ---- STEP 2: first visible win — shuffle the letters of a word ----
function scrambleWord(word) {
  const letters = word.split("");
  let out = word;
  for (let tries = 0; tries < 30 && out === word; tries++) {   // condition: never show the real word
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));           // swap two random letters
      const tmp = letters[i];
      letters[i] = letters[j];
      letters[j] = tmp;
    }
    out = letters.join("");
  }
  return out;
}

function pickWord() {
  if (state.rescue) return RESCUE_WORD;               // RESCUE: one fixed scrambled word
  let choice = WORDS[Math.floor(Math.random() * WORDS.length)];
  if (choice.word === state.answer && WORDS.length > 1) {   // avoid back-to-back repeats
    choice = WORDS[(WORDS.indexOf(choice) + 1) % WORDS.length];
  }
  return choice;
}

function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.className = "status " + (cls || "idle");
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---- STEP 3: normalize input so capital letters never lose a round ----
function normalize(text) {
  return String(text).trim().toLowerCase().replace(/\s+/g, "");
}

function isCorrect(guess) {
  return normalize(guess) === normalize(state.answer);   // condition: right answer?
}

// ---- rendering the DOM while the game runs ----
function render() {
  roundBox.textContent = state.round;
  playerScoreBox.textContent = state.playerScore;
  botScoreBox.textContent = state.botScore;

  const active = state.running && !state.over;
  if (state.rescue) {
    timeBox.textContent = "∞";
    timerBar.className = "timerbar full";
  } else {
    timeBox.textContent = active ? Math.ceil(state.timeLeft) : "–";
    const pct = Math.max(0, (state.timeLeft / state.timeMax) * 100);
    timerBar.style.width = pct + "%";
    timerBar.className = "timerbar" + (state.timeLeft <= 3 ? " low" : "");
  }

  answerInput.disabled = !active;
  submitBtn.disabled = !active;
  hintBtn.disabled = !active || state.hintUsed || state.playerScore < HINT_COST;
  startBtn.disabled = active;
  diffBtn.disabled = active;
  rescueBtn.disabled = active;
  document.querySelector(".score.you").classList.toggle("lead", active && state.playerScore >= state.botScore);
  document.querySelector(".score.bot").classList.toggle("lead", active && state.botScore > state.playerScore);
  document.querySelector(".score.clock").classList.toggle("hot", active && !state.rescue && state.timeLeft <= 3);
}

function showClue(entry) {
  clueBox.innerHTML = "CLUE / 提示: <b>" + escapeHtml(entry.clue) + "</b>";
  scrambleBox.textContent = state.scrambled.split("").join(" ");
  scrambleBox.classList.remove("reshuffle");
  void scrambleBox.offsetWidth;
  scrambleBox.classList.add("reshuffle");
}

// ---- STEP 2: a new round begins — pick, shuffle, show, start the clock ----
function startRound() {
  const entry = pickWord();
  state.round++;
  state.answer = entry.word;
  state.scrambled = scrambleWord(entry.word);
  state.hintUsed = false;
  state.timeMax = BOT_SECONDS[state.difficulty];
  state.timeLeft = state.timeMax;
  answerInput.value = "";
  showClue(entry);
  render();
  setStatus("SOLVE IT — 解出 " + state.round + " 号单词，别让电脑计时器跑完", "ready");
  answerInput.focus();
}

function stopClock() {
  clearInterval(tickTimer);
  tickTimer = null;
}

// ---- STEP 4: the clock ticks; at 0 the bot wins the round ----
function startClock() {
  stopClock();
  tickTimer = setInterval(() => {
    if (!state.running || state.over || state.rescue) return;
    state.timeLeft = Math.max(0, Math.round((state.timeLeft - TICK_MS / 1000) * 10) / 10);
    render();
    if (state.timeLeft <= 0) botStealsRound();
  }, TICK_MS);
}

function botStealsRound() {
  stopClock();
  state.botScore++;
  state.timeouts++;
  state.lastRoundResult = "timeout";
  render();
  setStatus("BOT SCORES! Time hit 0 — 电脑得分，计时归零", "error");
  afterRound("bot");
}

function playerScoresRound() {
  state.lastRoundResult = "solved";
  render();
  setStatus("CORRECT! +" + lastGain + " points — 答对了", "good");
  afterRound("player");
}

let lastGain = 0;

function afterRound(winner) {
  if (state.playerScore >= WIN_SCORE || state.botScore >= WIN_SCORE) {
    endMatch(state.playerScore >= WIN_SCORE ? "player" : "bot");
    return;
  }
  state.running = false;
  render();
  startBtn.disabled = false;
  startBtn.textContent = "NEXT WORD / 下一词";
  answerInput.blur();
}

// ---- STEP 3: the player submits an answer ----
function submitAnswer() {
  if (!state.running || state.over) return;
  const guess = answerInput.value;
  if (normalize(guess) === "") {
    setStatus("TYPE A WORD FIRST — 先输入单词", "error");
    return;
  }
  if (isCorrect(guess)) {
    lastGain = state.timeLeft > state.timeMax / 2 ? 2 : 1;   // condition: solve fast = 2 points, late = 1
    state.playerScore += lastGain;
    state.solved++;
    playerScoresRound();
    return;
  }
  state.wrongTries++;
  setStatus("NOT QUITE — “" + guess.trim() + "” 还不对，再试", "error");
  answerInput.select();
}

// ---- LEVEL UP: a hint that costs points ----
function useHint() {
  if (!state.running || state.over || state.hintUsed) return;
  if (state.playerScore < HINT_COST) {
    setStatus("NEED " + HINT_COST + " POINTS FOR A HINT — 提示需要 " + HINT_COST + " 分", "error");
    return;
  }
  state.hintUsed = true;
  state.hints++;
  state.playerScore -= HINT_COST;
  const first = state.answer.charAt(0);
  setStatus("HINT — first letter is “" + first.toUpperCase() + "” · -" + HINT_COST + " 分", "done");
  render();
  answerInput.focus();
}

// ---- win / lose ----
function endMatch(winner) {
  if (state.over) return;
  state.over = true;
  state.running = false;
  stopClock();
  render();
  startBtn.disabled = true;
  answerInput.disabled = true;
  submitBtn.disabled = true;
  hintBtn.disabled = true;

  const player = nameInput.value.trim() || "Player";
  const kl = classInput.value.trim();
  if (winner === "player") state.playerWins++;
  else state.botWins++;

  const detail =
    "Player: <b>" + escapeHtml(player) + "</b>" + (kl ? " (" + escapeHtml(kl) + ")" : "") + "<br>" +
    "Final — YOU <b>" + state.playerScore + "</b> · BOT <b>" + state.botScore + "</b> (first to " + WIN_SCORE + ")<br>" +
    "Solved <b>" + state.solved + "</b> · Wrong tries <b>" + state.wrongTries + "</b> · Timeouts <b>" + state.timeouts + "</b> · Hints <b>" + state.hints + "</b><br>" +
    "Session — you <b>" + state.playerWins + "</b> · bot <b>" + state.botWins + "</b>";

  if (winner === "player") {
    setStatus("YOU WIN! First to " + WIN_SCORE + " — 你赢了", "good");
    showResult("\ud83c\udfc6", "YOU WIN! / 你赢了", detail, "win");
  } else {
    setStatus("BOT WINS — 电脑先到 " + WIN_SCORE + " 分", "error");
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
  if (state.running || state.over) return;
  startRound();
  state.running = true;
  startBtn.textContent = "ROUND " + state.round;
  startClock();
  render();
}

function resetGame() {
  stopClock();
  state.round = 0;
  state.playerScore = 0;
  state.botScore = 0;
  state.timeLeft = 0;
  state.answer = "";
  state.scrambled = "";
  state.hintUsed = false;
  state.running = false;
  state.over = false;
  state.solved = 0;
  state.wrongTries = 0;
  state.timeouts = 0;
  state.hints = 0;
  state.lastRoundResult = "";
  overlay.classList.add("hidden");
  answerInput.value = "";
  clueBox.textContent = "CLUE / 提示词 will appear here";
  scrambleBox.textContent = "— — —";
  startBtn.textContent = "START / 开始";
  render();
  setStatus("PRESS START — 按开始后打乱单词", "idle");
}

function toggleDifficulty() {
  if (state.running) return;
  state.difficulty = state.difficulty === "easy" ? "hard" : "easy";
  const hard = state.difficulty === "hard";
  diffBtn.classList.toggle("on", hard);
  diffBtn.textContent = hard ? "BOT: HARD / 困难" : "BOT: EASY / 简单";
  state.timeMax = BOT_SECONDS[state.difficulty];
  state.timeLeft = state.timeMax;
  render();
  setStatus(hard
    ? "LEVEL UP — hard bot only gives you " + BOT_SECONDS.hard + " s · 困难：只有 " + BOT_SECONDS.hard + " 秒"
    : "easy bot gives you " + BOT_SECONDS.easy + " s · 简单：" + BOT_SECONDS.easy + " 秒", "ready");
}

function toggleRescue() {
  if (state.running) return;
  state.rescue = !state.rescue;
  rescueBtn.classList.toggle("on", state.rescue);
  rescueBtn.textContent = state.rescue ? "RESCUE ON / 救援开" : "RESCUE / 救援";
  setStatus(state.rescue
    ? "RESCUE MODE — one fixed word, no timer · 救援：固定单词，不计时"
    : "RESCUE OFF — back to the random word list · 电脑回归", "ready");
  render();
}

// ---- events (theory: what starts this code) ----
startBtn.addEventListener("click", startGame);
submitBtn.addEventListener("click", submitAnswer);
hintBtn.addEventListener("click", useHint);
resetBtn.addEventListener("click", resetGame);
resultReset.addEventListener("click", resetGame);
diffBtn.addEventListener("click", toggleDifficulty);
rescueBtn.addEventListener("click", toggleRescue);
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitAnswer();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "h" || e.key === "H") {
    if (document.activeElement !== answerInput) useHint();
  }
});

// ---- initial view ----
render();
setStatus("PRESS START — 按开始后打乱单词", "idle");
