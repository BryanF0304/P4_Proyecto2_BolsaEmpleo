// PuestoDTO.java
package com.una.bolsaempleo.dto;
import java.math.BigDecimal;
import java.util.List;
public record PuestoDTO(
        Long id,
        String descripcion,
        BigDecimal salario,
        String tipo,
        boolean activo,
        String empresaNombre,
        List<RequisitoDTO> requisitos) {

    public record RequisitoDTO(Integer caracteristicaId, String caracteristica, Integer nivel) {}
}