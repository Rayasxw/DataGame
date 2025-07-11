
function getAttack(type){
    switch (type){
        case 0:
            return 30
            break;
        case 1:
            return 70
            break;
        case 2:
            return 20
            break;
    }
}

function isNearHome(q, r, homeSpots) {
  return homeSpots.some(spot => 
    Math.abs(spot.q - q) <= 2 && Math.abs(spot.r - r) <= 2
  );
}

function isAdjacent(q1, r1, q2, r2) {
  const neighbors = [
    [q1 + 1, r1],
    [q1 - 1, r1],
    [q1, r1 + 1],
    [q1, r1 - 1],
    [q1 + 1, r1 - 1],
    [q1 - 1, r1 + 1],
  ];
  return neighbors.some(([q, r]) => q === q2 && r === r2);
}


// attack.js
export function shouldAttack(ant, visibleEnemies, homeSpots) {
  const enemyNearby = visibleEnemies.find(enemy => 
    isAdjacent(ant.q, ant.r, enemy.q, enemy.r)
  );

  if (!adjacentEnemies.length) return null;

  const hasHomeBonus = isNearHome(ant.q, ant.r, homeSpots);
  const baseAttack = getAttack(ant.type);
  const totalAttack = baseAttack * (1 + (hasHomeBonus ? 0.25 : 0));

  let bestTarget = null;
  let bestPriority = -Infinity;

  adjacentEnemies.forEach(enemy => {
    const enemyAttack = getAttack(enemy.type);
    const canKill = totalAttack >= enemy.health;
    const isWorkerWithFood = enemy.type === 0 && enemy.food && enemy.food.amount > 0;
    const isScout = enemy.type === 2;
    const isDangerous = enemyAttack >= ant.health * 0.5;

    // Приоритеты:
    // 3 — можно убить за 1 удар
    // 2 — рабочий с ресурсами
    // 1 — разведчик
    // -2 — опасный враг
    const priority = (canKill ? 3 : 0) + (isWorkerWithFood ? 2 : 0) + (isScout ? 1 : 0) - (isDangerous ? 2 : 0);

    if (priority > bestPriority) {
      bestPriority = priority;
      bestTarget = enemy;
    }
  });

  if (!bestTarget) return null;

  if (ant.type === 1) return bestTarget;

  if ((ant.type === 0 || ant.type === 2) && (totalAttack >= bestTarget.health || bestPriority >= 2)) {
    return bestTarget;
  }

  return null;

}

