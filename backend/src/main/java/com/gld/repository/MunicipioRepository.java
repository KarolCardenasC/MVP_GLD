package com.gld.repository;

import com.gld.model.Municipio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MunicipioRepository extends JpaRepository<Municipio, Long> {
    List<Municipio> findByActivoTrue();
}
