const { findPath, hexDistance } = require('../pathfinder/aStar');

function collect(ant, arena) {
  if (ant.type !== 0) return null; 

  const foodTargets = arena.food
    .map(f => ({ ...f, dist: hexDistance(ant, f) }))
    .sort((a, b) => a.dist - b.dist);

  for (const food of foodTargets) {
    const path = findPath(ant, food, arena.map);
    if (path.length > 0) {
      return {
        ant: ant.id,
        path
      };
    }
  }

  return null;
}

module.exports = { collect };
