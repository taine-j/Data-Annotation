function getClosestValidTarget(player, enemies, maxDistance = 40, invalidBuffs = [], requiredDebuff = null) {
    const { position: playerPos } = player;
  
    let closestDistance = maxDistance;
    let closestIndex = -1;
  
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const { position: enemyPos, inCombat, buffs, debuffs, creatureID } = enemy;
  
      // Calculate the Euclidean distance between the player and the enemy
      const distance = Math.sqrt((enemyPos[0] - playerPos[0]) ** 2 + (enemyPos[1] - playerPos[1]) ** 2);
  
      // Criteria to consider enemy
      const isValidTarget = (
        distance <= maxDistance &&
        inCombat &&
        !buffs.some(buff => invalidBuffs.includes(buff)) &&
        debuffs.includes(requiredDebuff) &&
        creatureID !== 174773
      );
  
      // Update closest distance and index if this enemy is a valid target and closer
      if (isValidTarget && distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }
  
    return closestIndex;
  }
  
  // Example usage
  const player = { position: [0, 0] };
  const enemies = [
    { position: [5, 5], inCombat: true, buffs: [], debuffs: [1], creatureID: 123 },
    { position: [10, 10], inCombat: true, buffs: [2], debuffs: [2], creatureID: 123 },
    { position: [15, 15], inCombat: false, buffs: [3], debuffs: [3], creatureID: 123 },
    { position: [20, 20], inCombat: true, buffs: [], debuffs: [2], creatureID: 174773 }
  ];
  const maxDistance = 40;
  const invalidBuffs = [2];
  const requiredDebuff = 1;
  
  const closestTargetIndex = getClosestValidTarget(player, enemies, maxDistance, invalidBuffs, requiredDebuff);
  console.log(closestTargetIndex); // Output depends on the example data provided