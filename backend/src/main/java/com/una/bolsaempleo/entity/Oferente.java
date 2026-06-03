// Oferente.java
package com.una.bolsaempleo.entity;
import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;

@Entity @Table(name = "oferente")
@Getter @Setter
public class Oferente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 30) private String identificacion;
    @Column(nullable = false, length = 100)               private String nombre;
    @Column(name = "primer_apellido", nullable = false, length = 100) private String primerApellido;
    @Column(length = 60)  private String nacionalidad;
    @Column(length = 30)  private String telefono;
    @Column(nullable = false, length = 150) private String correo;
    @Column(name = "lugar_residencia", length = 200) private String lugarResidencia;
    @Column(name = "curriculo_pdf", length = 255)    private String curriculoPdf;
}