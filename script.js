const form = document.getElementById("chemicalForm");
const rekapTable = document.getElementById("rekapTable");
const stokTable = document.getElementById("stokTable");
const totalTransaksi = document.getElementById("totalTransaksi");
const totalBahan = document.getElementById("totalBahan");

let transaksi = [];
let stok = {};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const userId = document.getElementById("userId").value;
  const name = document.getElementById("name").value;
  const catalog = document.getElementById("catalog").value;
  const lot = document.getElementById("lot").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const purpose = document.getElementById("purpose").value;
  const hazard = document.getElementById("hazard").value;
  const note = document.getElementById("note").value;
  const date = new Date().toLocaleString("id-ID");

  // Simpan transaksi
  transaksi.push({ userId, name, catalog, lot, amount, type, purpose, hazard, note, date });

  // Update stok
  const key = `${name}_${catalog}_${lot}`;
  if (!stok[key]) {
    stok[key] = { name, catalog, lot, jumlah: 0 };
  }

  if (type === "Penambahan") {
    stok[key].jumlah += amount;
  } else if (type === "Penggunaan") {
    stok[key].jumlah -= amount;
    if (stok[key].jumlah < 0) stok[key].jumlah = 0; 
  }

  // Render ulang
  renderRekap();
  renderStok();
  updateRingkasan();

  form.reset();
});

function renderRekap() {
  rekapTable.innerHTML = "";
  transaksi.forEach((item, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${item.userId}</td>
        <td>${item.name}</td>
        <td>${item.catalog}</td>
        <td>${item.lot}</td>
        <td>${item.amount}</td>
        <td>${item.type}</td>
        <td>${item.purpose}</td>
        <td>${item.hazard}</td>
        <td>${item.note}</td>
        <td>${item.date}</td>
      </tr>
    `;
    rekapTable.innerHTML += row;
  });
}

function renderStok() {
  stokTable.innerHTML = "";
  Object.values(stok).forEach((item) => {
    const row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.catalog}</td>
        <td>${item.lot}</td>
        <td>${item.jumlah}</td>
      </tr>
    `;
    stokTable.innerHTML += row;
  });
}

function updateRingkasan() {
  totalTransaksi.textContent = transaksi.length;
  totalBahan.textContent = Object.keys(stok).length;
}

function exportCSV() {
  let csv = "No,ID Pengguna,Nama Bahan,Katalog,Lot,Jumlah,Kategori,Keperluan,Klasifikasi Bahaya,Catatan,Tanggal\n";
  transaksi.forEach((item, index) => {
    csv += `${index + 1},${item.userId},${item.name},${item.catalog},${item.lot},${item.amount},${item.type},${item.purpose},${item.hazard},${item.note},${item.date}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "rekap_bahan_kimia.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
