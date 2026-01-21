// Version simplifiée sans dépendances externes
import { getScore } from "./game.js";

export function endmenu(onRestartCallback) {
    let aScene = document.querySelector("a-scene");
    let sky = document.querySelector("a-sky");
    let player = document.querySelector("#player");

    // Téléporter le joueur au spawn
    if (player) {
        player.setAttribute("position", "0 0 0");
        player.setAttribute("rotation", "0 0 0");
        console.log('🎯 Joueur téléporté au spawn');
    }

    let title = document.createElement("a-text");
    title.setAttribute("text", "value: Partie Terminée !; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    title.setAttribute("position", `0 5 -5`);
    title.setAttribute("width", "36");
    title.setAttribute("align", "center");
    aScene.append(title);

    let plane = document.createElement("a-plane");
    plane.setAttribute("material", "shader: flat; side: double; color: #000000; opacity: 0.4");
    plane.setAttribute("geometry", "primitive: plane; width: 14; height: 3");
    plane.setAttribute("position", `0 2.2 -5.2`);
    aScene.appendChild(plane);

    let finalScore = getScore();
    
    let paragraph = document.createElement("a-text");
    paragraph.setAttribute("value", `Votre Score est: ${finalScore}`);
    paragraph.setAttribute("position", `0 2.2 -5`);
    paragraph.setAttribute("text", "align: center; width: 13; font: asset/Michroma-Regular-msdf.json; color: #FFD700; negate: false; opacity: 1; alphaTest: 0.5");
    aScene.appendChild(paragraph);

    let RestartButton = document.createElement("a-entity");
    RestartButton.setAttribute("geometry", "primitive: plane; width: 2; height: 0.9;");
    RestartButton.setAttribute("material", "src: url(asset/Rectangle 4.png); transparent: true");
    RestartButton.setAttribute("text", "value: RESTART; align: center; width: 10; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    RestartButton.setAttribute("position", "0 0.5 -3");
    RestartButton.setAttribute("class", "clickable");

    RestartButton.addEventListener("click", async function () {
        console.log("Restart button clicked in end.js");
        title.parentNode.removeChild(title);
        plane.parentNode.removeChild(plane);
        paragraph.parentNode.removeChild(paragraph);
        RestartButton.parentNode.removeChild(RestartButton);
        
        // Rotation du sky au lancement de la partie
        sky.setAttribute("rotation", "180 0 0");
        
        // Récupérer le timer et le score existants et les remettre à zéro
        let existingTimer = aScene.querySelectorAll('a-text');
        for (let timer of existingTimer) {
            let value = timer.getAttribute('value');
            if (value && value.includes(':')) {
                timer.setAttribute("value", "2:00");
                timer.setAttribute("text", "align: right; width: 2; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
                console.log('⏱️ Timer remis à zéro');
            }
        }
        
        // Remettre le score à 0
        let existingScore = aScene.querySelector('[data-score-display]');
        if (existingScore) {
            existingScore.setAttribute("value", "Score: 0");
            existingScore.setAttribute("text", "align: right; width: 2; font: asset/Michroma-Regular-msdf.json; color: #FFD700; negate: false; opacity: 1; alphaTest: 0.5");
            console.log('🏆 Score remis à zéro');
        }
        
        // Déclencher le redémarrage de la partie
        aScene.emit('game-start');
        console.log('🎮 Partie relancée !');
        
        // Call the game start callback if provided
        if (onRestartCallback && typeof onRestartCallback === 'function') {
            console.log("Calling game restart callback");
            onRestartCallback();
        }
    });
    
    aScene.appendChild(RestartButton);

    return true;
}
