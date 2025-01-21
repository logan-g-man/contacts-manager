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

// Connect to the database
$conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');

// Check connection
if ($conn->connect_error) {
    error_log("Database Connection Error: " . $conn->connect_error);
    sendResponse('error', 'Database connection failed: ' . $conn->connect_error);
}

// Prepare and execute the SQL query
$stmt = $conn->prepare('SELECT ID, FirstName, LastName FROM Users WHERE Login = ? AND Password = ?');
if (!$stmt) {
    error_log("SQL Prepare Error: " . $conn->error);
    sendResponse('error', 'SQL preparation error: ' . $conn->error);
}

$stmt->bind_param('ss', $inData['login'], $inData['password']);
$stmt->execute();
$result = $stmt->get_result();

// Check for matching user
if ($row = $result->fetch_assoc()) {
    error_log("User Found: " . json_encode($row));
    sendResponse('success', 'Login successful', [
        'id' => $row['ID'],
        'firstName' => $row['FirstName'],
        'lastName' => $row['LastName'],
    ]);
} else {
    error_log("Invalid Login: " . $inData['login']);
    sendResponse('error', 'Invalid login or password');
}

// Clean up
$stmt->close();
$conn->close();
?>