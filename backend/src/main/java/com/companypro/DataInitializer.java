package com.companypro;

import com.companypro.department.Department;
import com.companypro.department.DepartmentRepository;
import com.companypro.employee.Employee;
import com.companypro.employee.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/** Keeps the initial SQL demo records aligned with the legacy module defaults. */
@Configuration
public class DataInitializer {
    private record EmployeeSeed(String code, String name, String email, String phone, String department,
                                String position, int salary, LocalDate joiningDate, String status,
                                String address, String emergencyContact, String bloodGroup, String education) {}
    private record DepartmentSeed(String code, String name, String manager, String managerEmail, String managerPhone,
                                  int budget, String location, String description) {}

    private static final List<EmployeeSeed> EMPLOYEE_SEEDS = List.of(
        new EmployeeSeed("EMP001", "John Doe", "john.doe@company.com", "+91 9876543210", "Engineering", "Senior Developer", 85000, LocalDate.parse("2022-01-15"), "active", "123 Main Street, New Delhi", "+91 9876543211", "O+", "B.Tech Computer Science"),
        new EmployeeSeed("EMP002", "Jane Smith", "jane.smith@company.com", "+91 9876543220", "Marketing", "Marketing Manager", 75000, LocalDate.parse("2022-03-20"), "active", "456 Park Avenue, Mumbai", "+91 9876543221", "A+", "MBA Marketing"),
        new EmployeeSeed("EMP003", "Mike Johnson", "mike.johnson@company.com", "+91 9876543230", "Sales", "Sales Executive", 65000, LocalDate.parse("2022-05-10"), "active", "789 Lake View, Bangalore", "+91 9876543231", "B+", "BBA"),
        new EmployeeSeed("EMP004", "Sarah Williams", "sarah.williams@company.com", "+91 9876543240", "HR", "HR Specialist", 60000, LocalDate.parse("2022-07-01"), "active", "321 Garden Road, Pune", "+91 9876543241", "AB+", "MBA HR"),
        new EmployeeSeed("EMP005", "Robert Brown", "robert.brown@company.com", "+91 9876543250", "Finance", "Accountant", 70000, LocalDate.parse("2021-12-15"), "on-leave", "654 Hill Station, Chennai", "+91 9876543251", "O-", "B.Com, CA"),
        new EmployeeSeed("EMP006", "Emily Davis", "emily.davis@company.com", "+91 9876543260", "Engineering", "Junior Developer", 55000, LocalDate.parse("2023-02-01"), "active", "987 Beach Road, Goa", "+91 9876543261", "A-", "B.Tech IT")
    );

    private static final List<DepartmentSeed> DEPARTMENT_SEEDS = List.of(
        new DepartmentSeed("DEPT001", "Engineering", "John Doe", "john.doe@company.com", "+91 9876543210", 5000000, "Building A, Floor 3", "Software development and technical operations"),
        new DepartmentSeed("DEPT002", "Marketing", "Jane Smith", "jane.smith@company.com", "+91 9876543220", 3000000, "Building B, Floor 2", "Brand management and market strategy"),
        new DepartmentSeed("DEPT003", "Sales", "Mike Johnson", "mike.johnson@company.com", "+91 9876543230", 2500000, "Building A, Floor 1", "Sales operations and customer relations"),
        new DepartmentSeed("DEPT004", "HR", "Sarah Williams", "sarah.williams@company.com", "+91 9876543240", 1500000, "Building B, Floor 1", "Human resources and talent management"),
        new DepartmentSeed("DEPT005", "Finance", "Robert Brown", "robert.brown@company.com", "+91 9876543250", 2000000, "Building A, Floor 2", "Financial planning and accounting")
    );

    @Bean CommandLineRunner seedDatabase(EmployeeRepository employees, DepartmentRepository departments) {
        return args -> {
            migrateEarlierSample(employees, departments);
            for (EmployeeSeed seed : EMPLOYEE_SEEDS) {
                var existing = employees.findByEmployeeCode(seed.code());
                if (existing.isPresent()) {
                    Employee employee = existing.get();
                    // Earlier CompanyPro sample rows used .test emails. Update those known demo rows in place.
                    if (employee.getEmail().endsWith("@companypro.test")) {
                        employee.update(seed.name(), seed.email(), seed.phone(), seed.department(), seed.position(),
                            BigDecimal.valueOf(seed.salary()), seed.joiningDate(), seed.status(), seed.address(),
                            seed.emergencyContact(), seed.bloodGroup(), seed.education());
                        employees.save(employee);
                    }
                } else if (!employees.existsByEmail(seed.email())) {
                    employees.save(new Employee(seed.code(), seed.name(), seed.email(), seed.phone(), seed.department(),
                        seed.position(), BigDecimal.valueOf(seed.salary()), seed.joiningDate(), seed.status(), seed.address(),
                        seed.emergencyContact(), seed.bloodGroup(), seed.education()));
                }
            }
            for (DepartmentSeed seed : DEPARTMENT_SEEDS) {
                var byName = departments.findByNameIgnoreCase(seed.name());
                if (byName.isPresent() && byName.get().getDepartmentCode() == null) {
                    byName.get().update(seed.code(), seed.name(), seed.manager(), seed.managerEmail(), seed.managerPhone(),
                        BigDecimal.valueOf(seed.budget()), seed.location(), seed.description());
                    departments.save(byName.get());
                } else if (byName.isEmpty() && departments.findByDepartmentCode(seed.code()).isEmpty()) {
                    departments.save(new Department(seed.code(), seed.name(), seed.manager(), seed.managerEmail(), seed.managerPhone(),
                        BigDecimal.valueOf(seed.budget()), seed.location(), seed.description()));
                }
            }
        };
    }

    private void migrateEarlierSample(EmployeeRepository employees, DepartmentRepository departments) {
        // Rename only the two records created by the previous version of this starter.
        departments.findByNameIgnoreCase("Engineering").filter(d -> "Priya Sharma".equals(d.getManager()))
            .ifPresent(d -> d.update("DEPT001", "Engineering", "John Doe", "john.doe@company.com", "+91 9876543210",
                BigDecimal.valueOf(5000000), "Building A, Floor 3", "Software development and technical operations"));

        departments.findByNameIgnoreCase("People Operations")
            .filter(d -> "Jordan Lee".equals(d.getManager()) && "Supports hiring and employee experience.".equals(d.getDescription()))
            .ifPresent(d -> {
                if (departments.existsByNameIgnoreCase("Marketing")) {
                    // Remove only this exact placeholder row when the canonical sample already exists.
                    departments.delete(d);
                } else {
                    d.update("DEPT002", "Marketing", "Jane Smith", "jane.smith@company.com", "+91 9876543220",
                        BigDecimal.valueOf(3000000), "Building B, Floor 2", "Brand management and market strategy");
                }
            });
        departments.flush();
    }
}
