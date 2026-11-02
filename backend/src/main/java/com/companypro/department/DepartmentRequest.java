package com.companypro.department;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
public record DepartmentRequest(String departmentCode,@NotBlank String name,String manager,String managerEmail,String managerPhone,BigDecimal budget,String location,String description){}
