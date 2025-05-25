// BixForge Admin Dashboard Authentication Guard
// Protects the dashboard from unauthorized access

class AdminAuthGuard {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupLogoutHandlers();
        this.setupSessionMonitoring();
        console.log('🛡️ Admin Auth Guard initialized');
    }

    checkAuthentication() {
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return false;
        }

        this.displayAdminInfo();
        return true;
    }

    isAuthenticated() {
        const sessionData = localStorage.getItem('bixforge_admin_session');
        if (!sessionData) return false;

        try {
            const session = JSON.parse(sessionData);
            const now = new Date();
            const expiresAt = new Date(session.expiresAt);

            if (now >= expiresAt) {
                this.clearSession();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error parsing session data:', error);
            this.clearSession();
            return false;
        }
    }

    getSession() {
        const sessionData = localStorage.getItem('bixforge_admin_session');
        return sessionData ? JSON.parse(sessionData) : null;
    }

    displayAdminInfo() {
        const session = this.getSession();
        if (!session) return;

        // Update admin info in header if elements exist
        const adminNameElement = document.getElementById('admin-name');
        const loginTimeElement = document.getElementById('login-time');

        if (adminNameElement) {
            adminNameElement.textContent = session.username;
        }

        if (loginTimeElement) {
            const loginTime = new Date(session.loginTime);
            loginTimeElement.textContent = loginTime.toLocaleString();
        }

        console.log(`👤 Admin logged in: ${session.username}`);
    }

    setupLogoutHandlers() {
        // Add logout button to dashboard if it doesn't exist
        this.addLogoutButton();

        // Handle logout button clicks
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {
                e.preventDefault();
                this.logout();
            }
        });

        // Handle keyboard shortcut for logout (Ctrl+Shift+L)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.logout();
            }
        });
    }

    addLogoutButton() {
        // Check if logout button already exists
        if (document.getElementById('logout-btn')) return;

        // Find the header or create one
        let header = document.querySelector('header');
        if (!header) {
            // Look for the main header div
            header = document.querySelector('.bg-gradient-to-r.from-purple-600.to-pink-600');
        }

        if (header) {
            // Add logout button to existing header
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-btn';
            logoutBtn.className = 'ml-auto bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2';
            logoutBtn.innerHTML = `
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            `;

            // Find a good place to insert the button
            const headerContent = header.querySelector('.container, .flex, .px-6');
            if (headerContent) {
                headerContent.appendChild(logoutBtn);
            } else {
                header.appendChild(logoutBtn);
            }
        }
    }

    setupSessionMonitoring() {
        // Check session validity every 5 minutes
        setInterval(() => {
            if (!this.isAuthenticated()) {
                this.showSessionExpiredMessage();
                setTimeout(() => this.redirectToLogin(), 3000);
            }
        }, 5 * 60 * 1000);

        // Extend session on user activity
        let lastActivity = Date.now();
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                lastActivity = Date.now();
                this.extendSessionIfNeeded();
            }, { passive: true });
        });

        // Check for inactivity every minute
        setInterval(() => {
            const inactiveTime = Date.now() - lastActivity;
            const maxInactiveTime = 30 * 60 * 1000; // 30 minutes

            if (inactiveTime > maxInactiveTime) {
                this.showInactivityWarning();
            }
        }, 60 * 1000);
    }

    extendSessionIfNeeded() {
        const session = this.getSession();
        if (!session) return;

        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();

        // Extend session if less than 1 hour remaining
        if (timeUntilExpiry < 60 * 60 * 1000) {
            session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            localStorage.setItem('bixforge_admin_session', JSON.stringify(session));
            console.log('🔄 Session extended');
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.clearSession();
            this.showLogoutMessage();
            setTimeout(() => this.redirectToLogin(), 1500);
        }
    }

    clearSession() {
        localStorage.removeItem('bixforge_admin_session');
    }

    redirectToLogin() {
        window.location.href = 'admin-login.html';
    }

    showSessionExpiredMessage() {
        this.showMessage('Session expired. Redirecting to login...', 'warning');
    }

    showInactivityWarning() {
        this.showMessage('You have been inactive for a while. Please interact with the page to maintain your session.', 'info');
    }

    showLogoutMessage() {
        this.showMessage('Logged out successfully. Redirecting...', 'success');
    }

    showMessage(message, type = 'info') {
        // Create or update notification
        let notification = document.getElementById('auth-notification');

        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'auth-notification';
            notification.className = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full';
            document.body.appendChild(notification);
        }

        // Set message and style based on type
        const styles = {
            info: 'bg-blue-500 text-white',
            warning: 'bg-yellow-500 text-white',
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white'
        };

        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${styles[type] || styles.info}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${this.getIconForType(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Show notification
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    getIconForType(type) {
        const icons = {
            info: 'info-circle',
            warning: 'exclamation-triangle',
            success: 'check-circle',
            error: 'times-circle'
        };
        return icons[type] || icons.info;
    }

    // Static methods for external use
    static isAuthenticated() {
        const sessionData = localStorage.getItem('bixforge_admin_session');
        if (!sessionData) return false;

        try {
            const session = JSON.parse(sessionData);
            const now = new Date();
            const expiresAt = new Date(session.expiresAt);
            return now < expiresAt;
        } catch (error) {
            return false;
        }
    }

    static logout() {
        localStorage.removeItem('bixforge_admin_session');
        window.location.href = 'admin-login.html';
    }

    static getAdminInfo() {
        const sessionData = localStorage.getItem('bixforge_admin_session');
        return sessionData ? JSON.parse(sessionData) : null;
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're not on the login page
    if (!window.location.pathname.includes('admin-login.html')) {
        console.log('🛡️ Initializing Admin Auth Guard...');
        window.adminAuthGuard = new AdminAuthGuard();
        console.log('✅ Admin Auth Guard ready!');
    }
});

// Export for use in other files
window.AdminAuthGuard = AdminAuthGuard;
