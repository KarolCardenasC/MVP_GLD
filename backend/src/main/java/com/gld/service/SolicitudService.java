package com.gld.service;

import com.gld.dto.CambioEstadoRequest;
import com.gld.dto.SolicitudRequest;
import com.gld.model.*;
import com.gld.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SolicitudService {

    private final SolicitudTramiteRepository solicitudRepository;
    private final TramiteRepository tramiteRepository;
    private final UsuarioRepository usuarioRepository;
    private final DocumentoAdjuntoRepository documentoRepository;
    private final HistorialEstadoRepository historialRepository;
    private final NotificacionService notificacionService;
    private final EmailService emailService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Transactional
    public SolicitudTramite crearSolicitud(Long ciudadanoId, SolicitudRequest request) {
        Usuario ciudadano = usuarioRepository.findById(ciudadanoId)
                .orElseThrow(() -> new RuntimeException("Ciudadano no encontrado"));

        Tramite tramite = tramiteRepository.findById(request.getTramiteId())
                .orElseThrow(() -> new RuntimeException("Trámite no encontrado"));

        String folio = generarFolio();
        LocalDate fechaEstimada = LocalDate.now().plusDays(tramite.getDiasHabilesEstimados());
        String estadoInicial = (request.getEstado() != null) ? request.getEstado() : "EN_REVISION";

        SolicitudTramite solicitud = SolicitudTramite.builder()
                .folio(folio)
                .tramite(tramite)
                .ciudadano(ciudadano)
                .estado(estadoInicial)
                .datosFormulario(request.getDatosFormulario())
                .fechaSolicitud(LocalDateTime.now())
                .fechaEstimadaResolucion(fechaEstimada)
                .observaciones(request.getObservaciones())
                .build();

        solicitud = solicitudRepository.save(solicitud);

        HistorialEstado historial = HistorialEstado.builder()
                .solicitud(solicitud)
                .estadoAnterior(null)
                .estadoNuevo(estadoInicial)
                .observaciones(estadoInicial.equals("BORRADOR") ? "Borrador guardado" : "Solicitud registrada exitosamente")
                .fechaCambio(LocalDateTime.now())
                .build();
        historialRepository.save(historial);

        if (!"BORRADOR".equals(estadoInicial)) {
            notificacionService.crearNotificacion(
                    ciudadano,
                    solicitud,
                    "Solicitud registrada",
                    "Su solicitud para el trámite '" + tramite.getNombre() + "' ha sido registrada con el folio " + folio + ". Estado: " + estadoInicial
            );
            emailService.enviarFolioCiudadano(ciudadano, solicitud);
        }

        return solicitud;
    }

    @Transactional
    public SolicitudTramite actualizarSolicitud(Long solicitudId, Long ciudadanoId, SolicitudRequest request) {
        SolicitudTramite solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        if (!solicitud.getCiudadano().getId().equals(ciudadanoId)) {
            throw new RuntimeException("No tiene permisos para modificar esta solicitud");
        }

        if (!"BORRADOR".equals(solicitud.getEstado())) {
            throw new RuntimeException("Solo se pueden modificar solicitudes en estado BORRADOR");
        }

        solicitud.setDatosFormulario(request.getDatosFormulario());
        
        String nuevoEstado = (request.getEstado() != null) ? request.getEstado() : solicitud.getEstado();
        boolean estadoCambio = !nuevoEstado.equals(solicitud.getEstado());
        
        solicitud.setEstado(nuevoEstado);
        solicitud = solicitudRepository.save(solicitud);

        if (estadoCambio) {
            HistorialEstado historial = HistorialEstado.builder()
                    .solicitud(solicitud)
                    .estadoAnterior("BORRADOR")
                    .estadoNuevo(nuevoEstado)
                    .observaciones("Solicitud enviada para revisión")
                    .fechaCambio(LocalDateTime.now())
                    .build();
            historialRepository.save(historial);

            if (!"BORRADOR".equals(nuevoEstado)) {
                notificacionService.crearNotificacion(
                        solicitud.getCiudadano(),
                        solicitud,
                        "Solicitud registrada",
                        "Su solicitud para el trámite '" + solicitud.getTramite().getNombre() + "' ha sido enviada a revisión con el folio " + solicitud.getFolio()
                );
                emailService.enviarFolioCiudadano(solicitud.getCiudadano(), solicitud);
            }
        }

        return solicitud;
    }

    public SolicitudTramite buscarPorFolio(String folio) {
        return solicitudRepository.findByFolio(folio)
                .orElseThrow(() -> new RuntimeException("No se encontró una solicitud con el folio: " + folio));
    }

    public List<SolicitudTramite> listarPorCiudadano(Long ciudadanoId) {
        return solicitudRepository.findByCiudadanoIdOrderByFechaSolicitudDesc(ciudadanoId);
    }

    public List<HistorialEstado> obtenerHistorial(Long solicitudId) {
        return historialRepository.findBySolicitudIdOrderByFechaCambioAsc(solicitudId);
    }

    @Transactional
    public SolicitudTramite cambiarEstado(Long solicitudId, CambioEstadoRequest request, Long funcionarioId) {
        SolicitudTramite solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        Usuario funcionario = null;
        if (funcionarioId != null) {
            funcionario = usuarioRepository.findById(funcionarioId).orElse(null);
        }

        String estadoAnterior = solicitud.getEstado();
        solicitud.setEstado(request.getNuevoEstado());
        solicitud = solicitudRepository.save(solicitud);

        HistorialEstado historial = HistorialEstado.builder()
                .solicitud(solicitud)
                .estadoAnterior(estadoAnterior)
                .estadoNuevo(request.getNuevoEstado())
                .observaciones(request.getObservaciones())
                .funcionario(funcionario)
                .fechaCambio(LocalDateTime.now())
                .build();
        historialRepository.save(historial);

        notificacionService.crearNotificacion(
                solicitud.getCiudadano(),
                solicitud,
                "Estado actualizado: " + request.getNuevoEstado(),
                "Su trámite con folio " + solicitud.getFolio() + " cambió de estado a '" +
                        request.getNuevoEstado() + "'. " +
                        (request.getObservaciones() != null ? "Observaciones: " + request.getObservaciones() : "")
        );

        emailService.enviarNotificacionCambioEstado(solicitud.getCiudadano(), solicitud, request.getNuevoEstado(), request.getObservaciones());

        return solicitud;
    }

    @Transactional
    public DocumentoAdjunto adjuntarDocumento(Long solicitudId, MultipartFile file, boolean obligatorio) throws IOException {
        SolicitudTramite solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        // Validate file type
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ?
                originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toUpperCase() : "";

        if (!List.of("PDF", "JPG", "PNG").contains(extension)) {
            throw new RuntimeException("Formato no permitido. Solo se aceptan PDF, JPG y PNG.");
        }

        // Validate size (10MB max)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("El archivo excede el tamaño máximo permitido de 10MB.");
        }

        // Save file
        Path uploadPath = Paths.get(uploadDir, solicitud.getFolio());
        Files.createDirectories(uploadPath);

        String fileName = UUID.randomUUID() + "." + extension.toLowerCase();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        DocumentoAdjunto documento = DocumentoAdjunto.builder()
                .solicitud(solicitud)
                .nombreArchivo(originalFilename)
                .tipoArchivo(extension)
                .rutaArchivo(filePath.toString())
                .obligatorio(obligatorio)
                .tamanoBytes(file.getSize())
                .fechaCarga(LocalDateTime.now())
                .build();

        return documentoRepository.save(documento);
    }

    public List<DocumentoAdjunto> listarDocumentos(Long solicitudId) {
        return documentoRepository.findBySolicitudId(solicitudId);
    }

    private String generarFolio() {
        String prefix = "GLD";
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%04d", (int) (Math.random() * 10000));
        return prefix + "-" + date + "-" + random;
    }
}
