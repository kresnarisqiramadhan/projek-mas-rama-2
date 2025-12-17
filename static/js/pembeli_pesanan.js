document.addEventListener('DOMContentLoaded', function() {
    // Data awal (biasanya dari API/database)
    const bookingData = {
        namaPembeli: document.getElementById('nama-pembeli').textContent || 'Pembeli',
        idBus: document.getElementById('id-bus').textContent || 'BUS-001',
        busName: document.getElementById('bus-name').textContent || 'Suite Class',
        busType: document.getElementById('bus-type').textContent || 'Eksekutif AC',
        fromCity: document.getElementById('route-from-city').textContent || 'Jakarta',
        toCity: document.getElementById('route-to-city').textContent || 'Bandung',
        departureTime: document.getElementById('departure-time').textContent || '08:00 WIB',
        arrivalTime: document.getElementById('arrival-time').textContent || '12:30 WIB',
        travelDate: document.getElementById('travel-date').textContent || 'Senin, 15 Januari 2024',
        busNumber: document.getElementById('bus-number').textContent || 'B-789-XYZ',
        pricePerSeat: 450000, // Harga per kursi dalam rupiah
        selectedSeats: [], // Akan diisi dari localStorage atau parameter URL
        serviceFeePercentage: 10 // Biaya layanan 10%
    };

    // Data metode pembayaran
    const paymentMethods = [
        {
            id: 'bank-transfer',
            name: 'Transfer Bank',
            icon: 'fas fa-university',
            description: 'Transfer melalui ATM/Internet Banking/Mobile Banking'
        },
        {
            id: 'credit-card',
            name: 'Kartu Kredit',
            icon: 'fas fa-credit-card',
            description: 'Visa, Mastercard, JCB'
        },
        {
            id: 'e-wallet',
            name: 'E-Wallet',
            icon: 'fas fa-wallet',
            description: 'OVO, GoPay, Dana, LinkAja'
        },
        {
            id: 'virtual-account',
            name: 'Virtual Account',
            icon: 'fas fa-building',
            description: 'VA BCA, Mandiri, BRI, BNI'
        },
        {
            id: 'convenience-store',
            name: 'Minimarket',
            icon: 'fas fa-store',
            description: 'Alfamart, Indomaret'
        },
        {
            id: 'qris',
            name: 'QRIS',
            icon: 'fas fa-qrcode',
            description: 'Bayar dengan QR Code'
        }
    ];

    // Inisialisasi data dari localStorage
    function initializeBookingData() {
        // Ambil data kursi dari localStorage atau parameter URL
        const savedSeats = localStorage.getItem('selectedSeats');
        if (savedSeats) {
            bookingData.selectedSeats = JSON.parse(savedSeats);
        } else {
            // Jika tidak ada data di localStorage, gunakan contoh data
            bookingData.selectedSeats = ['A1', 'A2', 'B3'];
        }
        
        updateSeatDisplay();
        calculatePrice();
    }

    // Update tampilan kursi yang dipilih
    function updateSeatDisplay() {
        const seatContainer = document.getElementById('selected-seats-container');
        const seatCountElement = document.getElementById('seat-count');
        const seatCountDisplay = document.getElementById('seat-count-display');
        
        // Kosongkan container
        seatContainer.innerHTML = '';
        
        // Tambahkan badge untuk setiap kursi
        bookingData.selectedSeats.forEach(seat => {
            const seatBadge = document.createElement('div');
            seatBadge.className = 'seat-badge';
            seatBadge.innerHTML = `
                <i class="fas fa-chair"></i>
                <span>${seat}</span>
            `;
            seatContainer.appendChild(seatBadge);
        });
        
        // Update jumlah kursi
        const seatCount = bookingData.selectedSeats.length;
        seatCountElement.textContent = seatCount;
        seatCountDisplay.textContent = seatCount;
        
        // Jika tidak ada kursi yang dipilih, tampilkan pesan
        if (seatCount === 0) {
            seatContainer.innerHTML = `
                <div style="text-align: center; width: 100%; color: #7f8c8d; padding: 20px;">
                    <i class="fas fa-chair" style="font-size: 32px; margin-bottom: 10px;"></i>
                    <p>Belum ada kursi yang dipilih</p>
                </div>
            `;
        }
    }

    // Hitung harga total
    function calculatePrice() {
        const seatCount = bookingData.selectedSeats.length;
        const pricePerSeat = bookingData.pricePerSeat;
        const subtotal = seatCount * pricePerSeat;
        const serviceFee = subtotal * (bookingData.serviceFeePercentage / 100);
        const grandTotal = subtotal + serviceFee;
        
        // Format angka ke Rupiah
        const formatRupiah = (number) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(number);
        };
        
        // Update elemen harga
        document.getElementById('price-per-seat').textContent = formatRupiah(pricePerSeat);
        document.getElementById('subtotal').textContent = formatRupiah(subtotal);
        document.getElementById('service-fee').textContent = formatRupiah(serviceFee);
        document.getElementById('grand-total').textContent = formatRupiah(grandTotal);
        
        return { subtotal, serviceFee, grandTotal };
    }

    // Tampilkan modal pembayaran
    function showPaymentModal() {
        const paymentModal = document.getElementById('payment-modal');
        
        // Hitung harga
        const { subtotal, serviceFee, grandTotal } = calculatePrice();
        
        // Update detail pembayaran di modal
        document.getElementById('payment-subtotal').textContent = formatRupiah(subtotal);
        document.getElementById('payment-service-fee').textContent = formatRupiah(serviceFee);
        document.getElementById('payment-grand-total').textContent = formatRupiah(grandTotal);
        
        // Tampilkan modal
        paymentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Sembunyikan modal pembayaran
    function hidePaymentModal() {
        const paymentModal = document.getElementById('payment-modal');
        paymentModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Format angka ke Rupiah
    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }

    // Buat modal pembayaran secara dinamis
    function createPaymentModal() {
        const modalHTML = `
            <div id="payment-modal" class="payment-modal">
                <div class="payment-modal-content">
                    <div class="payment-modal-header">
                        <h2>
                            <i class="fas fa-credit-card"></i>
                            Pembayaran Tiket Bus
                        </h2>
                        <button class="close-payment-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="payment-modal-body">
                        <div style="margin-bottom: 25px;">
                            <h3 style="color: #2c3e50; margin-bottom: 10px;">Pilih Metode Pembayaran</h3>
                            <p style="color: #666;">Pilih metode pembayaran yang paling nyaman untuk Anda.</p>
                        </div>
                        
                        <div class="payment-methods" id="payment-methods-container">
                            <!-- Metode pembayaran akan diisi oleh JavaScript -->
                        </div>
                        
                        <div class="payment-details">
                            <h3 style="color: #2c3e50; margin-bottom: 20px;">Rincian Pembayaran</h3>
                            <div class="payment-info-row">
                                <span class="payment-info-label">ID Pemesanan:</span>
                                <span class="payment-info-value">BOOK-${Date.now().toString().substr(-6)}</span>
                            </div>
                            <div class="payment-info-row">
                                <span class="payment-info-label">Nama Pembeli:</span>
                                <span class="payment-info-value">${bookingData.namaPembeli}</span>
                            </div>
                            <div class="payment-info-row">
                                <span class="payment-info-label">Rute Perjalanan:</span>
                                <span class="payment-info-value">${bookingData.fromCity} → ${bookingData.toCity}</span>
                            </div>
                            <div class="payment-info-row">
                                <span class="payment-info-label">Jumlah Kursi:</span>
                                <span class="payment-info-value">${bookingData.selectedSeats.length} kursi</span>
                            </div>
                            <div class="payment-info-row">
                                <span class="payment-info-label">Subtotal:</span>
                                <span class="payment-info-value" id="payment-subtotal">${formatRupiah(0)}</span>
                            </div>
                            <div class="payment-info-row">
                                <span class="payment-info-label">Biaya Layanan (${bookingData.serviceFeePercentage}%):</span>
                                <span class="payment-info-value" id="payment-service-fee">${formatRupiah(0)}</span>
                            </div>
                            <div class="payment-info-row payment-total">
                                <span class="payment-info-label">Total Pembayaran:</span>
                                <span class="payment-info-value" id="payment-grand-total">${formatRupiah(0)}</span>
                            </div>
                        </div>
                        
                        <div class="payment-actions">
                            <button id="confirm-payment-btn" class="confirm-payment-btn">
                                <i class="fas fa-check-circle"></i>
                                Konfirmasi Pembayaran
                            </button>
                            <button id="cancel-payment-btn" class="cancel-payment-btn">
                                <i class="fas fa-times"></i>
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Tambahkan modal ke body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Isi metode pembayaran
        const methodsContainer = document.getElementById('payment-methods-container');
        paymentMethods.forEach(method => {
            const methodElement = document.createElement('div');
            methodElement.className = 'payment-method';
            methodElement.dataset.id = method.id;
            methodElement.innerHTML = `
                <div class="payment-method-icon">
                    <i class="${method.icon}"></i>
                </div>
                <div class="payment-method-name">${method.name}</div>
                <small style="color: #777;">${method.description}</small>
            `;
            methodsContainer.appendChild(methodElement);
        });
        
        // Pilih metode pembayaran pertama secara default
        const firstMethod = document.querySelector('.payment-method');
        if (firstMethod) {
            firstMethod.classList.add('selected');
        }
        
        // Setup event listeners untuk modal
        setupPaymentModalListeners();
    }

    // Setup event listeners untuk modal pembayaran
    function setupPaymentModalListeners() {
        // Tutup modal
        document.querySelector('.close-payment-modal').addEventListener('click', hidePaymentModal);
        document.getElementById('cancel-payment-btn').addEventListener('click', hidePaymentModal);
        
        // Klik di luar modal untuk menutup
        document.getElementById('payment-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                hidePaymentModal();
            }
        });
        
        // Pilih metode pembayaran
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', function() {
                // Hapus class selected dari semua metode
                document.querySelectorAll('.payment-method').forEach(m => {
                    m.classList.remove('selected');
                });
                
                // Tambahkan class selected ke metode yang dipilih
                this.classList.add('selected');
            });
        });
        
        // Konfirmasi pembayaran
        document.getElementById('confirm-payment-btn').addEventListener('click', function() {
            const selectedMethod = document.querySelector('.payment-method.selected');
            if (!selectedMethod) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Pilih Metode Pembayaran',
                    text: 'Silakan pilih metode pembayaran terlebih dahulu.',
                    confirmButtonColor: '#3498db'
                });
                return;
            }
            
            const methodId = selectedMethod.dataset.id;
            const methodName = selectedMethod.querySelector('.payment-method-name').textContent;
            
            // Tampilkan konfirmasi pembayaran
            Swal.fire({
                title: 'Konfirmasi Pembayaran',
                html: `
                    <p>Anda akan melakukan pembayaran dengan metode:</p>
                    <p><strong>${methodName}</strong></p>
                    <p>Total: <strong>${document.getElementById('payment-grand-total').textContent}</strong></p>
                    <p>Pastikan data pembayaran Anda sudah benar.</p>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Bayar Sekarang',
                cancelButtonText: 'Periksa Kembali',
                confirmButtonColor: '#27ae60',
                cancelButtonColor: '#e74c3c'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Simulasi proses pembayaran
                    simulatePaymentProcess(methodId, methodName);
                }
            });
        });
    }

    // Simulasi proses pembayaran
    function simulatePaymentProcess(methodId, methodName) {
        // Tampilkan loading
        Swal.fire({
            title: 'Memproses Pembayaran',
            html: 'Sedang menghubungkan ke gateway pembayaran...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Simulasi delay proses pembayaran
        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'Pembayaran Berhasil!',
                html: `
                    <p>Pembayaran Anda dengan <strong>${methodName}</strong> telah berhasil diproses.</p>
                    <p>ID Transaksi: <strong>TRX-${Date.now().toString().substr(-8)}</strong></p>
                    <p>Tiket akan dikirim ke email Anda dalam waktu 5 menit.</p>
                `,
                confirmButtonText: 'Kembali ke Dashboard',
                confirmButtonColor: '#27ae60'
            }).then(() => {
                // Redirect ke dashboard
                window.location.href = '/pembeli/dashboard';
            });
            
            // Tutup modal pembayaran
            hidePaymentModal();
            
            // Reset data kursi di localStorage
            localStorage.removeItem('selectedSeats');
        }, 3000);
    }

    // Setup event listeners untuk tombol
    function setupEventListeners() {
        // Tombol lanjut ke pembayaran
        document.getElementById('payment-btn').addEventListener('click', function() {
            if (bookingData.selectedSeats.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Kursi Belum Dipilih',
                    text: 'Silakan pilih kursi terlebih dahulu sebelum melanjutkan ke pembayaran.',
                    confirmButtonColor: '#3498db'
                });
                return;
            }
            
            showPaymentModal();
        });
        
        // Tombol cetak ringkasan
        document.getElementById('print-btn').addEventListener('click', function() {
            window.print();
        });
        
        // Tombol kembali pilih kursi
        document.getElementById('back-btn').addEventListener('click', function() {
            window.location.href = `/pembeli/kursi?id=${bookingData.idBus}`;
        });
        
        // Tombol dashboard
        document.getElementById('dashboard-btn').addEventListener('click', function() {
            window.location.href = '/pembeli/dashboard';
        });
        
        // Tombol refresh data
        document.getElementById('refresh-btn').addEventListener('click', function(e) {
            e.preventDefault();
            Swal.fire({
                title: 'Memuat ulang data',
                text: 'Sedang memperbarui data pemesanan...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Simulasi refresh data
            setTimeout(() => {
                // Ambil data terbaru dari localStorage
                const savedSeats = localStorage.getItem('selectedSeats');
                if (savedSeats) {
                    bookingData.selectedSeats = JSON.parse(savedSeats);
                }
                
                updateSeatDisplay();
                calculatePrice();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Data Diperbarui',
                    text: 'Data pemesanan telah diperbarui.',
                    confirmButtonColor: '#3498db',
                    timer: 1500
                });
            }, 1000);
        });
    }

    // Inisialisasi halaman
    function initializePage() {
        initializeBookingData();
        createPaymentModal();
        setupEventListeners();
        
        console.log('Halaman konfirmasi pemesanan telah dimuat');
        console.log('Data pemesanan:', bookingData);
    }

    // Jalankan inisialisasi halaman
    initializePage();
});