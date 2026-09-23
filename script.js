"use strict";

// ---- constants (theory: arrays) ----
const SYMBOLS = ["🍎", "🚀", "🎲", "🎮", "🧠", "🎯", "🌟", "🦖"];
const TOTAL_PAIRS = SYMBOLS.length;

// ---- DOM refs ----
const gridEl = document.getElementById("grid");
const statusEl = document.getElementById("status");
const playerScoreEl = document.getElementById("playerScore");
const botScoreEl = document.getElementById("botScore");
const pairsLeftEl = document.getElementById("pairsLeft");
const resetBtn = document.getElementById("resetBtn");
const overlay = document.getElementById("winnerOverlay");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultDetail = document.getElementById("resultDetail");
const resultReset = document.getElementById("resultReset");

// ---- game state (theory: state remembers selections) ----
const state = {
  deck: [],          // array of hidden card values
  flip: [],          // symbol currently shown, null = hidden
  matched: [],       // true when pair is claimed
  first: -1,         // index of first selected card
  second: -1,        // index of second selected card
  lock: false,       // guards clicks during animations / bot turn
  turn: "player",    // "player" | "bot"
  playerScore: 0,
  botScore: 0,
  matches: 0,        // number of claimed pairs
  over: false,
};

// ---- bot memory (Level Up: remembers revealed symbols) ----
const botSeen = new Map(); // symbol -> [indices known but unclaimed]

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck() {
  return shuffle([...SYMBOLS, ...SYMBOLS]);
}

function renderGrid() {
  gridEl.innerHTML = "";
  for (let i = 0; i < state.deck.length; i++) {
    const card = document.createElement("button");
    card.className = "card";
    card.id = "card-" + i;
    card.setAttribute("aria-label", "card " + i);

    const inner = document.createElement("span");
    inner.className = "card-inner";

    const back = document.createElement("span");
    back.className = "face back";

    const front = document.createElement("span");
    front.className = "face front";
    front.innerHTML = '<span class="symbol">' + state.deck[i] + "</span>";

    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);
    card.addEventListener("click", () => clickCard(i));
    gridEl.appendChild(card);
  }
}

function forEachCard(fn) {
  for (let i = 0; i < state.deck.length; i++) fn(i);
}

function setFlipped(i, on) {
  const card = document.getElementById("card-" + i);
  if (on) {
    card.classList.add("flipped");
    state.flip[i] = state.deck[i];
  } else {
    card.classList.remove("flipped");
    card.classList.remove("revealed-bot");
    state.flip[i] = null;
  }
}

function markMatched(i) {
  const card = document.getElementById("card-" + i);
  card.classList.add("flipped", "matched");
  card.disabled = true;
  state.matched[i] = true;
  state.flip[i] = state.deck[i];
}

function clearBotMemory(i) {
  for (const [sym, arr] of botSeen) {
    const k = arr.indexOf(i);
    if (k !== -1) arr.splice(k, 1);
    if (arr.length === 0) botSeen.delete(sym);
  }
}

function remember(i) {
  const sym = state.deck[i];
  if (!botSeen.has(sym)) botSeen.set(sym, []);
  if (botSeen.get(sym).indexOf(i) === -1) botSeen.get(sym).push(i);
}

function setStatus(text, cls) {
  statusEl.textContent = text;
  statusEl.className = "status " + (cls || "player-turn");
}

function updateScoreboard() {
  playerScoreEl.textContent = state.playerScore;
  botScoreEl.textContent = state.botScore;
  pairsLeftEl.textContent = TOTAL_PAIRS - state.matches;
}

function showResult(icon, title, detail, cls) {
  resultIcon.textContent = icon;
  resultTitle.textContent = title;
  resultTitle.className = "result-title " + cls;
  resultDetail.textContent = detail;
  overlay.classList.remove("hidden");
}

function checkGameOver() {
  if (state.matches === TOTAL_PAIRS) {
    state.over = true;
    const p = state.playerScore;
    const b = state.botScore;
    if (p > b) showResult("🏆", "PLAYER WINS!", "You matched " + p + " pairs. The bot got " + b + ".", "win");
    else if (b > p) showResult("🤖", "BOT WINS!", "The bot matched " + b + " pairs. You got " + p + ".", "lose");
    else showResult("🤝", "TIE GAME!", "You both matched " + p + " pairs.", "tie");
    updateScoreboard();
    return true;
  }
  return false;
}

