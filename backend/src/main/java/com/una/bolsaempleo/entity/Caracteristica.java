// Caracteristica.java
package com.una.bolsaempleo.entity;
import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import java.util.List;

@Entity @Table(name = "caracteristica")
@Getter @Setter
public class Caracteristica {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")     // null = categoría raíz
    private Caracteristica parent;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    private List<Caracteristica> hijos;
}