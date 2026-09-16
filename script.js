const hero = document.querySelector("#hero");
const world = document.querySelector("#gameWorld");
const shard = document.getElementById("shard");
const scoreText = document.getElementById("score");
const message = document.getElementById("message");

let x = 40;
let y = 40;
let score = 0;
let shardX = 300;
let shardY = 180;
const speed = 18;

function drawHero() {
  hero.style.transform = `translate(${x}px, ${y}px)`;
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
    if (score >= 5) {
      message.textContent = "YOU WIN — core powered!";
    }
  }
}

document.addEventListener("keydown", function (event) {
  const key = event.key.toLowerCase();

  if (key === "arrowup" || key === "w") y = y - speed;
  else if (key === "arrowdown" || key === "s") y = y + speed;
  else if (key === "arrowleft" || key === "a") x = x - speed;
  else if (key === "arrowright" || key === "d") x = x + speed;
  else return;

  event.preventDefault();
  keepInsideWorld();
  drawHero();
  checkShardCollection();
});

drawHero();
