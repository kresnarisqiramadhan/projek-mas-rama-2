// ============================================
// KONFIGURASI DATA BUS - SESUAI DENGAN CARI TIKET
// ============================================
const busConfig = {
    totalRows: 12,
    seatsPerRow: 4,
    vipRows: [1, 2],
    nearToiletRows: [11, 12],
    occupiedSeats: [
        '1A', '1C', '2B', '3A', '3D', 
        '5B', '6C', '7A', '8D', '10B', '11C', '12A'
    ],
    // HARGA DARI CARI TIKET - BASE PRICE
    price: {
        regular: 250000,    // Harga Tronton (base)
        vip: 550000,        // Harga VIP Class (base)
        nearToilet: 200000  // Harga diskon untuk kursi dekat toilet
    },
    busInfo: {
        operator: "BusTicket Online",
        busType: "Eksekutif AC Double Decker",
        route: "Jakarta - Bandung",
        departure: "08:00 WIB",
        arrival: "12:30 WIB",
        date: "Senin, 15 Januari 2024",
        busNumber: "B-789-XYZ",
        plateNumber: "B 1234 XYZ"
    },
    // DATA BUS DARI CARI TIKET.JS
    busTypes: {
        "Suite Class": {
            basePrice: 450000,
            type: "Suite"
        },
        "Double Decker": {
            basePrice: 350000,
            type: "Double"
        },
        "Tronton": {
            basePrice: 250000,
            type: "Big"
        },
        "VIP Class": {
            basePrice: 550000,
            type: "VIP"
        }
    }
};

// ============================================
// STATE MANAGEMENT
// ============================================
let state = {
    selectedSeats: [],
    seatMap: {},
    maxSeatsPerBooking: 6,
    selectedBusName: "Tronton", // Default
    selectedBusPrice: 250000    // Default
};

// ============================================
// INISIALISASI
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚌 Halaman pilih kursi bus siap!');
    
    // Ambil data bus yang dipilih dari halaman cari tiket
    loadSelectedBusData();
    initializeApp();
    setupEventListeners();
});

function loadSelectedBusData() {
    // Coba ambil dari sessionStorage (dari cari tiket)
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || '{}');
    const selectedBusName = bookingData.busName || "Tronton";
    
    // Set state dengan data yang sesuai
    state.selectedBusName = selectedBusName;
    state.selectedBusPrice = busConfig.busTypes[selectedBusName]?.basePrice || 250000;
    
    console.log(`✅ Bus yang dipilih: ${selectedBusName}, Harga dasar: Rp ${state.selectedBusPrice.toLocaleString()}`);
}

function initializeApp() {
    buildBusSeatLayout();
    renderBusInfo();
    updateSummary();
    updateConfirmButton();
}

function setupEventListeners() {
    document.getElementById('confirmBtn')?.addEventListener('click', handleConfirmation);
    document.getElementById('backBtn')?.addEventListener('click', handleBack);
    document.getElementById('resetBtn')?.addEventListener('click', handleReset);
    document.getElementById('selectBestSeats')?.addEventListener('click', selectBestSeats);
}

// ============================================
// FUNGSI LAYOUT KURSI SEDERHANA (TANPA HARGA DI KURSI)
// ============================================
function buildBusSeatLayout() {
    const seatsGrid = document.getElementById('seatsGrid');
    if (!seatsGrid) return;
    
    // Hapus loading spinner
    seatsGrid.innerHTML = '';
    
    // Container untuk grid kursi
    const seatsContainer = document.createElement('div');
    seatsContainer.className = 'seats-grid';
    
    // Bangun setiap baris kursi BUS (1-12)
    for (let row = 1; row <= busConfig.totalRows; row++) {
        const rowElement = createBusSeatRow(row);
        seatsContainer.appendChild(rowElement);
    }
    
    // TAMBAH AREA TOILET
    const toiletRow = document.createElement('div');
    toiletRow.className = 'toilet-area';
    toiletRow.innerHTML = `
        <i class="fas fa-toilet me-2"></i>
        AREA TOILET
    `;
    seatsContainer.appendChild(toiletRow);
    
    seatsGrid.appendChild(seatsContainer);
}

