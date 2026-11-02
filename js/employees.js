// ==========================================
// EMPLOYEES.JS - WITH DYNAMIC DEPARTMENTS
// ==========================================

// Initialize employees from localStorage or use default data
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

// Load departments from localStorage
let departments = JSON.parse(localStorage.getItem('companyDepartments')) || [];

// Save employees to localStorage
function saveToLocalStorage() {
    localStorage.setItem('companyEmployees', JSON.stringify(employees));
    console.log('Employees saved to localStorage:', employees.length);
}

// Load department names
function getDepartmentNames() {
    const depts = JSON.parse(localStorage.getItem('companyDepartments')) || [];
    return depts.map(d => d.name);
}

// Populate department dropdowns
function populateDepartmentDropdowns() {
    const departmentNames = getDepartmentNames();
    
    // Update filter dropdown
    const filterDropdown = document.getElementById('departmentFilter');
    if (filterDropdown) {
        const currentValue = filterDropdown.value;
        filterDropdown.innerHTML = '<option value="all">All Departments</option>';
        departmentNames.forEach(dept => {
            filterDropdown.innerHTML += `<option value="${dept}">${dept}</option>`;
        });
        if (currentValue) filterDropdown.value = currentValue;
    }
    
    // Update add employee form dropdown
    const addFormSelect = document.querySelector('#addEmployeeForm select[name="department"]');
    if (addFormSelect) {
        const currentValue = addFormSelect.value;
        addFormSelect.innerHTML = '<option value="">Select Department</option>';
        departmentNames.forEach(dept => {
            addFormSelect.innerHTML += `<option value="${dept}">${dept}</option>`;
        });
        if (currentValue) addFormSelect.value = currentValue;
    }
    
    // Update edit employee form dropdown
    const editFormSelect = document.getElementById('editDepartment');
    if (editFormSelect) {
        const currentValue = editFormSelect.value;
        editFormSelect.innerHTML = '';
        departmentNames.forEach(dept => {
            editFormSelect.innerHTML += `<option value="${dept}">${dept}</option>`;
        });
        if (currentValue) editFormSelect.value = currentValue;
    }
    
    console.log('Department dropdowns populated with:', departmentNames);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Page loaded, initializing...');
    if (window.companyProDataSync) await window.companyProDataSync.ready;
    employees = JSON.parse(localStorage.getItem('companyEmployees')) || employees;
    departments = JSON.parse(localStorage.getItem('companyDepartments')) || departments;
    // If no data in localStorage, save default data
    if (!localStorage.getItem('companyEmployees')) {
        saveToLocalStorage();
    }
    populateDepartmentDropdowns();
    loadEmployees();
    setupEventListeners();
    setupSearch();
    updateEmployeeCount();
});

// Setup All Event Listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Add Employee Button
    const addBtn = document.getElementById('addEmployeeBtn');
    if (addBtn) {
        console.log('Add button found!');
        addBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add button clicked!');
            openAddEmployeeModal();
        });
    }

    // Department Filter
    const departmentFilter = document.getElementById('departmentFilter');
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterEmployees);
    }
    
    // Status Filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterEmployees);
    }

    // Modal Close Buttons
    setupModalCloseButtons();

    // Add Employee Form Submit
    const addForm = document.getElementById('addEmployeeForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted!');
            addEmployee();
        });
    }

    // Edit Employee Form Submit
    const editForm = document.getElementById('editEmployeeForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateEmployee();
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

    // Click outside modal to close
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Setup Search Functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            searchEmployees(searchTerm);
        });
    }
}

// Search Employees
function searchEmployees(searchTerm) {
    if (!searchTerm) {
        loadEmployees();
        return;
    }

    const filteredEmployees = employees.filter(emp => {
        return emp.name.toLowerCase().includes(searchTerm) ||
               emp.id.toLowerCase().includes(searchTerm) ||
               emp.email.toLowerCase().includes(searchTerm) ||
               emp.department.toLowerCase().includes(searchTerm) ||
               emp.position.toLowerCase().includes(searchTerm) ||
               emp.phone.includes(searchTerm);
    });

    renderEmployees(filteredEmployees);
    updateEmployeeCount();
}

// Load Employees
function loadEmployees() {
    console.log('Loading employees...');
    renderEmployees(employees);
    updateEmployeeCount();
}

