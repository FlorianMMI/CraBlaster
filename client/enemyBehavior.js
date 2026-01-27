// Stocker les données de chaque ennemi pour détecter les blocages
const enemyData = new Map();
let enemiesShouldFlee = false;

// Composant A-Frame pour faire constamment face à la caméra
AFRAME.registerComponent('billboard', {
  init: function() {
    this.camera = null;
  },
  
  tick: function() {
    if (!this.camera) {
      this.camera = document.querySelector('[camera]');
      if (!this.camera) return;
    }
    
    // Faire toujours face à la caméra
    const cameraPos = this.camera.object3D.position;
    const thisPos = this.el.object3D.position;
    
    // Calculer la direction vers la caméra
    const direction = new THREE.Vector3();
    direction.subVectors(cameraPos, thisPos);
    direction.y = 0; // Garder la barre horizontale
    direction.normalize();
    
    // Orienter vers la caméra
    const angle = Math.atan2(direction.x, direction.z);
    this.el.object3D.rotation.y = angle;
  }
});

// Créer une barre de vie pour un ennemi
function createHealthBar(enemy) {
  const healthBarContainer = document.createElement('a-entity');
  healthBarContainer.setAttribute('id', `healthbar-${enemy.id}`);
  healthBarContainer.setAttribute('position', '0 2.5 0');
  healthBarContainer.setAttribute('billboard', ''); // Utiliser notre composant billboard
  
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
  // Fallback VR: utiliser la position de la caméra si le rig ne bouge pas (casques VR)
  let rigPos = null;
  if (rig && rig.object3D) {
    // Si le rig n'a pas bougé (VR), utiliser la caméra (head)
    if (rig.object3D.position.length() < 0.01) {
      const head = rig.querySelector('[camera]');
      if (head && head.object3D) {
        rigPos = head.object3D.getWorldPosition(new THREE.Vector3());
      }
    } else {
      rigPos = rig.object3D.position;
    }
  }
  if (!rigPos) return;

  // Check if enemy has nav-agent component
  if (!enemy.components['nav-agent']) {
    console.warn('Enemy does not have nav-agent component');
    return;
  }

  const enemyPos = enemy.object3D.position;
  const enemyId = enemy.id;
  
  // Vérifier la collision avec le joueur
  const distanceToPlayer = enemyPos.distanceTo(rigPos);
  if (distanceToPlayer < 1.5) { // Collision si distance < 1.5 unités
    const data = enemyData.get(enemyId);
    if (data && !data.hasCollidedThisFrame) {
      data.hasCollidedThisFrame = true;
      
      // Faire baisser le score
      import('./game.js').then(gameModule => {
        gameModule.addScore(-50); // -50 points pour collision
        console.log('💢 Collision avec un ennemi! -50 points');
      });
      
      // Réinitialiser le flag après 2 secondes pour éviter les collisions multiples
      setTimeout(() => {
        if (data) {
          data.hasCollidedThisFrame = false;
        }
      }, 2000);
    }
  }
  
  // Initialiser les données de l'ennemi s'il n'existe pas
  if (!enemyData.has(enemyId)) {
    enemyData.set(enemyId, {
      lastPosition: enemyPos.clone(),
      lastMoveTime: Date.now(),
      stuckCount: 0,
      maxHealth: 100, // 2 tirs de blaster (50 damage chacun) pour tuer
      currentHealth: 100,
      healthBarCreated: false,
      hasCollidedThisFrame: false,
      lastSoundTime: Date.now(),
      nextSoundDelay: Math.random() * 5000 + 3000 // Entre 3 et 8 secondes
    });
  }
  
  // Récupérer les données de l'ennemi
  const data = enemyData.get(enemyId);
  const currentTime = Date.now();
  
  // Jouer le son du crabe de manière aléatoire
  if (currentTime - data.lastSoundTime > data.nextSoundDelay) {
    const soundcrab = document.querySelector('#soundcrab');
    if (soundcrab) {
      const soundClone = soundcrab.cloneNode();
      soundClone.volume = 0.15; // Volume réduit à 15%
      soundClone.play().catch(() => {});
    }
    data.lastSoundTime = currentTime;
    data.nextSoundDelay = Math.random() * 5000 + 3000; // Nouveau délai aléatoire
  }
  
  // Créer la barre de vie si elle n'existe pas encore
  if (!data.healthBarCreated) {
    createHealthBar(enemy);
    data.healthBarCreated = true;
  }
  
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
        // Créer une explosion à la position de l'ennemi
        const enemyPos = enemy.object3D.position;
        
        // Flash lumineux central
        const flash = document.createElement('a-sphere');
        flash.setAttribute('position', `${enemyPos.x} ${enemyPos.y + 1} ${enemyPos.z}`);
        flash.setAttribute('radius', '0.3');
        flash.setAttribute('color', '#FFA500');
        flash.setAttribute('material', 'emissive: #FF4500; emissiveIntensity: 3; shader: standard; transparent: true');
        flash.setAttribute('animation__scale', {
          property: 'scale',
          from: '1 1 1',
          to: '5 5 5',
          dur: 400,
          easing: 'easeOutQuad'
        });
        flash.setAttribute('animation__opacity', {
          property: 'material.opacity',
          from: 1,
          to: 0,
          dur: 400,
          easing: 'easeInQuad'
        });
        enemy.parentNode.appendChild(flash);
        
        // Créer des sphères de débris qui s'envolent
        const colors = ['#FF4500', '#FFA500', '#FFD700', '#FF0000'];
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            const debris = document.createElement('a-sphere');
            const angle = (Math.PI * 2 * i) / 20;
            const radius = 2 + Math.random() * 2;
            const height = 1 + Math.random() * 2;
            
            debris.setAttribute('position', `${enemyPos.x} ${enemyPos.y + 1} ${enemyPos.z}`);
            debris.setAttribute('radius', '0.1');
            debris.setAttribute('color', colors[Math.floor(Math.random() * colors.length)]);
            debris.setAttribute('material', 'emissive: #FF4500; emissiveIntensity: 1; transparent: true');
            
            debris.setAttribute('animation__move', {
              property: 'position',
              to: `${enemyPos.x + Math.cos(angle) * radius} ${enemyPos.y + height} ${enemyPos.z + Math.sin(angle) * radius}`,
              dur: 800,
              easing: 'easeOutQuad'
            });
            
            debris.setAttribute('animation__fade', {
              property: 'material.opacity',
              from: 1,
              to: 0,
              dur: 800,
              easing: 'easeInQuad'
            });
            
            enemy.parentNode.appendChild(debris);
            
            setTimeout(() => {
              if (debris.parentNode) {
                debris.parentNode.removeChild(debris);
              }
            }, 850);
          }, i * 20);
        }
        
        // Supprimer le flash après l'animation
        setTimeout(() => {
          if (flash.parentNode) {
            flash.parentNode.removeChild(flash);
          }
        }, 450);
        
        // Supprimer l'ennemi
        enemy.parentNode.removeChild(enemy);
        cleanupEnemyData(enemyId);
        console.log(`💥☠️ ${enemyId} est mort dans une explosion !`);
        
        // Jouer le son plop
        const plopSound = document.querySelector('#plop');
        if (plopSound) {
          const soundClone = plopSound.cloneNode();
          soundClone.play().catch(() => {});
        }
      }
    }
    
    return data.currentHealth;
  }
  return 0;
}
