// admin_dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
    
    // Card hover effects
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Click handlers for dashboard cards
    document.querySelectorAll('.card-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.dataset.action || this.textContent.toLowerCase();
            handleDashboardAction(action);
        });
    });
    
    // Logout confirmation
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLogoutConfirmation();
        });
    }
    
    // Load dashboard stats
    loadDashboardStats();
    
    // Add active state to current page
    highlightActivePage();
});

function initDashboard() {
    console.log('Dashboard initialized for:', document.querySelector('.welcome-message b').textContent);
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Selamat datang di Dashboard Admin!', 'success');
    }, 1000);
}

function handleDashboardAction(action) {
    const actions = {
        'kelola jadwal': {
            url: '/admin/jadwal',
            message: 'Membuka manajemen jadwal...'
        },
        'kelola pengguna': {
            url: '/admin/pengguna',
            message: 'Membuka manajemen pengguna...'
        },
        'laporan': {
            url: '/admin/laporan',
            message: 'Membuka laporan...'
        }
    };
    
    if (actions[action]) {
        showNotification(actions[action].message, 'info');
        
        // Simulate loading before redirect
        setTimeout(() => {
            window.location.href = actions[action].url;
        }, 500);
    }
}

function loadDashboardStats() {
    // In a real application, this would fetch from an API
    const stats = {
        totalUsers: 1542,
        activeSchedules: 28,
        todaySales: 12450000,
        pendingTickets: 17
    };
    
    // Update stat numbers with animation
    Object.keys(stats).forEach(stat => {
        const element = document.querySelector(`.${stat}`);
        if (element) {
            animateNumber(element, stats[stat]);
        }
    });
}

function animateNumber(element, finalValue) {
    let current = 0;
    const increment = finalValue / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
            clearInterval(timer);
            element.textContent = formatNumber(finalValue);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 30);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return 'Rp' + (num / 1000000).toFixed(1) + 'jt';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'k';
    }
    return num.toString();
}

function showLogoutConfirmation() {
    if (confirm('Anda yakin ingin logout dari sistem?')) {
        showNotification('Logging out...', 'warning');
        setTimeout(() => {
            window.location.href = '/logout';
        }, 1000);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-text">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles based on type
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.display = 'block';
    }, 10);
    
    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

function hideNotification(notification) {
    notification.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

function highlightActivePage() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.card-btn');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href)) {
            link.parentElement.parentElement.style.borderColor = '#4CAF50';
            link.style.background = '#4CAF50';
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + J: Jadwal
    if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        window.location.href = '/admin/jadwal';
    }
    
    // Ctrl + P: Pengguna
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        window.location.href = '/admin/pengguna';
    }
    
    // Ctrl + L: Laporan
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        window.location.href = '/admin/laporan';
    }
    
    // Ctrl + Q: Logout
    if (e.ctrlKey && e.key === 'q') {
        e.preventDefault();
        showLogoutConfirmation();
    }
});