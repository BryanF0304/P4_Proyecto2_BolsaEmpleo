// CrearCaracteristicaRequest.java  (parentId null = categoría raíz)
package com.una.bolsaempleo.dto;
public record CrearCaracteristicaRequest(String nombre, Integer parentId) {}