// Puesto.java
package com.una.bolsaempleo.entity;
import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "puesto")
@Getter @Setter
public class Puesto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @Column(nullable = false, length = 500) private String descripcion;
    @Column(precision = 12, scale = 2)      private BigDecimal salario;
    @Column(nullable = false, length = 10)  private String tipo = "PUBLICO";
    @Column(nullable = false)               private Boolean activo = true;
    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro = LocalDateTime.now();
}