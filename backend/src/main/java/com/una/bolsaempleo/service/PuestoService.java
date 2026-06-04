package com.una.bolsaempleo.service;

import com.una.bolsaempleo.dto.CrearPuestoRequest;
import com.una.bolsaempleo.dto.PuestoDTO;
import com.una.bolsaempleo.entity.*;
import com.una.bolsaempleo.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PuestoService {

    private final PuestoRepository puestoRepo;
    private final PuestoCaracteristicaRepository pcRepo;
    private final EmpresaRepository empresaRepo;
    private final CaracteristicaRepository caracteristicaRepo;

    public PuestoService(PuestoRepository puestoRepo, PuestoCaracteristicaRepository pcRepo,
                         EmpresaRepository empresaRepo, CaracteristicaRepository caracteristicaRepo) {
        this.puestoRepo = puestoRepo;
        this.pcRepo = pcRepo;
        this.empresaRepo = empresaRepo;
        this.caracteristicaRepo = caracteristicaRepo;
    }

    // Obtiene la empresa del usuario logueado (sacado del token)
    private Empresa empresaActual() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return empresaRepo.findByUsuario_Username(username)
                .orElseThrow(() -> new IllegalStateException("El usuario logueado no es una empresa"));
    }

    @Transactional
    public Long publicar(CrearPuestoRequest req) {
        Empresa empresa = empresaActual();

        Puesto p = new Puesto();
        p.setEmpresa(empresa);
        p.setDescripcion(req.descripcion());
        p.setSalario(req.salario());
        p.setTipo(req.tipo() == null ? "PUBLICO" : req.tipo());
        p.setActivo(true);
        puestoRepo.save(p);

        // Guardar cada característica requerida con su nivel
        if (req.caracteristicas() != null) {
            for (var cn : req.caracteristicas()) {
                Caracteristica c = caracteristicaRepo.findById(cn.caracteristicaId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Característica no existe: " + cn.caracteristicaId()));
                PuestoCaracteristica pc = new PuestoCaracteristica();
                pc.setPuesto(p);
                pc.setCaracteristica(c);
                pc.setNivel(cn.nivel());
                pcRepo.save(pc);
            }
        }
        return p.getId();
    }

    // Puestos de la empresa logueada (su dashboard)
    @Transactional(readOnly = true)
    public List<PuestoDTO> misPuestos() {
        Empresa empresa = empresaActual();
        return puestoRepo.findByEmpresaId(empresa.getId()).stream()
                .map(this::aDTO)
                .toList();
    }

    @Transactional
    public void desactivar(Long puestoId) {
        Empresa empresa = empresaActual();
        Puesto p = puestoRepo.findById(puestoId)
                .orElseThrow(() -> new IllegalArgumentException("Puesto no encontrado"));
        // Seguridad: solo la dueña puede desactivarlo
        if (!p.getEmpresa().getId().equals(empresa.getId()))
            throw new IllegalStateException("Ese puesto no le pertenece");
        p.setActivo(false);
    }

    // Convierte la entidad (y sus requisitos) al DTO que viaja al frontend
    PuestoDTO aDTO(Puesto p) {
        List<PuestoDTO.RequisitoDTO> reqs = pcRepo.findByPuestoId(p.getId()).stream()
                .map(pc -> new PuestoDTO.RequisitoDTO(
                        pc.getCaracteristica().getId(),
                        pc.getCaracteristica().getNombre(),
                        pc.getNivel()))
                .toList();
        return new PuestoDTO(p.getId(), p.getDescripcion(), p.getSalario(),
                p.getTipo(), p.getActivo(), p.getEmpresa().getNombre(), reqs);
    }
}