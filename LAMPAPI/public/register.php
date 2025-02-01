<?php
// Enable CORS
require_once '../DbConnection.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = getConnection();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Parse the incoming request
function getRequestInfo()
{
    // Get raw input
    $input = file_get_contents('php://input');
    error_log('Raw Input: ' . $input);

    // Decode JSON input
    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('JSON Decode Error: ' . json_last_error_msg());
        return [];
    }

    error_log('Parsed Input: ' . json_encode($data));
    return $data;
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
if (!isset($inData['firstName']) || !isset($inData['lastName']) || !isset($inData['login']) || !isset($inData['password'])) {
    sendResponse('error', 'Missing required fields: firstName, lastName, login, or password');
}

// Error checking already exists within call
// Check if the user already exists
$stmt = $conn->prepare('SELECT ID FROM Users WHERE Login = ?');
if (!$stmt) {
    error_log('SQL Prepare Error: ' . $conn->error);
    sendResponse('error', 'SQL preparation error: ' . $conn->error);
}
$stmt->bind_param('s', $inData['login']);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    error_log('Duplicate User: ' . $inData['login']);
    sendResponse('error', 'User with this login already exists');
}
$stmt->close();

// HASHING PASSWORD BEFORE STORING IT WITHIN THE DB FOR SECURITY PURPOSES

$hashPassword = password_hash($inData['password'], PASSWORD_BCRYPT);
error_log('Hashed password: ' . $inData['login']);
// Insert the new user into the database
$stmt = $conn->prepare('INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)');
if (!$stmt) {
    error_log('SQL Prepare Error: ' . $conn->error);
    sendResponse('error', 'SQL preparation error: ' . $conn->error);
}
$stmt->bind_param(
    'ssss',
    $inData['firstName'],
    $inData['lastName'],
    $inData['login'],
    $hashPassword,  // Storing Hashed password versus hard-coded one
);

if ($stmt->execute()) {
    error_log('User Registered: ' . $inData['login']);
    sendResponse('success', 'User successfully registered');
} else {
    error_log('Insert Error: ' . $stmt->error);
    sendResponse('error', 'Failed to register user: ' . $stmt->error);
}

// Clean up
$stmt->close();
$conn->close();
?>