package com.example.bareberiaapi.controller;

import com.example.bareberiaapi.entity.Turno;
import com.example.bareberiaapi.service.TurnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/turnos")
public class TurnoController {

    @Autowired
    private TurnoService turnoService;

    @GetMapping
    public List<Turno> listar() {
        return turnoService.listarTodos();
    }

    @PostMapping
    public Turno crear(@RequestBody Turno turno) {
        return turnoService.guardar(turno);
    }

    // El PUT arreglado llamando al Service
    @PutMapping("/{id}/estado")
    public Turno actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return turnoService.actualizarEstado(id, body.get("estado"));
    }
}