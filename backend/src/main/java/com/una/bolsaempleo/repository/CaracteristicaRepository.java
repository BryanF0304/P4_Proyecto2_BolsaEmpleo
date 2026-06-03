package com.una.bolsaempleo.repository;

import com.una.bolsaempleo.entity.Caracteristica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Integer> {
    List<Caracteristica> findByParentIsNull();   // solo las categorías raíz
}