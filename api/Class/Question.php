<?php

class Question implements JsonSerializable {
    private int $id_question;
    private string $texte_question;
    private int $niveau_question;
    private array $reponses;
    
    public function __construct(int $id_question, string $texte_question = "", int $niveau_question = 0, array $reponses = []) {
        $this->id_question = $id_question;
        $this->texte_question = $texte_question;
        $this->niveau_question = $niveau_question;
        $this->reponses = $reponses;
    }

    public function jsonSerialize(): array {
        return [
            'id_question' => $this->id_question,
            'texte_question' => $this->texte_question,
            'niveau_question' => $this->niveau_question,
            'reponses' => $this->reponses,
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
     * Get the value of texte_question
     */ 
    public function getTexteQuestion(): string
    {
        return $this->texte_question;
    }

    /**
     * Set the value of texte_question
     *
     * @return  self
     */ 
    public function setTexteQuestion(string $texte_question): self
    {
        $this->texte_question = $texte_question;
        return $this;
    }

    /**
     * Get the value of niveau_question
     */ 
    public function getNiveauQuestion(): int
    {
        return $this->niveau_question;
    }

    /**
     * Set the value of niveau_question
     *
     * @return  self
     */ 
    public function setNiveauQuestion(int $niveau_question): self
    {
        $this->niveau_question = $niveau_question;
        return $this;
    }

    /**
     * Get the value of reponses
     */ 
    public function getReponses(): array
    {
        return $this->reponses;
    }

    /**
     * Set the value of reponses
     *
     * @return  self
     */ 
    public function setReponses(array $reponses): self
    {
        $this->reponses = $reponses;
        return $this;
    }

    /**
     * Add a response to the question
     *
     * @param Reponse $reponse
     * @return self
     */
    public function addReponse(Reponse $reponse): self
    {
        $this->reponses[] = $reponse;
        return $this;
    }

}