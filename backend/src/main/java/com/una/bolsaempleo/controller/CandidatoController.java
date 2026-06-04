
package com.una.bolsaempleo.controller;
import com.una.bolsaempleo.dto.CandidatoDTO;
import com.una.bolsaempleo.dto.HabilidadRequest;
import com.una.bolsaempleo.service.BusquedaCandidatoService;
import com.una.bolsaempleo.service.OferenteService;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/candidatos")
public class CandidatoController {

    private final BusquedaCandidatoService busquedaService;
    private final OferenteService oferenteService;

    public CandidatoController(BusquedaCandidatoService busquedaService,
                               OferenteService oferenteService) {
        this.busquedaService = busquedaService;
        this.oferenteService = oferenteService;
    }

    @PostMapping("/buscar")
    @PreAuthorize("hasRole('EMPRESA')")
    public List<CandidatoDTO> buscar(@RequestBody HabilidadRequest req) {
        return busquedaService.buscar(req);
    }

    @GetMapping("/{oferenteId}/curriculo")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Resource> descargarCurriculo(@PathVariable Long oferenteId) {
        Path ruta = oferenteService.rutaCurriculo(oferenteId);
        Resource pdf = new PathResource(ruta);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + ruta.getFileName() + "\"")
                .body(pdf);
    }
}