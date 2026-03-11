package com.example.bareberiaapi.repository;

import com.example.bareberiaapi.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByRolAndActivoTrue(String rol);
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByActivoTrue();

    @Query("SELECT COUNT(u) > 0 FROM Usuario u WHERE u.rol = :rol")
    boolean existsByRol(@Param("rol") String rol);
}