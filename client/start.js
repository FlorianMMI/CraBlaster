// Version simplifiée sans dépendances externes

let currentTimerInterval = null;

// Fonction pour démarrer le timer (exportable pour rejouer)
export function startTimer() {
    const aScene = document.querySelector("a-scene");
    const sky = document.querySelector("a-sky");
    let Timer = aScene.querySelector('[data-timer]');
    
    if (!Timer) {
        console.warn('⚠️ Timer non trouvé');
        return;
    }
    
    // Réinitialiser le timer à 2 minutes
    let timeRemaining = 120;
    Timer.setAttribute("value", "2:00");
    Timer.setAttribute("text", "align: right; width: 2; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    
    // Nettoyer l'ancien timer s'il existe
    if (currentTimerInterval) {
        clearInterval(currentTimerInterval);
        console.log('🧹 Ancien timer nettoyé');
    }
    
    // Rotation du sky au lancement de la partie
    sky.setAttribute("rotation", "180 0 0");
    
    // Arrêter la musique du menu et démarrer la musique de jeu
    const musicstart = document.querySelector('#musicstart');
    if (musicstart) {
        musicstart.pause();
        console.log('🎵 Musique menu arrêtée');
    }
    
    const music = document.querySelector('#music');
    if (music) {
        music.currentTime = 0;
        music.volume = 0.3; // Volume à 30%
        music.play().catch(err => console.log('Musique auto-play bloquée:', err));
        console.log('🎵 Musique de fond démarrée');
    }
    
    // Déclencher le démarrage de la partie
    aScene.emit('game-start');
    console.log('🎮 Partie lancée !');
    
    // Démarrer le compte à rebours
    currentTimerInterval = setInterval(function() {
        timeRemaining--;
        
        // Déclencher la fuite des ennemis 10 secondes avant la fin
        if (timeRemaining === 10) {
            aScene.emit('enemies-flee');
            console.log('🏃 Les ennemis fuient maintenant !');
        }
        
        if (timeRemaining <= 0) {
            clearInterval(currentTimerInterval);
            Timer.setAttribute("value", "0:00");
            Timer.setAttribute("text", "align: right; width: 2; font: asset/Michroma-Regular-msdf.json; color: #FF0000; negate: false; opacity: 1; alphaTest: 0.5");
            // Remettre le sky à sa rotation initiale
            sky.setAttribute("rotation", "0 0 0");
            console.log('⏰ Temps écoulé !');
            
            // Arrêter la musique
            const music = document.querySelector('#music');
            if (music) {
                music.pause();
                console.log('🎵 Musique arrêtée');
            }
            
            // Redémarrer la musique du menu
            const musicstart = document.querySelector('#musicstart');
            if (musicstart) {
                musicstart.currentTime = 0;
                musicstart.play().catch(err => console.log('Musique menu auto-play bloquée:', err));
                console.log('🎵 Musique menu redémarrée');
            }
            
            // Émettre l'événement de fin de partie
            aScene.emit('game-end');
            console.log('🏁 Fin de partie - Timer à 0 !');
        } else {
            let minutes = Math.floor(timeRemaining / 60);
            let seconds = timeRemaining % 60;
            let timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            Timer.setAttribute("value", timeString);
            
            // Changer la couleur en rouge quand il reste moins de 30 secondes
            if (timeRemaining <= 30) {
                Timer.setAttribute("text", "align: right; width: 2; font: asset/Michroma-Regular-msdf.json; color: #FF0000; negate: false; opacity: 1; alphaTest: 0.5");
            }
        }
    }, 1000);
}

export function startmenu(onStartCallback) {
    let aScene = document.querySelector("a-scene");
    let sky = document.querySelector("a-sky");
    
    // Démarrer la musique du menu
    const musicstart = document.querySelector('#musicstart');
    if (musicstart) {
        musicstart.currentTime = 0;
        musicstart.volume = 0.3;
        musicstart.play().catch(err => console.log('Musique menu auto-play bloquée:', err));
        console.log('🎵 Musique menu démarrée');
    }



    let title = document.createElement("a-text");
    title.setAttribute("text", "value: Bienvenue sur Crablaster; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    title.setAttribute("position", `0 5 -5`);
    title.setAttribute("width", "36");
    title.setAttribute("align", "center");
    aScene.append(title);

    let plane = document.createElement("a-plane");
    plane.setAttribute("material", "shader: flat; side: double; color: #000000; opacity: 0.4");
    plane.setAttribute("geometry", "primitive: plane; width: 14; height: 3");
    plane.setAttribute("position", `0 2.2 -5.2`);
    aScene.appendChild(plane);

    let paragraph = document.createElement("a-text");
    paragraph.setAttribute("value", "Explorez l'environnement VR 3D!\nUtilisez les contrôles de mouvement pour vous déplacer.");
    paragraph.setAttribute("position", `0 2.2 -5`);
    paragraph.setAttribute("text", "align: center; width: 13; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    aScene.appendChild(paragraph);

    let Timer = document.createElement("a-text");
    Timer.setAttribute("value", "2:00");
    Timer.setAttribute("position", `0.75 0.35 -0.5`);
    Timer.setAttribute("rotation", `0 0 0`);
    Timer.setAttribute("text", "align: right; width: 2; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    Timer.setAttribute("material", "depthTest: false");
    Timer.setAttribute("data-timer", ""); // Attribut pour retrouver le timer
    
    // Attacher le timer à la caméra
    setTimeout(function() {
        let camera = document.querySelector('[camera]');
        if (camera) {
            camera.appendChild(Timer);
            console.log('⏱️ Timer attaché à la caméra');
        }
    }, 100);
    
    // Désactiver le fog pour le timer après qu'il soit chargé
    Timer.addEventListener('loaded', function() {
        const mesh = Timer.getObject3D('mesh');
        if (mesh && mesh.material) {
            mesh.material.fog = false;
            mesh.material.depthTest = false;
            mesh.renderOrder = 999;
        }
    });

    // Créer l'affichage du score en dessous du timer
    let ScoreDisplay = document.createElement("a-text");
    ScoreDisplay.setAttribute("value", "Score: 0");
    ScoreDisplay.setAttribute("position", `0.75 0.25 -0.5`);
    ScoreDisplay.setAttribute("rotation", `0 0 0`);
    ScoreDisplay.setAttribute("text", "align: right; width: 2; font: asset/Michroma-Regular-msdf.json; color: #ffffff; negate: false; opacity: 1; alphaTest: 0.5");
    ScoreDisplay.setAttribute("material", "depthTest: false");
    ScoreDisplay.setAttribute("data-score-display", "");
    
    // Attacher le score à la caméra
    setTimeout(function() {
        let camera = document.querySelector('[camera]');
        if (camera) {
            camera.appendChild(ScoreDisplay);
            console.log('🏆 Score attaché à la caméra');
        }
    }, 100);
    
    // Désactiver le fog pour le score après qu'il soit chargé
    ScoreDisplay.addEventListener('loaded', function() {
        const mesh = ScoreDisplay.getObject3D('mesh');
        if (mesh && mesh.material) {
            mesh.material.fog = false;
            mesh.material.depthTest = false;
            mesh.renderOrder = 999;
        }
    });

    // Ajustements HUD pour VR : rendre plus petit et repositionner lors de l'entrée/sortie VR
    function setVRHUD() {
        if (Timer) {
            Timer.setAttribute('scale', '0.6 0.6 0.6');
            Timer.setAttribute('position', '0.4 0.12 -0.6');
            Timer.setAttribute('text', 'align: right; width: 1.2; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5');
        }
        if (ScoreDisplay) {
            ScoreDisplay.setAttribute('scale', '0.6 0.6 0.6');
            ScoreDisplay.setAttribute('position', '0.4 0.02 -0.6');
            ScoreDisplay.setAttribute('text', 'align: right; width: 1.2; font: asset/Michroma-Regular-msdf.json; color: #ffffff; negate: false; opacity: 1; alphaTest: 0.5');
        }
    }

    function restoreHUD() {
        if (Timer) {
            Timer.setAttribute('scale', '1 1 1');
            Timer.setAttribute('position', '0.75 0.35 -0.5');
            Timer.setAttribute('text', 'align: right; width: 2; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5');
        }
        if (ScoreDisplay) {
            ScoreDisplay.setAttribute('scale', '1 1 1');
            ScoreDisplay.setAttribute('position', '0.75 0.25 -0.5');
            ScoreDisplay.setAttribute('text', 'align: right; width: 2; font: asset/Michroma-Regular-msdf.json; color: #ffffff; negate: false; opacity: 1; alphaTest: 0.5');
        }
    }

    // Écouteurs pour entrer/sortir du mode VR
    setTimeout(() => {
        const aScene = document.querySelector('a-scene');
        if (aScene) {
            aScene.addEventListener('enter-vr', setVRHUD);
            aScene.addEventListener('exit-vr', restoreHUD);
            // Si déjà en VR, appliquer de suite
            if (typeof aScene.is === 'function' && aScene.is('vr-mode')) setVRHUD();
        }
    }, 200);

    let startButton = document.createElement("a-entity");
    startButton.setAttribute("geometry", "primitive: plane; width: 1.5; height: 0.9;");
    startButton.setAttribute("material", "src: url(asset/Rectangle 4.png); transparent: true");
    startButton.setAttribute("text", "value: START; align: center; width: 10; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    startButton.setAttribute("position", "0 0.5 -3");
    startButton.setAttribute("class", "clickable");

    startButton.addEventListener("click", async function () {
        console.log("Start button clicked in start.js");
        
        title.parentNode.removeChild(title);
        plane.parentNode.removeChild(plane);
        paragraph.parentNode.removeChild(paragraph);
        startButton.parentNode.removeChild(startButton);
        
        // Démarrer le timer
        startTimer();
        
        // Call the game start callback if provided
        if (onStartCallback && typeof onStartCallback === 'function') {
            console.log("Calling game start callback");
            onStartCallback();
        }
    });
    
    aScene.appendChild(startButton);

    return true;
}
