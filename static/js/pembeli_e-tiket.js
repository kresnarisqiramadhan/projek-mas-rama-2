document.addEventListener('DOMContentLoaded', function() {
    // Data dari backend (dari template Flask/Jinja2)
    const ticketData = {
        nama: document.getElementById('passenger-name')?.textContent || 'Nama Pembeli',
        idBus: document.getElementById('bus-id')?.textContent || 'BUS-001',
        kursi: document.getElementById('seat-numbers')?.textContent || 'A1, A2',
        status: 'Lunas'
    };

    // Data tambahan untuk demo
    const additionalData = {
        bookingId: `BOOK-${Date.now().toString().substr(-8)}`,
        bookingDate: new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        bookingTime: new Date().toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        departureTime: '08:00 WIB',
        arrivalTime: '12:30 WIB',
        fromCity: 'Jakarta',
        toCity: 'Bandung',
        travelDate: 'Senin, 15 Januari 2024',
        busName: 'Suite Class',
        busType: 'Eksekutif AC',
        busNumber: 'B-789-XYZ',
        price: 'Rp 900.000',
        seatCount: ticketData.kursi.split(',').length,
        operator: 'BusTicket Online'
    };

    // Inisialisasi halaman
    function initializePage() {
        // Update elemen dengan data tambahan
        updateTicketDetails();
        
        // Setup event listeners
        setupEventListeners();
        
        // Generate QR code (simulasi)
        generateQRCode();
        
        // Setup countdown timer untuk validitas tiket
        setupCountdownTimer();
        
        console.log('Halaman E-Ticket telah dimuat');
        console.log('Data tiket:', ticketData);
    }

    // Update detail tiket dengan data tambahan
    function updateTicketDetails() {
        // Update elemen jika ada
        const elementsToUpdate = {
            'booking-id': additionalData.bookingId,
            'booking-date': additionalData.bookingDate,
            'booking-time': additionalData.bookingTime,
            'departure-time': additionalData.departureTime,
            'arrival-time': additionalData.arrivalTime,
            'from-city': additionalData.fromCity,
            'to-city': additionalData.toCity,
            'travel-date': additionalData.travelDate,
            'bus-name': additionalData.busName,
            'bus-type': additionalData.busType,
            'bus-number': additionalData.busNumber,
            'ticket-price': additionalData.price,
            'seat-count': additionalData.seatCount,
            'operator-name': additionalData.operator
        };
        
        for (const [id, value] of Object.entries(elementsToUpdate)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
        
        // Update tampilan kursi
        updateSeatDisplay();
    }

    // Update tampilan kursi
    function updateSeatDisplay() {
        const seatsContainer = document.getElementById('seats-display-container');
        if (!seatsContainer) return;
        
        // Kosongkan container
        seatsContainer.innerHTML = '';
        
        // Pisahkan kursi berdasarkan koma
        const seats = ticketData.kursi.split(',').map(seat => seat.trim());
        
        // Tambahkan badge untuk setiap kursi
        seats.forEach(seat => {
            const seatBadge = document.createElement('div');
            seatBadge.className = 'seat-badge';
            seatBadge.innerHTML = `
                <i class="fas fa-chair"></i>
                <span>${seat}</span>
            `;
            seatsContainer.appendChild(seatBadge);
        });
        
        // Update jumlah kursi
        const seatCountElement = document.getElementById('seat-count-display');
        if (seatCountElement) {
            seatCountElement.textContent = seats.length;
        }
    }

    // Generate QR code simulasi
    function generateQRCode() {
        const qrContainer = document.getElementById('qr-code-container');
        if (!qrContainer) return;
        
        // Data untuk QR code
        const qrData = JSON.stringify({
            bookingId: additionalData.bookingId,
            passenger: ticketData.nama,
            busId: ticketData.idBus,
            seats: ticketData.kursi,
            departure: `${additionalData.fromCity} → ${additionalData.toCity}`,
            date: additionalData.travelDate
        });
        
        // Buat QR code sederhana (simulasi)
        qrContainer.innerHTML = `
            <div class="qr-code-placeholder">
                <i class="fas fa-qrcode"></i>
                <p>Scan QR Code</p>
                <small>Booking ID: ${additionalData.bookingId}</small>
            </div>
            <p class="qr-instructions">Tunjukkan QR code ini kepada petugas saat naik bus</p>
        `;
        
        // Dalam implementasi nyata, gunakan library seperti qrcode.js
        // Contoh: new QRCode(qrContainer, qrData);
    }

    // Setup countdown timer untuk validitas tiket
    function setupCountdownTimer() {
        const timerElement = document.getElementById('validity-timer');
        if (!timerElement) return;
        
        // Set waktu validitas tiket (24 jam dari sekarang)
        const validityEnd = new Date();
        validityEnd.setHours(validityEnd.getHours() + 24);
        
        function updateTimer() {
            const now = new Date();
            const diff = validityEnd - now;
            
            if (diff <= 0) {
                timerElement.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Tiket telah kedaluwarsa</span>
                `;
                timerElement.style.color = '#e74c3c';
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            timerElement.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>Berlaku hingga: ${hours} jam ${minutes} menit ${seconds} detik</span>
            `;
            
            // Update warna berdasarkan waktu tersisa
            if (hours < 1) {
                timerElement.style.color = '#e74c3c';
            } else if (hours < 6) {
                timerElement.style.color = '#f39c12';
            } else {
                timerElement.style.color = '#27ae60';
            }
        }
        
        // Update timer setiap detik
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Tombol cetak tiket
        const printBtn = document.getElementById('print-ticket-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                // Tambahkan efek sebelum print
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mempersiapkan cetakan...';
                
                setTimeout(() => {
                    window.print();
                    this.innerHTML = '<i class="fas fa-print"></i> Cetak Tiket';
                    
                    // Tampilkan notifikasi sukses
                    Swal.fire({
                        icon: 'success',
                        title: 'Tiket Siap Dicetak',
                        text: 'Dialog cetak telah dibuka. Pastikan printer Anda tersambung.',
                        confirmButtonColor: '#3498db',
                        timer: 3000
                    });
                }, 1000);
            });
        }
        
        // Tombol simpan PDF
        const savePdfBtn = document.getElementById('save-pdf-btn');
        if (savePdfBtn) {
            savePdfBtn.addEventListener('click', function() {
                // Simulasi penyimpanan PDF
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Membuat PDF...';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-file-pdf"></i> Simpan PDF';
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'PDF Berhasil Disimpan',
                        html: `
                            <p>Tiket Anda telah disimpan sebagai PDF.</p>
                            <p><strong>Nama file:</strong> tiket-${additionalData.bookingId}.pdf</p>
                        `,
                        confirmButtonText: 'Unduh Sekarang',
                        showCancelButton: true,
                        cancelButtonText: 'Nanti Saja',
                        confirmButtonColor: '#27ae60'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Simulasi download
                            Swal.fire({
                                icon: 'info',
                                title: 'Download Dimulai',
                                text: 'File PDF sedang diunduh...',
                                timer: 2000
                            });
                        }
                    });
                }, 1500);
            });
        }
        
        // Tombol bagikan tiket
        const shareBtn = document.getElementById('share-ticket-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function() {
                Swal.fire({
                    title: 'Bagikan Tiket',
                    html: `
                        <p>Pilih metode untuk berbagi tiket:</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0;">
                            <button class="share-option" data-method="whatsapp" style="padding: 10px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">
                                <i class="fab fa-whatsapp" style="color: #25D366; font-size: 24px;"></i>
                                <div style="margin-top: 5px;">WhatsApp</div>
                            </button>
                            <button class="share-option" data-method="email" style="padding: 10px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">
                                <i class="fas fa-envelope" style="color: #EA4335; font-size: 24px;"></i>
                                <div style="margin-top: 5px;">Email</div>
                            </button>
                        </div>
                    `,
                    showConfirmButton: false,
                    showCloseButton: true
                });
                
                // Setup event listeners untuk opsi berbagi
                setTimeout(() => {
                    document.querySelectorAll('.share-option').forEach(option => {
                        option.addEventListener('click', function() {
                            const method = this.dataset.method;
                            shareTicket(method);
                        });
                    });
                }, 100);
            });
        }
        
        // Tombol kembali ke dashboard
        const backBtn = document.getElementById('back-dashboard-btn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                Swal.fire({
                    title: 'Kembali ke Dashboard?',
                    text: 'Anda akan meninggalkan halaman tiket ini.',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Ya, Kembali',
                    cancelButtonText: 'Batalkan',
                    confirmButtonColor: '#3498db',
                    cancelButtonColor: '#e74c3c'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/pembeli/dashboard';
                    }
                });
            });
        }
    }

    // Fungsi untuk berbagi tiket
    function shareTicket(method) {
        const shareData = {
            title: `Tiket Bus ${additionalData.fromCity} → ${additionalData.toCity}`,
            text: `Saya telah memesan tiket bus ${additionalData.busName} dari ${additionalData.fromCity} ke ${additionalData.toCity} pada ${additionalData.travelDate}. Booking ID: ${additionalData.bookingId}`,
            url: window.location.href
        };
        
        if (method === 'whatsapp') {
            // Simulasi berbagi via WhatsApp
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
            Swal.fire({
                icon: 'info',
                title: 'Berbagi via WhatsApp',
                html: `<p>Anda akan diarahkan ke WhatsApp untuk berbagi tiket.</p>`,
                confirmButtonText: 'Buka WhatsApp',
                showCancelButton: true,
                confirmButtonColor: '#25D366'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.open(whatsappUrl, '_blank');
                }
            });
        } else if (method === 'email') {
            // Simulasi berbagi via Email
            const emailSubject = `Tiket Bus: ${additionalData.bookingId}`;
            const emailBody = `
Halo,

Berikut adalah detail tiket bus yang telah saya pesan:

Booking ID: ${additionalData.bookingId}
Nama Penumpang: ${ticketData.nama}
Rute: ${additionalData.fromCity} → ${additionalData.toCity}
Tanggal: ${additionalData.travelDate}
Jam Keberangkatan: ${additionalData.departureTime}
Kursi: ${ticketData.kursi}
Bus: ${additionalData.busName} (${additionalData.busType})

Tiket ini dapat dilihat di: ${shareData.url}

Terima kasih.
            `;
            
            const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            
            Swal.fire({
                icon: 'info',
                title: 'Berbagi via Email',
                html: `<p>Aplikasi email default Anda akan terbuka untuk mengirim tiket.</p>`,
                confirmButtonText: 'Buka Email',
                showCancelButton: true,
                confirmButtonColor: '#EA4335'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = mailtoUrl;
                }
            });
        }
        
        Swal.close();
    }

    // Tambahkan Font Awesome jika belum ada
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }

    // Tambahkan SweetAlert2 jika belum ada
    if (!document.querySelector('link[href*="sweetalert2"]')) {
        const sweetAlertCSS = document.createElement('link');
        sweetAlertCSS.rel = 'stylesheet';
        sweetAlertCSS.href = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css';
        document.head.appendChild(sweetAlertCSS);
        
        const sweetAlertJS = document.createElement('script');
        sweetAlertJS.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        document.body.appendChild(sweetAlertJS);
        
        sweetAlertJS.onload = initializePage;
    } else {
        initializePage();
    }
});