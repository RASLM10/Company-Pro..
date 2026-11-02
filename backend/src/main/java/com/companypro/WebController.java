package com.companypro;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    @GetMapping({"/", "/employees"})
    public String app() {
        return "forward:/index.html";
    }
}
