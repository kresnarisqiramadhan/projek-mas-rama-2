// static/js/pembeli_caritiket.js - VERSION WITHOUT TIME LABELS

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Cari Tiket page loaded successfully!');
    
    // DATA PERUSAHAAN - 4 ARMADA dengan 2 JADWAL MASING-MASING
    window.companyBuses = [
        {
            id: 1,
            name: 'Suite Class',
            type: 'Suite',
            busNumber: 'SC-001',
            capacity: 36,
            facilities: ['AC Premium', 'Bed Seat VIP', 'TV 24"', 'WiFi High-Speed', 'Toilet Private', 'Makan 2x', 'Minuman Gratis', 'Selimut & Bantal'],
            schedules: [
                { time: '07:00', duration: '6 jam', price: 450000 },
                { time: '19:00', duration: '6 jam', price: 480000 }
            ]
        },
        {
            id: 2,
            name: 'Double Decker',
            type: 'Double',
            busNumber: 'DD-002',
            capacity: 48,
            facilities: ['AC Full', 'Seat Lantai 2', 'TV', 'WiFi', 'Snack', 'Air Mineral'],
            schedules: [
                { time: '08:30', duration: '7 jam', price: 350000 },
                { time: '20:30', duration: '7 jam', price: 380000 }
            ]
        },
        {
            id: 3,
            name: 'Tronton',
            type: 'Big',
            busNumber: 'TR-003',
            capacity: 52,
            facilities: ['AC Standard', 'Seat Lebar', 'TV', 'Air Mineral'],
            schedules: [
                { time: '06:00', duration: '8 jam', price: 250000 },
                { time: '18:00', duration: '8 jam', price: 280000 }
            ]
        },
        {
            id: 4,
            name: 'VIP Class',
            type: 'VIP',
            busNumber: 'VC-004',
            capacity: 32,
            facilities: ['AC VIP', 'Reclining Seat Premium', 'TV 32"', 'WiFi VIP', 'Toilet', 'Makan 3x', 'Minuman Premium', 'Bantal Memory Foam'],
            schedules: [
                { time: '09:00', duration: '5.5 jam', price: 550000 },
                { time: '21:00', duration: '5.5 jam', price: 600000 }
            ]
        }
    ];
    
    // Inisialisasi
    initializeSearchForm();
    initializeDateInput();
    initializeLogoutButton();
    initializeSelectButtons();
    
    // Tampilkan info armada
    displayFleetInfo();
    
    console.log('🎯 Cari Tiket JS initialized with 4 buses (2 schedules each)');
});

// 1. TAMPILKAN INFO ARMADA (TANPA LABEL PAGI/SORE)
function displayFleetInfo() {
    const fleetGrid = document.querySelector('.fleet-grid');
    if (!fleetGrid) return;
    
    fleetGrid.innerHTML = '';
    
    window.companyBuses.forEach(bus => {
        const fleetItem = document.createElement('div');
        fleetItem.className = 'fleet-item';
        
        // Format schedule list TANPA label pagi/sore
        const scheduleList = bus.schedules.map(schedule => {
            return `
            <div class="schedule-item">
                <div>
                    <span class="schedule-time">${schedule.time}</span>
                </div>
                <span class="schedule-price">Rp ${schedule.price.toLocaleString('id-ID')}</span>
            </div>`;
        }).join('');
        
        fleetItem.innerHTML = `
            <div class="fleet-header">
                <div style="display: flex; align-items: center; gap: 0.8rem;">
                    <h4>${bus.name}</h4>
                </div>
                <span class="fleet-type">${bus.type}</span>
            </div>
            <div class="fleet-details">
                <p><i class="fas fa-users"></i> ${bus.capacity} Kursi</p>
                <p><i class="fas fa-clock"></i> 2 Jadwal/Hari</p>
            </div>
            <div class="fleet-schedule">
                ${scheduleList}
            </div>
            <div class="fleet-facilities">
                <small>
                    <i class="fas fa-star"></i> Fasilitas: ${bus.facilities.slice(0, 3).join(', ')}...
                </small>
            </div>
        `;
        
        fleetGrid.appendChild(fleetItem);
    });
}

// 2. INISIALISASI FORM PENCARIAN
function initializeSearchForm() {
    const searchForm = document.getElementById('searchForm');
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        performSearch();
    });
    
    // Set event untuk validasi real-time
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    
    if (originSelect && destinationSelect) {
        originSelect.addEventListener('change', validateCitySelection);
        destinationSelect.addEventListener('change', validateCitySelection);
    }
    
    // Auto set tanggal besok
    const dateInput = document.getElementById('departureDate');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
        dateInput.min = new Date().toISOString().split('T')[0];
    }
}

