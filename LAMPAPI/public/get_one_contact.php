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
    return json_decode($input, true);
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
if (!isset($inData['contactID']) || !isset($inData['userID'])) {
    http_response_code(400);  // Bad Request
    sendResponse('error', 'Missing required fields: contactID or userID');
}

// Check connection
if ($conn->connect_error) {
    http_response_code(500);  // Internal Server Error
    sendResponse('error', 'Database connection failed: ' . $conn->connect_error);
}

// Query to fetch a specific contact and verify it belongs to the user
$stmt = $conn->prepare('SELECT * FROM Contacts WHERE ID = ? AND UserID = ?');
$stmt->bind_param('ii', $inData['contactID'], $inData['userID']);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    http_response_code(200);  // Success
    sendResponse('success', 'Contact retrieved successfully', $row);
} else {
    http_response_code(404);  // Not Found
    sendResponse('error', 'No contact found with the specified ID or it does not belong to the user');
}

// Clean up
$stmt->close();
$conn->close();
?>
