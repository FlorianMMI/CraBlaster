// Stocker les données de chaque ennemi pour détecter les blocages
const enemyData = new Map();
let enemiesShouldFlee = false;

// Créer une barre de vie pour un ennemi
function createHealthBar(enemy) {
  const healthBarContainer = document.createElement('a-entity');
  healthBarContainer.setAttribute('id', `healthbar-${enemy.id}`);
  healthBarContainer.setAttribute('position', '0 2.5 0');
  
  // Fond de la barre (rouge)
  const healthBarBg = document.createElement('a-plane');
  healthBarBg.setAttribute('width', '1');
  healthBarBg.setAttribute('height', '0.15');
  healthBarBg.setAttribute('color', '#FF0000');
  healthBarBg.setAttribute('material', 'shader: flat; transparent: true; opacity: 0.8');
  healthBarContainer.appendChild(healthBarBg);
  
  // Barre de vie (verte)
  const healthBarFill = document.createElement('a-plane');
  healthBarFill.setAttribute('id', `healthbar-fill-${enemy.id}`);
  healthBarFill.setAttribute('width', '1');
  healthBarFill.setAttribute('height', '0.15');
  healthBarFill.setAttribute('color', '#00FF00');
  healthBarFill.setAttribute('material', 'shader: flat; transparent: true; opacity: 0.9');
  healthBarFill.setAttribute('position', '0 0 0.01');
  healthBarContainer.appendChild(healthBarFill);
  
  // Faire face à la caméra
  healthBarContainer.setAttribute('look-at', '#player');
  
  enemy.appendChild(healthBarContainer);
  console.log(`❤️ Barre de vie créée pour ${enemy.id}`);
}

// Mettre à jour la barre de vie d'un ennemi
export function updateEnemyHealth(enemyId, currentHealth, maxHealth) {
  const healthBarFill = document.getElementById(`healthbar-fill-${enemyId}`);
  if (healthBarFill) {
    const healthPercent = currentHealth / maxHealth;
    const newWidth = Math.max(0, healthPercent);
    healthBarFill.setAttribute('width', newWidth);
    
    // Changer la couleur en fonction de la santé
    let color = '#00FF00'; // Vert
    if (healthPercent < 0.3) {
      color = '#FF0000'; // Rouge
    } else if (healthPercent < 0.6) {
      color = '#FFA500'; // Orange
    }
    healthBarFill.setAttribute('color', color);
    
    // Déplacer la barre pour qu'elle reste centrée
    const offset = -(1 - newWidth) / 2;
    healthBarFill.setAttribute('position', `${offset} 0 0.01`);
  }
}

// Écouter l'événement de fuite
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('a-scene');
    if (scene) {
      scene.addEventListener('enemies-flee', () => {
        enemiesShouldFlee = true;
        console.log('🚨 Mode fuite activé pour tous les ennemis !');
      });
      
      scene.addEventListener('game-start', () => {
        enemiesShouldFlee = false;
        console.log('✅ Mode poursuite activé pour les ennemis');
      });
    }
  });
}

