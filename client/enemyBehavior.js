// Stocker les données de chaque ennemi pour détecter les blocages
const enemyData = new Map();
let enemiesShouldFlee = false;

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
      stuckCount: 0
    });
  }
  
  const data = enemyData.get(enemyId);
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
