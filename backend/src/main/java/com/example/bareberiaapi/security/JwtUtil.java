package com.example.bareberiaapi.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // El secret ahora viene de application.properties, no está hardcodeado
    @Value("${jwt.secret}")
    private String secret;

    private static final long EXPIRATION_TIME = 86400000; // 24 horas

    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Genera el token con email y rol
    public String generarToken(String email, String rol) {
        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Lee el email del token
    public String extraerEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Lee el rol del token
    public String extraerRol(String token) {
        return (String) Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("rol");
    }

    // Verifica si el token es válido y no está vencido
    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}