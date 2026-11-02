package com.companypro.department;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/departments")
public class DepartmentController {
 private final DepartmentRepository repository;
 public DepartmentController(DepartmentRepository repository){this.repository=repository;}
 @GetMapping List<Department> all(){return repository.findAll();}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) Department create(@Valid @RequestBody DepartmentRequest r){if(repository.existsByNameIgnoreCase(r.name()))throw new ResponseStatusException(HttpStatus.CONFLICT,"Department already exists");String code=r.departmentCode()==null||r.departmentCode().isBlank()?"DEPT%03d".formatted(repository.count()+1):r.departmentCode();if(repository.existsByDepartmentCode(code))throw new ResponseStatusException(HttpStatus.CONFLICT,"Department code already exists");return repository.save(new Department(code,r.name(),r.manager(),r.managerEmail(),r.managerPhone(),r.budget(),r.location(),r.description()));}
 @PutMapping("/{id}") Department update(@PathVariable Long id,@Valid @RequestBody DepartmentRequest r){Department d=repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Department not found"));repository.findByNameIgnoreCase(r.name()).filter(found->!found.getId().equals(id)).ifPresent(found->{throw new ResponseStatusException(HttpStatus.CONFLICT,"Department already exists");});if(r.departmentCode()!=null)repository.findByDepartmentCode(r.departmentCode()).filter(found->!found.getId().equals(id)).ifPresent(found->{throw new ResponseStatusException(HttpStatus.CONFLICT,"Department code already exists");});d.update(r.departmentCode(),r.name(),r.manager(),r.managerEmail(),r.managerPhone(),r.budget(),r.location(),r.description());return repository.save(d);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) void delete(@PathVariable Long id){if(!repository.existsById(id))throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Department not found");repository.deleteById(id);}
}
