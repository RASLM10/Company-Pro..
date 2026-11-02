// Keeps the original localStorage-based screens and the SQL API on one dataset.
(function () {
    const EMPLOYEES_KEY = 'companyEmployees';
    const DEPARTMENTS_KEY = 'companyDepartments';
    const nativeSetItem = Storage.prototype.setItem;
    let initializing = true;
    let syncTimer = null;
    let syncQueue = Promise.resolve();

    function readArray(key) {
        const raw = localStorage.getItem(key);
        if (raw === null) return null;
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : null;
        } catch (_) {
            return null;
        }
    }

    function storeSilently(key, value) {
        nativeSetItem.call(localStorage, key, JSON.stringify(value));
    }

    async function requestJson(url, options) {
        const response = await fetch(url, options);
        if (!response.ok) {
            const detail = await response.text();
            throw new Error(`${options?.method || 'GET'} ${url} failed (${response.status}): ${detail}`);
        }
        return response.status === 204 ? null : response.json();
    }

    function employeePayload(employee) {
        return {
            employeeCode: employee.employeeCode || employee.id || undefined,
            name: employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
            email: employee.email,
            phone: employee.phone || '',
            department: employee.department,
            position: employee.position || '',
            salary: Number(employee.salary) || 0,
            joiningDate: employee.joiningDate || employee.joinDate || null,
            status: employee.status || employee.employeeStatus?.toLowerCase() || 'active',
            address: employee.address || '',
            emergencyContact: employee.emergencyContact || '',
            bloodGroup: employee.bloodGroup || '',
            education: employee.education || ''
        };
    }

    function departmentPayload(department) {
        return {
            departmentCode: department.departmentCode || department.id || undefined,
            name: department.name,
            manager: department.manager || '',
            managerEmail: department.managerEmail || '',
            managerPhone: department.managerPhone || '',
            budget: Number(department.budget) || 0,
            location: department.location || '',
            description: department.description || ''
        };
    }

    function writeRequest(method, payload) {
        return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) };
    }

    async function replaceEmployees(localEmployees) {
        const remote = await requestJson('/api/employees');
        const wantedCodes = new Set();
        for (const local of localEmployees) {
            const payload = employeePayload(local);
            if (!payload.name || !payload.email || !payload.department) continue;
            if (payload.employeeCode) wantedCodes.add(payload.employeeCode);
            const existing = remote.find(item => item.employeeCode === payload.employeeCode || item.email.toLowerCase() === payload.email.toLowerCase());
            await requestJson(existing ? `/api/employees/${existing.id}` : '/api/employees', writeRequest(existing ? 'PUT' : 'POST', payload));
        }
        for (const employee of remote) {
            if (!wantedCodes.has(employee.employeeCode) && !localEmployees.some(item => item.email?.toLowerCase() === employee.email.toLowerCase())) {
                await requestJson(`/api/employees/${employee.id}`, { method: 'DELETE' });
            }
        }
    }

    async function replaceDepartments(localDepartments) {
        const remote = await requestJson('/api/departments');
        const wantedCodes = new Set();
        for (const local of localDepartments) {
            const payload = departmentPayload(local);
            if (!payload.name) continue;
            if (payload.departmentCode) wantedCodes.add(payload.departmentCode);
            const existing = remote.find(item => item.departmentCode === payload.departmentCode || item.name.toLowerCase() === payload.name.toLowerCase());
            await requestJson(existing ? `/api/departments/${existing.id}` : '/api/departments', writeRequest(existing ? 'PUT' : 'POST', payload));
        }
        for (const department of remote) {
            if (!wantedCodes.has(department.departmentCode) && !localDepartments.some(item => item.name?.toLowerCase() === department.name.toLowerCase())) {
                await requestJson(`/api/departments/${department.id}`, { method: 'DELETE' });
            }
        }
    }

    async function syncLocalData() {
        const employees = readArray(EMPLOYEES_KEY);
        const departments = readArray(DEPARTMENTS_KEY);
        if (employees !== null) await replaceEmployees(employees);
        if (departments !== null) await replaceDepartments(departments);
    }

    function syncNow() {
        clearTimeout(syncTimer);
        syncQueue = syncQueue.catch(() => {}).then(syncLocalData);
        return syncQueue;
    }

    async function initialize() {
        try {
            const [remoteEmployees, remoteDepartments] = await Promise.all([
                requestJson('/api/employees'),
                requestJson('/api/departments')
            ]);
            const localEmployees = readArray(EMPLOYEES_KEY);
            const localDepartments = readArray(DEPARTMENTS_KEY);
            // An empty array on a fresh browser profile is equivalent to no
            // local data. Hydrate it from SQL before any sync can interpret it
            // as an intentional request to delete every remote employee.
            if (localEmployees === null || (localEmployees.length === 0 && remoteEmployees.length > 0)) {
                storeSilently(EMPLOYEES_KEY, remoteEmployees.map(employee => ({ ...employee, id: employee.employeeCode })));
            }
            if (localDepartments === null || (localDepartments.length === 0 && remoteDepartments.length > 0)) {
                storeSilently(DEPARTMENTS_KEY, remoteDepartments.map(department => ({ ...department, id: department.departmentCode })));
            }
            await syncNow();
        } catch (error) {
            console.warn('CompanyPro API sync is unavailable; using saved browser data.', error);
        } finally {
            initializing = false;
        }
    }

    Storage.prototype.setItem = function (key, value) {
        nativeSetItem.call(this, key, value);
        if (this === localStorage && !initializing && (key === EMPLOYEES_KEY || key === DEPARTMENTS_KEY)) {
            clearTimeout(syncTimer);
            syncTimer = setTimeout(() => syncNow().catch(error => console.error('Could not sync CompanyPro data:', error)), 150);
        }
    };

    window.companyProDataSync = { ready: initialize(), syncNow };
})();
