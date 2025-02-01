<?php
require_once 'DbConnection.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$conn = getConnection();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log('OPTIONS Request Handled: Sending 200 OK and exiting.');
    http_response_code(200);
    exit();
}

error_log('Processing actual request (not OPTIONS)...');

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
if (!isset($inData['login']) || !isset($inData['password'])) {
    sendResponse('error', 'Missing login or password');
}

// Check connection
if ($conn->connect_error) {
    error_log('Database Connection Error: ' . $conn->connect_error);
    sendResponse('error', 'Database connection failed: ' . $conn->connect_error);
}

// Prepare and execute the SQL query
$stmt = $conn->prepare('SELECT ID, FirstName, LastName, Password FROM Users WHERE login = ?');
if (!$stmt) {
    error_log('SQL Prepare Error: ' . $conn->error);
    sendResponse('error', 'SQL preparation error: ' . $conn->error);
}

$stmt->bind_param('s', $inData['login']);
$stmt->execute();
$result = $stmt->get_result();

// Check for matching user
if ($row = $result->fetch_assoc()) {
    $storedPassword = $row['Password']; //  hashed password from DB


    if (empty($storedPassword)) {
        sendResponse('error', 'Invalid login or password');
    }

    // VERIFY HASHED PASSWORD
    if (password_verify($inData['password'], $storedPassword)) {
        sendResponse('success', 'Login successful', [
            'id' => $row['ID'],
            'firstName' => $row['FirstName'],
            'lastName' => $row['LastName'],
        ]);
    } else {
        sendResponse('error', 'Invalid login or password');
    }
} else {
    sendResponse('error', 'No Records Found');
}

// Clean up
$stmt->close();
$conn->close();

?>
