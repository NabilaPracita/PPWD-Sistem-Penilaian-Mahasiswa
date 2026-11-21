// =========FUNGSI PERHITUNGAN NILAI AKHIR==============
//

function hitungNilaiAkhir(tugas, uts, uas) { //membuat fungsi untuk menghitung nilai akhir berdasarkan bobot tugas, UTS, dan UAS
    let nilaiAkhir = (tugas * 0.3) + (uts * 0.3) + (uas * 0.4); //meghitung nilai akhir mahasiswa berdasarkan bobot yang sudah ditentukan

    return nilaiAkhir; //mengembalikan nilai akhir mahasiswa
}


// =========FUNGSI MENENTUKAN GRADE==============

function tentukanGrade(nilai) { //membuat fungsi untuk menentukan grade berdasarkan nilai akhir mahasiswa
    if (nilai >= 85) { //memeriksa apakah nilai akhir mahasiswa lebih besar atau sama dengan 85
        return "A"; //jika iya mengembalian grade A
    } else if (nilai >= 70) { //memeriksa apakah nilai akhir mahasiswa lebih besar atau sama dengan 70
        return "B"; //jika iya mengembalian grade B
    } else if (nilai >= 55) { //memeriksa apakah nilai akhir mahasiswa lebih besar atau sama dengan 55
        return "C"; //jika iya mengembalian grade C
    } else if (nilai >= 40) { //memeriksa apakah nilai akhir mahasiswa lebih besar atau sama dengan 40
        return "D"; //jika iya mengembalian grade D
    } else { //memeriksa apakah nilai akhir mahasiswa lebih kecil dari 40
        return "E"; //jika iya mengembalian grade E
    }
}

// =========FUNGSI MENGHITUNG STATISTIK==============

function hitungStatistik(data) {
    let totalNilai = 0;
    let nilaiTertinggi = data.length > 0 ? Number(data[0].nilai_akhir) : 0;
    let nilaiTerendah = nilaiTertinggi;

    let jumlahGradeA = 0;
    let jumlahGradeB = 0;
    let jumlahGradeC = 0;
    let jumlahGradeD = 0;
    let jumlahGradeE = 0;

    data.forEach(function(mahasiswa) {
        let nilai = Number(mahasiswa.nilai_akhir);

        totalNilai += nilai;

        if (nilai > nilaiTertinggi) {
            nilaiTertinggi = nilai;
        }

        if (nilai < nilaiTerendah) {
            nilaiTerendah = nilai;
        }

        if (mahasiswa.grade === "A") {
            jumlahGradeA++;
        } else if (mahasiswa.grade === "B") {
            jumlahGradeB++;
        } else if (mahasiswa.grade === "C") {
            jumlahGradeC++;
        } else if (mahasiswa.grade === "D") {
            jumlahGradeD++;
        } else if (mahasiswa.grade === "E") {
            jumlahGradeE++;
        }
    });

    let rataRata = data.length > 0 ? totalNilai / data.length : 0;

    return {
        rataRata,
        nilaiTertinggi,
        nilaiTerendah,
        jumlahGradeA,
        jumlahGradeB,
        jumlahGradeC,
        jumlahGradeD,
        jumlahGradeE
    };
}

// =========FUNGSI MENAMPILKAN DATA KE TABEL==============

function renderTabel(data) {
    let barisTabel = "";

    data.forEach(function(mahasiswa) {
        barisTabel += `
            <tr>
                <td>${mahasiswa.nim}</td>
                <td>${mahasiswa.nama}</td>
                <td>${mahasiswa.kelas}</td>
                <td>${mahasiswa.tugas}</td>
                <td>${mahasiswa.uts}</td>
                <td>${mahasiswa.uas}</td>
                <td>${mahasiswa.nilai_akhir}</td>
                <td>${mahasiswa.grade}</td>
                <td>
                    <button type="button" class="btn-hapus" data-id="${mahasiswa.id}">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    });

    $("#bodyTabel").html(barisTabel);
}

// =========FUNGSI MENAMPILKAN STATISTIK==============

function tampilkanStatistik(data) {
    let statistik = hitungStatistik(data);

    $("#statRata").text(statistik.rataRata.toFixed(2));
    $("#statMax").text(statistik.nilaiTertinggi);
    $("#statMin").text(statistik.nilaiTerendah);

    $("#statGradeA").text(statistik.jumlahGradeA);
    $("#statGradeB").text(statistik.jumlahGradeB);
    $("#statGradeC").text(statistik.jumlahGradeC);
    $("#statGradeD").text(statistik.jumlahGradeD);
    $("#statGradeE").text(statistik.jumlahGradeE);
}

// =========FUNGSI MEMUAT DATA DARI API==============

function muatData() {
    $.ajax({
        url: "api/get_nilai.php",
        method: "GET",
        dataType: "json",

        success: function(data) {
            renderTabel(data);
            tampilkanStatistik(data);
        },

        error: function(xhr, status, error) {
            console.error("Gagal mengambil data nilai:", error);
        }
    });
}

// =========FUNGSI MEMPERBARUI SELURUH DATA==============

function refreshSemua() {
    muatData();
}

// Export fungsi untuk pengujian Node.js
if (typeof module !== "undefined") { //memeriksa apakah module tidak undefined = belum terfungsi, maka akan mengekspor fungsi untuk pengujian Node.js
    module.exports = { //mengekspor fungsi dari file script.js agar dapat digunakan di file lain
        hitungNilaiAkhir, //mengekspor fungsi hitungNilaiAkhir agar dapat digunakan di file lain
        tentukanGrade, //mengekspor fungsi tentukanGrade agar dapat digunakan di file lain
        hitungStatistik, //mengekspor fungsi hitungStatistik agar dapat digunakan di file lain
        renderTabel, //mengekspor fungsi renderTabel agar dapat digunakan di file lain
        tampilkanStatistik, //mengekspor fungsi tampilkanStatistik agar dapat digunakan di file lain
        muatData, //mengekspor fungsi muatData agar dapat digunakan di file lain
        refreshSemua //mengekspor fungsi refreshSemua agar dapat digunakan di file lain
    };
}
$(document).ready(function() {
    refreshSemua();
});