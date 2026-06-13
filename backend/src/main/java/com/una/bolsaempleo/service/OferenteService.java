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
import java.util.List;

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

    // Resuelve la carpeta de uploads de forma portable (relativa al directorio de trabajo)
    private Path carpetaUploads() {
        return Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    // Devuelve las habilidades actuales del oferente logueado
    @Transactional(readOnly = true)
    public List<HabilidadRequest.Habilidad> getMisHabilidades() {
        Oferente o = oferenteActual();
        return ocRepo.findByOferenteId(o.getId()).stream()
                .map(h -> new HabilidadRequest.Habilidad(
                        h.getCaracteristica().getId(),
                        h.getNivel()))
                .toList();
    }

    // Reemplaza por completo las habilidades del oferente por la lista enviada
    @Transactional
    public void actualizarHabilidades(HabilidadRequest req) {
        Oferente o = oferenteActual();

        ocRepo.deleteAll(ocRepo.findByOferenteId(o.getId()));

        if (req.habilidades() != null) {
            for (var h : req.habilidades()) {
                Caracteristica c = caracteristicaRepo.findById(h.caracteristicaId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Caracteristica no existe: " + h.caracteristicaId()));
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
            throw new IllegalArgumentException("El archivo esta vacio");
        if (!"application/pdf".equals(archivo.getContentType()))
            throw new IllegalArgumentException("Solo se permiten archivos PDF");

        Oferente o = oferenteActual();

        Path carpeta = carpetaUploads();
        Files.createDirectories(carpeta);   // crea la carpeta si no existe

        String nombreArchivo = "cv_oferente_" + o.getId() + ".pdf";
        Path destino = carpeta.resolve(nombreArchivo);
        Files.write(destino, archivo.getBytes()); // compatible con Spring Boot jar

        o.setCurriculoPdf(nombreArchivo);
    }

    // Devuelve la ruta del PDF de un oferente (para que la empresa lo descargue)
    @Transactional(readOnly = true)
    public Path rutaCurriculo(Long oferenteId) {
        Oferente o = oferenteRepo.findById(oferenteId)
                .orElseThrow(() -> new IllegalArgumentException("Oferente no encontrado"));
        if (o.getCurriculoPdf() == null)
            throw new IllegalArgumentException("Ese oferente no ha subido curriculo");
        Path ruta = carpetaUploads().resolve(o.getCurriculoPdf());
        if (!Files.exists(ruta))
            throw new IllegalArgumentException("El archivo del curriculo no se encontro en el servidor");
        return ruta;
    }
}