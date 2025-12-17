/* SCRIPT.JS

Script principal de l'application. Il gère le fonctionnement constant du jeu
(un peu comme un loop() sur p5, three.js, etc.)

*/

import { data } from "./setup.js";
import { createPNJsForQuestion } from "./index.js";
import { endgame } from "./endgame.js";
import { startmenu } from "./start.js";



let scoregame = 0;
let totalscore = 0;

let ligne = 0;
let timer = 0;
let timermin = 0;
let timersec = 0;
let gamefinished = false;

let npcPositionSlots = [
    {
        name: "didNotHide",
        position: "0 -1 -4",
        occupied: false,
        npcId: null,
        textsize:25,
        textoffset: 4.5,
        rotation: "0 0 0",
        map: "default"
    },
    {
        name: "topOfHouse",
        position: "-19 13 7",
        occupied: false,
        npcId: null,
        textsize: 30,
        textoffset: 4.5,
        rotation: "0 90 0",
        map: "default"
    },
    {
        name: "nearCar",
        position: "-13 4 -15.5",
        occupied: false,
        npcId: null,
        textsize:25,
        textoffset: 4.5,
        rotation: "0 45 0",
        map: "default"
    },
    {
        name: "underLamp",
        position: "8 -1 12",
        occupied: false,
        npcId: null,
        textsize:25,
        textoffset: 4.5,
        rotation: "0 225 0",
        map: "default"
    },
    {
        name: "topOfBoxes",
        position: "-7 2 14",
        occupied: false,
        npcId: null,
        textsize:25,
        textoffset: 4.5,
        rotation: "0 145 0",
        map: "default"
    },
    {
        name: "betweenHouses",
        position: "17 -1 6",
        occupied: false,
        npcId: null,
        textsize:25,
        textoffset: 4.5,
        rotation: "0 -90 0",
        map: "default"
    },
    {
        name: "topOfBigHouse_right",
        position: "24 22 8",
        occupied: false,
        npcId: null,
        textsize: 50,
        textoffset: 6,
        rotation: "15 -115 0",
        map: "default"
    },
    {
        name: "topOfBigHouse_left",
        position: "-9 22 -20",
        occupied: false,
        npcId: null,
        textsize: 50,
        textoffset: 6,
        rotation: "15 15 0",
        map: "default"
    },
    

    // Map large
    {
        name: "behindTruck_nearSpawn",
        position: "6 -1 -39",
        occupied: false,
        npcId: null,
        textsize:25,
        textoffset: 4.5,
        rotation: "0 138 0",
        map: "large"
    },
    {
        name: "behindBoxes_nearSpawn",
        position: "-10.5 -1 25",
        occupied: false,
        npcId: null,
        textsize:25,
        textoffset: 4.5,
        rotation: "0 -45 0",
        map: "large"
    },
    {
        name: "inRocks_nearSpawn_left",
        position: "-58.5 -1 0.5",
        occupied: false,
        npcId: null,
        textsize:25,
        textoffset: 4.5,
        rotation: "0 -45 0",
        map: "large"
    },
    {
        name: "topOfDepot",
        position: "-64.5 -1 46",
        occupied: false,
        npcId: null,
        textsize:25,
        textoffset: 4.5,
        rotation: "0 -70 0",
        map: "large"
    },
    {
        name: "topOfSmallHouse",
        position: "-88 5.7 2.5",
        occupied: false,
        npcId: null,
        textsize: 35,
        textoffset: 4.5,
        rotation: "10 -15 0",
        map: "large"
    },
    {
        name: "onArmature",
        position: "-80 8 66",
        occupied: false,
        npcId: null,
        textsize: 35,
        textoffset: 4.5,
        rotation: "10 -15 0",
        map: "large"
    },
    {
        name: "onBoxes_nearPad",
        position: "35 1 30",
        occupied: false,
        npcId: null,
        textsize: 25,
        textoffset: 4.5,
        rotation: "0 20 0",
        map: "large"
    },
    {
        name: "middleOfHouses_far",
        position: "118 -1 107",
        occupied: false,
        npcId: null,
        textsize: 25,
        textoffset: 4.5,
        rotation: "0 20 0",
        map: "large"
    },
    {
        name: "underArmature",
        position: "140 -1 51.5",
        occupied: false,
        npcId: null,
        textsize: 25,
        textoffset: 4.5,
        rotation: "0 30 0",
        map: "large"
    },
    {
        name: "topOfDepot2",
        position: "119 2 35.5",
        occupied: false,
        npcId: null,
        textsize: 25,
        textoffset: 4.5,
        rotation: "0 40 0",
        map: "large"
    },
    {
        name: "nearLanders",
        position: "94.3 -1 -24.3",
        occupied: false,
        npcId: null,
        textsize: 25,
        textoffset: 4.5,
        rotation: "0 40 0",
        map: "large"
    },
    {
        name: "middleOfBoxes",
        position: "97 -1 -92.4",
        occupied: false,
        npcId: null,
        textsize: 25,
        textoffset: 4.5,
        rotation: "0 -90 0",
        map: "large"
    },
    {
        name: "nearRocks_far",
        position: "124.5 -1 -122.5",
        occupied: false,
        npcId: null,
        textsize: 25,
        textoffset: 4.5,
        rotation: "0 -135 0",
        map: "large"
    },
    {
        name: "behindLander_far",
        position: "51.5 -1 -132.5",
        occupied: false,
        npcId: null,
        textsize: 25,
        textoffset: 4.5,
        rotation: "0 -170 0",
        map: "large"
    },
    {
        name: "behindHouses_far",
        position: "-51 -1 -96",
        occupied: false,
        npcId: null,
        textsize: 25,
        textoffset: 4.5,
        rotation: "0 -130 0",
        map: "large"
    },
    {
        name: "behindDepot_inHouses",
        position: "-73 -1 -43",
        occupied: false,
        npcId: null,
        textsize: 25,
        textoffset: 4.5,
        rotation: "0 -45 0",
        map: "large"
    },

]



