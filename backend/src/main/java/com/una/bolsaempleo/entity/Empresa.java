// Empresa.java
package com.una.bolsaempleo.entity;
import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;

@Entity @Table(name = "empresa")
@Getter @Setter
public class Empresa {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false, length = 150) private String nombre;
    @Column(length = 200)                   private String localizacion;
    @Column(nullable = false, length = 150) private String correo;
    @Column(length = 30)                    private String telefono;
    @Column(columnDefinition = "TEXT")      private String descripcion;
}