/* INDEX.JS

Script "utilitaire" qui vient déclarer les différents outils dont
les autres scripts ont besoin.

En théorie index.js est déjà dans sa version finale, en tout cas 
pour ce qui est des features de base du jeu.

*/

class Question {
    constructor(id, texte, reponses, niveau) {
        this.id = id, // int
        this.texte = texte, // string
        this.reponses = reponses, // array de Reponse
        this.niveau = niveau // int - 1, 2, 3
    }

    get ID() {
        return this.id;
    }
    set ID(newid) {
        this.id = newid;
    }

    get Texte() {
        return this.texte;
    }
    set Texte(newtexte) {
        this.texte = newtexte;
    }

    get Reponses() {
        return this.reponses;
    }
    set Reponses(newreponses) {
        this.reponses = newreponses;
    }

    get Niveau() {
        return this.niveau;
    }
    set Niveau(newniveau) {
        this.niveau = newniveau;
    }
}

let createQuestion = function(id, texte, reponses, niveau) {
    let question = new Question(id, texte, reponses, niveau);
    return question;
}

export { createQuestion };

class Reponse {
    constructor(texte, correct) {
        this.texte = texte, // string
        this.correct = correct // boolean
    }

    get Texte() {
        return this.texte;
    }
    set Texte(newtexte) {
        this.texte = newtexte;
    }

    get Correct() {
        return this.correct;
    }
    set Correct(newcorrect) {
        this.correct = newcorrect;
    }
}

let createReponse = function(texte, correct) {
    let reponse = new Reponse(texte, correct);
    return reponse;
}

export { createReponse };

class PNJ {
    constructor(id, reponse) {
        this.id = id, // int
        this.reponse = reponse // objet de classe Reponse
    }

    get ID() {
        return this.id;
    }
    set ID(newid) {
        this.id = newid;
    }

    get Reponse() {
        return this.reponse;
    }
    set Reponse(newreponse) {
        this.reponse = newreponse;
    }
}

let createPNJ = function(id, reponse) {
    let pnj = new PNJ(id, reponse);
    return pnj;
}

let createPNJsForQuestion = function(question) {
    let pnjs = [];
    let reponses = question.reponses;
    reponses = reponses.sort(() => Math.random() - 0.5);
    for (let i = 0; i < reponses.length; i++) {
        let pnj = createPNJ(i, reponses[i]);
        pnjs.push(pnj);
    }
    return pnjs;
}

export { createPNJsForQuestion };