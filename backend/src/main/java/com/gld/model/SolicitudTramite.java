package com.gld.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitud_tramite")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudTramite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String folio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tramite_id", nullable = false)
    private Tramite tramite;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ciudadano_id", nullable = false)
    private Usuario ciudadano;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String estado = "EN_REVISION"; // EN_REVISION, EN_PROCESO, APROBADO, RECHAZADO, COMPLETADO

    @Column(name = "datos_formulario", columnDefinition = "TEXT")
    private String datosFormulario; // JSON string

    @Column(name = "fecha_solicitud")
    @Builder.Default
    private LocalDateTime fechaSolicitud = LocalDateTime.now();

    @Column(name = "fecha_estimada_resolucion")
    private LocalDate fechaEstimadaResolucion;

    @Column(columnDefinition = "TEXT")
    private String observaciones;
}
