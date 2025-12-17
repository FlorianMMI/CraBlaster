
import {startGame} from './script.js';
import {startmenu} from './start.js';
import { ScoresData } from './data/data.js';

let name="";

export async function endgame(scoregames,questioncounter,totalscore) {
    let timerDisplay = document.querySelector("#timerDisplay");
    if (timerDisplay) {
        timerDisplay.parentNode.removeChild(timerDisplay);
    }
  
    let scoreDisplay = document.querySelector("#scoreDisplay");
    if (scoreDisplay) {
        scoreDisplay.parentNode.removeChild(scoreDisplay);
    }

    let aScene = document.querySelector("a-scene");
    let aText = document.createElement("a-text");
    aText.setAttribute("text", "value: Well done, you win the game!; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    aText.setAttribute("position", "0 9 -8");
    aText.setAttribute("width", "48");
    aText.setAttribute("align", "center");
    aScene.appendChild(aText);

    let ascore = document.createElement("a-text");
    ascore.setAttribute("text", "value: Questions: " + scoregames+"/"+questioncounter+" questions; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    ascore.setAttribute("position", "0 6 -8");
    ascore.setAttribute("width", "48");
    ascore.setAttribute("align", "center");
    aScene.appendChild(ascore);

    let atotalscore = document.createElement("a-text");
    atotalscore.setAttribute("text", "value: Total Score: " + totalscore+" points; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    atotalscore.setAttribute("position", "0 3 -8");
    atotalscore.setAttribute("width", "48");
    atotalscore.setAttribute("align", "center");
    aScene.appendChild(atotalscore);
    

// Keyboard && mondial score

let scoremondial = await ScoresData.fetchAll();

let newscore = scoremondial.map(entry => ({ name: entry.nom_record, score: entry.score_record }));




let plane = document.createElement('a-entity');
plane.setAttribute('geometry', {
    primitive: 'plane',
    width: 7,
    height: 9,
    side: 'double'
});

plane.setAttribute('material', {
    color: '#000',
    opacity: 0.8,
    side: 'double'
});

plane.setAttribute('position', '0 1  7');
plane.setAttribute('rotation', '0 180 0'); // Adding rotation

let planeText = document.createElement('a-entity');
planeText.setAttribute('text', {
    value: 'Mondial Score',
    align: 'center',
    color: '#ffffff',
    width: 15,
    side: 'double',
    font: "asset/Audiowide-Regular-msdf.json",
    negate: false,
});
planeText.setAttribute('position', '0 4 0.01'); // Positioning text at the top of the plane

plane.appendChild(planeText);

newscore.forEach((entry, index) => {
    let numberText = document.createElement('a-entity');
    numberText.setAttribute('text', {
        value: `${index + 1}.`,
        align: 'left', // Align text to end
        color: '#ffffff',
        width: 10,
        side: 'double',
        font: "asset/Michroma-Regular-msdf.json",
        negate: false,
    });
    numberText.setAttribute('position', `2 ${3 - index * 0.5} 0.01`); // Adjusting position for number

    let nameText = document.createElement('a-entity');
    nameText.setAttribute('text', {
        value: `${entry.name}`,
        align: 'center', // Align text to center
        color: '#ffffff',
        width: 10,
        side: 'double',
        font: "asset/Michroma-Regular-msdf.json",
        negate: false,
    });
    nameText.setAttribute('position', `0 ${3 - index * 0.5} 0.01`); // Adjusting position for name

    let scoreText = document.createElement('a-entity');
    scoreText.setAttribute('text', {
        value: `${entry.score}`,
        align: 'right', // Align text to start
        color: '#ffffff',
        width: 10,
        side: 'double',
        font: "asset/Michroma-Regular-msdf.json",
        negate: false,
    });
    scoreText.setAttribute('position', `-2 ${3 - index * 0.5} 0.01`); // Adjusting position for score

    plane.appendChild(numberText);
    plane.appendChild(nameText);
    plane.appendChild(scoreText);
});

aScene.appendChild(plane);


let map = aScene.dataset.map;

let keyboard = false;
let displayText;
let titletext;
let subtext;

if(totalscore>0){

keyboard = document.createElement('a-entity');
keyboard.setAttribute('geometry', {
    primitive: 'plane',
    width: 1.2,
    height: 0.4,
    side: 'double'
});
keyboard.setAttribute('material', {
    color: '#000'
});
keyboard.setAttribute('position', '1 1 2');
keyboard.setAttribute('rotation', '-45 -90 0'); // Adding rotation

const keys = [
    'A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M',
    'W', 'X', 'C', 'V', 'B', 'N', 'Return',
    'Save'
];

keys.forEach((key, index) => {
    let keyEntity = document.createElement('a-entity');
    if (key === 'Return') {
        keyEntity.setAttribute('geometry', {
            primitive: 'plane',
            width: 0.4,
            height: 0.1,
            side: 'double'
        });
    } else if(key === 'Save') {
        keyEntity.setAttribute('geometry', {
            primitive: 'plane',
            width: 0.5,
            height: 0.15,
            side: 'double',
        });
    } else {
        keyEntity.setAttribute('geometry', {
            primitive: 'plane',
            width: 0.1,
            height: 0.1,
            side: 'double'
        });
    }
    if(key === 'Save') {
        keyEntity.setAttribute('material', {
        
            src: "asset/Rectangle 4.png",
            transparent: true,
            side: 'double',
            font: "asset/Michroma-Regular-msdf.json",
            negate: false,
            
        });
    }else{
    keyEntity.setAttribute('material', {
        
        color: '#444444',
        opacity: 0.8,
        side: 'double'
        
    });
}
    keyEntity.setAttribute('text', {
        value: key,
        align: 'center',
        color: '#ffffff',
        width: 2,
        side: 'double',
        
    });
    keyEntity.setAttribute('class', 'clickable');
    if (key === 'Return') {
        keyEntity.setAttribute('position', `${(index % 10) * 0.11 - 0.32} ${-Math.floor(index / 10) * 0.11 + 0.1} 0.01`);
    } else if (key === 'Save') {
        keyEntity.setAttribute('position', '0 -0.3 0.01');
    } else {
        keyEntity.setAttribute('position', `${(index % 10) * 0.11 - 0.5} ${-Math.floor(index / 10) * 0.11 + 0.1} 0.01`);
    }
    keyboard.appendChild(keyEntity);
});

aScene.appendChild(keyboard);

displayText = document.createElement('a-entity');
displayText.setAttribute('text', {
    value: '',
    align: 'center',
    color: '#ffffff',
    width: 4,
    side: 'double'
});
displayText.setAttribute('position', '1 1.5 2');
displayText.setAttribute('rotation', '0 -90 0'); // Adding rotation   
aScene.appendChild(displayText);

titletext = document.createElement('a-entity');
titletext.setAttribute('text', {
    value: 'Save Your Score !',
    align: 'center',
    color: '#ffffff',
    width: 5,
    side: 'double',
    font: "asset/Michroma-Regular-msdf.json",
    negate: false,
});
titletext.setAttribute('position', '1 2 2');
titletext.setAttribute('rotation', '0 -90 0'); // Adding rotation
aScene.appendChild(titletext);


subtext = document.createElement('a-entity');
subtext.setAttribute('text', {
    value: '(Enter 5 letters)',
    align: 'center',
    color: '#ffffff',
    width: 2,
    side: 'double',
    font: "asset/Michroma-Regular-msdf.json",
    negate: false,
});
subtext.setAttribute('position', '1 1.8 2');
subtext.setAttribute('rotation', '0 -90 0'); // Adding rotation
aScene.appendChild(subtext);

keyboard.addEventListener('click', async function (event) {
    if (event.target && event.target.getAttribute('text')) {
        
        let key = event.target.getAttribute('text').value;
        let currentText = displayText.getAttribute('text').value;
        
        if (key === 'Return') {
            displayText.setAttribute('text', 'value', currentText.slice(0, -1));
        } else if (currentText.length < 5 && key !== 'Save') {
            displayText.setAttribute('text', 'value', currentText + key);
        }

        if(key === 'Save' && currentText.length >= 5){ 
            name = currentText;
            keyboard.parentNode.removeChild(keyboard);
            titletext.setAttribute('text', 'value', 'Your score is saved!');


            subtext.setAttribute('text', 'value', "score:"+totalscore);
            subtext.setAttribute('position', '1 1.7 2');
            subtext.setAttribute('text','width', 4);
            

            await ScoresData.post(name, totalscore, map);

            let newscoremondial = await ScoresData.fetchAll();
            newscore= newscoremondial.map(entry => ({ name: entry.nom_record, score: entry.score_record }));

            
            plane.innerHTML = ''; // Clear existing content

            let planeText = document.createElement('a-entity');
            planeText.setAttribute('text', {
                value: 'Mondial Score',
                align: 'center',
                color: '#ffffff',
                width: 15,
                side: 'double',
                font: "asset/Audiowide-Regular-msdf.json",
                negate: false,
            });
            planeText.setAttribute('position', '0 4 0.01'); // Positioning text at the top of the plane

            plane.appendChild(planeText);

            newscore.forEach((entry, index) => {
                let numberText = document.createElement('a-entity');
                numberText.setAttribute('text', {
                    value: `${index + 1}.`,
                    align: 'left',
                    color: '#ffffff',
                    width: 10,
                    side: 'double',
                    font: "asset/Michroma-Regular-msdf.json",
                    negate: false,
                });
                numberText.setAttribute('position', `2 ${3 - index * 0.5} 0.01`);

                let nameText = document.createElement('a-entity');
                nameText.setAttribute('text', {
                    value: `${entry.name}`,
                    align: 'center',
                    color: '#ffffff',
                    width: 10,
                    side: 'double',
                    font: "asset/Michroma-Regular-msdf.json",
                    negate: false,
                });
                nameText.setAttribute('position', `0 ${3 - index * 0.5} 0.01`);

                let scoreText = document.createElement('a-entity');
                scoreText.setAttribute('text', {
                    value: `${entry.score}`,
                    align: 'right',
                    color: '#ffffff',
                    width: 10,
                    side: 'double',
                    font: "asset/Michroma-Regular-msdf.json",
                    negate: false,
                });
                scoreText.setAttribute('position', `-2 ${3 - index * 0.5} 0.01`);

                plane.appendChild(numberText);
                plane.appendChild(nameText);
                plane.appendChild(scoreText);
            });

    
        }

    }
    
});

}










////script button

    let menuButton = document.createElement("a-entity");
    
    
    menuButton.setAttribute("geometry", "primitive: plane; width: 3.6; height: 0.8;");
    
    menuButton.setAttribute("material", "src: url(asset/Rectangle 4.png); transparent: true");

    menuButton.setAttribute("text", "value: Return to Menu; align: center; width: 10; font: asset/Michroma-Regular-msdf.json; negate: false; opacity: 1; alphaTest: 0.5");
    menuButton.setAttribute("position", "-2 0.5 -3");
    menuButton.setAttribute("class", "clickable");
    menuButton.addEventListener("click", async function () {


        aText.parentNode.removeChild(aText);
        ascore.parentNode.removeChild(ascore);
        atotalscore.parentNode.removeChild(atotalscore);
        menuButton.parentNode.removeChild(menuButton);
        startButton.parentNode.removeChild(startButton);
        if (keyboard && keyboard.parentNode) {
            keyboard.parentNode.removeChild(keyboard);
            if (displayText.parentNode) {
                displayText.parentNode.removeChild(displayText);
            }
            if (titletext.parentNode) {
                titletext.parentNode.removeChild(titletext);
            }
            if (subtext.parentNode) {
                subtext.parentNode.removeChild(subtext);
            }  
        } 
        if ( displayText.parentNode) {
            displayText.parentNode.removeChild(displayText);
        }
        if (titletext.parentNode) {
            titletext.parentNode.removeChild(titletext);
        }
        if (subtext.parentNode) {
            subtext.parentNode.removeChild(subtext);
        } 
        
            plane.parentNode.removeChild(plane);
        let ambientSound = document.querySelector("#ambient");
        if (ambientSound) {
            ambientSound.pause();
            ambientSound.currentTime = 0;
        }
        
        startmenu();
        setTimeout(resetRaycaster, 500);

    });
    aScene.appendChild(menuButton);






    let startButton = document.createElement("a-entity");
    
    
    startButton.setAttribute("geometry", "primitive: plane; width: 2.4; height: 0.8;");
    
    startButton.setAttribute("material", "src: url(asset/Rectangle 4.png); transparent: true");

    startButton.setAttribute("text", "value: RESTART; align: center; width: 10; font: asset/Michroma-Regular-msdf.json; negate: false; opacity: 1; alphaTest: 0.5");
    startButton.setAttribute("position", "2 0.5 -3");
    startButton.setAttribute("class", "clickable");
    startButton.addEventListener("click", async function () {
        aText.parentNode.removeChild(aText);
        ascore.parentNode.removeChild(ascore);
        atotalscore.parentNode.removeChild(atotalscore);
        menuButton.parentNode.removeChild(menuButton);
        startButton.parentNode.removeChild(startButton);
        if (keyboard && keyboard.parentNode) {
            keyboard.parentNode.removeChild(keyboard);
            if ( displayText.parentNode) {
                displayText.parentNode.removeChild(displayText);
            }
            if (titletext.parentNode) {
                titletext.parentNode.removeChild(titletext);
            }
            if (subtext.parentNode) {
                subtext.parentNode.removeChild(subtext);
            }  
        }

        if ( displayText.parentNode) {
            displayText.parentNode.removeChild(displayText);
        }
        if (titletext.parentNode) {
            titletext.parentNode.removeChild(titletext);
        }
        if (subtext.parentNode) {
            subtext.parentNode.removeChild(subtext);
        } 
        
        plane.parentNode.removeChild(plane);
        
        if (map == "default"){
            startGame(false, 3, "All", true);
        }
        else if (map == "large"){
            startGame(false, 8, "All", true);
        }
        
    });
    aScene.appendChild(startButton);
    
}



function resetRaycaster() {
    let rightController = document.querySelector("#rightController");
    let leftController = document.querySelector("#leftController");

    if (rightController && rightController.components.raycaster) {
        rightController.components.raycaster.refreshObjects();
    }
    if (leftController && leftController.components.raycaster) {
        leftController.components.raycaster.refreshObjects();
    }
}