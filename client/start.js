// Version simplifiée sans dépendances externes

export function startmenu(onStartCallback) {
    let aScene = document.querySelector("a-scene");
    let sky = document.querySelector("a-sky");



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
    Timer.setAttribute("position", `-123 33 0`);
    Timer.setAttribute("rotation", `0 90 0`);
    Timer.setAttribute("text", "align: center; width: 250; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    aScene.appendChild(Timer);

    let startButton = document.createElement("a-entity");
    startButton.setAttribute("geometry", "primitive: plane; width: 1.5; height: 0.9;");
    startButton.setAttribute("material", "src: url(asset/Rectangle 4.png); transparent: true");
    startButton.setAttribute("text", "value: START; align: center; width: 10; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    startButton.setAttribute("position", "0 0.5 -3");
    startButton.setAttribute("class", "clickable");

    let timerInterval = null;
    let timeRemaining = 120; // 2 minutes en secondes

    startButton.addEventListener("click", async function () {
        console.log("Start button clicked in start.js");
        title.parentNode.removeChild(title);
        plane.parentNode.removeChild(plane);
        paragraph.parentNode.removeChild(paragraph);
        startButton.parentNode.removeChild(startButton);
        
        // Rotation du sky au lancement de la partie
        sky.setAttribute("rotation", "180 0 0");
        
        // Déclencher le démarrage de la partie
        aScene.emit('game-start');
        console.log('🎮 Partie lancée !');
        
        // Démarrer le compte à rebours
        timerInterval = setInterval(function() {
            timeRemaining--;
            
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                Timer.setAttribute("value", "0:00");
                Timer.setAttribute("text", "align: center; width: 250; font: asset/Michroma-Regular-msdf.json; color: #FF0000; negate: false; opacity: 1; alphaTest: 0.5");
                // Remettre le sky à sa rotation initiale
                sky.setAttribute("rotation", "0 0 0");
                console.log('⏰ Temps écoulé !');
            } else {
                let minutes = Math.floor(timeRemaining / 60);
                let seconds = timeRemaining % 60;
                let timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                Timer.setAttribute("value", timeString);
                
                // Changer la couleur en rouge quand il reste moins de 30 secondes
                if (timeRemaining <= 30) {
                    Timer.setAttribute("text", "align: center; width: 250; font: asset/Michroma-Regular-msdf.json; color: #FF0000; negate: false; opacity: 1; alphaTest: 0.5");
                }
            }
        }, 1000);
        
        // L'environnement 3D est maintenant explorable
        
        // Call the game start callback if provided
        if (onStartCallback && typeof onStartCallback === 'function') {
            console.log("Calling game start callback");
            onStartCallback();
        }
    });
    
    aScene.appendChild(startButton);

    return true;
}
