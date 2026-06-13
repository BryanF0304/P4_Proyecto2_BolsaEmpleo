-- ============================================================
-- Bolsa de Empleo - EIF209 - Script PostgreSQL
-- Base de datos: bolsa-empleo-db
-- ============================================================

-- ---------- Roles ----------
CREATE TABLE IF NOT EXISTS rol (
                                   id     SERIAL PRIMARY KEY,
                                   nombre VARCHAR(20) NOT NULL UNIQUE
    );

-- ---------- Usuario ----------
CREATE TABLE IF NOT EXISTS usuario (
                                       id       BIGSERIAL PRIMARY KEY,
                                       username VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id   INT NOT NULL,
    aprobado BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES rol(id)
    );

-- ---------- Empresa ----------
CREATE TABLE IF NOT EXISTS empresa (
                                       id           BIGSERIAL PRIMARY KEY,
                                       usuario_id   BIGINT NOT NULL UNIQUE,
                                       nombre       VARCHAR(150) NOT NULL,
    localizacion VARCHAR(200),
    correo       VARCHAR(150) NOT NULL,
    telefono     VARCHAR(30),
    descripcion  TEXT,
    CONSTRAINT fk_empresa_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    );

-- ---------- Oferente ----------
CREATE TABLE IF NOT EXISTS oferente (
                                        id               BIGSERIAL PRIMARY KEY,
                                        usuario_id       BIGINT NOT NULL UNIQUE,
                                        identificacion   VARCHAR(30) NOT NULL UNIQUE,
    nombre           VARCHAR(100) NOT NULL,
    primer_apellido  VARCHAR(100) NOT NULL,
    nacionalidad     VARCHAR(60),
    telefono         VARCHAR(30),
    correo           VARCHAR(150) NOT NULL,
    lugar_residencia VARCHAR(200),
    curriculo_pdf    VARCHAR(255),
    CONSTRAINT fk_oferente_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    );

-- ---------- Caracteristica (jerarquica) ----------
CREATE TABLE IF NOT EXISTS caracteristica (
                                              id        SERIAL PRIMARY KEY,
                                              nombre    VARCHAR(100) NOT NULL,
    parent_id INT NULL,
    CONSTRAINT fk_caract_parent FOREIGN KEY (parent_id) REFERENCES caracteristica(id)
    );

-- ---------- Puesto ----------
CREATE TABLE IF NOT EXISTS puesto (
                                      id             BIGSERIAL PRIMARY KEY,
                                      empresa_id     BIGINT NOT NULL,
                                      descripcion    VARCHAR(500) NOT NULL,
    salario        DECIMAL(12,2),
    tipo           VARCHAR(10) NOT NULL DEFAULT 'PUBLICO',
    activo         BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_puesto_empresa FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    );

CREATE TABLE IF NOT EXISTS puesto_caracteristica (
                                                     id                BIGSERIAL PRIMARY KEY,
                                                     puesto_id         BIGINT NOT NULL,
                                                     caracteristica_id INT NOT NULL,
                                                     nivel             INT NOT NULL,
                                                     UNIQUE (puesto_id, caracteristica_id),
    CONSTRAINT fk_pc_puesto FOREIGN KEY (puesto_id) REFERENCES puesto(id),
    CONSTRAINT fk_pc_caract FOREIGN KEY (caracteristica_id) REFERENCES caracteristica(id)
    );

CREATE TABLE IF NOT EXISTS oferente_caracteristica (
                                                       id                BIGSERIAL PRIMARY KEY,
                                                       oferente_id       BIGINT NOT NULL,
                                                       caracteristica_id INT NOT NULL,
                                                       nivel             INT NOT NULL,
                                                       UNIQUE (oferente_id, caracteristica_id),
    CONSTRAINT fk_oc_oferente FOREIGN KEY (oferente_id) REFERENCES oferente(id),
    CONSTRAINT fk_oc_caract   FOREIGN KEY (caracteristica_id) REFERENCES caracteristica(id)
    );

-- ============================================================
-- DATOS INICIALES
-- ============================================================

INSERT INTO rol (id, nombre) VALUES (1,'ADMIN'), (2,'EMPRESA'), (3,'OFERENTE')
    ON CONFLICT DO NOTHING;

-- Usuario admin: username=admin, password=admin123
INSERT INTO usuario (username, password, rol_id, aprobado) VALUES
    ('admin', '$2b$10$ZYRe8Iz8O2.L7Zz/i0rnaeM/27I3aSaP5YbeZYGIzt6agS5ofpzNa', 1, TRUE)
    ON CONFLICT DO NOTHING;

INSERT INTO caracteristica (id, nombre, parent_id) VALUES
                                                       (1, 'Bases de Datos', NULL),
                                                       (2, 'Ciberseguridad', NULL),
                                                       (3, 'Lenguajes de programacion', NULL),
                                                       (4, 'Tecnologias Web', NULL),
                                                       (5, 'Testing', NULL),
                                                       (6, 'C#', 3), (7, 'Java', 3), (8, 'Kotlin', 3), (9, 'Python', 3),
                                                       (10, 'HTML', 4), (11, 'CSS', 4), (12, 'JavaScript', 4),
                                                       (13, 'Assertions', 5), (14, 'JUnit', 5)
    ON CONFLICT DO NOTHING;