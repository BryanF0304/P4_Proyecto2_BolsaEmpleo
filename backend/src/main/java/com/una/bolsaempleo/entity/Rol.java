package com.una.bolsaempleo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity                         // le dice a JPA que esta clase es una tabla
@Table(name = "rol")            // nombre exacto de la tabla
@Getter @Setter                 // Lombok genera getters y setters
public class Rol {

    @Id                                                 // llave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT de MySQL
    private Integer id;

    @Column(nullable = false, unique = true, length = 20)
    private String nombre;
}