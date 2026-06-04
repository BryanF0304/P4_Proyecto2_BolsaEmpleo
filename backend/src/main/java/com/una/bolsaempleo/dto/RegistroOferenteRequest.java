
package com.una.bolsaempleo.dto;
public record RegistroOferenteRequest(
        String identificacion, String nombre, String primerApellido,
        String nacionalidad, String telefono, String correo,
        String lugarResidencia, String password) {}