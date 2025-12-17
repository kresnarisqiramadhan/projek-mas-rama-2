// ===========================================
// KONFIGURASI & DATA
// ===========================================
const appConfig = {
    itemsPerPage: 6,
    sortOptions: [
        { id: 'price_asc', label: 'Harga Terendah', icon: 'fas fa-sort-amount-down-alt' },
        { id: 'price_desc', label: 'Harga Tertinggi', icon: 'fas fa-sort-amount-down' },
        { id: 'departure_asc', label: 'Keberangkatan Awal', icon: 'fas fa-clock' },
        { id: 'departure_desc', label: 'Keberangkatan Akhir', icon: 'fas fa-clock' },
        { id: 'duration_asc', label: 'Durasi Terpendek', icon: 'fas fa-hourglass-half' },
        { id: 'rating_desc', label: 'Rating Tertinggi', icon: 'fas fa-star' }
    ],
    filterOptions: {
        busTypes: ['Semua', 'Eksekutif', 'Bisnis', 'Ekonomi', 'VIP'],
        facilities: ['AC', 'Toilet', 'Wifi', 'TV', 'Stop Kontak', 'Selimut', 'Snack'],
        operators: ['Semua', 'PO XYZ', 'PO ABC', 'PO 123', 'PO Maju Jaya']
    }
};

