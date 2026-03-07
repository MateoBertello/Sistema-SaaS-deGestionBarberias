package com.example.bareberiaapi.controller;

import com.example.bareberiaapi.dto.AuthResponse;
import com.example.bareberiaapi.dto.LoginRequest;
import com.example.bareberiaapi.entity.Usuario;
import com.example.bareberiaapi.repository.UsuarioRepository;
import com.example.bareberiaapi.security.JwtUtil;
import com.example.bareberiaapi.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioService usuarioService;

    // Login para todos
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Usuario no encontrado\"}");
        }

        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasena())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Contraseña incorrecta\"}");
        }

        String token = jwtUtil.generarToken(usuario.getEmail(), usuario.getRol());
        AuthResponse response = new AuthResponse(token, usuario.getRol(), usuario.getId(), usuario.getNombre());
        return ResponseEntity.ok(response);
    }

    // Registro publico: siempre crea CLIENTE
    @PostMapping("/register")
    public ResponseEntity<?> registrarNuevoCliente(@RequestBody Usuario nuevoUsuario) {
        try {
            nuevoUsuario.setRol("CLIENTE");
            nuevoUsuario.setActivo(true);
            Usuario usuarioCreado = usuarioService.guardar(nuevoUsuario);
            return ResponseEntity.ok(usuarioCreado);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"Error al crear usuario. El email ya existe.\"}");
        }
    }

    // Crear staff (BARBERO o DUEÑO): requiere token JWT valido
    @PostMapping("/crear-staff")
    public ResponseEntity<?> crearStaff(@RequestBody Usuario nuevoUsuario) {
        try {
            String rol = nuevoUsuario.getRol();
            if (rol == null || (!rol.equals("BARBERO") && !rol.equals("DUEÑO"))) {
                return ResponseEntity.badRequest()
                        .body("{\"error\": \"Rol invalido. Use BARBERO o DUEÑO.\"}");
            }
            nuevoUsuario.setActivo(true);
            Usuario creado = usuarioService.guardar(nuevoUsuario);
            return ResponseEntity.ok(creado);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("{\"error\": \"Error al crear staff. El email ya existe.\"}");
        }
    }
}