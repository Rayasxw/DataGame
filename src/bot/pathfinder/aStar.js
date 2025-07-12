function hexDistance(a, b) {
  const dq = Math.abs(a.q - b.q);
  const dr = Math.abs(a.r - b.r);
  const ds = Math.abs((-a.q - a.r) - (-b.q - b.r));
  return Math.max(dq, dr, ds);
}

function getNeighbors(pos) {
  const directions = [
    { q: +1, r: 0 }, { q: -1, r: 0 },
    { q: 0, r: +1 }, { q: 0, r: -1 },
    { q: +1, r: -1 }, { q: -1, r: +1 }
  ];
  return directions.map(d => ({ q: pos.q + d.q, r: pos.r + d.r }));
}

function findPath(start, goal, map) {
  const toKey = (p) => `${p.q},${p.r}`;
  const tileMap = new Map(map.map(t => [toKey(t), t]));

  const openSet = new Map();
  openSet.set(toKey(start), { pos: start, g: 0, f: hexDistance(start, goal), cameFrom: null });
  const closedSet = new Set();

  while (openSet.size > 0) {
    const current = [...openSet.values()].reduce((a, b) => a.f < b.f ? a : b);
    const currentKey = toKey(current.pos);

    if (current.pos.q === goal.q && current.pos.r === goal.r) {
      const path = [];
      let node = current;
      while (node.cameFrom) {
        path.unshift(node.pos);
        node = node.cameFrom;
      }
      return path;
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    for (const neighbor of getNeighbors(current.pos)) {
      const nKey = toKey(neighbor);
      if (closedSet.has(nKey)) continue;

      const tile = tileMap.get(nKey);
      if (!tile || tile.type === 5) continue; 

      const tentativeG = current.g + tile.cost;
      if (!openSet.has(nKey) || tentativeG < openSet.get(nKey).g) {
        openSet.set(nKey, {
          pos: neighbor,
          g: tentativeG,
          f: tentativeG + hexDistance(neighbor, goal),
          cameFrom: current
        });
      }
    }
  }

  return [];
}

module.exports = { findPath, hexDistance };



const { getNeighborsSteal, hexDistanceSteal } = require('./hexUtils');
const { Heap } = require('heap-js');

function findPathSteal(start, goal, arena, options = {}) {
  const toKey = (p) => `${p.q},${p.r}`;

  const getTileCost = (q, r) => {
    const terrainType = arena.terrain[q]?.[r];
    return terrainType === 'mud' ? 2 : 1;
  };

  const openSet = new Heap((a, b) => a.f - b.f);
  openSet.push({ pos: start, g: 0, f: hexDistanceSteal(start.q, start.r, goal.q, goal.r), cameFrom: null });
  
  const closedSet = new Set();
  const gScore = new Map();
  const fScore = new Map();
  gScore.set(toKey(start), 0);
  fScore.set(toKey(start), hexDistanceSteal(start.q, start.r, goal.q, goal.r));

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    const currentKey = toKey(current.pos);

    if (current.pos.q === goal.q && current.pos.r === goal.r) {
      const path = [];
      let node = current;
      while (node.cameFrom) {
        path.unshift(node.pos);
        node = node.cameFrom;
      }
      return path;
    }

    closedSet.add(currentKey);

    for (const neighbor of getNeighborsSteal(current.pos.q, current.pos.r)) {
      const nKey = toKey(neighbor);

      if (closedSet.has(nKey)) continue;

      if (
        neighbor.q < 0 || neighbor.q > 6 || neighbor.r < 0 || neighbor.r > 6 ||
        (options.avoidAcid && arena.terrain[neighbor.q]?.[neighbor.r] === 'acid') ||
        (options.avoidMud && arena.terrain[neighbor.q]?.[neighbor.r] === 'mud') ||
        (options.avoidEnemies && arena.ants.some(ant => ant.q === neighbor.q && ant.r === neighbor.r && ant.player !== arena.player))
      ) {
        continue;
      }

      const tileCost = getTileCost(neighbor.q, neighbor.r);
      const tentativeG = current.g + tileCost;

      if (!gScore.has(nKey) || tentativeG < gScore.get(nKey)) {
        gScore.set(nKey, tentativeG);
        fScore.set(nKey, tentativeG + hexDistanceSteal(neighbor.q, neighbor.r, goal.q, goal.r));
        openSet.push({
          pos: neighbor,
          g: tentativeG,
          f: tentativeG + hexDistanceSteal(neighbor.q, neighbor.r, goal.q, goal.r),
          cameFrom: current
        });
      }
    }
  }

  return [];
}

module.exports = { findPathSteal }
