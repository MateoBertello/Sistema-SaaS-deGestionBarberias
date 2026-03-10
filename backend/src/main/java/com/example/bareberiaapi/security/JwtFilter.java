package com.example.bareberiaapi.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.validarToken(token)) {
                String email = jwtUtil.extraerEmail(token);
                String rol = jwtUtil.extraerRol(token);

                System.out.println(">>> ROL EXTRAÍDO: [" + rol + "]");
                System.out.println(">>> BYTES: " + Arrays.toString(rol.getBytes(StandardCharsets.UTF_8)));

                // Spring Security necesita el rol con prefijo "ROLE_"
                // Por eso si el rol es "BARBERO", acá queda "ROLE_BARBERO"
                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority("ROLE_" + rol);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(authority)  // ahora sí le pasamos el rol
                        );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}