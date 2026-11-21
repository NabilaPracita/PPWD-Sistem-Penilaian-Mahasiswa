<?php

$host = "localhost";
$username = "root";
$password = "Akademik123!";
$database = "db_penilaian";

$koneksi = mysqli_connect($host, $username, $password, $database);

if (!$koneksi) {
    die(json_encode([
        "status" => "error",
        "pesan" => "Koneksi database gagal: " . mysqli_connect_error()
    ]));
}

?>