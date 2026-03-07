package com.example.bareberiaapi.controller;

import com.example.bareberiaapi.dto.UsuarioDTO;
import com.example.bareberiaapi.entity.Usuario;
import com.example.bareberiaapi.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Solo DUENO puede ver todos los usuarios (controlado en SecurityConfig)
    @GetMapping
    public List<UsuarioDTO> listar() {
        return usuarioService.listarTodos()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Cualquier usuario autenticado puede ver los barberos activos
    // Lo necesita el BookingWizard cuando un CLIENTE quiere reservar
    @GetMapping("/barberos")
    public List<UsuarioDTO> listarBarberos() {
        return usuarioService.listarBarberosActivos()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public UsuarioDTO crear(@RequestBody Usuario usuario) {
        Usuario creado = usuarioService.guardar(usuario);
        return toDTO(creado);
    }

    // Solo DUENO puede eliminar (controlado en SecurityConfig)
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
    }

    private UsuarioDTO toDTO(Usuario u) {
        return new UsuarioDTO(
                u.getId(),
                u.getNombre(),
                u.getEmail(),
                u.getTelefono(),
                u.getRol(),
                u.getActivo()
        );
    }
}