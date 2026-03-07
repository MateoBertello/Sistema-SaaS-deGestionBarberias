package com.example.bareberiaapi.repository;

import com.example.bareberiaapi.entity.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

public interface TurnoRepository extends JpaRepository<Turno, Long> {
    // Revisa si el barbero ya tiene un turno asignado a esa hora exacta
    boolean existsByBarberoIdAndFechaHoraInicio(Long barberoId, LocalDateTime fechaHoraInicio);
}