// ---- player path ----
function clickCard(i) {
  if (state.over || state.turn !== "player" || state.lock) return;
  if (state.matched[i] || state.flip[i] !== null) return;
  if (i === state.first) return; // same-card click guard

  setFlipped(i, true);
  remember(i);

  if (state.first === -1) {
    state.first = i;
    return;
  }

  state.second = i;
  state.lock = true;
  setStatus("CHECKING...");
  setTimeout(() => resolvePair(true), 420);
}

function resolvePair(player) {
  const a = state.first;
  const b = state.second;
  state.first = -1;
  state.second = -1;

  // ---- match check ----
  if (state.deck[a] === state.deck[b]) {
    claimMatch(a, b, player);
  } else {
    setStatus(player ? "PLAYER TURN — 不匹配！" : "BOT TURN — 没有配对");
    setTimeout(() => {
      setFlipped(a, false);
      setFlipped(b, false);
      if (player) startBotTurn();
      else startPlayerTurn();
    }, 620);
  }
}

function claimMatch(a, b, player) {
  markMatched(a);
  markMatched(b);
  clearBotMemory(a);
  clearBotMemory(b);
  state.matches++;
  if (player) {
    state.playerScore++;
    setStatus("PLAYER 配对成功 +1!");
  } else {
    state.botScore++;
    setStatus("BOT 配对成功 +1!", "bot-turn");
  }
  updateScoreboard();
  if (checkGameOver()) {
    state.lock = true;
    return;
  }
  state.lock = false;
  if (player) startBotTurn();
  else startPlayerTurn();
}

function startBotTurn() {
  state.turn = "bot";
  setStatus("BOT TURN — 电脑思考中...", "bot-turn");
  setTimeout(botMove, 700);
}

function startPlayerTurn() {
  state.turn = "player";
  state.lock = false;
  setStatus("PLAYER TURN — 翻开两张卡配对");
}

// ---- bot path ----
function unmatchedIndices() {
  const out = [];
  for (let i = 0; i < state.deck.length; i++) if (!state.matched[i]) out.push(i);
  return out;
}

function knownPair() {
  for (const sym of botSeen.keys()) {
    const arr = botSeen.get(sym).filter((i) => !state.matched[i]);
    if (arr.length >= 2) return [arr[0], arr[1]];
  }
  return null;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function botMove() {
  if (state.over) return;

  const know = knownPair();
  if (know) {
    const a = know[0];
    const b = know[1];
    state.first = a;
    state.second = b;
    setFlipped(a, true);
    setFlipped(b, true);
    document.getElementById("card-" + a).classList.add("revealed-bot");
    document.getElementById("card-" + b).classList.add("revealed-bot");
    setTimeout(() => resolvePair(false), 650);
    return;
  }

  const unknown = unmatchedIndices().filter((i) => !seenIndexed(i));
  let pool = unknown.length >= 2 ? unknown : unmatchedIndices();
  let a = pickRandom(pool);
  let b = pickRandom(pool.filter((x) => x !== a));
  if (b === undefined) b = pickRandom(unmatchedIndices().filter((x) => x !== a));
  state.first = a;
  state.second = b;

  setFlipped(a, true);
  setFlipped(b, true);
  remember(a);
  remember(b);
  document.getElementById("card-" + a).classList.add("revealed-bot");
  document.getElementById("card-" + b).classList.add("revealed-bot");
  setTimeout(() => resolvePair(false), 650);
}

function seenIndexed(i) {
  return botSeen.get(state.deck[i]) && botSeen.get(state.deck[i]).indexOf(i) !== -1;
}

// ---- controls ----
function resetGame() {
  state.deck = buildDeck();
  state.flip = new Array(state.deck.length).fill(null);
  state.matched = new Array(state.deck.length).fill(false);
  state.first = -1;
  state.second = -1;
  state.lock = false;
  state.turn = "player";
  state.playerScore = 0;
  state.botScore = 0;
  state.matches = 0;
  state.over = false;
  botSeen.clear();
  overlay.classList.add("hidden");
  renderGrid();
  setStatus("PLAYER TURN — 翻开两张卡配对");
  updateScoreboard();
}

resetBtn.addEventListener("click", resetGame);
resultReset.addEventListener("click", resetGame);

resetGame();