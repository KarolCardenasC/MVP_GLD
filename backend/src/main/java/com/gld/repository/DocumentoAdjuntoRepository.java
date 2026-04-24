package com.gld.repository;

import com.gld.model.DocumentoAdjunto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentoAdjuntoRepository extends JpaRepository<DocumentoAdjunto, Long> {
    List<DocumentoAdjunto> findBySolicitudId(Long solicitudId);
}
