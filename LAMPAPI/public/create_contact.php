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
if (
    !isset($inData['userID']) || !isset($inData['firstName']) ||
    !isset($inData['lastName']) || !isset($inData['email']) || !isset($inData['phone'])
) {
    sendResponse('error', 'Missing required fields: userID, firstName, lastName, email, or phone');
}

// Set default values if optional fields are missing
$inData['address'] = isset($inData['address']) ? $inData['address'] : '';
$inData['notes'] = isset($inData['notes']) ? $inData['notes'] : '';

// Connect to the database
$conn = new mysqli('localhost', 'TheBeast', 'WeLoveCOP4331', 'COP4331');

// Check connection
if ($conn->connect_error) {
    error_log("Database Connection Error: " . $conn->connect_error);
    sendResponse('error', 'Database connection failed: ' . $conn->connect_error);
}

// Insert the new contact into the database
$stmt = $conn->prepare('INSERT INTO Contacts (UserID, FirstName, LastName, Email, Phone, Address, Notes) VALUES (?, ?, ?, ?, ?, ?, ?)');
if (!$stmt) {
    error_log("SQL Prepare Error: " . $conn->error);
    sendResponse('error', 'SQL preparation error: ' . $conn->error);
}
$stmt->bind_param(
    'issssss',
    $inData['userID'],
    $inData['firstName'],
    $inData['lastName'],
    $inData['email'],
    $inData['phone'],
    $inData['address'],
    $inData['notes']
);

if ($stmt->execute()) {
    error_log("Contact Created: " . json_encode($inData));
    sendResponse('success', 'Contact successfully created', ['contactID' => $stmt->insert_id]);
} else {
    error_log("Insert Error: " . $stmt->error);
    sendResponse('error', 'Failed to create contact: ' . $stmt->error);
}

// Clean up
$stmt->close();
$conn->close();
?>