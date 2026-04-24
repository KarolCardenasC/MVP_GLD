package com.gld.repository;

import com.gld.model.SolicitudTramite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SolicitudTramiteRepository extends JpaRepository<SolicitudTramite, Long> {
    Optional<SolicitudTramite> findByFolio(String folio);
    List<SolicitudTramite> findByCiudadanoIdOrderByFechaSolicitudDesc(Long ciudadanoId);
}
