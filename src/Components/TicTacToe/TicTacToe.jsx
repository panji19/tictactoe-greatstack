import React, { useState, useRef, useEffect } from 'react';
import './TicTacToe.css'; // Pastikan file CSS ini ada di lokasi yang benar
import circle_icon from '../Assets/circle.png'; // Pastikan path icon benar
import cross_icon from '../Assets/cross.png';   // Pastikan path icon benar

// Komponen fungsional utama TicTacToe
const TicTacToe = () => {
    // State untuk menyimpan data papan permainan (9 kotak, index 0-8)
    const [data, setData] = useState(["", "", "", "", "", "", "", "", ""]);

    // State untuk menghitung jumlah langkah/giliran (0 hingga 9)
    const [count, setCount] = useState(0);

    // State untuk mengunci papan setelah ada pemenang atau seri
    const [lock, setLock] = useState(false);

    // State untuk menampilkan pesan pemenang atau seri
    const [winnerMessage, setWinnerMessage] = useState("");

    // Menggunakan useRef untuk mendapatkan referensi ke setiap elemen kotak (div)
    // Ini lebih disarankan daripada manipulasi e.target.innerHTML langsung
    const box0 = useRef(null);
    const box1 = useRef(null);
    const box2 = useRef(null);
    const box3 = useRef(null);
    const box4 = useRef(null);
    const box5 = useRef(null);
    const box6 = useRef(null);
    const box7 = useRef(null);
    const box8 = useRef(null);

    // Array berisi semua referensi kotak, untuk memudahkan iterasi saat reset
    const boxArray = [box0, box1, box2, box3, box4, box5, box6, box7, box8];

    // useEffect hook untuk memanggil checkWin setiap kali 'count' berubah
    // dan jika permainan belum terkunci
    useEffect(() => {
        if (count > 0 && !lock) { // Cek hanya setelah langkah pertama dan jika game tidak terkunci
            checkWin();
            // Cek untuk hasil seri jika sudah 9 langkah dan belum ada pemenang
            if (count === 9 && !lock && winnerMessage === "") { // Tambahan winnerMessage === "" untuk memastikan tidak ada pemenang
                setWinnerMessage("It's a Draw!");
                setLock(true);
            }
        }
    }, [count, lock, winnerMessage]); // Dependensi: jalankan saat count, lock, atau winnerMessage berubah

    // Fungsi untuk menangani klik pada kotak
    const toggle = (e, num) => {
        // Jika permainan terkunci atau kotak sudah terisi, keluar dari fungsi
        if (lock || data[num] !== "") {
            return;
        }

        // Buat salinan dari array data untuk diubah (penting untuk imutabilitas state React)
        const newData = [...data];

        // Tentukan giliran siapa (X untuk count genap, O untuk count ganjil)
        if (count % 2 === 0) {
            e.target.innerHTML = `<img src='${cross_icon}' alt='cross'>`;
            newData[num] = "x";
        } else {
            e.target.innerHTML = `<img src='${circle_icon}' alt='circle'>`;
            newData[num] = "o";
        }

        // Perbarui state 'data' dan 'count'
        setData(newData);
        setCount(prevCount => prevCount + 1); // Gunakan pembaruan fungsi untuk count
    };

    // Fungsi untuk memeriksa kondisi kemenangan
    const checkWin = () => {
        // Semua kemungkinan garis kemenangan
        const lines = [
            // Horizontal
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            // Vertikal
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            // Diagonal
            [0, 4, 8], [2, 4, 6]
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            // Jika ketiga kotak dalam satu garis sama dan tidak kosong
            if (data[a] !== "" && data[a] === data[b] && data[b] === data[c]) {
                won(data[a]); // Panggil fungsi won dengan simbol pemenang ('x' atau 'o')
                return; // Keluar setelah menemukan pemenang
            }
        }
    };

    // Fungsi yang dipanggil saat ada pemenang
    const won = (winner) => {
        setLock(true); // Kunci papan
        setWinnerMessage(`Pemenang: ${winner.toUpperCase()}!`); // Set pesan pemenang
    };

    // Fungsi untuk mereset permainan
    const resetGame = () => {
        setLock(false); // Buka kunci papan
        setCount(0); // Reset hitungan langkah
        setData(["", "", "", "", "", "", "", "", ""]); // Bersihkan data papan
        setWinnerMessage(""); // Kosongkan pesan pemenang

        // Kosongkan innerHTML dari semua kotak menggunakan refs
        boxArray.forEach(boxRef => {
            if (boxRef.current) {
                boxRef.current.innerHTML = "";
            }
        });
    };

    return (
        <div className="container">
            {/* Judul Game */}
            <h1 className="title">Tic Tac Toe <span>React</span></h1>

            {/* Pesan Pemenang/Seri */}
            {winnerMessage && (
                <div className="winner-message">{winnerMessage}</div>
            )}

            {/* Papan Permainan */}
            <div className="board">
                {/* Menggunakan map untuk merender 9 kotak secara dinamis */}
                {data.map((_, index) => (
                    <div
                        key={index}
                        ref={boxArray[index]} // Kaitkan ref ke setiap kotak
                        className="boxes"
                        onClick={(e) => toggle(e, index)}
                    >
                        {/* Konten (icon X atau O) akan diatur oleh fungsi toggle */}
                    </div>
                ))}
            </div>

            {/* Tombol Reset */}
            <button className="reset" onClick={resetGame}>Reset</button>
        </div>
    );
};

export default TicTacToe;