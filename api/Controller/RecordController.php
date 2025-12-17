<?php
require_once "Controller.php";
require_once "Repository/RecordRepository.php";


// This class inherits the jsonResponse method  and the $cnx propertye from the parent class Controller
// Only the process????Request methods need to be (re)defined. 

class RecordController extends Controller
{

    private RecordRepository $records;

    public function __construct()
    {
        $this->records = new RecordRepository();
    }


    protected function processGetRequest(HttpRequest $request)
    {
        $id = $request->getId("id");        

        if ($id) {
            // On donne le record en particulier
            return $this->records->find($id);
        } else {
            // Sinon on renvoie la liste de toutes les records
            return $this->records->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request)
    {
        $json = $request->getJson();
        $json = json_decode($json);

        if (json_last_error() === JSON_ERROR_NONE && isset($json->nom) && isset($json->score) && isset($json->map)) {
            $nom = $json->nom;
            $score = $json->score;
            $map = $json->map;
            

            if (!empty($nom) && $score !== null) {
                $record = new Record();
                $record->setNomRecord($nom);
                $record->setScoreRecord($score);
                $record->setMap($map);
                
                if ($this->records->save($record)) {
                    return "Record ajouté";
                } else {
                    return "Erreur lors de l'ajout du record";
                }
            } else {
                return "Erreur lors de l'ajout du record nom";
            }
        } else {
            return "Erreur lors du décodage du JSON ou données manquantes";
        }
    }
}
