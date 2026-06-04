package com.una.bolsaempleo.service;

import com.una.bolsaempleo.dto.PuestoDTO;
import com.una.bolsaempleo.entity.Puesto;
import com.una.bolsaempleo.repository.PuestoCaracteristicaRepository;
import com.una.bolsaempleo.repository.PuestoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PublicoService {

    private final PuestoRepository puestoRepo;
    private final PuestoCaracteristicaRepository pcRepo;
    private final PuestoService puestoService;   // reutilizamos su conversor aDTO

    public PublicoService(PuestoRepository puestoRepo, PuestoCaracteristicaRepository pcRepo,
                          PuestoService puestoService) {
        this.puestoRepo = puestoRepo;
        this.pcRepo = pcRepo;
        this.puestoService = puestoService;
    }

    // Los 5 puestos públicos más recientes (página de inicio)
    @Transactional(readOnly = true)
    public List<PuestoDTO> recientes() {
        return puestoRepo.findTop5ByTipoAndActivoOrderByFechaRegistroDesc("PUBLICO", true).stream()
                .map(puestoService::aDTO)
                .toList();
    }

    // Búsqueda pública: puestos que requieran TODAS las características indicadas
    @Transactional(readOnly = true)
    public List<PuestoDTO> buscar(List<Integer> caracteristicaIds) {
        List<Puesto> publicos = puestoRepo.findByTipoAndActivo("PUBLICO", true);

        if (caracteristicaIds == null || caracteristicaIds.isEmpty()) {
            return publicos.stream().map(puestoService::aDTO).toList();
        }

        return publicos.stream()
                .filter(p -> {
                    List<Integer> reqIds = pcRepo.findByPuestoId(p.getId()).stream()
                            .map(pc -> pc.getCaracteristica().getId())
                            .toList();
                    // el puesto coincide si contiene todas las características buscadas
                    return reqIds.containsAll(caracteristicaIds);
                })
                .map(puestoService::aDTO)
                .toList();
    }
}