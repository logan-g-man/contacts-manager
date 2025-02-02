<?php
require_once '../DbConnection.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$conn = getConnection();

$inData = getRequestInfo();

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$id = 0;
$firstName = '';
$lastName = '';

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Retrieve the hashed password from the database
    $stmt = $conn->prepare('SELECT ID, firstName, lastName, Password FROM Users WHERE Login = ?');
    $stmt->bind_param('s', $inData['login']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        // Verify the password
        if (password_verify($inData['password'], $row['Password'])) {
            returnWithInfo($row['firstName'], $row['lastName'], $row['ID']);
        } else {
            returnWithError('Invalid login or password');
        }
    } else {
        returnWithError('No Records Found');
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson($retValue);
}