// 3. VALIDASI PILIHAN KOTA
function validateCitySelection() {
    const origin = document.getElementById('origin')?.value;
    const destination = document.getElementById('destination')?.value;
    
    if (origin && destination && origin === destination) {
        showNotification('Kota asal dan tujuan tidak boleh sama!', 'warning');
        return false;
    }
    
    return true;
}

// 4. INISIALISASI INPUT TANGGAL
function initializeDateInput() {
    const dateInput = document.getElementById('departureDate');
    if (!dateInput) return;
    
    // Set min date ke hari ini
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Set max date 3 bulan dari sekarang
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];
}

// 5. PROSES PENCARIAN
function performSearch() {
    const origin = document.getElementById('origin')?.value;
    const destination = document.getElementById('destination')?.value;
    const date = document.getElementById('departureDate')?.value;
    
    // Validasi
    if (!origin || !destination || !date) {
        showNotification('Harap isi semua field pencarian!', 'error');
        return;
    }
    
    if (origin === destination) {
        showNotification('Kota asal dan tujuan tidak boleh sama!', 'error');
        return;
    }
    
    // Tampilkan loading
    showLoading(true);
    
    // Simulasi loading
    setTimeout(() => {
        const results = generateSearchResults(origin, destination, date);
        displaySearchResults(results);
        showLoading(false);
        
        if (results.length > 0) {
            showNotification(`Ditemukan ${results.length} jadwal bus untuk rute ${origin} → ${destination}`, 'success');
        } else {
            showNotification('Tidak ada jadwal tersedia untuk rute ini', 'warning');
        }
    }, 800);
}

// 6. GENERATE HASIL PENCARIAN
function generateSearchResults(origin, destination, date) {
    const results = [];
    let scheduleId = 1;
    
    // Untuk setiap bus
    window.companyBuses.forEach(bus => {
        // Untuk setiap jadwal dalam bus (2 jadwal saja)
        bus.schedules.forEach(schedule => {
            // Hitung waktu tiba
            const [hours] = schedule.duration.match(/\d+/);
            const arrivalTime = calculateArrivalTime(schedule.time, parseFloat(schedule.duration));
            
            // Generate jumlah kursi acak (30-90% dari kapasitas)
            const minSeats = Math.floor(bus.capacity * 0.3);
            const maxSeats = Math.floor(bus.capacity * 0.9);
            const availableSeats = Math.floor(Math.random() * (maxSeats - minSeats + 1)) + minSeats;
            
            // Tambahkan ke hasil (TANPA KATEGORI WAKTU)
            results.push({
                id: scheduleId,
                busId: bus.id,
                busName: bus.name,
                busType: bus.type,
                busNumber: bus.busNumber,
                origin: origin,
                destination: destination,
                date: date,
                departureTime: schedule.time,
                arrivalTime: arrivalTime,
                duration: schedule.duration,
                price: calculateFinalPrice(schedule.price, date),
                availableSeats: availableSeats,
                totalSeats: bus.capacity,
                facilities: bus.facilities
            });
            
            scheduleId++;
        });
    });
    
    // Urutkan berdasarkan waktu keberangkatan
    return results.sort((a, b) => {
        const timeA = a.departureTime.split(':').map(Number);
        const timeB = b.departureTime.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });
}

// 7. HITUNG WAKTU TIBA (support untuk jam desimal)
function calculateArrivalTime(departureTime, durationHours) {
    const [hours, minutes] = departureTime.split(':').map(Number);
    
    // Konversi durasi ke menit
    const durationMinutes = Math.round(durationHours * 60);
    
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    
    const arrivalHour = Math.floor(totalMinutes / 60) % 24;
    const arrivalMinute = totalMinutes % 60;
    
    return `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;
}

// 8. HITUNG HARGA FINAL
function calculateFinalPrice(basePrice, dateString) {
    let price = basePrice;
    const date = new Date(dateString);
    const day = date.getDay(); // 0 = Minggu, 6 = Sabtu
    
    // Weekend lebih mahal
    if (day === 0 || day === 6) {
        price = Math.round(price * 1.20); // 20% lebih mahal di weekend
    }
    
    return price;
}

// 9. TAMPILKAN HASIL PENCARIAN (TANPA SUMMARY PAGI/SORE)
function displaySearchResults(results) {
    const busList = document.getElementById('busList');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    const searchResults = document.getElementById('searchResults');
    
    if (!busList || !resultsCount || !noResults || !searchResults) return;
    
    // Update counter
    const totalResults = results.length;
    resultsCount.textContent = `${totalResults} jadwal ditemukan`;
    
    if (totalResults === 0) {
        searchResults.style.display = 'none';
        noResults.style.display = 'block';
        noResults.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>Tidak ada jadwal tersedia</h3>
            <p>Coba pilih tanggal lain atau rute yang berbeda</p>
        `;
        return;
    }
    
    // Kosongkan dulu
    busList.innerHTML = '';
    
    // Tambahkan setiap hasil
    results.forEach(bus => {
        const busCard = createBusCard(bus);
        busList.appendChild(busCard);
    });
    
    // Tampilkan hasil
    noResults.style.display = 'none';
    searchResults.style.display = 'block';
}

