package com.companypro.department;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface DepartmentRepository extends JpaRepository<Department,Long>{boolean existsByNameIgnoreCase(String name);boolean existsByDepartmentCode(String code);Optional<Department> findByNameIgnoreCase(String name);Optional<Department> findByDepartmentCode(String code);}
