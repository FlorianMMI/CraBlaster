import {getRequest} from './api-request.js';
import { postRequest } from './api-request.js';


let QuestionData = {};

QuestionData.fetch = async function(id){
    let data = await getRequest('questions?id='+id);
    return data;
}

QuestionData.fetchAll = async function(){
    let data = await getRequest('questions');
    return data;
}

QuestionData.fetchNiveau = async function(niveau){
    let data = await getRequest('questions?niveau='+niveau);
    return data;
}

export {QuestionData};

let ScoresData = {};

ScoresData.fetch = async function(id){
    let data = await getRequest('scores/'+id);
    return data;
}

ScoresData.fetchAll = async function(){
    let data = await getRequest('scores');
    return data;
}

ScoresData.post = async function(nom, score, map){
    let data = await postRequest('scores', JSON.stringify({nom: nom, score: score, map: map}));
    return data;
}

export {ScoresData};