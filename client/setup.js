/* SETUP.JS

Se charge de créer les questions, les PNJs, etc. pour le jeu.

*/

import { createQuestion } from "./index.js";
import { createReponse } from "./index.js";
import { QuestionData } from "./data/data.js";

let data = {
    questions: {
        niveau1:[],
        niveau2:[],
        niveau3:[]
    },
    pnjs: [],
}

/* Rappels :

question:{
    id: int,
    texte: string,
    reponses: array de Reponse,
    niveau: int [1, 2, 3]
}

reponse:{
    texte: string,
    correct: boolean
}

*/

async function loadData() {
    data.questions.niveau1 = await QuestionData.fetchNiveau(1);
    data.questions.niveau2 = await QuestionData.fetchNiveau(2);
    data.questions.niveau3 = await QuestionData.fetchNiveau(3);

    data.pnjs = [];
}

await loadData();


export { data };