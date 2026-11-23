<?php

// Mengatur koneksi ke database
$host = "localhost";
$username = "root";
$password = "";
$database = "db_penilaian";

// Membuat koneksi menggunakan MySQLi
$koneksi = mysqli_connect($host, $username, $password, $database);

// Memeriksa koneksi database
if (!$koneksi) {
    die(json_encode([
        "status" => false,
        "pesan" => "Koneksi database gagal."
    ]));
}

// Mengatur karakter agar mendukung berbagai jenis teks
mysqli_set_charset($koneksi, "utf8mb4");
