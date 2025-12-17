// ============================================
// ADMIN LOGIN - JAVASCRIPT
// ============================================

// Main Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Admin Login JS Loaded');
    
    // Setup all event listeners
    setupEventListeners();
    
    // Check for saved credentials
    checkSavedCredentials();
    
    // Check for URL error messages
    checkUrlParams();
    
    // Add custom styles
    addCustomStyles();
});

// ============================================
// 1. EVENT LISTENERS SETUP
// ============================================
function setupEventListeners() {
    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // Form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Forgot password
    const forgotPassword = document.getElementById('forgotPassword');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', handleForgotPassword);
    }
    
    // Input validation on blur
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', clearEmailError);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', validatePassword);
        passwordInput.addEventListener('input', clearPasswordError);
    }
}

// ============================================
// 2. FORM HANDLING
// ============================================
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember') === 'on';
    
    // Validate inputs
    if (!validateForm(email, password)) {
        return;
    }
    
    // Show loading
    showLoading(true);
    
    // Save credentials if "Remember me" is checked
    if (remember) {
        saveCredentials(email);
    } else {
        clearCredentials();
    }
    
    // Simulate API call (replace with actual AJAX call)
    setTimeout(() => {
        // In production, this would be an actual fetch/AJAX call
        simulateLogin(email, password);
    }, 1500);
}

function validateForm(email, password) {
    let isValid = true;
    
    // Validate email
    if (!validateEmailInput(email)) {
        showInputError('email', 'Email tidak valid');
        isValid = false;
    }
    
    // Validate password
    if (!validatePasswordInput(password)) {
        showInputError('password', 'Password minimal 6 karakter');
        isValid = false;
    }
    
    return isValid;
}

// ============================================
// 3. VALIDATION FUNCTIONS
// ============================================
function validateEmail() {
    const emailInput = document.getElementById('email');
    if (emailInput && emailInput.value.trim()) {
        const isValid = validateEmailInput(emailInput.value);
        if (!isValid) {
            showInputError('email', 'Format email tidak valid');
            return false;
        }
    }
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    if (passwordInput && passwordInput.value.trim()) {
        const isValid = validatePasswordInput(passwordInput.value);
        if (!isValid) {
            showInputError('password', 'Password minimal 6 karakter');
            return false;
        }
    }
    return true;
}

function validateEmailInput(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePasswordInput(password) {
    return password.length >= 6;
}

function clearEmailError() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.classList.remove('error');
        const errorDiv = emailInput.parentElement.querySelector('.input-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}

function clearPasswordError() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.classList.remove('error');
        const errorDiv = passwordInput.parentElement.querySelector('.input-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
}

// ============================================
// 4. UI FUNCTIONS
// ============================================
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword').querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
        passwordInput.focus();
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function showLoading(show) {
    const submitBtn = document.getElementById('submitBtn');
    const buttonText = document.getElementById('buttonText');
    
    if (show) {
        submitBtn.disabled = true;
        buttonText.innerHTML = '<span class="loading"></span> Memproses...';
    } else {
        submitBtn.disabled = false;
        buttonText.textContent = 'Login ke Dashboard';
    }
}

function showMessage(message, type = 'error') {
    const messageContainer = document.getElementById('messageContainer');
    
    // Clear previous messages
    messageContainer.innerHTML = '';
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    
    const icon = type === 'error' ? 'fa-exclamation-circle' :
                 type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    
    messageDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    messageContainer.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    if (type !== 'error') {
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
}

function showInputError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    // Add error class
    input.classList.add('error');
    input.classList.add('shake');
    
    // Remove shake animation after it completes
    setTimeout(() => {
        input.classList.remove('shake');
    }, 500);
    
    // Remove existing error message
    const existingError = input.parentElement.querySelector('.input-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.style.cssText = `
        color: #d32f2f;
        font-size: 0.8rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    input.parentElement.appendChild(errorDiv);
}

// ============================================
// 5. CREDENTIALS MANAGEMENT
// ============================================
function checkSavedCredentials() {
    const savedEmail = localStorage.getItem('admin_email');
    const rememberChecked = localStorage.getItem('admin_remember') === 'true';
    
    if (savedEmail && rememberChecked) {
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('remember');
        
        if (emailInput) {
            emailInput.value = savedEmail;
        }
        
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
            // Auto focus password field
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                setTimeout(() => passwordInput.focus(), 100);
            }
        }
    }
}

function saveCredentials(email) {
    localStorage.setItem('admin_email', email);
    localStorage.setItem('admin_remember', 'true');
}

function clearCredentials() {
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_remember');
}

// ============================================
// 6. FORGOT PASSWORD HANDLING
// ============================================
function handleForgotPassword(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const email = emailInput ? emailInput.value.trim() : '';
    
    if (!email) {
        showMessage('Masukkan email untuk reset password', 'error');
        emailInput.focus();
        return;
    }
    
    if (!validateEmailInput(email)) {
        showMessage('Format email tidak valid', 'error');
        return;
    }
    
    // Show confirmation
    if (confirm(`Kirim reset password ke ${email}?`)) {
        showLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            showLoading(false);
            showMessage(`Instruksi reset password telah dikirim ke ${email}`, 'success');
            
            // Log to console (for debugging)
            console.log(`Reset password requested for: ${email}`);
        }, 2000);
    }
}

// ============================================
// 7. URL PARAMETERS HANDLING
// ============================================
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for error parameter
    const error = urlParams.get('error');
    if (error) {
        const errorMessages = {
            'invalid': 'Email atau password tidak valid',
            'session': 'Sesi telah berakhir, silakan login kembali',
            'unauthorized': 'Akses tidak diizinkan',
            'required': 'Email dan password diperlukan'
        };
        
        const message = errorMessages[error] || 'Terjadi kesalahan saat login';
        showMessage(message, 'error');
        
        // Clear error from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
    
    // Check for success parameter
    const success = urlParams.get('success');
    if (success === 'logout') {
        showMessage('Anda telah logout', 'success');
        
        // Clear success from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
}

// ============================================
// 8. SIMULATION FUNCTIONS (REPLACE WITH REAL API)
// ============================================
function simulateLogin(email, password) {
    // This is a simulation - replace with actual API call
    
    // Mock credentials (in production, this would be server-side validation)
    const mockAdminEmail = 'admin@busticket.com';
    const mockAdminPassword = 'admin123';
    
    if (email === mockAdminEmail && password === mockAdminPassword) {
        // Success
        showMessage('Login berhasil! Mengalihkan...', 'success');
        
        // Simulate redirect
        setTimeout(() => {
            // In production, this would be form submission or redirect
            window.location.href = '/admin/dashboard';
        }, 2000);
    } else {
        // Error
        showLoading(false);
        showMessage('Email atau password salah', 'error');
        
        // Shake form for visual feedback
        const form = document.getElementById('loginForm');
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
    }
}

// ============================================
// 9. CUSTOM STYLES
// ============================================
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .input-error {
            animation: slideDown 0.3s ease;
        }
        
        .error {
            border-color: #d32f2f !important;
            background: #fff5f5 !important;
        }
        
        .error:focus {
            box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1) !important;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
        }
        
        /* Focus styles */
        input:focus, button:focus {
            outline: 2px solid #667eea;
            outline-offset: 2px;
        }
        
        /* Print styles */
        @media print {
            .login-container {
                box-shadow: none;
                border: 1px solid #ccc;
            }
            
            .submit-button, .password-toggle, .back-home {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 10. GLOBAL EXPORTS
// ============================================
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleForgotPassword = handleForgotPassword;

console.log('🔐 Admin Login JS siap digunakan!');