package com.example.bareberiaapi.controller;

import com.example.bareberiaapi.entity.HorarioBarbero;
import com.example.bareberiaapi.service.HorarioBarberoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/horarios")
public class HorarioBarberoController {
    @Autowired
    private HorarioBarberoService horarioService;

    @GetMapping
    public List<HorarioBarbero> listar() { return horarioService.listarTodos(); }

    @PostMapping
    public HorarioBarbero crear(@RequestBody HorarioBarbero horario) { return horarioService.guardar(horario); }
}