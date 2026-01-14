// Composant A-Frame pour gérer le brouillard progressif pendant la partie
AFRAME.registerComponent('fog-manager', {
  schema: {
    duration: { type: 'number', default: 5000 }, // Durée de la transition en ms
    color: { type: 'color', default: '#888' },
    nearStart: { type: 'number', default: 1 },
    nearEnd: { type: 'number', default: 1 },
    farStart: { type: 'number', default: 1000 }, // Très loin = pas de fog
    farEnd: { type: 'number', default: 50 }
  },

  init: function() {
    this.isFogActive = false;
    this.transitionStartTime = 0;
    this.isTransitioning = false;
    this.transitionDirection = 1; // 1 = activer, -1 = désactiver
    
    const self = this;
    const scene = this.el;
    
    // Désactiver le fog au départ
    scene.setAttribute('fog', {
      type: 'linear',
      color: this.data.color,
      near: this.data.nearStart,
      far: this.data.farStart
    });
    
    // Écouter l'événement de démarrage de la partie
    scene.addEventListener('game-start', function() {
      console.log('🌫️ Activation progressive du brouillard...');
      self.startTransition(1); // Activer
    });
    
    // Écouter l'événement de fin de partie
    scene.addEventListener('game-end', function() {
      console.log('☀️ Désactivation progressive du brouillard...');
      self.startTransition(-1); // Désactiver
    });
    
    console.log('✅ Fog-manager initialisé');
  },

  startTransition: function(direction) {
    this.transitionStartTime = Date.now();
    this.isTransitioning = true;
    this.transitionDirection = direction;
  },

  tick: function() {
    if (!this.isTransitioning) return;
    
    const currentTime = Date.now();
    const elapsed = currentTime - this.transitionStartTime;
    const progress = Math.min(elapsed / this.data.duration, 1);
    
    // Courbe easing (ease-in-out)
    const easedProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    let near, far;
    
    if (this.transitionDirection === 1) {
      // Activer le fog
      near = this.data.nearStart + (this.data.nearEnd - this.data.nearStart) * easedProgress;
      far = this.data.farStart + (this.data.farEnd - this.data.farStart) * easedProgress;
    } else {
      // Désactiver le fog
      near = this.data.nearEnd + (this.data.nearStart - this.data.nearEnd) * easedProgress;
      far = this.data.farEnd + (this.data.farStart - this.data.farEnd) * easedProgress;
    }
    
    this.el.setAttribute('fog', {
      type: 'linear',
      color: this.data.color,
      near: near,
      far: far
    });
    
    // Arrêter la transition quand elle est terminée
    if (progress >= 1) {
      this.isTransitioning = false;
      this.isFogActive = (this.transitionDirection === 1);
      
      if (this.isFogActive) {
        console.log('✅ Brouillard complètement activé');
      } else {
        console.log('✅ Brouillard complètement désactivé');
      }
    }
  }
});
