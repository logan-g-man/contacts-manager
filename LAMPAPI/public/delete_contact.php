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
    sendResponse('error', 'Missing required fields: contactID or userID');
}

// Connect to the database
$conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');

// Check connection
if ($conn->connect_error) {
    sendResponse('error', 'Database connection failed: ' . $conn->connect_error);
}

// Check if the contact exists and belongs to the user
$stmt = $conn->prepare('SELECT ID FROM Contacts WHERE ID = ? AND UserID = ?');
$stmt->bind_param('ii', $inData['contactID'], $inData['userID']);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    sendResponse('error', 'Contact not found or does not belong to the user');
}
$stmt->close();

// Delete the contact
$stmt = $conn->prepare('DELETE FROM Contacts WHERE ID = ? AND UserID = ?');
$stmt->bind_param('ii', $inData['contactID'], $inData['userID']);

if ($stmt->execute()) {
    sendResponse('success', 'Contact successfully deleted');
} else {
    sendResponse('error', 'Failed to delete contact: ' . $stmt->error);
}

// Clean up
$stmt->close();
$conn->close();
?>