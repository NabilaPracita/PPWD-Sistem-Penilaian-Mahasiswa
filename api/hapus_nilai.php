<?php

header("Content-Type: application/json");

require_once __DIR__ . "/koneksi.php";

// Penghapusan data
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "status" => false,
        "pesan" => "Metode request tidak diizinkan."
    ]);
    exit;
}

// Mengambil ID data yang akan dihapus
$id = $_POST["id"] ?? "";

// Memastikan ID berupa angka positif
if (!ctype_digit((string) $id) || (int) $id <= 0) {
    echo json_encode([
        "status" => false,
        "pesan" => "ID data tidak valid."
    ]);
    exit;
}

$id = (int) $id;

// Menghapus data berdasarkan ID 
$stmt = $koneksi->prepare("DELETE FROM nilai WHERE id = ?");
$stmt->bind_param("i", $id);

// Memeriksa hasil penghapusan data
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "status" => true,
            "pesan" => "Data nilai berhasil dihapus."
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "pesan" => "Data tidak ditemukan."
        ]);
    }
} else {
    echo json_encode([
        "status" => false,
        "pesan" => "Gagal menghapus data."
    ]);
}

$stmt->close();
$koneksi->close();

