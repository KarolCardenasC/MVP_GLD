package com.gld.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documento_adjunto")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentoAdjunto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitud_id", nullable = false)
    private SolicitudTramite solicitud;

    @Column(name = "nombre_archivo", nullable = false)
    private String nombreArchivo;

    @Column(name = "tipo_archivo", nullable = false, length = 10)
    private String tipoArchivo; // PDF, JPG, PNG

    @Column(name = "ruta_archivo", nullable = false, length = 500)
    private String rutaArchivo;

    @Column(nullable = false)
    @Builder.Default
    private Boolean obligatorio = true;

    @Column(name = "tamano_bytes")
    private Long tamanoBytes;

    @Column(name = "fecha_carga")
    @Builder.Default
    private LocalDateTime fechaCarga = LocalDateTime.now();
}