// Fait toute la longueur du document
export function startGame(muted,timechoose, difficultychoose, hideSeek) {
    /* For testing purposes
    for (let position of npcPositionSlots) {
        let aBox = document.createElement("a-box");
        aBox.setAttribute("position", position.position);
        aBox.setAttribute("color", "red");
        aBox.setAttribute("depth", "1");
        aBox.setAttribute("height", "1");
        aBox.setAttribute("width", "1");
        aBox.setAttribute("rotation", position.rotation);
        aBox.setAttribute("side", "double");
        document.querySelector("a-scene").appendChild(aBox);
    
        let aText = document.createElement("a-text");
        aText.setAttribute("value", position.name);
        aText.setAttribute("color", "white");
        aText.setAttribute("align", "center");
        aText.setAttribute("width", position.textsize);
        aText.setAttribute("rotation", position.rotation);
        aText.setAttribute("side", "double");
        aText.setAttribute("position", `${position.position.split(' ')[0]} ${parseFloat(position.position.split(' ')[1]) + 2} ${position.position.split(' ')[2]}`);
        document.querySelector("a-scene").appendChild(aText);
    }
    */

    let timermax = timechoose;
    let aSceneTemp = document.querySelector("a-scene");    
    let mapGlobal = aSceneTemp.dataset.map;


    gamefinished = false;
    //Liste des questions déjà utilisées
    let questionsUtilisees = [];

    

    


    /* ambientSound

    Ne prend aucun argument, ne retourne rien.
    Mettre un son d'ambiance au lancement du jeu.

    */
    async function ambientSound() {
        let ambientSound = document.querySelector("#ambient");
        ambientSound.play();
    }

    if (muted) {
        ambientSound();
        console.log("Notmuted");
    }
    else{
        let ambientSound = document.querySelector("#ambient");
        ambientSound.pause();
        console.log("muted");
    }

    let questionEnCours;
    switch (difficultychoose) {
        case "All" :
        case 1 :

            questionEnCours = data.questions.niveau1[Math.floor(Math.random() * data.questions.niveau1.length)];
            while (questionsUtilisees.includes(questionEnCours)) {
                questionEnCours = data.questions.niveau1[Math.floor(Math.random() * data.questions.niveau1.length)];
            }
            break;
        
        case 2 :
           
            questionEnCours = data.questions.niveau2[Math.floor(Math.random() * data.questions.niveau2.length)];
            while (questionsUtilisees.includes(questionEnCours)) {
                questionEnCours = data.questions.niveau2[Math.floor(Math.random() * data.questions.niveau2.length)];
            }
            break;

        case 3 :
           
            questionEnCours = data.questions.niveau3[Math.floor(Math.random() * data.questions.niveau3.length)];
            
            while (questionsUtilisees.includes(questionEnCours)) {
                questionEnCours = data.questions.niveau3[Math.floor(Math.random() * data.questions.niveau3.length)];
            }
            break;
    }
    
    let nbMauvaisesReponses = questionEnCours.reponses.filter(reponse => !reponse.est_correcte).length;
    questionEnCours.score = 0;
    if (questionEnCours.niveau_question == 1){
        if (nbMauvaisesReponses == 1){
            questionEnCours.score = 5;
        }
        else if (nbMauvaisesReponses == 2){
            questionEnCours.score = 10;
        }
        else if (nbMauvaisesReponses == 3){
            questionEnCours.score = 15;
        }
    }
    else if (questionEnCours.niveau_question == 2){
        if (nbMauvaisesReponses == 1){
            questionEnCours.score = 10;
        }
        else if (nbMauvaisesReponses == 2){
            questionEnCours.score = 15;
        }
        else if (nbMauvaisesReponses == 3){
            questionEnCours.score = 20;
        }
    }
    else if (questionEnCours.niveau_question == 3){
        if (nbMauvaisesReponses == 1){
            questionEnCours.score = 15;
        }
        else if (nbMauvaisesReponses == 2){
            questionEnCours.score = 20;
        }
        else if (nbMauvaisesReponses == 3){
            questionEnCours.score = 25;
        }
    }

    questionsUtilisees.push(questionEnCours);

    /* renderPNJsForQuestion

    Prend une question comme argument.
    Crée un PNJ pour chaque réponse de la question, l'ajoute au tableau des PNJs puis l'affiche.
    Ne retourne ne rien.
    Notes : Pour l'instant, affiche des cubes. Affiche les PNJs de droite à gauche.

    */

    let renderPNJsForQuestion = function(question, hideSeek) {
        let PNJsForQuestion = createPNJsForQuestion(question);
        let aScene = document.querySelector("a-scene");
        let distance = 4; // Distance between the boxes
        let checkclick = false;

        // Calculate the center position based on the number of PNJs
        let centerPosition = -(PNJsForQuestion.length - 1) * distance / 2;

        for (let i = 0; i < PNJsForQuestion.length; i++) {
            let PNJ = PNJsForQuestion[i];

            // Create the a-box element for each PNJ (the PNJ box itself)
            let models = ["#astro", "#astro1", "#astro2"];
            let randomModel = models[Math.floor(Math.random() * models.length)];

            let aBox = document.createElement("a-entity");
            aBox.setAttribute("id", `pnj`);
            aBox.setAttribute("data-id", PNJ.id);
            aBox.setAttribute("gltf-model", randomModel);
            aBox.setAttribute("side", "double");
            let position;
            let chosenSlot;
            if (!hideSeek) {
                // Calculate the position of each PNJ relative to the center
                position = centerPosition + (i * distance);
                aBox.setAttribute("position", `${position} -1 -8`);
            } else {
                let randomPosition = Math.floor(Math.random() * npcPositionSlots.length);
                while (npcPositionSlots[randomPosition].occupied || npcPositionSlots[randomPosition].map != mapGlobal) {
                    randomPosition = Math.floor(Math.random() * npcPositionSlots.length);
                }
                chosenSlot = npcPositionSlots[randomPosition];
                chosenSlot.occupied = true;
                chosenSlot.npcId = PNJ.id;
                position = chosenSlot.position;
                aBox.setAttribute("rotation", chosenSlot.rotation);
                aBox.setAttribute("position", position);
            }
            aBox.setAttribute("transparent", "true");
            aBox.setAttribute("opacity", "1");
            aBox.setAttribute("visible", "true");
            aBox.setAttribute("scale", "1.3 1.3 1.3");
            aBox.setAttribute("class", "clickable");
            
            aBox.addEventListener("model-loaded", (event) => {
                // Attendre un peu avant d'ajouter l'animation-mixer
                setTimeout(() => {
                    aBox.setAttribute("animation-mixer", "clip: CharacterArmature|Idle; loop: repeat; timeScale: 1");
                }, 1000);
            });

            
            // Create the a-text element for displaying the PNJ response (the text)
            let aText = document.createElement("a-text");
            let nvlle_rep;
            if (PNJ.reponse.texte_reponse.length > 15) {
                for (let i = 14; i < PNJ.reponse.texte_reponse.length; i++) {
                    if (PNJ.reponse.texte_reponse[i] == " ") {
                        nvlle_rep = PNJ.reponse.texte_reponse.substring(0, i) + "\n" + PNJ.reponse.texte_reponse.substring(i);
                        break;
                    }
                    if (i == PNJ.reponse.texte_reponse.length - 1) {
                        nvlle_rep = PNJ.reponse.texte_reponse;
                    }
                }
            } else {
                nvlle_rep = PNJ.reponse.texte_reponse;
            }
            aText.setAttribute("text", "value: " + nvlle_rep + "; font: asset/Michroma-Regular-msdf.json; negate: false; opacity: 1; alphaTest: 0.5");
            
            aText.setAttribute("color", "white");
            aText.setAttribute("width", "20");
            aText.setAttribute("align", "center");

            if (!hideSeek) {
                if (PNJ.reponse.texte_reponse.length > 20) {
                if (ligne % 2 == 0) {
                    aText.setAttribute("position", `${position} 4 -8`);
                    ligne++;
                } else {
                    aText.setAttribute("position", `${position} 5.5 -8`);
                    ligne++;
                }
            }
            else {
                aText.setAttribute("position", `${position} 4 -8`);
            }
            } else {
                aText.setAttribute("position", `${position.split(' ')[0]} ${parseFloat(position.split(' ')[1]) + chosenSlot.textoffset} ${position.split(' ')[2]}`);
                aText.setAttribute("rotation", chosenSlot.rotation);
                aText.setAttribute("width", chosenSlot.textsize);
            }

            // Append the created elements to the a-scene
            aScene.appendChild(aBox);
            aScene.appendChild(aText);

            // Optionally store the PNJ in the data.pnjs array for future use
            data.pnjs.push(PNJ);

            if (PNJ.reponse.est_correcte) { // Bonne réponse

               
                // Add event listeners for the PNJ boxes if needed (e.g., for animations or clicks)
                aBox.addEventListener("click", function (event) {
                    let randomposition = Math.random() < 0.5 ? -20 : 20;
                    let rotationposition;
                    if (randomposition == -20) {
                        rotationposition = -45;
                    } else {
                        rotationposition = 45;
                    }

                    if (!aBox.clicked && !checkclick) {
                        checkclick = true;

                        if (muted) {
                            let successAudio = document.querySelector("#success");
                            successAudio.play();
                        }

                        aBox.clicked = true;
                        revealAliens(1);
                    
                        setTimeout(() => {
                            aBox.setAttribute("animation-mixer", "clip: CharacterArmature|Wave; loop: repeat; timeScale: 1");
                        }, 1000);
                    
                        aBox.setAttribute("animation-mixer", "clip: CharacterArmature|Yes; loop: repeat; timeScale: 1");

                        
                        scoregame++;
                        totalscore += questionEnCours.score;

                        if (!hideSeek) {
                            setTimeout(() => {
                                aBox.setAttribute("animation-mixer", "clip: CharacterArmature|Walk; loop: repeat; timeScale: 1");
                                aBox.setAttribute('animation__position', {
                                    property: 'position',
                                    to: `${randomposition} -1 -1.5`,
                                    dur: 2000,
                                    easing: 'easeInSine'
                                });
                                aBox.setAttribute('animation__rotation', {
                                    property: 'rotation',
                                    to: `0 ${rotationposition} 0`,
                                    dur: 200,
                                    easing: 'easeInSine'
                                });
                            
                                setTimeout(() => {
                                    removePNJ(PNJ.id);
                                    resetUFO();
                                    renderNextQuestion(hideSeek);
                                    checkclick = false;
                                }, 2000);
                            }, 2500);
                        } else {
                            setTimeout(() => {
                                aBox.setAttribute('animation__position', {
                                    property: 'opacity',
                                    to: 0,
                                    dur: 2000,
                                    easing: 'linear'
                                });

                                setTimeout(() => {
                                    removePNJ(PNJ.id);
                                    resetUFO();
                                    renderNextQuestion(hideSeek);
                                    checkclick = false;
                                }, 2000);
                            }, 2500);
                        }
                    }
                });
            } else { // Mauvaise réponse
                aBox.setAttribute("sound", "src: #fail; on: click");

                // Add event listeners for the PNJ boxes if needed (e.g., for animations or clicks)

                aBox.addEventListener("click", function (event) {

                    if (!aBox.clicked && !checkclick) {
                        checkclick = true;
                        aBox.clicked = true;
                        // Example animation when the box is clicked

                        if (muted) {
                            let failAudio = document.querySelector("#fail");
                            failAudio.play();
                            // Play beam sound when the beam appears
                            let beamSound = document.querySelector("#beamSound");
                            if (!beamSound) {
                                beamSound = document.createElement("audio");
                                beamSound.setAttribute("src", "asset/beam.mp3");
                                beamSound.setAttribute("id", "beamSound");
                                document.querySelector("a-scene").appendChild(beamSound);
                            }
                            setTimeout(() => {
                                beamSound.play();
                            }, 2000);
                        }
                    
                        let npcX = aBox.getAttribute('position').x;
                        let npcY = aBox.getAttribute('position').y;
                        let npcZ = aBox.getAttribute('position').z;
                        moveUFO(npcX, npcY, npcZ, hideSeek);

                        revealAliens(2);
                        
                        setTimeout(() => {
                            let currentPosition = aBox.getAttribute('position');
                            let drone = document.querySelector("#drone");
                            let dronePosition = drone.getAttribute('position');
                            aBox.setAttribute('animation', {
                                property: 'position',
                                to: dronePosition,
                                dur: 1000,
                                easing: 'easeInSine'
                            });

                            // Optionally remove the PNJ after some time
                            setTimeout(() => {
                                removePNJ(PNJ.id);
                                resetUFO();
                                renderNextQuestion(hideSeek);
                                checkclick = false;
                            }, 2000);
                        }, 2000);
                    }
                });
            }
        }
    }

    renderPNJsForQuestion(questionEnCours, hideSeek);

    /* renderQuestion

    Prend une question comme argument.
    Affiche la question en haut de la page.

    */

    let renderQuestion = function(question, hideSeek) {
        let aScene = document.querySelector("a-scene");
        let questionEntity = document.createElement("a-entity");
        let position = '0 6 -6';
        if (mapGlobal == "large") {
            position = '0 80 -160';
            questionEntity.setAttribute("scale", "16 16 16");
        }
        questionEntity.setAttribute("text", {
            value: question.texte_question,
            align: "center",
            color: "white",
            width: 24,
            font: "asset/Audiowide-Regular-msdf.json",
            color: "#FFFFFF", 
            negate: false,
            opacity: 1,
            alphaTest: 0.5
        });
        questionEntity.setAttribute("position", position);
        aScene.appendChild(questionEntity);

        if (hideSeek && !(mapGlobal == "large")) {
            let adviceEntity = document.createElement("a-entity");
            let position = '0 5 -6';
            adviceEntity.setAttribute("id", "advice-text");
            adviceEntity.setAttribute("text", {
                value: "(Look around you !)",
                align: "center",
                color: "white",
                width: 12,
                font: "asset/Audiowide-Regular-msdf.json",
                color: "#FFFFFF", 
                negate: false,
                opacity: 1,
                alphaTest: 0.5
            });
            adviceEntity.setAttribute("position", position);
            aScene.appendChild(adviceEntity);
        }
    }

    renderQuestion(questionEnCours, hideSeek);

    /* removeAllPNJs

    Ne prend aucun argument.
    Retire tous les PNJs de la scène.
    Ne retourne rien.
    Vide aussi le tableau des PNJs.

    */

    let removeAllPNJs = function() {
        let aScene = document.querySelector("a-scene");

        // Remove all PNJ elements (boxes)
        let PNJs = document.querySelectorAll("#pnj");
        PNJs.forEach(PNJ => aScene.removeChild(PNJ));

        // Remove all PNJ texts
        let PNJTexts = document.querySelectorAll("a-text");
        PNJTexts.forEach(PNJText => aScene.removeChild(PNJText));

        // Optionally, also remove the dynamic text
        let dynamicText = document.querySelector("#dynamicText");
        if (dynamicText) {
            aScene.removeChild(dynamicText);
        }
       
        for (let position of npcPositionSlots) {
            position.occupied = false;
            position.npcId = null;
        }

        // Clear the array of PNJs
        data.pnjs = [];
    }

    /* removePNJ

    Prend une ID de PNJ comme argument.
    Retire ce PNJ spécifique de la scène.
    Ne retourne rien.
    Retire aussi le PNJ du tableau des PNJs.

    */

    let removePNJ = function(id) {
        let aScene = document.querySelector("a-scene");
        let PNJs = document.querySelectorAll("#pnj");
        for (let PNJ of PNJs) {
            if (PNJ.dataset.id == id) {
                aScene.removeChild(PNJ);
                data.pnjs = data.pnjs.filter(pnj => pnj.id != id);
                break;
            }
        }
    }

    /* getPNJByID

    Prend une ID de PNJ comme argument.
    Retourne le PNJ correspondant.

    */

    let getPNJByID = function(id) {
        id = parseInt(id);
        return data.pnjs.find(pnj => pnj.id === id);
    }

    /* createUFO

    Prend une position X comme argument.
    Crée un objet UFO avec un vaisseau et un rayon de lumière.
    Ne retourne rien.

    */

    let moveUFO = function(posX, posY, posZ, hideSeek) {

        let drone = document.querySelector("#drone");
        let beam = document.createElement("a-entity");
        beam.setAttribute("id", "beam");
        beam.setAttribute("geometry", {
            primitive: "cylinder",
            radius: 2,
            height: 50,
        });
        if (!hideSeek) {
            beam.setAttribute("rotation", "-5 0 0");
            beam.setAttribute("position", `${posX} -1 -8`);
        } else {
            beam.setAttribute("rotation", "0 0 0");
            beam.setAttribute("position", `${posX} ${posY} ${posZ}`);
        }
        beam.setAttribute("material", {
            color: "#00FFFF",
            transparent: true,
            opacity: 0
        });
        setTimeout(() => {
            beam.setAttribute("animation", {
                property: 'material.opacity',
                to: 0.2,
                dur: 500,
                easing: 'easeInSine',
            });
        }, 1000);
        setTimeout(() => {
            beam.setAttribute("animation", {
                property: 'material.opacity',
                to: 0.5,
                dur: 500,
                easing: 'easeInSine',
                loop: true,
                dir: 'alternate'
            })
        }, 1500);

        let aScene = document.querySelector("a-scene");
        aScene.appendChild(beam);

        
        drone = document.querySelector("#drone");

        if (!hideSeek) {
            drone.setAttribute('animation', {
                property: 'position',
                to: `${posX} 25 -10`,
                dur: 1000,
                easing: 'easeInSine'
            });

            let lights1 = document.querySelectorAll("#light-left");
            lights1.forEach(light => {
                light.setAttribute('animation', {
                    property: 'position',
                    to: `${posX - 2} 21 -10`,
                    dur: 1000,
                    easing: 'easeInSine'
                });
            });

            let lights2 = document.querySelectorAll("#light-right");
            lights2.forEach(light => {
                light.setAttribute('animation', {
                    property: 'position',
                    to: `${posX + 2} 21 -10`,
                    dur: 1000,
                    easing: 'easeInSine'
                });
            });

            let lights = document.querySelectorAll("#drone-light");
            for (let light of lights) {
                let adjustedPosition = posX;
                if (light.getAttribute('rotation').x != 0) {
                    adjustedPosition = -posX;
                }
                light.setAttribute('animation', {
                    property: 'position',
                    to: `${adjustedPosition} 22 -10`,
                    dur: 1000,
                    easing: 'easeInSine'
                });
            }
        } else {
            drone.setAttribute('animation', {
                property: 'position',
                to: `${posX} ${posY + 26} ${posZ}`,
                dur: 1000,
                easing: 'easeInSine'
            });

            let lights1 = document.querySelectorAll("#light-left");
            lights1.forEach(light => {
                light.setAttribute('animation', {
                    property: 'position',
                    to: `${posX - 2} ${posY + 22} ${posZ}`,
                    dur: 1000,
                    easing: 'easeInSine'
                });
            });

            let lights2 = document.querySelectorAll("#light-right");
            lights2.forEach(light => {
                light.setAttribute('animation', {
                    property: 'position',
                    to: `${posX + 2} ${posY + 22} ${posZ}`,
                    dur: 1000,
                    easing: 'easeInSine'
                });
            });

            let lights = document.querySelectorAll("#drone-light");
            for (let light of lights) {
                let adjustedPosition = posX;
                if (light.getAttribute('rotation').x != 0) {
                    adjustedPosition = -posX;
                }
                light.setAttribute('animation', {
                    property: 'position',
                    to: `${adjustedPosition} ${posY + 23} ${posZ}`,
                    dur: 1000,
                    easing: 'easeInSine'
                });
            }

        }
    }

    /* resetUFO

    Ne prend aucun argument.
    Retire l'objet UFO de la scène.
    Ne retourne rien.

    */

    let resetUFO = function() {
        let aScene = document.querySelector("a-scene");
        let drone = document.querySelector("#drone");
        let lights = document.querySelectorAll("#drone-light");
        let beam = document.querySelector("#beam");

        // Check if the UFO and beam exist before removing/resetting them
        if (drone) {
            let posX = 0;
            drone.setAttribute('animation', {
                property: 'position',
                to: `${posX} 25 -10`,
                dur: 1000,
                easing: 'easeInSine'
            });
    
            let lights1 = document.querySelectorAll("#light-left");
            lights1.forEach(light => {
                light.setAttribute('animation', {
                    property: 'position',
                    to: `${posX - 2} 21 -10`,
                    dur: 1000,
                    easing: 'easeInSine'
                });
            });
    
            let lights2 = document.querySelectorAll("#light-right");
            lights2.forEach(light => {
                light.setAttribute('animation', {
                    property: 'position',
                    to: `${posX + 2} 21 -10`,
                    dur: 1000,
                    easing: 'easeInSine'
                });
            });
    
            let lights = document.querySelectorAll("#drone-light");
            for (let light of lights) {
                let adjustedPosition = posX;
                if (light.getAttribute('rotation').x != 0) {
                    adjustedPosition = -posX;
                }
                light.setAttribute('animation', {
                    property: 'position',
                    to: `${adjustedPosition} 22 -10`,
                    dur: 1000,
                    easing: 'easeInSine'
                });
            }
        }
        if (beam) {
            beam.parentNode.removeChild(beam);
        }
    }


    let maxquestions = 100;
    let questioncounter = 0;

    

    let timerInterval = setInterval(() => {
        timer++;
    }, 1000);


    let renderNextQuestion = function(hideSeek) {
        // Clear everything before rendering the new question
        removeAllPNJs();
        let timerDisplay = document.querySelector("#timerDisplay");
        if (timerDisplay) {
            timerDisplay.parentNode.removeChild(timerDisplay);
        }

        let scoreDisplay = document.querySelector("#scoreDisplay");
        if (scoreDisplay) {
            scoreDisplay.parentNode.removeChild(scoreDisplay);
        }

        // Remove the previous question from the scene (if needed)
        let aScene = document.querySelector("a-scene");
        let previousQuestion = document.querySelector("[text]"); // The text element displaying the question
        let adviceText = document.querySelector("#advice-text");
        if (previousQuestion) {
            aScene.removeChild(previousQuestion);
        }
        if (adviceText) {
            aScene.removeChild(adviceText);
        }

        // Optionally, reset the drone's position or any other objects
        resetUFO();

        // Choose a new question
        
        let questionEnCours;
        if (difficultychoose == "All") {
            
            if (timer < 60) {
            questionEnCours = data.questions.niveau1[Math.floor(Math.random() * data.questions.niveau1.length)];
            while (questionsUtilisees.includes(questionEnCours)) {
                questionEnCours = data.questions.niveau1[Math.floor(Math.random() * data.questions.niveau1.length)];
            }
            } else if (timer >= 60 && timer < 120) {
            questionEnCours = data.questions.niveau2[Math.floor(Math.random() * data.questions.niveau2.length)];
            while (questionsUtilisees.includes(questionEnCours)) {
                questionEnCours = data.questions.niveau2[Math.floor(Math.random() * data.questions.niveau2.length)];
            }
            } else if (timer >= 120) {
            questionEnCours = data.questions.niveau3[Math.floor(Math.random() * data.questions.niveau3.length)];
            while (questionsUtilisees.includes(questionEnCours)) {
                questionEnCours = data.questions.niveau3[Math.floor(Math.random() * data.questions.niveau3.length)];
            }
            }
        } else{
           
            switch (difficultychoose) {
                case 1 :
                    
                    questionEnCours = data.questions.niveau1[Math.floor(Math.random() * data.questions.niveau1.length)];
                    while (questionsUtilisees.includes(questionEnCours)) {
                        questionEnCours = data.questions.niveau1[Math.floor(Math.random() * data.questions.niveau1.length)];
                    }
                    break;
                
                case 2 :
                    
                    questionEnCours = data.questions.niveau2[Math.floor(Math.random() * data.questions.niveau2.length)];
                    while (questionsUtilisees.includes(questionEnCours)) {
                        questionEnCours = data.questions.niveau2[Math.floor(Math.random() * data.questions.niveau2.length)];
                    }
                    break;

                case 3 :
                    
                    questionEnCours = data.questions.niveau3[Math.floor(Math.random() * data.questions.niveau3.length)];
                    
                    while (questionsUtilisees.includes(questionEnCours)) {
                        questionEnCours = data.questions.niveau3[Math.floor(Math.random() * data.questions.niveau3.length)];
                    }
                    break;
            }
        }

        ///Bonus && score

        if (Math.random() < 0.1) {
            questionEnCours.bonus = true;
        }
        let nbMauvaisesReponses = questionEnCours.reponses.filter(reponse => !reponse.est_correcte).length;
        questionEnCours.score = 0;
        if (questionEnCours.niveau_question == 1){
            if (nbMauvaisesReponses == 1){
                questionEnCours.score = 5;
            }
            else if (nbMauvaisesReponses == 2){
                questionEnCours.score = 10;
            }
            else if (nbMauvaisesReponses == 3){
                questionEnCours.score = 15;
            }
        }
        else if (questionEnCours.niveau_question == 2){
            if (nbMauvaisesReponses == 1){
                questionEnCours.score = 10;
            }
            else if (nbMauvaisesReponses == 2){
                questionEnCours.score = 15;
            }
            else if (nbMauvaisesReponses == 3){
                questionEnCours.score = 20;
            }
        }
        else if (questionEnCours.niveau_question == 3){
            if (nbMauvaisesReponses == 1){
                questionEnCours.score = 15;
            }
            else if (nbMauvaisesReponses == 2){
                questionEnCours.score = 20;
            }
            else if (nbMauvaisesReponses == 3){
                questionEnCours.score = 25;
            }
        }
        let aBigbox=false;
        if (questionEnCours.bonus){
            questionEnCours.score *= 2;
            ///////abigbox
            aBigbox = document.createElement("a-entity");
            aBigbox.setAttribute("id", `pnj`);
            aBigbox.setAttribute("gltf-model", "#astro");
            aBigbox.setAttribute("side", "double");
            aBigbox.setAttribute("position", `50 1 200`);
            aBigbox.setAttribute("rotation", "0 180 0");
            aBigbox.setAttribute("scale", "30 30 30");
            aBigbox.setAttribute("animation-mixer", "clip: CharacterArmature|Wave; loop: repeat; timeScale: 2");
            scene.appendChild(aBigbox);
            

        }else{
            if(aBigbox){
                scene.removeChild(aBigbox);
            }
        }

        let texteBonus = ''; // On ajoute du texte si c'est une question bonus
        if (questionEnCours.bonus) {
            texteBonus = '(Bonus !) ';
        }
        else {
            texteBonus = '';
        }

        questionsUtilisees.push(questionEnCours);

        // After half a second
        setTimeout(() => {
            let aScene = document.querySelector("a-scene");
            let text = document.createElement("a-text");
            text.setAttribute("text", "value: " + texteBonus + "Next question...; font: asset/Audiowide-Regular-msdf.json; negate: false; opacity: 1; alphaTest: 0.5");
            questioncounter++;
            text.setAttribute("position", "0 2 -6");
            text.setAttribute("color", "white");
            text.setAttribute("width", "48");
            text.setAttribute("align", "center");
            text.setAttribute("id", "nextQuestionText")
            aScene.appendChild(text);
        }, 500)

        // After 2.5 seconds
        setTimeout(() => {
            let aScene = document.querySelector("a-scene");
            let text = document.querySelector("#nextQuestionText");
            aScene.removeChild(text);
        }, 2500)

        // After 3 seconds
        setTimeout(async () => {
            // Filter unused questions
           
            // If there are no more unused questions, you can either:
            // 1. Reset the questionsUtilisees list (optional)
            // 2. Display a message that the game is over (recommended)
            if (questioncounter >= maxquestions || timer >= timermax*60) {
                
                clearInterval(timerInterval);
                gamefinished = true;
                timer = 0;

                if(aBigbox){
                    scene.removeChild(aBigbox);
                }
                
                endgame(scoregame, questioncounter, totalscore);
                scoregame = 0;
                totalscore = 0;
                questioncounter = 0;
                ligne = 0;
                timermin = 0;
                timersec = 0;
                return;
                    
            }

            // Render the new question
            renderQuestion(questionEnCours, hideSeek);

            // Render PNJs for the new question
            renderPNJsForQuestion(questionEnCours, hideSeek);
        }, 3000);
    };

    /* revealAliens

    Ne prend aucun argument.
    Fait apparaître les aliens PNJs.
    Ne retourne rien.

    */

    let revealAliens = function( chiffre) {
        let PNJs = document.querySelectorAll("#pnj");
        for (let PNJ of PNJs) {
        

            
            let pnjData = data.pnjs.find(p => p.id == PNJ.dataset.id);
            if (pnjData) {
                if (!pnjData.reponse.est_correcte) {
                    PNJ.setAttribute("gltf-model", "#alien");
                    PNJ.removeAttribute("animation-mixer"); // Réinitialiser avant d'ajouter

                    if(chiffre == 1){
                        
                    PNJ.addEventListener("model-loaded", function () {
                        PNJ.setAttribute("animation-mixer", "clip: CharacterArmature|Duck; loop: repeat; timeScale: 1");
                        setTimeout(() => {
                            PNJ.setAttribute("animation-mixer", "clip: CharacterArmature|Idle; loop: repeat; timeScale: 1");
                        }, 1500);
                    
                    }, { once: true });
                }else if(chiffre == 2){
                    PNJ.addEventListener("model-loaded", function () {
                        PNJ.setAttribute("animation-mixer", "clip: CharacterArmature|Wave; loop: repeat; timeScale: 1");
                        setTimeout(() => {
                            PNJ.setAttribute("animation-mixer", "clip: CharacterArmature|Idle; loop: repeat; timeScale: 1");
                        }, 1500);
                    
                    }, { once: true });

                }
                    
                }
            }
        }
    }


    /* updateHUD

    Ne prend aucun argument.
    Met à jour l'affichage du temps et du score.
    Ne retourne rien.

    */
let quitbutton= function(){
    let aScene = document.querySelector("a-scene");
    
    let quitbutton = document.createElement("a-entity");

    quitbutton.setAttribute("geometry", "primitive: plane; width: 2; height: 0.9;");
    quitbutton.setAttribute("material", "src: url(asset/Rectangle 4.png); transparent: true");
    quitbutton.setAttribute("text", "value: Quit Game; align: center; width: 10; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    quitbutton.setAttribute("position", "0 0.5 5");
    quitbutton.setAttribute("rotation", "0 180 0");
    quitbutton.setAttribute("side", "double");
    quitbutton.setAttribute("class", "clickable");

    aScene.appendChild(quitbutton);


    quitbutton.addEventListener("click", async function () {

        clearInterval(timerInterval);
                
                
                location.reload();
    });
    
 
}
    // Call updateHUD every second
   
    quitbutton();

    let updateHUD = function() {
        let aScene = document.querySelector("a-scene");

        // Create or update the timer display
        let timerDisplay = document.querySelector("#timerDisplay");
        if (!timerDisplay) {
            timerDisplay = document.createElement("a-text");
            timerDisplay.setAttribute("id", "timerDisplay");
            if (mapGlobal == "default") {
                timerDisplay.setAttribute("position", "-3 1.5 1.5");
            }
            else if (mapGlobal == "large") {
                timerDisplay.setAttribute("position", "-160 50 0");
                timerDisplay.setAttribute("scale", "20 20 20");
            }
            timerDisplay.setAttribute("rotation", "0 90 0");
            timerDisplay.setAttribute("font", "asset/Audiowide-Regular-msdf.json");
            timerDisplay.setAttribute("negate", "false");
            timerDisplay.setAttribute("color", "white");
            timerDisplay.setAttribute("width", "10");
            aScene.appendChild(timerDisplay);
        }
        timerDisplay.setAttribute("value", `Time: ${timermin}min ${timersec}s`);

        // Create or update the score display
        let scoreDisplay = document.querySelector("#scoreDisplay");
        if (!scoreDisplay) {
            scoreDisplay = document.createElement("a-text");
            scoreDisplay.setAttribute("id", "scoreDisplay");
            if (mapGlobal == "default") {
                scoreDisplay.setAttribute("position", "3 1.5 1.5");
            }
            else if (mapGlobal == "large") {
                scoreDisplay.setAttribute("position", "160 50 0");
                scoreDisplay.setAttribute("scale", "20 20 20");
            }
            scoreDisplay.setAttribute("rotation", "0 -90 0");
            scoreDisplay.setAttribute("font", "asset/Audiowide-Regular-msdf.json");
            scoreDisplay.setAttribute("negate", "false");
            scoreDisplay.setAttribute("color", "white");
            scoreDisplay.setAttribute("width", "10");
            aScene.appendChild(scoreDisplay);
        }
        scoreDisplay.setAttribute("value", `Score: ${totalscore}`);
    }


    let gameInterval = setInterval(() => {
        if (gamefinished) {
            clearInterval(gameInterval);
            timersec = 0;
            timermin = 0;
        } else {
            timersec++;
            if (timersec >= 60) {
                timersec = 0;
                timermin++;
            }
            updateHUD();
        }
    }, 1000);
        
    

}
