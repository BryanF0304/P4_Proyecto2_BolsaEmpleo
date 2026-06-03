
package com.una.bolsaempleo.repository;
import com.una.bolsaempleo.entity.OferenteCaracteristica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface OferenteCaracteristicaRepository extends JpaRepository<OferenteCaracteristica, Long> {
    List<OferenteCaracteristica> findByOferenteId(Long oferenteId);
}