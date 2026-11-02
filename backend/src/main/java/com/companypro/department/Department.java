package com.companypro.department;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity @Table(name="departments")
public class Department {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(unique=true) private String departmentCode;
    @Column(nullable=false, unique=true) private String name;
    private String manager;
    private String managerEmail;
    private String managerPhone;
    private BigDecimal budget;
    private String location;
    private String description;
    protected Department(){}
    public Department(String departmentCode,String name,String manager,String managerEmail,String managerPhone,BigDecimal budget,String location,String description){this.departmentCode=departmentCode;this.name=name;this.manager=manager;this.managerEmail=managerEmail;this.managerPhone=managerPhone;this.budget=budget;this.location=location;this.description=description;}
    public Long getId(){return id;} public String getDepartmentCode(){return departmentCode;} public String getName(){return name;} public String getManager(){return manager;} public String getManagerEmail(){return managerEmail;} public String getManagerPhone(){return managerPhone;} public BigDecimal getBudget(){return budget;} public String getLocation(){return location;} public String getDescription(){return description;}
    public void update(String departmentCode,String name,String manager,String managerEmail,String managerPhone,BigDecimal budget,String location,String description){if(departmentCode!=null)this.departmentCode=departmentCode;this.name=name;this.manager=manager;this.managerEmail=managerEmail;this.managerPhone=managerPhone;this.budget=budget;this.location=location;this.description=description;}
}
