package com.gld.repository;

import com.gld.model.HistorialEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistorialEstadoRepository extends JpaRepository<HistorialEstado, Long> {
    List<HistorialEstado> findBySolicitudIdOrderByFechaCambioAsc(Long solicitudId);
}
