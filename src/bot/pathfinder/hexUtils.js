function getNeighborsSteal(q, r) {
  const directions = [
    { q: +1, r: 0 }, { q: -1, r: 0 },
    { q: 0, r: +1 }, { q: 0, r: -1 },
    { q: +1, r: -1 }, { q: -1, r: +1 }
  ];
  return directions.map(d => ({ q: q + d.q, r: r + d.r }));
}

function hexDistanceSteal(q1, r1, q2, r2) {
  const dq = Math.abs(q1 - q2);
  const dr = Math.abs(r1 - r2);
  const ds = Math.abs((-q1 - r1) - (-q2 - r2));
  return Math.max(dq, dr, ds);
}

module.exports = { getNeighborsSteal, hexDistanceSteal };