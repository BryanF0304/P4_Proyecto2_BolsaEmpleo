// CaracteristicaService.java
package com.una.bolsaempleo.service;

import com.una.bolsaempleo.dto.CaracteristicaDTO;
import com.una.bolsaempleo.dto.CrearCaracteristicaRequest;
import com.una.bolsaempleo.entity.Caracteristica;
import com.una.bolsaempleo.repository.CaracteristicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CaracteristicaService {

    private final CaracteristicaRepository repo;

    public CaracteristicaService(CaracteristicaRepository repo) {
        this.repo = repo;
    }

    // Carga todo y arma el árbol en memoria (evita problemas de carga perezosa)
    @Transactional(readOnly = true)
    public List<CaracteristicaDTO> arbol() {
        List<Caracteristica> todas = repo.findAll();
        Map<Integer, List<Caracteristica>> porPadre = todas.stream()
                .filter(c -> c.getParent() != null)
                .collect(Collectors.groupingBy(c -> c.getParent().getId()));

        return todas.stream()
                .filter(c -> c.getParent() == null)        // raíces
                .map(c -> construir(c, porPadre))
                .toList();
    }

    private CaracteristicaDTO construir(Caracteristica c, Map<Integer, List<Caracteristica>> porPadre) {
        List<CaracteristicaDTO> hijos = porPadre.getOrDefault(c.getId(), List.of()).stream()
                .map(h -> construir(h, porPadre))
                .toList();
        return new CaracteristicaDTO(c.getId(), c.getNombre(), hijos);
    }

    @Transactional
    public void crear(CrearCaracteristicaRequest req) {
        Caracteristica c = new Caracteristica();
        c.setNombre(req.nombre());
        if (req.parentId() != null) {
            Caracteristica padre = repo.findById(req.parentId())
                    .orElseThrow(() -> new IllegalArgumentException("La categoría padre no existe"));
            c.setParent(padre);
        }
        repo.save(c);
    }
}