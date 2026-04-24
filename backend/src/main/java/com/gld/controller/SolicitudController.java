package com.gld.controller;

import com.gld.dto.*;
import com.gld.model.*;
import com.gld.service.SolicitudService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
public class SolicitudController {

    private final SolicitudService solicitudService;

    @PostMapping
    public ResponseEntity<ApiResponse<SolicitudTramite>> crear(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody SolicitudRequest request) {
        try {
            SolicitudTramite solicitud = solicitudService.crearSolicitud(usuario.getId(), request);
            return ResponseEntity.ok(ApiResponse.ok("Solicitud registrada. Folio: " + solicitud.getFolio(), solicitud));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SolicitudTramite>> actualizar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario,
            @RequestBody SolicitudRequest request) {
        try {
            SolicitudTramite solicitud = solicitudService.actualizarSolicitud(id, usuario.getId(), request);
            return ResponseEntity.ok(ApiResponse.ok("Solicitud actualizada", solicitud));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SolicitudTramite>>> listarMisSolicitudes(
            @AuthenticationPrincipal Usuario usuario) {
        List<SolicitudTramite> solicitudes = solicitudService.listarPorCiudadano(usuario.getId());
        return ResponseEntity.ok(ApiResponse.ok(solicitudes));
    }

    @GetMapping("/folio/{folio}")
    public ResponseEntity<ApiResponse<SolicitudTramite>> buscarPorFolio(@PathVariable String folio) {
        try {
            SolicitudTramite solicitud = solicitudService.buscarPorFolio(folio);
            return ResponseEntity.ok(ApiResponse.ok(solicitud));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}/historial")
    public ResponseEntity<ApiResponse<List<HistorialEstado>>> obtenerHistorial(@PathVariable Long id) {
        List<HistorialEstado> historial = solicitudService.obtenerHistorial(id);
        return ResponseEntity.ok(ApiResponse.ok(historial));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<SolicitudTramite>> cambiarEstado(
            @PathVariable Long id,
            @RequestBody CambioEstadoRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        try {
            SolicitudTramite solicitud = solicitudService.cambiarEstado(id, request, usuario.getId());
            return ResponseEntity.ok(ApiResponse.ok("Estado actualizado", solicitud));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/documentos")
    public ResponseEntity<ApiResponse<DocumentoAdjunto>> adjuntarDocumento(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "obligatorio", defaultValue = "true") boolean obligatorio) {
        try {
            DocumentoAdjunto doc = solicitudService.adjuntarDocumento(id, file, obligatorio);
            return ResponseEntity.ok(ApiResponse.ok("Documento adjuntado correctamente", doc));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Error al guardar el archivo"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}/documentos")
    public ResponseEntity<ApiResponse<List<DocumentoAdjunto>>> listarDocumentos(@PathVariable Long id) {
        List<DocumentoAdjunto> docs = solicitudService.listarDocumentos(id);
        return ResponseEntity.ok(ApiResponse.ok(docs));
    }
}
