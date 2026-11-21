<?php

header("Content-Type: application/json");

require_once __DIR__ . "/koneksi.php";

// Data nilai hanya bisa ditambahkan melalui POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "status" => false,
        "pesan" => "Metode request tidak diizinkan."
    ]);
    exit;
}

// Mengambil data yang dikirim dari form
$nim = trim($_POST["nim"] ?? "");
$nama = trim($_POST["nama"] ?? "");
$kelas = trim($_POST["kelas"] ?? "");
$tugas = $_POST["tugas"] ?? "";
$uts = $_POST["uts"] ?? "";
$uas = $_POST["uas"] ?? "";

// Memastikan seluruh data sudah diisi
if (
    $nim === "" ||
    $nama === "" ||
    $kelas === "" ||
    $tugas === "" ||
    $uts === "" ||
    $uas === ""
) {
    echo json_encode([
        "status" => false,
        "pesan" => "Semua field wajib diisi."
    ]);
    exit;
}

// NIM harus terdiri dari 10 digit angka
if (!preg_match("/^\d{10}$/", $nim)) {
    echo json_encode([
        "status" => false,
        "pesan" => "NIM harus terdiri dari 10 digit angka."
    ]);
    exit;
}

// Memeriksa agar nilai tidak kurang dari 0 atau lebih dari 100
$nilai = [$tugas, $uts, $uas];

foreach ($nilai as $angka) {
    if (!is_numeric($angka) || $angka < 0 || $angka > 100) {
        echo json_encode([
            "status" => false,
            "pesan" => "Nilai harus berupa angka antara 0 sampai 100."
        ]);
        exit;
    }
}

// Mengubah nilai input menjadi tipe angka
$tugas = (float) $tugas;
$uts = (float) $uts;
$uas = (float) $uas;

// Menghitung nilai akhir
$nilai_akhir = (0.30 * $tugas) + (0.30 * $uts) + (0.40 * $uas);

// Menentukan grade 
if ($nilai_akhir >= 85) {
    $grade = "A";
} elseif ($nilai_akhir >= 70) {
    $grade = "B";
} elseif ($nilai_akhir >= 55) {
    $grade = "C";
} elseif ($nilai_akhir >= 40) {
    $grade = "D";
} else {
    $grade = "E";
}

// Memeriksa apakah NIM sudah pernah digunakan
$cek = $koneksi->prepare("SELECT nim FROM nilai WHERE nim = ?");
$cek->bind_param("s", $nim);
$cek->execute();

$hasil = $cek->get_result();

if ($hasil->num_rows > 0) {
    echo json_encode([
        "status" => false,
        "pesan" => "NIM sudah terdaftar."
    ]);

    $cek->close();
    $koneksi->close();
    exit;
}

$cek->close();

// Menyimpan data mahasiswa
$stmt = $koneksi->prepare(
    "INSERT INTO nilai
    (nim, nama, kelas, tugas, uts, uas, nilai_akhir, grade)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "sssdddds",
    $nim,
    $nama,
    $kelas,
    $tugas,
    $uts,
    $uas,
    $nilai_akhir,
    $grade
);

// Mengirimkan hasil proses penyimpanan
if ($stmt->execute()) {
    echo json_encode([
        "status" => true,
        "pesan" => "Data nilai berhasil ditambahkan."
    ]);
} else {
    echo json_encode([
        "status" => false,
        "pesan" => "Gagal menambahkan data."
    ]);
}

$stmt->close();
$koneksi->close();

