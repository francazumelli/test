<?php
// Controlla se i dati dell'utente sono stati inviati correttamente tramite la richiesta POST
if (isset($_FILES['foto']) && isset($_POST['id'])) {
    // Leggi il file JSON
    $file = 'db.json';
    $json = file_get_contents($file);
    $users = json_decode($json, true);

    // Identifica l'utente da aggiornare
    $userId = $_POST['id'];
    foreach ($users['utenti'] as &$user) {
        if ($user['id'] == $userId) {
            // Imposta il percorso per il caricamento dell'immagine
            $uploadDir = './img/';
            $uploadFile = $uploadDir . basename($_FILES['foto']['name']);

            // Controlla che il file sia un'immagine valida
            $imageFileType = strtolower(pathinfo($uploadFile, PATHINFO_EXTENSION));
            $check = getimagesize($_FILES['foto']['tmp_name']);
            if ($check !== false) {
                // Controlla la dimensione del file
                if ($_FILES['foto']['size'] > 5000000) {
                    echo 'Errore: il file è troppo grande.';
                } else {
                    // Sposta il file nell'upload directory
                    if (move_uploaded_file($_FILES['foto']['tmp_name'], $uploadFile)) {
                        // Aggiorna il nome del file nell'oggetto utente
                        $user['foto'] = basename($_FILES['foto']['name']);
                        // Scrivi i dati aggiornati nel file JSON
                        if (file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT))) {
                            echo 'Immagine del profilo aggiornata con successo.';
                        } else {
                            echo 'Errore durante l\'aggiornamento del file JSON.';
                        }
                    } else {
                        echo 'Errore durante il caricamento dell\'immagine.';
                    }
                }
            } else {
                echo 'Errore: il file non è un\'immagine valida.';
            }
            break; // Interrompi l'iterazione dopo aver trovato l'utente corretto
        }
    }
} else {
    echo 'Dati non validi.';
}
?>
