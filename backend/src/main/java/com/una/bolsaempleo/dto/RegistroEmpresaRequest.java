// RegistroEmpresaRequest.java
package com.una.bolsaempleo.dto;
public record RegistroEmpresaRequest(
        String nombre, String localizacion, String correo,
        String telefono, String descripcion, String password) {}