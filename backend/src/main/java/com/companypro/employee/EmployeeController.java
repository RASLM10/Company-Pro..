package com.companypro.employee;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeRepository repository;
    public EmployeeController(EmployeeRepository repository){this.repository=repository;}
    @GetMapping List<Employee> all(@RequestParam(required=false) String q){return q==null||q.isBlank()?repository.findAll():repository.findAll().stream().filter(e->(e.getName()+" "+e.getEmail()+" "+e.getDepartment()+" "+e.getEmployeeCode()).toLowerCase().contains(q.toLowerCase())).toList();}
    @GetMapping("/{id}") Employee one(@PathVariable Long id){return repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Employee not found"));}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) Employee create(@Valid @RequestBody EmployeeRequest r){if(repository.existsByEmail(r.email()))throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already exists");String code=r.employeeCode()==null||r.employeeCode().isBlank()?"EMP%03d".formatted(repository.count()+1):r.employeeCode();if(repository.existsByEmployeeCode(code))throw new ResponseStatusException(HttpStatus.CONFLICT,"Employee code already exists");return repository.save(new Employee(code,r.name(),r.email(),r.phone(),r.department(),r.position(),r.salary(),r.joiningDate(),r.status(),r.address(),r.emergencyContact(),r.bloodGroup(),r.education()));}
    @PutMapping("/{id}") Employee update(@PathVariable Long id,@Valid @RequestBody EmployeeRequest r){Employee e=one(id);repository.findByEmail(r.email()).filter(found->!found.getId().equals(id)).ifPresent(found->{throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already exists");});e.update(r.name(),r.email(),r.phone(),r.department(),r.position(),r.salary(),r.joiningDate(),r.status(),r.address(),r.emergencyContact(),r.bloodGroup(),r.education());return repository.save(e);}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) void delete(@PathVariable Long id){repository.delete(one(id));}
}
