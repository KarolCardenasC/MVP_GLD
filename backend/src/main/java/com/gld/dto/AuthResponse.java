package com.gld.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private Long id;
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;
    private Long municipioId;
    private String municipioNombre;
}