function createBusSeatRow(rowNumber) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';
    rowDiv.dataset.row = rowNumber;
    
    // Label baris
    const rowLabel = document.createElement('div');
    rowLabel.className = 'row-label';
    rowLabel.textContent = rowNumber;
    rowDiv.appendChild(rowLabel);
    
    // Container kursi dalam baris
    const seatsContainer = document.createElement('div');
    seatsContainer.className = 'seats-in-row';
    
    // BUS: 4 kursi per baris (A,B - lorong - C,D)
    const seatLetters = ['A', 'B', 'C', 'D'];
    
    for (let i = 0; i < busConfig.seatsPerRow; i++) {
        const seatLetter = seatLetters[i];
        const seatId = `${rowNumber}${seatLetter}`;
        const seatElement = createBusSeatElement(seatId, rowNumber, seatLetter);
        seatsContainer.appendChild(seatElement);
        
        // Simpan ke seatMap dengan harga yang sesuai
        state.seatMap[seatId] = {
            element: seatElement,
            id: seatId,
            row: rowNumber,
            seat: seatLetter,
            isVIP: busConfig.vipRows.includes(rowNumber),
            isNearToilet: busConfig.nearToiletRows.includes(rowNumber),
            isWindowSeat: seatLetter === 'A' || seatLetter === 'D',
            isAisleSeat: seatLetter === 'B' || seatLetter === 'C',
            isOccupied: busConfig.occupiedSeats.includes(seatId),
            isSelected: false,
            price: calculateSeatPrice(rowNumber, seatLetter)
        };
        
        // Tambah spacer antara kursi B dan C (lorong)
        if (i === 1) {
            const spacer = document.createElement('div');
            spacer.className = 'aisle-spacer';
            seatsContainer.appendChild(spacer);
        }
    }
    
    rowDiv.appendChild(seatsContainer);
    return rowDiv;
}

function calculateSeatPrice(rowNumber, seatLetter) {
    let price = state.selectedBusPrice;
    
    // Premium 30% untuk VIP rows (baris 1-2)
    if (busConfig.vipRows.includes(rowNumber)) {
        price = Math.round(price * 1.3);
    }
    
    // Diskon 20% untuk kursi dekat toilet (baris 11-12)
    if (busConfig.nearToiletRows.includes(rowNumber)) {
        price = Math.round(price * 0.8);
    }
    
    // Tambahan 10% untuk kursi jendela
    const isWindowSeat = seatLetter === 'A' || seatLetter === 'D';
    if (isWindowSeat) {
        price = Math.round(price * 1.1);
    }
    
    return price;
}

function createBusSeatElement(seatId, rowNumber, seatLetter) {
    const seatDiv = document.createElement('div');
    seatDiv.className = 'bus-seat';
    seatDiv.id = `seat-${seatId}`;
    seatDiv.dataset.seatId = seatId;
    
    // Tentukan status kursi
    const isOccupied = busConfig.occupiedSeats.includes(seatId);
    const seatPrice = calculateSeatPrice(rowNumber, seatLetter);
    
    let cssClass = 'seat-available';
    if (isOccupied) {
        cssClass = 'seat-occupied';
    }
    
    seatDiv.className = `bus-seat ${cssClass}`;
    
    // Hanya label kursi saja (tanpa harga)
    const labelSpan = document.createElement('span');
    labelSpan.className = 'seat-label';
    labelSpan.textContent = seatId;
    seatDiv.appendChild(labelSpan);
    
    // Tooltip sederhana tanpa harga
    if (isOccupied) {
        seatDiv.title = `Kursi ${seatId} sudah terisi`;
        seatDiv.style.cursor = 'not-allowed';
    } else {
        let seatType = "Tersedia";
        if (busConfig.vipRows.includes(rowNumber)) seatType = "VIP";
        if (busConfig.nearToiletRows.includes(rowNumber)) seatType = "Dekat Toilet";
        
        seatDiv.title = `Kursi ${seatId} - ${seatType}`;
        seatDiv.addEventListener('click', () => toggleSeatSelection(seatId));
    }
    
    return seatDiv;
}

