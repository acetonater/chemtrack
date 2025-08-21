let bahanKimia = JSON.parse(localStorage.getItem("bahanKimia")) || [];

const addForm = document.getElementById("addForm");
const useForm = document.getElementById("useForm");
const bahanSelect = document.getElementById("bahanSelect");
const rekapTableBody = document.querySelector("#rekapTable tbody");
const exportBtn = document.getElementById("exportCSV");

let stockChart;

// Tambah Bahan
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newBahan = {
    nama: document.getElementById("nama").value,
    idPengguna: document.getElementById("idPengguna").value,
    noCatalog: document.getElementById("noCatalog").value,
    lotNumber: document.getElementById("lotNumber").value,
    keperluan: document.getElementById("keperluan").value,
    klasifikasi: document.getElementById("klasifikasi").value,
    jumlah: parseFloat(document.getElementById("jumlah").value),
    satuan: document.getElementById("satuan").value,
    catatan: document.getElementById("catatan").value,
  };
  bahanKimia.push(newBahan);
  saveData();
  addForm.reset();
  render();
});

// Gunakan Bahan
useForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const index = bahanSelect.value;
  const jumlahUse = parseFloat(document.getElementById("jumlahUse").value);

  if (bahanKimia[index].jumlah >= jumlahUse) {
    bahanKimia[index].jumlah -= jumlahUse;
    saveData();
    render();
    useForm.reset();
  } else {
    alert("Stok tidak cukup!");
  }
});

// Render tabel & dropdown
function render() {
  rekapTableBody.innerHTML = "";
  bahanSelect.innerHTML = "<option value=''>Pilih bahan</option>";

  bahanKimia.forEach((bahan, i) => {
    // Dropdown
    let option = document.createElement("option");
    option.value = i;
    option.textContent = bahan.nama;
    bahanSelect.appendChild(option);

    // Tabel
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${bahan.nama}</td>
      <td>${bahan.idPengguna}</td>
      <td>${bahan.noCatalog}</td>
      <td>${bahan.lotNumber}</td>
      <td>${bahan.keperluan}</td>
      <td>${bahan.klasifikasi}</td>
      <td>${bahan.jumlah}</td>
      <td>${bahan.satuan}</td>
      <td>${bahan.catatan}</td>
      <td>
        <button onclick="editBahan(${i})">✏️</button>
        <button onclick="hapusBahan(${i})">🗑️</button>
      </td>
    `;
    rekapTableBody.appendChild(row);
  });

  renderChart();
}

// Edit Bahan
function editBahan(i) {
  const bahan = bahanKimia[i];
  document.getElementById("nama").value = bahan.nama;
  document.getElementById("idPengguna").value = bahan.idPengguna;
  document.getElementById("noCatalog").value = bahan.noCatalog;
  document.getElementById("lotNumber").value = bahan.lotNumber;
  document.getElementById("keperluan").value = bahan.keperluan;
  document.getElementById("klasifikasi").value = bahan.klasifikasi;
  document.getElementById("jumlah").value = bahan.jumlah;
  document.getElementById("satuan").value = bahan.satuan;
  document.getElementById("catatan").value = bahan.catatan;

  bahanKimia.splice(i, 1);
  saveData();
  render();
}

// Hapus Bahan
function hapusBahan(i) {
  if (confirm("Hapus bahan ini?")) {
    bahanKimia.splice(i, 1);
    saveData();
    render();
  }
}

// Export CSV
exportBtn.addEventListener("click", () => {
  let csv = "Nama,ID,No Catalog,Lot,Keperluan,Klasifikasi,Jumlah,Satuan,Catatan\n";
  bahanKimia.forEach((bahan) => {
    csv += `${bahan.nama},${bahan.idPengguna},${bahan.noCatalog},${bahan.lotNumber},${bahan.keperluan},${bahan.klasifikasi},${bahan.jumlah},${bahan.satuan},${bahan.catatan}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "rekap_bahan.csv");
  a.click();
});

// Grafik
function renderChart() {
  const ctx = document.getElementById("stockChart");
  if (stockChart) stockChart.destroy();
  stockChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: bahanKimia.map((b) => b.nama),
      datasets: [{
        label: "Jumlah",
        data: bahanKimia.map((b) => b.jumlah),
        backgroundColor: "#007aff"
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

// Save ke localStorage
function saveData() {
  localStorage.setItem("bahanKimia", JSON.stringify(bahanKimia));
}

render();
