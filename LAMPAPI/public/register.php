<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



// Loading dependencies relating to the DbConection instead of using hard-coded values

require_once __DIR__ . '/DbConnection.php';

// Parse the incoming request
function getRequestInfo()
{
    // Get raw input
    $input = file_get_contents('php://input');
    error_log("Raw Input: " . $input);

    // Decode JSON input
    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON Decode Error: " . json_last_error_msg());
        return [];
    }

    error_log("Parsed Input: " . json_encode($data));
    return $data;
}

// Validate email
function isValidEmail($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Validate phone number (international format: +1234567890 or just digits)
function isValidPhone($phone)
{
    return preg_match('/^\+?[0-9]{10,15}$/', $phone);
}

// Send JSON response
function sendResponse($status, $message, $data = null)
{
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data,
    ]);
    exit();
}

// Get the input data
$inData = getRequestInfo();

// Validate input
if (
    !isset($inData['firstName']) || !isset($inData['lastName']) ||
    !isset($inData['login']) || !isset($inData['password']) ||
    !isset($inData['email']) || !isset($inData['phone'])
) {
    sendResponse('error', 'Missing required fields: firstName, lastName, login, password, email, or phone');
}

// Validate email
if (!isValidEmail($inData['email'])) {
    sendResponse('error', 'Invalid email format');
}

// Validate phone number
if (!isValidPhone($inData['phone'])) {
    sendResponse('error', 'Invalid phone number format');
}

// Connect to the database USING env variables instead of hard-coded source code configs
$conn = getConnection();

// Error checking already exists within call

// Check if the user already exists
$stmt = $conn->prepare('SELECT ID FROM Users WHERE Login = ? OR Email = ?');
if (!$stmt) {
    error_log("SQL Prepare Error: " . $conn->error);
    sendResponse('error', 'SQL preparation error: ' . $conn->error);
}
$stmt->bind_param('ss', $inData['login'], $inData['email']);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    error_log("Duplicate User or Email: " . $inData['login'] . " / " . $inData['email']);
    sendResponse('error', 'User with this login or email already exists');
}
$stmt->close();

// HASHING PASSWORD BEFORE STORING IT WITHIN THE DB FOR SECURITY PURPOSES

$hashPassword = password_hash($inData['password'],PASSWORD_BCRYPT);

// Insert the new user into the database
$stmt = $conn->prepare('INSERT INTO Users (FirstName, LastName, Login, Password, Email, Phone) VALUES (?, ?, ?, ?, ?, ?)');
if (!$stmt) {
    error_log("SQL Prepare Error: " . $conn->error);
    sendResponse('error', 'SQL preparation error: ' . $conn->error);
}
$stmt->bind_param(
    'ssssss',
    $inData['firstName'],
    $inData['lastName'],
    $inData['login'],
    $hashPassword, // Storing Hashed password versus hard-coded one
    $inData['email'],
    $inData['phone']
);

if ($stmt->execute()) {
    error_log("User Registered: " . $inData['login']);
    sendResponse('success', 'User successfully registered');
} else {
    error_log("Insert Error: " . $stmt->error);
    sendResponse('error', 'Failed to register user: ' . $stmt->error);
}

// Clean up
$stmt->close();
$conn->close();




//SIMPLIFIED VERSION THAT MATCHES USERS TABLE IN DATABASE

// Enable CORS
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST, OPTIONS');
// header('Access-Control-Allow-Headers: Content-Type');
// header('Content-Type: application/json');

// // Handle preflight requests
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit();
// }

// // Parse the incoming request
// function getRequestInfo()
// {
//     // Get raw input
//     $input = file_get_contents('php://input');
//     error_log("Raw Input: " . $input);

//     // Decode JSON input
//     $data = json_decode($input, true);
//     if (json_last_error() !== JSON_ERROR_NONE) {
//         error_log("JSON Decode Error: " . json_last_error_msg());
//         return [];
//     }

//     error_log("Parsed Input: " . json_encode($data));
//     return $data;
// }

// // Send JSON response
// function sendResponse($status, $message, $data = null)
// {
//     echo json_encode([
//         'status' => $status,
//         'message' => $message,
//         'data' => $data,
//     ]);
//     exit();
// }

// // Get the input data
// $inData = getRequestInfo();

// // Validate input
// if (
//     !isset($inData['firstName']) || !isset($inData['lastName']) ||
//     !isset($inData['login']) || !isset($inData['password'])
// ) {
//     sendResponse('error', 'Missing required fields: firstName, lastName, login, or password');
// }

// // Connect to the database
// $conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');

// // Check connection
// if ($conn->connect_error) {
//     error_log("Database Connection Error: " . $conn->connect_error);
//     sendResponse('error', 'Database connection failed: ' . $conn->connect_error);
// }

// // Check if the user already exists
// $stmt = $conn->prepare('SELECT ID FROM Users WHERE Login = ?');
// if (!$stmt) {
//     error_log("SQL Prepare Error: " . $conn->error);
//     sendResponse('error', 'SQL preparation error: ' . $conn->error);
// }
// $stmt->bind_param('s', $inData['login']);
// $stmt->execute();
// $stmt->store_result();

// if ($stmt->num_rows > 0) {
//     error_log("Duplicate User: " . $inData['login']);
//     sendResponse('error', 'User with this login already exists');
// }
// $stmt->close();

// // Insert the new user into the database
// $stmt = $conn->prepare('INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)');
// if (!$stmt) {
//     error_log("SQL Prepare Error: " . $conn->error);
//     sendResponse('error', 'SQL preparation error: ' . $conn->error);
// }
// $stmt->bind_param(
//     'ssss',
//     $inData['firstName'],
//     $inData['lastName'],
//     $inData['login'],
//     $inData['password']
// );

// if ($stmt->execute()) {
//     error_log("User Registered: " . $inData['login']);
//     sendResponse('success', 'User successfully registered');
// } else {
//     error_log("Insert Error: " . $stmt->error);
//     sendResponse('error', 'Failed to register user: ' . $stmt->error);
// }

// // Clean up
// $stmt->close();
// $conn->close();

?>