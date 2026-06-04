// AdminController.java
package com.una.bolsaempleo.controller;

import com.una.bolsaempleo.dto.EmpresaDTO;
import com.una.bolsaempleo.dto.OferenteDTO;
import com.una.bolsaempleo.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/empresas/pendientes")
    public List<EmpresaDTO> empresasPendientes() {
        return adminService.empresasPendientes();
    }

    @PutMapping("/empresas/{id}/aprobar")
    public ResponseEntity<?> aprobarEmpresa(@PathVariable Long id) {
        adminService.aprobarEmpresa(id);
        return ResponseEntity.ok("Empresa aprobada");
    }

    @GetMapping("/oferentes/pendientes")
    public List<OferenteDTO> oferentesPendientes() {
        return adminService.oferentesPendientes();
    }

    @PutMapping("/oferentes/{id}/aprobar")
    public ResponseEntity<?> aprobarOferente(@PathVariable Long id) {
        adminService.aprobarOferente(id);
        return ResponseEntity.ok("Oferente aprobado");
    }
}