// Filter Employees
function filterEmployees() {
    const departmentFilter = document.getElementById('departmentFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    let filteredEmployees = employees;

    if (departmentFilter !== 'all') {
        filteredEmployees = filteredEmployees.filter(emp => emp.department === departmentFilter);
    }

    if (statusFilter !== 'all') {
        filteredEmployees = filteredEmployees.filter(emp => emp.status === statusFilter);
    }

    renderEmployees(filteredEmployees);
    updateEmployeeCount();
}

// Render Employees Table
function renderEmployees(employeeList) {
    const tbody = document.querySelector('.employee-table tbody');
    if (!tbody) {
        console.error('Table body not found!');
        return;
    }

    if (employeeList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px;">
                    <i class="fas fa-users" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 10px; display: block;"></i>
                    <p style="color: #64748b;">No employees found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = employeeList.map(employee => `
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
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td>₹${employee.salary.toLocaleString('en-IN')}</td>
            <td>${formatDate(employee.joiningDate)}</td>
            <td>
                <span class="status-badge ${employee.status}">
                    ${employee.status === 'active' ? 'Active' : employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="icon-btn" onclick="viewEmployeeDetails('${employee.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="icon-btn" onclick="editEmployeeDetails('${employee.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn danger" onclick="deleteEmployeeConfirm('${employee.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update Employee Count
function updateEmployeeCount() {
    const countElement = document.getElementById('employeeCount');
    if (countElement) {
        countElement.textContent = employees.length;
    }
}

// Open Add Employee Modal
function openAddEmployeeModal() {
    console.log('Opening add employee modal...');
    const modal = document.getElementById('addEmployeeModal');
    if (modal) {
        const form = document.getElementById('addEmployeeForm');
        if (form) {
            form.reset();
        }
        // Refresh department dropdown with latest departments
        populateDepartmentDropdowns();
        modal.style.display = 'block';
        console.log('Modal opened!');
    } else {
        console.error('Modal not found!');
    }
}

// Add Employee - WITH LOCALSTORAGE
function addEmployee() {
    console.log('Adding employee...');
    const form = document.getElementById('addEmployeeForm');
    if (!form) {
        console.error('Form not found!');
        return;
    }

    const formData = new FormData(form);
    
    const newEmployee = {
        id: generateEmployeeId(),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        department: formData.get('department'),
        position: formData.get('position'),
        salary: parseFloat(formData.get('salary')),
        joiningDate: formData.get('joiningDate'),
        status: 'active',
        address: formData.get('address') || 'Not provided',
        emergencyContact: formData.get('emergencyContact') || 'Not provided',
        bloodGroup: formData.get('bloodGroup') || 'Not provided',
        education: formData.get('education') || 'Not provided'
    };

    // Validate
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department) {
        alert('Please fill all required fields!');
        return;
    }

    // Add to array
    employees.push(newEmployee);
    console.log('Employee added:', newEmployee);

    // SAVE TO LOCALSTORAGE
    saveToLocalStorage();

    // Close modal
    document.getElementById('addEmployeeModal').style.display = 'none';

    // Reload table and filters
    populateDepartmentDropdowns();
    loadEmployees();

    // Success message
    alert('✅ Employee added successfully and saved!');
    
    // Reset form
    form.reset();
}

// Generate Employee ID
function generateEmployeeId() {
    const maxId = employees.reduce((max, emp) => {
        const num = parseInt(emp.id.replace('EMP', ''));
        return num > max ? num : max;
    }, 0);
    
    return 'EMP' + String(maxId + 1).padStart(3, '0');
}

// View Employee Details
function viewEmployeeDetails(id) {
    console.log('Viewing employee:', id);
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        console.error('Employee not found!');
        return;
    }

    const modal = document.getElementById('viewEmployeeModal');
    if (!modal) {
        console.error('View modal not found!');
        return;
    }

    // Populate modal
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
    console.log('View modal opened!');
}

// Edit Employee
function editEmployeeDetails(id) {
    console.log('Editing employee:', id);
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        console.error('Employee not found!');
        return;
    }

    const modal = document.getElementById('editEmployeeModal');
    if (!modal) {
        console.error('Edit modal not found!');
        return;
    }

    // Refresh department dropdown
    populateDepartmentDropdowns();

    // Populate form
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
    console.log('Edit modal opened!');
}

// Update Employee - WITH LOCALSTORAGE
function updateEmployee() {
    const form = document.getElementById('editEmployeeForm');
    if (!form) return;

    const id = document.getElementById('editEmployeeId').value;
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index === -1) return;

    const formData = new FormData(form);
    
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

    // SAVE TO LOCALSTORAGE
    saveToLocalStorage();

    document.getElementById('editEmployeeModal').style.display = 'none';
    loadEmployees();
    alert('✅ Employee updated successfully and saved!');
}

// Delete Employee - FIXED WITH LOCALSTORAGE
function deleteEmployeeConfirm(id) {
    console.log('Delete requested for:', id);
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== id);
        
        // SAVE TO LOCALSTORAGE
        saveToLocalStorage();
        
        loadEmployees();
        alert('✅ Employee deleted successfully!');
    }
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Export functions to global scope
window.viewEmployeeDetails = viewEmployeeDetails;
window.editEmployeeDetails = editEmployeeDetails;
window.deleteEmployeeConfirm = deleteEmployeeConfirm;

console.log('employees.js loaded successfully with dynamic departments!');


