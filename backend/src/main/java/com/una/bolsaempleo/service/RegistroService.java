// RegistroService.java
package com.una.bolsaempleo.service;

import com.una.bolsaempleo.dto.RegistroEmpresaRequest;
import com.una.bolsaempleo.dto.RegistroOferenteRequest;
import com.una.bolsaempleo.entity.*;
import com.una.bolsaempleo.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistroService {

    private final UsuarioRepository usuarioRepo;
    private final RolRepository rolRepo;
    private final EmpresaRepository empresaRepo;
    private final OferenteRepository oferenteRepo;
    private final PasswordEncoder passwordEncoder;

    public RegistroService(UsuarioRepository usuarioRepo, RolRepository rolRepo,
                           EmpresaRepository empresaRepo, OferenteRepository oferenteRepo,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.rolRepo = rolRepo;
        this.empresaRepo = empresaRepo;
        this.oferenteRepo = oferenteRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void registrarEmpresa(RegistroEmpresaRequest req) {
        if (usuarioRepo.existsByUsername(req.correo()))
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");

        Rol rol = rolRepo.findByNombre("EMPRESA").orElseThrow();
        Usuario u = new Usuario();
        u.setUsername(req.correo());
        u.setPassword(passwordEncoder.encode(req.password()));  // se guarda hasheada
        u.setRol(rol);
        u.setAprobado(false);                                    // pendiente de admin
        usuarioRepo.save(u);

        Empresa e = new Empresa();
        e.setUsuario(u);
        e.setNombre(req.nombre());
        e.setLocalizacion(req.localizacion());
        e.setCorreo(req.correo());
        e.setTelefono(req.telefono());
        e.setDescripcion(req.descripcion());
        empresaRepo.save(e);
    }

    @Transactional
    public void registrarOferente(RegistroOferenteRequest req) {
        if (usuarioRepo.existsByUsername(req.correo()))
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");

        Rol rol = rolRepo.findByNombre("OFERENTE").orElseThrow();
        Usuario u = new Usuario();
        u.setUsername(req.correo());
        u.setPassword(passwordEncoder.encode(req.password()));
        u.setRol(rol);
        u.setAprobado(false);
        usuarioRepo.save(u);

        Oferente o = new Oferente();
        o.setUsuario(u);
        o.setIdentificacion(req.identificacion());
        o.setNombre(req.nombre());
        o.setPrimerApellido(req.primerApellido());
        o.setNacionalidad(req.nacionalidad());
        o.setTelefono(req.telefono());
        o.setCorreo(req.correo());
        o.setLugarResidencia(req.lugarResidencia());
        oferenteRepo.save(o);
    }
}