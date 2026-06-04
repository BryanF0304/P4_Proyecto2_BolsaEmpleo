// AdminService.java
package com.una.bolsaempleo.service;

import com.una.bolsaempleo.dto.EmpresaDTO;
import com.una.bolsaempleo.dto.OferenteDTO;
import com.una.bolsaempleo.entity.Empresa;
import com.una.bolsaempleo.entity.Oferente;
import com.una.bolsaempleo.repository.EmpresaRepository;
import com.una.bolsaempleo.repository.OferenteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AdminService {

    private final EmpresaRepository empresaRepo;
    private final OferenteRepository oferenteRepo;

    public AdminService(EmpresaRepository empresaRepo, OferenteRepository oferenteRepo) {
        this.empresaRepo = empresaRepo;
        this.oferenteRepo = oferenteRepo;
    }

    public List<EmpresaDTO> empresasPendientes() {
        return empresaRepo.findByUsuario_Aprobado(false).stream()
                .map(e -> new EmpresaDTO(e.getId(), e.getNombre(), e.getCorreo(),
                        e.getLocalizacion(), e.getTelefono(), false))
                .toList();
    }

    public List<OferenteDTO> oferentesPendientes() {
        return oferenteRepo.findByUsuario_Aprobado(false).stream()
                .map(o -> new OferenteDTO(o.getId(), o.getIdentificacion(), o.getNombre(),
                        o.getPrimerApellido(), o.getCorreo(), false))
                .toList();
    }

    @Transactional
    public void aprobarEmpresa(Long empresaId) {
        Empresa e = empresaRepo.findById(empresaId)
                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada"));
        e.getUsuario().setAprobado(true);   // al cerrar la transacción se guarda solo
    }

    @Transactional
    public void aprobarOferente(Long oferenteId) {
        Oferente o = oferenteRepo.findById(oferenteId)
                .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado"));
        o.getUsuario().setAprobado(true);
    }
}