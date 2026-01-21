# CraBlaster

CraBlaster est un petit jeu de tir 3D/VR navigateur où vous incarnez un pilote qui doit abattre des crabes de l'espace.

**Pitch**: Prenez les commandes, explorez une scène A-Frame et tirez sur des vagues de crabes de l'espace pour obtenir le meilleur score.

**Zone pour le lien de jeu**
- Lien pour y jouer (collez l'URL ici) :
- [https://](https://florianmmi.github.io/CraBlaster/client/index2.html)

**Comment jouer**
- Ouvrez le fichier `client/index2.html` dans un navigateur compatible WebXR/WebGL (Chrome/Edge recommandés).
- Pas d'étape de build — le projet fonctionne directement en ouvrant les fichiers HTML/JS.

**Contrôles (PC)**
- Souris: viser et cliquer pour tirer.
- Clavier: déplacement de la caméra si implémenté (voir `start.js`/`game.js`).

**Contrôles (VR)**
- Contrôleurs VR: prise en charge via A-Frame — les contrôleurs peuvent agir comme visée et tir selon la configuration.

**Points clés techniques**
- Moteur: A-Frame + JavaScript vanilla, pas de bundler.
- Entrées et scène: la logique de démarrage et d'UI se trouve dans `client/start.js`.
- Décors et composants A-Frame personnalisés: `client/decor2.js`.
- Ennemis et comportement: `client/enemyBehavior.js` et `client/spawn.js`.
- Logique de jeu: `client/game.js`, écriture modulaire des armes sous `client/weapons/`.

**Structure importante**
- `client/index2.html`: point d'entrée principal (scène A-Frame).
- `client/start.js`: menu de démarrage et création d'entités.
- `client/decor2.js`: composants et décor procédural.
- `client/game.js`: boucle et logique de jeu.
- `client/weaponExample.js` et `client/weapons/`: exemples et fichiers d'armes.
- `client/style.css`: styles UI.

**Assets**
- Polices MSDF: dans `client/asset/` (ex: `Audiowide-Regular-msdf.json`, `Michroma-Regular-msdf.json`).

**Développement local**
- Ouvrez `client/index2.html` directement dans le navigateur.
- Si vous utilisez des politiques de sécurité locales (CORS), servez le dossier via un serveur HTTP simple, par exemple :



**Contribution**
- Ajoutez ou améliorez des armes dans `client/weapons/`.
- Améliorez le spawn, l'IA et l'équilibrage dans `client/spawn.js` et `client/enemyBehavior.js`.

**Licence & crédits**
- Code: projet éducatif / hobby. Indiquez la licence que vous souhaitez utiliser si nécessaire.
- Basé sur A-Frame et ressources libres (vérifiez licences des assets ajoutés).

Bonne continuation — collez l'URL du jeu dans la zone « Lien pour y jouer » ci-dessus quand elle sera prête.