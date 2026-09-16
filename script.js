const hero = document.querySelector("#hero");
const world = document.querySelector("#gameWorld");

let x = 40;
let y = 40;
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
});

drawHero();
