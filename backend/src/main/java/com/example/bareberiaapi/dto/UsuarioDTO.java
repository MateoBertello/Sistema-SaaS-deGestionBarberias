package com.example.bareberiaapi.dto;

// Este DTO define exactamente qué datos del usuario
// se devuelven en las respuestas. El campo "contrasena" NO está,
// así nunca se expone el hash BCrypt al frontend.
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private String rol;
    private Boolean activo;

    // Constructor
    public UsuarioDTO(Long id, String nombre, String email,
                      String telefono, String rol, Boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.rol = rol;
        this.activo = activo;
    }

    // Getters
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getTelefono() { return telefono; }
    public String getRol() { return rol; }
    public Boolean getActivo() { return activo; }
}