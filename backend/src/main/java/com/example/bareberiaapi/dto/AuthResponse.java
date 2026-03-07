package com.example.bareberiaapi.dto;

public class AuthResponse {
    private String token;
    private String rol;
    private Long id;
    private String nombre;

    // Constructor
    public AuthResponse(String token, String rol, Long id, String nombre) {
        this.token = token;
        this.rol = rol;
        this.id = id;
        this.nombre = nombre;
    }

    // Getters
    public String getToken() { return token; }
    public String getRol() { return rol; }
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
}