// Data bus contoh
const sampleBusData = [
    {
        id: 'BUS001',
        operator: {
            name: 'PO XYZ',
            logo: 'XYZ',
            rating: 4.5
        },
        busType: 'Eksekutif',
        route: {
            from: {
                city: 'Jakarta',
                terminal: 'Terminal Kampung Rambutan',
                time: '08:00'
            },
            to: {
                city: 'Bandung',
                terminal: 'Terminal Leuwipanjang',
                time: '12:30'
            },
            duration: '4j 30m',
            distance: '150 km'
        },
        facilities: ['AC', 'Toilet', 'Wifi', 'TV', 'Stop Kontak'],
        seats: {
            available: 12,
            total: 40,
            booked: 28
        },
        price: 150000,
        featured: true,
        departureDate: '2024-01-15'
    },
    {
        id: 'BUS002',
        operator: {
            name: 'PO ABC',
            logo: 'ABC',
            rating: 4.2
        },
        busType: 'Bisnis',
        route: {
            from: {
                city: 'Jakarta',
                terminal: 'Terminal Kampung Rambutan',
                time: '09:30'
            },
            to: {
                city: 'Bandung',
                terminal: 'Terminal Leuwipanjang',
                time: '14:00'
            },
            duration: '4j 30m',
            distance: '150 km'
        },
        facilities: ['AC', 'Toilet', 'Wifi'],
        seats: {
            available: 5,
            total: 35,
            booked: 30
        },
        price: 120000,
        featured: false,
        departureDate: '2024-01-15'
    },
    {
        id: 'BUS003',
        operator: {
            name: 'PO 123',
            logo: '123',
            rating: 4.7
        },
        busType: 'VIP',
        route: {
            from: {
                city: 'Jakarta',
                terminal: 'Terminal Kampung Rambutan',
                time: '10:00'
            },
            to: {
                city: 'Bandung',
                terminal: 'Terminal Leuwipanjang',
                time: '13:00'
            },
            duration: '3j 00m',
            distance: '150 km'
        },
        facilities: ['AC', 'Toilet', 'Wifi', 'TV', 'Stop Kontak', 'Selimut', 'Snack'],
        seats: {
            available: 8,
            total: 25,
            booked: 17
        },
        price: 200000,
        featured: true,
        departureDate: '2024-01-15'
    },
    {
        id: 'BUS004',
        operator: {
            name: 'PO Maju Jaya',
            logo: 'MJ',
            rating: 4.0
        },
        busType: 'Ekonomi',
        route: {
            from: {
                city: 'Jakarta',
                terminal: 'Terminal Kampung Rambutan',
                time: '11:00'
            },
            to: {
                city: 'Bandung',
                terminal: 'Terminal Leuwipanjang',
                time: '16:30'
            },
            duration: '5j 30m',
            distance: '150 km'
        },
        facilities: ['AC'],
        seats: {
            available: 25,
            total: 50,
            booked: 25
        },
        price: 80000,
        featured: false,
        departureDate: '2024-01-15'
    },
    {
        id: 'BUS005',
        operator: {
            name: 'PO XYZ',
            logo: 'XYZ',
            rating: 4.5
        },
        busType: 'Eksekutif',
        route: {
            from: {
                city: 'Jakarta',
                terminal: 'Terminal Kampung Rambutan',
                time: '13:00'
            },
            to: {
                city: 'Bandung',
                terminal: 'Terminal Leuwipanjang',
                time: '17:30'
            },
            duration: '4j 30m',
            distance: '150 km'
        },
        facilities: ['AC', 'Toilet', 'Wifi', 'TV'],
        seats: {
            available: 15,
            total: 40,
            booked: 25
        },
        price: 140000,
        featured: false,
        departureDate: '2024-01-15'
    },
    {
        id: 'BUS006',
        operator: {
            name: 'PO ABC',
            logo: 'ABC',
            rating: 4.2
        },
        busType: 'Bisnis',
        route: {
            from: {
                city: 'Jakarta',
                terminal: 'Terminal Kampung Rambutan',
                time: '14:30'
            },
            to: {
                city: 'Bandung',
                terminal: 'Terminal Leuwipanjang',
                time: '19:00'
            },
            duration: '4j 30m',
            distance: '150 km'
        },
        facilities: ['AC', 'Toilet', 'Wifi', 'Stop Kontak'],
        seats: {
            available: 3,
            total: 35,
            booked: 32
        },
        price: 125000,
        featured: true,
        departureDate: '2024-01-15'
    },
    {
        id: 'BUS007',
        operator: {
            name: 'PO 123',
            logo: '123',
            rating: 4.7
        },
        busType: 'VIP',
        route: {
            from: {
                city: 'Jakarta',
                terminal: 'Terminal Kampung Rambutan',
                time: '16:00'
            },
            to: {
                city: 'Bandung',
                terminal: 'Terminal Leuwipanjang',
                time: '19:00'
            },
            duration: '3j 00m',
            distance: '150 km'
        },
        facilities: ['AC', 'Toilet', 'Wifi', 'TV', 'Stop Kontak', 'Snack'],
        seats: {
            available: 2,
            total: 25,
            booked: 23
        },
        price: 190000,
        featured: false,
        departureDate: '2024-01-15'
    },
    {
        id: 'BUS008',
        operator: {
            name: 'PO Maju Jaya',
            logo: 'MJ',
            rating: 4.0
        },
        busType: 'Ekonomi',
        route: {
            from: {
                city: 'Jakarta',
                terminal: 'Terminal Kampung Rambutan',
                time: '18:00'
            },
            to: {
                city: 'Bandung',
                terminal: 'Terminal Leuwipanjang',
                time: '23:30'
            },
            duration: '5j 30m',
            distance: '150 km'
        },
        facilities: ['AC'],
        seats: {
            available: 40,
            total: 50,
            booked: 10
        },
        price: 75000,
        featured: false,
        departureDate: '2024-01-15'
    }
];

// State aplikasi
let appState = {
    buses: [],
    filteredBuses: [],
    currentPage: 1,
    totalPages: 1,
    sortBy: 'price_asc',
    filters: {
        busType: 'Semua',
        minPrice: '',
        maxPrice: '',
        facilities: [],
        operator: 'Semua',
        departureTime: ''
    },
    searchParams: {
        from: 'Jakarta',
        to: 'Bandung',
        date: '2024-01-15',
        passengers: 2
    }
};

