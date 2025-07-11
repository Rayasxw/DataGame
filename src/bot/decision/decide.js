const { collect } = require('./collect');

function decideActions(arena) {
  const moves = [];

  for (const ant of arena.ants) {
    const move = collect(ant, arena);
    if (move) moves.push(move);
  }

  return moves;
}

module.exports = { decideActions };
