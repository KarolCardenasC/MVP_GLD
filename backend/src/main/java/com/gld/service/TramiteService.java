package com.gld.service;

import com.gld.model.Tramite;
import com.gld.repository.TramiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TramiteService {

    private final TramiteRepository tramiteRepository;

    public List<Tramite> listarPorMunicipio(Long municipioId) {
        return tramiteRepository.findByMunicipioIdAndActivoTrue(municipioId);
    }

    public List<Tramite> buscar(Long municipioId, String query) {
        if (query == null || query.isBlank()) {
            return listarPorMunicipio(municipioId);
        }
        return tramiteRepository.buscarPorNombreOCategoria(municipioId, query);
    }

    public Tramite obtenerPorId(Long id) {
        return tramiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trámite no encontrado"));
    }
}
