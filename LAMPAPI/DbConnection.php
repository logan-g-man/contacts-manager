<?php

require __DIR__ . '/../vendor/autoload.php'; // Load composer dependencies


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load(); // Load .env file

function getConnection()
{
    $mysqli = new mysqli
    (
        $_ENV['DB_HOST'],
        $_ENV['DB_USER'],
        $_ENV['DB_PASS'],
        $_ENV['DB_NAME'],
        $_ENV['DB_PORT']

    );

    if ($mysqli->connect_error) {
        die("Database connection failed: " . $mysqli->connect_error);
    }

    return $mysqli; // Return the connection object
}
?>
