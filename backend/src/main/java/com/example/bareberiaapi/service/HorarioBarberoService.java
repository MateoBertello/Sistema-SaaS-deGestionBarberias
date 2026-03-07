package com.example.bareberiaapi.service;

import com.example.bareberiaapi.entity.HorarioBarbero;
import com.example.bareberiaapi.repository.HorarioBarberoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HorarioBarberoService {
    @Autowired
    private HorarioBarberoRepository horarioRepository;

    public List<HorarioBarbero> listarTodos() { return horarioRepository.findAll(); }
    public HorarioBarbero guardar(HorarioBarbero horario) { return horarioRepository.save(horario); }
}