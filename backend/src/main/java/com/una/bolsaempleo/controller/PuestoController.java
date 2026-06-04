
package com.una.bolsaempleo.controller;

import com.una.bolsaempleo.dto.CrearPuestoRequest;
import com.una.bolsaempleo.dto.PuestoDTO;
import com.una.bolsaempleo.service.PuestoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/puestos")
public class PuestoController {

    private final PuestoService puestoService;

    public PuestoController(PuestoService puestoService) {
        this.puestoService = puestoService;
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<?> publicar(@RequestBody CrearPuestoRequest req) {
        try {
            Long id = puestoService.publicar(req);
            return ResponseEntity.status(201).body("Puesto publicado con id " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/mios")
    @PreAuthorize("hasRole('EMPRESA')")
    public List<PuestoDTO> misPuestos() {
        return puestoService.misPuestos();
    }

    @PutMapping("/{id}/desactivar")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<?> desactivar(@PathVariable Long id) {
        try {
            puestoService.desactivar(id);
            return ResponseEntity.ok("Puesto desactivado");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/disponibles")
    @PreAuthorize("hasRole('OFERENTE')")
    public List<PuestoDTO> disponibles() {
        return puestoService.disponiblesParaOferente();
    }
}