<?php
// Leggi i dati inviati dalla richiesta POST
$data = json_decode(file_get_contents('php://input'), true);

// Controlla se i dati sono stati inviati correttamente
if ($data) {
    // Leggi il contenuto attuale del file JSON
    $file = 'db.json';
    $json = file_get_contents($file);
    $users = json_decode($json, true);

    // Cerca l'utente da aggiornare
    foreach ($users['utenti'] as &$user) {
        if ($user['id'] === $data['id']) {
            // Aggiorna i dati dell'utente
            $user['nome'] = $data['nome'];
            $user['cognome'] = $data['cognome'];
            $user['foto'] = $data['foto'];
            break;
        }
    }

    // Scrivi i dati aggiornati nel file JSON
    if (file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT))) {
        echo 'Dati dell\'utente aggiornati con successo.';
    } else {
        echo 'Si è verificato un errore durante l\'aggiornamento dei dati dell\'utente.';
    }
} else {
    echo 'Dati non validi.';
}
?>