// 10. BUAT KARTU BUS (TANPA LABEL PAGI/SORE)
function createBusCard(bus) {
    const card = document.createElement('div');
    card.className = 'bus-card';
    
    // Hitung persentase kursi
    const seatPercentage = Math.round((bus.availableSeats / bus.totalSeats) * 100);
    
    // Tentukan warna progress berdasarkan ketersediaan
    let progressColor = '#27ae60'; // Hijau default
    if (seatPercentage > 80) progressColor = '#e74c3c'; // Merah jika hampir penuh
    else if (seatPercentage > 60) progressColor = '#f39c12'; // Kuning jika cukup penuh
    
    card.innerHTML = `
        <div class="bus-header">
            <div class="bus-name">
                <div>
                    <h3>${bus.busName}</h3>
                    <div class="bus-number">
                        No: ${bus.busNumber} • ${bus.busType}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bus-details">
            <div class="detail-item">
                <i class="fas fa-route" style="color: #9b59b6;"></i>
                <div>
                    <div class="detail-label">Rute</div>
                    <div class="detail-value">
                        <span style="color: #e74c3c;">${bus.origin}</span> 
                        <i class="fas fa-arrow-right" style="margin: 0 5px; color: #95a5a6;"></i>
                        <span style="color: #27ae60;">${bus.destination}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-item">
                <i class="fas fa-calendar-alt" style="color: #e67e22;"></i>
                <div>
                    <div class="detail-label">Tanggal</div>
                    <div class="detail-value">${formatDate(bus.date)}</div>
                </div>
            </div>
            
            <div class="detail-item">
                <i class="fas fa-clock" style="color: #3498db;"></i>
                <div>
                    <div class="detail-label">Berangkat</div>
                    <div class="detail-value">
                        <strong>${bus.departureTime}</strong> WIB
                    </div>
                </div>
            </div>
            
            <div class="detail-item">
                <i class="fas fa-flag-checkered" style="color: #2ecc71;"></i>
                <div>
                    <div class="detail-label">Tiba</div>
                    <div class="detail-value">
                        <strong>${bus.arrivalTime}</strong> WIB
                    </div>
                </div>
            </div>
        </div>
        
        <div class="seats-info">
            <div class="seats-count">
                <span>Kursi Tersedia: <strong>${bus.availableSeats} / ${bus.totalSeats}</strong></span>
                <span style="color: ${seatPercentage > 80 ? '#e74c3c' : seatPercentage > 60 ? '#f39c12' : '#27ae60'}">
                    ${seatPercentage}% terisi
                </span>
            </div>
            <div class="seat-progress">
                <div class="progress-bar" style="width: ${seatPercentage}%; background: ${progressColor};"></div>
            </div>
        </div>
        
        <div class="facilities-section">
            <div style="font-size: 0.9rem; color: #667eea; margin-bottom: 0.5rem;">
                <i class="fas fa-wifi"></i> Fasilitas:
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                ${bus.facilities.slice(0, 4).map(fac => `
                    <span style="background: white; border: 1px solid #667eea; color: #667eea; padding: 0.3rem 0.6rem; border-radius: 15px; font-size: 0.8rem;">
                        ${fac}
                    </span>
                `).join('')}
                ${bus.facilities.length > 4 ? 
                    `<span style="color: #7f8c8d; font-size: 0.8rem; background: #f8f9fa; padding: 0.3rem 0.6rem; border-radius: 15px; border: 1px dashed #bdc3c7;">
                        +${bus.facilities.length - 4} lainnya
                    </span>` : 
                    ''}
            </div>
        </div>
        
        <div class="bus-footer">
            <div class="price-container">
                <div class="price">
                    Rp ${bus.price.toLocaleString('id-ID')}
                    <small>/orang</small>
                </div>
                <div class="price-note">
                    <i class="fas fa-info-circle"></i> 
                    <span>Harga sudah termasuk PPN</span>
                </div>
            </div>
            <button class="select-btn" data-schedule-id="${bus.id}" data-bus-name="${bus.busName}">
                <i class="fas fa-check-circle"></i> Pilih Jadwal
            </button>
        </div>
    `;
    
    return card;
}

