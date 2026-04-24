package com.gld.service;

import com.gld.model.SolicitudTramite;
import com.gld.model.Usuario;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    public void enviarFolioCiudadano(Usuario ciudadano, SolicitudTramite solicitud) {
        String asunto = "Confirmación de Solicitud - Folio: " + solicitud.getFolio();
        String mensaje = String.format(
            "Estimado/a %s %s,\n\n" +
            "Su solicitud para el trámite '%s' ha sido registrada exitosamente.\n" +
            "Su número de folio para seguimiento es: %s\n" +
            "Estado actual: %s\n\n" +
            "Puede hacer seguimiento de su solicitud a través de nuestro portal web.\n\n" +
            "Atentamente,\n" +
            "Alcaldía Municipal - Ventanilla Única de Trámites",
            ciudadano.getNombre(), ciudadano.getApellido(),
            solicitud.getTramite().getNombre(),
            solicitud.getFolio(),
            solicitud.getEstado().replace("_", " ")
        );

        simularEnvio(ciudadano.getCorreo(), asunto, mensaje);
    }

    public void enviarNotificacionCambioEstado(Usuario ciudadano, SolicitudTramite solicitud, String nuevoEstado, String observaciones) {
        String asunto = "Actualización de Solicitud - Folio: " + solicitud.getFolio();
        String obsTexto = (observaciones != null && !observaciones.isBlank()) ? "\nObservaciones del funcionario: " + observaciones : "";
        
        String mensaje = String.format(
            "Estimado/a %s %s,\n\n" +
            "El estado de su trámite '%s' (Folio: %s) ha sido actualizado.\n" +
            "Nuevo estado: %s\n%s\n\n" +
            "Para más detalles, por favor ingrese a su portal ciudadano.\n\n" +
            "Atentamente,\n" +
            "Alcaldía Municipal - Ventanilla Única de Trámites",
            ciudadano.getNombre(), ciudadano.getApellido(),
            solicitud.getTramite().getNombre(),
            solicitud.getFolio(),
            nuevoEstado.replace("_", " "),
            obsTexto
        );

        simularEnvio(ciudadano.getCorreo(), asunto, mensaje);
    }

    private void simularEnvio(String destinatario, String asunto, String mensaje) {
        log.info("\n=======================================================");
        log.info("📧 SIMULADOR DE CORREO ELECTRÓNICO (EMAIL SERVICE)");
        log.info("=======================================================");
        log.info("Para: {}", destinatario);
        log.info("Asunto: {}", asunto);
        log.info("-------------------------------------------------------");
        log.info("Mensaje:\n{}", mensaje);
        log.info("=======================================================\n");
    }
}
