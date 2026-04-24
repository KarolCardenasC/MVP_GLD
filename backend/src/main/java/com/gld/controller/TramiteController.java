package com.gld.controller;

import com.gld.dto.ApiResponse;
import com.gld.model.Tramite;
import com.gld.model.Usuario;
import com.gld.service.TramiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tramites")
@RequiredArgsConstructor
public class TramiteController {

    private final TramiteService tramiteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Tramite>>> listar(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam(required = false) String query) {

        Long municipioId = usuario.getMunicipio().getId();
        List<Tramite> tramites = tramiteService.buscar(municipioId, query);
        return ResponseEntity.ok(ApiResponse.ok(tramites));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Tramite>> obtener(@PathVariable Long id) {
        try {
            Tramite tramite = tramiteService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.ok(tramite));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
