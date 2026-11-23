-- ============================================
-- MIGRATION: CREATE TABLE NILAI
-- SISTEM PENILAIAN MAHASISWA
-- ============================================

USE db_penilaian;


-- ============================================
-- CREATE TABLE NILAI
-- ============================================

CREATE TABLE IF NOT EXISTS nilai (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nim VARCHAR(20) NOT NULL UNIQUE,

    nama VARCHAR(100) NOT NULL,

    kelas VARCHAR(20) NOT NULL,

    tugas DECIMAL(5,2) NOT NULL,

    uts DECIMAL(5,2) NOT NULL,

    uas DECIMAL(5,2) NOT NULL,

    nilai_akhir DECIMAL(5,2) NOT NULL,

    grade CHAR(1) NOT NULL

);