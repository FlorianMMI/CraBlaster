<?php

class Reponse implements JsonSerializable {
    private int $id_question;
    private string $texte_reponse;
    private bool $est_correcte;
    
    public function __construct(int $id_question, string $texte_reponse = "", bool $est_correcte = false) { // Correction ici
        $this->id_question = $id_question;
        $this->texte_reponse = $texte_reponse;
        $this->est_correcte = $est_correcte;
    }

    public function JsonSerialize(): array {
        return [
            'id_question' => $this->id_question,
            'texte_reponse' => $this->texte_reponse,
            'est_correcte' => $this->est_correcte
        ];
    }

    /**
     * Get the value of id_question
     */ 
    public function getIdQuestion(): int
    {
        return $this->id_question;
    }

    /**
     * Set the value of id_question
     *
     * @return  self
     */ 
    public function setIdQuestion(int $id_question): self
    {
        $this->id_question = $id_question;
        return $this;
    }

    /**
     * Get the value of texte_reponse
     */ 
    public function getTexteReponse(): string
    {
        return $this->texte_reponse;
    }

    /**
     * Set the value of texte_reponse
     *
     * @return  self
     */ 
    public function setTexteReponse(string $texte_reponse): self
    {
        $this->texte_reponse = $texte_reponse;
        return $this;
    }

    /**
     * Get the value of est_correcte
     */ 
    public function getEstCorrecte(): bool
    {
        return $this->est_correcte;
    }

    /**
     * Set the value of est_correcte
     *
     * @return  self
     */ 
    public function setEstCorrecte(bool $est_correcte): self
    {
        $this->est_correcte = $est_correcte;
        return $this;
    }

}