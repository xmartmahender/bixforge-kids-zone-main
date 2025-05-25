// BixForge Admin Authentication System
// Secure login and password reset functionality

class AdminAuthSystem {
    constructor() {
        this.adminCredentials = this.loadAdminCredentials();
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        this.maxLoginAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkExistingSession();
        this.loadLoginAttempts();
        console.log('🔐 BixForge Admin Auth System initialized');
    }

    // Default admin credentials (in production, these should be in a secure database)
    loadAdminCredentials() {
        const stored = localStorage.getItem('bixforge_admin_credentials');
        if (stored) {
            return JSON.parse(stored);
        }

        // Default credentials
        const defaultCredentials = {
            username: 'bixforge_admin',
            password: 'BixForge2025!',
            email: 'admin@bixforge.com',
            lastPasswordChange: new Date().toISOString(),
            isFirstLogin: true
        };

        this.saveAdminCredentials(defaultCredentials);
        return defaultCredentials;
    }

    saveAdminCredentials(credentials) {
        localStorage.setItem('bixforge_admin_credentials', JSON.stringify(credentials));
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Password toggle
        const togglePassword = document.getElementById('toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Forgot password
        const forgotPasswordBtn = document.getElementById('forgot-password-btn');
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', () => this.showForgotPasswordModal());
        }

        // Reset form
        const resetForm = document.getElementById('reset-form');
        if (resetForm) {
            resetForm.addEventListener('submit', (e) => this.handlePasswordReset(e));
        }

        // Cancel reset
        const cancelReset = document.getElementById('cancel-reset');
        if (cancelReset) {
            cancelReset.addEventListener('click', () => this.hideForgotPasswordModal());
        }

        // Close modal on outside click
        const modal = document.getElementById('forgot-password-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideForgotPasswordModal();
                }
            });
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Check if account is locked
        if (this.isAccountLocked()) {
            this.showError('Account temporarily locked due to multiple failed attempts. Please try again later.');
            return;
        }

        this.showLoading(true);
        this.hideMessages();

        // Simulate authentication delay
        await this.delay(1000);

        if (this.validateCredentials(username, password)) {
            this.handleSuccessfulLogin(rememberMe);
        } else {
            this.handleFailedLogin();
        }

        this.showLoading(false);
    }

    validateCredentials(username, password) {
        return username === this.adminCredentials.username &&
               password === this.adminCredentials.password;
    }

    handleSuccessfulLogin(rememberMe) {
        // Clear login attempts
        this.clearLoginAttempts();

        // Create session
        const session = {
            username: this.adminCredentials.username,
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString(),
            rememberMe: rememberMe
        };

        localStorage.setItem('bixforge_admin_session', JSON.stringify(session));

        this.showSuccess('Login successful! Redirecting to dashboard...');

        // Redirect to dashboard after short delay
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1500);
    }

    handleFailedLogin() {
        this.incrementLoginAttempts();
        const attempts = this.getLoginAttempts();
        const remaining = this.maxLoginAttempts - attempts;

        if (remaining <= 0) {
            this.lockAccount();
            this.showError('Too many failed attempts. Account locked for 15 minutes.');
        } else {
            this.showError(`Invalid credentials. ${remaining} attempts remaining.`);
        }
    }

    async handlePasswordReset(e) {
        e.preventDefault();

        const username = document.getElementById('reset-username').value.trim();
        const email = document.getElementById('reset-email').value.trim();
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        this.hideMessages();

        // Validate inputs
        if (!this.validateResetForm(username, email, newPassword, confirmPassword)) {
            return;
        }

        this.showResetLoading(true);

        // Simulate reset process
        await this.delay(2000);

        if (this.validateAdminDetails(username, email)) {
            this.updatePassword(newPassword);
            this.showSuccess('Password reset successful! You can now login with your new password.');

            setTimeout(() => {
                this.hideForgotPasswordModal();
                this.clearForm('reset-form');
            }, 2000);
        } else {
            this.showError('Invalid admin details. Please check your username and email.');
        }

        this.showResetLoading(false);
    }

    validateResetForm(username, email, newPassword, confirmPassword) {
        if (!username || !email || !newPassword || !confirmPassword) {
            this.showError('Please fill in all fields.');
            return false;
        }

        if (newPassword !== confirmPassword) {
            this.showError('Passwords do not match.');
            return false;
        }

        if (newPassword.length < 8) {
            this.showError('Password must be at least 8 characters long.');
            return false;
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            this.showError('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
            return false;
        }

        return true;
    }

    validateAdminDetails(username, email) {
        return username === this.adminCredentials.username &&
               email === this.adminCredentials.email;
    }

    updatePassword(newPassword) {
        this.adminCredentials.password = newPassword;
        this.adminCredentials.lastPasswordChange = new Date().toISOString();
        this.adminCredentials.isFirstLogin = false;
        this.saveAdminCredentials(this.adminCredentials);
    }

    // Session Management
    checkExistingSession() {
        const session = this.getSession();
        if (session && this.isSessionValid(session)) {
            // Redirect to dashboard if already logged in
            window.location.href = 'admin-dashboard.html';
        }
    }

    getSession() {
        const sessionData = localStorage.getItem('bixforge_admin_session');
        return sessionData ? JSON.parse(sessionData) : null;
    }

    isSessionValid(session) {
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        return now < expiresAt;
    }

    // Login Attempts Management
    loadLoginAttempts() {
        const attempts = localStorage.getItem('bixforge_login_attempts');
        return attempts ? JSON.parse(attempts) : { count: 0, lastAttempt: null, lockedUntil: null };
    }

    getLoginAttempts() {
        return this.loadLoginAttempts().count;
    }

    incrementLoginAttempts() {
        const attempts = this.loadLoginAttempts();
        attempts.count++;
        attempts.lastAttempt = new Date().toISOString();
        localStorage.setItem('bixforge_login_attempts', JSON.stringify(attempts));
    }

    clearLoginAttempts() {
        localStorage.removeItem('bixforge_login_attempts');
    }

    lockAccount() {
        const attempts = this.loadLoginAttempts();
        attempts.lockedUntil = new Date(Date.now() + this.lockoutDuration).toISOString();
        localStorage.setItem('bixforge_login_attempts', JSON.stringify(attempts));
    }

    isAccountLocked() {
        const attempts = this.loadLoginAttempts();
        if (!attempts.lockedUntil) return false;

        const now = new Date();
        const lockedUntil = new Date(attempts.lockedUntil);

        if (now < lockedUntil) {
            return true;
        } else {
            // Lock period expired, clear attempts
            this.clearLoginAttempts();
            return false;
        }
    }

    // UI Helper Methods
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#toggle-password i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleIcon.className = 'fas fa-eye';
        }
    }

    showForgotPasswordModal() {
        const modal = document.getElementById('forgot-password-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.getElementById('reset-username').focus();
        }
    }

    hideForgotPasswordModal() {
        const modal = document.getElementById('forgot-password-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.clearForm('reset-form');
            this.hideMessages();
        }
    }

    showLoading(show) {
        const btn = document.getElementById('login-btn');
        const btnText = document.getElementById('login-btn-text');
        const spinner = document.getElementById('login-spinner');

        if (show) {
            btn.disabled = true;
            btnText.textContent = 'Signing In...';
            spinner.classList.remove('hidden');
        } else {
            btn.disabled = false;
            btnText.textContent = 'Sign In to Dashboard';
            spinner.classList.add('hidden');
        }
    }

    showResetLoading(show) {
        const btn = document.getElementById('reset-btn');
        const btnText = document.getElementById('reset-btn-text');
        const spinner = document.getElementById('reset-spinner');

        if (show) {
            btn.disabled = true;
            btnText.textContent = 'Resetting...';
            spinner.classList.remove('hidden');
        } else {
            btn.disabled = false;
            btnText.textContent = 'Reset Password';
            spinner.classList.add('hidden');
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        const successDiv = document.getElementById('success-message');

        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.classList.remove('hidden');
            successDiv?.classList.add('hidden');
        }
    }

    showSuccess(message) {
        const successDiv = document.getElementById('success-message');
        const successText = document.getElementById('success-text');
        const errorDiv = document.getElementById('error-message');

        if (successDiv && successText) {
            successText.textContent = message;
            successDiv.classList.remove('hidden');
            errorDiv?.classList.add('hidden');
        }
    }

    hideMessages() {
        const errorDiv = document.getElementById('error-message');
        const successDiv = document.getElementById('success-message');

        errorDiv?.classList.add('hidden');
        successDiv?.classList.add('hidden');
    }

    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Static method to check authentication for dashboard
    static isAuthenticated() {
        const sessionData = localStorage.getItem('bixforge_admin_session');
        if (!sessionData) return false;

        const session = JSON.parse(sessionData);
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);

        return now < expiresAt;
    }

    // Static method to logout
    static logout() {
        localStorage.removeItem('bixforge_admin_session');
        window.location.href = 'admin-login.html';
    }
}

// Initialize the authentication system
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Initializing BixForge Admin Authentication...');
    window.adminAuth = new AdminAuthSystem();
    console.log('✅ Admin Authentication System ready!');
});

// Export for use in other files
window.AdminAuthSystem = AdminAuthSystem;
