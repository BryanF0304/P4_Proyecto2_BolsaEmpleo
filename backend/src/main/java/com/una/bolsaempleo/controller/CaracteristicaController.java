
package com.una.bolsaempleo.controller;

import com.una.bolsaempleo.dto.CaracteristicaDTO;
import com.una.bolsaempleo.dto.CrearCaracteristicaRequest;
import com.una.bolsaempleo.service.CaracteristicaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CaracteristicaController {

    private final CaracteristicaService service;

    public CaracteristicaController(CaracteristicaService service) {
        this.service = service;
    }

    @GetMapping("/caracteristicas")               // público: lo usa la búsqueda y el registro
    public List<CaracteristicaDTO> arbol() {
        return service.arbol();
    }

    @PostMapping("/admin/caracteristicas")        // solo admin (lo restringe SecurityConfig)
    public ResponseEntity<?> crear(@RequestBody CrearCaracteristicaRequest req) {
        try {
            service.crear(req);
            return ResponseEntity.status(201).body("Característica creada");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}