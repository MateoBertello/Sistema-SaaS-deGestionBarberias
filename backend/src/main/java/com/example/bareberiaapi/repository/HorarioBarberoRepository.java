package com.example.bareberiaapi.repository;

import com.example.bareberiaapi.entity.HorarioBarbero;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface HorarioBarberoRepository extends JpaRepository<HorarioBarbero, Long> {

    // Spring crea la query automáticamente basándose en este nombre
    Optional<HorarioBarbero> findByBarberoIdAndDiaSemana(Long barberoId, String diaSemana);
}