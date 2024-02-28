<?php
$file = 'db.json';
error_log("Richiesta ricevuta.");

// Verifica se è stata inviata una richiesta POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ottieni l'ID del concerto dall'input POST
    $idConcerto = $_POST['idConcerto'];

    // Log dell'ID del concerto ricevuto
    echo("ID del concerto ricevuto: " . $idConcerto);

    // Leggi il contenuto attuale del file JSON
    $current_data = file_get_contents($file);
    $array_data = json_decode($current_data, true);

    // Trova il concerto corrispondente all'ID
    $concerto = null;
    foreach ($array_data['concerti'] as &$c) {
        if ($c['id'] == $idConcerto) {
            $concerto = &$c;
            break;
        }
    }

    // Se il concerto esiste, decrementa il numero di biglietti
    if ($concerto !== null) {
        $concerto['nBiglietti']--;

        // Log del numero di biglietti aggiornato
        echo("Numero di biglietti aggiornato per il concerto con ID $idConcerto: " . $concerto['nBiglietti']);

        // Converti e scrivi tutto il contenuto nel file JSON
        $array_data = json_encode($array_data, JSON_PRETTY_PRINT);
        file_put_contents($file, $array_data);

        // Invia una risposta di successo al client
        http_response_code(200);
    } else {
        // Se il concerto non esiste, invia una risposta di errore al client
        http_response_code(404);
        echo "Concerto non trovato con ID: $idConcerto";
    }
} else {
    // Se non è stata inviata una richiesta POST, invia una risposta di errore al client
    http_response_code(405);
    echo "Metodo non consentito.";
}
?>
