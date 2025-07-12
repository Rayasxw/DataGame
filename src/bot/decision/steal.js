// src/bot/decision/steal.js
const { getNeighborsSteal, hexDistanceSteal } = require('../pathfinder/hexUtils');
const { findPathSteal } = require('../pathfinder/aStar');

function selectTargetHex(ant, arena) {
  const enemyHome = arena.homes.find(home => home.player !== ant.player);
  if (!enemyHome || !enemyHome.hexes.some(hex => arena.resources[hex.q]?.[hex.r]?.nectar > 0)) {
    return null;
  }

  const adjacentHexes = enemyHome.hexes
    .flatMap(hex => getNeighborsSteal(hex.q, hex.r))
    .filter(hex => !arena.homes.some(home => home.hexes.some(h => h.q === hex.q && h.r === hex.r)));

  const safeHexes = adjacentHexes.filter(hex => {
    const distanceToCenter = hexDistanceSteal(hex.q, hex.r, enemyHome.center.q, enemyHome.center.r);
    return distanceToCenter > 2;
  });

  let closestHex = null;
  let minDistance = Infinity;
  for (const hex of safeHexes) {
    const distance = hexDistanceSteal(ant.q, ant.r, hex.q, hex.r);
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

  const path = findPathSteal(
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

  const path = findPathSteal(
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