// ============================================
// FUNGSI PEMILIHAN KURSI
// ============================================
function toggleSeatSelection(seatId) {
    const seat = state.seatMap[seatId];
    
    if (!seat || seat.isOccupied) {
        showNotification('Kursi ini tidak tersedia', 'error');
        return;
    }
    
    const index = state.selectedSeats.indexOf(seatId);
    
    if (index === -1) {
        if (state.selectedSeats.length >= state.maxSeatsPerBooking) {
            showNotification(`Maksimal ${state.maxSeatsPerBooking} kursi per pemesanan`, 'warning');
            return;
        }
        
        state.selectedSeats.push(seatId);
        seat.isSelected = true;
        seat.element.classList.remove('seat-available');
        seat.element.classList.add('seat-selected');
        
        console.log(`➕ Kursi dipilih: ${seatId} - Rp ${seat.price.toLocaleString()}`);
    } else {
        state.selectedSeats.splice(index, 1);
        seat.isSelected = false;
        seat.element.classList.remove('seat-selected');
        seat.element.classList.add('seat-available');
        
        console.log(`➖ Kursi dibatalkan: ${seatId}`);
    }
    
    updateSummary();
    updateConfirmButton();
}

// ============================================
// FUNGSI RENDER INFORMASI
// ============================================
function renderBusInfo() {
    // Ambil data dari bookingData (disimpan saat pilih jadwal di cari tiket)
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || localStorage.getItem('selectedSchedule') || '{}');
    
    const selectedBusName = bookingData.busName || state.selectedBusName || "Tronton";
    const origin = bookingData.origin || "Jakarta";
    const destination = bookingData.destination || "Bandung";
    const date = bookingData.date || busConfig.busInfo.date;
    const busType = busConfig.busTypes[selectedBusName]?.type || "Regular";
    const busPrice = busConfig.busTypes[selectedBusName]?.basePrice || 250000;
    
    // Update informasi bus
    document.getElementById('operatorName').textContent = busConfig.busInfo.operator;
    document.getElementById('busType').textContent = `${selectedBusName} - ${busType}`;
    document.getElementById('busRoute').textContent = `${origin} → ${destination}`;
    document.getElementById('departureTime').textContent = bookingData.departureTime || busConfig.busInfo.departure;
    document.getElementById('arrivalTime').textContent = bookingData.arrivalTime || busConfig.busInfo.arrival;
    document.getElementById('travelDate').textContent = formatDateForDisplay(date);
    document.getElementById('busNumber').textContent = generateBusNumber(selectedBusName);
    
    // Update judul halaman
    const pageTitle = document.querySelector('.lead');
    if (pageTitle) {
        pageTitle.innerHTML = `
            Pilih kursi untuk <span class="fw-bold text-primary">${selectedBusName}</span><br>
            <small class="text-muted">${origin} → ${destination} • ${formatDateForDisplay(date)}</small>
        `;
    }
}

function formatDateForDisplay(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return busConfig.busInfo.date;
        }
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    } catch {
        return busConfig.busInfo.date;
    }
}

function generateBusNumber(busName) {
    const prefixes = {
        "Suite Class": "SC",
        "Double Decker": "DD", 
        "Tronton": "TR",
        "VIP Class": "VC"
    };
    
    const prefix = prefixes[busName] || "BT";
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `${prefix}-${randomNum}`;
}

function updateSummary() {
    updateSelectedSeatsList();
    updatePriceDetails();
}

