const canvas = document.getElementById('arenaCanvas');
const ctx = canvas.getContext('2d');

const HEX_SIZE = 30; // размер шестиугольника
const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
const HEX_HEIGHT = 2 * HEX_SIZE;

function hexToPixel(q, r) {
  const x = HEX_WIDTH * (q + r / 2);
  const y = HEX_HEIGHT * (3 / 4) * r;
  return { x, y };
}

function drawHex(q, r, color) {
  const { x, y } = hexToPixel(q, r);

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i;
    const px = x + HEX_SIZE * Math.cos(angle);
    const py = y + HEX_SIZE * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#555';
  ctx.stroke();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawArena(arena) {
  clearCanvas();

  // Рисуем карту (terrain)
  for (const tile of arena.map) {
    // tile.type - число (например 0=земля, 5=стена)
    let color = '#d3d3d3';
    if (tile.type === 5) color = '#333'; // стена - тёмно-серый
    drawHex(tile.q, tile.r, color);
  }

  // Рисуем еду
  for (const food of arena.food) {
    drawHex(food.q, food.r, 'green');
  }

  // Рисуем муравьёв
  for (const ant of arena.ants) {
    let color = 'blue'; // рабочие
    if (ant.type === 1) color = 'red';   // воины, например
    drawHex(ant.q, ant.r, color);

    // подпись с id
    const { x, y } = hexToPixel(ant.q, ant.r);
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(ant.id, x - HEX_SIZE / 2, y + 4);
  }
}

async function fetchArenaData() {
  try {
    const res = await fetch('arena.json', { cache: "no-store" });
    if (!res.ok) throw new Error('Ошибка загрузки arena.json');
    const arena = await res.json();
    return arena;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function loop() {
  const arena = await fetchArenaData();
  if (arena) {
    drawArena(arena);
  }
  setTimeout(loop, 2500);
}

loop();
