// OferenteController.java  (acciones del oferente: rol OFERENTE)
package com.una.bolsaempleo.controller;

import com.una.bolsaempleo.dto.HabilidadRequest;
import com.una.bolsaempleo.service.OferenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/oferente")
public class OferenteController {

    private final OferenteService oferenteService;

    public OferenteController(OferenteService oferenteService) {
        this.oferenteService = oferenteService;
    }

    // Devuelve las habilidades actuales del oferente logueado (para precargar el formulario)
    @GetMapping("/habilidades")
    @PreAuthorize("hasRole('OFERENTE')")
    public ResponseEntity<List<HabilidadRequest.Habilidad>> getMisHabilidades() {
        return ResponseEntity.ok(oferenteService.getMisHabilidades());
    }

    @PutMapping("/habilidades")
    @PreAuthorize("hasRole('OFERENTE')")
    public ResponseEntity<?> actualizarHabilidades(@RequestBody HabilidadRequest req) {
        try {
            oferenteService.actualizarHabilidades(req);
            return ResponseEntity.ok("Habilidades actualizadas");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // La subida de archivo NO es JSON: usa multipart/form-data
    @PostMapping("/curriculo")
    @PreAuthorize("hasRole('OFERENTE')")
    public ResponseEntity<?> subirCurriculo(@RequestParam("archivo") MultipartFile archivo) {
        try {
            oferenteService.subirCurriculo(archivo);
            return ResponseEntity.ok("Currículo subido");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}