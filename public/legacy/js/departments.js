// ==========================================
// DEPARTMENTS.JS - WITH LOCALSTORAGE PERSISTENCE
// ==========================================

// Load employees from localStorage
let employees = JSON.parse(localStorage.getItem('companyEmployees')) || [];

// Initialize departments from localStorage or use default data
let departments = JSON.parse(localStorage.getItem('companyDepartments')) || [
    {
        id: 'DEPT001',
        name: 'Engineering',
        manager: 'John Doe',
        managerEmail: 'john.doe@company.com',
        managerPhone: '+91 9876543210',
        budget: 5000000,
        location: 'Building A, Floor 3',
        description: 'Software development and technical operations'
    },
    {
        id: 'DEPT002',
        name: 'Marketing',
        manager: 'Jane Smith',
        managerEmail: 'jane.smith@company.com',
        managerPhone: '+91 9876543220',
        budget: 3000000,
        location: 'Building B, Floor 2',
        description: 'Brand management and market strategy'
    },
    {
        id: 'DEPT003',
        name: 'Sales',
        manager: 'Mike Johnson',
        managerEmail: 'mike.johnson@company.com',
        managerPhone: '+91 9876543230',
        budget: 2500000,
        location: 'Building A, Floor 1',
        description: 'Sales operations and customer relations'
    },
    {
        id: 'DEPT004',
        name: 'HR',
        manager: 'Sarah Williams',
        managerEmail: 'sarah.williams@company.com',
        managerPhone: '+91 9876543240',
        budget: 1500000,
        location: 'Building B, Floor 1',
        description: 'Human resources and talent management'
    },
    {
        id: 'DEPT005',
        name: 'Finance',
        manager: 'Robert Brown',
        managerEmail: 'robert.brown@company.com',
        managerPhone: '+91 9876543250',
        budget: 2000000,
        location: 'Building A, Floor 2',
        description: 'Financial planning and accounting'
    }
];

// Save departments to localStorage
function saveDepartmentsToLocalStorage() {
    localStorage.setItem('companyDepartments', JSON.stringify(departments));
    console.log('Departments saved to localStorage:', departments.length);
}

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Departments page loaded!');
    if (window.companyProDataSync) await window.companyProDataSync.ready;
    departments = JSON.parse(localStorage.getItem('companyDepartments')) || departments;
    employees = JSON.parse(localStorage.getItem('companyEmployees')) || employees;
    // If no data in localStorage, save default data
    if (!localStorage.getItem('companyDepartments')) {
        saveDepartmentsToLocalStorage();
    }
    // Reload employees from localStorage
    employees = JSON.parse(localStorage.getItem('companyEmployees')) || [];
    loadDepartments();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    const addBtn = document.getElementById('addDepartmentBtn');
    if (addBtn) {
        addBtn.addEventListener('click', openAddDepartmentModal);
    }

    setupModalCloseButtons();

    const addForm = document.getElementById('addDepartmentForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addDepartment();
        });
    }

    const editForm = document.getElementById('editDepartmentForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateDepartment();
        });
    }
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

    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Get Employee Count for Department
function getEmployeeCount(deptName) {
    return employees.filter(emp => emp.department === deptName).length;
}

// Get Employees by Department
function getEmployeesByDepartment(deptName) {
    return employees.filter(emp => emp.department === deptName);
}

// Get Total Salary for Department
function getTotalSalary(deptName) {
    return employees
        .filter(emp => emp.department === deptName)
        .reduce((sum, emp) => sum + emp.salary, 0);
}

// Get Active Employees Count
function getActiveEmployeesCount(deptName) {
    return employees.filter(emp => emp.department === deptName && emp.status === 'active').length;
}

// Load Departments
function loadDepartments() {
    // Reload latest employees data
    employees = JSON.parse(localStorage.getItem('companyEmployees')) || [];
    renderDepartments(departments);
}

