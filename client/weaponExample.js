// Exemple d'utilisation du système de dégâts sur les ennemis
import { damageEnemy } from './enemyBehavior.js';
import { addScore } from './game.js';

/**
 * Exemple : Infliger des dégâts à un ennemi quand il est touché
 * À appeler depuis votre système d'armes/tir
 */
export function shootEnemy(enemyElement) {
  const enemyId = enemyElement.id;
  const damage = 20; // Dégâts par tir
  
  const remainingHealth = damageEnemy(enemyId, damage);
  
  // Si l'ennemi est mort (vie = 0), ajouter des points
  if (remainingHealth === 0) {
    addScore(100); // 100 points pour avoir tué un ennemi
    console.log('🎯 Ennemi éliminé ! +100 points');
  } else {
    addScore(10); // 10 points pour avoir touché un ennemi
    console.log('🎯 Ennemi touché ! +10 points');
  }
}

/**
 * Exemple : Événement de clic sur un ennemi
 */
export function setupEnemyClickHandler() {
  document.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('a-scene');
    
    scene.addEventListener('click', (evt) => {
      const clickedEntity = evt.detail.intersection?.object?.el;
      
      if (clickedEntity && clickedEntity.hasAttribute('data-tag')) {
        const tag = clickedEntity.getAttribute('data-tag');
        
        if (tag === 'enemy') {
          shootEnemy(clickedEntity);
        }
      }
    });
  });
}
