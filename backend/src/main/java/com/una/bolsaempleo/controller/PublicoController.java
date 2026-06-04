// PublicoController.java  (sin login: la parte pública del sitio)
package com.una.bolsaempleo.controller;

import com.una.bolsaempleo.dto.PuestoDTO;
import com.una.bolsaempleo.service.PublicoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicoController {

    private final PublicoService publicoService;

    public PublicoController(PublicoService publicoService) {
        this.publicoService = publicoService;
    }

    @GetMapping("/puestos/publicos/recientes")
    public List<PuestoDTO> recientes() {
        return publicoService.recientes();
    }

    // ej: /api/buscar/puestos?caracteristicas=7,12
    @GetMapping("/buscar/puestos")
    public List<PuestoDTO> buscar(@RequestParam(required = false) List<Integer> caracteristicas) {
        return publicoService.buscar(caracteristicas);
    }
}