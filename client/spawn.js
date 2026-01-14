// Composant A-Frame pour gérer le spawn d'astronautes
AFRAME.registerComponent('spawn-manager', {
  schema: {
    initialInterval: { type: 'number', default: 3000 }, // Intervalle de départ (10 secondes)
    minInterval: { type: 'number', default: 200 },      // Intervalle minimum (2 secondes)
    spawnRadius: { type: 'number', default: 20 },        // Rayon autour de la box
    gameDuration: { type: 'number', default: 120000 }    // Durée de la partie (2 minutes)
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
    this.gameTimer = null;

    // Écouter l'événement de démarrage de la partie
    const self = this;
    this.el.sceneEl.addEventListener('game-start', function() {
      console.log('🎯 Événement game-start reçu !');
      self.startSpawning();
    });
    
    console.log('✅ Spawn-manager initialisé, en attente du game-start...');
  },

  startSpawning: function() {
    if (this.isGameActive) return; // Éviter de démarrer deux fois
    
    this.isGameActive = true;
    const self = this;
    
    console.log('🎮 Partie démarrée ! Spawn activé pour 2 minutes.');
    
    // Spawner immédiatement un premier astronaute
    this.spawnAstronaut();
    
    // Démarrer le système de spawn avec intervalle dynamique
    this.scheduleNextSpawn();
    
    // Arrêter le spawn après 2 minutes
    this.gameTimer = setTimeout(function() {
      self.stopSpawning();
    }, this.data.gameDuration);
  },
  
  scheduleNextSpawn: function() {
    if (!this.isGameActive) return;
    
    const self = this;
    this.spawnInterval = setTimeout(function() {
      self.spawnAstronaut();
      
      // Diminuer l'intervalle progressivement (10% plus rapide à chaque spawn)
      self.currentInterval = Math.max(
        self.data.minInterval,
        self.currentInterval * 0.9
      );
      
      console.log(`⏱️ Prochain spawn dans ${(self.currentInterval / 1000).toFixed(1)}s`);
      
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
    
    if (this.gameTimer) {
      clearTimeout(this.gameTimer);
      this.gameTimer = null;
    }
    
    console.log('⏹️ Fin de la partie ! Spawn arrêté.');
  },

  spawnAstronaut: function() {
    // Choisir un point de spawn aléatoire parmi les 6 boxes
    const randomPoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
    
    // Calculer une position aléatoire autour de la box
    const angle = Math.random() * Math.PI * 2; // Angle aléatoire
    const distance = Math.random() * this.data.spawnRadius; // Distance aléatoire dans le rayon
    
    const spawnX = randomPoint.x + Math.cos(angle) * distance;
    const spawnY = randomPoint.y-1;
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

  remove: function() {
    // Nettoyer les timers quand le composant est retiré
    this.stopSpawning();
  }
});
