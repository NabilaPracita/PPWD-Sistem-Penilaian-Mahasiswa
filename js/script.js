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

    data.forEach(function (mahasiswa) {
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

    data.forEach(function (mahasiswa) {
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

        success: function (data) {
            semuaDataNilai = data;
            perbaruiPilihanKelas();
            terapkanFilter();
        },

        error: function (xhr, status, error) {
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
$(document).ready(function () {
    refreshSemua();
});


// Menyimpan data mahasiswa dan ID yang akan dihapus
let semuaDataNilai = [];
let idMahasiswaHapus = null;


// Menghapus pesan validasi sebelumnya
function resetValidasi() {
    $(".error-message").hide();
    $("#formNilai input").removeClass("is-invalid");
}

// Memeriksa data sebelum disimpan
function validasiForm() {
    resetValidasi();

    let valid = true;

    let nim = $("#nim").val().trim();
    let nama = $("#nama").val().trim();
    let kelas = $("#kelas").val().trim();

    let tugas = $("#tugas").val();
    let uts = $("#uts").val();
    let uas = $("#uas").val();

    // Memeriksa NIM harus 10 digit angka
    if (!/^\d{10}$/.test(nim)) {
        $("#nim").addClass("is-invalid");
        $("#errorNim").text("NIM harus terdiri dari 10 digit angka.").show();
        valid = false;
    }

    // Memeriksa nama mahasiswa
    if (nama === "") {
        $("#nama").addClass("is-invalid");
        $("#errorNama").text("Nama wajib diisi.").show();
        valid = false;
    }

    // Memeriksa kelas mahasiswa
    if (kelas === "") {
        $("#kelas").addClass("is-invalid");
        valid = false;
    }

    // Memeriksa nilai tugas, UTS, dan UAS
    let daftarNilai = [
        { id: "#tugas", error: "#errorTugas", nilai: tugas },
        { id: "#uts", error: "#errorUts", nilai: uts },
        { id: "#uas", error: "#errorUas", nilai: uas }
    ];

    daftarNilai.forEach(function (item) {
        if (
            item.nilai === "" ||
            !Number.isFinite(Number(item.nilai)) ||
            Number(item.nilai) < 0 ||
            Number(item.nilai) > 100
        ) {
            $(item.id).addClass("is-invalid");
            $(item.error).text("Nilai harus berupa angka 0 sampai 100.").show();
            valid = false;
        }
    });

    return valid;
}

//Tambah data AJAX
$(document).on("submit", "#formNilai", function (e) {
    e.preventDefault();

    // Memeriksa data sebelum dikirim
    if (!validasiForm()) {
        return;
    }

    // Mengirim data form ke API
    $.ajax({
        url: "api/tambah_nilai.php",
        method: "POST",
        data: {
            nim: $("#nim").val().trim(),
            nama: $("#nama").val().trim(),
            kelas: $("#kelas").val().trim(),
            tugas: $("#tugas").val(),
            uts: $("#uts").val(),
            uas: $("#uas").val()
        },
        dataType: "json",

        success: function (response) {
            if (response.status === true) {
                // Mengosongkan form setelah berhasil
                $("#formNilai")[0].reset();
                resetValidasi();

                // Menampilkan notifikasi
                $("#alertBox").show();

                // Memuat ulang data dan statistik
                refreshSemua();
            } else {
                alert(response.pesan);
            }
        },

        error: function (xhr) {
            console.error("Gagal menyimpan data:", xhr.responseText);
            alert("Terjadi kesalahan saat menyimpan data.");
        }
    });
});



// Mengisi pilihan kelas berdasarkan data mahasiswa
function perbaruiPilihanKelas() {
    let kelasTerpilih = $("#filterKelas").val();

    let daftarKelas = [...new Set(
        semuaDataNilai.map(function (mahasiswa) {
            return mahasiswa.kelas;
        })
    )];

    $("#filterKelas").html('<option value="">Semua kelas</option>');

    daftarKelas.forEach(function (kelas) {
        $("#filterKelas").append(
            `<option value="${kelas}">${kelas}</option>`
        );
    });

    $("#filterKelas").val(kelasTerpilih);
}


//Kelas dan Grade Filter
// Menampilkan data berdasarkan filter

// Filter dan sorting data mahasiswa
function terapkanFilter() {
    let kelas = $("#filterKelas").val();
    let grade = $("#filterGrade").val();

    let kolomSort = $("#sortBy").val();
    let arahSort = $("#sortArah").val();

    // Memfilter data berdasarkan kelas dan grade
    let dataFilter = semuaDataNilai.filter(function (mahasiswa) {
        let cocokKelas = kelas === "" || kelas === "semua" || mahasiswa.kelas === kelas;
        let cocokGrade = grade === "" || grade === "semua" || mahasiswa.grade === grade;

        return cocokKelas && cocokGrade;
    });

    // Mengurutkan data
    dataFilter.sort(function (a, b) {
        let nilaiA = a[kolomSort];
        let nilaiB = b[kolomSort];

        if (kolomSort === "nilai_akhir") {
            nilaiA = Number(nilaiA);
            nilaiB = Number(nilaiB);
        } else {
            nilaiA = String(nilaiA).toLowerCase();
            nilaiB = String(nilaiB).toLowerCase();
        }

        if (nilaiA < nilaiB) {
            return arahSort === "asc" ? -1 : 1;
        }

        if (nilaiA > nilaiB) {
            return arahSort === "asc" ? 1 : -1;
        }

        return 0;
    });

    renderTabel(dataFilter);
    tampilkanStatistik(dataFilter);
    tampilkanGrafik(dataFilter);

    // Menjalankan filter dan sorting saat dropdown berubah
    $(document).on("change", "#filterKelas, #filterGrade, #sortBy, #sortArah", function () {
        terapkanFilter();
    });

}


//hapus data

// Menampilkan modal konfirmasi saat tombol hapus diklik
$(document).on("click", ".btn-hapus", function () {

    idMahasiswaHapus = $(this).data("id");

    let mahasiswa = semuaDataNilai.find(function (item) {
        return String(item.id) === String(idMahasiswaHapus);
    });

    if (mahasiswa) {
        $("#namaMahasiswaHapus").text(mahasiswa.nama);
    }

    $("#modalHapus").addClass("show");
});

// Menutup modal saat tombol batal diklik
$("#btnBatalHapus").on("click", function () {
    $("#modalHapus").removeClass("show");
    idMahasiswaHapus = null;
});

// Menghapus data setelah dikonfirmasi
$("#btnKonfirmasiHapus").on("click", function () {
    if (idMahasiswaHapus === null) {
        return;
    }

    $.ajax({
        url: "api/hapus_nilai.php",
        method: "POST",
        data: {
            id: idMahasiswaHapus
        },
        dataType: "json",

        success: function (response) {
            if (response.status === true) {
                $("#modalHapus").hide();
                idMahasiswaHapus = null;

                alert(response.pesan);

                // Memuat ulang data dari database
                refreshSemua();
            } else {
                alert(response.pesan);
            }
        },

        error: function (xhr) {
            console.error("Gagal menghapus data:", xhr.responseText);
            alert("Terjadi kesalahan saat menghapus data.");
        }
    });
});

// ===== GRAFIK DISTRIBUSI GRADE =====

let chartGrade = null;

function tampilkanGrafik(data) {

    let jumlahA = 0;
    let jumlahB = 0;
    let jumlahC = 0;
    let jumlahD = 0;
    let jumlahE = 0;

    data.forEach(function (mahasiswa) {
        if (mahasiswa.grade === "A") jumlahA++;
        else if (mahasiswa.grade === "B") jumlahB++;
        else if (mahasiswa.grade === "C") jumlahC++;
        else if (mahasiswa.grade === "D") jumlahD++;
        else if (mahasiswa.grade === "E") jumlahE++;
    });

    let canvas = document.getElementById("chartGrade");

    if (!canvas) return;

    if (chartGrade !== null) {
        chartGrade.destroy();
    }

    chartGrade = new Chart(canvas, {
        type: "bar",
        data: {
            labels: ["A", "B", "C", "D", "E"],
            datasets: [{
                label: "Jumlah Mahasiswa",
                data: [jumlahA, jumlahB, jumlahC, jumlahD, jumlahE],
                backgroundColor: [
                    "#8b9b75",
                    "#b8c49a",
                    "#e6c995",
                    "#e7a88c",
                    "#c98787"
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}