// ===========================================
// INISIALISASI APLIKASI
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚌 Inisialisasi aplikasi hasil pencarian...');
    
    initializeApp();
    setupEventListeners();
    loadInitialData();
});

function initializeApp() {
    // Inisialisasi state
    appState.buses = [...sampleBusData];
    appState.filteredBuses = [...sampleBusData];
    
    // Render komponen
    renderSearchInfo();
    renderSortOptions();
    renderFilterControls();
    renderBusCards();
    renderPagination();
    updateResultsCount();
    
    // Sembunyikan loading
    hideLoading();
}

function setupEventListeners() {
    // Tombol filter
    document.getElementById('applyFilters')?.addEventListener('click', applyFilters);
    document.getElementById('resetFilters')?.addEventListener('click', resetFilters);
    
    // Tombol refresh
    document.getElementById('refreshResults')?.addEventListener('click', refreshResults);
    
    // Tombol kembali
    document.getElementById('backBtn')?.addEventListener('click', goBack);
    
    // Tombol tab
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Input real-time filter
    document.getElementById('minPrice')?.addEventListener('input', debounce(applyFilters, 300));
    document.getElementById('maxPrice')?.addEventListener('input', debounce(applyFilters, 300));
    document.getElementById('departureTime')?.addEventListener('change', applyFilters);
    
    // Facility checkboxes
    document.querySelectorAll('.facility-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Event delegation untuk tombol pilih bus
    document.getElementById('busCardsContainer')?.addEventListener('click', function(e) {
        const selectBtn = e.target.closest('.btn-select');
        if (selectBtn) {
            const busId = selectBtn.dataset.busId;
            selectBus(busId);
        }
    });
}

function loadInitialData() {
    // Simulasi loading data dari server
    showLoading();
    
    setTimeout(() => {
        // Dalam implementasi nyata, ini akan fetch dari API
        console.log('✅ Data bus berhasil dimuat');
        hideLoading();
    }, 1000);
}

// ===========================================
// RENDER FUNCTIONS
// ===========================================
function renderSearchInfo() {
    const searchInfo = document.getElementById('searchInfo');
    if (!searchInfo) return;
    
    const { from, to, date, passengers } = appState.searchParams;
    
    const formattedDate = formatDate(date);
    
    searchInfo.innerHTML = `
        <div class="search-info-header">
            <h3><i class="fas fa-search"></i> Hasil Pencarian Tiket Bus</h3>
            <span class="badge badge-success">${appState.buses.length} Bus Tersedia</span>
        </div>
        
        <div class="search-info-grid">
            <div class="search-info-item">
                <div class="search-info-label">Rute</div>
                <div class="search-info-value">${from} → ${to}</div>
            </div>
            
            <div class="search-info-item">
                <div class="search-info-label">Tanggal Keberangkatan</div>
                <div class="search-info-value">${formattedDate}</div>
            </div>
            
            <div class="search-info-item">
                <div class="search-info-label">Jumlah Penumpang</div>
                <div class="search-info-value">${passengers} Orang</div>
            </div>
            
            <div class="search-info-item">
                <div class="search-info-label">Status Pencarian</div>
                <div class="search-info-value">
                    <span class="badge badge-success">
                        <i class="fas fa-check-circle"></i> Berhasil
                    </span>
                </div>
            </div>
        </div>
    `;
}

function renderSortOptions() {
    const sortSelect = document.getElementById('sortBy');
    if (!sortSelect) return;
    
    sortSelect.innerHTML = appConfig.sortOptions.map(option => `
        <option value="${option.id}" ${appState.sortBy === option.id ? 'selected' : ''}>
            ${option.label}
        </option>
    `).join('');
    
    sortSelect.addEventListener('change', function() {
        appState.sortBy = this.value;
        applySorting();
        renderBusCards();
        renderPagination();
    });
}

function renderFilterControls() {
    // Render bus type filter
    const busTypeSelect = document.getElementById('busType');
    if (busTypeSelect) {
        busTypeSelect.innerHTML = appConfig.filterOptions.busTypes.map(type => `
            <option value="${type}" ${appState.filters.busType === type ? 'selected' : ''}>
                ${type}
            </option>
        `).join('');
    }
    
    // Render operator filter
    const operatorSelect = document.getElementById('operator');
    if (operatorSelect) {
        operatorSelect.innerHTML = appConfig.filterOptions.operators.map(op => `
            <option value="${op}" ${appState.filters.operator === op ? 'selected' : ''}>
                ${op}
            </option>
        `).join('');
    }
    
    // Render facilities checkboxes
    const facilitiesContainer = document.getElementById('facilitiesFilter');
    if (facilitiesContainer) {
        facilitiesContainer.innerHTML = appConfig.filterOptions.facilities.map(facility => `
            <div class="facility-checkbox-item">
                <input type="checkbox" 
                       id="facility_${facility}" 
                       class="facility-checkbox" 
                       value="${facility}"
                       ${appState.filters.facilities.includes(facility) ? 'checked' : ''}>
                <label for="facility_${facility}">
                    <i class="fas fa-check"></i>
                    ${facility}
                </label>
            </div>
        `).join('');
    }
    
    // Set nilai filter yang ada
    document.getElementById('minPrice').value = appState.filters.minPrice;
    document.getElementById('maxPrice').value = appState.filters.maxPrice;
    document.getElementById('departureTime').value = appState.filters.departureTime;
}

function renderBusCards() {
    const container = document.getElementById('busCardsContainer');
    if (!container) return;
    
    // Hitung data untuk halaman ini
    const startIndex = (appState.currentPage - 1) * appConfig.itemsPerPage;
    const endIndex = startIndex + appConfig.itemsPerPage;
    const currentBuses = appState.filteredBuses.slice(startIndex, endIndex);
    
    if (currentBuses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-bus-slash"></i>
                </div>
                <h3>Tidak Ada Bus yang Ditemukan</h3>
                <p>Maaf, tidak ada bus yang sesuai dengan kriteria pencarian Anda. Coba ubah filter atau tanggal keberangkatan.</p>
                <button id="resetFilters" class="btn-refresh">
                    <i class="fas fa-redo"></i> Reset Filter
                </button>
            </div>
        `;
        
        // Re-attach event listener
        document.getElementById('resetFilters')?.addEventListener('click', resetFilters);
        return;
    }
    
    container.innerHTML = currentBuses.map(bus => createBusCard(bus)).join('');
}

function createBusCard(bus) {
    const facilitiesIcons = {
        'AC': 'fas fa-snowflake',
        'Toilet': 'fas fa-toilet',
        'Wifi': 'fas fa-wifi',
        'TV': 'fas fa-tv',
        'Stop Kontak': 'fas fa-plug',
        'Selimut': 'fas fa-bed',
        'Snack': 'fas fa-utensils'
    };
    
    const formattedPrice = formatCurrency(bus.price);
    const isLowSeats = bus.seats.available <= 5;
    const isVeryLowSeats = bus.seats.available <= 2;
    
    return `
        <div class="bus-card ${bus.featured ? 'featured' : ''}" data-bus-id="${bus.id}">
            <div class="bus-card-header">
                <div class="bus-operator">
                    <div class="operator-info">
                        <div class="operator-logo">${bus.operator.logo}</div>
                        <div>
                            <div class="operator-name">${bus.operator.name}</div>
                            <div class="bus-rating">
                                <span class="rating-stars">
                                    ${generateStarRating(bus.operator.rating)}
                                </span>
                                <span class="rating-value">${bus.operator.rating}</span>
                            </div>
                        </div>
                    </div>
                    <span class="bus-type">${bus.busType}</span>
                </div>
            </div>
            
            <div class="bus-card-body">
                <div class="route-info">
                    <div class="route-point">
                        <div class="route-time">${bus.route.from.time}</div>
                        <div class="route-city">${bus.route.from.city}</div>
                        <div class="route-terminal">${bus.route.from.terminal}</div>
                    </div>
                    
                    <div class="route-arrow">
                        <i class="fas fa-long-arrow-alt-right"></i>
                    </div>
                    
                    <div class="route-point">
                        <div class="route-time">${bus.route.to.time}</div>
                        <div class="route-city">${bus.route.to.city}</div>
                        <div class="route-terminal">${bus.route.to.terminal}</div>
                    </div>
                    
                    <div class="route-duration">
                        <i class="fas fa-clock"></i> ${bus.route.duration} • ${bus.route.distance}
                    </div>
                </div>
                
                <div class="bus-facilities">
                    ${bus.facilities.map(facility => `
                        <div class="facility-item" title="${facility}">
                            <i class="${facilitiesIcons[facility] || 'fas fa-check'}"></i>
                            <span>${facility}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bus-card-footer">
                <div class="price-info">
                    <div class="price-label">Harga per orang</div>
                    <div class="price-amount">${formattedPrice}</div>
                    <div class="price-per">Termasuk pajak & asuransi</div>
                </div>
                
                <div class="seats-available ${isVeryLowSeats ? 'text-danger' : isLowSeats ? 'text-warning' : ''}">
                    <i class="fas fa-chair"></i>
                    <span>Tersisa ${bus.seats.available} kursi</span>
                    ${isVeryLowSeats ? '<span class="badge bg-danger">Hampir Habis!</span>' : ''}
                </div>
                
                <button class="btn-select" data-bus-id="${bus.id}" ${bus.seats.available === 0 ? 'disabled' : ''}>
                    <i class="fas fa-ticket-alt"></i>
                    ${bus.seats.available === 0 ? 'HABIS' : 'PILIH BUS'}
                </button>
            </div>
        </div>
    `;
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    appState.totalPages = Math.ceil(appState.filteredBuses.length / appConfig.itemsPerPage);
    
    if (appState.totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    const currentPage = appState.currentPage;
    const totalPages = appState.totalPages;
    
    // Tombol previous
    paginationHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Halaman pertama
    if (currentPage > 3) {
        paginationHTML += `
            <button class="pagination-btn" onclick="goToPage(1)">1</button>
            ${currentPage > 4 ? '<span class="pagination-ellipsis">...</span>' : ''}
        `;
    }
    
    // Halaman sekitar current page
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        paginationHTML += `
            <button class="pagination-btn ${currentPage === i ? 'active' : ''}" 
                    onclick="goToPage(${i})">${i}</button>
        `;
    }
    
    // Halaman terakhir
    if (currentPage < totalPages - 2) {
        paginationHTML += `
            ${currentPage < totalPages - 3 ? '<span class="pagination-ellipsis">...</span>' : ''}
            <button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>
        `;
    }
    
    // Tombol next
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (!resultsCount) return;
    
    const startIndex = (appState.currentPage - 1) * appConfig.itemsPerPage + 1;
    const endIndex = Math.min(startIndex + appConfig.itemsPerPage - 1, appState.filteredBuses.length);
    const total = appState.filteredBuses.length;
    
    resultsCount.innerHTML = `Menampilkan <span>${startIndex}-${endIndex}</span> dari <span>${total}</span> hasil`;
}

// ===========================================
// FILTER & SORT FUNCTIONS
// ===========================================
function applyFilters() {
    showLoading();
    
    // Collect filter values
    const filters = {
        busType: document.getElementById('busType').value,
        minPrice: document.getElementById('minPrice').value,
        maxPrice: document.getElementById('maxPrice').value,
        facilities: Array.from(document.querySelectorAll('.facility-checkbox:checked'))
            .map(cb => cb.value),
        operator: document.getElementById('operator').value,
        departureTime: document.getElementById('departureTime').value
    };
    
    appState.filters = filters;
    
    // Filter buses
    let filtered = [...appState.buses];
    
    // Filter by bus type
    if (filters.busType !== 'Semua') {
        filtered = filtered.filter(bus => bus.busType === filters.busType);
    }
    
    // Filter by price range
    if (filters.minPrice) {
        filtered = filtered.filter(bus => bus.price >= parseInt(filters.minPrice));
    }
    
    if (filters.maxPrice) {
        filtered = filtered.filter(bus => bus.price <= parseInt(filters.maxPrice));
    }
    
    // Filter by facilities
    if (filters.facilities.length > 0) {
        filtered = filtered.filter(bus => 
            filters.facilities.every(facility => bus.facilities.includes(facility))
        );
    }
    
    // Filter by operator
    if (filters.operator !== 'Semua') {
        filtered = filtered.filter(bus => bus.operator.name === filters.operator);
    }
    
    // Filter by departure time
    if (filters.departureTime) {
        filtered = filtered.filter(bus => {
            const busTime = bus.route.from.time;
            const filterTime = filters.departureTime;
            
            if (filterTime === 'morning') {
                return parseInt(busTime.split(':')[0]) < 12;
            } else if (filterTime === 'afternoon') {
                const hour = parseInt(busTime.split(':')[0]);
                return hour >= 12 && hour < 18;
            } else if (filterTime === 'evening') {
                return parseInt(busTime.split(':')[0]) >= 18;
            }
            return true;
        });
    }
    
    appState.filteredBuses = filtered;
    appState.currentPage = 1;
    
    // Apply sorting
    applySorting();
    
    // Update UI
    setTimeout(() => {
        renderBusCards();
        renderPagination();
        updateResultsCount();
        hideLoading();
        
        // Scroll ke results section
        document.getElementById('resultsSection')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

function resetFilters() {
    // Reset filter inputs
    document.getElementById('busType').value = 'Semua';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('operator').value = 'Semua';
    document.getElementById('departureTime').value = '';
    
    // Uncheck all facility checkboxes
    document.querySelectorAll('.facility-checkbox').forEach(cb => {
        cb.checked = false;
    });
    
    // Reset filter state
    appState.filters = {
        busType: 'Semua',
        minPrice: '',
        maxPrice: '',
        facilities: [],
        operator: 'Semua',
        departureTime: ''
    };
    
    // Reset filtered buses
    appState.filteredBuses = [...appState.buses];
    appState.currentPage = 1;
    
    // Apply default sorting
    applySorting();
    
    // Update UI
    renderBusCards();
    renderPagination();
    updateResultsCount();
    
    showNotification('Filter telah direset', 'success');
}

function applySorting() {
    switch (appState.sortBy) {
        case 'price_asc':
            appState.filteredBuses.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            appState.filteredBuses.sort((a, b) => b.price - a.price);
            break;
        case 'departure_asc':
            appState.filteredBuses.sort((a, b) => 
                a.route.from.time.localeCompare(b.route.from.time)
            );
            break;
        case 'departure_desc':
            appState.filteredBuses.sort((a, b) => 
                b.route.from.time.localeCompare(a.route.from.time)
            );
            break;
        case 'duration_asc':
            appState.filteredBuses.sort((a, b) => 
                parseDuration(a.route.duration) - parseDuration(b.route.duration)
            );
            break;
        case 'rating_desc':
            appState.filteredBuses.sort((a, b) => b.operator.rating - a.operator.rating);
            break;
    }
}

// ===========================================
// PAGINATION FUNCTIONS
// ===========================================
function goToPage(page) {
    if (page < 1 || page > appState.totalPages) return;
    
    appState.currentPage = page;
    renderBusCards();
    renderPagination();
    updateResultsCount();
    
    // Scroll ke atas results
    document.getElementById('resultsSection')?.scrollIntoView({ behavior: 'smooth' });
}

// ===========================================
// ACTION FUNCTIONS
// ===========================================
function selectBus(busId) {
    const bus = appState.filteredBuses.find(b => b.id === busId);
    if (!bus) return;
    
    if (bus.seats.available === 0) {
        showNotification('Maaf, kursi untuk bus ini sudah habis', 'error');
        return;
    }
    
    // Simpan bus yang dipilih ke localStorage
    const bookingData = {
        bus: bus,
        searchParams: appState.searchParams,
        selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('selectedBus', JSON.stringify(bookingData));
    
    // Tampilkan konfirmasi
    showBusSelectionModal(bus);
}

function showBusSelectionModal(bus) {
    // Menggunakan SweetAlert2 jika tersedia, atau modal custom
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Konfirmasi Pilihan Bus',
            html: `
                <div style="text-align: left;">
                    <p><strong>${bus.operator.name} - ${bus.busType}</strong></p>
                    <p><i class="fas fa-route"></i> ${bus.route.from.city} → ${bus.route.to.city}</p>
                    <p><i class="fas fa-clock"></i> ${bus.route.from.time} - ${bus.route.to.time}</p>
                    <p><i class="fas fa-chair"></i> Kursi tersedia: ${bus.seats.available}</p>
                    <p><i class="fas fa-money-bill-wave"></i> Harga: <strong>${formatCurrency(bus.price)}</strong></p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Lanjutkan',
            cancelButtonText: 'Batal',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return new Promise((resolve) => {
                    // Simulasi proses
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect ke halaman pilih kursi
                window.location.href = '/pembeli/kursi'; // Ganti dengan route Anda
            }
        });
    } else {
        // Fallback ke window.confirm
        const confirmMsg = `Pilih bus ${bus.operator.name}?\n` +
                          `Rute: ${bus.route.from.city} → ${bus.route.to.city}\n` +
                          `Waktu: ${bus.route.from.time} - ${bus.route.to.time}\n` +
                          `Harga: ${formatCurrency(bus.price)}\n\n` +
                          `Lanjutkan ke pemilihan kursi?`;
        
        if (confirm(confirmMsg)) {
            window.location.href = '/pembeli/kursi'; // Ganti dengan route Anda
        }
    }
}

function refreshResults() {
    showLoading();
    
    // Simulasi refresh data
    setTimeout(() => {
        // Dalam implementasi nyata, ini akan fetch ulang dari API
        showNotification('Hasil pencarian telah diperbarui', 'success');
        hideLoading();
    }, 1500);
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Simpan preferensi tab
    localStorage.setItem('resultsTab', tabName);
    
    // Dalam implementasi nyata, ini akan mengubah tampilan berdasarkan tab
    showNotification(`Menampilkan: ${tabName}`, 'info');
}

function goBack() {
    if (confirm('Kembali ke halaman pencarian?')) {
        window.history.back();
    }
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================
function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    // Bintang penuh
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Bintang setengah
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Bintang kosong
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function parseDuration(duration) {
    // Mengubah "4j 30m" menjadi menit
    const match = duration.match(/(\d+)j\s*(\d+)?m/);
    if (match) {
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        return hours * 60 + minutes;
    }
    return 0;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    // Menggunakan SweetAlert2 jika tersedia
    if (typeof Swal !== 'undefined') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
        
        Toast.fire({
            icon: type,
            title: message
        });
    } else {
        // Fallback ke alert biasa
        alert(`${type.toUpperCase()}: ${message}`);
    }
}

// ===========================================
// GLOBAL FUNCTIONS (untuk dipanggil dari HTML)
// ===========================================
window.goToPage = goToPage;
window.selectBus = selectBus;

// ===========================================
// EKSPOR UNTUK TESTING
// ===========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        applyFilters,
        resetFilters,
        selectBus,
        formatCurrency,
        formatDate
    };
}

console.log('✅ Aplikasi hasil pencarian siap digunakan!');