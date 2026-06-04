// CrearPuestoRequest.java
package com.una.bolsaempleo.dto;
import java.math.BigDecimal;
import java.util.List;
public record CrearPuestoRequest(
        String descripcion,
        BigDecimal salario,
        String tipo,                       // "PUBLICO" o "PRIVADO"
        List<CaracteristicaNivel> caracteristicas) {

    // característica requerida + nivel deseado
    public record CaracteristicaNivel(Integer caracteristicaId, Integer nivel) {}
}