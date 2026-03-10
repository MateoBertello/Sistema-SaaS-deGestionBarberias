package com.example.bareberiaapi.controller;

import com.example.bareberiaapi.dto.WalkInRequest;
import com.example.bareberiaapi.entity.Turno;
import com.example.bareberiaapi.service.TurnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turnos")
public class TurnoController {

    @Autowired
    private TurnoService turnoService;

    @GetMapping
    public List<Turno> listarTurnos(
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) Long barberoId
    ) {
        if (clienteId != null) return turnoService.turnosDelCliente(clienteId);
        if (barberoId != null) return turnoService.turnosDelBarbero(barberoId);
        return turnoService.listarTodos();
    }

    @PostMapping
    public Turno crear(@RequestBody Turno turno) {
        return turnoService.guardar(turno);
    }

    @PostMapping("/walkin")
    public Turno crearWalkIn(@RequestBody WalkInRequest request) {
        return turnoService.guardarWalkIn(request);
    }

    @PutMapping("/{id}/estado")
    public void cambiarEstado(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String estado = body.get("estado");
        if ("COMPLETADO".equals(estado)) {
            turnoService.completar(id);
        } else if ("CANCELADO".equals(estado)) {
            turnoService.cancelar(id);
        }
    }

    @DeleteMapping("/{id}")
    public void cancelarTurno(@PathVariable Long id) {
        turnoService.cancelar(id);
    }
}