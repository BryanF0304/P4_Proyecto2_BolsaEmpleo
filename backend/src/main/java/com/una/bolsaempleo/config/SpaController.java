package com.una.bolsaempleo.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Fallback controller: cualquier ruta no-API devuelve index.html
 * para que el enrutamiento del lado del cliente (React) funcione
 * al hacer refresh o acceder directamente a una URL.
 */
@Controller
public class SpaController {

    @RequestMapping(value = {
            "/",
            "/buscar",
            "/empresa",
            "/oferente",
            "/admin",
            "/reg-empresa",
            "/reg-oferente"
    })
    public String spa() {
        return "forward:/index.html";
    }
}
