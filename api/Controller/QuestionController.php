<?php
require_once "Controller.php";
require_once "Repository/QuestionRepository.php";


// This class inherits the jsonResponse method  and the $cnx propertye from the parent class Controller
// Only the process????Request methods need to be (re)defined. 

class QuestionController extends Controller
{

    private QuestionRepository $questions;

    public function __construct()
    {
        $this->questions = new QuestionRepository();
    }


    protected function processGetRequest(HttpRequest $request)
    {
        $id = $request->getId("id");
        $niveau = $request->getParam("niveau");
        

        if ($id) {
            // On donne les détails de la question
            return $this->questions->find($id);
        } elseif ($niveau){
            // On donne la liste des questions pour un niveau donné
            return $this->questions->findLevel($niveau);
        } else {
            // Sinon on renvoie la liste de toutes les questions
            return $this->questions->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request)
    {
        // Vide
    }
}
