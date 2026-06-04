// HabilidadRequest.java  (lista de habilidades que el oferente registra/actualiza)
package com.una.bolsaempleo.dto;
import java.util.List;
public record HabilidadRequest(List<Habilidad> habilidades) {
    public record Habilidad(Integer caracteristicaId, Integer nivel) {}
}