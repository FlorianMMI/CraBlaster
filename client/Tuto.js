import {startmenu} from './start.js';


export function starttuto() {

    let aScene = document.querySelector("a-scene");

    let title = document.createElement("a-text");
    title.setAttribute("text", "value: Welcome to tutorial TellApart!; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    title.setAttribute("position", `0 7 -7`);
    title.setAttribute("width", "36");
    title.setAttribute("align", "center");
    aScene.append(title);


    let present = document.createElement("a-plane");
    present.setAttribute("material", "shader: flat; side: double; color: #000000; opacity: 0.4");
    present.setAttribute("geometry", "primitive: plane; width: 12; height: 3");
    present.setAttribute("position", `0 2.2 -5.2`);
    aScene.appendChild(present);

    let paragraphpresent = document.createElement("a-text");
    
    paragraphpresent.setAttribute("value", "You are a space exploration team, and aliens have \ninfiltrated by taking the appearance of your crewmates.\n To expose them, you ask questions in English, as they \ndo not yet fully understand the language. \nFind the real astronaut! ");
    paragraphpresent.setAttribute("position", `0 2.2 -5`);
    paragraphpresent.setAttribute("text", "align: center; width: 13; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");

    aScene.appendChild(paragraphpresent);

    let aBox = document.createElement("a-entity");
            aBox.setAttribute("gltf-model", "#astro");
            aBox.setAttribute("side", "double");
            aBox.setAttribute("position", ` -7 -0.5 0`);
            aBox.setAttribute("scale", "1 1 1");
            aBox.setAttribute("rotation", "0 90 0");
            aBox.setAttribute("animation-mixer", "clip: CharacterArmature|Wave; loop: repeat; timeScale: 1");
            aScene.appendChild(aBox);

    let pad= document.createElement("a-entity");
            pad.setAttribute("gltf-model", "#pad");
            pad.setAttribute("side", "double");
            pad.setAttribute("position", ` -7 -1 0`);
            pad.setAttribute("scale", "1 1 1");;
            aScene.appendChild(pad);

    let aBox2 = document.createElement("a-entity");
            aBox2.setAttribute("gltf-model", "#alien");
            aBox2.setAttribute("side", "double");
            aBox2.setAttribute("position", ` -7 -0.5 4`);
            aBox2.setAttribute("scale", "1 1 1");
            aBox2.setAttribute("rotation", "0 90 0");
            aBox2.setAttribute("animation-mixer", "clip: CharacterArmature|Duck; loop: repeat; timeScale: 1");
            aScene.appendChild(aBox2);

    let pad2= document.createElement("a-entity");
            pad2.setAttribute("gltf-model", "#pad");
            pad2.setAttribute("side", "double");
            pad2.setAttribute("position", ` -7 -1 4`);
            pad2.setAttribute("scale", "1 1 1");;
            aScene.appendChild(pad2);

            let ambientLight = document.createElement("a-light");
            ambientLight.setAttribute("type", "ambient");
            ambientLight.setAttribute("color", "#ccdddd");
            aScene.appendChild(ambientLight);

            let sky= document.createElement("a-sky");
            sky.setAttribute("src", "#nuage");
            aScene.appendChild(sky);

            let beam = document.createElement("a-entity");
        beam.setAttribute("position", "-7 0 4");
        beam.setAttribute("geometry", {
            primitive: "cylinder",
            radius: 1.7,
            height: 50,
        });
        beam.setAttribute("material", {
            color: "#00FFFF",
            transparent: true,
            opacity: 0.2
        });
        aScene.appendChild(beam);

        let aText1 = document.createElement("a-text");
        aText1.setAttribute("text", "value: Right\nanswer; font: asset/Michroma-Regular-msdf.json; negate: false; opacity: 1; alphaTest: 0.5");
        aText1.setAttribute("position", ` -5 3 0.5`);
        aText1.setAttribute("rotation", "0 90 0");
        aText1.setAttribute("side", "double");
        aText1.setAttribute("color", "white");
        aText1.setAttribute("width", "20");
        aText1.setAttribute("align", "center");

        aScene.appendChild(aText1);

        let aText2 = document.createElement("a-text");
        aText2.setAttribute("text", "value: Wrong\nanswer; font: asset/Michroma-Regular-msdf.json; negate: false; opacity: 1; alphaTest: 0.5");
        aText2.setAttribute("position", ` -5 3 4`);
        aText2.setAttribute("rotation", "0 90 0");
        aText2.setAttribute("side", "double");
        aText2.setAttribute("color", "white");
        aText2.setAttribute("width", "20");
        aText2.setAttribute("align", "center");

        aScene.appendChild(aText2);


        let title2 = document.createElement("a-text");
        title2.setAttribute("text", "value: Question; font: asset/Michroma-Regular-msdf.json; negate: false; opacity: 1; alphaTest: 0.5");
        title2.setAttribute("position", ` 7 3 2`);
        title2.setAttribute("rotation", "0 -90 0");
        title2.setAttribute("side", "double");
        title2.setAttribute("color", "white");
        title2.setAttribute("width", "20");
        title2.setAttribute("align", "center");
    aScene.append(title2);

        let positions = [
            { x: 7, y: -1, z: -4 },
            { x: 7, y: -1, z: 0 },
            { x: 7, y: -1, z: 4 },
            { x: 7, y: -1, z: 8 }
        ];

        let character=[];

        let number = 0;
        positions.forEach(pos => {
            let aBoxmult = document.createElement("a-entity");
            aBoxmult.setAttribute("gltf-model", "#astro");
            aBoxmult.setAttribute("side", "double");
            aBoxmult.setAttribute("position", `${pos.x} ${pos.y} ${pos.z}`);
            aBoxmult.setAttribute("rotation", "0 -90 0");
            aBoxmult.setAttribute("scale", "1 1 1");
            aBoxmult.setAttribute("animation-mixer", "clip: CharacterArmature|Idle; loop: repeat; timeScale: 1");
            aScene.appendChild(aBoxmult);

            character.push(aBoxmult);

            number++;

            let text = document.createElement("a-text");
            text.setAttribute("text", "value: Answer "+ number+"; font: asset/Michroma-Regular-msdf.json; negate: false; opacity: 1; alphaTest: 0.5");
            text.setAttribute("position", `${pos.x} 2 ${pos.z}`);
            text.setAttribute("rotation", "0 -90 0");
            text.setAttribute("side", "double");
            text.setAttribute("color", "white");
            text.setAttribute("width", "15");
            text.setAttribute("align", "center");
            aScene.appendChild(text);

            character.push(text);
        });
    

        let plane = document.createElement("a-plane");
        plane.setAttribute("material", "shader: flat; side: double; color: #000000; opacity: 0.4");
        plane.setAttribute("geometry", "primitive: plane; width: 2; height: 1");
        plane.setAttribute("position", `-2 0.5 2`);
        plane.setAttribute("rotation", "-45 90 0");
        plane.setAttribute("side", "double");
        aScene.appendChild(plane);
    
        let paragraph = document.createElement("a-text");
        
        paragraph.setAttribute("value", "When you click on a character,\n here are the two possible\n reactions. ");
        paragraph.setAttribute("position", `-2 0.5 2`);
        paragraph.setAttribute("text", "align: center; width: 4; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
        paragraph.setAttribute("side", "double");
        paragraph.setAttribute("rotation", "-45 90 0");
    
        aScene.appendChild(paragraph);

        let plane2 = document.createElement("a-plane");
        plane2.setAttribute("material", "shader: flat; side: double; color: #000000; opacity: 0.4");
        plane2.setAttribute("geometry", "primitive: plane; width: 2; height: 1");
        plane2.setAttribute("position", `2 0.5 2`);
        plane2.setAttribute("rotation", "-45 -90 0");
        plane2.setAttribute("side", "double");
        aScene.appendChild(plane2);
    
        let paragraph2 = document.createElement("a-text");
        
        paragraph2.setAttribute("value", "A question is asked and you\n must click on the correct\n answer. ");
        paragraph2.setAttribute("position", `2 0.5 2`);
        paragraph2.setAttribute("text", "align: center; width: 4; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
        paragraph2.setAttribute("side", "double");
        paragraph2.setAttribute("rotation", "-45 -90 0");
    
        aScene.appendChild(paragraph2);

        let plane3 = document.createElement("a-plane");
        plane3.setAttribute("material", "shader: flat; side: double; color: #000000; opacity: 0.4");
        plane3.setAttribute("geometry", "primitive: plane; width: 2; height: 1");
        plane3.setAttribute("position", `1.2 0.5 5`);
        plane3.setAttribute("rotation", "-45 180 0");
        plane3.setAttribute("side", "double");
        aScene.appendChild(plane3);

        let paragraph3 = document.createElement("a-text");
        paragraph3.setAttribute("value", "If you are on the large map,\n you can use WASD/ZQSD\n to move around. Hold shift\n to move faster.");
        paragraph3.setAttribute("position", `1.2 0.5 5`);
        paragraph3.setAttribute("text", "align: center; width: 4; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
        paragraph3.setAttribute("side", "double");
        paragraph3.setAttribute("rotation", "-45 180 0");
        aScene.appendChild(paragraph3);

        let plane4 = document.createElement("a-plane");
        plane4.setAttribute("material", "shader: flat; side: double; color: #000000; opacity: 0.4");
        plane4.setAttribute("geometry", "primitive: plane; width: 2; height: 1");
        plane4.setAttribute("position", `-1.2 0.5 5`);
        plane4.setAttribute("rotation", "-45 180 0");
        plane4.setAttribute("side", "double");
        aScene.appendChild(plane4);

        let paragraph4 = document.createElement("a-text");
        paragraph4.setAttribute("value", "In the menu, click 'Change map'\n to switch between default\n and large map. You can only\n move on the large map.");
        paragraph4.setAttribute("position", `-1.2 0.5 5`);
        paragraph4.setAttribute("text", "align: center; width: 4; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
        paragraph4.setAttribute("side", "double");
        paragraph4.setAttribute("rotation", "-45 180 0");
        aScene.appendChild(paragraph4);



let menuButton = document.createElement("a-entity");
    
    
    menuButton.setAttribute("geometry", "primitive: plane; width: 3.6; height: 0.8;");
    
    menuButton.setAttribute("material", "src: url(asset/Rectangle 4.png); transparent: true");

    menuButton.setAttribute("text", "value: Return to Menu; align: center; width: 10; font: asset/Michroma-Regular-msdf.json; negate: false; opacity: 1; alphaTest: 0.5");
    menuButton.setAttribute("position", "0 0.5 -3");
    menuButton.setAttribute("class", "clickable");
    menuButton.addEventListener("click", async function () {
        title.remove();
        present.remove();
        paragraphpresent.remove();
        aBox.remove();
        pad.remove();
        aBox2.remove();
        pad2.remove();
        ambientLight.remove();
        beam.remove();
        aText1.remove();
        aText2.remove();
        title2.remove();
        plane.remove();
        paragraph.remove();
        plane2.remove();
        paragraph2.remove();
        plane3.remove();
        paragraph3.remove();
        plane4.remove();
        paragraph4.remove();
        menuButton.remove();
        character.forEach((element) => {
            element.remove();
        });
    

        let ambientSound = document.querySelector("#ambient");
        if (ambientSound) {
            ambientSound.pause();
            ambientSound.currentTime = 0;
        }
        
        startmenu();
        setTimeout(resetRaycaster, 500);

    });
    aScene.appendChild(menuButton);



}

    


