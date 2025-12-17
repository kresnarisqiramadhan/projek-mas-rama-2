// ============================================
// PEMBAYARAN TIKET BUS - JAVASCRIPT LANGSUNG JADI
// ============================================

// Global Variables
let selectedPaymentMethod = 'bank-transfer';
let uploadedFile = null;
let paymentTimer = null;
let timeLeft = 1800; // 30 minutes in seconds

// Main Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('💰 Pembayaran Tiket JS Loaded');
    
    // Load data from storage
    loadPaymentData();
    
    // Setup all event listeners
    setupAllEventListeners();
    
    // Start payment timer
    startPaymentTimer();
    
    // Auto select bank transfer as default
    selectPaymentMethod('bank-transfer');
    
    // Add dynamic styles
    addCustomStyles();
});

// ============================================
// 1. LOAD PAYMENT DATA
// ============================================
function loadPaymentData() {
    // Try from localStorage first
    const savedData = localStorage.getItem('busBookingData') || 
                     localStorage.getItem('paymentData') ||
                     sessionStorage.getItem('busBookingData');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            displayPaymentData(data);
            console.log('✅ Data loaded from storage:', data);
        } catch (e) {
            console.error('❌ Error parsing data:', e);
            loadFromUrlParams();
        }
    } else {
        loadFromUrlParams();
    }
}

function loadFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const idBus = urlParams.get('id_bus');
    const kursi = urlParams.get('kursi');
    const harga = urlParams.get('harga') || '450000';
    
    const data = {
        id_bus: idBus || 'BUS-001',
        kursi: kursi ? kursi.split(',') : ['A1', 'B2'],
        totalAmount: parseInt(harga),
        bookingId: generateBookingId(),
        busName: urlParams.get('bus') || 'Suite Class',
        origin: urlParams.get('origin') || 'Jakarta',
        destination: urlParams.get('destination') || 'Bandung',
        date: urlParams.get('date') || new Date().toISOString().split('T')[0]
    };
    
    displayPaymentData(data);
}

function displayPaymentData(data) {
    // Update booking info
    document.getElementById('booking-id').textContent = data.bookingId || generateBookingId();
    document.getElementById('id-bus').textContent = data.id_bus || 'BUS-001';
    
    // Format kursi
    const kursiList = Array.isArray(data.kursi) ? data.kursi.join(', ') : data.kursi;
    document.getElementById('kursi-list').textContent = kursiList || 'A1, B2';
    
    // Calculate total
    const basePrice = data.totalAmount || data.basePrice || 450000;
    const seatCount = Array.isArray(data.kursi) ? data.kursi.length : 
                     (data.seats ? data.seats.length : 2);
    const subtotal = basePrice * seatCount;
    const serviceFee = Math.round(subtotal * 0.1);
    const grandTotal = subtotal + serviceFee;
    
    // Display amounts
    document.getElementById('total-amount-display').textContent = formatCurrency(grandTotal);
    document.getElementById('subtotal-breakdown').textContent = formatCurrency(subtotal);
    document.getElementById('service-fee-breakdown').textContent = formatCurrency(serviceFee);
    document.getElementById('grand-total-breakdown').textContent = formatCurrency(grandTotal);
    
    // Save for later use
    window.paymentData = {
        ...data,
        subtotal: subtotal,
        serviceFee: serviceFee,
        grandTotal: grandTotal,
        seatCount: seatCount
    };
}

// ============================================
// 2. PAYMENT METHOD SELECTION
// ============================================
function setupAllEventListeners() {
    // Payment method cards
    document.querySelectorAll('.method-card').forEach(card => {
        card.addEventListener('click', function() {
            const method = this.dataset.method;
            selectPaymentMethod(method);
        });
    });
    
    // File upload
    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    
    // Drag and drop
    const uploadSection = document.getElementById('uploadSection');
    uploadSection.addEventListener('dragover', handleDragOver);
    uploadSection.addEventListener('dragleave', handleDragLeave);
    uploadSection.addEventListener('drop', handleDrop);
    
    // Form submission
    document.getElementById('paymentForm').addEventListener('submit', handleFormSubmit);
    
    // Navigation buttons
    document.getElementById('backBtn').addEventListener('click', () => {
        window.history.back();
    });
    
    document.getElementById('dashboardBtn').addEventListener('click', () => {
        window.location.href = '/pembeli/dashboard';
    });
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', loadPaymentData);
    
    // QR Modal
    document.getElementById('closeModal').addEventListener('click', hideQRModal);
    document.addEventListener('click', (e) => {
        if (e.target.id === 'qrModal') hideQRModal();
    });
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Update UI
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.method === method) {
            card.classList.add('selected');
        }
    });
    
    // Show instructions
    showPaymentInstructions(method);
    
    // Update submit button text
    const submitBtn = document.getElementById('submitBtn');
    if (method === 'credit-card') {
        submitBtn.innerHTML = '<i class="fas fa-lock"></i> Bayar Sekarang';
        submitBtn.disabled = false;
    } else {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Bukti Pembayaran';
        submitBtn.disabled = !uploadedFile;
    }
    
    console.log(`✅ Selected payment method: ${method}`);
}

