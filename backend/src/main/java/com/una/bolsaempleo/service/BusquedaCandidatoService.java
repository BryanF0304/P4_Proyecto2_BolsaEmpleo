package com.una.bolsaempleo.service;

import com.una.bolsaempleo.dto.CandidatoDTO;
import com.una.bolsaempleo.dto.HabilidadRequest;
import com.una.bolsaempleo.entity.Oferente;
import com.una.bolsaempleo.entity.OferenteCaracteristica;
import com.una.bolsaempleo.repository.OferenteCaracteristicaRepository;
import com.una.bolsaempleo.repository.OferenteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BusquedaCandidatoService {

    private final OferenteRepository oferenteRepo;
    private final OferenteCaracteristicaRepository ocRepo;

    public BusquedaCandidatoService(OferenteRepository oferenteRepo,
                                    OferenteCaracteristicaRepository ocRepo) {
        this.oferenteRepo = oferenteRepo;
        this.ocRepo = ocRepo;
    }

    // Devuelve los oferentes (aprobados) que cumplen TODOS los requisitos pedidos,
    // con su nivel >= al nivel solicitado para cada característica.
    @Transactional(readOnly = true)
    public List<CandidatoDTO> buscar(HabilidadRequest req) {
        List<Oferente> aprobados = oferenteRepo.findByUsuario_Aprobado(true);
        var requisitos = req.habilidades();

        return aprobados.stream()
                .filter(o -> {
                    List<OferenteCaracteristica> habilidades = ocRepo.findByOferenteId(o.getId());
                    // cumple si, para cada requisito, tiene esa característica con nivel suficiente
                    return requisitos.stream().allMatch(rq ->
                            habilidades.stream().anyMatch(h ->
                                    h.getCaracteristica().getId().equals(rq.caracteristicaId())
                                            && h.getNivel() >= rq.nivel()));
                })
                .map(this::aDTO)
                .toList();
    }

    private CandidatoDTO aDTO(Oferente o) {
        List<CandidatoDTO.HabilidadDTO> habs = ocRepo.findByOferenteId(o.getId()).stream()
                .map(h -> new CandidatoDTO.HabilidadDTO(
                        h.getCaracteristica().getNombre(), h.getNivel()))
                .toList();
        return new CandidatoDTO(o.getId(), o.getNombre(), o.getPrimerApellido(),
                o.getCorreo(), o.getCurriculoPdf() != null, habs);
    }
}