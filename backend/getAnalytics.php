<?php
if ($_SERVER['HTTP_HOST'] === 'localhost:8001') { // Only enable CORS in development
    header("Access-Control-Allow-Origin: *");
} else {
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");;
    }
}
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// File where analytics are stored
$analyticsFile = "analytics.json";

// Read file if it exists
if (file_exists($analyticsFile)) {
    $data = json_decode(file_get_contents($analyticsFile), true);
    
    // Convert IP list to visit counts
    $formattedData = [];
    foreach ($data as $date => $ips) {
        $formattedData[] = ["date" => $date, "visits" => count($ips)];
    }

    echo json_encode($formattedData);
} else {
    echo json_encode([]);
}
?>
