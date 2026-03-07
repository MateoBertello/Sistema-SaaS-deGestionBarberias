package com.example.bareberiaapi.repository;

import com.example.bareberiaapi.entity.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SucursalRepository extends JpaRepository<Sucursal, Long> {}