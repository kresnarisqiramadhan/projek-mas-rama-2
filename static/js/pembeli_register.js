// ==========================
// DOM READY
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    initFormValidation();
    initParticles();
    enhanceFormInteraction();
    addBrandLogo();
});

// ==========================
// BRAND LOGO
// ==========================
function addBrandLogo() {
    const container = document.querySelector('.container');
    const h2 = container.querySelector('h2');

    const brand = document.createElement('div');
    brand.className = 'brand';
    brand.innerHTML = `
        <h1>BUS<span>TICKET</span></h1>
        <p class="brand-sub">Online Booking System</p>
    `;

    container.insertBefore(brand, h2);
}

// ==========================
// PARTICLE BACKGROUND
// ==========================
function initParticles() {
    const container = document.querySelector('.container');
    const particles = document.createElement('div');
    particles.className = 'particles';

    for (let i = 0; i < 12; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 10 + 's';
        p.style.opacity = Math.random() * 0.4 + 0.2;
        particles.appendChild(p);
    }

    container.appendChild(particles);
}

// ==========================
// FORM VALIDATION
// ==========================
function initFormValidation() {
    const form = document.getElementById('registerForm');
    const nama = document.getElementById('nama');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const errors = {
        nama: createError(nama),
        email: createError(email),
        password: createError(password)
    };

    nama.addEventListener('input', () => {
        if (nama.value.trim().length < 3) {
            setError(nama, errors.nama, 'Nama minimal 3 karakter');
        } else {
            setSuccess(nama, errors.nama);
        }
    });

    email.addEventListener('input', () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email.value)) {
            setError(email, errors.email, 'Email tidak valid');
        } else {
            setSuccess(email, errors.email);
        }
    });

    password.addEventListener('input', () => {
        if (password.value.length < 6) {
            setError(password, errors.password, 'Password minimal 6 karakter');
        } else {
            setSuccess(password, errors.password);
        }
    });

    // ⬇️ PENTING: TIDAK preventDefault jika valid
    form.addEventListener('submit', () => {
        showNotification('Memproses registrasi...', 'info');
    });
}

// ==========================
// ERROR HANDLER
// ==========================
function createError(input) {
    const div = document.createElement('div');
    div.className = 'error-message';
    input.after(div);
    return div;
}

function setError(input, errorDiv, message) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function setSuccess(input, errorDiv) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorDiv.style.display = 'none';
}

// ==========================
// NOTIFICATION
// ==========================
function showNotification(message, type) {
    const old = document.querySelector('.notification');
    if (old) old.remove();

    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;

    document.body.appendChild(notif);
    setTimeout(() => notif.classList.add('show'), 10);
}

// ==========================
// FORM UX
// ==========================
function enhanceFormInteraction() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach((input, i) => {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && inputs[i + 1]) {
                e.preventDefault();
                inputs[i + 1].focus();
            }
        });
    });
}

// ==========================
// KEYBOARD SHORTCUT
// ==========================
document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') {
        document.getElementById('registerForm').submit();
    }
});
