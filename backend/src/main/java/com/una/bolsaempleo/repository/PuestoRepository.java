package com.una.bolsaempleo.repository;

import com.una.bolsaempleo.entity.Puesto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PuestoRepository extends JpaRepository<Puesto, Long> {
    List<Puesto> findTop5ByTipoAndActivoOrderByFechaRegistroDesc(String tipo, Boolean activo);
    List<Puesto> findByEmpresaId(Long empresaId);
    List<Puesto> findByTipoAndActivo(String tipo, Boolean activo);   // para la búsqueda pública
}