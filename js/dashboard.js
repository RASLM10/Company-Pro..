/// ==========================================
// DASHBOARD.JS - WITH DYNAMIC DEPARTMENTS
// ==========================================

// Load employees from localStorage or use default data
let employees = JSON.parse(localStorage.getItem('companyEmployees')) || [
    {
        id: 'EMP001',
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '+91 9876543210',
        department: 'Engineering',
        position: 'Senior Developer',
        salary: 85000,
        joiningDate: '2022-01-15',
        status: 'active',
        address: '123 Main Street, New Delhi',
        emergencyContact: '+91 9876543211',
        bloodGroup: 'O+',
        education: 'B.Tech Computer Science'
    },
    {
        id: 'EMP002',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        phone: '+91 9876543220',
        department: 'Marketing',
        position: 'Marketing Manager',
        salary: 75000,
        joiningDate: '2022-03-20',
        status: 'active',
        address: '456 Park Avenue, Mumbai',
        emergencyContact: '+91 9876543221',
        bloodGroup: 'A+',
        education: 'MBA Marketing'
    },
    {
        id: 'EMP003',
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        phone: '+91 9876543230',
        department: 'Sales',
        position: 'Sales Executive',
        salary: 65000,
        joiningDate: '2022-05-10',
        status: 'active',
        address: '789 Lake View, Bangalore',
        emergencyContact: '+91 9876543231',
        bloodGroup: 'B+',
        education: 'BBA'
    },
    {
        id: 'EMP004',
        name: 'Sarah Williams',
        email: 'sarah.williams@company.com',
        phone: '+91 9876543240',
        department: 'HR',
        position: 'HR Specialist',
        salary: 60000,
        joiningDate: '2022-07-01',
        status: 'active',
        address: '321 Garden Road, Pune',
        emergencyContact: '+91 9876543241',
        bloodGroup: 'AB+',
        education: 'MBA HR'
    },
    {
        id: 'EMP005',
        name: 'Robert Brown',
        email: 'robert.brown@company.com',
        phone: '+91 9876543250',
        department: 'Finance',
        position: 'Accountant',
        salary: 70000,
        joiningDate: '2021-12-15',
        status: 'on-leave',
        address: '654 Hill Station, Chennai',
        emergencyContact: '+91 9876543251',
        bloodGroup: 'O-',
        education: 'B.Com, CA'
    },
    {
        id: 'EMP006',
        name: 'Emily Davis',
        email: 'emily.davis@company.com',
        phone: '+91 9876543260',
        department: 'Engineering',
        position: 'Junior Developer',
        salary: 55000,
        joiningDate: '2023-02-01',
        status: 'active',
        address: '987 Beach Road, Goa',
        emergencyContact: '+91 9876543261',
        bloodGroup: 'A-',
        education: 'B.Tech IT'
    }
];

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('companyEmployees', JSON.stringify(employees));
    console.log('Dashboard - Employees saved to localStorage');
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Dashboard loaded!');
    if (window.companyProDataSync) await window.companyProDataSync.ready;
    employees = JSON.parse(localStorage.getItem('companyEmployees')) || employees;
    // If no data in localStorage, save default data
    if (!localStorage.getItem('companyEmployees')) {
        saveToLocalStorage();
    }
    calculateAndDisplayStats();
    loadRecentEmployees();
    loadDepartmentOverview();
    setupModalCloseButtons();
    setupEditForm();
});

// Calculate and Display Real Statistics
function calculateAndDisplayStats() {
    // Reload latest data
    employees = JSON.parse(localStorage.getItem('companyEmployees')) || [];
    
    // Total Employees
    const totalEmployees = employees.length;
    document.getElementById('totalEmployees').textContent = totalEmployees;

    // Total Departments - from localStorage
    const departmentsData = JSON.parse(localStorage.getItem('companyDepartments')) || [];
    document.getElementById('totalDepartments').textContent = departmentsData.length;

    // Present Today (Active employees)
    const presentToday = employees.filter(emp => emp.status === 'active').length;
    document.getElementById('presentToday').textContent = presentToday;

    // On Leave
    const onLeave = employees.filter(emp => emp.status === 'on-leave').length;
    document.getElementById('onLeave').textContent = onLeave;

    // Calculate Attendance Rate
    const attendanceRate = totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(1) : 0;
    document.getElementById('attendanceRate').innerHTML = `
        <i class="fas fa-arrow-up"></i>
        <span>${attendanceRate}% attendance</span>
    `;

    // Calculate Leave Percentage
    const leavePercentage = totalEmployees > 0 ? ((onLeave / totalEmployees) * 100).toFixed(1) : 0;
    document.getElementById('leavePercentage').innerHTML = `
        <i class="fas fa-minus"></i>
        <span>${leavePercentage}% on leave</span>
    `;

    console.log('Statistics calculated:', {
        totalEmployees,
        totalDepartments: departmentsData.length,
        presentToday,
        onLeave,
        attendanceRate,
        leavePercentage
    });
}

