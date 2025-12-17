import { startGame } from "./script.js";
import { startmenu } from "./start.js";

export function chooseGame() {
    let aScene = document.querySelector("a-scene");
    let map = aScene.dataset.map;

    let title = document.createElement("a-text");
    title.setAttribute("text", "value: Choose your game !; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    title.setAttribute("position", `0 6 -5`);
    title.setAttribute("width", "36");
    title.setAttribute("align", "center");
    aScene.append(title);

    let gameButtons;
    if (map == "default" ){
        gameButtons = ["5 min", "3 min", "2 min"];
    }
    else {
        gameButtons = ["5 min", "8 min", "10 min"];
    }
    let selectedButton = null;
    let selectedGame = null;
    let gameButtonElements = [];

    gameButtons.forEach((game, index) => {
        let button = document.createElement("a-entity");
        button.setAttribute("geometry", "primitive: plane; width: 2; height: 0.8;");
        button.setAttribute("material", "src: url(asset/Rectangle 4.png); opacity: 0.5; transparent: true");
        button.setAttribute("text", `value: ${game}; align: center; width: 6; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5`);
        button.setAttribute("position", `-2 ${1.5 + index * 1} -3`);
        button.setAttribute("class", "clickable");
        button.setAttribute("side", "double");

        button.addEventListener("click", function () {
            if (selectedButton) {
                selectedButton.setAttribute("material", "src: url(asset/Rectangle 4.png); opacity: 0.5;");
                selectedButton.setAttribute("outline", "width: 0px;");
            }
            selectedButton = button;
            selectedGame = parseInt(game.replace(" min", ""));
            button.setAttribute("material", "src: url(asset/Rectangle 4.png); opacity: 100;");
            button.setAttribute("outline", "width: 2px; color: #FFFFFF;");
            console.log(selectedGame);
        });

        gameButtonElements.push(button);
        aScene.appendChild(button);
    });

    const difficultyButtons = ["Lvl 3", "Lvl 2", "Lvl 1"];
    let selecteddifficult = null;
    let selectedDifficulty = null;
    let difficultyButtonElements = [];

    difficultyButtons.forEach((difficulty, index) => {
        let button = document.createElement("a-entity");
        button.setAttribute("geometry", "primitive: plane; width: 2; height: 0.8;");
        button.setAttribute("material", "src: url(asset/Rectangle 4.png); opacity: 0.5; transparent: true");
        button.setAttribute("text", `value: ${difficulty}; align: center; width: 6; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5`);
        button.setAttribute("position", `2 ${1.5 + index * 1} -3`);
        button.setAttribute("class", "clickable");
        button.setAttribute("side", "double");

        button.addEventListener("click", function () {
            if (selecteddifficult) {
                selecteddifficult.setAttribute("material", "src: url(asset/Rectangle 4.png); opacity: 0.5;");
                selecteddifficult.setAttribute("outline", "width: 0px;");
            }
            selecteddifficult = button;
            selectedDifficulty = parseInt(difficulty.replace("Lvl ", ""));
            button.setAttribute("material", "src: url(asset/Rectangle 4.png); opacity: 100; ");
            button.setAttribute("outline", "width: 2rem; color: #FFFFFF;");
           
        });

        difficultyButtonElements.push(button);
        aScene.appendChild(button);
    });

    let startchooseButton = document.createElement("a-entity");
    startchooseButton.setAttribute("geometry", "primitive: plane; width: 1.5; height: 0.9;");
    startchooseButton.setAttribute("material", "src: url(asset/Rectangle 4.png); transparent: true");
    startchooseButton.setAttribute("text", "value: START; align: center; width: 10; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    startchooseButton.setAttribute("position", "1 0.5 -3");
    startchooseButton.setAttribute("class", "clickable");
    startchooseButton.setAttribute("side", "double");

    let backButton = document.createElement("a-entity");
    backButton.setAttribute("geometry", "primitive: plane; width: 1.5; height: 0.9;");
    backButton.setAttribute("material", "src: url(asset/Rectangle 4.png); transparent: true");
    backButton.setAttribute("text", "value: BACK; align: center; width: 10; font: asset/Audiowide-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    backButton.setAttribute("position", "-1 0.5 -3");
    backButton.setAttribute("class", "clickable");
    backButton.setAttribute("side", "double");

    let soundtext = document.createElement("a-text");
    soundtext.setAttribute("value", "Sound");
    soundtext.setAttribute("position", `5.5 0.5 -3.5`);
    soundtext.setAttribute("rotation", "0 -45 0");
    soundtext.setAttribute("text", "align: center; width: 14; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    aScene.appendChild(soundtext);

    let soundCheckbox = document.createElement("a-entity");
    soundCheckbox.setAttribute("geometry", "primitive: plane; width: 1; height: 1;");
    soundCheckbox.setAttribute("material", "src: url(asset/checkbox-true.svg); transparent: true");
    soundCheckbox.setAttribute("position", "5.5 0.5 -1.7");
    soundCheckbox.setAttribute("rotation", "0 -45 0");
    soundCheckbox.setAttribute("class", "clickable");

    let isMuted = true;

    soundCheckbox.addEventListener("click", function () {
        isMuted = !isMuted;
        soundCheckbox.setAttribute("material", `src: url(asset/checkbox-${isMuted ? 'true' : 'false'}.svg); transparent: true`);
    });

    aScene.appendChild(soundCheckbox);

    let hideSeekText = document.createElement("a-text");
    hideSeekText.setAttribute("value", "Hide & Seek");
    hideSeekText.setAttribute("position", `-6 0.5 -1`);
    hideSeekText.setAttribute("rotation", "0 45 0");
    hideSeekText.setAttribute("text", "align: center; width: 14; font: asset/Michroma-Regular-msdf.json; color: #FFFFFF; negate: false; opacity: 1; alphaTest: 0.5");
    aScene.appendChild(hideSeekText);

    let hideSeekCheckbox = document.createElement("a-entity");
    hideSeekCheckbox.setAttribute("geometry", "primitive: plane; width: 1; height: 1;");
    hideSeekCheckbox.setAttribute("material", "src: url(asset/checkboxhide-true.svg); transparent: true");
    hideSeekCheckbox.setAttribute("position", "-4.5 0.5 -2.5");
    hideSeekCheckbox.setAttribute("rotation", "0 45 0");
    hideSeekCheckbox.setAttribute("class", "clickable");

    let isHideSeek = true;

    hideSeekCheckbox.addEventListener("click", function () {
        isHideSeek = !isHideSeek;
        hideSeekCheckbox.setAttribute("material", `src: url(asset/checkboxhide-${isHideSeek ? 'true' : 'false'}.svg); transparent: true`);
    });

    aScene.appendChild(hideSeekCheckbox);

    startchooseButton.addEventListener("click", async function () {
        if (selectedGame !== null && selectedDifficulty !== null) {
            title.parentNode.removeChild(title);
            startchooseButton.parentNode.removeChild(startchooseButton);
            backButton.parentNode.removeChild(backButton);
            soundCheckbox.parentNode.removeChild(soundCheckbox);
            soundtext.parentNode.removeChild(soundtext);
            hideSeekCheckbox.parentNode.removeChild(hideSeekCheckbox);
            hideSeekText.parentNode.removeChild(hideSeekText);

            gameButtonElements.forEach(button => button.parentNode.removeChild(button));
            difficultyButtonElements.forEach(button => button.parentNode.removeChild(button));

            

            startGame(isMuted, selectedGame, selectedDifficulty, isHideSeek);
        }
    });

    backButton.addEventListener("click", function () {
        title.parentNode.removeChild(title);
        startchooseButton.parentNode.removeChild(startchooseButton);
        backButton.parentNode.removeChild(backButton);
        soundCheckbox.parentNode.removeChild(soundCheckbox);
        soundtext.parentNode.removeChild(soundtext);
        hideSeekCheckbox.parentNode.removeChild(hideSeekCheckbox);
        hideSeekText.parentNode.removeChild(hideSeekText);

        gameButtonElements.forEach(button => button.parentNode.removeChild(button));
        difficultyButtonElements.forEach(button => button.parentNode.removeChild(button));

        startmenu();
    });

    aScene.appendChild(startchooseButton);
    aScene.appendChild(backButton);
}
