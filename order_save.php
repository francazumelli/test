<?php
$file = 'db.json';


// Ottieni i dati dell'ordine dal corpo della richiesta POST
$ordineJSON = file_get_contents("php://input");
$ordine = json_decode($ordineJSON, true);

// Leggi il contenuto attuale del file JSON
$current_data = file_get_contents($file);
$array_data = json_decode($current_data, true);

// Aggiungi il nuovo ordine alla classe "ordini"
$array_data['ordini'][] = $ordine;

// Converti e scrivi tutto il contenuto nel file JSON
$array_data = json_encode($array_data, JSON_PRETTY_PRINT);
file_put_contents($file, $array_data);

// Invia una risposta di conferma al client
http_response_code(200);
echo "Ordine aggiunto correttamente al file JSON!";
?>
