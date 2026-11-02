package com.companypro;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import com.companypro.employee.EmployeeRepository;
import com.companypro.department.DepartmentRepository;

@RestController
public class HealthController {
    private final EmployeeRepository employees;
    private final DepartmentRepository departments;

    public HealthController(EmployeeRepository employees, DepartmentRepository departments) {
        this.employees = employees;
        this.departments = departments;
    }

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "companypro-api");
    }

    @GetMapping("/api/public/summary")
    public Map<String, Long> summary() {
        return Map.of("employees", employees.count(), "departments", departments.count());
    }
}
