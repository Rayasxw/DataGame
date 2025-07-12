// src/bot/loop.js
const { getArena } = require('../api/arena');
const { sendMove } = require('../api/move');
const { stealFromAntHill, returnToBase } = require('./decision/steal');
const { delay } = require('../utils/delay');

async function botLoop() {
  while (true) {
    const arena = await getArena();
    if (!arena || !arena.ants) {
      console.log('⚠️ Арена недоступна');
      await delay(2500);
      continue;
    }

    console.log(`📦 Ход #${arena.turnNo} | Муравьёв: ${arena.ants.length} | Очки: ${arena.score}`);

    const moves = [];
    for (const ant of arena.ants) {
      if (ant.player !== arena.player) continue; 

      let move = null;
      if (ant.resources.length > 0) {
        move = returnToBase(ant, arena);
      } else {
        move = stealFromAntHill(ant, arena);
      }

      if (move) {
        moves.push(move);
      }
    }

    if (moves.length > 0) {
      await sendMove(moves);
    }

    await delay(2500);
  }
}

module.exports = { botLoop };