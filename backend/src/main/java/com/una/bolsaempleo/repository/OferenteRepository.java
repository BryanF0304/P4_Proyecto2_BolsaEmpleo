
package com.una.bolsaempleo.repository;
import com.una.bolsaempleo.entity.Oferente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface OferenteRepository extends JpaRepository<Oferente, Long> {
    List<Oferente> findByUsuario_Aprobado(Boolean aprobado);
    Optional<Oferente> findByUsuario_Username(String username);
}