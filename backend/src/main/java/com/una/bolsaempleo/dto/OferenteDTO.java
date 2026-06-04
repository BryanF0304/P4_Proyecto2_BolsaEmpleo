// OferenteDTO.java
package com.una.bolsaempleo.dto;
public record OferenteDTO(Long id, String identificacion, String nombre,
                          String primerApellido, String correo, boolean aprobado) {}