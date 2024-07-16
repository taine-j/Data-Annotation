function getClosestValidTarget(player, enemies, maxDistance = 40, invalidBuffs = [], requiredDebuff) {
    let closestTargetIndex = -1;
    let closestDistance = Infinity;
  
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
  
      // Early exit if invalid creature ID
      if (enemy.creatureID === 174773) continue; 
  
      // Basic validity checks
      if (
        !enemy.inCombat ||
        enemy.buffs.some(buff => invalidBuffs.includes(buff)) ||
        !enemy.debuffs.includes(requiredDebuff)
      ) {
        continue; // Skip to next enemy if not valid
      }
  
      // Calculate distance (using squared distance for performance)
      const dx = player.position[0] - enemy.position[0];
      const dy = player.position[1] - enemy.position[1];
      const distanceSq = dx * dx + dy * dy;
  
      // Check if within range and closer than current closest
      if (distanceSq <= maxDistance * maxDistance && distanceSq < closestDistance) {
        closestDistance = distanceSq;
        closestTargetIndex = i;
      }
    }
  
    return closestTargetIndex;
  }

  const player = { position: [10, 20] };
const enemies = [
  { position: [15, 25], inCombat: true, buffs: [], debuffs: [1], creatureID: 123 },
  { position: [50, 60], inCombat: true, buffs: [2], debuffs: [1], creatureID: 456 },
  { position: [12, 22], inCombat: false, buffs: [], debuffs: [1], creatureID: 789 },
  { position: [18, 28], inCombat: true, buffs: [], debuffs: [1], creatureID: 174773 }, // Invalid ID
];

const targetIndex = getClosestValidTarget(player, enemies, 30, [2], 1);
console.log(targetIndex); // Output: 0