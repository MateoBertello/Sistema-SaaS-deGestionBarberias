package com.example.bareberiaapi.service;

import com.example.bareberiaapi.entity.Turno;
import com.example.bareberiaapi.repository.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TurnoService {

    @Autowired
    private TurnoRepository turnoRepository;


    public List<Turno> listarTodos() {
        return turnoRepository.findAll();
    }


    public Turno guardar(Turno turno) {
        return turnoRepository.save(turno);
    }


    public Turno actualizarEstado(Long id, String nuevoEstado) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));
        turno.setEstado(nuevoEstado);
        return turnoRepository.save(turno);
    }
}