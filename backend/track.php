<?php
if ($_SERVER['HTTP_HOST'] === 'localhost:8001') { // Only enable CORS in development
    header("Access-Control-Allow-Origin: *");
} else {
    header("Access-Control-Allow-Origin: https://yourwebsite.com");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// File where data is stored
$analyticsFile = "analytics.json";

// Get visitor IP address
$ip = $_SERVER['REMOTE_ADDR'];
$date = date("Y-m-d");

// Read existing data (if file exists)
$data = file_exists($analyticsFile) ? json_decode(file_get_contents($analyticsFile), true) : [];

// Ensure data structure is correct
if (!isset($data[$date])) {
    $data[$date] = [];
}

// Check if the IP is already recorded today
if (!in_array($ip, $data[$date])) {
    $data[$date][] = $ip;
}

// Save updated data back to the file
file_put_contents($analyticsFile, json_encode($data, JSON_PRETTY_PRINT));

echo json_encode(["status" => "success"]);
?>
