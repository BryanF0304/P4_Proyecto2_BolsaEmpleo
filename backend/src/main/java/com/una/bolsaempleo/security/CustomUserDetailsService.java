package com.una.bolsaempleo.security;

import com.una.bolsaempleo.entity.Usuario;
import com.una.bolsaempleo.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario u = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // El rol se vuelve una autoridad con prefijo ROLE_ (convención de Spring)
        var authority = new SimpleGrantedAuthority("ROLE_" + u.getRol().getNombre());

        return User.builder()
                .username(u.getUsername())
                .password(u.getPassword())          // ya viene hasheada con BCrypt
                .authorities(List.of(authority))
                .disabled(!u.getAprobado())          // sin aprobar = no puede entrar
                .build();
    }
}