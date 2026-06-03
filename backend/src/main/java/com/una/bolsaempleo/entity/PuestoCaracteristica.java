// PuestoCaracteristica.java
package com.una.bolsaempleo.entity;
import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;

@Entity @Table(name = "puesto_caracteristica")
@Getter @Setter
public class PuestoCaracteristica {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "puesto_id", nullable = false)
    private Puesto puesto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "caracteristica_id", nullable = false)
    private Caracteristica caracteristica;

    @Column(nullable = false) private Integer nivel;
}