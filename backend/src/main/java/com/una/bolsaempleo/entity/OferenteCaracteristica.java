
package com.una.bolsaempleo.entity;
import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;

@Entity @Table(name = "oferente_caracteristica")
@Getter @Setter
public class OferenteCaracteristica {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "oferente_id", nullable = false)
    private Oferente oferente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "caracteristica_id", nullable = false)
    private Caracteristica caracteristica;

    @Column(nullable = false) private Integer nivel;
}