
package com.una.bolsaempleo.repository;
import com.una.bolsaempleo.entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
public interface EmpresaRepository extends JpaRepository<Empresa, Long> { }