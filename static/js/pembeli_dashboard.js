// static/js/pembeli_dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Dashboard loaded successfully!');
    
    // 1. Set current date
    setCurrentDate();
    
    // 2. Update greeting based on time
    updateGreeting();
    
    // 3. Setup logout confirmation
    setupLogoutButton();
    
    // 4. Add click effects to menu cards
    setupMenuCards();
    
    console.log('🎯 Dashboard JS initialized');
});

function setCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = now.toLocaleDateString('id-ID', options);
        dateElement.textContent = dateString;
        console.log('📅 Date set:', dateString);
    }
}

function updateGreeting() {
    const greetingElement = document.querySelector('.greeting');
    if (greetingElement) {
        const hour = new Date().getHours();
        let greeting = 'Selamat siang';
        
        if (hour < 11) greeting = 'Selamat pagi';
        if (hour >= 18) greeting = 'Selamat malam';
        
        greetingElement.textContent = greeting + ', ';
        console.log('👋 Greeting:', greeting);
    }
}

function setupLogoutButton() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            if (!confirm('Yakin ingin logout?')) {
                event.preventDefault();
            }
        });
        console.log('🚪 Logout button ready');
    }
}

function setupMenuCards() {
    const menuCards = document.querySelectorAll('.menu-card');
    
    menuCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.2s';
            
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            console.log('📱 Menu clicked:', this.querySelector('h3').textContent);
        });
    });
    
    console.log('🎯 Menu cards:', menuCards.length);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : '#3498db'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS animations
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
`;
document.head.appendChild(style);