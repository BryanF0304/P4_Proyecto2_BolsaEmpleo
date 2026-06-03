package com.una.bolsaempleo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PingController {

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    @GetMapping("/me")
    public String me(org.springframework.security.core.Authentication auth) {
        return "Hola " + auth.getName() + ", autoridades: " + auth.getAuthorities();
    }
}

