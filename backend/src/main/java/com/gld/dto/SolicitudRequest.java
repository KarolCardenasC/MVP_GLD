package com.gld.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudRequest {

    @NotNull(message = "El trámite es obligatorio")
    private Long tramiteId;

    private String datosFormulario; // JSON string with form data

    private String estado; // BORRADOR, EN_REVISION, etc.

    private String observaciones;
}
