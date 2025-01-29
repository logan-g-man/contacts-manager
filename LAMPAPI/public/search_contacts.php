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
if (!isset($inData['userID']) || !isset($inData['query'])) {
    sendResponse('error', 'Missing required fields: userID or query');
}

// Connect to the database
$conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');

// Check connection
if ($conn->connect_error) {
    sendResponse('error', 'Database connection failed: ' . $conn->connect_error);
}


$userID = $inData['userID'];
$query = '%' . $conn->real_escape_string($inData['query']) . '%';

// Prepare the SQL query
$sql = "SELECT * FROM Contacts WHERE UserID = ? AND (
    FirstName LIKE ? OR
    LastName LIKE ? OR
    Email LIKE ? OR
    Phone LIKE ? OR
    Address LIKE ?
)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    sendResponse('error', 'SQL preparation error: ' . $conn->error);
}
$stmt->bind_param('isssss', $userID, $query, $query, $query, $query, $query);
$stmt->execute();
$result = $stmt->get_result();

// Fetch matching contacts
$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

if (count($contacts) > 0) {
    sendResponse('success', 'Contacts retrieved successfully', $contacts);
} else {
    sendResponse('error', 'No matching contacts found');
}

// Clean up
$stmt->close();
$conn->close();
?>