// Load Department Overview with REAL employee counts
function loadDepartmentOverview() {
    // Reload latest data
    employees = JSON.parse(localStorage.getItem('companyEmployees')) || [];
    const departmentsData = JSON.parse(localStorage.getItem('companyDepartments')) || [];
    
    const container = document.getElementById('departmentOverview');
    if (!container) {
        console.error('Department overview container not found!');
        return;
    }

    const departmentIcons = {
        'Engineering': 'fa-code',
        'Marketing': 'fa-bullhorn',
        'Sales': 'fa-chart-line',
        'HR': 'fa-users',
        'Finance': 'fa-dollar-sign'
    };

    // Calculate employee count for each department
    const departmentStats = departmentsData.map(dept => {
        const count = employees.filter(emp => emp.department === dept.name).length;
        return {
            name: dept.name,
            count: count,
            icon: departmentIcons[dept.name] || 'fa-building'
        };
    }).filter(dept => dept.count > 0); // Only show departments with employees

    if (departmentStats.length === 0) {
        container.innerHTML = '<p style="color: #64748b; text-align: center;">No department data available</p>';
        return;
    }

    container.innerHTML = departmentStats.map(dept => `
        <div class="dept-stat">
            <div class="dept-info">
                <div class="dept-icon">
                    <i class="fas ${dept.icon}"></i>
                </div>
                <div>
                    <div class="dept-name">${dept.name}</div>
                    <div class="dept-count">${dept.count} employee${dept.count !== 1 ? 's' : ''}</div>
                </div>
            </div>
            <div class="dept-number">${dept.count}</div>
        </div>
    `).join('');

    console.log('Department overview loaded with real counts:', departmentStats);
}

// Setup Modal Close Buttons
function setupModalCloseButtons() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    });

    // Click outside modal to close
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Setup Edit Form
function setupEditForm() {
    const editForm = document.getElementById('editEmployeeForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateEmployeeFromDashboard();
        });
    }
}

