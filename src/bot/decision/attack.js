
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

// attack.js
export function shouldAttack(ant, visibleEnemies) {
  // Найти врага рядом для атаки
  const enemyNearby = visibleEnemies.find(enemy => 
    isAdjacent(ant.q, ant.r, enemy.q, enemy.r)
  );

  if (enemyNearby && ant.type === 1) {
    if(getAttack(enemyNearby) < ant.health){
        return enemyNearby
    }
  }
  if(ant.type === 0 && enemyNearby.type === 0){
    if(ant.health <= getAttack(enemyNearby)){
        return null
    }
    return enemyNearby
  }
  if(ant.type === 3 && enemyNearby.type === 3){
    if(ant.health <= getAttack(enemyNearby)){
        return null
    }
    return enemyNearby
  }

  return null; // атаковать нечего
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
