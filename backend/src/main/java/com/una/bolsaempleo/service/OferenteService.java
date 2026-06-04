package com.una.bolsaempleo.service;

import com.una.bolsaempleo.dto.HabilidadRequest;
import com.una.bolsaempleo.entity.*;
import com.una.bolsaempleo.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class OferenteService {

    private final OferenteRepository oferenteRepo;
    private final OferenteCaracteristicaRepository ocRepo;
    private final CaracteristicaRepository caracteristicaRepo;

    @Value("${app.upload-dir}")
    private String uploadDir;

    public OferenteService(OferenteRepository oferenteRepo, OferenteCaracteristicaRepository ocRepo,
                           CaracteristicaRepository caracteristicaRepo) {
        this.oferenteRepo = oferenteRepo;
        this.ocRepo = ocRepo;
        this.caracteristicaRepo = caracteristicaRepo;
    }

    private Oferente oferenteActual() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return oferenteRepo.findByUsuario_Username(username)
                .orElseThrow(() -> new IllegalStateException("El usuario logueado no es un oferente"));
    }

    // Reemplaza por completo las habilidades del oferente por la lista enviada
    @Transactional
    public void actualizarHabilidades(HabilidadRequest req) {
        Oferente o = oferenteActual();

        // borrar las anteriores y volver a insertar (forma simple y segura)
        ocRepo.deleteAll(ocRepo.findByOferenteId(o.getId()));

        if (req.habilidades() != null) {
            for (var h : req.habilidades()) {
                Caracteristica c = caracteristicaRepo.findById(h.caracteristicaId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Característica no existe: " + h.caracteristicaId()));
                OferenteCaracteristica oc = new OferenteCaracteristica();
                oc.setOferente(o);
                oc.setCaracteristica(c);
                oc.setNivel(h.nivel());
                ocRepo.save(oc);
            }
        }
    }

    // Guarda el PDF en disco y registra su nombre en la BD
    @Transactional
    public void subirCurriculo(MultipartFile archivo) throws IOException {
        if (archivo.isEmpty())
            throw new IllegalArgumentException("El archivo está vacío");
        if (!"application/pdf".equals(archivo.getContentType()))
            throw new IllegalArgumentException("Solo se permiten archivos PDF");

        Oferente o = oferenteActual();

        Path carpeta = Paths.get(uploadDir);
        Files.createDirectories(carpeta);                       // crea uploads/cv si no existe

        String nombreArchivo = "cv_oferente_" + o.getId() + ".pdf";
        Path destino = carpeta.resolve(nombreArchivo);
        archivo.transferTo(destino.toAbsolutePath());           // escribe el PDF

        o.setCurriculoPdf(nombreArchivo);                       // guarda la referencia
    }

    // Devuelve la ruta del PDF de un oferente (para que la empresa lo descargue)
    @Transactional(readOnly = true)
    public Path rutaCurriculo(Long oferenteId) {
        Oferente o = oferenteRepo.findById(oferenteId)
                .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado"));
        if (o.getCurriculoPdf() == null)
            throw new IllegalArgumentException("Ese oferente no ha subido currículo");
        return Paths.get(uploadDir).resolve(o.getCurriculoPdf());
    }
}