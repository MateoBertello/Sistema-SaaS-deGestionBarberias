package com.example.bareberiaapi.service;

import com.example.bareberiaapi.dto.WalkInRequest;
import com.example.bareberiaapi.entity.Servicio;
import com.example.bareberiaapi.entity.Sucursal;
import com.example.bareberiaapi.entity.Turno;
import com.example.bareberiaapi.entity.Usuario;
import com.example.bareberiaapi.repository.ServicioRepository;
import com.example.bareberiaapi.repository.SucursalRepository;
import com.example.bareberiaapi.repository.TurnoRepository;
import com.example.bareberiaapi.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TurnoService {

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    public List<Turno> listarTodos() {
        return turnoRepository.findAll();
    }

    public List<Turno> turnosDelCliente(Long clienteId) {
        return turnoRepository.findByClienteId(clienteId);
    }

    public List<Turno> turnosDelBarbero(Long barberoId) {
        return turnoRepository.findByBarberoId(barberoId);
    }

    public Turno guardar(Turno turno) {
        validarSolapamiento(turno.getBarbero().getId(), turno);
        return turnoRepository.save(turno);
    }

    public Turno guardarWalkIn(WalkInRequest request) {
        Usuario barbero = usuarioRepository.findById(request.getBarberoId())
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));
        Servicio servicio = servicioRepository.findById(request.getServicioId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        Sucursal sucursal = sucursalRepository.findById(request.getSucursalId())
                .orElseThrow(() -> new RuntimeException("Sucursal no encontrada"));

        Turno turno = new Turno();
        turno.setNombreWalkin(request.getNombreWalkin());
        turno.setBarbero(barbero);
        turno.setServicio(servicio);
        turno.setSucursal(sucursal);
        turno.setFechaHoraInicio(request.getFechaHoraInicio());
        turno.setFechaHoraFin(request.getFechaHoraFin());
        turno.setEstado("PENDIENTE");
        turno.setCliente(null);

        validarSolapamiento(barbero.getId(), turno);
        return turnoRepository.save(turno);
    }

    private void validarSolapamiento(Long barberoId, Turno turno) {
        List<Turno> solapados = turnoRepository.findSolapados(
                barberoId,
                turno.getFechaHoraInicio(),
                turno.getFechaHoraFin()
        );
        if (!solapados.isEmpty()) {
            throw new RuntimeException("Lo sentimos, este horario acaba de ser reservado por alguien más.");
        }
    }

    public void cancelar(Long id) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));
        turno.setEstado("CANCELADO");
        turnoRepository.save(turno);
    }

    public void completar(Long id) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));
        turno.setEstado("COMPLETADO");
        turnoRepository.save(turno);
    }
}