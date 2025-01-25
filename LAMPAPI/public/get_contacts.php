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
if (!isset($inData['userID'])) {
    sendResponse('error', 'Missing userID');
}

// Connect to the database
$conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');

// Check connection
if ($conn->connect_error) {
    sendResponse('error', 'Database connection failed: ' . $conn->connect_error);
}

// Query to fetch all contacts for the user
$stmt = $conn->prepare('SELECT * FROM Contacts WHERE UserID = ?');
$stmt->bind_param('i', $inData['userID']);
$stmt->execute();
$result = $stmt->get_result();

// Fetch all rows
$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

if (count($contacts) > 0) {
    sendResponse('success', 'Contacts retrieved successfully', $contacts);
} else {
    sendResponse('error', 'No contacts found for the specified user');
}

// Clean up
$stmt->close();
$conn->close();
?>