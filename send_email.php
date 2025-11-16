<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

$do = "biuro@maxsoft.pl"; 
$naglowek_emaila = "From: Formularz Maxsoft <biuro@maxsoft.pl>\r\n"; // Używamy e-maila SMTP do nagłówka From
$naglowek_emaila .= "Reply-To: " . htmlspecialchars($_POST['email']) . "\r\n"; // Odpowiedź kierowana do klienta
$naglowek_emaila .= "MIME-Version: 1.0\r\n";
$naglowek_emaila .= "Content-Type: text/html; charset=UTF-8\r\n";

// Weryfikacja danych
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $imie = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $temat = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
    $wiadomosc = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    if (!$imie || !$email || !$wiadomosc) {
        http_response_code(400);
        echo json_encode(["message" => "Brak wymaganych danych (Imię, E-mail, Wiadomość)."]);
        exit;
    }

    // Ustawienie tematu i treści
    $temat_maila = "[Maxsoft Formularz] " . ($temat ?: 'Brak tematu');

    $tresc_html = "
        <p>Imię i Nazwisko: <strong>{$imie}</strong></p>
        <p>E-mail: <strong>{$email}</strong></p>
        <p>Temat: <strong>{$temat}</strong></p>
        <p>Treść wiadomości:</p>
        <p>" . nl2br($wiadomosc) . "</p>";

    // WYSYŁKA E-MAILA
    // Na większości hostingów shared, funkcja mail() jest już skonfigurowana.
    // Jeśli nie zadziała, musisz użyć PHPMailer i skonfigurować go ręcznie z danymi SMTP z .env.
    if (mail($do, $temat_maila, $tresc_html, $naglowek_emaila)) {
        http_response_code(200);
        echo json_encode(["message" => "Wiadomość została wysłana!"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Błąd: Nie udało się wysłać e-maila (błąd funkcji mail())."]);
    }

} else {
    http_response_code(405);
    echo json_encode(["message" => "Metoda niedozwolona."]);
}
?>