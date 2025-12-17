// Version simplifiée sans dépendances externes

export function startmenu() {
    let aScene = document.querySelector("a-scene");

    async function ambientSound() {
        let ambientSound = document.querySelector("#ambient");
        if (ambientSound) {
            ambientSound.play();
        }
    }

    ambientSound();
  
    let sky = document.createElement("a-sky");
    sky.setAttribute("src", "#ciel");
    aScene.appendChild(sky);

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

    let startButton = document.createElement("a-entity");
    startButton.setAttribute("geometry", "primitive: plane; width: 1.5; height: 0.9;");
    startButton.setAttribute("material", "src: url(asset/Rectangle 4.png); transparent: true");
    startButton.setAttribute("text", "value: START; align: center; width: 10; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    startButton.setAttribute("position", "0 0.5 -3");
    startButton.setAttribute("class", "clickable");

    startButton.addEventListener("click", async function () {
        title.parentNode.removeChild(title);
        plane.parentNode.removeChild(plane);
        paragraph.parentNode.removeChild(paragraph);
        startButton.parentNode.removeChild(startButton);
        // L'environnement 3D est maintenant explorable
    });
    
    aScene.appendChild(startButton);
}

startmenu();