function showPaymentInstructions(method) {
    const container = document.getElementById('paymentInstructions');
    let html = '';
    
    switch(method) {
        case 'bank-transfer':
            html = `
                <div style="background: #e7f5ff; padding: 20px; border-radius: 12px; border-left: 4px solid #007bff;">
                    <h4 style="color: #007bff; margin-bottom: 15px;">
                        <i class="fas fa-university"></i> Transfer Bank
                    </h4>
                    <div class="virtual-account-display">
                        8880 1234 5678 9012
                        <button onclick="copyToClipboard('8880123456789012')" 
                                style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin-left: 10px; cursor: pointer;">
                            <i class="fas fa-copy"></i> Salin
                        </button>
                    </div>
                    <div style="margin-top: 15px;">
                        <div class="info-bullet">
                            <i class="fas fa-info-circle"></i>
                            <span>Transfer ke Virtual Account di atas</span>
                        </div>
                        <div class="info-bullet">
                            <i class="fas fa-clock"></i>
                            <span>Batas waktu: 30 menit</span>
                        </div>
                        <div class="info-bullet">
                            <i class="fas fa-check-circle"></i>
                            <span>Upload bukti transfer setelah membayar</span>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'e-wallet':
            html = `
                <div style="background: #fff8e1; padding: 20px; border-radius: 12px; border-left: 4px solid #ff9800;">
                    <h4 style="color: #ff9800; margin-bottom: 15px;">
                        <i class="fas fa-mobile-alt"></i> E-Wallet
                    </h4>
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #28a745; margin-bottom: 15px;">
                            ${formatCurrency(window.paymentData?.grandTotal || 495000)}
                        </div>
                        <button onclick="showQRModal()" 
                                style="background: linear-gradient(135deg, #ff9800, #ff5722); color: white; border: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                            <i class="fas fa-qrcode"></i> Tampilkan QR Code
                        </button>
                    </div>
                    <div>
                        <div class="info-bullet">
                            <i class="fas fa-info-circle"></i>
                            <span>Scan QR Code dengan aplikasi e-wallet</span>
                        </div>
                        <div class="info-bullet">
                            <i class="fas fa-clock"></i>
                            <span>Batas waktu: 30 menit</span>
                        </div>
                        <div class="info-bullet">
                            <i class="fas fa-check-circle"></i>
                            <span>Pembayaran diverifikasi otomatis</span>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'credit-card':
            html = `
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #6c757d;">
                    <h4 style="color: #6c757d; margin-bottom: 15px;">
                        <i class="fas fa-credit-card"></i> Kartu Kredit
                    </h4>
                    <div style="margin: 20px 0;">
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; color: #495057;">Nomor Kartu</label>
                            <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" 
                                   style="width: 100%; padding: 10px; border: 2px solid #ced4da; border-radius: 6px; font-size: 16px; letter-spacing: 2px;"
                                   maxlength="19">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; color: #495057;">Masa Berlaku</label>
                                <input type="text" id="cardExpiry" placeholder="MM/YY" 
                                       style="width: 100%; padding: 10px; border: 2px solid #ced4da; border-radius: 6px; font-size: 16px;"
                                       maxlength="5">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; color: #495057;">CVV</label>
                                <input type="password" id="cardCVV" placeholder="123" 
                                       style="width: 100%; padding: 10px; border: 2px solid #ced4da; border-radius: 6px; font-size: 16px;"
                                       maxlength="3">
                            </div>
                        </div>
                    </div>
                    <div class="info-bullet">
                        <i class="fas fa-lock" style="color: #28a745;"></i>
                        <span>Transaksi dijamin aman dengan enkripsi SSL</span>
                    </div>
                </div>
            `;
            break;
            
        case 'convenience-store':
            html = `
                <div style="background: #e8f5e9; padding: 20px; border-radius: 12px; border-left: 4px solid #4caf50;">
                    <h4 style="color: #4caf50; margin-bottom: 15px;">
                        <i class="fas fa-store"></i> Gerai Retail
                    </h4>
                    <div class="virtual-account-display" style="text-align: center; font-size: 1.4rem; letter-spacing: 3px;">
                        888 1234 5678
                    </div>
                    <div style="margin-top: 20px;">
                        <div class="info-bullet">
                            <i class="fas fa-info-circle"></i>
                            <span>Tunjukkan kode di gerai Alfamart/Indomaret</span>
                        </div>
                        <div class="info-bullet">
                            <i class="fas fa-clock"></i>
                            <span>Batas waktu: 24 jam</span>
                        </div>
                        <div class="info-bullet">
                            <i class="fas fa-check-circle"></i>
                            <span>Tanpa biaya admin tambahan</span>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
    
    container.innerHTML = html;
    
    // Add event listeners for credit card inputs
    if (method === 'credit-card') {
        setupCreditCardInputs();
    }
}

// ============================================
// 3. FILE UPLOAD HANDLING
// ============================================
function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('uploadSection').classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    document.getElementById('uploadSection').classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    document.getElementById('uploadSection').classList.remove('drag-over');
    
    if (e.dataTransfer.files.length) {
        processFile(e.dataTransfer.files[0]);
    }
}

function handleFileUpload(e) {
    if (e.target.files.length) {
        processFile(e.target.files[0]);
    }
}

function processFile(file) {
    // Validate file
    if (!validateFile(file)) return;
    
    uploadedFile = file;
    
    // Show preview
    showFilePreview(file);
    
    // Enable submit button for non-credit card methods
    if (selectedPaymentMethod !== 'credit-card') {
        document.getElementById('submitBtn').disabled = false;
    }
    
    showNotification('File berhasil diupload!', 'success');
}

function validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification('File terlalu besar. Maksimal 5MB.', 'error');
        return false;
    }
    
    return true;
}

function showFilePreview(file) {
    const previewDiv = document.getElementById('filePreview');
    
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewDiv.innerHTML = `
                <img src="${e.target.result}" class="preview-image" alt="Preview">
                <div class="file-info">
                    <i class="fas fa-file-image"></i>
                    ${file.name} (${formatFileSize(file.size)})
                    <button onclick="removeFile()" style="background: #dc3545; color: white; border: none; padding: 3px 8px; border-radius: 4px; margin-left: 10px; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        previewDiv.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-pdf"></i>
                ${file.name} (${formatFileSize(file.size)})
                <button onclick="removeFile()" style="background: #dc3545; color: white; border: none; padding: 3px 8px; border-radius: 4px; margin-left: 10px; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
}

function removeFile() {
    uploadedFile = null;
    document.getElementById('filePreview').innerHTML = '';
    document.getElementById('fileInput').value = '';
    
    if (selectedPaymentMethod !== 'credit-card') {
        document.getElementById('submitBtn').disabled = true;
    }
    
    showNotification('File dihapus', 'info');
}

// ============================================
// 4. PAYMENT PROCESSING
// ============================================
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate based on payment method
    if (selectedPaymentMethod === 'credit-card') {
        if (!validateCreditCard()) {
            return;
        }
    } else if (!uploadedFile) {
        showNotification('Silakan upload bukti pembayaran terlebih dahulu', 'error');
        return;
    }
    
    // Show confirmation
    Swal.fire({
        title: 'Konfirmasi Pembayaran',
        html: `
            <div style="text-align: left; padding: 15px;">
                <p><strong>Metode:</strong> ${getPaymentMethodName(selectedPaymentMethod)}</p>
                <p><strong>Total:</strong> ${formatCurrency(window.paymentData?.grandTotal || 495000)}</p>
                ${selectedPaymentMethod === 'credit-card' ? 
                    '<p><i class="fas fa-lock"></i> Transaksi aman terenkripsi</p>' : 
                    `<p><strong>File:</strong> ${uploadedFile?.name || 'Bukti Transfer'}</p>`
                }
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Lanjutkan',
        cancelButtonText: 'Batal',
        width: 500
    }).then((result) => {
        if (result.isConfirmed) {
            processPayment();
        }
    });
}

function validateCreditCard() {
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry')?.value;
    const cardCVV = document.getElementById('cardCVV')?.value;
    
    if (!cardNumber || cardNumber.length !== 16) {
        showNotification('Nomor kartu tidak valid', 'error');
        return false;
    }
    
    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        showNotification('Format masa berlaku tidak valid (MM/YY)', 'error');
        return false;
    }
    
    if (!cardCVV || cardCVV.length !== 3) {
        showNotification('CVV harus 3 digit', 'error');
        return false;
    }
    
    return true;
}

function processPayment() {
    // Show loading
    Swal.fire({
        title: 'Memproses Pembayaran...',
        text: 'Harap tunggu sebentar',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Simulate payment processing
    setTimeout(() => {
        // Save transaction data
        const transactionData = {
            ...window.paymentData,
            paymentMethod: selectedPaymentMethod,
            paymentFile: uploadedFile?.name || 'credit-card',
            paymentTime: new Date().toISOString(),
            paymentStatus: 'success',
            transactionId: generateTransactionId(),
            referenceNumber: 'PAY-' + Date.now()
        };
        
        localStorage.setItem('transactionData', JSON.stringify(transactionData));
        
        // Clear timer
        if (paymentTimer) {
            clearInterval(paymentTimer);
        }
        
        // Show success
        Swal.fire({
            title: 'Pembayaran Berhasil!',
            html: `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 4rem; color: #28a745; margin-bottom: 20px;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <p style="font-size: 1.2rem; margin-bottom: 15px;">
                        Tiket Anda telah diproses
                    </p>
                    <p style="color: #666; margin-bottom: 10px;">
                        No. Referensi: <strong>${transactionData.referenceNumber}</strong>
                    </p>
                </div>
            `,
            icon: 'success',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'Lihat Tiket'
        }).then(() => {
            // Redirect to ticket page
           window.location.href = '/pembeli/e-tiket?ref=' + transactionData.referenceNumber;
        });
    }, 2000);
}

// ============================================
// 5. TIMER FUNCTIONS
// ============================================
function startPaymentTimer() {
    updateTimerDisplay();
    
    paymentTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(paymentTimer);
            showTimeUpWarning();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const display = document.getElementById('timerDisplay');
    
    if (display) {
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color based on time left
        if (timeLeft < 300) { // 5 minutes
            display.style.color = '#dc3545';
            display.style.fontWeight = 'bold';
        } else if (timeLeft < 600) { // 10 minutes
            display.style.color = '#ffc107';
        }
    }
}

// ============================================
// 6. UTILITY FUNCTIONS
// ============================================
function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

function generateBookingId() {
    return 'BOOK-' + Date.now().toString().slice(-8) + 
           Math.random().toString(36).substring(2, 6).toUpperCase();
}

function generateTransactionId() {
    return 'TRX-' + Date.now().toString().slice(-10) + 
           Math.random().toString(36).substring(2, 5).toUpperCase();
}

function getPaymentMethodName(method) {
    const names = {
        'bank-transfer': 'Transfer Bank',
        'e-wallet': 'E-Wallet',
        'credit-card': 'Kartu Kredit',
        'convenience-store': 'Gerai Retail'
    };
    return names[method] || 'Transfer Bank';
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Tersalin ke clipboard!', 'success');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Tersalin ke clipboard!', 'success');
    });
}

function showQRModal() {
    document.getElementById('qrModal').style.display = 'flex';
}

function hideQRModal() {
    document.getElementById('qrModal').style.display = 'none';
}

function setupCreditCardInputs() {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCVV = document.getElementById('cardCVV');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value.substring(0, 19);
        });
    }
    
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
        });
    }
    
    if (cardCVV) {
        cardCVV.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
}

// ============================================
// 7. NOTIFICATION FUNCTIONS
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const oldNotif = document.querySelector('.custom-notification');
    if (oldNotif) oldNotif.remove();
    
    // Create new notification
    const notif = document.createElement('div');
    notif.className = `custom-notification ${type}`;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : 
                     type === 'error' ? '#dc3545' : 
                     type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
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
    
    notif.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notif);
    
    // Auto remove
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(100px)';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

function showTimeUpWarning() {
    Swal.fire({
        title: 'Waktu Pembayaran Habis!',
        html: `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 4rem; color: #dc3545; margin-bottom: 20px;">
                    <i class="fas fa-clock"></i>
                </div>
                <p style="font-size: 1.2rem; margin-bottom: 15px;">
                    Waktu pembayaran Anda telah habis
                </p>
                <p style="color: #666;">
                    Silakan lakukan pemesanan ulang
                </p>
            </div>
        `,
        icon: 'error',
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Pesan Ulang',
        allowOutsideClick: false
    }).then(() => {
        // Clear data and redirect
        localStorage.removeItem('busBookingData');
        localStorage.removeItem('paymentData');
        sessionStorage.clear();
        window.location.href = '/pembeli/caritiket';
    });
}

// ============================================
// 8. CUSTOM STYLES
// ============================================
function addCustomStyles() {
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
        
        .virtual-account-display {
            font-family: 'Courier New', monospace;
            font-size: 1.3rem;
            letter-spacing: 2px;
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            border: 2px dashed #dee2e6;
            margin: 10px 0;
            text-align: center;
        }
        
        .info-bullet {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin: 8px 0;
            font-size: 0.95rem;
        }
        
        .info-bullet i {
            color: #28a745;
            margin-top: 3px;
            min-width: 20px;
        }
        
        /* Payment method animations */
        .method-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .method-card.selected {
            animation: pulse 0.5s ease;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        /* File upload animations */
        .upload-section.drag-over {
            animation: shake 0.5s ease;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        /* Timer animation */
        .timer-display {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 9. GLOBAL EXPORTS
// ============================================
window.copyToClipboard = copyToClipboard;
window.showQRModal = showQRModal;
window.hideQRModal = hideQRModal;
window.removeFile = removeFile;
window.selectPaymentMethod = selectPaymentMethod;

console.log('🚀 Pembayaran Tiket JS siap digunakan!');