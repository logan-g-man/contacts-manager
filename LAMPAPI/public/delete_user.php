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
    $input = file_get_contents('php://input');
    error_log('Raw Input: ' . $input);

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('JSON Decode Error: ' . json_last_error_msg());
        return [];
    }

    return $data;
}

// Send JSON response
function sendResponse($status, $message)
{
    echo json_encode([
        'status' => $status,
        'message' => $message,
    ]);
    exit();
}

// Get the input data
$inData = getRequestInfo();

// Validate input
if (!isset($inData['userID']) || empty($inData['userID'])) {
    sendResponse('error', 'Missing or invalid userID');
}

// Check if user exists
$userID = intval($inData['userID']);
$stmt = $conn->prepare('SELECT ID FROM Users WHERE ID = ?');
$stmt->bind_param('i', $userID);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    sendResponse('error', 'User not found');
}
$stmt->close();

// Delete the user
$stmt = $conn->prepare('DELETE FROM Users WHERE ID = ?');//only new code I had to write up
if (!$stmt) {
    error_log('SQL Prepare Error: ' . $conn->error);
    sendResponse('error', 'SQL preparation error: ' . $conn->error);
}

$stmt->bind_param('i', $userID);
if ($stmt->execute()) {
    sendResponse('success', 'User successfully deleted');
} else {
    sendResponse('error', 'Failed to delete user: ' . $stmt->error);
}

// Clean up
$stmt->close();
$conn->close();
?>