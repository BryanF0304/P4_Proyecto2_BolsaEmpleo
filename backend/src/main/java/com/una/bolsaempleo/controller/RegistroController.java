
package com.una.bolsaempleo.controller;

import com.una.bolsaempleo.dto.RegistroEmpresaRequest;
import com.una.bolsaempleo.dto.RegistroOferenteRequest;
import com.una.bolsaempleo.service.RegistroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registro")
public class RegistroController {

    private final RegistroService registroService;

    public RegistroController(RegistroService registroService) {
        this.registroService = registroService;
    }

    @PostMapping("/empresa")
    public ResponseEntity<?> registrarEmpresa(@RequestBody RegistroEmpresaRequest req) {
        try {
            registroService.registrarEmpresa(req);
            return ResponseEntity.status(201).body("Empresa registrada. Pendiente de aprobación.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/oferente")
    public ResponseEntity<?> registrarOferente(@RequestBody RegistroOferenteRequest req) {
        try {
            registroService.registrarOferente(req);
            return ResponseEntity.status(201).body("Oferente registrado. Pendiente de aprobación.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}