
package com.una.bolsaempleo.repository;
import com.una.bolsaempleo.entity.PuestoCaracteristica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PuestoCaracteristicaRepository extends JpaRepository<PuestoCaracteristica, Long> {
    List<PuestoCaracteristica> findByPuestoId(Long puestoId);
}