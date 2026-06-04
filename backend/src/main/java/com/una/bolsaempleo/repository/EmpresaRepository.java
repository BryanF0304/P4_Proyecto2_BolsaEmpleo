
package com.una.bolsaempleo.repository;
import com.una.bolsaempleo.entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    List<Empresa> findByUsuario_Aprobado(Boolean aprobado);
    Optional<Empresa> findByUsuario_Username(String username);
}