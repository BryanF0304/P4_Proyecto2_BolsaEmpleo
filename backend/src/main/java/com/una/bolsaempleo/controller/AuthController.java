package com.una.bolsaempleo.controller;

import com.una.bolsaempleo.dto.LoginRequest;
import com.una.bolsaempleo.dto.LoginResponse;
import com.una.bolsaempleo.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Verifica usuario + clave + que esté aprobado; falla con excepción si no
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));

            String rol = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst().orElse("ROLE_DESCONOCIDO")
                    .replace("ROLE_", "");

            String token = jwtService.generarToken(request.username(), rol);
            return ResponseEntity.ok(new LoginResponse(token, request.username(), rol));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Credenciales inválidas o usuario no aprobado");
        }
    }
}