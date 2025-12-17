<?php

class Record implements JsonSerializable {
    private ?int $id_record = null; 
    private string $nom_record;
    private int $score_record;
    private ?string $map = "default";
    
    public function __construct(?int $id_record = null, string $nom_record = "", int $score_record = 0, ?string $map = "default") {
        $this->id_record = $id_record;
        $this->nom_record = $nom_record;
        $this->score_record = $score_record;
        $this->map = $map;
    }

    public function jsonSerialize(): array {
        return [
            'id_record' => $this->id_record,
            'nom_record' => $this->nom_record,
            'score_record' => $this->score_record,
            'map' => $this->map
        ];
    }

    public function getIdRecord(): ?int {
        return $this->id_record;
    }

    public function setIdRecord(int $id_record): void {
        $this->id_record = $id_record;
    }

    public function getNomRecord(): string {
        return $this->nom_record;
    }

    public function setNomRecord(string $nom_record): void {
        $this->nom_record = $nom_record;
    }

    public function getScoreRecord(): int {
        return $this->score_record;
    }

    public function setScoreRecord(int $score_record): void {
        $this->score_record = $score_record;
    }

    public function getMap(): ?string {
        return $this->map;
    }

    public function setMap(string $map): void {
        $this->map = $map;
    }

}