export default function enemyBehavior(enemy){
  const rig = document.querySelector('#rig');
  if (!rig) return;

  // Check if enemy has nav-agent component
  if (!enemy.components['nav-agent']) {
    console.warn('Enemy does not have nav-agent component');
    return;
  }

  const rigPos = rig.object3D.position;
  const enemyPos = enemy.object3D.position;
  const enemyId = enemy.id;
  
  // Initialiser les données de l'ennemi s'il n'existe pas
  if (!enemyData.has(enemyId)) {
    enemyData.set(enemyId, {
      lastPosition: enemyPos.clone(),
      lastMoveTime: Date.now(),
      stuckCount: 0,
      maxHealth: 100,
      currentHealth: 100,
      healthBarCreated: false
    });
  }
  
  // Créer la barre de vie si elle n'existe pas encore
  const data = enemyData.get(enemyId);
  if (!data.healthBarCreated) {
    createHealthBar(enemy);
    data.healthBarCreated = true;
  }
  
  const currentTime = Date.now();
  
  // Calculer la distance parcourue depuis la dernière vérification
  const distanceMoved = enemyPos.distanceTo(data.lastPosition);
  
  // Si l'ennemi s'est déplacé de plus de 0.5 unités, il n'est pas bloqué
  if (distanceMoved > 0.5) {
    data.lastMoveTime = currentTime;
    data.lastPosition.copy(enemyPos);
    data.stuckCount = 0;
  } else {
    // Vérifier si l'ennemi est bloqué depuis plus de 10 secondes
    const timeSinceLastMove = currentTime - data.lastMoveTime;
    
    if (timeSinceLastMove > 2000) { // 2 secondes
      // Débloquer l'ennemi en le déplaçant sur le côté
      const offsetX = (Math.random() - 0.5) * 4; // Décalage aléatoire de -2 à +2
      const offsetZ = (Math.random() - 0.5) * 4;
      
      enemy.setAttribute('position', {
        x: enemyPos.x + offsetX,
        y: enemyPos.y,
        z: enemyPos.z + offsetZ
      });
      
      console.log(`🔓 Ennemi ${enemyId} débloqué après 10s, décalé de (${offsetX.toFixed(2)}, ${offsetZ.toFixed(2)})`);
      
      // Réinitialiser les données
      data.lastMoveTime = currentTime;
      data.lastPosition.copy(enemy.object3D.position);
      data.stuckCount++;
    }
  }
  
  // Calculer la destination (poursuite ou fuite)
  let destinationX, destinationZ;
  let speed = 3; // Vitesse normale
  
  if (enemiesShouldFlee) {
    // Mode fuite : s'éloigner du joueur
    speed = 15; // Vitesse augmentée pendant la fuite
    
    const dirX = enemyPos.x - rigPos.x;
    const dirZ = enemyPos.z - rigPos.z;
    const distance = Math.sqrt(dirX * dirX + dirZ * dirZ);
    
    if (distance > 0.1) {
      // Normaliser et s'éloigner dans la direction opposée
      const normalizedDirX = dirX / distance;
      const normalizedDirZ = dirZ / distance;
      
      // S'éloigner de 100 unités dans la direction opposée
      destinationX = enemyPos.x + normalizedDirX * 100;
      destinationZ = enemyPos.z + normalizedDirZ * 100;
    } else {
      // Si trop proche, s'éloigner aléatoirement
      const angle = Math.random() * Math.PI * 2;
      destinationX = enemyPos.x + Math.cos(angle) * 100;
      destinationZ = enemyPos.z + Math.sin(angle) * 100;
    }
    
    // Forcer la réactivation du nav-agent
    enemy.setAttribute('nav-agent', 'active', false);
    setTimeout(() => {
      enemy.setAttribute('nav-agent', {
        destination: `${destinationX} ${rigPos.y} ${destinationZ}`,
        speed: speed,
        active: true
      });
    }, 10);
  } else {
    // Mode poursuite normale
    destinationX = rigPos.x;
    destinationZ = rigPos.z;
    
    // Mettre à jour la destination constamment pour poursuivre le joueur
    enemy.setAttribute('nav-agent', {
      destination: `${destinationX} ${rigPos.y} ${destinationZ}`,
      speed: speed,
      active: true
    });
  }
}

// Nettoyer les données des ennemis supprimés
export function cleanupEnemyData(enemyId) {
  if (enemyData.has(enemyId)) {
    enemyData.delete(enemyId);
  }
}

// Infliger des dégâts à un ennemi
export function damageEnemy(enemyId, damage) {
  const data = enemyData.get(enemyId);
  if (data) {
    data.currentHealth -= damage;
    data.currentHealth = Math.max(0, data.currentHealth);
    updateEnemyHealth(enemyId, data.currentHealth, data.maxHealth);
    
    console.log(`💥 ${enemyId} a pris ${damage} dégâts (${data.currentHealth}/${data.maxHealth})`);
    
    // Si l'ennemi est mort, le supprimer
    if (data.currentHealth <= 0) {
      const enemy = document.getElementById(enemyId);
      if (enemy && enemy.parentNode) {
        enemy.parentNode.removeChild(enemy);
        cleanupEnemyData(enemyId);
        console.log(`☠️ ${enemyId} est mort !`);
      }
    }
    
    return data.currentHealth;
  }
  return 0;
}
