package com.gld.service;

import com.gld.config.JwtUtil;
import com.gld.dto.*;
import com.gld.model.Municipio;
import com.gld.model.Usuario;
import com.gld.repository.MunicipioRepository;
import com.gld.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final MunicipioRepository municipioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        Municipio municipio = municipioRepository.findById(request.getMunicipioId())
                .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .correo(request.getCorreo())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .rol("CIUDADANO")
                .municipio(municipio)
                .verificado(true)
                .activo(true)
                .build();

        usuario = usuarioRepository.save(usuario);

        String token = jwtUtil.generateToken(usuario.getCorreo(), usuario.getRol(), usuario.getId());

        return AuthResponse.builder()
                .token(token)
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .correo(usuario.getCorreo())
                .rol(usuario.getRol())
                .municipioId(municipio.getId())
                .municipioNombre(municipio.getNombre())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        if (!usuario.getActivo()) {
            throw new RuntimeException("La cuenta está desactivada");
        }

        String token = jwtUtil.generateToken(usuario.getCorreo(), usuario.getRol(), usuario.getId());

        return AuthResponse.builder()
                .token(token)
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .correo(usuario.getCorreo())
                .rol(usuario.getRol())
                .municipioId(usuario.getMunicipio() != null ? usuario.getMunicipio().getId() : null)
                .municipioNombre(usuario.getMunicipio() != null ? usuario.getMunicipio().getNombre() : null)
                .build();
    }
}
