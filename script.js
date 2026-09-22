"use strict";

// ---- DOM refs ----
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const clueText = document.getElementById("clueText");
const moodText = document.getElementById("moodText");
const moodIcon = document.getElementById("moodIcon");
const secretDisplay = document.getElementById("secretDisplay");
const attemptsEl = document.getElementById("attempts");
const remainingEl = document.getElementById("remaining");
const playerWinEl = document.getElementById("playerWin");
const botWinEl = document.getElementById("botWin");
const resetBtn = document.getElementById("resetBtn");
const overlay = document.getElementById("resultOverlay");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultDetail = document.getElementById("resultDetail");
const resultReset = document.getElementById("resultReset");

// ---- game state (theory: variables) ----
const MAX_ATTEMPTS = 7;
let secret = 0;
let attempts = 0;
let gameOver = false;
let totalPlayerWins = 0;
let totalBotWins = 0;

// ---- mood messages (Level Up feature) ----
const MOODS = {
  confident: { icon: "😎", text: "You'll never guess it. I'm invincible!" },
  nervous:   { icon: "😰", text: "Wait... are you getting closer?" },
  shocked:   { icon: "😱", text: "How did you know that?!" },
  defeated:  { icon: "🫡", text: "Well played, human. I concede." },
};

// ---- core logic ----
function generateSecret() {
  return Math.floor(Math.random() * 50) + 1; // Math.random(): 1–50
}

function setClue(text, cls) {
  clueText.textContent = text;
  clueText.className = "clue-text " + cls;
}

function setMood(mood) {
  moodIcon.textContent = MOODS[mood].icon;
  moodText.textContent = MOODS[mood].text;
}

function updateStats() {
  attemptsEl.textContent = attempts + " / " + MAX_ATTEMPTS;
  remainingEl.textContent = Math.max(0, MAX_ATTEMPTS - attempts);
}

function endGame(playerWins) {
  gameOver = true;
  guessInput.disabled = true;
  guessBtn.disabled = true;
  secretDisplay.textContent = secret;

  if (playerWins) {
    totalPlayerWins++;
    setClue("YOU GOT IT! The secret number is " + secret + "!", "correct");
    setMood("defeated");
    showResult("🏆", "YOU WIN!", "Guessed in " + attempts + " attempt" + (attempts > 1 ? "s" : "") + ". Bot is defeated.", "win");
  } else {
    totalBotWins++;
    setClue("OUT OF ATTEMPTS! The number was " + secret + ".", "fail");
    setMood("confident");
    showResult("🤖", "BOT WINS!", "The secret number was " + secret + ". You used all " + MAX_ATTEMPTS + " guesses.", "lose");
  }

  playerWinEl.textContent = totalPlayerWins;
  botWinEl.textContent = totalBotWins;
}

function showResult(icon, title, detail, cls) {
  resultIcon.textContent = icon;
  resultTitle.textContent = title;
  resultTitle.className = "result-title " + cls;
  resultDetail.textContent = detail;
  overlay.classList.remove("hidden");
}

function handleGuess() {
  if (gameOver) return;

  const value = parseInt(guessInput.value, 10);
  if (isNaN(value) || value < 1 || value > 50) {
    setClue("Enter a valid number between 1 and 50.", "fail");
    return;
  }

  attempts++;
  updateStats();

  // if/else: compare guess to secret
  if (value === secret) {
    endGame(true);
    return;
  }

  if (value < secret) {
    setClue("TOO LOW ↑  Try a higher number.", "too-low");
  } else {
    setClue("TOO HIGH ↓  Try a lower number.", "too-high");
  }

  // update mood based on remaining attempts
  if (attempts <= 2) {
    setMood("confident");
  } else if (attempts <= 5) {
    setMood("nervous");
  } else {
    setMood("shocked");
  }

  // attempt counter: computer wins when out of guesses
  if (attempts >= MAX_ATTEMPTS) {
    endGame(false);
    return;
  }

  guessInput.value = "";
  guessInput.focus();
}

function resetGame() {
  secret = generateSecret();
  attempts = 0;
  gameOver = false;
  guessInput.disabled = false;
  guessInput.value = "";
  guessInput.focus();
  guessBtn.disabled = false;
  secretDisplay.textContent = "?";
  setClue("Enter your first guess above", "");
  setMood("confident");
  updateStats();
  overlay.classList.add("hidden");
}

// ---- event listeners (theory: events) ----
guessBtn.addEventListener("click", handleGuess);
resetBtn.addEventListener("click", resetGame);
resultReset.addEventListener("click", resetGame);
guessInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleGuess();
});

// ---- init ----
resetGame();