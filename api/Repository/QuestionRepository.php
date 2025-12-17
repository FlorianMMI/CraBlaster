<?php

require_once("Repository/EntityRepository.php");
require_once("Class/Question.php");
require_once("Class/Reponse.php");


class QuestionRepository extends EntityRepository
{

    public function __construct()
    {
        // appel au constructeur de la classe mère (va ouvrir la connexion à la bdd)
        parent::__construct();
    }

    public function find($id_question): ?Question
    {
        $requete = $this->cnx->prepare("
            SELECT q.*, r.id_question, r.texte_reponse, r.est_correcte 
            FROM Question q
            LEFT JOIN Reponses r ON q.id_question = r.id_question
            WHERE q.id_question = :value
        ");
        $requete->bindParam(':value', $id_question);
        $requete->execute();
        $results = $requete->fetchAll(PDO::FETCH_OBJ);

        if (empty($results)) {
            return null;
        }

        $question = new Question($results[0]->id_question);
        $question->setTexteQuestion($results[0]->texte_question);
        $question->setNiveauQuestion($results[0]->niveau_question);

        foreach ($results as $result) {
            if ($result->texte_reponse !== null) {
                $reponse = new Reponse($result->id_question);
                $reponse->setTexteReponse($result->texte_reponse);
                $reponse->setEstCorrecte($result->est_correcte);
                $question->addReponse($reponse);
            }
        }

        return $question;
    }

    public function findAll(): array
    {
        $requete = $this->cnx->prepare("
            SELECT q.*, r.id_question, r.texte_reponse, r.est_correcte 
            FROM Question q
            LEFT JOIN Reponses r ON q.id_question = r.id_question
        ");
        $requete->execute();
        $results = $requete->fetchAll(PDO::FETCH_OBJ);

        $questions = [];
        foreach ($results as $result) {
            if (!isset($questions[$result->id_question])) {
                $question = new Question($result->id_question);
                $question->setTexteQuestion($result->texte_question);
                $question->setNiveauQuestion($result->niveau_question);
                $questions[$result->id_question] = $question;
            }
            if ($result->texte_reponse !== null) {
                $reponse = new Reponse($result->id_question);
                $reponse->setTexteReponse($result->texte_reponse);
                $reponse->setEstCorrecte($result->est_correcte);
                $questions[$result->id_question]->addReponse($reponse);
            }
        }
        return array_values($questions);
    }

    public function findLevel($level): array
    {
        $requete = $this->cnx->prepare("
            SELECT q.*, r.id_question, r.texte_reponse, r.est_correcte 
            FROM Question q
            LEFT JOIN Reponses r ON q.id_question = r.id_question
            WHERE q.niveau_question = :value
        ");
        $requete->bindParam(':value', $level);
        $requete->execute();
        $results = $requete->fetchAll(PDO::FETCH_OBJ);

        $questions = [];
        foreach ($results as $result) {
            if (!isset($questions[$result->id_question])) {
                $question = new Question($result->id_question);
                $question->setTexteQuestion($result->texte_question);
                $question->setNiveauQuestion($result->niveau_question);
                $questions[$result->id_question] = $question;
            }
            if ($result->texte_reponse !== null) {
                $reponse = new Reponse($result->id_question);
                $reponse->setTexteReponse($result->texte_reponse);
                $reponse->setEstCorrecte($result->est_correcte);
                $questions[$result->id_question]->addReponse($reponse);
            }
        }
        return array_values($questions);
    }

    // Sauvegarder une commande

    public function save($commande)
    {
        // Not implemented ! TODO when needed !
        return false;
    }

    public function delete($id)
    {
        // Not implemented ! TODO when needed !
        return false;
    }

    public function update($commande)
    {
        // Not implemented ! TODO when needed !
        return false;
    }
}
