package com.gld.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CambioEstadoRequest {
    private String nuevoEstado;
    private String observaciones;
}
