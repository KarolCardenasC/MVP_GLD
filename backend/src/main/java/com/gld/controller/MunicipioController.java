package com.gld.controller;

import com.gld.dto.ApiResponse;
import com.gld.model.Municipio;
import com.gld.repository.MunicipioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/municipios")
@RequiredArgsConstructor
public class MunicipioController {

    private final MunicipioRepository municipioRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Municipio>>> listar() {
        List<Municipio> municipios = municipioRepository.findByActivoTrue();
        return ResponseEntity.ok(ApiResponse.ok(municipios));
    }
}
