-- ============================================================
-- Bolsa de Empleo - EIF209 - Script de Base de Datos
-- ============================================================
DROP DATABASE IF EXISTS bolsa_empleo;
CREATE DATABASE bolsa_empleo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bolsa_empleo;

-- ---------- Roles ----------
CREATE TABLE rol (
                     id     INT AUTO_INCREMENT PRIMARY KEY,
                     nombre VARCHAR(20) NOT NULL UNIQUE        -- ADMIN, EMPRESA, OFERENTE
) ENGINE=InnoDB;

-- ---------- Usuario (credenciales para los 3 roles) ----------
CREATE TABLE usuario (
                         id       BIGINT AUTO_INCREMENT PRIMARY KEY,
                         username VARCHAR(120) NOT NULL UNIQUE,     -- correo (empresa/oferente) o identificacion (admin)
                         password VARCHAR(255) NOT NULL,            -- hash BCrypt
                         rol_id   INT NOT NULL,
                         aprobado BOOLEAN NOT NULL DEFAULT FALSE,   -- el admin aprueba empresas y oferentes
                         CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES rol(id)
) ENGINE=InnoDB;

-- ---------- Empresa ----------
CREATE TABLE empresa (
                         id           BIGINT AUTO_INCREMENT PRIMARY KEY,
                         usuario_id   BIGINT NOT NULL UNIQUE,
                         nombre       VARCHAR(150) NOT NULL,
                         localizacion VARCHAR(200),
                         correo       VARCHAR(150) NOT NULL,
                         telefono     VARCHAR(30),
                         descripcion  TEXT,
                         CONSTRAINT fk_empresa_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB;

-- ---------- Oferente ----------
CREATE TABLE oferente (
                          id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                          usuario_id       BIGINT NOT NULL UNIQUE,
                          identificacion   VARCHAR(30) NOT NULL UNIQUE,
                          nombre           VARCHAR(100) NOT NULL,
                          primer_apellido  VARCHAR(100) NOT NULL,
                          nacionalidad     VARCHAR(60),
                          telefono         VARCHAR(30),
                          correo           VARCHAR(150) NOT NULL,
                          lugar_residencia VARCHAR(200),
                          curriculo_pdf    VARCHAR(255),             -- nombre/ruta del PDF subido
                          CONSTRAINT fk_oferente_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB;

-- ---------- Caracteristica (jerarquica) ----------
CREATE TABLE caracteristica (
                                id        INT AUTO_INCREMENT PRIMARY KEY,
                                nombre    VARCHAR(100) NOT NULL,
                                parent_id INT NULL,                         -- NULL = categoria raiz
                                CONSTRAINT fk_caract_parent FOREIGN KEY (parent_id) REFERENCES caracteristica(id)
) ENGINE=InnoDB;

-- ---------- Puesto ----------
CREATE TABLE puesto (
                        id             BIGINT AUTO_INCREMENT PRIMARY KEY,
                        empresa_id     BIGINT NOT NULL,
                        descripcion    VARCHAR(500) NOT NULL,
                        salario        DECIMAL(12,2),
                        tipo           VARCHAR(10) NOT NULL DEFAULT 'PUBLICO',  -- PUBLICO / PRIVADO
                        activo         BOOLEAN NOT NULL DEFAULT TRUE,           -- desactivar puesto
                        fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- para "5 mas recientes"
                        CONSTRAINT fk_puesto_empresa FOREIGN KEY (empresa_id) REFERENCES empresa(id)
) ENGINE=InnoDB;

CREATE TABLE puesto_caracteristica (
                                       id                BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       puesto_id         BIGINT NOT NULL,
                                       caracteristica_id INT NOT NULL,
                                       nivel             INT NOT NULL,
                                       UNIQUE KEY uq_puesto_caract (puesto_id, caracteristica_id),
                                       CONSTRAINT fk_pc_puesto FOREIGN KEY (puesto_id) REFERENCES puesto(id),
                                       CONSTRAINT fk_pc_caract  FOREIGN KEY (caracteristica_id) REFERENCES caracteristica(id)
) ENGINE=InnoDB;

CREATE TABLE oferente_caracteristica (
                                         id                BIGINT AUTO_INCREMENT PRIMARY KEY,
                                         oferente_id       BIGINT NOT NULL,
                                         caracteristica_id INT NOT NULL,
                                         nivel             INT NOT NULL,
                                         UNIQUE KEY uq_oferente_caract (oferente_id, caracteristica_id),
                                         CONSTRAINT fk_oc_oferente FOREIGN KEY (oferente_id) REFERENCES oferente(id),
                                         CONSTRAINT fk_oc_caract    FOREIGN KEY (caracteristica_id) REFERENCES caracteristica(id)
) ENGINE=InnoDB;

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Roles
INSERT INTO rol (id, nombre) VALUES (1,'ADMIN'), (2,'EMPRESA'), (3,'OFERENTE');

-- Usuario administrador. username = admin, password = admin123 (hash BCrypt)
INSERT INTO usuario (username, password, rol_id, aprobado) VALUES
    ('admin', '$2b$10$ZYRe8Iz8O2.L7Zz/i0rnaeM/27I3aSaP5YbeZYGIzt6agS5ofpzNa', 1, TRUE);

-- Caracteristicas jerarquicas (categorias raiz y sus hijas)
INSERT INTO caracteristica (id, nombre, parent_id) VALUES
                                                       (1, 'Bases de Datos', NULL),
                                                       (2, 'Ciberseguridad', NULL),
                                                       (3, 'Lenguajes de programacion', NULL),
                                                       (4, 'Tecnologias Web', NULL),
                                                       (5, 'Testing', NULL),
                                                       -- hijas de Lenguajes de programacion (3)
                                                       (6, 'C#', 3), (7, 'Java', 3), (8, 'Kotlin', 3), (9, 'Python', 3),
                                                       -- hijas de Tecnologias Web (4)
                                                       (10, 'HTML', 4), (11, 'CSS', 4), (12, 'JavaScript', 4),
                                                       -- hijas de Testing (5)
                                                       (13, 'Assertions', 5), (14, 'JUnit', 5);