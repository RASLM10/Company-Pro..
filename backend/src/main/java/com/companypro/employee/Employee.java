package com.companypro.employee;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name="employees", uniqueConstraints={@UniqueConstraint(columnNames="email"), @UniqueConstraint(columnNames="employee_code")})
public class Employee {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="employee_code", nullable=false, unique=true) private String employeeCode;
    @Column(nullable=false) private String name;
    @Column(nullable=false, unique=true) private String email;
    private String phone;
    @Column(nullable=false) private String department;
    private String position;
    @Column(precision=12, scale=2) private BigDecimal salary;
    private LocalDate joiningDate;
    @Column(nullable=false) private String status = "active";
    private String address;
    private String emergencyContact;
    private String bloodGroup;
    private String education;

    protected Employee() {}
    public Employee(String employeeCode, String name, String email, String phone, String department, String position, BigDecimal salary, LocalDate joiningDate, String status, String address, String emergencyContact, String bloodGroup, String education) {
        this.employeeCode=employeeCode; this.name=name; this.email=email; this.phone=phone; this.department=department; this.position=position; this.salary=salary; this.joiningDate=joiningDate; this.status=status == null ? "active" : status; this.address=address; this.emergencyContact=emergencyContact; this.bloodGroup=bloodGroup; this.education=education;
    }
    public Long getId(){return id;} public String getEmployeeCode(){return employeeCode;} public String getName(){return name;} public String getEmail(){return email;} public String getPhone(){return phone;} public String getDepartment(){return department;} public String getPosition(){return position;} public BigDecimal getSalary(){return salary;} public LocalDate getJoiningDate(){return joiningDate;} public String getStatus(){return status;} public String getAddress(){return address;} public String getEmergencyContact(){return emergencyContact;} public String getBloodGroup(){return bloodGroup;} public String getEducation(){return education;}
    public void update(String name,String email,String phone,String department,String position,BigDecimal salary,LocalDate joiningDate,String status,String address,String emergencyContact,String bloodGroup,String education){this.name=name;this.email=email;this.phone=phone;this.department=department;this.position=position;this.salary=salary;this.joiningDate=joiningDate;this.status=status;this.address=address;if(emergencyContact!=null)this.emergencyContact=emergencyContact;if(bloodGroup!=null)this.bloodGroup=bloodGroup;if(education!=null)this.education=education;}
}
