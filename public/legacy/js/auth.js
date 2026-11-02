// Authentication uses the Spring Security HTTP session. The browser only keeps
// a display hint in localStorage; the HttpOnly session cookie grants API access.
(function installApiSecurity() {
    const nativeFetch = window.fetch.bind(window);
    const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

    window.fetch = async function secureFetch(input, init = {}) {
        const requestUrl = typeof input === 'string' ? input : input.url;
        const url = new URL(requestUrl, window.location.href);
        const method = (init.method || (typeof input === 'object' && input.method) || 'GET').toUpperCase();
        const isLocalApi = url.origin === window.location.origin && url.pathname.startsWith('/api/');
        const options = { ...init, credentials: 'same-origin' };

        if (isLocalApi && unsafeMethods.has(method)) {
            const csrfResponse = await nativeFetch('/api/auth/csrf', { credentials: 'same-origin' });
            if (csrfResponse.ok) {
                const csrf = await csrfResponse.json();
                const headers = new Headers(init.headers || (typeof input === 'object' ? input.headers : undefined));
                headers.set(csrf.headerName || 'X-CSRF-TOKEN', csrf.token);
                options.headers = headers;
            }
        }

        const response = await nativeFetch(input, options);
        const protectedPage = /\/(dashboard|employees|departments|reports|profile)\.html$/.test(window.location.pathname);
        if (response.status === 401 && protectedPage && url.pathname !== '/api/auth/login') {
            clearLoginState();
            document.documentElement.classList.remove('auth-checking');
            window.location.replace('login.html');
        }
        return response;
    };
})();

function isAdminPage() {
    return /\/(dashboard|employees|departments|reports|profile)\.html$/.test(window.location.pathname);
}

function clearLoginState() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('companyEmployees');
    localStorage.removeItem('companyDepartments');
}

if (isAdminPage()) {
    document.documentElement.classList.add('auth-checking');
    const guardStyle = document.createElement('style');
    guardStyle.textContent = 'html.auth-checking body{visibility:hidden!important}';
    document.head.appendChild(guardStyle);
}

async function checkAuth() {
    const currentPage = window.location.pathname;
    const loginPage = currentPage.endsWith('/login.html');
    if (!isAdminPage() && !loginPage) return;

    try {
        const response = await window.fetch('/api/auth/me');
        if (!response.ok) {
            clearLoginState();
            document.documentElement.classList.remove('auth-checking');
            if (isAdminPage()) window.location.replace('login.html');
            return;
        }

        const user = await response.json();
        document.documentElement.classList.remove('auth-checking');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('adminUser', JSON.stringify({ ...user, email: 'admin@companypro.com' }));
        if (loginPage) window.location.replace('dashboard.html');
    } catch (_) {
        document.documentElement.classList.remove('auth-checking');
        clearLoginState();
        if (isAdminPage()) window.location.replace('login.html');
    }
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');
    const togglePassword = document.getElementById('togglePassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const submitButton = loginForm.querySelector('button[type="submit"]');

    togglePassword?.addEventListener('click', function () {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        loginMessage.className = 'message';
        loginMessage.textContent = '';
        submitButton.disabled = true;

        try {
            const response = await window.fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput.value.trim(), password: passwordInput.value })
            });
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Invalid username or password. Please try again.');
            }

            const user = await response.json();
            const now = new Date().toISOString();
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('adminUser', JSON.stringify({ ...user, email: 'admin@companypro.com' }));
            localStorage.setItem('loginTime', now);
            localStorage.setItem('lastLogin', now);
            if (rememberMeCheckbox?.checked) localStorage.setItem('rememberMe', 'true');

            loginMessage.className = 'message success';
            loginMessage.textContent = 'Login successful! Redirecting…';
            window.setTimeout(() => window.location.replace('dashboard.html'), 500);
        } catch (error) {
            loginMessage.className = 'message error';
            loginMessage.textContent = error.message || 'Could not reach the login service. Start the backend and try again.';
            loginForm.style.animation = 'shake 0.5s';
            window.setTimeout(() => { loginForm.style.animation = ''; }, 500);
        } finally {
            submitButton.disabled = false;
        }
    });

    if (localStorage.getItem('rememberMe') === 'true' && rememberMeCheckbox) rememberMeCheckbox.checked = true;
}

async function logout() {
    if (!window.confirm('Are you sure you want to logout?')) return false;
    try {
        await window.fetch('/api/auth/logout', { method: 'POST' });
    } finally {
        clearLoginState();
        window.location.replace('login.html');
    }
    return false;
}

document.addEventListener('DOMContentLoaded', checkAuth);