// Render Departments with REAL employee data
function renderDepartments(deptList) {
    const container = document.querySelector('.departments-grid');
    if (!container) {
        console.error('Departments grid not found!');
        return;
    }

    if (deptList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-building"></i>
                <p>No departments found</p>
            </div>
        `;
        return;
    }

    container.innerHTML = deptList.map(dept => {
        const employeeCount = getEmployeeCount(dept.name);
        const totalSalary = getTotalSalary(dept.name);
        const activeCount = getActiveEmployeesCount(dept.name);

        return `
            <div class="department-card">
                <div class="dept-header">
                    <h3>${dept.name}</h3>
                    <div class="action-buttons">
                        <button class="icon-btn" onclick="viewDepartmentDetails('${dept.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="icon-btn" onclick="editDepartmentDetails('${dept.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn danger" onclick="deleteDepartmentConfirm('${dept.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div style="margin: 16px 0;">
                    <p style="color: #64748b; margin-bottom: 8px;"><i class="fas fa-user-tie" style="color: #3256B1; margin-right: 8px;"></i><strong>Manager:</strong> ${dept.manager}</p>
                    <p style="color: #64748b; margin-bottom: 8px;"><i class="fas fa-envelope" style="color: #3256B1; margin-right: 8px;"></i>${dept.managerEmail}</p>
                    <p style="color: #64748b; margin-bottom: 8px;"><i class="fas fa-phone" style="color: #3256B1; margin-right: 8px;"></i>${dept.managerPhone}</p>
                    <p style="color: #64748b; margin-bottom: 8px;"><i class="fas fa-map-marker-alt" style="color: #3256B1; margin-right: 8px;"></i>${dept.location}</p>
                    <p style="color: #64748b;"><i class="fas fa-info-circle" style="color: #3256B1; margin-right: 8px;"></i>${dept.description}</p>
                </div>

                <div class="dept-stats">
                    <div class="stat-item">
                        <label>Employees</label>
                        <p style="font-weight: 700; color: #3256B1;">${employeeCount}</p>
                    </div>
                    <div class="stat-item">
                        <label>Active</label>
                        <p style="font-weight: 700; color: #10b981;">${activeCount}</p>
                    </div>
                    <div class="stat-item">
                        <label>Budget</label>
                        <p style="font-weight: 700; color: #3256B1;">₹${(dept.budget / 100000).toFixed(1)}L</p>
                    </div>
                </div>

                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
                    <p style="color: #64748b; font-size: 0.875rem; margin: 0;">
                        <strong>Total Monthly Payroll:</strong> ₹${totalSalary.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>
        `;
    }).join('');

    console.log('Departments rendered with employee data!');
}

// View Department Details
function viewDepartmentDetails(id) {
    console.log('Viewing department:', id);
    const dept = departments.find(d => d.id === id);
    if (!dept) {
        console.error('Department not found!');
        alert('Department not found!');
        return;
    }

    const modal = document.getElementById('viewDepartmentModal');
    if (!modal) {
        console.error('View modal not found!');
        return;
    }

    // Reload employees from localStorage
    employees = JSON.parse(localStorage.getItem('companyEmployees')) || [];

    // Get employees in this department
    const deptEmployees = getEmployeesByDepartment(dept.name);
    const employeeCount = deptEmployees.length;
    const totalSalary = getTotalSalary(dept.name);

    // Populate modal
    document.getElementById('viewDeptId').textContent = dept.id;
    document.getElementById('viewDeptName').textContent = dept.name;
    document.getElementById('viewDeptManager').textContent = dept.manager;
    document.getElementById('viewDeptManagerEmail').textContent = dept.managerEmail;
    document.getElementById('viewDeptManagerPhone').textContent = dept.managerPhone;
    document.getElementById('viewDeptEmployeeCount').textContent = employeeCount;
    document.getElementById('viewDeptLocation').textContent = dept.location;
    document.getElementById('viewDeptBudget').textContent = '₹' + dept.budget.toLocaleString('en-IN');
    document.getElementById('viewDeptDescription').textContent = dept.description;

    // Show employee list
    const employeeListContainer = document.getElementById('viewDeptEmployees');
    if (deptEmployees.length > 0) {
        employeeListContainer.innerHTML = `
            <div class="table-container">
                <table class="employee-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Salary</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${deptEmployees.map(emp => `
                            <tr>
                                <td>${emp.id}</td>
                                <td>
                                    <div class="employee-info">
                                        <div class="employee-avatar">${emp.name.charAt(0)}</div>
                                        <div class="employee-name">${emp.name}</div>
                                    </div>
                                </td>
                                <td>${emp.position}</td>
                                <td>₹${emp.salary.toLocaleString('en-IN')}</td>
                                <td>
                                    <span class="status-badge ${emp.status}">
                                        ${emp.status === 'active' ? 'Active' : emp.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div style="margin-top: 16px; padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <p style="margin: 0; color: #3256B1; font-weight: 600;">
                        Total Monthly Payroll: ₹${totalSalary.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>
        `;
    } else {
        employeeListContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <p>No employees in this department</p>
            </div>
        `;
    }

    modal.style.display = 'block';
    console.log('View modal opened!');
}

// Edit Department
function editDepartmentDetails(id) {
    console.log('Editing department:', id);
    const dept = departments.find(d => d.id === id);
    if (!dept) {
        console.error('Department not found!');
        alert('Department not found!');
        return;
    }

    const modal = document.getElementById('editDepartmentModal');
    if (!modal) {
        console.error('Edit modal not found!');
        return;
    }

    // Populate form
    document.getElementById('editDepartmentId').value = dept.id;
    document.getElementById('editDeptName').value = dept.name;
    document.getElementById('editManager').value = dept.manager;
    document.getElementById('editManagerEmail').value = dept.managerEmail;
    document.getElementById('editManagerPhone').value = dept.managerPhone;
    document.getElementById('editLocation').value = dept.location;
    document.getElementById('editBudget').value = dept.budget;
    document.getElementById('editDescription').value = dept.description;

    modal.style.display = 'block';
    console.log('Edit modal opened!');
}

// Update Department - WITH LOCALSTORAGE
function updateDepartment() {
    console.log('Updating department...');
    const form = document.getElementById('editDepartmentForm');
    if (!form) {
        console.error('Form not found!');
        return;
    }

    const id = document.getElementById('editDepartmentId').value;
    const index = departments.findIndex(d => d.id === id);
    
    if (index === -1) {
        console.error('Department not found!');
        alert('Department not found!');
        return;
    }

    const formData = new FormData(form);
    
    // Check if name changed
    const oldName = departments[index].name;
    const newName = formData.get('name');
    
    departments[index] = {
        ...departments[index],
        name: newName,
        manager: formData.get('manager'),
        managerEmail: formData.get('managerEmail'),
        managerPhone: formData.get('managerPhone'),
        location: formData.get('location'),
        budget: parseFloat(formData.get('budget')),
        description: formData.get('description')
    };

    console.log('Department updated:', departments[index]);

    // If department name changed, update all employees in that department
    if (oldName !== newName) {
        employees = JSON.parse(localStorage.getItem('companyEmployees')) || [];
        employees.forEach(emp => {
            if (emp.department === oldName) {
                emp.department = newName;
            }
        });
        localStorage.setItem('companyEmployees', JSON.stringify(employees));
        console.log('Updated employee departments from', oldName, 'to', newName);
    }

    // SAVE TO LOCALSTORAGE
    saveDepartmentsToLocalStorage();

    document.getElementById('editDepartmentModal').style.display = 'none';
    loadDepartments();
    alert('✅ Department updated successfully and saved!');
}

// Open Add Department Modal
function openAddDepartmentModal() {
    const modal = document.getElementById('addDepartmentModal');
    if (modal) {
        const form = document.getElementById('addDepartmentForm');
        if (form) form.reset();
        modal.style.display = 'block';
    }
}

// Add Department - WITH LOCALSTORAGE
function addDepartment() {
    const form = document.getElementById('addDepartmentForm');
    if (!form) return;

    const formData = new FormData(form);
    
    const newDept = {
        id: generateDepartmentId(),
        name: formData.get('name'),
        manager: formData.get('manager'),
        managerEmail: formData.get('managerEmail'),
        managerPhone: formData.get('managerPhone'),
        budget: parseFloat(formData.get('budget')),
        location: formData.get('location'),
        description: formData.get('description')
    };

    if (!newDept.name || !newDept.manager) {
        alert('Please fill all required fields!');
        return;
    }

    departments.push(newDept);
    
    // SAVE TO LOCALSTORAGE
    saveDepartmentsToLocalStorage();
    
    document.getElementById('addDepartmentModal').style.display = 'none';
    loadDepartments();
    alert('✅ Department added successfully! It will now appear in all dropdowns.');
    form.reset();
}

// Generate Department ID
function generateDepartmentId() {
    const maxId = departments.reduce((max, dept) => {
        const num = parseInt(dept.id.replace('DEPT', ''));
        return num > max ? num : max;
    }, 0);
    
    return 'DEPT' + String(maxId + 1).padStart(3, '0');
}

// Delete Department - FIXED WITH LOCALSTORAGE
function deleteDepartmentConfirm(id) {
    console.log('Delete requested for:', id);
    const dept = departments.find(d => d.id === id);
    if (!dept) return;

    // Reload employees from localStorage
    employees = JSON.parse(localStorage.getItem('companyEmployees')) || [];
    
    const employeeCount = getEmployeeCount(dept.name);
    
    if (employeeCount > 0) {
        alert(`⚠️ Cannot delete ${dept.name}! This department has ${employeeCount} employees. Please reassign them first.`);
        return;
    }

    if (confirm('Are you sure you want to delete this department?')) {
        departments = departments.filter(d => d.id !== id);
        
        // SAVE TO LOCALSTORAGE
        saveDepartmentsToLocalStorage();
        
        loadDepartments();
        alert('✅ Department deleted successfully!');
    }
}

// Export functions to global scope
window.viewDepartmentDetails = viewDepartmentDetails;
window.editDepartmentDetails = editDepartmentDetails;
window.deleteDepartmentConfirm = deleteDepartmentConfirm;

console.log('departments.js loaded successfully with localStorage!');
