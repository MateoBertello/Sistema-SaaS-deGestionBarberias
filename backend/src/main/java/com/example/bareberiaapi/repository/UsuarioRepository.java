package com.example.bareberiaapi.repository;

import com.example.bareberiaapi.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Magia de Spring: Busca por rol y que estén activos
    List<Usuario> findByRolAndActivoTrue(String rol);
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByActivoTrue();
}