// Load Recent Employees
function loadRecentEmployees() {
    // Reload latest data
    employees = JSON.parse(localStorage.getItem('companyEmployees')) || [];
    
    const tbody = document.getElementById('recentEmployeesTable');
    if (!tbody) {
        console.error('Recent employees table not found!');
        return;
    }

    // Show last 5 employees
    const recentEmployees = employees.slice(-5).reverse();

    tbody.innerHTML = recentEmployees.map(employee => `
        <tr>
            <td>
                <div class="employee-info">
                    <div class="employee-avatar">${employee.name.charAt(0)}</div>
                    <div>
                        <div class="employee-name">${employee.name}</div>
                        <div class="employee-id-badge">${employee.id}</div>
                    </div>
                </div>
            </td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td>
                <span class="status-badge ${employee.status}">
                    ${employee.status === 'active' ? 'Active' : employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="icon-btn" onclick="viewEmployeeFromDashboard('${employee.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="icon-btn" onclick="editEmployeeFromDashboard('${employee.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    console.log('Recent employees loaded!');
}

// View Employee from Dashboard
function viewEmployeeFromDashboard(id) {
    console.log('Viewing employee from dashboard:', id);
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        console.error('Employee not found!');
        alert('Employee not found!');
        return;
    }

    const modal = document.getElementById('viewEmployeeModal');
    if (!modal) {
        console.error('View modal not found!');
        return;
    }

    // Populate modal with ALL details
    document.getElementById('viewEmployeeId').textContent = employee.id;
    document.getElementById('viewEmployeeName').textContent = employee.name;
    document.getElementById('viewEmployeeEmail').textContent = employee.email;
    document.getElementById('viewEmployeePhone').textContent = employee.phone;
    document.getElementById('viewEmployeeDepartment').textContent = employee.department;
    document.getElementById('viewEmployeePosition').textContent = employee.position;
    document.getElementById('viewEmployeeSalary').textContent = '₹' + employee.salary.toLocaleString('en-IN');
    document.getElementById('viewEmployeeJoining').textContent = formatDate(employee.joiningDate);
    document.getElementById('viewEmployeeStatus').innerHTML = `<span class="status-badge ${employee.status}">${employee.status === 'active' ? 'Active' : employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}</span>`;
    document.getElementById('viewEmployeeAddress').textContent = employee.address;
    document.getElementById('viewEmployeeEmergency').textContent = employee.emergencyContact;
    document.getElementById('viewEmployeeBlood').textContent = employee.bloodGroup;
    document.getElementById('viewEmployeeEducation').textContent = employee.education;

    modal.style.display = 'block';
    console.log('View modal opened successfully!');
}

// Edit Employee from Dashboard
function editEmployeeFromDashboard(id) {
    console.log('Editing employee from dashboard:', id);
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        console.error('Employee not found!');
        alert('Employee not found!');
        return;
    }

    const modal = document.getElementById('editEmployeeModal');
    if (!modal) {
        console.error('Edit modal not found!');
        return;
    }

    // Populate department dropdown dynamically
    const departmentsData = JSON.parse(localStorage.getItem('companyDepartments')) || [];
    const editDepartmentSelect = document.getElementById('editDepartment');
    if (editDepartmentSelect) {
        editDepartmentSelect.innerHTML = '';
        departmentsData.forEach(dept => {
            editDepartmentSelect.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
        });
    }

    // Populate form with employee data
    document.getElementById('editEmployeeId').value = employee.id;
    document.getElementById('editName').value = employee.name;
    document.getElementById('editEmail').value = employee.email;
    document.getElementById('editPhone').value = employee.phone;
    document.getElementById('editDepartment').value = employee.department;
    document.getElementById('editPosition').value = employee.position;
    document.getElementById('editSalary').value = employee.salary;
    document.getElementById('editJoiningDate').value = employee.joiningDate;
    document.getElementById('editStatus').value = employee.status;
    document.getElementById('editAddress').value = employee.address;
    document.getElementById('editEmergencyContact').value = employee.emergencyContact;
    document.getElementById('editBloodGroup').value = employee.bloodGroup;
    document.getElementById('editEducation').value = employee.education;

    modal.style.display = 'block';
    console.log('Edit modal opened successfully!');
}

// Update Employee from Dashboard - WITH LOCALSTORAGE
function updateEmployeeFromDashboard() {
    console.log('Updating employee from dashboard...');
    const form = document.getElementById('editEmployeeForm');
    if (!form) {
        console.error('Edit form not found!');
        return;
    }

    const id = document.getElementById('editEmployeeId').value;
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index === -1) {
        console.error('Employee not found in array!');
        alert('Employee not found!');
        return;
    }

    const formData = new FormData(form);
    
    // Update employee data
    employees[index] = {
        ...employees[index],
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        department: formData.get('department'),
        position: formData.get('position'),
        salary: parseFloat(formData.get('salary')),
        joiningDate: formData.get('joiningDate'),
        status: formData.get('status'),
        address: formData.get('address'),
        emergencyContact: formData.get('emergencyContact'),
        bloodGroup: formData.get('bloodGroup'),
        education: formData.get('education')
    };

    console.log('Employee updated:', employees[index]);

    // SAVE TO LOCALSTORAGE
    saveToLocalStorage();

    // Close modal
    document.getElementById('editEmployeeModal').style.display = 'none';
    
    // Reload all data
    calculateAndDisplayStats();
    loadRecentEmployees();
    loadDepartmentOverview();
    
    // Success message
    alert('✅ Employee updated successfully and saved!');
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Export functions to global scope
window.viewEmployeeFromDashboard = viewEmployeeFromDashboard;
window.editEmployeeFromDashboard = editEmployeeFromDashboard;

console.log('dashboard.js loaded successfully with dynamic departments!');
