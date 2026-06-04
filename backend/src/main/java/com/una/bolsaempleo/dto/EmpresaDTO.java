// EmpresaDTO.java
package com.una.bolsaempleo.dto;
public record EmpresaDTO(Long id, String nombre, String correo,
                         String localizacion, String telefono, boolean aprobado) {}