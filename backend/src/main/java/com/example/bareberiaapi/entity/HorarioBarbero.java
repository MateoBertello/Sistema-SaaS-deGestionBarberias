package com.example.bareberiaapi.entity;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "horarios_barberos")
public class HorarioBarbero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "barbero_id")
    private Usuario barbero;

    @ManyToOne
    @JoinColumn(name = "sucursal_id")
    private Sucursal sucursal;

    @Column(name = "dia_semana")
    private String diaSemana; // Guardar como: LONDAY, TUESDAY, WEDNESDAY, etc.

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    private LocalTime horaFin;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Usuario getBarbero() { return barbero; }
    public void setBarbero(Usuario barbero) { this.barbero = barbero; }
    public Sucursal getSucursal() { return sucursal; }
    public void setSucursal(Sucursal sucursal) { this.sucursal = sucursal; }
    public String getDiaSemana() { return diaSemana; }
    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }
    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }
    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }
}