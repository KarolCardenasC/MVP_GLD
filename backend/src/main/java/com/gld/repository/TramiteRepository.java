package com.gld.repository;

import com.gld.model.Tramite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TramiteRepository extends JpaRepository<Tramite, Long> {

    List<Tramite> findByMunicipioIdAndActivoTrue(Long municipioId);

    @Query("SELECT t FROM Tramite t WHERE t.activo = true AND t.municipio.id = :municipioId " +
           "AND (LOWER(t.nombre) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(t.categoria) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Tramite> buscarPorNombreOCategoria(@Param("municipioId") Long municipioId, @Param("query") String query);
}
