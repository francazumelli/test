
<?php
$file = 'db.json';

$utenteJSON = file_get_contents("php://input");
$utente = json_decode($utenteJSON, true);

// Leggi il contenuto attuale del file JSON
$current_data = file_get_contents($file);
$array_data = json_decode($current_data, true);

// Ottieni l'ultimo ID presente nel file JSON per generare un nuovo ID per il nuovo utente
$newId = (!empty($array_data['utenti']) ? end($array_data['utenti'])['id'] : 0) + 1;
$utente['id'] = $newId;

// Aggiorna solo la classe "utenti"
$array_data['utenti'][] = $utente;

// Converti e scrivi solo la classe "utenti" nel file JSON
$array_data = json_encode($array_data, JSON_PRETTY_PRINT);
file_put_contents($file, $array_data);

echo "Utente aggiunto correttamente al file JSON!";
?>
