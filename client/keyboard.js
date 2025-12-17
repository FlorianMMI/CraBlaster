let name="";

export function keyboard() {

    let aScene = document.querySelector("a-scene");

let keyboard = document.createElement('a-entity');
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
        side: 'double'
    });
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

let displayText = document.createElement('a-entity');
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

let titletext = document.createElement('a-entity');
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


let subtext = document.createElement('a-entity');
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

keyboard.addEventListener('click', function (event) {
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

let score=100;
            subtext.setAttribute('text', 'value', "score:"+score);
            subtext.setAttribute('position', '1 1.7 2');
            subtext.setAttribute('text','width', 4);

    
        }

    }
    
});


let scoremondialt = [
    { name: "AAAAA", score: 120 },
    { name: "BBBBB", score: 110 },
    { name: "CCCCC", score: 130 },
    { name: "DDDDD", score: 140 },
    { name: "EEEEE", score: 150 },
    { name: "FFFFF", score: 160 },
    { name: "GGGGG", score: 170 },
    { name: "HHHHH", score: 180 },
    { name: "IIIII", score: 190 },
    { name: "JJJJJ", score: 200 },
    { name: "KKKKK", score: 210 },
    { name: "LLLLL", score: 220 },
    { name: "MMMMM", score: 230 },
    { name: "NNNNN", score: 240 },
    { name: "OOOOO", score: 250 },
    { name: "PPPPP", score: 260 }
];

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

scoremondialt.sort((a, b) => b.score - a.score).slice(0, 10).forEach((entry, index) => {
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






}


keyboard();