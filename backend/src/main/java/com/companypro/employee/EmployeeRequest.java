package com.companypro.employee;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeRequest(String employeeCode,@NotBlank String name, @NotBlank @Email String email, String phone, @NotBlank String department, String position, @PositiveOrZero BigDecimal salary, LocalDate joiningDate, String status, String address, String emergencyContact, String bloodGroup, String education) {}
