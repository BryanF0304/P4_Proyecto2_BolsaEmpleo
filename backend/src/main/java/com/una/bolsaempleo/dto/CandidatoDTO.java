// CandidatoDTO.java  (resultado de la búsqueda de candidatos de la empresa)
package com.una.bolsaempleo.dto;
import java.util.List;
public record CandidatoDTO(
        Long   id,
        String identificacion,
        String nombre,
        String primerApellido,
        String nacionalidad,
        String telefono,
        String correo,
        String lugarResidencia,
        boolean tieneCurriculo,
        List<HabilidadDTO> habilidades) {

    public record HabilidadDTO(String caracteristica, Integer nivel) {}
}