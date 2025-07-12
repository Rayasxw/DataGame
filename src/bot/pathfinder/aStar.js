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