function updateSelectedSeatsList() {
    const container = document.getElementById('selected-seats-list');
    if (!container) return;
    
    if (state.selectedSeats.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-chair fa-2x mb-2"></i>
                <p>Belum ada kursi yang dipilih</p>
                <small>Klik kursi yang tersedia di atas</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.selectedSeats.map(seatId => {
        const seat = state.seatMap[seatId];
        const seatType = seat.isVIP ? 'VIP' : seat.isNearToilet ? 'Toilet' : 'Regular';
        
        return `
            <div class="d-inline-flex align-items-center bg-primary text-white rounded-pill px-3 py-2 m-1">
                <span class="fw-bold me-2">${seatId}</span>
                <button class="btn btn-sm btn-light text-danger p-1 ms-2" 
                        onclick="removeSelectedSeat('${seatId}')" 
                        title="Hapus kursi">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
}

function updatePriceDetails() {
    let totalPrice = 0;
    let regularCount = 0;
    let vipCount = 0;
    let nearToiletCount = 0;
    
    state.selectedSeats.forEach(seatId => {
        const seat = state.seatMap[seatId];
        totalPrice += seat.price;
        
        if (seat.isVIP) {
            vipCount++;
        } else if (seat.isNearToilet) {
            nearToiletCount++;
        } else {
            regularCount++;
        }
    });
    
    // Update tampilan
    document.getElementById('regular-count').textContent = regularCount;
    document.getElementById('vip-count').textContent = vipCount;
    
    // Hitung subtotal per kategori
    const regularTotal = state.selectedSeats
        .filter(seatId => !state.seatMap[seatId].isVIP && !state.seatMap[seatId].isNearToilet)
        .reduce((total, seatId) => total + state.seatMap[seatId].price, 0);
    
    const vipTotal = state.selectedSeats
        .filter(seatId => state.seatMap[seatId].isVIP)
        .reduce((total, seatId) => total + state.seatMap[seatId].price, 0);
    
    document.getElementById('regular-total').textContent = formatCurrency(regularTotal);
    document.getElementById('vip-total').textContent = formatCurrency(vipTotal);
    
    // Update total price
    document.getElementById('total-price').textContent = formatCurrency(totalPrice);
    
    // Update progress bar
    const progress = (state.selectedSeats.length / state.maxSeatsPerBooking) * 100;
    const progressBar = document.getElementById('selectionProgress');
    const selectionCount = document.getElementById('selectionCount');
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (selectionCount) selectionCount.textContent = `${state.selectedSeats.length}/${state.maxSeatsPerBooking}`;
}

function updateConfirmButton() {
    const confirmBtn = document.getElementById('confirmBtn');
    if (!confirmBtn) return;
    
    confirmBtn.disabled = state.selectedSeats.length === 0;
    
    if (state.selectedSeats.length > 0) {
        const totalPrice = calculateTotalPrice();
        confirmBtn.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            Konfirmasi (${state.selectedSeats.length} kursi) - ${formatCurrency(totalPrice)}
        `;
    } else {
        confirmBtn.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            Konfirmasi & Lanjut ke Pembayaran
        `;
    }
}

// ============================================
// FUNGSI TOMBOL AKSI
// ============================================
function handleConfirmation() {
    if (state.selectedSeats.length === 0) {
        showNotification('Silakan pilih minimal satu kursi', 'warning');
        return;
    }
    
    // Ambil data booking
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || localStorage.getItem('selectedSchedule') || '{}');
    const totalPrice = calculateTotalPrice();
    
    Swal.fire({
        title: 'Konfirmasi Pemilihan Kursi',
        html: `
            <div style="text-align: left; font-size: 1rem;">
                <p><strong>Bus:</strong> ${bookingData.busName || state.selectedBusName}</p>
                <p><strong>Rute:</strong> ${bookingData.origin || 'Jakarta'} → ${bookingData.destination || 'Bandung'}</p>
                <p><strong>Tanggal:</strong> ${formatDateForDisplay(bookingData.date)}</p>
                <p><strong>Kursi Terpilih (${state.selectedSeats.length}):</strong><br>${state.selectedSeats.join(', ')}</p>
                <hr>
                <p style="font-size: 1.2rem; font-weight: bold; color: #007bff;">
                    Total: ${formatCurrency(totalPrice)}
                </p>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Lanjutkan',
        cancelButtonText: 'Batal',
        width: '500px'
    }).then((result) => {
        if (result.isConfirmed) {
            showNotification('Pemilihan kursi berhasil!', 'success');
            
            // Simpan data lengkap
            const completeBookingData = {
                ...bookingData,
                busName: state.selectedBusName,
                basePrice: state.selectedBusPrice,
                seats: state.selectedSeats,
                seatDetails: state.selectedSeats.map(seatId => ({
                    seatId,
                    price: state.seatMap[seatId].price,
                    type: state.seatMap[seatId].isVIP ? 'VIP' : 
                          state.seatMap[seatId].isNearToilet ? 'Near Toilet' : 'Regular'
                })),
                totalPrice: totalPrice,
                bookingDate: new Date().toISOString(),
                passengerCount: document.getElementById('passengers')?.value || '1'
            };
            
            localStorage.setItem('busBookingData', JSON.stringify(completeBookingData));
            sessionStorage.setItem('busBookingData', JSON.stringify(completeBookingData));
            
            // Redirect ke pembayaran
            setTimeout(() => {
                window.location.href = '/pembeli/bayar';
            }, 1500);
        }
    });
}

function handleBack() {
    // Kembali ke halaman cari tiket
    window.location.href = '/pembeli/caritiket';
}

function handleReset() {
    if (state.selectedSeats.length === 0) return;
    
    Swal.fire({
        title: 'Reset Pilihan?',
        text: 'Anda akan menghapus semua kursi yang sudah dipilih',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Reset',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            resetSeatSelection();
            showNotification('Pilihan kursi telah direset', 'info');
        }
    });
}

