<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../koneksi.php";

$query = "SELECT * FROM nilai ORDER BY id DESC";

$result = mysqli_query($koneksi, $query);

if ($result) {
    $data = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }

    echo json_encode($data);
} else {
    http_response_code(500);

    echo json_encode([
        "status" => "error",
        "pesan" => "Gagal mengambil data nilai"
    ]);
}

?>
