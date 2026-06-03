package com.una.bolsaempleo.repository;

import com.una.bolsaempleo.entity.Puesto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PuestoRepository extends JpaRepository<Puesto, Long> {
    // "Top 5, tipo PUBLICO, activo true, ordenados por fecha desc" — todo desde el nombre
    List<Puesto> findTop5ByTipoAndActivoOrderByFechaRegistroDesc(String tipo, Boolean activo);

    List<Puesto> findByEmpresaId(Long empresaId);   // puestos de una empresa (su dashboard)
}