const hero = document.querySelector("#hero");
const world = document.querySelector("#gameWorld");
const shard = document.getElementById("shard");
const scoreText = document.getElementById("score");
const message = document.getElementById("message");
const walls = document.querySelectorAll(".obstacle");

let x = 40;
let y = 40;
let score = 0;
let hasWon = false;
let shardX = 300;
let shardY = 180;
const speed = 18;

function drawHero() {
  hero.style.transform = `translate(${x}px, ${y}px)`;
}

function isTouchingWall() {
  const heroRect = hero.getBoundingClientRect();
  for (const wall of walls) {
    const wallRect = wall.getBoundingClientRect();
    const hit =
      heroRect.right > wallRect.left &&
      heroRect.left < wallRect.right &&
      heroRect.bottom > wallRect.top &&
      heroRect.top < wallRect.bottom;
    if (hit) return true;
  }
  return false;
}

function keepInsideWorld() {
  const maxX = world.clientWidth - hero.clientWidth;
  const maxY = world.clientHeight - hero.clientHeight;
  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));
}

function checkShardCollection() {
  const distanceX = Math.abs(x - shardX);
  const distanceY = Math.abs(y - shardY);
  if (distanceX < 35 && distanceY < 35) {
    score = score + 1;
    scoreText.textContent = score;
    message.textContent = "Shard collected!";
    shardX = Math.floor(Math.random() * 520);
    shardY = Math.floor(Math.random() * 300);
    shard.style.left = shardX + "px";
    shard.style.top = shardY + "px";
  }
}

function reachedCore() {
  const heroRect = hero.getBoundingClientRect();
  const coreRect = document.querySelector(".goal").getBoundingClientRect();
  return (
    heroRect.right > coreRect.left &&
    heroRect.left < coreRect.right &&
    heroRect.bottom > coreRect.top &&
    heroRect.top < coreRect.bottom
  );
}

function checkWin() {
  if (score >= 5 && reachedCore() && !hasWon) {
    hasWon = true;
    message.textContent = "CORE UNLOCKED — YOU WIN!";
  } else if (reachedCore() && score < 5) {
    message.textContent = "Collect 5 shards first!";
  }
}

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", function () {
  x = 40;
  y = 40;
  score = 0;
  hasWon = false;
  scoreText.textContent = score;
  message.textContent = "Collect 5 shards, then reach CORE!";
  drawHero();
});

document.addEventListener("keydown", function (event) {
  const oldX = x;
  const oldY = y;
  const key = event.key.toLowerCase();

  if (key === "arrowup" || key === "w") y = y - speed;
  else if (key === "arrowdown" || key === "s") y = y + speed;
  else if (key === "arrowleft" || key === "a") x = x - speed;
  else if (key === "arrowright" || key === "d") x = x + speed;
  else return;

  event.preventDefault();
  keepInsideWorld();
  drawHero();
  if (isTouchingWall()) {
    x = oldX;
    y = oldY;
    drawHero();
  }
  checkShardCollection();
  checkWin();
});

drawHero();
