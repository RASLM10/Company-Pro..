// ==========================================
// COMMON FUNCTIONS & UTILITIES
// ==========================================

// Check authentication on page load
checkAuth();

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Logout function (available globally)
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('adminUser');
        
        showNotification('Logged out successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    }
}

// Make logout available globally
window.logout = logout;

// Display admin name in sidebar
function displayAdminName() {
    const adminUser = JSON.parse(localStorage.getItem('adminUser')) || { name: 'Admin User' };
    const adminNameElements = document.querySelectorAll('#adminName, .admin-name');
    
    adminNameElements.forEach(element => {
        element.textContent = adminUser.name;
    });
}

// Get employees from localStorage
function getEmployees() {
    return JSON.parse(localStorage.getItem('employees')) || [];
}

// Save employees to localStorage
function saveEmployees(employees) {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Get activities from localStorage
function getActivities() {
    return JSON.parse(localStorage.getItem('activities')) || [];
}

// Save activities to localStorage
function saveActivities(activities) {
    localStorage.setItem('activities', JSON.stringify(activities));
}

// Add activity log
function addActivity(action, employeeName, department) {
    const activities = getActivities();
    
    activities.unshift({
        id: Date.now(),
        action,
        employeeName,
        department,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 20 activities
    if (activities.length > 20) {
        activities.length = 20;
    }
    
    saveActivities(activities);
}

// Get employee initials
function getInitials(firstName, lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Calculate age from date of birth
function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 'N/A';
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

// Calculate tenure from join date
function calculateTenure(joinDate) {
    if (!joinDate) return 'N/A';
    
    const start = new Date(joinDate);
    const today = new Date();
    const months = (today.getFullYear() - start.getFullYear()) * 12 + today.getMonth() - start.getMonth();
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
    return `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
}

// Time ago formatter
function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(timestamp);
}

// Show notification/toast
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                min-width: 300px;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-success i {
                color: #10b981;
                font-size: 20px;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-error i {
                color: #ef4444;
                font-size: 20px;
            }
            
            .notification-info {
                border-left: 4px solid #6366f1;
            }
            
            .notification-info i {
                color: #6366f1;
                font-size: 20px;
            }
            
            .notification span {
                font-size: 14px;
                font-weight: 500;
                color: #1f2937;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Format currency (Indian Rupees)
function formatCurrency(amount) {
    if (!amount && amount !== 0) return '₹0';
    return '₹' + parseFloat(amount).toLocaleString('en-IN');
}

// Generate unique employee ID
function generateEmployeeId(firstName, lastName) {
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `EMP${initials}${randomNum}`;
}

// Get department statistics
function getDepartmentStats() {
    const employees = getEmployees();
    const deptStats = {};
    
    employees.forEach(emp => {
        if (!deptStats[emp.department]) {
            deptStats[emp.department] = {
                count: 0,
                totalSalary: 0,
                employees: []
            };
        }
        deptStats[emp.department].count++;
        deptStats[emp.department].totalSalary += (parseFloat(emp.salary) || 0);
        deptStats[emp.department].employees.push(emp);
    });
    
    return deptStats;
}

// Get department icon
function getDepartmentIcon(department) {
    const icons = {
        'IT': 'laptop-code',
        'HR': 'users-cog',
        'Finance': 'chart-line',
        'Marketing': 'bullhorn',
        'Sales': 'handshake',
        'Operations': 'cogs'
    };
    return icons[department] || 'building';
}

// Initialize demo data if empty
function initializeDemoData() {
    const employees = getEmployees();
    
    if (employees.length === 0) {
        const demoEmployees = [
            {
                id: Date.now() + 1,
                firstName: 'Rajesh',
                lastName: 'Kumar',
                gender: 'Male',
                dateOfBirth: '1990-05-15',
                email: 'rajesh.kumar@company.com',
                phone: '+91 98765 43210',
                address: 'MG Road, Bangalore',
                employeeId: 'EMPRK2341',
                department: 'IT',
                position: 'Senior Developer',
                joinDate: '2020-03-15',
                salary: 85000,
                employeeStatus: 'Active',
                addedDate: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                firstName: 'Priya',
                lastName: 'Sharma',
                gender: 'Female',
                dateOfBirth: '1992-08-22',
                email: 'priya.sharma@company.com',
                phone: '+91 98765 43211',
                address: 'Connaught Place, New Delhi',
                employeeId: 'EMPPS5678',
                department: 'HR',
                position: 'HR Manager',
                joinDate: '2019-06-10',
                salary: 75000,
                employeeStatus: 'Active',
                addedDate: new Date().toISOString()
            },
            {
                id: Date.now() + 3,
                firstName: 'Amit',
                lastName: 'Patel',
                gender: 'Male',
                dateOfBirth: '1988-12-05',
                email: 'amit.patel@company.com',
                phone: '+91 98765 43212',
                address: 'Andheri, Mumbai',
                employeeId: 'EMPAP9012',
                department: 'Finance',
                position: 'Financial Analyst',
                joinDate: '2018-01-20',
                salary: 70000,
                employeeStatus: 'Active',
                addedDate: new Date().toISOString()
            },
            {
                id: Date.now() + 4,
                firstName: 'Sneha',
                lastName: 'Reddy',
                gender: 'Female',
                dateOfBirth: '1995-03-18',
                email: 'sneha.reddy@company.com',
                phone: '+91 98765 43213',
                address: 'Jubilee Hills, Hyderabad',
                employeeId: 'EMPSR3456',
                department: 'Marketing',
                position: 'Marketing Executive',
                joinDate: '2021-09-05',
                salary: 55000,
                employeeStatus: 'Active',
                addedDate: new Date().toISOString()
            },
            {
                id: Date.now() + 5,
                firstName: 'Vikram',
                lastName: 'Singh',
                gender: 'Male',
                dateOfBirth: '1991-07-30',
                email: 'vikram.singh@company.com',
                phone: '+91 98765 43214',
                address: 'Park Street, Kolkata',
                employeeId: 'EMPVS7890',
                department: 'Sales',
                position: 'Sales Manager',
                joinDate: '2019-11-12',
                salary: 80000,
                employeeStatus: 'Active',
                addedDate: new Date().toISOString()
            }
        ];
        
        saveEmployees(demoEmployees);
        
        // Add initial activities
        addActivity('added', 'Rajesh Kumar', 'IT');
        addActivity('added', 'Priya Sharma', 'HR');
        addActivity('added', 'Amit Patel', 'Finance');
    }
}

// Setup logout button event listeners
function setupLogoutButtons() {
    // Find all logout buttons
    const logoutButtons = document.querySelectorAll('.btn-logout, #logoutBtn, [data-logout]');
    
    logoutButtons.forEach(btn => {
        // Remove any existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add new listener
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            logout();
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayAdminName();
    initializeDemoData();
    setupLogoutButtons();
});

// Also setup after a short delay to catch dynamically added buttons
setTimeout(setupLogoutButtons, 100);