function resetSeatSelection() {
    state.selectedSeats.forEach(seatId => {
        const seat = state.seatMap[seatId];
        if (seat) {
            seat.isSelected = false;
            seat.element.classList.remove('seat-selected');
            seat.element.classList.add('seat-available');
        }
    });
    
    state.selectedSeats = [];
    updateSummary();
    updateConfirmButton();
}

function removeSelectedSeat(seatId) {
    const index = state.selectedSeats.indexOf(seatId);
    if (index !== -1) {
        state.selectedSeats.splice(index, 1);
        const seat = state.seatMap[seatId];
        seat.isSelected = false;
        seat.element.classList.remove('seat-selected');
        seat.element.classList.add('seat-available');
        
        updateSummary();
        updateConfirmButton();
        showNotification(`Kursi ${seatId} dihapus`, 'info');
    }
}

function selectBestSeats() {
    resetSeatSelection();
    
    // Rekomendasi kursi terbaik: VIP rows dan kursi jendela
    const recommendations = [];
    
    // Prioritaskan kursi VIP jendela
    for (let row of busConfig.vipRows) {
        const seatA = `${row}A`;
        const seatD = `${row}D`;
        
        if (!busConfig.occupiedSeats.includes(seatA)) {
            recommendations.push(seatA);
        }
        if (!busConfig.occupiedSeats.includes(seatD)) {
            recommendations.push(seatD);
        }
    }
    
    // Kursi jendela biasa (baris 3-8)
    for (let row = 3; row <= 8; row++) {
        if (recommendations.length >= 2) break;
        
        const seatA = `${row}A`;
        const seatD = `${row}D`;
        
        if (!busConfig.occupiedSeats.includes(seatA) && 
            !busConfig.nearToiletRows.includes(row)) {
            recommendations.push(seatA);
        }
        if (!busConfig.occupiedSeats.includes(seatD) && 
            !busConfig.nearToiletRows.includes(row)) {
            recommendations.push(seatD);
        }
    }
    
    // Pilih maksimal 2 kursi rekomendasi
    recommendations.slice(0, 2).forEach(seatId => {
        if (!state.seatMap[seatId].isOccupied && 
            state.selectedSeats.length < state.maxSeatsPerBooking) {
            toggleSeatSelection(seatId);
        }
    });
    
    if (recommendations.length > 0) {
        showNotification(`Rekomendasi kursi terbaik dipilih`, 'info');
    } else {
        showNotification('Tidak ada kursi rekomendasi tersedia', 'warning');
    }
}

// ============================================
// FUNGSI UTILITAS
// ============================================
function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function calculateTotalPrice() {
    return state.selectedSeats.reduce((total, seatId) => {
        return total + state.seatMap[seatId].price;
    }, 0);
}

function showNotification(message, type = 'info') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: 3000
        });
    }
}

// ============================================
// FUNGSI GLOBAL
// ============================================
window.removeSelectedSeat = removeSelectedSeat;
window.selectBestSeats = selectBestSeats;
window.handleReset = handleReset;

console.log('🎯 Pembeli Pilih Kursi JS loaded - Tanpa harga di kursi');