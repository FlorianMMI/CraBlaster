// Composant A-Frame pour gérer le spawn d'astronautes
import { cleanupEnemyData } from './enemyBehavior.js';

AFRAME.registerComponent('spawn-manager', {
  schema: {
    initialInterval: { type: 'number', default: 3000 }, // Intervalle de départ (10 secondes)
    minInterval: { type: 'number', default: 200 },      // Intervalle minimum (2 secondes)
    spawnRadius: { type: 'number', default: 20 },        // Rayon autour de la box
    gameDuration: { type: 'number', default: 120000 },   // Durée de la partie (2 minutes)
    maxEnemies: { type: 'number', default: 25 },         // Nombre maximum d'ennemis
    spawnDelay: { type: 'number', default: 20000 },      // Délai avant le spawn automatique (20 secondes)
    initialEnemies: { type: 'number', default: 5 }       // Nombre d'ennemis au départ
  },

  init: function() {
    // Positions des 6 boxes de spawn
    this.spawnPoints = [
      { x: 1, y: 1, z: -65 },
      { x: -90, y: 1, z: 14 },
      { x: 21, y: 1, z: 91 },
      { x: 107, y: 1, z: -10 },
      { x: 120, y: 1, z: -136 },
      { x: -135, y: 1, z: 104 }
    ];

    this.astroCount = 0;
    this.currentInterval = this.data.initialInterval;
    this.isGameActive = false;
    this.spawnInterval = null;
    this.fleeTimer = null;

    // Écouter l'événement de démarrage de la partie
    const self = this;
    this.el.sceneEl.addEventListener('game-start', function() {
      console.log('🎯 Événement game-start reçu !');
      self.startSpawning();
    });
    
    // Écouter l'événement de fin de partie pour supprimer les ennemis
    this.el.sceneEl.addEventListener('game-end', function() {
      console.log('🏁 Événement game-end reçu dans spawn-manager !');
      self.stopSpawning();
    });
    
    console.log('✅ Spawn-manager initialisé, en attente du game-start...');
  },

  startSpawning: function() {
    if (this.isGameActive) return; // Éviter de démarrer deux fois
    
    this.isGameActive = true;
    this.astroCount = 0; // Réinitialiser le compteur
    const self = this;
    
    console.log('🎮 Partie démarrée ! Spawn activé pour 2 minutes.');
    
    // Spawner immédiatement 5 astronautes au départ
    for (let i = 0; i < this.data.initialEnemies; i++) {
      this.spawnAstronaut();
    }
    console.log(`✨ ${this.data.initialEnemies} ennemis spawnés au départ !`);
    
    // Attendre 20 secondes avant de démarrer le spawn automatique
    setTimeout(function() {
      if (self.isGameActive) {
        console.log('⏰ Début du spawn automatique après 20 secondes');
        self.scheduleNextSpawn();
      }
    }, this.data.spawnDelay);
    
    // Déclencher la fuite des ennemis 10 secondes avant la fin
    this.fleeTimer = setTimeout(function() {
      if (self.isGameActive) {
        self.el.sceneEl.emit('enemies-flee');
        console.log('🏃 Les ennemis fuient maintenant !');
      }
    }, 110000); // 110 secondes (10 secondes avant la fin à 120s)
  },
  
  scheduleNextSpawn: function() {
    if (!this.isGameActive) return;
    
    // Vérifier si on a atteint la limite d'ennemis
    if (this.astroCount >= this.data.maxEnemies) {
      console.log(`🛑 Limite de ${this.data.maxEnemies} ennemis atteinte, arrêt du spawn.`);
      return;
    }
    
    const self = this;
    this.spawnInterval = setTimeout(function() {
      // Vérifier à nouveau avant de spawner
      if (self.astroCount >= self.data.maxEnemies) {
        console.log(`🛑 Limite de ${self.data.maxEnemies} ennemis atteinte.`);
        return;
      }
      
      self.spawnAstronaut();
      
      // Diminuer l'intervalle progressivement (10% plus rapide à chaque spawn)
      self.currentInterval = Math.max(
        self.data.minInterval,
        self.currentInterval * 0.9
      );
      
      console.log(`⏱️ Prochain spawn dans ${(self.currentInterval / 1000).toFixed(1)}s (${self.astroCount}/${self.data.maxEnemies})`);
      
      // Planifier le prochain spawn
      self.scheduleNextSpawn();
    }, this.currentInterval);
  },
  
  stopSpawning: function() {
    this.isGameActive = false;
    
    if (this.spawnInterval) {
      clearTimeout(this.spawnInterval);
      this.spawnInterval = null;
    }
    
    if (this.fleeTimer) {
      clearTimeout(this.fleeTimer);
      this.fleeTimer = null;
    }
    
    console.log('⏹️ Fin de la partie ! Spawn arrêté.');
    
    // Supprimer tous les ennemis
    this.removeAllEnemies();
  },

  spawnAstronaut: function() {
    // Choisir un point de spawn aléatoire parmi les 6 boxes
    const randomPoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
    
    // Calculer une position aléatoire autour de la box
    const angle = Math.random() * Math.PI * 2; // Angle aléatoire
    const distance = Math.random() * this.data.spawnRadius; // Distance aléatoire dans le rayon
    
    const spawnX = randomPoint.x + Math.cos(angle) * distance;
    const spawnY = randomPoint.y - 1; // Baissé de -1 à -2 pour être plus proche du sol
    const spawnZ = randomPoint.z + Math.sin(angle) * distance;

    // Créer l'entité astronaute
    const astronaut = document.createElement('a-entity');
    astronaut.setAttribute('id', 'spawned-astro-' + this.astroCount);
    astronaut.setAttribute('gltf-model', '#astro');
    astronaut.setAttribute('position', `${spawnX} ${spawnY} ${spawnZ}`);
    astronaut.setAttribute('scale', '1 1 1');
    astronaut.setAttribute('data-tag', 'enemy');
    astronaut.setAttribute('nav-agent', "speed: 3; active: true");
    
    // Rotation aléatoire pour plus de variété
    const randomRotation = Math.random() * 360;
    astronaut.setAttribute('rotation', `0 ${randomRotation} 0`);

    // Ajouter l'astronaute à la scène
    this.el.sceneEl.appendChild(astronaut);

    console.log(`Astronaute spawné #${this.astroCount} à la position:`, spawnX, spawnY, spawnZ);
    
    this.astroCount++;
    
  },

  /**
   * Supprime tous les ennemis de la scène
   * À utiliser quand la partie est terminée
   */
  removeAllEnemies: function() {
    const enemies = document.querySelectorAll('[data-tag="enemy"]');
    let count = 0;
    
    enemies.forEach(function(enemy) {
      // Nettoyer les données de comportement de l'ennemi
      if (enemy.id) {
        cleanupEnemyData(enemy.id);
      }
      enemy.parentNode.removeChild(enemy);
      count++;
    });
    
    console.log(`🧹 ${count} ennemi(s) supprimé(s) de la scène.`);
    return count;
  },

  /**
   * Supprime un ennemi particulier
   * @param {string|HTMLElement} enemy - L'ID de l'ennemi ou l'élément DOM directement
   */
  removeEnemy: function(enemy) {
    let enemyElement;
    
    // Si on reçoit une chaîne, on cherche l'élément par ID
    if (typeof enemy === 'string') {
      enemyElement = document.getElementById(enemy);
    } else {
      // Sinon on suppose que c'est déjà un élément DOM
      enemyElement = enemy;
    }
    
    if (enemyElement && enemyElement.parentNode) {
      const enemyId = enemyElement.id || 'ennemi inconnu';
      // Nettoyer les données de comportement de l'ennemi
      if (enemyElement.id) {
        cleanupEnemyData(enemyElement.id);
      }
      enemyElement.parentNode.removeChild(enemyElement);
      console.log(`❌ Ennemi ${enemyId} supprimé.`);
      return true;
    } else {
      console.warn('⚠️ Ennemi introuvable ou déjà supprimé.');
      return false;
    }
  },


  remove: function() {
    // Nettoyer les timers quand le composant est retiré
    this.stopSpawning();
  }
});
