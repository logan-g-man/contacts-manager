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
if (!isset($inData['userID'])) {
    http_response_code(400);  // Bad Request
    sendResponse('error', 'Missing required field: userID');
}

// Check connection
if ($conn->connect_error) {
    http_response_code(500);  // Internal Server Error
    sendResponse('error', 'Database connection failed: ' . $conn->connect_error);
}

// Check if the user exists
$userID = $inData['userID'];
$stmt = $conn->prepare('SELECT ID FROM Users WHERE ID = ?');
$stmt->bind_param('i', $userID);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    http_response_code(404);  // Not Found
    sendResponse('error', 'User not found');
}
$stmt->close();

// Retrieve contacts for the user
$stmt = $conn->prepare('SELECT ID, FirstName, LastName, Email, Phone, Address, Notes, Created, Modified FROM Contacts WHERE UserID = ?');
$stmt->bind_param('i', $userID);
$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

$stmt->close();
$conn->close();

// Send response based on whether contacts were found
if (count($contacts) > 0) {
    http_response_code(200);  // Success
    sendResponse('success', 'Contacts retrieved successfully', $contacts);
} else {
    http_response_code(200);  // Success (No Contacts)
    sendResponse('success', 'No contacts found for the specified user', []);
}
// Clean up
$stmt->close();
$conn->close();
?>
