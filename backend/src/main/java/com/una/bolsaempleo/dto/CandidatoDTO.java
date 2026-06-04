// CandidatoDTO.java  (resultado de la búsqueda de candidatos de la empresa)
package com.una.bolsaempleo.dto;
import java.util.List;
public record CandidatoDTO(
        Long id,
        String nombre,
        String primerApellido,
        String correo,
        boolean tieneCurriculo,
        List<HabilidadDTO> habilidades) {

    public record HabilidadDTO(String caracteristica, Integer nivel) {}
}