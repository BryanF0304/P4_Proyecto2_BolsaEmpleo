// CaracteristicaDTO.java  (recursivo: una característica contiene sus hijas)
package com.una.bolsaempleo.dto;
import java.util.List;
public record CaracteristicaDTO(Integer id, String nombre, List<CaracteristicaDTO> hijos) {}