// 🎵 Efek Suara
const klikSuara = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_7b1b6b6e3e.mp3?filename=click-124467.mp3");
const coinSuara = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_1d6a6a6e3e.mp3?filename=coin-124468.mp3");

// 📣 Promo Dinamis
const promoList = [
  "🔥 Situs Terlaris Minggu Ini — Diskon Hingga 60%",
  "💰 Beli Tampilan Hari Ini, Online Hari Ini!",
  "🎯 Modal Ringan, Untung Maksimal — Mulai dari 2.4K Coin",
  "🚀 Promo UG 70% Hanya Hari Ini!",
  "🎰 Saatnya Jadi Pemilik Situs, Bukan Cuma Pemain!",
  "👑 Tampilan Premium, Harga Bersahabat — Hanya di Alvianz Store"
];
setInterval(() => {
  const marquee = document.querySelector(".promo-marquee");
  if (marquee) {
    const random = promoList[Math.floor(Math.random() * promoList.length)];
    marquee.textContent = random;
  }
}, 6000);

// 🔐 Login
function masuk() {
  const nama = document.getElementById("username").value.trim();
  if (!nama) return alert("Nama tidak boleh kosong!");
  klikSuara.play();
  localStorage.setItem("nama", nama);
  localStorage.setItem("coin", "0");

  firebase.auth().signInAnonymously().then(() => {
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref("users/" + uid).set({
      nama: nama,
      waktu_login: new Date().toISOString()
    });

    document.getElementById("login-screen").classList.add("fade-out");
    setTimeout(() => {
      document.getElementById("login-screen").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      tampilkan("beranda");
      tampilkanProduk();
    }, 1000);
  });
}

// 🧭 Navigasi
function tampilkan(halaman) {
  const content = document.getElementById("content");
  content.innerHTML = "";

  if (halaman === "beranda") {
    tampilkanProduk();
  } else if (halaman === "deposit") {
    content.innerHTML = `
      <h2>💸 Deposit Coin</h2>
      <img src="https://i.imghippo.com/files/YqEh9143w.png" alt="QRIS" width="200" />
      <p>Nomor Dana: <strong>0831-4231-3394</strong></p>
      <input type="number" id="jumlah-deposit" placeholder="Masukkan jumlah (Rp)" />
      <button class="kirim-wa" onclick="kirimDeposit()">Kirim ke WhatsApp</button>
    `;
  } else if (halaman === "akun") {
    const nama = localStorage.getItem("nama");
    const coin = localStorage.getItem("coin") || "0";
    content.innerHTML = `
      <h2>👤 Akun Saya</h2>
      <p>Nama Saat Ini: <strong>${nama}</strong></p>
      <input type="text" id="nama-baru" placeholder="Ganti Nama Anda" />
      <button onclick="gantiNama()">🔁 Simpan Nama Baru</button>
      <p>Total Coin: <strong id="coin-count">💰 ${coin}</strong></p>
      <textarea placeholder="Tulis bio kamu..."></textarea><br/>
      <button onclick="logout()">🚪 Log Out</button>
    `;
  }
}

// 🛍️ Produk
function tampilkanProduk() {
  const content = document.getElementById("content");
  const produkList = [
    {
      nama: "Tampilan NEXUS",
      harga: 2400,
      gambar: "https://files.catbox.moe/uws3hf.jpg"
    },
    {
      nama: "Tampilan MPO",
      harga: 4300,
      gambar: "https://img1.pixhost.to/images/6985/618710396_imgtmp.jpg"
    },
    {
      nama: "Tampilan ID",
      harga: 2700,
      gambar: "https://img1.pixhost.to/images/6985/618710873_imgtmp.jpg"
    },
    {
      nama: "Tampilan UG",
      harga: 3500,
      gambar: "https://files.catbox.moe/8kfqt1.jpg"
    }
  ];

  produkList.forEach((produk) => {
    const card = document.createElement("div");
    card.className = "produk-card";
    card.innerHTML = `
      <img src="${produk.gambar}" alt="${produk.nama}" />
      <h3>${produk.nama}</h3>
      <p>Harga: 💰 ${produk.harga}</p>
      <button onclick="pesanProduk('${produk.nama}', ${produk.harga})">💬 Pesan Sekarang</button>
    `;
    content.appendChild(card);
  });
}

// 🛒 Formulir Pembelian
function pesanProduk(namaProduk, harga) {
  klikSuara.play();
  const data = prompt(
    `Isi format berikut:\n\nNama Rekening:\nNomor Rekening:\nRequest Domain:\nNama Situs:\nUsername Admin:\nPassword Admin:\n\nPisahkan dengan garis miring (/)`
  );

  if (!data || !data.includes("/")) return alert("Format tidak valid.");

  const [namaRek, noRek, domain, situs, user, pass] = data.split("/").map(x => x.trim());
  const nama = localStorage.getItem("nama");
  const uid = firebase.auth().currentUser.uid;

  const pesan = `Halo Admin Alvianz, saya sudah melakukan pembelian produk *${namaProduk}*.

Berikut data saya:
- Nama: ${nama}
- Nama Rekening: ${namaRek}
- Nomor Rekening: ${noRek}
- Request Domain: ${domain}
- Nama Situs: ${situs}
- Username Admin: ${user}
- Password Admin: ${pass}`;

  const nomorAdmin = "6283142313394";
  const url = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");

  firebase.database().ref("orders/" + uid).push({
    produk: namaProduk,
    harga: harga,
    waktu: new Date().toISOString()
  });
}

// 💸 Deposit
function kirimDeposit() {
  const nominal = parseInt(document.getElementById("jumlah-deposit").value);
  if (!nominal || nominal < 10000) return alert("Minimal deposit Rp10.000");

  const coin = Math.floor(nominal / 1000);
  const nama = localStorage.getItem("nama");
  const uid = firebase.auth().currentUser.uid;

  const pesan = `Halo Admin Alvianz, saya ingin deposit sebesar Rp${nominal.toLocaleString()} untuk mendapatkan ${coin} coin.`;
  const nomorAdmin = "6283142313394";
  const url = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");

  const current = parseInt(localStorage.getItem("coin") || "0");
  localStorage.setItem("coin", current + coin);
  coinSuara.play();

  firebase.database().ref("deposits/" + uid).push({
    nominal: nominal,
    waktu: new Date().toISOString()
  });
}

// 🔁 Ganti Nama
function gantiNama() {
  const namaBaru = document.getElementById("nama-baru").value.trim();
  if (!namaBaru) return alert("Nama tidak boleh kosong!");
  localStorage.setItem("nama", namaBaru);
  alert("Nama berhasil diubah!");
  tampilkan("akun");
}

// 🚪 Log Out
function logout() {
  localStorage.clear();
  location.reload();
}

// 🪙 Coin Runtime
setInterval(() => {
  const el = document.getElementById("coin-count");
  if (el) {
    const coin = parseInt(localStorage.getItem("coin") || "0");
    el.textContent = `💰 ${coin}`;
  }
}, 1000);

// 💬 Toggle Alvia AI
function toggleAlvia() {
  const box = document.getElementById("alvia-box");
  box.style.display = box.style.display === "none" ? "block" : "none";
}