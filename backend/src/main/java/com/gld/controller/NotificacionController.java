package com.gld.controller;

import com.gld.dto.ApiResponse;
import com.gld.model.Notificacion;
import com.gld.model.Usuario;
import com.gld.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notificacion>>> listar(@AuthenticationPrincipal Usuario usuario) {
        List<Notificacion> notificaciones = notificacionService.listarPorUsuario(usuario.getId());
        return ResponseEntity.ok(ApiResponse.ok(notificaciones));
    }

    @GetMapping("/no-leidas")
    public ResponseEntity<ApiResponse<Map<String, Long>>> contarNoLeidas(@AuthenticationPrincipal Usuario usuario) {
        long count = notificacionService.contarNoLeidas(usuario.getId());
        return ResponseEntity.ok(ApiResponse.ok(Map.of("count", count)));
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<ApiResponse<Notificacion>> marcarComoLeida(@PathVariable Long id) {
        try {
            Notificacion notificacion = notificacionService.marcarComoLeida(id);
            return ResponseEntity.ok(ApiResponse.ok("Notificación marcada como leída", notificacion));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