// 11. FORMAT TANGGAL
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

// 12. INISIALISASI TOMBOL LOGOUT
function initializeLogoutButton() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            if (!confirm('Yakin ingin logout dari sistem?')) {
                event.preventDefault();
            }
        });
    }
}

// 13. INISIALISASI TOMBOL PILIH
function initializeSelectButtons() {
    // Gunakan event delegation
    document.addEventListener('click', function(event) {
        const selectBtn = event.target.closest('.select-btn');
        if (selectBtn) {
            const scheduleId = selectBtn.getAttribute('data-schedule-id');
            const busName = selectBtn.getAttribute('data-bus-name');
            selectSchedule(scheduleId, busName);
        }
    });
}

// 14. PROSES PEMILIHAN JADWAL
function selectSchedule(scheduleId, busName) {
    console.log(`Pilih jadwal ${scheduleId} - ${busName}`);
    
    // Simpan ke localStorage
    localStorage.setItem('selectedScheduleId', scheduleId);
    localStorage.setItem('selectedBusName', busName);
    
    // Ambil data form
    const origin = document.getElementById('origin')?.value;
    const destination = document.getElementById('destination')?.value;
    const date = document.getElementById('departureDate')?.value;
    const passengers = document.getElementById('passengers')?.value || '1';
    
    // Simpan ke session
    sessionStorage.setItem('bookingData', JSON.stringify({
        scheduleId: scheduleId,
        busName: busName,
        origin: origin,
        destination: destination,
        date: date,
        passengers: passengers,
        timestamp: new Date().toISOString()
    }));
    
    showNotification(`Memilih ${busName}`, 'success');
    
    // Redirect ke halaman pemilihan kursi
    setTimeout(() => {
    window.location.href = `/pembeli/kursi?schedule=${scheduleId}`;
}, 1000);
}

// 15. TOGGLE LOADING STATE
function showLoading(show) {
    const loading = document.getElementById('loading');
    const searchResults = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    
    if (loading) loading.style.display = show ? 'block' : 'none';
    if (searchResults) searchResults.style.display = show ? 'none' : 'block';
    if (noResults && show) noResults.style.display = 'none';
}

// 16. FUNGSI NOTIFIKASI
function showNotification(message, type = 'info') {
    // Hapus notifikasi sebelumnya
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) oldNotification.remove();
    
    // Buat notifikasi baru
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : 
                     type === 'error' ? '#e74c3c' : 
                     type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove setelah 5 detik
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// 17. TAMBAHKAN STYLE ANIMASI
(function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification {
            transition: all 0.3s ease;
        }
        
        .bus-number {
            font-size: 0.9rem;
            color: #7f8c8d;
            margin-top: 0.2rem;
        }
        
        /* Style untuk schedule item di armada */
        .schedule-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            background: #f8f9fa;
            border-radius: 6px;
            margin-bottom: 0.3rem;
        }
        
        .schedule-time {
            font-weight: 600;
            color: #2c3e50;
            font-size: 0.95rem;
        }
        
        .schedule-price {
            color: #27ae60;
            font-weight: 600;
            font-size: 0.95rem;
        }
        
        /* Style untuk fleet header */
        .fleet-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.8rem;
        }
        
        .fleet-header h4 {
            color: #2c3e50;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0;
        }
        
        .fleet-type {
            background: #667eea;
            color: white;
            padding: 0.2rem 0.6rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .fleet-details {
            display: flex;
            gap: 1rem;
            margin-bottom: 0.8rem;
            color: #4a5568;
            font-size: 0.9rem;
        }
        
        .fleet-facilities {
            margin-top: 0.8rem;
            padding-top: 0.8rem;
            border-top: 1px dashed #e0e0e0;
        }
        
        .fleet-facilities small {
            color: #7f8c8d;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    `;
    document.head.appendChild(style);
})();

console.log('🚀 Cari Tiket module loaded without time labels');