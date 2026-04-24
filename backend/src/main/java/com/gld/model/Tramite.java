package com.gld.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tramite")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tramite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String requisitos;

    @Column(length = 100)
    private String categoria;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal costo = BigDecimal.ZERO;

    @Column(name = "dias_habiles_estimados")
    @Builder.Default
    private Integer diasHabilesEstimados = 5;

    @Column(name = "requiere_pago")
    @Builder.Default
    private Boolean requierePago = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "municipio_id")
    private Municipio municipio;
}
