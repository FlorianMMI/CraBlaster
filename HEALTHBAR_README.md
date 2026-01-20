# Système de Barres de Vie 💚

## Description
Chaque ennemi dans le jeu possède maintenant une barre de vie affichée au-dessus de lui.

## Caractéristiques

### Barre de Vie
- **Position** : 2.5 unités au-dessus de l'ennemi
- **Couleur** :
  - 🟢 Vert : > 60% de vie
  - 🟠 Orange : 30-60% de vie
  - 🔴 Rouge : < 30% de vie
- **Taille** : 1 unité de largeur, 0.15 de hauteur
- **Orientation** : Toujours face au joueur

### Santé des Ennemis
- **Vie maximum** : 100 HP
- **Vie initiale** : 100 HP (pleine vie au spawn)

## Fonctions Disponibles

### `damageEnemy(enemyId, damage)`
Inflige des dégâts à un ennemi.

**Paramètres** :
- `enemyId` (string) : L'ID de l'ennemi (ex: "spawned-astro-1")
- `damage` (number) : Nombre de points de dégâts à infliger

**Retour** :
- (number) : Vie restante de l'ennemi (0 si mort)

**Exemple** :
```javascript
import { damageEnemy } from './enemyBehavior.js';

// Infliger 20 dégâts à un ennemi
const remainingHealth = damageEnemy('spawned-astro-1', 20);

if (remainingHealth === 0) {
  console.log('Ennemi éliminé !');
}
```

### `updateEnemyHealth(enemyId, currentHealth, maxHealth)`
Met à jour manuellement l'affichage de la barre de vie.

**Note** : Cette fonction est appelée automatiquement par `damageEnemy()`, vous n'avez normalement pas besoin de l'appeler directement.

## Intégration dans votre code d'armes

Exemple d'utilisation dans un système de tir :

```javascript
import { damageEnemy } from './enemyBehavior.js';
import { addScore } from './game.js';

// Dans votre fonction de tir
function onEnemyHit(enemy) {
  const damage = 25; // Dégâts de votre arme
  const remainingHealth = damageEnemy(enemy.id, damage);
  
  if (remainingHealth === 0) {
    // Ennemi tué
    addScore(100);
    console.log('🎯 Kill ! +100 points');
  } else {
    // Ennemi touché
    addScore(10);
    console.log('💥 Hit ! +10 points');
  }
}
```

## Comportement Automatique

- ✅ La barre de vie est créée automatiquement quand l'ennemi spawn
- ✅ La barre suit l'ennemi automatiquement
- ✅ La couleur change selon la vie restante
- ✅ L'ennemi est supprimé automatiquement quand sa vie atteint 0
- ✅ La barre est nettoyée automatiquement quand l'ennemi meurt

## Notes Techniques

- Les barres de vie utilisent le composant `look-at` pour toujours faire face au joueur (#player)
- Les données de santé sont stockées dans `enemyData` Map avec les autres données de comportement
- Le système est complètement intégré avec le système de spawn existant
