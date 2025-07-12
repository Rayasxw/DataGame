const { getNeighbors, getDistance } = require('../pathfinder/hexUtils');
const { findPath } = require('../pathfinder/aStar');

function selectTargetHex(ant, arena) {
  const enemyHome = arena.homes.find(home => home.player !== ant.player);
  if (!enemyHome || !enemyHome.hexes.some(hex => arena.resources[hex.q]?.[hex.r]?.nectar > 0)) {
    return null;
  }

  const adjacentHexes = enemyHome.hexes
    .flatMap(hex => getNeighbors(hex.q, hex.r))
    .filter(hex => !arena.homes.some(home => home.hexes.some(h => h.q === hex.q && h.r === hex.r)));

  const safeHexes = adjacentHexes.filter(hex => {
    const distanceToCenter = getDistance(hex.q, hex.r, enemyHome.center.q, enemyHome.center.r);
    return distanceToCenter > 2;
  });

  let closestHex = null;
  let minDistance = Infinity;
  for (const hex of safeHexes) {
    const distance = getDistance(ant.q, ant.r, hex.q, hex.r);
    if (distance < minDistance) {
      minDistance = distance;
      closestHex = hex;
    }
  }

  return closestHex;
}

function stealFromAntHill(ant, arena) {
  if (ant.type !== 'scout' || ant.resources.length > 0 || ant.health <= 0) {
    return null;
  }

  const targetHex = selectTargetHex(ant, arena);
  if (!targetHex) {
    return null;
  }

  const path = findPath(
    { q: ant.q, r: ant.r },
    targetHex,
    arena,
    { avoidAcid: true, avoidMud: true, avoidEnemies: true }
  );

  if (!path || path.length === 0) {
    return null;
  }

  const nextHex = path[0];
  return {
    antId: ant.id,
    action: 'move',
    target: { q: nextHex.q, r: nextHex.r }
  };
}

function returnToBase(ant, arena) {
  if (ant.resources.length === 0) {
    return null;
  }

  const ownHome = arena.homes.find(home => home.player === ant.player);
  if (!ownHome) {
    return null;
  }

  const path = findPath(
    { q: ant.q, r: ant.r },
    ownHome.center,
    arena,
    { avoidAcid: true, avoidMud: true, avoidEnemies: true }
  );

  if (!path || path.length === 0) {
    return null;
  }

  const nextHex = path[0];
  return {
    antId: ant.id,
    action: 'move',
    target: { q: nextHex.q, r: nextHex.r }
  };
}

module.exports = { stealFromAntHill, returnToBase };